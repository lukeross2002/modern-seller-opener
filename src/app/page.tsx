import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-24 text-center flex flex-col items-center">
          <div className="pill mb-8">
            <span className="dot" /> FREE TOOL · BUILT BY MODERN SELLER
          </div>
          <h1
            className="font-bold tracking-[-0.04em] max-w-4xl"
            style={{ fontSize: "clamp(2.6rem, 6.2vw, 4.4rem)", lineHeight: 0.96 }}
          >
            Openers <span className="gradient-text">that actually book.</span>
          </h1>
          <p className="mt-7 text-[17px] md:text-[19px] text-[color:var(--muted-soft)] max-w-2xl leading-[1.55]">
            Paste a prospect&apos;s LinkedIn URL. Get 3 cold-call openers tailored to <em>them</em> —
            anchored in real triggers from their profile, posts, and company news.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/tool" className="btn-primary">
              Generate my openers <span aria-hidden>→</span>
            </Link>
            <Link href="#how" className="btn-ghost">See how it works</Link>
          </div>
          <p className="mt-7 text-[12px] tracking-[0.18em] uppercase text-[color:var(--muted)]">
            10-second setup · 3 tailored openers · zero fluff
          </p>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y border-[color:var(--border)] bg-black/20">
        <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
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
            Paste a LinkedIn URL. <span className="gradient-text">Get 3 tailored openers.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              step: "01",
              title: "Drop the LinkedIn URL",
              body: "The prospect you're calling. We pull their profile, recent posts, role history, and what their company has been up to lately.",
            },
            {
              step: "02",
              title: "We find the trigger",
              body: "A LinkedIn post, a recent hire, fresh funding, a new product — whatever's actually happening that you can hook into.",
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

      {/* Why this is free */}
      <section className="mx-auto max-w-6xl px-6 pt-28">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card">
            <p className="eyebrow mb-3">Why it&apos;s free</p>
            <h3 className="text-2xl font-bold tracking-[-0.02em]">A taste of the playbook.</h3>
            <ul className="mt-5 space-y-3 text-[color:var(--muted-soft)] leading-relaxed">
              <li className="flex gap-3"><span className="mt-1" style={{color:"#A892FF"}}>—</span>The opener is the hardest 10 seconds of any cold call. We made it the easiest.</li>
              <li className="flex gap-3"><span className="mt-1" style={{color:"#A892FF"}}>—</span>Every opener is built from frameworks the cohort uses on live coaching calls.</li>
              <li className="flex gap-3"><span className="mt-1" style={{color:"#A892FF"}}>—</span>Tailored to a real human, not a template. That&apos;s the whole point.</li>
            </ul>
          </div>
          <div className="card relative overflow-hidden">
            <div className="absolute inset-0 opacity-50 pointer-events-none" style={{
              background: "radial-gradient(ellipse at top right, rgba(141,123,255,0.18), transparent 60%)",
            }} />
            <p className="eyebrow mb-3">Want the full thing?</p>
            <h3 className="text-2xl font-bold tracking-[-0.02em]">The 4-week cohort runs the full system.</h3>
            <p className="mt-4 text-[color:var(--muted-soft)] leading-relaxed">
              Live cold-calling sessions, the full playbook, AI pre-call research, AI call audits, and
              direct Slack access to Luke. The opener tool is one slice. The cohort is the whole knife.
            </p>
            <div className="mt-6">
              <Link href="https://modernseller.ai" className="btn-ghost">
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
              line: "“Sarah, every Head of RevOps I&apos;ve talked to this quarter is fighting the same fire — pipeline review takes a full Friday and the data still feels off. Sound familiar, or are you the exception?”",
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

      {/* Cohort soft mention */}
      <section id="cohort" className="mx-auto max-w-6xl px-6 pt-28">
        <div className="card text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-60" style={{
            background: "radial-gradient(ellipse at bottom, rgba(141,123,255,0.18), transparent 65%)",
          }} />
          <div className="relative">
            <p className="eyebrow mb-3">When you&apos;re ready for more</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] max-w-3xl mx-auto leading-[1.05]">
              The opener is the door. <br className="hidden md:block" />
              <span className="gradient-text">The cohort is the whole house.</span>
            </h2>
            <p className="mt-6 text-[17px] text-[color:var(--muted-soft)] max-w-2xl mx-auto leading-relaxed">
              4 weeks. 8 live cold-calling sessions. Your full playbook, AI pre-call research, AI call audit,
              and direct Slack access to Luke. Reps who run the system book 3–5x more meetings inside the first month.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="https://modernseller.ai" className="btn-primary">
                Book a 15-min call <span aria-hidden>→</span>
              </Link>
              <Link href="https://modernseller.ai" className="btn-ghost">See what&apos;s inside</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 pt-28">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em]">A few quick ones.</h2>
        </div>
        <div className="space-y-3">
          {[
            {
              q: "Is this actually free?",
              a: "Yes. Drop your email, get unlimited openers. The tool is the lead magnet — the paid product is the 4-week cohort.",
            },
            {
              q: "Where does the research come from?",
              a: "Proxycurl pulls the prospect's public LinkedIn profile, recent posts, role history, and their company's recent moves. Public data only — same stuff you'd find clicking around manually.",
            },
            {
              q: "What if there's nothing interesting on their profile?",
              a: "Then we tell you that, fall back to a tight problem-led opener using their role + company, and ask if you want to add anything you spotted manually.",
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
                <span className="font-semibold text-[17px] tracking-[-0.01em]">{q}</span>
                <span className="text-[24px] leading-none transition-transform group-open:rotate-45" style={{color:"#A892FF"}}>+</span>
              </summary>
              <p className="mt-4 text-[color:var(--muted-soft)] leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
