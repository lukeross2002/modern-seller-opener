import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

type Opener = { angle: string; line: string; why: string };

const ANGLE_HINTS: Record<string, string> = {
  pattern_interrupt: "Use the pattern-interrupt angle: name the elephant (it's a cold call), offer an exit window, then earn the next 20 seconds.",
  problem_led: "Use the problem-led angle: name a specific pain pattern that's true for their role, then ask them to disagree.",
  peer_led: "Use the peer-led / social-proof angle: anchor to a peer or peer company they'd respect (use a placeholder like <peer co> if unknown), then make a small, specific ask.",
  referral: "Use the referral angle: borrow trust from a believable internal or external connection. Use placeholder <ref name> if no name is given.",
  trigger_event: "Use the trigger-event angle: tie the opener to something specific that just happened at their company (funding, hiring, product launch, post, podcast quote).",
  auto: "Pick the strongest angle for THIS prospect based on the notes. Vary across the 5 openers so the user has range.",
};

const SYSTEM = `You are the cold-call opener engine for Modern Seller, the B2B cold-calling cohort run by Luke Ross. Your job: write tight, conversational openers a real B2B SDR or AE could say into a phone in under 12 seconds.

VOICE
- Conversational, confident, slightly dry. Never corporate. Never AI-sounding.
- Short sentences. Contractions. No hype words ("revolutionary", "leverage", "synergy", "game-changing").
- Sound like a person, not a script. Allow a small imperfection or aside.
- Never use exclamation marks. Never use the word "just".

STRUCTURE FOR EVERY OPENER
- 1-3 sentences max. Designed for the first 10 seconds of the call.
- Almost always: name them by first name, then a tension or a hook, then a small ask or pivot.
- End most openers with a question that invites a real answer, not a yes/no brush-off.
- Where you'd reference an external proof you don't actually have, use a clear placeholder like <peer co>, <ref name>, or <trigger event>. Never invent specific company names or stats.

WHY IT WORKS (per opener)
- 1-2 sentences. Tactical, specific, named technique. No fluff.
- Examples of the named technique: "permission-based opener", "pattern interrupt", "named-pain framing", "peer anchor", "false dichotomy", "specificity bias", "soft-no question".

OUTPUT FORMAT
You MUST respond with valid JSON in this exact shape and nothing else:
{
  "openers": [
    { "angle": "<short angle name>", "line": "<the opener>", "why": "<tactical why-it-works>" },
    ... 5 total
  ]
}

Write exactly 5 openers. Each one must be meaningfully different.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      prospectName,
      prospectRole,
      prospectCompany,
      yourOffer,
      notes,
      angle,
    } = body || {};

    if (!prospectName || !prospectRole || !prospectCompany || !yourOffer) {
      return Response.json(
        { error: "Need prospectName, prospectRole, prospectCompany, yourOffer." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Server is missing ANTHROPIC_API_KEY. Set it in your environment." },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const angleHint = ANGLE_HINTS[String(angle || "auto")] || ANGLE_HINTS.auto;

    const userMsg = `Write 5 cold-call openers for the following situation.

PROSPECT
- Name: ${prospectName}
- Role / title: ${prospectRole}
- Company: ${prospectCompany}

WHAT THE REP SELLS
- ${yourOffer}

WHAT THE REP FOUND ABOUT THE PROSPECT (may be empty)
${notes?.trim() ? notes.trim() : "(none provided — keep it general but still in-voice)"}

ANGLE GUIDANCE
${angleHint}

Reminder: respond with the JSON object only, no markdown, no commentary.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: [
        { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
      ],
      messages: [{ role: "user", content: userMsg }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text : "";

    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const jsonStr = jsonStart >= 0 && jsonEnd > jsonStart ? raw.slice(jsonStart, jsonEnd + 1) : raw;

    let parsed: { openers?: Opener[] } = {};
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return Response.json(
        { error: "The model returned a malformed response. Try again." },
        { status: 502 }
      );
    }

    const openers = Array.isArray(parsed.openers) ? parsed.openers.slice(0, 5) : [];
    if (openers.length === 0) {
      return Response.json({ error: "No openers came back. Try again." }, { status: 502 });
    }

    return Response.json({ openers });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
