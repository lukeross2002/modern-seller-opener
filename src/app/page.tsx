import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-24 text-center flex flex-col items-center">
          <div className="pill mb-8">
            <span className="dot" /> Free tool · Built by Luke Ross, founder of modernseller.ai
          </div>
          <h1
            className="font-bold tracking-[-0.04em] max-w-4xl"
            style={{ fontSize: "clamp(2.6rem, 6.2vw, 4.4rem)", lineHeight: 0.96 }}
          >
            Openers <span className="gradient-text">that actually book.</span>
          </h1>
          <p className="mt-7 text-[17px] md:text-[19px] text-[color:var(--muted-soft)] max-w-2xl leading-[1.55]">
            Drop in your prospect&apos;s name and company. Get 3 cold-call openers tailored to <em>them</em> —
            anchored in real, dated triggers from live web research.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/tool" className="btn-primary">
              Generate my openers <span aria-hidden>→</span>
            </Link>
            <a href="#how" className="btn-ghost">See how it works</a>
          </div>
          <p className="mt-7 text-[12px] tracking-[0.18em] uppercase text-[color:var(--muted)]">
            10-second setup · 3 tailored openers · zero fluff
          </p>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y border-[color:var(--border)] bg-black/20">
        <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center text-center">
          {[
            { n: "50K+", l: "Cold calls studied" },
            { n: "$2M+", l: "B2B revenue closed" },
            { n: "195%", l: "Avg quota · 3 yrs" },
            { n: "40+", l: "B2B reps coached" },
          ].map(({ n, l }) => (
            <div key={l}>
              <div className="text-3xl md:text-[2.6rem] font-bold tracking-[-0.03em] gradient-text">{n}</div>
              <div className="mt-2 text-[11px] tracking-[0.18em] uppercase text-[color:var(--muted)]">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 pt-28">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">How it works</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] max-w-3xl mx-auto leading-[1.05]">
            Drop in their name + company. <span className="gradient-text">Get 3 tailored openers.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              step: "01",
              title: "Drop their name + company",
              body: "Their full name (so we can find the actual person), the company website, and what you sell. 10 seconds, three fields.",
            },
            {
              step: "02",
              title: "We search the live web",
              body: "Recent posts, podcasts, press, funding, exec hires — whatever's actually happening this week that you can hook into. Each opener cites its source.",
            },
            {
              step: "03",
              title: "3 openers, 3 angles",
              body: "Trigger-led, peer-led, problem-led. Each one tells you why it works so you can make it yours, not just read it off a script.",
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="card">
              <div className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--grad-2)]" style={{color: "#A892FF"}}>Step {step}</div>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.01em]">{title}</h3>
              <p className="mt-2.5 text-[color:var(--muted-soft)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why these openers are this good — light context, no pitch */}
      <section className="mx-auto max-w-4xl px-6 pt-28">
        <div className="card">
          <p className="eyebrow mb-3">Why these are this good</p>
          <h3 className="text-2xl font-bold tracking-[-0.02em]">Real research beats clever scripts.</h3>
          <p className="mt-4 text-[color:var(--muted-soft)] leading-relaxed">
            Most opener generators just remix templates. This one searches the live web for the
            prospect — recent posts, podcasts, funding, hires — and anchors every line to a dated,
            verifiable trigger. You get an opener that sounds like you actually did your homework,
            because you did.
          </p>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="mx-auto max-w-6xl px-6 pt-28">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Sample output</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] max-w-3xl mx-auto leading-[1.05]">
            Three openers. <span className="gradient-text">Each one anchored in real research.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              angle: "Trigger-led",
              who: "James · Founder, Series-B SaaS",
              trigger: "Funding announcement (TechCrunch, 3 days ago)",
              line: "“James — saw the Series B drop on TechCrunch Tuesday, congrats. The 8-figure founders we work with all wrestle with the same hire-fast/keep-CAC-down trade-off in the first 90 days post-raise. Where is that landing for you right now?”",
              why: "Names a dated, public trigger he'll instantly recognize. The bracketed problem mirrors what he's privately wrestling with, which earns the next 30 seconds.",
            },
            {
              angle: "Peer-led",
              who: "Priya · Head of CX, mid-market SaaS",
              trigger: "LinkedIn post about churn spike (last month)",
              line: "“Priya, quick one. The CX lead at Gainsight had the same Q1 churn spike you posted about last month — we cut their voluntary churn by 18% in one quarter. Worth two minutes for me to sketch how, or is it a bad time?”",
              why: "Peer anchor borrows credibility from a name she respects. Specific outcome (18%, one quarter) beats vague pitch language. Soft-no close gives her an out, which paradoxically gets more yeses.",
            },
            {
              angle: "Problem-led",
              who: "Marcus · VP Sales, $80M manufacturer",
              trigger: "Industry pattern (no public signal)",
              line: "“Marcus, every VP Sales at a $50–100M manufacturer I've talked to this year is fighting the same thing — quote-to-cash takes 3 weeks and deals are dying in legal review. Sound familiar, or are you the exception?”",
              why: "When there's no public trigger to anchor to, named-pain framing does the work. The 'are you the exception' close invites him to disagree, which is a faster path to a real conversation than asking permission.",
            },
          ].map(({ angle, who, trigger, line, why }) => (
            <div key={angle} className="opener-card">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="text-[11px] tracking-[0.2em] uppercase font-semibold" style={{color:"#A892FF"}}>{angle}</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-[color:var(--muted)] font-medium px-2 py-1 rounded-full border border-[color:var(--border)] bg-white/[0.02]">
                  {trigger}
                </div>
              </div>
              <div className="text-[12px] tracking-[0.05em] text-[color:var(--muted)] mt-2">{who}</div>
              <p className="mt-3 text-[17px] leading-relaxed">{line}</p>
              <div className="divider my-5" />
              <p className="text-sm text-[color:var(--muted-soft)]"><span className="text-white font-medium">Why it works — </span>{why}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/tool" className="btn-primary">
            Try yours now <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Restrained Accelerator card — scarcity in the pill, no value stack */}
      <section id="cohort" className="mx-auto max-w-2xl px-6 pt-28">
        <div className="card relative overflow-hidden text-center">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(141,123,255,0.18), transparent 60%)",
            }}
          />
          <div className="relative">
            <div className="pill mb-5">
              <span className="dot" /> 10 spots per cohort · By application
            </div>
            <h3
              className="font-bold tracking-[-0.025em] leading-[1.12]"
              style={{ fontSize: "clamp(1.55rem, 3.2vw, 2rem)" }}
            >
              Want help with <span className="gradient-text">the other 9 minutes 50?</span>
            </h3>
            <p className="mt-5 text-[color:var(--muted-soft)] leading-relaxed max-w-lg mx-auto">
              Luke runs the Accelerator — 4 weeks, 10 reps, twice-weekly live cold-calling sessions
              and real call reviews. Hands-on, not theory.
            </p>
            <div className="mt-7">
              <Link href="https://modernseller.ai" className="btn-primary">
                See if there&apos;s a spot <span aria-hidden>→</span>
              </Link>
            </div>
            <p className="mt-4 text-[11px] tracking-[0.18em] uppercase text-[color:var(--muted)]">
              Application takes 60 seconds
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 pt-28">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em]">A few quick ones.</h2>
        </div>
        <FAQ
          items={[
            {
              q: "Is this actually free?",
              a: "Yes. Run unlimited openers — they're yours, no catch.",
            },
            {
              q: "Where does the research come from?",
              a: "Live web search. Recent posts, podcasts, press releases, funding news, exec hires — whatever's actually public about the prospect and their company. Each opener cites the source URL so you can verify it before you dial.",
            },
            {
              q: "How recent is the research?",
              a: "As fresh as the web is. We pull live results at the moment you click generate, so a post from this morning is fair game. Each opener tags how recent the trigger is.",
            },
            {
              q: "Will it write a whole call script?",
              a: "No. The opener is the first 10 seconds — that's what this tool nails. Discovery, objection-handling, and the close are the full system Luke teaches inside the Accelerator.",
            },
            {
              q: "Will my data be saved or shared?",
              a: "Prospect details aren't stored after the openers are generated. We only keep the email you use to unlock the tool, so we can send you a copy.",
            },
            {
              q: "Who is this built for?",
              a: "Anyone who cold calls. SDRs, AEs, founders running outbound, agency owners, recruiters — if your calendar depends on cold conversations, it's for you.",
            },
          ]}
        />
      </section>

      <Footer />
    </>
  );
}
