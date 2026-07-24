import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarClock,
  Check,
  ListChecks,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { HeroMock } from "@/components/marketing/hero-mock";
import { FREE_FEATURES, PRO_FEATURES, PRICING } from "@/lib/pricing";

export default function Landing() {
  return (
    <>
      <MarketingNav />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <Pricing />
        <FinalCTA />
      </main>
      <MarketingFooter />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[0.78rem] font-medium text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Your AI homework planner
          </span>
          <h1 className="mt-5 text-balance text-[2.6rem] font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[3.5rem]">
            Know exactly what to study next.
          </h1>
          <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-ink-muted">
            AcademiaAI automatically organizes your assignments into a personalized
            study plan — so you can finish homework faster and stress less.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] gradient-brand px-7 text-[1rem] font-medium text-white shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-glow)] hover:brightness-[1.05]"
            >
              Start free <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
            <a
              href="#how"
              className="inline-flex h-[52px] items-center justify-center rounded-[14px] border border-line-strong bg-surface px-7 text-[1rem] font-medium text-ink hover:bg-subtle transition-colors"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 flex items-center gap-2 text-[0.82rem] text-ink-muted">
            <Check className="h-4 w-4 text-emerald-brand" />
            Free to start · No credit card · Works instantly
          </p>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <HeroMock />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Problem() {
  const questions = [
    "Which assignment should I do first?",
    "How long will everything take?",
    "What's actually due tomorrow?",
    "Should I study or finish homework?",
  ];
  return (
    <section className="border-y border-line bg-subtle/40 py-20">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
        <h2 className="text-balance text-[1.8rem] font-bold tracking-[-0.02em] text-ink sm:text-[2.2rem]">
          Students spend more time deciding what to do than actually working.
        </h2>
        <p className="mt-4 text-[1rem] text-ink-muted">
          Every night ends with the same pile of questions:
        </p>
        <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
          {questions.map((q) => (
            <div
              key={q}
              className="rounded-[14px] border border-line bg-surface px-4 py-3.5 text-left text-[0.9rem] font-medium text-ink-soft"
            >
              &ldquo;{q}&rdquo;
            </div>
          ))}
        </div>
        <p className="mt-8 text-[1.05rem] font-medium text-ink">
          AcademiaAI eliminates the decision. You just open the app and start.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI prioritization",
      body: "Every assignment is ranked by due date, difficulty, time, and importance — so the top of your list is always the right thing.",
    },
    {
      icon: ListChecks,
      title: "Homework breakdown",
      body: "Big assignments become clear checklists. “Write history essay” turns into research, outline, draft, revise, submit.",
    },
    {
      icon: CalendarClock,
      title: "Smart study planner",
      body: "Your work gets scheduled around sports, clubs, work, and sleep — with breaks built in.",
    },
    {
      icon: Target,
      title: "Focus mode",
      body: "One assignment at a time with a built-in timer. No lists, no clutter — just the next thing.",
    },
    {
      icon: Upload,
      title: "Assignment import",
      body: "Paste from Google Classroom or Canvas and AcademiaAI fills in the details automatically.",
    },
    {
      icon: BarChart3,
      title: "Progress dashboard",
      body: "Streaks, hours studied, completion rate, and upcoming deadlines — your momentum, at a glance.",
    },
  ];
  return (
    <section id="features" className="py-24 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <SectionKicker>Everything in one place</SectionKicker>
          <h2 className="mt-3 text-balance text-[2rem] font-bold tracking-[-0.025em] text-ink sm:text-[2.4rem]">
            One app instead of five
          </h2>
          <p className="mt-4 text-[1rem] text-ink-muted">
            Stop juggling Classroom, Canvas, Calendar, Notes, and Reminders.
            AcademiaAI turns all of it into a single, calm plan.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-[18px] border border-line bg-surface p-6 shadow-[var(--shadow-xs)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-[13px] bg-brand-50 text-brand-600 transition-colors group-hover:gradient-brand group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[1.05rem] font-semibold tracking-[-0.01em] text-ink">
                  {f.title}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-muted">
                  {f.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Add your assignments",
      body: "Paste them from Classroom or Canvas, or add them in a few taps.",
    },
    {
      n: "02",
      title: "AI builds your plan",
      body: "Everything is prioritized and scheduled around your real life.",
    },
    {
      n: "03",
      title: "Start at the top",
      body: "Open the app and work the next thing. No deciding, no guessing.",
    },
    {
      n: "04",
      title: "Watch it get done",
      body: "Check things off, keep your streak, and finish with time to spare.",
    },
  ];
  return (
    <section id="how" className="border-y border-line bg-subtle/40 py-24 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <SectionKicker>How it works</SectionKicker>
          <h2 className="mt-3 text-balance text-[2rem] font-bold tracking-[-0.025em] text-ink sm:text-[2.4rem]">
            From overwhelmed to one clear next step
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="text-[2.2rem] font-bold tracking-[-0.03em] text-brand-200">
                {s.n}
              </div>
              <h3 className="mt-2 text-[1.05rem] font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-muted">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Pricing() {
  return (
    <section id="pricing" className="py-24 scroll-mt-16">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <SectionKicker>Pricing</SectionKicker>
          <h2 className="mt-3 text-balance text-[2rem] font-bold tracking-[-0.025em] text-ink sm:text-[2.4rem]">
            Start free. Upgrade when you&apos;re ready.
          </h2>
          <p className="mt-4 text-[1rem] text-ink-muted">
            Everything you need to stay on top of school — no credit card to begin.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Free */}
          <div className="rounded-[22px] border border-line bg-surface p-7 shadow-[var(--shadow-xs)]">
            <h3 className="text-[1.1rem] font-semibold text-ink">Free</h3>
            <p className="mt-1 text-[0.88rem] text-ink-muted">
              For getting organized and finding your rhythm.
            </p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-[2.6rem] font-bold tracking-[-0.03em] text-ink">$0</span>
              <span className="text-[0.9rem] text-ink-muted">forever</span>
            </div>
            <Link
              href="/app"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-[12px] border border-line-strong bg-surface text-[0.9rem] font-medium text-ink hover:bg-subtle transition-colors"
            >
              Start free
            </Link>
            <ul className="mt-6 space-y-3">
              {FREE_FEATURES.map((f) => (
                <FeatureLine key={f}>{f}</FeatureLine>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="relative rounded-[22px] border-2 border-brand-500 bg-surface p-7 shadow-[var(--shadow-lg)]">
            <span className="absolute -top-3 right-6 rounded-full gradient-brand px-3 py-1 text-[0.72rem] font-semibold text-white shadow-[var(--shadow-sm)]">
              Most popular
            </span>
            <h3 className="text-[1.1rem] font-semibold text-ink">Pro</h3>
            <p className="mt-1 text-[0.88rem] text-ink-muted">
              For students who want the full system.
            </p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-[2.6rem] font-bold tracking-[-0.03em] text-ink">
                {PRICING.monthly.label}
              </span>
              <span className="text-[0.9rem] text-ink-muted">/month</span>
            </div>
            <p className="mt-1 text-[0.8rem] text-emerald-700 font-medium">
              or {PRICING.annual.label}/year — save 35%
            </p>
            <Link
              href="/app"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[12px] gradient-brand text-[0.9rem] font-medium text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)] hover:brightness-[1.05] transition-all"
            >
              <Sparkles className="h-4 w-4" /> Get Pro
            </Link>
            <ul className="mt-6 space-y-3">
              {PRO_FEATURES.map((f) => (
                <FeatureLine key={f} accent>
                  {f}
                </FeatureLine>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureLine({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <li className="flex items-start gap-2.5 text-[0.88rem] text-ink-soft">
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
          accent ? "gradient-brand text-white" : "bg-emerald-soft text-emerald-700"
        }`}
      >
        <Check className="h-3 w-3" />
      </span>
      {children}
    </li>
  );
}

/* ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <section className="px-5 pb-24 sm:px-6">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] gradient-brand px-6 py-16 text-center shadow-[var(--shadow-lg)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
          aria-hidden
        />
        <div className="relative">
          <h2 className="text-balance text-[2rem] font-bold tracking-[-0.025em] text-white sm:text-[2.5rem]">
            Never wonder what to work on next again.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.05rem] text-white/85">
            Open AcademiaAI and start making progress. It takes two minutes to set up.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-white px-8 text-[1rem] font-semibold text-brand-700 shadow-[var(--shadow-md)] transition-transform hover:-translate-y-0.5"
          >
            Start free <ArrowRight className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.8rem] font-semibold uppercase tracking-wide text-brand-600">
      {children}
    </span>
  );
}
