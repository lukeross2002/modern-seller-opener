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
            <span className="dot" /> Free tool · Built by Luke Ross, founder of modernseller.ai
          </div>
          <h1
            className="font-bold tracking-[-0.04em] max-w-4xl"
            style={{ fontSize: "clamp(2.6rem, 6.2vw, 4.4rem)", lineHeight: 0.96 }}
          >
            Openers <span className="gradient-text">that actually book.</span>
          </h1>
          <p className="mt-7 text-[17px] md:text-[19px] text-[color:var(--muted-soft)] max-w-2xl leading-[1.55]">
            Drop in your prospect&apos;s company. Get 3 cold-call openers tailored to <em>them</em> —
            anchored in real research about their role, company, and recent moves.
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
            Drop in their company. <span className="gradient-text">Get 3 tailored openers.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              step: "01",
              title: "Drop their company",
              body: "Just the website (e.g. acme.com). Add the prospect's first name and role for sharper targeting.",
            },
            {
              step: "02",
              title: "We pull the research",
              body: "What the company does, headcount, key execs, the prospect's role tenure — the same dossier you'd build manually in 20 minutes.",
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

      {/* Lead-magnet honesty: this is one piece */}
      <section className="mx-auto max-w-6xl px-6 pt-28">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card">
            <p className="eyebrow mb-3">What this is</p>
            <h3 className="text-2xl font-bold tracking-[-0.02em]">One piece of a bigger system.</h3>
            <p className="mt-4 text-[color:var(--muted-soft)] leading-relaxed">
              The opener is the first 10 seconds of a cold call. It&apos;s the hardest part, and the
              part most reps wing. This tool fixes those 10 seconds.
            </p>
            <p className="mt-3 text-[color:var(--muted-soft)] leading-relaxed">
              It&apos;s not the whole call. It won&apos;t teach you discovery, objections, or how to close.
              That&apos;s by design — this is meant to be useful by itself, while pointing at where the rest lives.
            </p>
          </div>
          <div className="card relative overflow-hidden">
            <div className="absolute inset-0 opacity-50 pointer-events-none" style={{
              background: "radial-gradient(ellipse at top right, rgba(141,123,255,0.18), transparent 60%)",
            }} />
            <p className="eyebrow mb-3">Where the rest lives</p>
            <h3 className="text-2xl font-bold tracking-[-0.02em]">The 4-week cohort runs the full system.</h3>
            <p className="mt-4 text-[color:var(--muted-soft)] leading-relaxed">
              Live cold-calling sessions, the playbook, AI pre-call research, AI call audits, and direct
              Slack access. The cohort takes you from "I have a good opener" to "I have a system that books
              meetings on repeat."
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

      {/* Cohort — soft, factual, not a wall of CTAs */}
      <section id="cohort" className="mx-auto max-w-6xl px-6 pt-28">
        <div className="card text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-60" style={{
            background: "radial-gradient(ellipse at bottom, rgba(141,123,255,0.18), transparent 65%)",
          }} />
          <div className="relative">
            <p className="eyebrow mb-3">If you want the rest</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] max-w-3xl mx-auto leading-[1.05]">
              Openers fix the first 10 seconds. <br className="hidden md:block" />
              <span className="gradient-text">The cohort fixes everything after.</span>
            </h2>
            <p className="mt-6 text-[17px] text-[color:var(--muted-soft)] max-w-2xl mx-auto leading-relaxed">
              4 weeks. Live cold-calling sessions, the full playbook, AI pre-call research, AI call audits,
              and direct Slack access. No pressure — keep using the opener tool either way.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="https://modernseller.ai" className="btn-primary">
                See what&apos;s inside <span aria-hidden>→</span>
              </Link>
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
              a: "We pull public data about the prospect's company (description, headcount, key execs) and — if you give us their first name — their role tenure and prior positions. Same dossier you'd build manually in 20 minutes.",
            },
            {
              q: "What if there's no useful research?",
              a: "Paste anything you noticed (a LinkedIn post, a news mention, a podcast) into the optional notes. We'll fold it into the openers and still give you three angles.",
            },
            {
              q: "Will it write a whole call script?",
              a: "No. It writes the opener — the first 10 seconds. Everything after that is what the cohort teaches.",
            },
            {
              q: "Who is this built for?",
              a: "Anyone who cold calls. SDRs, AEs, founders running outbound, agency owners, recruiters — if your calendar depends on cold conversations, it's for you.",
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
