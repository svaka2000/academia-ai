"use client";

import Link from "next/link";
import { CalendarClock, Coffee, Settings2, Sparkles, Target } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { useAppUI } from "@/components/app/ui-context";
import { useStore } from "@/lib/store";
import { buildDayPlan, formatClock } from "@/lib/planner";
import { formatMinutes } from "@/lib/priority";

export default function PlannerPage() {
  const assignments = useStore((s) => s.assignments);
  const commitments = useStore((s) => s.profile.commitments);
  const { openAdd } = useAppUI();

  const plan = buildDayPlan(assignments, commitments);
  const hasActive = assignments.some((a) => a.status !== "done");

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Study planner"
        subtitle={
          plan.startsTomorrow
            ? "Your study window has passed — here's tomorrow, scheduled."
            : "Your work, scheduled around your real day."
        }
        action={
          <Link href="/app/settings">
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
            </Button>
          </Link>
        }
      />

      {!hasActive ? (
        <EmptyState
          icon={<CalendarClock className="h-6 w-6" />}
          title="Nothing to schedule"
          description="Add some assignments and AcademiaAI will build a realistic study session with breaks — protecting your sleep and commitments."
          action={<Button onClick={openAdd}>Add an assignment</Button>}
        />
      ) : (
        <>
          {plan.blocks.length > 0 && (
            <div className="mb-5 flex items-center gap-4 rounded-[var(--radius-lg)] border border-line bg-surface p-4 sm:p-5">
              <div className="flex-1">
                <div className="text-[0.72rem] font-medium uppercase tracking-wide text-ink-muted">
                  Focus time
                </div>
                <div className="text-[1.35rem] font-bold tracking-[-0.02em] text-ink">
                  {formatMinutes(plan.totalFocusMinutes)}
                </div>
              </div>
              <div className="h-9 w-px bg-line" />
              <div className="flex-1">
                <div className="text-[0.72rem] font-medium uppercase tracking-wide text-ink-muted">
                  Scheduled
                </div>
                <div className="text-[1.35rem] font-bold tracking-[-0.02em] text-ink">
                  {plan.scheduledCount} task{plan.scheduledCount === 1 ? "" : "s"}
                </div>
              </div>
              {plan.blocks[0] && (
                <>
                  <div className="h-9 w-px bg-line" />
                  <div className="flex-1">
                    <div className="text-[0.72rem] font-medium uppercase tracking-wide text-ink-muted">
                      Starts
                    </div>
                    <div className="text-[1.35rem] font-bold tracking-[-0.02em] text-ink">
                      {formatClock(plan.blocks[0].start)}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[52px] top-2 bottom-2 w-px bg-line sm:left-[64px]" />
            <div className="space-y-2.5">
              {plan.blocks.map((block, i) => (
                <div key={i} className="flex items-stretch gap-3 sm:gap-4">
                  <div className="w-[44px] shrink-0 pt-3.5 text-right sm:w-[56px]">
                    <span className="text-[0.72rem] font-semibold text-ink-muted">
                      {formatClock(block.start)}
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span
                      className={`z-10 grid h-4 w-4 place-items-center rounded-full border-2 border-canvas ${
                        block.kind === "break" ? "bg-line-strong" : "gradient-brand"
                      }`}
                    />
                  </div>
                  {block.kind === "break" ? (
                    <div className="flex flex-1 items-center gap-2 rounded-[12px] border border-dashed border-line-strong bg-subtle/50 px-4 py-2.5 text-[0.83rem] text-ink-muted">
                      <Coffee className="h-4 w-4" />
                      {block.label} · {formatMinutes(block.minutes)}
                    </div>
                  ) : (
                    <div className="flex-1 rounded-[14px] border border-line bg-surface p-4 shadow-[var(--shadow-xs)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ background: block.assignment?.courseColor }}
                            />
                            <span className="text-[0.72rem] font-medium text-ink-muted">
                              {block.assignment?.course}
                            </span>
                          </div>
                          <h3 className="mt-0.5 truncate text-[0.9rem] font-semibold text-ink">
                            {block.label}
                          </h3>
                        </div>
                        <Link
                          href={`/app/focus?id=${block.assignment?.id}`}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-ink text-white hover:bg-ink-soft transition-colors"
                          aria-label="Focus on this task"
                        >
                          <Target className="h-4 w-4" />
                        </Link>
                      </div>
                      <div className="mt-2 text-[0.74rem] text-ink-faint">
                        {formatClock(block.start)} – {formatClock(block.end)} ·{" "}
                        {formatMinutes(block.minutes)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Overflow */}
          {plan.overflow.length > 0 && (
            <div className="mt-6 rounded-[var(--radius-lg)] border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-[0.85rem] font-semibold text-amber-800">
                <Sparkles className="h-4 w-4" />
                Won&apos;t fit in today&apos;s window
              </div>
              <p className="mt-1 text-[0.8rem] text-amber-800/80">
                These roll to tomorrow. Consider a wider study window or trimming a task.
              </p>
              <ul className="mt-3 space-y-1.5">
                {plan.overflow.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-2 text-[0.83rem] text-ink-soft"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: a.courseColor }}
                    />
                    {a.title}
                    <span className="text-ink-faint">
                      · {formatMinutes(a.estimatedMinutes)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
