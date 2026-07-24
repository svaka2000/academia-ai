import type { Assignment, Commitments, StudySession } from "./types";
import { byPriority, computePriority, formatMinutes, hoursUntilDue } from "./priority";
import { todayISO } from "./store";

export function activeAssignments(assignments: Assignment[]): Assignment[] {
  return assignments.filter((a) => a.status !== "done");
}

export function todayPlan(assignments: Assignment[], now = Date.now()): Assignment[] {
  return [...activeAssignments(assignments)].sort(byPriority(now));
}

export function nextTask(assignments: Assignment[], now = Date.now()): Assignment | null {
  return todayPlan(assignments, now)[0] ?? null;
}

export interface Stats {
  total: number;
  done: number;
  active: number;
  completionRate: number;
  minutesToday: number;
  minutesTotal: number;
  doneToday: number;
  dueTodayCount: number;
  overdueCount: number;
  focusMinutesRemaining: number;
}

export function computeStats(
  assignments: Assignment[],
  sessions: StudySession[],
  now = Date.now()
): Stats {
  const today = todayISO();
  const done = assignments.filter((a) => a.status === "done").length;
  const total = assignments.length;
  const active = total - done;

  const minutesToday = sessions
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + s.minutes, 0);
  const minutesTotal = sessions.reduce((sum, s) => sum + s.minutes, 0);

  const doneToday = assignments.filter(
    (a) =>
      a.status === "done" &&
      a.completedAt &&
      todayISO(new Date(a.completedAt)) === today
  ).length;

  let dueTodayCount = 0;
  let overdueCount = 0;
  let focusMinutesRemaining = 0;
  for (const a of assignments) {
    if (a.status === "done") continue;
    const hrs = hoursUntilDue(a.dueDate, now);
    if (hrs != null && hrs < 0) overdueCount++;
    else if (hrs != null && hrs <= 24) dueTodayCount++;
    if (hrs != null && hrs <= 24) focusMinutesRemaining += a.estimatedMinutes;
  }

  return {
    total,
    done,
    active,
    completionRate: total === 0 ? 0 : Math.round((done / total) * 100),
    minutesToday,
    minutesTotal,
    doneToday,
    dueTodayCount,
    overdueCount,
    focusMinutesRemaining,
  };
}

/** Distinct courses with their color. */
export function courseList(assignments: Assignment[]): { name: string; color: string }[] {
  const map = new Map<string, string>();
  for (const a of assignments) {
    if (!map.has(a.course)) map.set(a.course, a.courseColor || "#2563eb");
  }
  return [...map.entries()].map(([name, color]) => ({ name, color }));
}

/**
 * The "smart notification" copy — contextual, calm, specific.
 * e.g. "You can finish Chemistry in about 45 min before your evening winds down."
 */
export function smartNudge(
  assignment: Assignment | null,
  commitments: Commitments,
  now = Date.now()
): string {
  if (!assignment) return "You're all caught up. Nothing is waiting on you right now.";

  const time = formatMinutes(assignment.estimatedMinutes);
  const hrs = hoursUntilDue(assignment.dueDate, now);
  const activity =
    commitments.activities.length > 0 ? commitments.activities[0] : null;

  if (hrs != null && hrs < 0) {
    return `${assignment.title} is overdue — it's the one thing to clear first. About ${time} of focused work.`;
  }
  if (hrs != null && hrs <= 24) {
    if (activity) {
      return `You can finish ${assignment.course} in about ${time} before ${activity}.`;
    }
    return `${assignment.title} is due today. You can finish it in about ${time}.`;
  }
  if (activity) {
    return `Start with ${assignment.course} — about ${time}. That keeps your evening open for ${activity}.`;
  }
  return `Start with ${assignment.title}. It's roughly ${time} of focused work.`;
}

export function priorityOf(a: Assignment, now = Date.now()): number {
  return computePriority(a, now);
}
