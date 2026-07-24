import { Check, Clock, Sparkles, Target } from "lucide-react";

/** A stylized "Today" screen used as the hero visual. Pure CSS, on-brand. */
export function HeroMock() {
  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute -inset-4 rounded-[32px] bg-brand-200/30 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-[24px] border border-line bg-surface shadow-[var(--shadow-lg)]">
        {/* Window bar */}
        <div className="flex items-center gap-1.5 border-b border-line bg-subtle/60 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="ml-3 text-[0.7rem] font-medium text-ink-faint">
            AcademiaAI — Today
          </span>
        </div>

        <div className="p-5">
          <div className="mb-1 text-[1.05rem] font-bold tracking-[-0.02em] text-ink">
            Good afternoon, Sam
          </div>
          <div className="mb-4 text-[0.78rem] text-ink-muted">
            4 things to work through. Start at the top.
          </div>

          {/* Nudge */}
          <div className="mb-4 flex items-start gap-2.5 rounded-[14px] gradient-brand-soft border border-brand-100 p-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] gradient-brand text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <p className="text-[0.78rem] font-medium leading-snug text-ink">
              You can finish Chemistry in about 45 min before wrestling practice.
            </p>
          </div>

          {/* Next up */}
          <div className="mb-2.5 rounded-[14px] border border-brand-200 bg-surface p-3.5 shadow-[var(--shadow-sm)]">
            <span className="mb-1.5 inline-flex items-center gap-1 rounded-full gradient-brand px-2 py-0.5 text-[0.6rem] font-semibold text-white">
              <Target className="h-2.5 w-2.5" /> Next up
            </span>
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-line-strong" />
              <div className="min-w-0 flex-1">
                <div className="text-[0.85rem] font-semibold text-ink">
                  AP US History DBQ essay
                </div>
                <div className="mt-1 flex items-center gap-2 text-[0.68rem] text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                    AP US History
                  </span>
                  <span className="text-amber-brand font-medium">Due tomorrow</span>
                  <span className="inline-flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" /> 1h 30m
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-2/5 rounded-full bg-emerald-brand" />
                </div>
              </div>
            </div>
          </div>

          {/* Other rows */}
          {[
            { t: "Calc BC — Section 7.4 problem set", c: "Calculus BC", d: "Due in 6h", dot: "#0891b2" },
            { t: "Chemistry lab report: titration", c: "Chemistry", d: "2 days left", dot: "#059669" },
          ].map((r) => (
            <div
              key={r.t}
              className="mb-2 flex items-center gap-2.5 rounded-[12px] border border-line bg-surface p-3"
            >
              <span className="h-4 w-4 shrink-0 rounded-full border-2 border-line-strong" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[0.8rem] font-medium text-ink">{r.t}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[0.66rem] text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.dot }} />
                    {r.c}
                  </span>
                  <span>{r.d}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Done row */}
          <div className="flex items-center gap-2.5 rounded-[12px] border border-line bg-subtle/50 p-3 opacity-70">
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full gradient-brand">
              <Check className="h-2.5 w-2.5 text-white" />
            </span>
            <div className="text-[0.8rem] font-medium text-ink-muted line-through">
              Spanish vocab quiz prep
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
