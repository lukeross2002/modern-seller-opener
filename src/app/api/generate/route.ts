import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

type Opener = {
  angle: string;
  freshness: string;
  trigger: string;
  source?: string;
  line: string;
  why: string;
};

const SYSTEM = `You are the cold-call opener engine for Modern Seller, the B2B cold-calling cohort run by Luke Ross. Your job: write 3 tight, conversational openers a real B2B SDR or AE could say into a phone in under 12 seconds, each anchored in a real, dated trigger you found about the prospect or their company.

YOU HAVE WEB SEARCH. USE IT.
For every prospect, search the web for the freshest possible signals:
- Recent posts/quotes from the prospect (LinkedIn, podcasts, articles, press)
- Their company's recent news (funding, exec hires, product launches, layoffs, expansions)
- Industry-specific events that would change their priorities
Use up to 3 web searches. Pick the strongest signals. Cite the source URL or publication for each opener.

VOICE
- Conversational, confident, slightly dry. Never corporate. Never AI-sounding.
- Short sentences. Contractions. No hype words ("revolutionary", "leverage", "synergy", "game-changing").
- Sound like a person, not a script. Allow a small imperfection or aside.
- Never use exclamation marks. Never use the word "just".
- Always use the prospect's first name once.

THE THREE OPENERS
Three different angles, each anchored to a real signal:
1. **trigger_led** — the SHARPEST, most-recent specific signal you found (post, quote, hire, funding, launch). Quote or paraphrase it naturally. Tag freshness honestly: "this week", "this month", or "recent".
2. **peer_led** — anchor to a peer or peer-company at similar stage/role. Use placeholder <peer co> if you can't find a specific named peer. Lead with a specific outcome.
3. **problem_led** — name the most likely pain for THIS role at THIS stage of company, then ask them to disagree (soft-no question). If you found an industry-specific signal that confirms the pain, reference it.

STRUCTURE FOR EVERY OPENER
- 1-3 sentences. First 10 seconds of the call.
- First name + tension/hook + small ask or question.
- End most openers with a question that invites a real answer.
- Never invent specific stats, quotes, or events that weren't in your search results.

WHY IT WORKS (per opener)
- 1-2 sentences. Tactical, named technique. No fluff.
- Examples: "permission-based opener", "pattern interrupt", "named-pain framing", "peer anchor", "specificity bias", "soft-no question", "trigger anchor".

WHEN RESEARCH IS THIN
If your searches return nothing fresh or specific about this prospect/company, say so honestly in research_summary. Anchor trigger_led to something publicly true about the company's identity (industry, scale, business model) without inventing dated events. Tag freshness as "industry pattern" in that case.

OUTPUT FORMAT
Respond with valid JSON in this exact shape and nothing else:
{
  "research_summary": "<one short sentence describing the strongest signal you found, naming the source>",
  "openers": [
    {
      "angle": "trigger_led",
      "freshness": "<this week | this month | recent | industry pattern>",
      "trigger": "<one short phrase naming what the opener anchors to>",
      "source": "<URL or publication name where you found it; empty string if industry pattern>",
      "line": "<the opener>",
      "why": "<tactical why-it-works>"
    },
    { "angle": "peer_led", "freshness": "...", "trigger": "...", "source": "...", "line": "...", "why": "..." },
    { "angle": "problem_led", "freshness": "...", "trigger": "...", "source": "...", "line": "...", "why": "..." }
  ]
}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { yourOffer, prospect, fallbackProspect } = body || {};

    if (!yourOffer || typeof yourOffer !== "string") {
      return Response.json({ error: "Need yourOffer (one line about what you sell)." }, { status: 400 });
    }
    if (!prospect?.firstName) {
      return Response.json({ error: "Need prospect.firstName." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Server is missing ANTHROPIC_API_KEY." }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const userMsg = `Write 3 cold-call openers for this prospect. Use web search to find live, dated triggers.

PROSPECT
- First name: ${prospect.firstName}
- Role / title: ${prospect.role || "(unknown)"}
- Company website: ${prospect.companyWebsite || "(unknown)"}
${fallbackProspect ? `- Notes from the rep: ${fallbackProspect}` : ""}

WHAT THE REP SELLS
- ${yourOffer}

Search the web for: recent posts/quotes from ${prospect.firstName}, recent news about the company at ${prospect.companyWebsite || "(unknown)"}, recent funding/hires/launches. Pick the sharpest signal. Then write the 3 openers.

Reminder: respond with the JSON object only, no markdown, no commentary. Cite the source for every opener that uses a real trigger.`;

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 3 }],
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userMsg }],
    });

    const finalMessage = await stream.finalMessage();

    const textBlock = finalMessage.content.find((b) => b.type === "text");
    const raw = textBlock && textBlock.type === "text" ? textBlock.text : "";

    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const jsonStr = jsonStart >= 0 && jsonEnd > jsonStart ? raw.slice(jsonStart, jsonEnd + 1) : raw;

    let parsed: { openers?: Opener[]; research_summary?: string } = {};
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return Response.json(
        { error: "The model returned a malformed response. Try again.", raw: raw.slice(0, 500) },
        { status: 502 }
      );
    }

    const openers = Array.isArray(parsed.openers) ? parsed.openers.slice(0, 3) : [];
    if (openers.length === 0) {
      return Response.json({ error: "No openers came back. Try again." }, { status: 502 });
    }

    return Response.json({
      openers,
      researchSummary: parsed.research_summary || "",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
