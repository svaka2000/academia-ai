"use client";

import { useMemo } from "react";
import { CheckCircle2, Clock, Flame, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { ProgressRing } from "@/components/ui/progress-ring";
import { EmptyState } from "@/components/ui/misc";
import { Card } from "@/components/ui/card";
import { useStore, todayISO } from "@/lib/store";
import { computeStats } from "@/lib/selectors";
import { dueLabel, formatMinutes, urgencyLevel } from "@/lib/priority";

const URGENCY_DOT: Record<string, string> = {
  overdue: "bg-rose-brand",
  today: "bg-amber-brand",
  soon: "bg-brand-600",
  upcoming: "bg-ink-faint",
  later: "bg-line-strong",
  none: "bg-line-strong",
};

export default function ProgressPage() {
  const assignments = useStore((s) => s.assignments);
  const sessions = useStore((s) => s.sessions);
  const profile = useStore((s) => s.profile);

  const stats = computeStats(assignments, sessions);

  const week = useMemo(() => {
    const days: { label: string; minutes: number; isToday: boolean }[] = [];
    const today = todayISO();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86_400_000);
      const iso = todayISO(d);
      const minutes = sessions
        .filter((s) => s.date === iso)
        .reduce((sum, s) => sum + s.minutes, 0);
      days.push({
        label: d.toLocaleDateString([], { weekday: "narrow" }),
        minutes,
        isToday: iso === today,
      });
    }
    return days;
  }, [sessions]);

  const maxMinutes = Math.max(60, ...week.map((d) => d.minutes));

  const upcoming = useMemo(
    () =>
      assignments
        .filter((a) => a.status !== "done" && a.dueDate)
        .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
        .slice(0, 5),
    [assignments]
  );

  if (assignments.length === 0 && sessions.length === 0) {
    return (
      <div className="animate-fade-up">
        <PageHeader title="Progress" subtitle="Your momentum, at a glance." />
        <EmptyState
          icon={<TrendingUp className="h-6 w-6" />}
          title="No data yet"
          description="Complete a few assignments and focus sessions — your streaks, hours, and completion rate will show up here."
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Progress" subtitle="Your momentum, at a glance." />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Completion ring */}
        <Card className="flex flex-col items-center justify-center p-6 lg:row-span-1">
          <ProgressRing value={stats.completionRate} size={148} stroke={13}>
            <div className="text-center">
              <div className="text-[1.7rem] font-bold tracking-[-0.03em] text-ink leading-none">
                {stats.completionRate}%
              </div>
              <div className="mt-1 text-[0.72rem] text-ink-muted">complete</div>
            </div>
          </ProgressRing>
          <p className="mt-4 text-center text-[0.8rem] text-ink-muted">
            {stats.done} of {stats.total} assignments done
          </p>
        </Card>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <StatTile
            icon={<Flame className="h-5 w-5" />}
            tone="amber"
            value={`${profile.streak}`}
            label="Day streak"
          />
          <StatTile
            icon={<Clock className="h-5 w-5" />}
            tone="brand"
            value={formatMinutes(stats.minutesTotal)}
            label="Total focused"
          />
          <StatTile
            icon={<CheckCircle2 className="h-5 w-5" />}
            tone="emerald"
            value={`${stats.doneToday}`}
            label="Done today"
          />
          <StatTile
            icon={<TrendingUp className="h-5 w-5" />}
            tone="indigo"
            value={formatMinutes(stats.minutesToday)}
            label="Focused today"
          />
        </div>

        {/* Weekly chart */}
        <Card className="p-5 sm:p-6 lg:col-span-2">
          <h3 className="text-[0.9rem] font-semibold text-ink">This week</h3>
          <p className="text-[0.78rem] text-ink-muted">Minutes focused per day</p>
          <div className="mt-5 flex h-40 items-end justify-between gap-2 sm:gap-3">
            {week.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className={`w-full max-w-[34px] rounded-t-[6px] transition-all duration-500 ${
                      d.isToday ? "gradient-brand" : "bg-brand-200"
                    }`}
                    style={{
                      height: `${Math.max(4, (d.minutes / maxMinutes) * 100)}%`,
                    }}
                    title={`${d.minutes} min`}
                  />
                </div>
                <span
                  className={`text-[0.72rem] font-medium ${
                    d.isToday ? "text-brand-600" : "text-ink-faint"
                  }`}
                >
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming deadlines */}
        <Card className="p-5 sm:p-6">
          <h3 className="text-[0.9rem] font-semibold text-ink">Upcoming deadlines</h3>
          {upcoming.length === 0 ? (
            <p className="mt-3 text-[0.82rem] text-ink-muted">
              No deadlines coming up. You&apos;re ahead.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      URGENCY_DOT[urgencyLevel(a.dueDate)]
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[0.83rem] font-medium text-ink">
                      {a.title}
                    </div>
                    <div className="text-[0.72rem] text-ink-muted">{a.course}</div>
                  </div>
                  <span className="shrink-0 text-[0.75rem] font-medium text-ink-muted">
                    {dueLabel(a.dueDate)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: "amber" | "brand" | "emerald" | "indigo";
}) {
  const tones: Record<string, string> = {
    amber: "bg-amber-50 text-amber-brand",
    brand: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-soft text-emerald-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };
  return (
    <Card className="p-4 sm:p-5">
      <span className={`inline-grid h-10 w-10 place-items-center rounded-[11px] ${tones[tone]}`}>
        {icon}
      </span>
      <div className="mt-3 text-[1.4rem] font-bold tracking-[-0.02em] text-ink leading-none">
        {value}
      </div>
      <div className="mt-1.5 text-[0.75rem] text-ink-muted">{label}</div>
    </Card>
  );
}
