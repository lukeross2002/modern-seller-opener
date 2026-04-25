# Modern Seller · Opener Generator

Free cold-call opener generator that doubles as the lead magnet for the Modern Seller cohort.

Visitors paste a prospect (name, role, company, anything they found on LinkedIn). The tool returns 5 tailored openers in the Modern Seller voice — each with the tactical reason it works. Email-gated, with the captured leads forwarded to your CRM/email tool via webhook.

Built to look and feel exactly like [modernseller.ai](https://modernseller.ai).

## What's inside

- **Landing page** (`/`) — hero, stat strip, how-it-works, sample openers, cohort upsell, FAQ
- **Tool page** (`/tool`) — email gate, then the 5-opener generator
- **`POST /api/lead`** — captures the email and forwards to your webhook (Zapier, ConvertKit, n8n, Make, etc.)
- **`POST /api/generate`** — calls Claude (Sonnet 4.6) with a tightly-tuned system prompt to produce 5 openers in Luke's voice as JSON

## One-time setup

You need exactly two environment variables. Vercel is the easiest place to set them.

| Var | What it is | Required? |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Claude API key from https://console.anthropic.com/ | Yes — the generator can't run without it |
| `LEAD_WEBHOOK_URL` | A URL that receives a POST every time someone unlocks the tool. Connect it to ConvertKit, Mailchimp, Beehiiv, Zapier, n8n — anything that listens for webhooks. | No — without it, leads only get logged. Strongly recommended for the day-3 follow-up email automation. |

Copy `.env.example` to `.env.local` and fill them in for local dev.

## The day-3 upsell

The tool itself doesn't send email. It hands the captured email to your webhook. The recommended flow:

1. **Day 0** (immediately): your email tool sends a welcome + the playbook PDF you promised
2. **Day 3-4**: your email tool sends the upsell — "you've used the opener tool, here's the cohort"

Set this up once in your email tool of choice (ConvertKit/Beehiiv/etc.) and every captured lead flows through it automatically.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## Deploy

```bash
# easiest: push to GitHub, then import the repo on vercel.com
# add ANTHROPIC_API_KEY and LEAD_WEBHOOK_URL in the Vercel project settings
```

That's it.
