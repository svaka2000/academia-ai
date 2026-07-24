export type Status = "todo" | "doing" | "done";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  courseColor?: string;
  /** ISO date string (yyyy-mm-dd) or full ISO — the due date */
  dueDate: string | null;
  /** 1 (easy) … 5 (very hard) */
  difficulty: number;
  /** estimated minutes to complete */
  estimatedMinutes: number;
  /** 1 (low) … 5 (critical) */
  importance: number;
  status: Status;
  notes?: string;
  subtasks: Subtask[];
  createdAt: number;
  completedAt?: number;
}

export interface StudySession {
  id: string;
  assignmentId: string | null;
  minutes: number;
  /** yyyy-mm-dd */
  date: string;
  at: number;
}

export interface Commitments {
  /** hours of sleep the student protects */
  sleepHours: number;
  /** free-form list of recurring commitments (sports, work, clubs) */
  activities: string[];
  /** the hour (0-23) they typically start studying */
  studyStartHour: number;
  /** the hour (0-23) they wind down */
  studyEndHour: number;
}

export type Plan = "free" | "pro";

export interface Profile {
  name: string;
  email: string;
  plan: Plan;
  commitments: Commitments;
  onboarded: boolean;
  /** yyyy-mm-dd of the last day a task was completed (for streaks) */
  lastActiveDate: string | null;
  streak: number;
}

export const COURSE_COLORS = [
  "#2563eb",
  "#4338ca",
  "#0891b2",
  "#059669",
  "#d97706",
  "#db2777",
  "#7c3aed",
  "#dc2626",
];

export const DIFFICULTY_LABELS = ["", "Very easy", "Easy", "Moderate", "Hard", "Very hard"];
export const IMPORTANCE_LABELS = ["", "Low", "Minor", "Normal", "High", "Critical"];
