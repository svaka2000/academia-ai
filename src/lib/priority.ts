import type { Assignment } from "./types";

const DAY = 86_400_000;

/** Hours until due. Negative = overdue. Null due date = far future. */
export function hoursUntilDue(dueDate: string | null, now = Date.now()): number | null {
  if (!dueDate) return null;
  const due = parseDue(dueDate);
  if (due == null) return null;
  return (due - now) / 3_600_000;
}

function parseDue(dueDate: string): number | null {
  // Support "yyyy-mm-dd" (treat as end of that day) or full ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return new Date(`${dueDate}T23:59:59`).getTime();
  }
  const t = new Date(dueDate).getTime();
  return Number.isNaN(t) ? null : t;
}

/**
 * Priority score 0..100. Blends due-date urgency, importance, difficulty and
 * time pressure. This is the deterministic engine — the AI route uses the same
 * signals so results stay explainable and consistent when no key is present.
 */
export function computePriority(a: Assignment, now = Date.now()): number {
  if (a.status === "done") return 0;

  const hrs = hoursUntilDue(a.dueDate, now);

  // Urgency: exponential ramp as the deadline approaches.
  let urgency: number;
  if (hrs == null) {
    urgency = 22; // no due date → low, steady urgency
  } else if (hrs <= 0) {
    urgency = 100; // overdue / due now
  } else {
    const days = hrs / 24;
    urgency = 100 * Math.exp(-days / 2.6); // ~today 100, 1d 68, 3d 32, 7d 6
  }

  const importance = (a.importance / 5) * 100;
  const difficulty = (a.difficulty / 5) * 100;

  // Time pressure: long tasks due soon deserve an earlier start.
  let timePressure = 0;
  if (hrs != null && hrs > 0) {
    const workHoursNeeded = a.estimatedMinutes / 60;
    const ratio = workHoursNeeded / Math.max(hrs, 1);
    timePressure = Math.min(100, ratio * 120);
  } else if (hrs != null && hrs <= 0) {
    timePressure = 100;
  }

  const score =
    0.52 * urgency +
    0.24 * importance +
    0.14 * difficulty +
    0.1 * timePressure;

  return Math.round(Math.max(0, Math.min(100, score)));
}

export type UrgencyLevel = "overdue" | "today" | "soon" | "upcoming" | "later" | "none";

export function urgencyLevel(dueDate: string | null, now = Date.now()): UrgencyLevel {
  const hrs = hoursUntilDue(dueDate, now);
  if (hrs == null) return "none";
  if (hrs < 0) return "overdue";
  if (hrs <= 24) return "today";
  if (hrs <= 24 * 3) return "soon";
  if (hrs <= 24 * 7) return "upcoming";
  return "later";
}

/** Friendly relative due label, e.g. "Due in 3h", "Due tomorrow", "2 days left". */
export function dueLabel(dueDate: string | null, now = Date.now()): string {
  const hrs = hoursUntilDue(dueDate, now);
  if (hrs == null) return "No due date";
  if (hrs < 0) {
    const days = Math.ceil(-hrs / 24);
    return days <= 1 ? "Overdue" : `Overdue by ${days}d`;
  }
  if (hrs < 1) return "Due within the hour";
  if (hrs < 24) {
    const rounded = Math.round(hrs);
    return `Due in ${rounded}h`;
  }
  const days = Math.round(hrs / 24);
  if (days === 1) return "Due tomorrow";
  if (days <= 6) return `${days} days left`;
  const weeks = Math.round(days / 7);
  return weeks <= 1 ? "Due next week" : `${weeks} weeks left`;
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Sort a list of assignments by priority (highest first), done last. */
export function byPriority(now = Date.now()) {
  return (a: Assignment, b: Assignment) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (b.status === "done" && a.status !== "done") return -1;
    return computePriority(b, now) - computePriority(a, now);
  };
}
