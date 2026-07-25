# AcademiaAI — Launch Plan & Ad Kit

**Live app:** https://academia-ai-delta.vercel.app
**Repo:** github.com/svaka2000/academia-ai
Companion: [MARKETING.md](MARKETING.md) (TikTok decks, App Store copy, Reddit/PH/X posts).

Positioning rule, everywhere: **sell clarity, not AI.** Lead with the outcome.

---

## 0. Attach your custom domain (when you buy it)

In `~/academia-ai`:
```bash
vercel domains add yourdomain.com --scope svaka2000s-projects
vercel alias set academia-ai-delta.vercel.app yourdomain.com --scope svaka2000s-projects
```
Then point DNS at Vercel (it prints the exact records — usually an `A` record to `76.76.21.21`
and a `CNAME` for `www` to `cname.vercel-dns.com`). After it resolves, update the env var so
OG tags/Stripe redirects use it:
```bash
printf "https://yourdomain.com" | vercel env add NEXT_PUBLIC_SITE_URL production --force --scope svaka2000s-projects
vercel --prod --yes --scope svaka2000s-projects
```
Good domain candidates: `academia-ai.app`, `academiaai.study`, `getacademia.ai`, `academia.study`.

---

## 1. Who we're winning (ICP)

- **Primary:** high-school students 14–18, especially AP/honors kids with 5–7 classes, a
  sport/job/club, and deadline overwhelm. They live on TikTok and search "how to stop
  procrastinating."
- **Secondary:** college underclassmen; parents buying Pro for a struggling teen.
- **The wedge feeling:** "I have so much to do and no idea where to start." We sell the
  relief of *one clear next step*.

## 2. Channels, ranked by leverage

| # | Channel | Why | Effort |
|---|---|---|---|
| 1 | **TikTok/Reels/Shorts** (faceless slideshows) | ICP lives here; zero ad spend; already have 8 decks + 360-post calendar | High volume, low $ |
| 2 | **Reddit** (r/GetStudying, r/apstudents, r/highschool, r/productivity) | High-intent, tolerates genuine free tools | Low |
| 3 | **Product Hunt launch** | Credibility, backlinks, first power users | One-day push |
| 4 | **SEO / programmatic** | "study planner", "how to prioritize homework", "AP study schedule" | Slow burn |
| 5 | **Paid (later)** | Only after an organic hook proves out (>50k-view TikTok → Spark Ad; then IG/TikTok ads with the ChatGPT creative below) | $ |

## 3. Funnel & KPIs

```
Content (TikTok/Reddit) → bio/link click → landing → "Start free" → onboarding done
→ first assignment added → activation (first task completed) → habit (3-day streak) → Pro
```
Track weekly:
- **Reach:** views, saves/shares (shares = the real signal).
- **Top of funnel:** landing visits, "Start free" clicks.
- **Activation:** % who finish onboarding + add ≥1 assignment.
- **Retention:** % hitting a 3-day streak (this is the leading indicator of Pro).
- **Revenue:** free→Pro conversion (target 2–4% of activated users once Stripe is live).

North-star for the first 90 days: **activated users** (added an assignment), not signups.

## 4. The 4-week launch sprint

**Week 0 — prep (done + you):**
- ✅ App live, 8 TikTok decks + calendar rendered, launch copy written.
- You: create 2–3 TikTok accounts (`@academiaai.study`, `@studysmarter.*`), set each bio link
  to the app; buy the domain; add your Stripe key to Vercel; generate the ChatGPT ads (§5).

**Week 1 — seed volume:**
- Post 3–5 decks/day/account (Photo mode). Reply to every comment.
- Soft Reddit share in 2 subs (genuine tone, the MARKETING.md post).
- Watch for a breakout (>10k views) — that's your winning hook.

**Week 2 — double down + Product Hunt:**
- Re-cut the best hook 3 more ways; kill dead hooks.
- Launch on Product Hunt (Tue–Thu, 12:01am PT). Rally friends for early upvotes/comments.
- Start capturing screenshots of real usage for social proof (once you have users).

**Week 3 — widen:**
- Add 5–10 new deck hooks (`~/marketing-engine/apps/academia.json` → `node generate.mjs academia`).
- Begin light SEO: a blog post "How to decide what homework to do first" → link to app.
- First creative-test of the ChatGPT ads organically (post as static IG/feed).

**Week 4 — spend where it works:**
- Whitelist any TikTok >50k views as a $20–50/day Spark Ad.
- Turn the best ChatGPT ad into an IG/TikTok ad set, small budget, measure cost-per-activation.
- Review KPIs; reallocate to whatever produced activated users.

---

## 5. Ad creative for ChatGPT image generation

**How to use:** paste the **Brand block** once to prime the chat, then paste any **Ad prompt**.
GPT image gen garbles long text — keep on-image words to the short strings given. If a headline
renders messy, generate the *visual clean* and add the text yourself in Canva/Figma (Inter, the
hex colors below). Generate each at the stated aspect ratio.

### Brand block (paste first)
> You are designing ads for **AcademiaAI**, an AI homework planner for high-school students.
> Brand style: **Apple-meets-Linear** — calm, minimal, premium, intelligent, lots of white
> space, soft shadows, rounded corners, no clutter, no clip-art, no emoji.
> Colors: royal blue **#2563EB**, indigo **#4338CA**, emerald **#10B981**, off-white **#F8FAFC**,
> dark navy text **#0F172A**. Typography: **Inter** (bold headlines, regular body).
> Logo concept: a minimal geometric letter "A" made of two ascending strokes with a small
> emerald 4-point sparkle. Tone: trustworthy, quiet confidence. Never look like a cheesy ed-tech
> ad. Sell **clarity**, not "AI".

### Ad 1 — Hero (feed 1:1 and story 9:16)
> A clean, premium product ad on an off-white (#F8FAFC) background. Centered: a modern iPhone
> showing a minimal study-planner app — a short prioritized list of homework cards, the top card
> highlighted as "next up", generous white space, royal-blue (#2563EB) and emerald (#10B981)
> accents. Soft realistic shadow under the phone. Large bold Inter headline space at top reading
> "Know exactly what to study next." Tiny wordmark "AcademiaAI" bottom-center. Apple-style
> minimalism, studio lighting. Aspect ratio 1:1. (Also generate a 9:16 version.)

### Ad 2 — Chaos → Clarity (1:1)
> A split-composition ad. LEFT half: visual chaos — scattered sticky notes, tangled reminders,
> five different app icons, a stressed muted palette. RIGHT half: calm — a single clean phone
> showing one clear prioritized plan on off-white, royal-blue and emerald accents, lots of white
> space. A thin vertical divider. Minimal bold Inter caption area: "From overwhelmed to one clear
> next step." Premium, Linear-style. No emoji, no clutter. Aspect ratio 1:1.

### Ad 3 — POV / relatable (portrait 4:5)
> A relatable, aspirational lifestyle ad for students. A calm high-schooler at a tidy desk in
> soft natural light, phone in hand showing a clean minimal homework plan (blue/emerald accents,
> lots of white space), looking relieved and focused — not stressed. Muted, warm, premium
> photography style. Leave clean space at the top for a short bold Inter headline: "POV: you
> finally know what to do first." Small "AcademiaAI" wordmark. Aspect ratio 4:5.

### Ad 4 — Feature trio / App Store style (9:16, make 3)
> A premium App-Store-style promo panel, off-white background, one floating iPhone screenshot
> centered with a soft shadow, a short bold Inter caption above it. Minimal, blue/emerald accents.
> Make three versions with captions: (a) "Your day, already sorted." (b) "Big assignments →
> simple steps." (c) "One task. One timer. Done." Aspect ratio 9:16 each.

### Ad 5 — Focus mode / emerald (1:1)
> A calm, focused ad. A phone centered on a soft off-white-to-pale-blue gradient, screen showing
> a single large circular timer with one task title beneath it (emerald #10B981 progress ring).
> Everything else stripped away. Bold Inter headline space: "One thing at a time." Premium,
> meditative, Apple-minimal. Small "AcademiaAI" wordmark. Aspect ratio 1:1.

### Ad 6 — Value card (1:1, text-light)
> A minimal typographic ad, deep navy-to-indigo gradient background (#1e3a8a → #0b1220), a single
> bold white Inter line centered: "Stop deciding. Start doing." A small emerald 4-point sparkle
> accent and a small "AcademiaAI — your AI homework planner" wordmark at the bottom. No imagery,
> pure premium type. Aspect ratio 1:1.

**Ad copy to pair with each (captions / primary text):**
- "You're not lazy — you just have too many decisions. AcademiaAI makes the call for you. Free → link in bio."
- "Homework isn't the hard part. Deciding what to do first is. We fixed that."
- "Paste your assignments. Get one clear plan. Finish with time to spare."
- "The planner that tells you the *one* thing to do next. Start free."

---

## 6. Budget guidance
- **$0 phase (weeks 1–3):** all organic — TikTok volume + Reddit + Product Hunt. This is where
  a student app actually breaks out; don't pay until a hook proves out.
- **First $100–300 (week 4+):** only behind a *proven* organic winner (Spark Ad on a >50k-view
  TikTok, or the best ChatGPT ad as an IG/TikTok test). Optimize for **cost per activated user**,
  not installs.
