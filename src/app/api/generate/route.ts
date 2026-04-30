import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 90;

type Opener = {
  angle: string;
  freshness: string;
  trigger: string;
  trigger_date?: string;
  source?: string;
  line: string;
  why: string;
};

const SYSTEM_TEMPLATE = (today: string) => `You are the cold-call opener engine for Modern Seller, the B2B cold-calling Accelerator run by Luke Ross. Your job: write 3 tight, conversational openers a real B2B SDR or AE could say into a phone in under 12 seconds, each anchored in a real, dated trigger you found about the prospect or their company.

TODAY'S DATE IS ${today}. Do all date math from this. If a search result is from 2025-08, that is NOT "last month" today — it's roughly 8 months ago.

YOU HAVE WEB SEARCH. USE IT EFFICIENTLY — YOU GET 2 QUERIES.
Spend them well. Suggested split:
- Query 1: the company — recent news (funding, exec hires, launches, layoffs, expansions, acquisitions). Use the company name + likely keywords ("acquisition", "funding", "hires", or current year).
- Query 2: the prospect by name — quotes, podcasts, posts, articles, press mentions ("<full name>" + their company).
If query 1 returns a strong fresh trigger, query 2 is optional — skip it and move on. Cite the source URL for every opener that uses a real trigger.

DATE ACCURACY — THIS IS NON-NEGOTIABLE
Inaccurate dates make the rep look stupid on the call. Follow these rules without exception:

1. **Every trigger must have a verified date** from the source (the published_date or in-text date stamp). If you can't verify a date for a fact, do NOT use it as a trigger — fall back to "industry pattern".

2. **Compute the gap from today (${today}) precisely** before writing the opener. Examples (today = ${today}):
   - Source dated within last 7 days → freshness = "this week"
   - Source dated within last 30 days → freshness = "this month"
   - Source dated 31–90 days ago → freshness = "recent"
   - Source dated more than 90 days ago → freshness = "industry pattern" (do not call it recent)
   - No date → freshness = "industry pattern"

3. **Banned relative phrases in the opener line.** NEVER write "last week", "last month", "yesterday", "this morning", "recently", "just now". These are almost always wrong.

4. **Use specific date references in the opener line.** Say "in their August announcement", "their March funding round", "the Q4 hire", "back in summer". Specific. Verifiable. Not relative.

5. **Output the trigger_date** (ISO YYYY-MM-DD or YYYY-MM if only month/year known) so the rep can verify. If unknown, leave empty string.

VOICE
- Conversational, confident, slightly dry. Never corporate. Never AI-sounding.
- Short sentences. Contractions. No hype words ("revolutionary", "leverage", "synergy", "game-changing").
- Sound like a person, not a script. Allow a small imperfection or aside.
- Never use exclamation marks. Never use the word "just".
- Always use the prospect's first name once.

CHARACTERS — CRITICAL
- Output plain Unicode characters only: apostrophes ('), straight or curly quotes (" "), em-dashes (—), ellipses (…).
- NEVER output HTML entities like &apos;, &quot;, &amp;, &#39;, &lt;, &gt;. They render as literal text in the UI and look broken.
- If a web search result contains HTML-encoded text, decode it before quoting.

THE THREE OPENERS
Three different angles, each anchored to a verified signal:
1. **trigger_led** — the SHARPEST, most-recent specific signal you found and verified the date of.
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
If your searches return nothing fresh AND specific about this prospect/company, say so honestly in research_summary. Anchor trigger_led to something publicly true about the company's identity (industry, scale, business model) without inventing dated events. Tag freshness as "industry pattern".

OUTPUT FORMAT
Respond with valid JSON in this exact shape and nothing else:
{
  "research_summary": "<one short sentence describing the strongest signal you found, naming the source and date>",
  "openers": [
    {
      "angle": "trigger_led",
      "freshness": "<this week | this month | recent | industry pattern>",
      "trigger": "<one short phrase naming what the opener anchors to>",
      "trigger_date": "<YYYY-MM-DD or YYYY-MM, empty string if unknown>",
      "source": "<URL or publication name where you found it; empty string if industry pattern>",
      "line": "<the opener — no relative time phrases, use specific dates>",
      "why": "<tactical why-it-works>"
    },
    { "angle": "peer_led", "freshness": "...", "trigger": "...", "trigger_date": "...", "source": "...", "line": "...", "why": "..." },
    { "angle": "problem_led", "freshness": "...", "trigger": "...", "trigger_date": "...", "source": "...", "line": "...", "why": "..." }
  ]
}`;

// Best-effort fixer for the JSON shapes Claude occasionally emits that
// JSON.parse rejects. Walks the string char by char with a tiny state
// machine that knows whether we're inside a string literal, and:
//   - escapes raw control characters (newlines, tabs, etc.) inside string
//     values so JSON.parse accepts them
//   - strips trailing commas before } or ]
// Does NOT try to "fix" actual structural damage — if braces are unbalanced,
// the parse will still fail and we'll fall through to the retry.
function repairJson(input: string): string {
  let out = "";
  let inString = false;
  let escape = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (escape) {
      out += ch;
      escape = false;
      continue;
    }
    if (ch === "\\" && inString) {
      out += ch;
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      out += ch;
      continue;
    }
    if (inString) {
      // Escape raw control characters that JSON.parse rejects inside strings.
      const code = ch.charCodeAt(0);
      if (code === 0x0a) { out += "\\n"; continue; }
      if (code === 0x0d) { out += "\\r"; continue; }
      if (code === 0x09) { out += "\\t"; continue; }
      if (code === 0x08) { out += "\\b"; continue; }
      if (code === 0x0c) { out += "\\f"; continue; }
      if (code < 0x20) { out += "\\u" + code.toString(16).padStart(4, "0"); continue; }
      out += ch;
      continue;
    }
    // Outside strings — strip trailing commas before } or ].
    if (ch === ",") {
      let j = i + 1;
      while (j < input.length && /\s/.test(input[j])) j++;
      if (input[j] === "}" || input[j] === "]") {
        continue; // drop the trailing comma
      }
    }
    out += ch;
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { yourOffer, prospect, fallbackProspect } = body || {};

    if (!yourOffer || typeof yourOffer !== "string") {
      return Response.json({ error: "Need yourOffer (one line about what you sell)." }, { status: 400 });
    }
    if (!prospect?.firstName || !prospect?.lastName) {
      return Response.json({ error: "Need prospect.firstName and prospect.lastName." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Server is missing ANTHROPIC_API_KEY." }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const fullName = `${prospect.firstName} ${prospect.lastName}`.trim();

    const userMsg = `Write 3 cold-call openers for this prospect. Use web search to find live, dated triggers.

PROSPECT
- Full name: ${fullName}
- Role / title: ${prospect.role || "(unknown)"}
- Company website: ${prospect.companyWebsite || "(unknown)"}
${prospect.linkedinUrl ? `- LinkedIn (for disambiguation): ${prospect.linkedinUrl}` : ""}
${fallbackProspect ? `- Notes from the rep: ${fallbackProspect}` : ""}

WHAT THE REP SELLS
- ${yourOffer}

Search the web for: recent posts/quotes from "${fullName}" + their company, recent news about ${prospect.companyWebsite || "the company"}, recent funding/hires/launches/acquisitions.

CRITICAL DATE CHECK — TODAY IS ${today}.
For every fact you find, verify the source's published date. Compute the days since publication. Apply the freshness rules from your instructions strictly. NEVER write "last month" or "recently" in the opener line itself — use the specific month/year ("in March", "their August announcement", "the Q4 funding round").

Respond with the JSON object only, no markdown, no commentary. Cite the source URL for every opener with a real trigger.`;

    // Try the Claude call up to 2 times. Most "malformed response" failures are
    // transient — Claude occasionally formats output in ways our parser can't
    // recover from (raw newlines in strings, prose around the JSON, etc.).
    // A second attempt almost always returns clean JSON, and the user never
    // sees the failure.
    type ParseResult =
      | { ok: true; parsed: { openers?: Opener[]; research_summary?: string } }
      | { ok: false; reason: string; rawPreview: string; stopReason: string | null };

    async function attemptGenerate(attemptIdx: number): Promise<ParseResult> {
      const stream = await client.messages.stream({
        model: "claude-sonnet-4-6",
        max_tokens: 2400,
        // First attempt: 2 web_search uses. Retry: 1 use to stay well within the
        // 90s function ceiling even after the first attempt's web-search latency.
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: attemptIdx === 0 ? 2 : 1 }],
        system: [{ type: "text", text: SYSTEM_TEMPLATE(today) }],
        messages: [{ role: "user", content: userMsg }],
      });
      const finalMessage = await stream.finalMessage();
      const stopReason = finalMessage.stop_reason;
      const textBlock = finalMessage.content.find((b) => b.type === "text");
      const raw = textBlock && textBlock.type === "text" ? textBlock.text : "";

      if (stopReason === "max_tokens") {
        return { ok: false, reason: "max_tokens", rawPreview: raw.slice(0, 600), stopReason };
      }

      // Strip markdown fences and isolate the outermost JSON object.
      let cleanedRaw = raw.trim();
      if (cleanedRaw.startsWith("```")) {
        cleanedRaw = cleanedRaw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
      }
      const jsonStart = cleanedRaw.indexOf("{");
      const jsonEnd = cleanedRaw.lastIndexOf("}");
      let jsonStr = jsonStart >= 0 && jsonEnd > jsonStart ? cleanedRaw.slice(jsonStart, jsonEnd + 1) : cleanedRaw;

      try {
        return { ok: true, parsed: JSON.parse(jsonStr) };
      } catch {
        // Lenient repair pass — handle the common JSON breakers Claude emits:
        // raw control characters inside string values, and trailing commas.
        // Belt-and-suspenders before falling through to a retry.
        try {
          const repaired = repairJson(jsonStr);
          return { ok: true, parsed: JSON.parse(repaired) };
        } catch (parseErr) {
          return {
            ok: false,
            reason: parseErr instanceof Error ? parseErr.message : String(parseErr),
            rawPreview: raw.slice(0, 600),
            stopReason,
          };
        }
      }
    }

    let result = await attemptGenerate(0);
    if (!result.ok) {
      console.warn("[/api/generate] attempt 1 failed, retrying once.", {
        reason: result.reason,
        stopReason: result.stopReason,
        rawPreview: result.rawPreview,
      });
      result = await attemptGenerate(1);
    }

    if (!result.ok) {
      console.error("[/api/generate] both attempts failed.", {
        reason: result.reason,
        stopReason: result.stopReason,
        rawPreview: result.rawPreview,
      });
      return Response.json(
        {
          error:
            result.reason === "max_tokens"
              ? "Response was cut short twice. Try a simpler prospect or try again in a moment."
              : "The model returned a malformed response twice. Please try again.",
        },
        { status: 502 }
      );
    }

    const parsed = result.parsed;

    const openers = Array.isArray(parsed.openers) ? parsed.openers.slice(0, 3) : [];
    if (openers.length === 0) {
      return Response.json({ error: "No openers came back. Try again." }, { status: 502 });
    }

    // Safety net — strip HTML entities the model sometimes echoes from search results.
    // Claude is instructed not to emit these, but we sanitize anyway so a slip never
    // surfaces as literal "I&apos;ve" text in the UI.
    const decode = (s: unknown): string =>
      typeof s !== "string" ? (s as string) : s
        .replaceAll("&apos;", "'")
        .replaceAll("&#39;", "'")
        .replaceAll("&quot;", '"')
        .replaceAll("&#34;", '"')
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&nbsp;", " ")
        .replaceAll("&mdash;", "—")
        .replaceAll("&ndash;", "–")
        .replaceAll("&hellip;", "…")
        // Decode &amp; LAST so we don't double-decode (e.g. &amp;apos;)
        .replaceAll("&amp;", "&");

    const cleaned = openers.map((o) => ({
      ...o,
      trigger: decode(o.trigger),
      source: decode(o.source ?? ""),
      line: decode(o.line),
      why: decode(o.why),
    }));

    return Response.json({
      openers: cleaned,
      researchSummary: decode(parsed.research_summary || ""),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
