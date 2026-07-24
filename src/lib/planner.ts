import type { Assignment, Commitments } from "./types";
import { todayPlan } from "./selectors";

export interface PlanBlock {
  kind: "task" | "break";
  assignment?: Assignment;
  label: string;
  start: Date;
  end: Date;
  minutes: number;
}

export interface DayPlan {
  blocks: PlanBlock[];
  scheduledCount: number;
  overflow: Assignment[];
  startsTomorrow: boolean;
  totalFocusMinutes: number;
}

/**
 * Pack the prioritized workload into a realistic study session:
 * starts at the student's study window, adds short breaks between long tasks,
 * and stops before their wind-down hour so sleep is protected.
 */
export function buildDayPlan(
  assignments: Assignment[],
  commitments: Commitments,
  now = new Date()
): DayPlan {
  const tasks = todayPlan(assignments, now.getTime());
  const { studyStartHour, studyEndHour } = commitments;

  let cursor = new Date(now);
  let startsTomorrow = false;

  const windowStart = new Date(now);
  windowStart.setHours(studyStartHour, 0, 0, 0);

  const windowEnd = new Date(now);
  windowEnd.setHours(studyEndHour, 0, 0, 0);

  if (cursor < windowStart) cursor = new Date(windowStart);
  if (cursor >= windowEnd) {
    // Past today's window — plan for tomorrow.
    cursor = new Date(windowStart.getTime() + 86_400_000);
    windowEnd.setTime(windowEnd.getTime() + 86_400_000);
    startsTomorrow = true;
  } else {
    // Round up to the next 5 minutes for tidy blocks.
    const m = cursor.getMinutes();
    cursor.setMinutes(Math.ceil(m / 5) * 5, 0, 0);
  }

  const blocks: PlanBlock[] = [];
  const overflow: Assignment[] = [];
  let sinceBreak = 0;
  let totalFocusMinutes = 0;

  for (const task of tasks) {
    const minutes = Math.max(5, task.estimatedMinutes);
    const end = new Date(cursor.getTime() + minutes * 60_000);
    if (end > windowEnd) {
      overflow.push(task);
      continue;
    }

    blocks.push({
      kind: "task",
      assignment: task,
      label: task.title,
      start: new Date(cursor),
      end,
      minutes,
    });
    totalFocusMinutes += minutes;
    cursor = end;
    sinceBreak += minutes;

    // Insert a short break after long stretches, if more tasks remain.
    const remaining = tasks.filter(
      (t) => !blocks.some((b) => b.assignment?.id === t.id) && !overflow.includes(t)
    );
    if (sinceBreak >= 50 && remaining.length > 0) {
      const breakEnd = new Date(cursor.getTime() + 10 * 60_000);
      if (breakEnd < windowEnd) {
        blocks.push({
          kind: "break",
          label: "Break",
          start: new Date(cursor),
          end: breakEnd,
          minutes: 10,
        });
        cursor = breakEnd;
        sinceBreak = 0;
      }
    }
  }

  return {
    blocks,
    scheduledCount: blocks.filter((b) => b.kind === "task").length,
    overflow,
    startsTomorrow,
    totalFocusMinutes,
  };
}

export function formatClock(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
