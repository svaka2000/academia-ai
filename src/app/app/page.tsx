"use client";

import Link from "next/link";
import { CalendarClock, Clock, Flame, ListTodo, Sparkles, Upload } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { AssignmentCard } from "@/components/app/assignment-card";
import { EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { useAppUI } from "@/components/app/ui-context";
import { useStore } from "@/lib/store";
import { computeStats, nextTask, smartNudge, todayPlan } from "@/lib/selectors";
import { formatMinutes } from "@/lib/priority";

function greeting(name: string) {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name}` : part;
}

export default function TodayPage() {
  const assignments = useStore((s) => s.assignments);
  const sessions = useStore((s) => s.sessions);
  const profile = useStore((s) => s.profile);
  const { openAdd, openImport } = useAppUI();

  const plan = todayPlan(assignments);
  const next = nextTask(assignments);
  const stats = computeStats(assignments, sessions);
  const nudge = smartNudge(next, profile.commitments);

  const hasAssignments = assignments.length > 0;
  const allDone = hasAssignments && plan.length === 0;

  return (
    <div className="animate-fade-up">
      <PageHeader
        title={greeting(profile.name)}
        subtitle={
          plan.length > 0
            ? `You have ${plan.length} thing${plan.length === 1 ? "" : "s"} to work through. Start at the top.`
            : "Here's your day at a glance."
        }
        action={
          hasAssignments ? (
            <Button variant="outline" size="sm" onClick={openImport}>
              <Upload className="h-4 w-4" /> Import
            </Button>
          ) : null
        }
      />

      {!hasAssignments ? (
        <EmptyState
          icon={<Sparkles className="h-6 w-6" />}
          title="Let's build your plan"
          description="Add your assignments and AcademiaAI will organize them into a clear daily plan — you'll always know what to work on next."
          action={
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Button onClick={openImport}>
                <Sparkles className="h-4 w-4" /> Import assignments
              </Button>
              <Button variant="outline" onClick={openAdd}>
                Add one manually
              </Button>
            </div>
          }
        />
      ) : (
        <>
          {/* Smart nudge */}
          {!allDone && (
            <div className="mb-6 flex items-start gap-3 rounded-[var(--radius-lg)] gradient-brand-soft border border-brand-100 p-4 sm:p-5">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[11px] gradient-brand text-white shadow-[var(--shadow-glow)]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-brand-600">
                  AcademiaAI suggests
                </p>
                <p className="mt-0.5 text-[0.95rem] font-medium leading-snug text-ink">
                  {nudge}
                </p>
              </div>
            </div>
          )}

          {/* Stat chips */}
          <div className="mb-6 grid grid-cols-3 gap-3">
            <StatChip
              icon={<ListTodo className="h-4 w-4" />}
              value={String(plan.length)}
              label="to do"
            />
            <StatChip
              icon={<Clock className="h-4 w-4" />}
              value={formatMinutes(stats.focusMinutesRemaining)}
              label="due today"
              tone="amber"
            />
            <StatChip
              icon={<Flame className="h-4 w-4" />}
              value={String(profile.streak)}
              label="day streak"
              tone="emerald"
            />
          </div>

          {allDone ? (
            <EmptyState
              icon={<Flame className="h-6 w-6" />}
              title="You're all caught up"
              description="Every assignment is done. Enjoy the breathing room — or get ahead on what's coming up."
              action={
                <Link href="/app/assignments">
                  <Button variant="outline">View all assignments</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {next && <AssignmentCard assignment={next} featured />}
              {plan.slice(1).map((a) => (
                <AssignmentCard key={a.id} assignment={a} />
              ))}

              <Link
                href="/app/planner"
                className="mt-2 flex items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-line-strong py-3.5 text-[0.85rem] font-medium text-ink-muted hover:border-brand-300 hover:text-brand-600 transition-colors"
              >
                <CalendarClock className="h-4 w-4" />
                See your scheduled study plan
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatChip({
  icon,
  value,
  label,
  tone = "brand",
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone?: "brand" | "amber" | "emerald";
}) {
  const toneClass =
    tone === "amber"
      ? "text-amber-brand bg-amber-50"
      : tone === "emerald"
        ? "text-emerald-700 bg-emerald-soft"
        : "text-brand-600 bg-brand-50";
  return (
    <div className="rounded-[var(--radius-md)] border border-line bg-surface p-3 sm:p-4">
      <span className={`mb-2 inline-grid h-8 w-8 place-items-center rounded-[9px] ${toneClass}`}>
        {icon}
      </span>
      <div className="text-[1.15rem] font-bold tracking-[-0.02em] text-ink leading-none">
        {value}
      </div>
      <div className="mt-1 text-[0.72rem] text-ink-muted">{label}</div>
    </div>
  );
}
