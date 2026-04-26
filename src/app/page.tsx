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

      {/* Why these openers are this good — proof of the bigger system */}
      <section className="mx-auto max-w-6xl px-6 pt-28">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card">
            <p className="eyebrow mb-3">Why these are this good</p>
            <h3 className="text-2xl font-bold tracking-[-0.02em]">You&apos;re seeing the framework, not the system.</h3>
            <p className="mt-4 text-[color:var(--muted-soft)] leading-relaxed">
              This tool runs <em>one</em> framework from the Modern Seller Accelerator —
              the research-and-write loop that produces openers that actually book.
            </p>
            <p className="mt-3 text-[color:var(--muted-soft)] leading-relaxed">
              The opener is 10 seconds of a 10-minute call. The Accelerator drills you on the other
              9 minutes 50: discovery, objections, multi-thread, close. Same framework quality. Same voice.
              Applied to the entire conversation.
            </p>
          </div>
          <div className="card relative overflow-hidden">
            {/* Layered radial glows for visual depth */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at top right, rgba(141,123,255,0.28), transparent 60%), radial-gradient(ellipse 60% 40% at bottom left, rgba(90,161,255,0.14), transparent 70%)",
              }}
            />

            <div className="relative">
              {/* Scarcity pill */}
              <div className="pill mb-5">
                <span className="dot" /> 10 spots per cohort
              </div>

              <p className="eyebrow mb-3">The Modern Seller Accelerator</p>

              <h3 className="text-[26px] md:text-[30px] font-bold tracking-[-0.025em] leading-[1.08]">
                Live calls,<br />
                <span className="gradient-text">not slide decks.</span>
              </h3>

              {/* Stat strip — visual landmark */}
              <div className="mt-7 grid grid-cols-3 gap-3 py-5 border-y border-[color:var(--border)]">
                {[
                  { n: "4", l: "Weeks" },
                  { n: "10", l: "Reps" },
                  { n: "3–5x", l: "Meetings" },
                ].map(({ n, l }) => (
                  <div key={l} className="text-center">
                    <div className="text-[26px] md:text-[28px] font-bold gradient-text leading-none">
                      {n}
                    </div>
                    <div className="mt-2 text-[10px] tracking-[0.18em] uppercase text-[color:var(--muted)]">
                      {l}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-[color:var(--muted-soft)] leading-relaxed">
                Twice-weekly live cold-calling sessions. The full playbook. AI pre-call research,
                AI call audits, direct Slack access. Hands-on, not theory.
              </p>

              {/* Primary CTA — gradient, draws the eye */}
              <div className="mt-7">
                <Link href="https://modernseller.ai" className="btn-primary">
                  Apply for the next cohort <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
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
              line: "“Sarah, saw your post yesterday about RevOps spending Friday afternoons cleaning pipeline data — curious, is that the prep work itself or the deal-data quality?”",
              why: "Named-trigger opener. Quoting her own post earns the next 20 seconds. The fork in the question forces a real answer, not a brush-off.",
            },
            {
              angle: "Peer-led",
              line: "“Sarah — quick one. The RevOps lead at <peer co> hit the same Friday-pipeline issue last quarter and we got their afternoons back. Worth two minutes to sketch how?”",
              why: "Peer anchor borrows credibility. The specific outcome (Friday afternoons back) makes it concrete instead of vague pitch language.",
            },
            {
              angle: "Problem-led",
              line: "“Sarah, every Head of RevOps I’ve talked to this quarter is fighting the same fire — pipeline review takes a full Friday and the data still feels off. Sound familiar, or are you the exception?”",
              why: "Named-pain framing + soft-no question. Inviting her to disagree gets a real answer faster than asking for permission.",
            },
          ].map(({ angle, line, why }) => (
            <div key={angle} className="opener-card">
              <div className="text-[11px] tracking-[0.2em] uppercase font-semibold" style={{color:"#A892FF"}}>{angle}</div>
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

      {/* Accelerator upsell — Hormozi: scarcity, value stack, dream outcome, low-friction CTA */}
      <section id="cohort" className="mx-auto max-w-6xl px-6 pt-28">
        <div className="card text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-60" style={{
            background: "radial-gradient(ellipse at bottom, rgba(141,123,255,0.18), transparent 65%)",
          }} />
          <div className="relative">
            <div className="pill mb-4">
              <span className="dot" /> 10 spots per cohort · By application
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] max-w-3xl mx-auto leading-[1.05]">
              Openers fix the first 10 seconds. <br className="hidden md:block" />
              <span className="gradient-text">The Accelerator fixes everything after.</span>
            </h2>
            <p className="mt-6 text-[17px] text-[color:var(--muted-soft)] max-w-2xl mx-auto leading-relaxed">
              4 weeks. 10 reps only. Built for the rep who&apos;s tired of winging it and ready to install
              a system that books meetings on repeat.
            </p>

            {/* Value stack */}
            <div className="mt-8 max-w-2xl mx-auto text-left grid sm:grid-cols-2 gap-x-8 gap-y-3 text-[15px]">
              {[
                "8 live cold-calling sessions with Luke",
                "The full Cold Call Playbook (every framework)",
                "AI pre-call research tool (better than this one)",
                "AI call audit tool — every dial reviewed",
                "Direct Slack access · 7 days a week",
                "Live objection-handling drills",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <span className="mt-1 flex-shrink-0" style={{ color: "#A892FF" }}>—</span>
                  <span className="text-[color:var(--muted-soft)]">{item}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-[15px] text-[color:var(--muted-soft)] max-w-xl mx-auto">
              Reps who run the system book{" "}
              <span className="text-white font-semibold">3–5x more meetings</span>{" "}
              inside the first month.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="https://modernseller.ai" className="btn-primary">
                Apply for the next cohort <span aria-hidden>→</span>
              </Link>
              <Link href="https://modernseller.ai" className="btn-ghost">
                See full curriculum
              </Link>
            </div>

            <p className="mt-5 text-xs tracking-[0.18em] uppercase text-[color:var(--muted)]">
              Cohort 01 fills fast · Application takes 60 seconds
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
              a: "Yes. Drop your email and run unlimited openers — they're yours, no catch.",
            },
            {
              q: "Where does the research come from?",
              a: "Live web search. Recent posts, podcasts, press releases, funding news, exec hires — whatever's actually public about the prospect and their company. Each opener cites the source URL so you can verify it before you dial.",
            },
            {
              q: "Will it write a whole call script?",
              a: "No. It writes the opener — the first 10 seconds. Discovery, objections, the close — that's the Accelerator.",
            },
            {
              q: "How is the Accelerator different from generic sales training?",
              a: "Generic training gives you frameworks on a slide deck. The Accelerator is hands-on — live cold-calling sessions twice a week, real call reviews from me, and a cohort that calls together. You don't learn cold calling from theory. You learn it on the phone.",
            },
            {
              q: "How many spots are in each cohort?",
              a: "10 reps. That's the cap — fewer reps means more 1-on-1 time on each live session. It's why we don't scale it.",
            },
            {
              q: "How fast do reps see results?",
              a: "Most reps book 3–5x more meetings inside the first month. Week 1 installs the playbook. Weeks 2–4 are live calls + coaching. By the end you have a system, not a script you read.",
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
