@AGENTS.md

# Modern Seller — Opener Tool (Lead Magnet)

A free cold-call opener generator that funnels prospects into the **Modern Seller Accelerator** (Luke Ross's paid 4-week program). Built as a Hormozi-style lead magnet — solves one specific pain (the first 10 seconds of a cold call) so well that prospects want to buy the full system.

## The user — Luke Ross

- Founder of Modern Seller (modernseller.ai), B2B cold-calling coach
- Runs the Modern Seller Accelerator: 10 reps, 4 weeks, hands-on (NOT "every cold call gets reviewed by me" — that's an overpromise)
- **Non-coder.** Expects autonomous execution. Don't ask permission for technical decisions — pick a sensible default and ship. Only stop for credentials, destructive actions, or genuine forks in the road.
- Hates over-promising / corporate language / anything that breaks the 4th wall (e.g. don't ever call this "a lead magnet" in user-facing copy — that line was killed for that exact reason)
- Knows Hormozi's *$100M Offers* and *$100M Leads*. Apply MAGIC framework to naming, value stacking + scarcity to upsells.

## Live URLs

| Surface | URL |
|---|---|
| Production (custom domain) | https://opener.modernseller.ai |
| Production (Vercel default) | https://modern-seller-opener.vercel.app |
| GitHub repo | https://github.com/lukeross2002/modern-seller-opener |
| Vercel project | `lukes-projects-d145acd8/modern-seller-opener` |

## Tech stack

- **Next.js 16.2.4** with App Router and Turbopack — **NOTE:** Next 16 has breaking changes vs older versions. ALWAYS read `node_modules/next/dist/docs/` before writing Next-specific code (see `AGENTS.md`).
- **React 19.2.4**
- **TypeScript** (strict, src dir, `@/*` import alias)
- **Tailwind CSS v4** (with `@theme inline` directive)
- **@anthropic-ai/sdk** for Claude API + web search tool
- **Hosted on Vercel** (Pro plan — `maxDuration: 90` works for /api/generate)
- **Node runtime** for all API routes (not Edge — needed for the Anthropic SDK)

## Folder structure

```
modern-seller-opener/
├── public/
│   └── modern-seller-logo.png   ← official MS logo, downloaded from modernseller.ai
├── src/
│   ├── app/
│   │   ├── layout.tsx            ← root layout, Inter font, metadata
│   │   ├── page.tsx              ← landing page (hero, stats, how-it-works, examples, accelerator upsell, FAQ)
│   │   ├── globals.css           ← design system (colors, gradients, .btn-primary, .pill, .card, etc.)
│   │   ├── tool/page.tsx         ← /tool route — wraps <OpenerTool />
│   │   └── api/
│   │       ├── generate/route.ts ← POST: takes prospect, calls Claude w/ web_search, returns 3 openers
│   │       ├── lead/route.ts     ← POST: takes email + first name, subscribes to Kit form
│   │       └── research/route.ts ← DEPRECATED — leftover from NinjaPear era, can delete
│   └── components/
│       ├── Nav.tsx                  ← top nav with logo + CTA
│       ├── Footer.tsx               ← bottom footer
│       ├── OpenerTool.tsx           ← email gate + 4-step form + loading bar + results panel
│       ├── AcceleratorTeasers.tsx   ← 4 locked tools (Discovery / Objection / VM / Call Audit) — Hormozi drug-dealer pull, used in OpenerTool empty + results states
│       └── FAQ.tsx                  ← animated accordion (CSS Grid 0fr→1fr trick) — replaces native <details>
├── AGENTS.md                     ← Next.js 16 docs warning (don't override)
├── CLAUDE.md                     ← this file
└── README.md                     ← user-facing setup docs
```

## Design system (matches modernseller.ai exactly)

Read `src/app/globals.css` for the canonical values. Key tokens:

| Token | Value | Used for |
|---|---|---|
| `--background` | `#07070d` | Page bg (near-black with blue tint) |
| `--foreground` | `#f4f4f8` | Body text |
| `--muted` | `#9ca0b0` | Eyebrow text, helper text |
| `--muted-soft` | `#cfd2dd` | Body paragraph text on cards |
| `--card` | `#0c0c14` | Card background |
| `--border` | `rgba(255,255,255,0.08)` | Card borders, dividers |
| `--grad-1` | `#5AA1FF` | Gradient stop 1 (blue) |
| `--grad-2` | `#8D7BFF` | Gradient stop 2 (violet — also accent / glow color) |
| `--grad-3` | `#C68FFF` | Gradient stop 3 (magenta-purple) |
| `--pill-border` | `rgba(180,150,255,0.3)` | Scarcity pill border |

**Font:** Inter (Google Fonts via `next/font/google` in `layout.tsx`), variable `--font-inter`.

**Gradient text** — apply class `gradient-text`:
```css
background: linear-gradient(120deg, #5AA1FF 0%, #8D7BFF 50%, #C68FFF 100%);
```
This is the EXACT gradient from modernseller.ai. Don't substitute.

**Primary CTA** — class `btn-primary`. 12px radius (NOT a full pill), gradient bg `linear-gradient(135deg, #8D7BFF, #C68FFF)`, dark text `#0C0C18`, glow shadow. Used on the main "Generate openers" / "Apply for the next cohort" CTAs.

**Ghost button** — class `btn-ghost`. Transparent bg, subtle border, used as the secondary action.

**Nav button** — class `btn-nav`. Smaller pill (999px radius), same gradient — used in the top nav only.

**Pill** — class `pill`. Used for scarcity badges ("10 SPOTS PER COHORT", "FREE TOOL · BUILT BY LUKE ROSS"). Has a glowing dot via `.dot` child.

**Card** — class `card`. Standard rounded container with subtle border and dark fill.

**Opener card** — class `opener-card`. Slightly different bg with a subtle violet tint, used for individual opener results.

**Smooth scroll** — `html { scroll-behavior: smooth; scroll-padding-top: 6rem; }` (matches modernseller.ai feel; respects `prefers-reduced-motion`).

## Pages and what's on each

### `/` (landing — `src/app/page.tsx`)

In top-to-bottom order:

1. **Nav** — logo + "How it works / Examples / Meet Luke / Tiers / FAQ" + "Open the tool" button
2. **Hero** — pill ("Free tool · Built by Luke Ross, founder of modernseller.ai") + H1 ("Openers that actually book.") + subhead + dual CTA
3. **Stat strip** — 50K+ / $2M+ / 195% / 40+ (centered, gradient numbers)
4. **How it works** — 3-step grid (Drop their name + company → We search the live web → 3 openers, 3 angles)
5. **Why these are this good** + **The Modern Seller Accelerator** — 2-col positioning cards. The right card is the visually-elevated conversion target with scarcity pill, stat strip (4 weeks / 10 reps / 3–5x meetings), gradient CTA.
6. **Examples** — 3 hardcoded sample openers (trigger-led / peer-led / problem-led) with "Why it works"
7. **Big upsell section** — full Hormozi value stack: scarcity pill, headline ("Openers fix the first 10 seconds. The Accelerator fixes everything after."), 6-item value stack, dream outcome line, "Apply for the next cohort" primary CTA, urgency tag
8. **FAQ** — 7 questions, rendered via `<FAQ>` client component (smooth-animated accordion), all reframed to lower objections to the Accelerator
9. **Footer**

### `/tool` (`src/app/tool/page.tsx` + `src/components/OpenerTool.tsx`)

- Pill ("OPENER GENERATOR · FREE")
- H1 ("Build your opener.")
- Subhead ("Drop in your prospect's name and company. We search the live web for fresh signals…")
- `<OpenerTool />`:
  - **Email gate** (when not unlocked): "You're one step away." → first name (required) + email (required) → "Unlock the tool". Stripped of all overpromising — no playbook/cheat-sheet/follow-up promises. Submission posts to `/api/lead`.
  - **Generator form** (when unlocked): 4 steps (company website → first name + last name + role → what you sell → optional notes). Posts to `/api/generate`.
  - **Empty state** (post-unlock, pre-generation): placeholder card + `<AcceleratorTeasers variant="empty" />` — pre-loads the drug-dealer pull before they even generate.
  - **Loading state**: asymptotic progress bar (`progress = 1 - exp(-elapsed/18s)` — always moves, never hits 100% until response lands) + rotating stage labels driven by elapsed seconds.
  - **Results state**: research summary card + 3 opener cards (each with angle, freshness tag, line, anchored-to + source link, why-it-works) + `<AcceleratorTeasers variant="results" />`.

## API routes

### `POST /api/generate`

The brain. Single Claude call with the `web_search_20260209` tool (server-side, auto-loops). Streamed via `stream.finalMessage()` to keep the Vercel HTTP connection warm.

**Inputs:** `{ yourOffer, prospect: { firstName, lastName, role?, companyWebsite? }, fallbackProspect? }`

**Critical implementation details:**
- Today's date is injected into the system prompt fresh per request — DO NOT cache the system block (caching across days would silently use yesterday's date).
- `max_uses: 2` on the web_search tool — keeps total time under the Vercel ceiling.
- `max_tokens: 1600` — empirically tight enough; bigger values make generation slower without quality gains.
- `maxDuration: 90` (Vercel function timeout). Real-world generations land at 25–50s.
- **Date accuracy rules in system prompt:** banned relative phrases ("last month", "this week", "recently") in opener lines; require specific date references ("in their August announcement"). Each opener has a `trigger_date` field for verification.
- **HTML entity sanitizer** — `decode()` runs over every output string to strip `&apos;`, `&quot;`, `&amp;`, etc. that Claude sometimes echoes from web search results.
- **Output JSON schema:** `{ research_summary, openers: [{ angle, freshness, trigger, trigger_date, source, line, why }] }`. Three angles: `trigger_led`, `peer_led`, `problem_led`.

### `POST /api/lead`

Wires the email gate to Kit (formerly ConvertKit).

**Inputs:** `{ email, firstName, source }`. Validates both are present.

**Flow:** POSTs to `https://api.convertkit.com/v3/forms/{KIT_FORM_ID}/subscribe` with `api_key`, `email`, `first_name`. Always returns `ok` to the client even on Kit failure — never block the user from using the tool because of a downstream API hiccup.

**Backup webhook** — if `LEAD_WEBHOOK_URL` is set, also POSTs there for redundancy. Currently unset.

### `POST /api/research` — **DEPRECATED, safe to delete**

Leftover from when we used NinjaPear (formerly Proxycurl) for company/employee lookups. We migrated to Claude's built-in web_search and dropped NinjaPear entirely. The route still works but is unreferenced by the UI.

## Environment variables (Vercel production)

| Name | What it's for | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API for /api/generate | Yes |
| `KIT_API_KEY` | ConvertKit v3 API key (Luke's account) | Yes |
| `KIT_FORM_ID` | `9369753` — "Modern Seller Opener Tool" form | Yes |
| `PROXYCURL_API_KEY` | NinjaPear key — UNUSED, can delete | No |
| `LEAD_WEBHOOK_URL` | Optional backup webhook for lead capture | No |

To list / change: `vercel env ls production` and `vercel env add <NAME> production`. (Vercel CLI is at `~/.npm-global/bin/vercel`, GitHub CLI at `~/bin/gh`.)

## External services

- **Anthropic** — Claude Sonnet 4.6 with `web_search_20260209` tool. Cost: ~$0.05–0.10 per generation.
- **Kit (ConvertKit)** — email capture + automation platform. Luke owns the account. Free tier (10K subs). Form ID `9369753` is "Modern Seller Opener Tool" — automation sequence is on Luke's TODO list.
- **Vercel** — hosting + DNS. Custom domain `opener.modernseller.ai` set up via subdomain (Path B) — DNS A record on Namecheap pointing to `76.76.21.21`.
- **NinjaPear (nubela.co)** — DEPRECATED. Originally used for LinkedIn → company/person research. Removed when we switched to Claude web search.

## Brand voice rules (DO and DON'T)

**DO:**
- Use Modern Seller's voice — confident, direct, slightly dry, no hype words
- Write contractions ("you're", "we're"), not formal English
- Apply Hormozi positioning to upsell sections (scarcity, value stack, dream outcome, time interval, container word)
- Cite the SOURCE for every opener trigger so the rep can verify it's real
- Use "the Accelerator" (capital A) — that's the name of the paid product

**DON'T:**
- ❌ Say "the tool is the lead magnet" — breaks the 4th wall, kills conversion. Killed once, do not bring back.
- ❌ Say "every cold call you make gets reviewed by me" — overpromise, NOT TRUE. Use "hands-on, live cold-calling sessions, real call reviews" instead.
- ❌ Use the word "cohort" as the product name — the product is **Accelerator**. "Cohort" only when you mean the group of 10 reps within an Accelerator run.
- ❌ Mention what they'll receive (playbook PDF, cheat sheet, day-3 follow-up) on the email gate — creates objections instead of removing them. Just promise tool access.
- ❌ Use exclamation marks. Use the word "just".
- ❌ Use HTML entities like `&apos;`, `&quot;` inside JS string values — JSX only decodes them in static text, not in `{expression}` values, so they render as literal `&apos;` text. Use real apostrophes (`'` or `'`) instead.
- ❌ Make Step 02's body talk about "headcount, key execs, role tenure" (NinjaPear-era language). It's now "live web search".

## Hormozi positioning patterns used on the page

| Where | Pattern |
|---|---|
| Hero pill | Authority anchor: "Built by Luke Ross, founder of modernseller.ai" |
| Stat strip | Social proof: 50K+ calls / $2M+ closed / 195% quota / 40+ reps |
| "Why these are this good" card | Reframe: "You're seeing the framework, not the system" — positions tool as proof of bigger system |
| Accelerator preview card | Scarcity pill (10 spots) + stat strip (4/10/3-5x) + gradient CTA |
| Big upsell section | Full MAGIC: scarcity pill + reframed headline + 6-item value stack + dream outcome + "Apply for the next cohort" CTA + urgency tag ("Cohort 01 fills fast · Application takes 60 seconds") |
| FAQ | Each question pre-answers an Accelerator objection (price, time, differentiation, scarcity, results-time, fit) |
| `<AcceleratorTeasers>` (drug-dealer move) | 4 locked-tool cards (Discovery Q Engine, Objection Rebuttal Engine, Voicemail Script Builder, Live Call Audit) — each badged "In the Accelerator", whole-card clickable to apply, single "Get the rest →" CTA at bottom. Renders in BOTH the OpenerTool empty state AND the post-results state. This is the highest-pressure conversion mechanism on the site. |

## Domain and deployment

- **Custom domain:** `opener.modernseller.ai` (subdomain via DNS A record `76.76.21.21` at Namecheap)
- **Vercel default:** `modern-seller-opener.vercel.app` (always works, parallel to custom domain)
- **GitHub repo:** auto-pushes don't trigger Vercel deploys (the GitHub→Vercel link wasn't connected during initial setup) — use `vercel deploy --prod --yes` from the repo root to ship.

**Standard ship sequence:**
```
git add -A && git commit -m "..." && git push
vercel deploy --prod --yes
```

## Open decisions (waiting on Luke)

1. **Product name** — currently still "Modern Seller · Opener Generator". Luke is choosing between:
   - **Cold Open Lab** (recommended — playful, brandable, "Lab" = container word)
   - **Cold Open AI** (puny on OpenAI, modern, viral)
   - **The 10-Second Lab** (most Hormozi-correct, hyper-specific)
   When picked, swap in: `<title>` tag, OG metadata, hero pill, nav wordmark, footer.
2. **Kit email sequence** — Luke is writing this in Kit's UI. The form (ID `9369753`) is wired up; once he creates the welcome email + day-3 broadcast, leads flow automatically.
3. **API key rotation** — Luke pasted both his Anthropic key and Kit key in chat. He should rotate both once the build is locked in; I'll swap the new ones into Vercel env vars.

## Known gotchas / lessons learned

- **NinjaPear (Proxycurl) is sunset** — the LinkedIn URL endpoint we originally built around no longer exists. The new product takes company website + name only. We bypassed both by using Claude's built-in web search.
- **Vercel function timeout** — at one point `max_uses: 3` on web_search caused a 60s timeout. Dropped to 2 + bumped `maxDuration` to 90s. If generations start failing, lower `max_tokens` first or `max_uses` second.
- **DNS negative caching** — when adding the custom subdomain, expect 5–30 min for the user's local resolver to drop the cached NXDOMAIN. Verify globally with `dig @8.8.8.8` and `dig @1.1.1.1` before assuming there's a real problem.
- **JSX entity rendering** — React decodes `&apos;` etc. in JSX *static text* but NOT in `{expression}` values. If you put `&apos;` inside a JS string that's then rendered via `{variable}`, it shows as literal `&apos;`. Same for hardcoded openers in arrays. The `decode()` sanitizer in `/api/generate` covers the dynamic case; for hardcoded examples, just use real apostrophes.
- **Claude doesn't know today's date** unless you tell it. Inject `today` into the system prompt fresh per request, do NOT cache the system block (caching across days = yesterday's date silently used).
- **Loading bar feel** — never use a linear bar that caps at 95% then freezes. Use an asymptotic curve (`1 - exp(-elapsed/k)`) so the bar always moves but never hits 100% until the actual response lands. Pair with elapsed-second-driven stage labels.
- **Smooth scroll on hash anchors** — Next.js `<Link href="#section">` for hash anchors uses programmatic scrolling that bypasses the CSS `scroll-behavior: smooth` from globals.css. For same-page anchor jumps, use a plain `<a href="#section">` instead — native browser behavior respects the smooth scroll. The `<Link>` is fine for cross-page hash navigation (`/#section` from another route).
- **Animating `<details>` is painful** — native HTML `<details>` doesn't support height transitions. The `<FAQ>` component uses the CSS Grid `0fr → 1fr` trick: animate `grid-template-rows` on a wrapper, give the inner div `overflow: hidden`, and the content slides smoothly. Cross-browser, zero dependencies. Use this pattern any time you need to animate "auto height" content.
