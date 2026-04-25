"use client";

import { useState, useEffect, FormEvent } from "react";

type Opener = { angle: string; line: string; why: string };
type Research = {
  profile?: {
    name?: string;
    firstName?: string;
    headline?: string;
    currentRole?: string;
    currentCompany?: string;
    location?: string;
    publicHandle?: string;
    summary?: string;
  };
  posts?: Array<{ text?: string; link?: string; type?: string }>;
  company?: {
    name?: string;
    industry?: string;
    description?: string;
    sizeRange?: number[];
    funding?: Array<{ type?: string; raised?: number; year?: number }>;
    recentUpdates?: string[];
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

  const [linkedinUrl, setLinkedinUrl] = useState("");
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

    const trimmedUrl = linkedinUrl.trim();
    const hasUrl = trimmedUrl.includes("linkedin.com/in/");
    const hasNotes = extraNotes.trim().length > 0;

    if (!yourOffer.trim()) {
      setError("Tell us what you sell — one short line.");
      return;
    }
    if (!hasUrl && !hasNotes) {
      setError("Paste a LinkedIn URL (linkedin.com/in/...) or some notes about the prospect.");
      return;
    }

    let researchPayload: Research | null = null;

    if (hasUrl) {
      setStage("researching");
      try {
        const res = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkedinUrl: trimmedUrl }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          if (!hasNotes) {
            setError(body.error || "Couldn't research that profile. Try pasting the URL again or add some notes below.");
            setStage("idle");
            return;
          }
          // Has notes fallback — continue without research
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
          fallbackProspect: hasNotes ? extraNotes : undefined,
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
          <p className="eyebrow mb-2">Step 1 · Your prospect&apos;s LinkedIn</p>
          <input
            className="input"
            placeholder="https://linkedin.com/in/sarah-chen-revops"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />
          <p className="mt-2 text-xs text-[color:var(--muted)]">
            We pull their profile, recent posts, and what their company has been up to. Public data only.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-2">Step 2 · What you sell</p>
          <input
            className="input"
            placeholder="e.g. AI pipeline review for RevOps teams"
            value={yourOffer}
            onChange={(e) => setYourOffer(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="eyebrow mb-2">Step 3 · Anything else (optional)</p>
          <textarea
            className="input"
            placeholder="A quote you noticed, a podcast they were on, an internal trigger event you know about — anything we couldn't get from LinkedIn."
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
              {stage === "researching" ? "Researching the prospect…" : "Writing your openers…"}
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
            {(researchSummary || research?.profile?.name) && (
              <div className="card">
                <p className="eyebrow mb-2">What we found</p>
                <h3 className="text-lg font-semibold tracking-[-0.01em]">
                  {research?.profile?.name || "Prospect"}
                  {research?.profile?.currentRole && ` · ${research.profile.currentRole}`}
                  {research?.profile?.currentCompany && ` @ ${research.profile.currentCompany}`}
                </h3>
                {researchSummary && (
                  <p className="mt-2 text-[color:var(--muted-soft)] leading-relaxed">
                    <span className="text-white font-medium">Strongest signal — </span>{researchSummary}
                  </p>
                )}
                {(research?.posts && research.posts.length > 0) && (
                  <p className="mt-3 text-xs text-[color:var(--muted)]">
                    Source: {research.posts.length} recent post{research.posts.length === 1 ? "" : "s"}
                    {research.company?.recentUpdates && research.company.recentUpdates.length > 0 ? ` + ${research.company.recentUpdates.length} company update${research.company.recentUpdates.length === 1 ? "" : "s"}` : ""}
                    {research.company?.funding && research.company.funding.length > 0 ? ` + funding history` : ""}
                  </p>
                )}
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
