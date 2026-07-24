# AcademiaAI

**Know exactly what to study next.**

AcademiaAI is an AI homework planner that turns a pile of assignments into an
organized daily study plan — so students stop deciding what to work on and just
start making progress.

Built with Next.js 16, React 19, Tailwind v4, Zustand, Groq, and Stripe.

---

## Why it exists

Students don't struggle because they're lazy. They struggle because school
throws dozens of assignments, tests, and deadlines at them at once — and they
spend more time deciding what to do than actually doing it.

AcademiaAI removes the decision. Open the app, and there's one clear next step.

## Features

- **AI prioritization** — every assignment ranked by due date, difficulty, time, and importance.
- **Homework breakdown** — big assignments become an ordered checklist ("essay" → research, outline, draft, revise, submit).
- **Smart study planner** — work scheduled into your real study window, around commitments and sleep, with breaks built in.
- **Focus mode** — one assignment at a time with a built-in timer.
- **Assignment import** — paste from Google Classroom / Canvas and AI fills in the details.
- **Progress dashboard** — streaks, hours focused, completion rate, upcoming deadlines.
- **Free & Pro plans** — Stripe checkout, verified on return, with a customer portal.

## Architecture

Local-first and privacy-friendly by design:

- **Data** lives in the browser (Zustand + `localStorage`). No account required, nothing on a server — it works instantly and offline.
- **AI backend** (`/api/ai/*`) uses **Groq** when `GROQ_API_KEY` is set, and falls back to deterministic heuristics so breakdown/import work with **zero keys**.
- **Billing** (`/api/stripe/*`) uses **Stripe** Checkout (inline price data — no pre-created products needed), verifies payment on return, and unlocks Pro. Without a key, "Upgrade" runs in demo mode.

```
src/
  app/
    page.tsx            # marketing landing page
    app/                # the product (Today, Assignments, Planner, Focus, Progress, Settings)
    api/ai/*            # breakdown + import (Groq → heuristic fallback)
    api/stripe/*        # checkout, verify, portal, webhook
  components/
    ui/                 # design-system primitives
    app/                # workspace components
    marketing/          # landing components
    brand/              # logo
  lib/
    store.ts            # Zustand persisted store
    priority.ts         # the prioritization engine
    planner.ts          # study-schedule builder
    selectors.ts        # derived data + smart-nudge copy
    ai/ · stripe/       # server + client helpers
```

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — app runs fully without any keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment (all optional)

| Variable | Purpose |
|---|---|
| `GROQ_API_KEY` | Smarter AI breakdown & import ([console.groq.com/keys](https://console.groq.com/keys)) |
| `GROQ_MODEL` | Model override (default `llama-3.3-70b-versatile`) |
| `STRIPE_SECRET_KEY` | Real Pro checkout & billing portal |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification |
| `NEXT_PUBLIC_SITE_URL` | OG tags + Stripe redirect URLs |

## Deploy

Deploys to **Vercel** as-is. Add the env vars above in the Vercel dashboard to
activate AI and payments. The app is fully functional without any of them.

## License

© AcademiaAI. All rights reserved.
