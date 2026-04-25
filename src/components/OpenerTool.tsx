"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

type Opener = {
  angle: string;
  freshness: string;
  trigger: string;
  trigger_date?: string;
  source?: string;
  line: string;
  why: string;
};

const ANGLE_LABEL: Record<string, string> = {
  trigger_led: "Trigger-led",
  peer_led: "Peer-led",
  problem_led: "Problem-led",
};

// Loading stages — driven by elapsed seconds (not bar %), so labels keep
// rotating even after the bar slows toward the asymptote.
const LOADING_STAGES = [
  { afterMs: 0,     label: "Searching the live web for fresh signals…" },
  { afterMs: 7000,  label: "Reading their recent company news…" },
  { afterMs: 14000, label: "Looking up the prospect by name…" },
  { afterMs: 22000, label: "Verifying source dates…" },
  { afterMs: 32000, label: "Picking the sharpest trigger…" },
  { afterMs: 42000, label: "Writing your openers in voice…" },
  { afterMs: 55000, label: "Finalizing — almost there…" },
];

// Asymptotic curve: progress = 1 - exp(-elapsed / TIMECONSTANT).
// Always moves, never reaches 100% until we snap it on response.
// At t=20s → 67%, t=40s → 89%, t=60s → 96%, t=80s → 99%.
// No "jammed at 95%" feel — the bar keeps creeping forever.
const TIMECONSTANT_MS = 18000;
const PROGRESS_CEILING = 0.99;

export default function OpenerTool() {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState("");

  const [companyWebsite, setCompanyWebsite] = useState("");
  const [prospectFirstName, setProspectFirstName] = useState("");
  const [prospectLastName, setProspectLastName] = useState("");
  const [prospectRole, setProspectRole] = useState("");
  const [yourOffer, setYourOffer] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const [generating, setGenerating] = useState(false);
  const [openers, setOpeners] = useState<Opener[]>([]);
  const [researchSummary, setResearchSummary] = useState("");
  const [error, setError] = useState("");

  // Loading bar state
  const [progress, setProgress] = useState(0);
  const [stageLabel, setStageLabel] = useState(LOADING_STAGES[0].label);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!generating) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now();
    setProgress(0);
    setStageLabel(LOADING_STAGES[0].label);
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      // Asymptotic — keeps moving, never reaches 1.0 until we snap on response.
      const ratio = Math.min(1 - Math.exp(-elapsed / TIMECONSTANT_MS), PROGRESS_CEILING);
      setProgress(ratio);
      const stage = [...LOADING_STAGES].reverse().find((s) => elapsed >= s.afterMs);
      if (stage) setStageLabel(stage.label);
      // Keep ticking — even at 99%, we want sub-percent motion to look alive.
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [generating]);

  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    setUnlockError("");
    if (!firstName.trim()) {
      setUnlockError("Need your first name.");
      return;
    }
    if (!email.includes("@")) {
      setUnlockError("Need a real work email.");
      return;
    }
    setUnlockLoading(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), firstName: firstName.trim(), source: "opener-generator" }),
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
    setResearchSummary("");

    const trimmedFirstName = prospectFirstName.trim();
    const trimmedLastName = prospectLastName.trim();
    const trimmedWebsite = companyWebsite.trim();
    const hasNotes = extraNotes.trim().length > 0;

    if (!trimmedFirstName || !trimmedLastName) {
      setError("Need the prospect's first AND last name — the last name lets us research the actual person.");
      return;
    }
    if (!yourOffer.trim()) {
      setError("Tell us what you sell — one short line.");
      return;
    }
    if (!trimmedWebsite && !hasNotes) {
      setError("Drop the prospect's company website (e.g. acme.com), or paste some notes about them.");
      return;
    }

    setGenerating(true);
    const ctrl = new AbortController();
    const watchdog = setTimeout(() => ctrl.abort(), 75_000);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          yourOffer,
          prospect: {
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            role: prospectRole.trim() || undefined,
            companyWebsite: trimmedWebsite || undefined,
          },
          fallbackProspect: hasNotes ? extraNotes : undefined,
        }),
      });
      clearTimeout(watchdog);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Generator hit an error.");
      }
      const data = await res.json();
      setOpeners(data.openers || []);
      setResearchSummary(data.researchSummary || "");
      // Snap the bar to 100% before tearing it down — feels good
      setProgress(1);
      setStageLabel("Done.");
      setTimeout(() => setGenerating(false), 250);
    } catch (err) {
      clearTimeout(watchdog);
      const msg = err instanceof Error ? err.message : "Something broke.";
      setError(
        msg.includes("abort")
          ? "That took longer than 75 seconds. The web search may be slow right now — try again."
          : msg
      );
      setGenerating(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="card max-w-xl mx-auto">
        <p className="eyebrow mb-3">Access the tool · 10 seconds</p>
        <h2 className="text-2xl font-bold tracking-[-0.02em]">You&apos;re one step away.</h2>
        <p className="mt-3 text-[color:var(--muted-soft)] leading-relaxed">
          Drop your name and email below to unlock unlimited openers.
        </p>
        <form onSubmit={handleUnlock} className="mt-6 space-y-3">
          <input
            type="text"
            required
            placeholder="First name"
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
            {unlockLoading ? "Unlocking…" : "Unlock the tool"} <span aria-hidden>→</span>
          </button>
        </form>
      </div>
    );
  }

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
            Just the domain. We use this to research recent news, posts, and funding.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-2">Step 2 · The prospect</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="First name"
              value={prospectFirstName}
              onChange={(e) => setProspectFirstName(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Last name"
              value={prospectLastName}
              onChange={(e) => setProspectLastName(e.target.value)}
              required
            />
          </div>
          <input
            className="input mt-3"
            placeholder="Their role (optional, e.g. Head of RevOps)"
            value={prospectRole}
            onChange={(e) => setProspectRole(e.target.value)}
          />
          <p className="mt-2 text-xs text-[color:var(--muted)]">
            Full name lets us research the actual person, not just their company.
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

        <button type="submit" className="btn-primary w-full justify-center" disabled={generating}>
          {generating ? "Working…" : "Generate 3 openers"} <span aria-hidden>→</span>
        </button>
        <p className="text-xs text-[color:var(--muted)] text-center">
          Takes 30–60 seconds. We&apos;re searching live sources. Nothing is stored.
        </p>
      </form>

      <div className="space-y-4">
        {!generating && openers.length === 0 && !error && (
          <div className="card">
            <p className="eyebrow mb-3">Output</p>
            <h3 className="text-xl font-semibold tracking-[-0.01em]">3 tailored openers will land here.</h3>
            <p className="mt-3 text-[color:var(--muted-soft)] leading-relaxed">
              Each opener arrives with the angle, the trigger we found, the source URL,
              and the tactical reason it works. Use one as-is, or remix to your voice.
            </p>
          </div>
        )}

        {generating && (
          <div className="card">
            <p className="eyebrow mb-3">{stageLabel}</p>
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-150 ease-linear"
                style={{
                  width: `${Math.round(progress * 100)}%`,
                  background: "linear-gradient(90deg, #5AA1FF 0%, #8D7BFF 50%, #C68FFF 100%)",
                }}
              />
            </div>
            <p className="mt-3 text-xs text-[color:var(--muted)]">
              Live web search · {Math.round(progress * 100)}%
            </p>
            <div className="space-y-3 mt-6">
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

        {!generating && openers.length > 0 && (
          <>
            {researchSummary && (
              <div className="card">
                <p className="eyebrow mb-2">What we found</p>
                <p className="text-[color:var(--muted-soft)] leading-relaxed">
                  <span className="text-white font-medium">Strongest signal — </span>{researchSummary}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <p className="eyebrow">Your openers · {openers.length}</p>
              <button
                onClick={() => {
                  const text = openers
                    .map((o, i) =>
                      `${i + 1}. [${ANGLE_LABEL[o.angle] || o.angle} · ${o.freshness}]\n${o.line}\n— Trigger: ${o.trigger}${o.source ? ` (${o.source})` : ""}\n— Why: ${o.why}`
                    )
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
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-[11px] tracking-[0.2em] uppercase font-semibold" style={{ color: "#A892FF" }}>
                    {ANGLE_LABEL[o.angle] || o.angle}
                  </div>
                  <div className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--muted)] font-medium px-2 py-1 rounded-full border border-[color:var(--border)] bg-white/[0.02]">
                    Trigger · {o.freshness}
                  </div>
                </div>
                <p className="mt-3 text-[17px] leading-relaxed">{o.line}</p>
                <div className="divider my-5" />
                <div className="space-y-2 text-sm">
                  <p className="text-[color:var(--muted-soft)]">
                    <span className="text-white font-medium">Anchored to — </span>{o.trigger}
                    {o.trigger_date && <span className="text-[color:var(--muted)]"> · {o.trigger_date}</span>}
                    {o.source && (
                      <>
                        {" · "}
                        {o.source.startsWith("http") ? (
                          <a
                            href={o.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[color:var(--grad-2)] hover:text-white underline underline-offset-2"
                          >
                            source →
                          </a>
                        ) : (
                          <span className="text-[color:var(--muted)]">{o.source}</span>
                        )}
                      </>
                    )}
                  </p>
                  <p className="text-[color:var(--muted-soft)]">
                    <span className="text-white font-medium">Why it works — </span>{o.why}
                  </p>
                </div>
              </div>
            ))}

            {/* Soft accelerator lead-in — Hormozi: scarcity + dream outcome, not a pushy CTA */}
            <div className="card">
              <p className="eyebrow mb-2">If these worked</p>
              <p className="text-[color:var(--muted-soft)] leading-relaxed">
                You just used <em>one</em> framework from the Modern Seller Accelerator. The other six handle
                discovery, objections, multi-thread, and close. <span className="text-white font-medium">10 reps per cohort</span> — hands-on,
                live cold-calling sessions, real call reviews.
              </p>
              <div className="mt-4">
                <a href="https://modernseller.ai" className="btn-ghost">
                  See if you&apos;re a fit <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
