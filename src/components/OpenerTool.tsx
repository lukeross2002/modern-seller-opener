"use client";

import { useState, useEffect, FormEvent } from "react";

type Opener = { angle: string; line: string; why: string };

const ANGLES = [
  { value: "auto", label: "Auto · best fit" },
  { value: "pattern_interrupt", label: "Pattern interrupt" },
  { value: "problem_led", label: "Problem-led" },
  { value: "peer_led", label: "Peer-led / social proof" },
  { value: "referral", label: "Referral angle" },
  { value: "trigger_event", label: "Trigger event" },
];

export default function OpenerTool() {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState("");

  const [prospectName, setProspectName] = useState("");
  const [prospectRole, setProspectRole] = useState("");
  const [prospectCompany, setProspectCompany] = useState("");
  const [yourOffer, setYourOffer] = useState("");
  const [notes, setNotes] = useState("");
  const [angle, setAngle] = useState("auto");

  const [generating, setGenerating] = useState(false);
  const [openers, setOpeners] = useState<Opener[]>([]);
  const [genError, setGenError] = useState("");

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
      // Non-blocking — we don't want to lose the user if the webhook is down.
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
    setGenError("");
    if (!prospectName.trim() || !prospectRole.trim() || !prospectCompany.trim() || !yourOffer.trim()) {
      setGenError("Need at least a name, role, company, and what you sell.");
      return;
    }
    setGenerating(true);
    setOpeners([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectName,
          prospectRole,
          prospectCompany,
          yourOffer,
          notes,
          angle,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Generator hit an error. Try again.");
      }
      const data = await res.json();
      setOpeners(data.openers || []);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Something broke. Try again.");
    } finally {
      setGenerating(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="card max-w-xl mx-auto">
        <p className="eyebrow mb-3">Unlock the tool · 10 seconds</p>
        <h2 className="text-2xl font-bold">Where should we send the playbook PDF?</h2>
        <p className="mt-3 text-[color:var(--muted)] leading-relaxed">
          One email gets you unlimited openers, the Cold Call Opener cheat sheet, and a follow-up on day 3 with
          how the top reps in the cohort use this tool.
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

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-5">
      <form onSubmit={handleGenerate} className="card space-y-4">
        <div>
          <p className="eyebrow mb-2">Step 1 · The prospect</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="input"
              placeholder="Prospect name"
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Their role / title"
              value={prospectRole}
              onChange={(e) => setProspectRole(e.target.value)}
              required
            />
          </div>
          <input
            className="input mt-3"
            placeholder="Their company"
            value={prospectCompany}
            onChange={(e) => setProspectCompany(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="eyebrow mb-2">Step 2 · What you sell</p>
          <input
            className="input"
            placeholder="One line: e.g. 'AI pipeline review for RevOps teams'"
            value={yourOffer}
            onChange={(e) => setYourOffer(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="eyebrow mb-2">Step 3 · Anything you found (optional)</p>
          <textarea
            className="input"
            placeholder="LinkedIn, recent post, podcast quote, hiring signal, funding news, anything specific…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <p className="eyebrow mb-2">Step 4 · Pick an angle</p>
          <select
            className="input"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
          >
            {ANGLES.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        {genError && <p className="text-sm text-red-300">{genError}</p>}

        <button type="submit" className="btn-primary w-full justify-center" disabled={generating}>
          {generating ? "Writing your openers…" : "Generate 5 openers"} <span aria-hidden>→</span>
        </button>
        <p className="text-xs text-[color:var(--muted)] text-center">
          Takes 5–10 seconds. Nothing you type is stored.
        </p>
      </form>

      <div className="space-y-4">
        {generating && (
          <div className="card">
            <p className="eyebrow mb-3">Working…</p>
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

        {!generating && openers.length === 0 && (
          <div className="card">
            <p className="eyebrow mb-3">Output</p>
            <h3 className="text-xl font-semibold">5 openers will land here.</h3>
            <p className="mt-3 text-[color:var(--muted)] leading-relaxed">
              Each opener arrives with the angle and the tactical reason it works. Use one as-is, or remix to your voice.
            </p>
          </div>
        )}

        {!generating && openers.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="eyebrow">Your openers · {openers.length}</p>
              <button
                onClick={() => {
                  const text = openers
                    .map((o, i) => `${i + 1}. [${o.angle}]\n${o.line}\n— Why: ${o.why}`)
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
                <div className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--accent)] font-semibold">{o.angle}</div>
                <p className="mt-3 text-lg leading-relaxed">{o.line}</p>
                <div className="divider my-5" />
                <p className="text-sm text-[color:var(--muted)]"><span className="text-white font-medium">Why it works — </span>{o.why}</p>
              </div>
            ))}
            <div className="card text-center">
              <p className="text-[color:var(--muted)] mb-4">Like these? The cohort builds your full script — discovery, objections, the close.</p>
              <a href="https://modernseller.ai" className="btn-primary">Book a 15-min call <span aria-hidden>→</span></a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
