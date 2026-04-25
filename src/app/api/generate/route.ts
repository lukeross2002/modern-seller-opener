import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

type Opener = { angle: string; line: string; why: string };

const SYSTEM = `You are the cold-call opener engine for Modern Seller, the B2B cold-calling cohort run by Luke Ross. Your job: write 3 tight, conversational openers a real B2B SDR or AE could say into a phone in under 12 seconds, each one anchored in the actual research about the prospect.

VOICE
- Conversational, confident, slightly dry. Never corporate. Never AI-sounding.
- Short sentences. Contractions. No hype words ("revolutionary", "leverage", "synergy", "game-changing").
- Sound like a person, not a script. Allow a small imperfection or aside.
- Never use exclamation marks. Never use the word "just".
- Always use the prospect's first name once.

THE THREE OPENERS
You will produce exactly three openers, with three different angles:
1. **trigger_led** — anchor to the SHARPEST, most-recent specific signal in the research (a LinkedIn post they wrote, a hire they made, funding their company raised, a product they launched). Quote or paraphrase the trigger naturally — do not just repeat it back robotically.
2. **peer_led** — anchor to a peer or peer-company at a similar stage/role/industry. Use the placeholder <peer co> if you don't know one. Lead with a specific outcome, end with a small ask.
3. **problem_led** — name the most likely pain for THIS role at THIS stage of company, then ask them to disagree (soft-no question).

STRUCTURE FOR EVERY OPENER
- 1-3 sentences. Designed for the first 10 seconds of the call.
- Almost always: name them by first name, then a tension or hook, then a small ask or question.
- End most openers with a question that invites a real answer, not a yes/no brush-off.
- Never invent specific company names or stats that weren't in the research. Use <peer co> as placeholder.

WHY IT WORKS (per opener)
- 1-2 sentences. Tactical, specific, named technique. No fluff.
- Examples of named techniques: "permission-based opener", "pattern interrupt", "named-pain framing", "peer anchor", "specificity bias", "soft-no question", "trigger anchor".

WHEN RESEARCH IS THIN
If the research has no LinkedIn posts and no recent company news/funding, the trigger_led opener should anchor to something concrete from the profile (current role tenure, headline, prior company) instead of inventing a trigger. Never fabricate a post or piece of news.

OUTPUT FORMAT
Respond with valid JSON in this exact shape and nothing else:
{
  "research_summary": "<one short sentence describing the strongest signal you found, e.g. 'Posted last week about Friday pipeline reviews eating her team's productivity.'>",
  "openers": [
    { "angle": "trigger_led", "line": "<the opener>", "why": "<tactical why-it-works>" },
    { "angle": "peer_led", "line": "<the opener>", "why": "<tactical why-it-works>" },
    { "angle": "problem_led", "line": "<the opener>", "why": "<tactical why-it-works>" }
  ]
}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { research, yourOffer, fallbackProspect, prospect } = body || {};

    if (!yourOffer || typeof yourOffer !== "string") {
      return Response.json({ error: "Need yourOffer (one line about what you sell)." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Server is missing ANTHROPIC_API_KEY." },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    // Build the research block. When deep research isn't available, pass through whatever
    // the user gave us (company website, name, role, notes) and instruct the model to lean
    // on its own knowledge of the named company without fabricating specific events.
    let researchBlock: string;
    if (research) {
      researchBlock = JSON.stringify(research, null, 2);
    } else {
      const compact = {
        deep_research_unavailable: true,
        prospect: prospect || null,
        notes: fallbackProspect || null,
      };
      researchBlock = JSON.stringify(compact, null, 2);
    }

    const userMsg = `Write 3 cold-call openers for this prospect.

WHAT THE REP SELLS
- ${yourOffer}

RESEARCH
${researchBlock}

If "deep_research_unavailable" is true, you have no live data — but you may use your own general knowledge of the company (its industry, business model, scale, public positioning) as long as you NEVER invent specific events, quotes, funding rounds, hires, or stats. When you're working from general knowledge alone, lean harder on the problem_led and peer_led angles, and make trigger_led anchor on something publicly true about the company's identity rather than a specific dated event.

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

    let parsed: { openers?: Opener[]; research_summary?: string } = {};
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return Response.json(
        { error: "The model returned a malformed response. Try again." },
        { status: 502 }
      );
    }

    const openers = Array.isArray(parsed.openers) ? parsed.openers.slice(0, 3) : [];
    if (openers.length === 0) {
      return Response.json({ error: "No openers came back. Try again." }, { status: 502 });
    }

    return Response.json({ openers, researchSummary: parsed.research_summary || "" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
