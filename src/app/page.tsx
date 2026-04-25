import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center flex flex-col items-center">
          <div className="pill mb-8">
            <span className="dot" /> Free tool · No credit card · Built by Modern Seller
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] font-extrabold leading-[1.05] tracking-tight max-w-4xl">
            Cold call openers that <span className="gradient-text">actually book.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[color:var(--muted)] max-w-2xl leading-relaxed">
            Paste in the person you&apos;re calling. Get 5 tailored openers in seconds —
            built on the same playbook trained on 50,000+ real cold calls.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/tool" className="btn-primary">
              Generate my openers <span aria-hidden>→</span>
            </Link>
            <Link href="#how" className="btn-secondary">See how it works</Link>
          </div>
          <p className="mt-6 text-xs tracking-[0.18em] uppercase text-[color:var(--muted)]">
            10-second setup · 5 openers · Modern Seller voice
          </p>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y border-[color:var(--border)] bg-black/30">
        <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          {[
            { n: "50K+", l: "Cold calls studied" },
            { n: "$2M+", l: "B2B revenue closed" },
            { n: "195%", l: "Avg quota · 3 yrs" },
            { n: "40+", l: "B2B reps coached" },
          ].map(({ n, l }) => (
            <div key={l}>
              <div className="text-3xl md:text-4xl font-extrabold gradient-text">{n}</div>
              <div className="mt-2 text-[11px] tracking-[0.18em] uppercase text-[color:var(--muted)]">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 pt-28">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">How it works</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
            Three inputs. <span className="gradient-text">Five openers.</span> One unfair advantage.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              step: "01",
              title: "Paste the prospect",
              body: "Name, role, company, and anything you found on LinkedIn or their site. The more colour, the sharper the openers.",
            },
            {
              step: "02",
              title: "Pick your angle",
              body: "Pattern-interrupt, problem-led, peer-led, or referral. Each angle is a tested entry point from the playbook.",
            },
            {
              step: "03",
              title: "Get 5 tailored openers",
              body: "Each one tells you why it works — so you stop reciting lines and start running a system.",
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="card">
              <div className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--accent)]">Step {step}</div>
              <h3 className="mt-3 text-xl font-semibold">{title}</h3>
              <p className="mt-2.5 text-[color:var(--muted)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why this is free */}
      <section className="mx-auto max-w-6xl px-6 pt-28">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card">
            <p className="eyebrow mb-3">Why it&apos;s free</p>
            <h3 className="text-2xl font-bold">A taste of the playbook.</h3>
            <ul className="mt-5 space-y-3 text-[color:var(--muted)] leading-relaxed">
              <li className="flex gap-3"><span className="text-[color:var(--accent)] mt-1">—</span>The opener is the hardest 10 seconds of any cold call. We made it the easiest.</li>
              <li className="flex gap-3"><span className="text-[color:var(--accent)] mt-1">—</span>Every opener is built from frameworks the cohort uses on live coaching calls.</li>
              <li className="flex gap-3"><span className="text-[color:var(--accent)] mt-1">—</span>If it works on three prospects, it works on three hundred. That&apos;s the whole point.</li>
            </ul>
          </div>
          <div className="card relative overflow-hidden">
            <div className="absolute inset-0 opacity-50 pointer-events-none" style={{
              background: "radial-gradient(ellipse at top right, rgba(177,151,252,0.18), transparent 60%)",
            }} />
            <p className="eyebrow mb-3">Want the full thing?</p>
            <h3 className="text-2xl font-bold">The 4-week cohort runs the full system.</h3>
            <p className="mt-4 text-[color:var(--muted)] leading-relaxed">
              Live cold-calling sessions, the full playbook, AI pre-call research, AI call audits, and direct
              Slack access to Luke. The opener tool is one slice. The cohort is the whole knife.
            </p>
            <div className="mt-6">
              <Link href="https://modernseller.ai" className="btn-secondary">
                See the cohort <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="mx-auto max-w-6xl px-6 pt-28">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Sample output</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
            Five openers. Each one with the <span className="gradient-text">why behind it.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              angle: "Pattern interrupt",
              line: "“Hey Sarah — I know you weren’t expecting this call. I’ll give you 19 seconds and then you can decide if I keep going.”",
              why: "Names the elephant in the room and offers an exit. Removes the wall before they put it up.",
            },
            {
              angle: "Problem-led",
              line: "“Sarah, every Head of RevOps I’ve talked to this quarter is fighting the same fire — pipeline review takes a full Friday and the data still feels off. Sound familiar, or are you the exception?”",
              why: "Specific role, specific pain, asks them to disagree. Invites a real answer instead of a brush-off.",
            },
            {
              angle: "Peer-led",
              line: "“Sarah — quick one. The CRO at a peer co just swapped out their forecasting workflow last month and got their Friday afternoons back. I think the same fits Acme. Two minutes to sketch why?”",
              why: "Anchors to a peer they respect, leads with outcome, asks for a small ask. Status proof + social proof in one breath.",
            },
            {
              angle: "Referral angle",
              line: "“Sarah — Marcus over at <co> told me you’d be the right person to talk to about how Acme is handling pipeline hygiene this year. Did he set me up well, or did he set me up?”",
              why: "Borrows trust. The light joke at the end disarms — even a soft no opens the door for a follow-up.",
            },
          ].map(({ angle, line, why }) => (
            <div key={angle} className="opener-card">
              <div className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--accent)] font-semibold">{angle}</div>
              <p className="mt-3 text-lg leading-relaxed">{line}</p>
              <div className="divider my-5" />
              <p className="text-sm text-[color:var(--muted)]"><span className="text-white font-medium">Why it works — </span>{why}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/tool" className="btn-primary">
            Generate yours now <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Cohort upsell */}
      <section id="cohort" className="mx-auto max-w-6xl px-6 pt-28">
        <div className="card text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-60" style={{
            background: "radial-gradient(ellipse at bottom, rgba(177,151,252,0.18), transparent 65%)",
          }} />
          <div className="relative">
            <p className="eyebrow mb-3">The next step</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
              The opener is the door. <br className="hidden md:block" />
              <span className="gradient-text">The cohort is the whole house.</span>
            </h2>
            <p className="mt-6 text-lg text-[color:var(--muted)] max-w-2xl mx-auto leading-relaxed">
              4 weeks. 8 live cold-calling sessions. Your full playbook, AI pre-call research, AI call audit,
              and direct Slack access to Luke. Reps who run the system book 3–5x more meetings inside the first month.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="https://modernseller.ai" className="btn-primary">
                Book a 15-min call <span aria-hidden>→</span>
              </Link>
              <Link href="https://modernseller.ai" className="btn-secondary">See what&apos;s inside</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 pt-28">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">A few quick ones.</h2>
        </div>
        <div className="space-y-3">
          {[
            {
              q: "Is this actually free?",
              a: "Yes. Drop your email, get unlimited openers. The tool is the lead magnet — the paid product is the 4-week cohort.",
            },
            {
              q: "What does it do with my prospect data?",
              a: "Sends it to the model that writes your openers, then forgets it. Nothing about your prospects is stored.",
            },
            {
              q: "Will it write a whole call script?",
              a: "No. It writes the opener — the first 10 seconds. Everything after that is what the cohort teaches.",
            },
            {
              q: "Is it built for SDRs or AEs?",
              a: "Both. Anyone whose calendar depends on cold conversations.",
            },
          ].map(({ q, a }) => (
            <details key={q} className="card group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                <span className="font-semibold text-lg">{q}</span>
                <span className="text-[color:var(--accent)] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-[color:var(--muted)] leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
