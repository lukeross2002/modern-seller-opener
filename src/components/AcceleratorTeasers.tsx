// Hormozi drug-dealer move: surface 4 specific next-call moves, each one
// locked, all linking to the Accelerator application. Used in both the empty
// state (before generation) and the post-results state.

const APPLY_URL = "https://modernseller.ai";

const TOOLS = [
  {
    icon: "🎯",
    name: "Discovery Question Engine",
    teaser: "After the opener, what 3 questions earn the meeting?",
  },
  {
    icon: "🛡️",
    name: "Objection Rebuttal Engine",
    teaser: "What to say to “not interested,” “send me an email,” and 12 more.",
  },
  {
    icon: "📞",
    name: "Voicemail Script Builder",
    teaser: "Got their VM? Here’s the 12 seconds that gets a callback.",
  },
  {
    icon: "🎧",
    name: "Live Call Audit",
    teaser: "Send Luke your last cold call. Get it ripped apart, framework by framework.",
  },
];

export default function AcceleratorTeasers({
  variant,
}: {
  variant: "empty" | "results";
}) {
  const eyebrow =
    variant === "empty" ? "What else is inside the Accelerator" : "Got the opener. Now what?";
  const headline =
    variant === "empty"
      ? "The next 4 moves on your call."
      : "The next move on your call lives here.";
  const intro =
    variant === "empty"
      ? "Every cold call has 9 minutes 50 left after the opener. Here are 4 of the tools the Accelerator unlocks:"
      : "The opener is 10 seconds. Here are 4 of the tools that handle the rest:";

  return (
    <div className="card">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h3 className="text-xl font-semibold tracking-[-0.01em]">{headline}</h3>
      <p className="mt-3 text-[color:var(--muted-soft)] leading-relaxed">{intro}</p>

      <div className="grid sm:grid-cols-2 gap-3 mt-5">
        {TOOLS.map((tool) => (
          <a
            key={tool.name}
            href={APPLY_URL}
            className="group block p-4 rounded-xl border border-[color:var(--border)] bg-white/[0.02] hover:border-[rgba(141,123,255,0.45)] hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-[20px] leading-none flex-shrink-0 mt-0.5" aria-hidden>
                {tool.icon}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[14px] font-semibold tracking-[-0.005em]">{tool.name}</span>
                  <span className="text-[9px] tracking-[0.18em] uppercase font-medium px-1.5 py-0.5 rounded border border-[color:var(--border)] text-[color:var(--muted)]">
                    In the Accelerator
                  </span>
                </div>
                <div className="text-[13px] text-[color:var(--muted-soft)] mt-1.5 leading-snug">
                  {tool.teaser}
                </div>
                <div
                  className="mt-2 text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#A892FF" }}
                >
                  Step inside →
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a href={APPLY_URL} className="btn-primary">
          Get the rest <span aria-hidden>→</span>
        </a>
        <p className="mt-3 text-[11px] tracking-[0.18em] uppercase text-[color:var(--muted)]">
          10 spots per cohort · Application takes 60 seconds
        </p>
      </div>
    </div>
  );
}
