"use client";

import { useState, useEffect, FormEvent } from "react";

type Opener = { angle: string; line: string; why: string };
type Research = {
  company?: {
    name?: string;
    website?: string;
    description?: string;
    industries?: string[];
    employeeCount?: number;
    foundedYear?: number;
    type?: string;
    hq?: string;
    keyExecutives?: Array<{ name?: string; title?: string }>;
  } | null;
  employee?: {
    name?: string;
    firstName?: string;
    headline?: string;
    currentRole?: string;
    currentCompany?: string;
    location?: string;
    summary?: string;
    linkedinUrl?: string;
    tenureRoles?: Array<{ title?: string; company?: string; start?: string; end?: string }>;
  } | null;
};

const ANGLE_LABEL: Record<string, string> = {
  trigger_led: "Trigger-led",
  peer_led: "Peer-led",
  problem_led: "Problem-led",
};

export default function OpenerTool() {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState("");

  const [companyWebsite, setCompanyWebsite] = useState("");
  const [prospectFirstName, setProspectFirstName] = useState("");
  const [prospectRole, setProspectRole] = useState("");
  const [yourOffer, setYourOffer] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const [stage, setStage] = useState<"idle" | "researching" | "generating" | "done">("idle");
  const [research, setResearch] = useState<Research | null>(null);
  const [openers, setOpeners] = useState<Opener[]>([]);
  const [researchSummary, setResearchSummary] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ms_lead");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed?.email) {
        setEmail(parsed.email);
        setFirstName(parsed.firstName || "");
        setUnlocked(true);
      }
    } catch {}
  }, []);

  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    setUnlockError("");
    if (!email.includes("@")) {
      setUnlockError("Need a real work email.");
      return;
    }
    setUnlockLoading(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, source: "opener-generator" }),
      });
    } catch {
      // non-blocking
    } finally {
      setUnlockLoading(false);
      setUnlocked(true);
      try {
        localStorage.setItem("ms_lead", JSON.stringify({ email, firstName, ts: Date.now() }));
      } catch {}
    }
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setError("");
    setOpeners([]);
    setResearch(null);
    setResearchSummary("");

    const trimmedWebsite = companyWebsite.trim();
    const hasNotes = extraNotes.trim().length > 0;

    if (!yourOffer.trim()) {
      setError("Tell us what you sell — one short line.");
      return;
    }
    if (!trimmedWebsite && !hasNotes) {
      setError("Drop the prospect's company website (e.g. acme.com), or paste some notes about them.");
      return;
    }

    let researchPayload: Research | null = null;

    if (trimmedWebsite) {
      setStage("researching");
      try {
        const res = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyWebsite: trimmedWebsite,
            prospectFirstName: prospectFirstName.trim(),
            prospectRole: prospectRole.trim(),
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          if (!hasNotes) {
            setError(body.error || "Couldn't research that company. Add some notes below and try again.");
            setStage("idle");
            return;
          }
        } else {
          const data = await res.json();
          researchPayload = data.research as Research;
          setResearch(researchPayload);
        }
      } catch (err) {
        if (!hasNotes) {
          setError(err instanceof Error ? err.message : "Research call failed.");
          setStage("idle");
          return;
        }
      }
    }

    setStage("generating");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          research: researchPayload,
          yourOffer,
          fallbackProspect: hasNotes
            ? `${prospectFirstName ? "Name: " + prospectFirstName + ". " : ""}${prospectRole ? "Role: " + prospectRole + ". " : ""}${extraNotes}`
            : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Generator hit an error.");
      }
      const data = await res.json();
      setOpeners(data.openers || []);
      setResearchSummary(data.researchSummary || "");
      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something broke.");
      setStage("idle");
    }
  }

  if (!unlocked) {
    return (
      <div className="card max-w-xl mx-auto">
        <p className="eyebrow mb-3">Unlock the tool · 10 seconds</p>
        <h2 className="text-2xl font-bold tracking-[-0.02em]">Where should we send the playbook?</h2>
        <p className="mt-3 text-[color:var(--muted-soft)] leading-relaxed">
          One email gets you unlimited openers, the Cold Call Opener cheat sheet, and a follow-up on day 3
          with how the top reps in the cohort use this tool.
        </p>
        <form onSubmit={handleUnlock} className="mt-6 space-y-3">
          <input
            type="text"
            placeholder="First name (optional)"
            className="input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="you@yourcompany.com"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {unlockError && <p className="text-sm text-red-300">{unlockError}</p>}
          <button type="submit" className="btn-primary w-full justify-center" disabled={unlockLoading}>
            {unlockLoading ? "Unlocking…" : "Unlock the generator"} <span aria-hidden>→</span>
          </button>
          <p className="text-xs text-[color:var(--muted)] text-center mt-3">
            No spam. One welcome email, one follow-up, then quiet.
          </p>
        </form>
      </div>
    );
  }

  const isLoading = stage === "researching" || stage === "generating";

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
      <form onSubmit={handleGenerate} className="card space-y-5">
        <div>
          <p className="eyebrow mb-2">Step 1 · Their company</p>
          <input
            className="input"
            placeholder="acme.com"
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
          />
          <p className="mt-2 text-xs text-[color:var(--muted)]">
            We pull what their company does, headcount, key execs, and recent moves.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-2">Step 2 · The prospect (optional but better)</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="First name"
              value={prospectFirstName}
              onChange={(e) => setProspectFirstName(e.target.value)}
            />
            <input
              className="input"
              placeholder="Their role"
              value={prospectRole}
              onChange={(e) => setProspectRole(e.target.value)}
            />
          </div>
          <p className="mt-2 text-xs text-[color:var(--muted)]">
            With both, we pull their profile too — tenure, prior roles, headline.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-2">Step 3 · What you sell</p>
          <input
            className="input"
            placeholder="e.g. AI pipeline review for RevOps teams"
            value={yourOffer}
            onChange={(e) => setYourOffer(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="eyebrow mb-2">Step 4 · Anything else (optional)</p>
          <textarea
            className="input"
            placeholder="A LinkedIn post they wrote, a podcast they were on, fresh news, an internal trigger — anything that'll sharpen the opener."
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-300">{error}</p>}

        <button type="submit" className="btn-primary w-full justify-center" disabled={isLoading}>
          {stage === "researching" ? "Pulling research…" :
           stage === "generating" ? "Writing your openers…" :
           "Generate 3 openers"} <span aria-hidden>→</span>
        </button>
        <p className="text-xs text-[color:var(--muted)] text-center">
          Takes 8–15 seconds. Nothing about your prospect is stored.
        </p>
      </form>

      <div className="space-y-4">
        {stage === "idle" && openers.length === 0 && (
          <div className="card">
            <p className="eyebrow mb-3">Output</p>
            <h3 className="text-xl font-semibold tracking-[-0.01em]">3 tailored openers will land here.</h3>
            <p className="mt-3 text-[color:var(--muted-soft)] leading-relaxed">
              Each opener arrives with the angle and the tactical reason it works. Use one as-is, or remix to your voice.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="card">
            <p className="eyebrow mb-3">
              {stage === "researching" ? "Researching the company…" : "Writing your openers…"}
            </p>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="opener-card animate-pulse">
                  <div className="h-3 w-24 bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/10 rounded mt-3" />
                  <div className="h-4 w-4/5 bg-white/10 rounded mt-2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === "done" && openers.length > 0 && (
          <>
            {(researchSummary || research?.company?.name || research?.employee?.name) && (
              <div className="card">
                <p className="eyebrow mb-2">What we found</p>
                <h3 className="text-lg font-semibold tracking-[-0.01em]">
                  {research?.employee?.name || research?.company?.name || "Prospect"}
                  {research?.employee?.currentRole && ` · ${research.employee.currentRole}`}
                  {research?.employee?.currentCompany && ` @ ${research.employee.currentCompany}`}
                  {!research?.employee && research?.company?.name && research?.company?.industries?.[0] && ` · ${research.company.industries[0]}`}
                </h3>
                {researchSummary && (
                  <p className="mt-2 text-[color:var(--muted-soft)] leading-relaxed">
                    <span className="text-white font-medium">Strongest signal — </span>{researchSummary}
                  </p>
                )}
                <p className="mt-3 text-xs text-[color:var(--muted)]">
                  Source: {[
                    research?.company && "company details",
                    research?.employee && "prospect profile",
                  ].filter(Boolean).join(" + ") || "manual notes"}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <p className="eyebrow">Your openers · {openers.length}</p>
              <button
                onClick={() => {
                  const text = openers
                    .map((o, i) => `${i + 1}. [${ANGLE_LABEL[o.angle] || o.angle}]\n${o.line}\n— Why: ${o.why}`)
                    .join("\n\n");
                  navigator.clipboard.writeText(text);
                }}
                className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)] hover:text-white transition-colors"
              >
                Copy all
              </button>
            </div>
            {openers.map((o, i) => (
              <div key={i} className="opener-card">
                <div className="text-[11px] tracking-[0.2em] uppercase font-semibold" style={{color: "#A892FF"}}>
                  {ANGLE_LABEL[o.angle] || o.angle}
                </div>
                <p className="mt-3 text-[17px] leading-relaxed">{o.line}</p>
                <div className="divider my-5" />
                <p className="text-sm text-[color:var(--muted-soft)]"><span className="text-white font-medium">Why it works — </span>{o.why}</p>
              </div>
            ))}

            {/* Soft, non-pushy cohort lead-in */}
            <div className="card">
              <p className="eyebrow mb-2">If these worked</p>
              <p className="text-[color:var(--muted-soft)] leading-relaxed">
                The framework that wrote these is the same one taught in the 4-week Modern Seller cohort —
                with the rest of the call (discovery, objections, close) layered on top.
              </p>
              <div className="mt-4">
                <a href="https://modernseller.ai" className="btn-ghost">
                  Take a look at the cohort <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
