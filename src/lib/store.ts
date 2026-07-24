"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type {
  Assignment,
  Commitments,
  Plan,
  Profile,
  StudySession,
  Subtask,
} from "./types";
import { COURSE_COLORS } from "./types";

export function todayISO(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`).getTime();
  const db = new Date(`${b}T00:00:00`).getTime();
  return Math.round((db - da) / 86_400_000);
}

const DEFAULT_COMMITMENTS: Commitments = {
  sleepHours: 8,
  activities: [],
  studyStartHour: 16,
  studyEndHour: 22,
};

const DEFAULT_PROFILE: Profile = {
  name: "",
  email: "",
  plan: "free",
  commitments: DEFAULT_COMMITMENTS,
  onboarded: false,
  lastActiveDate: null,
  streak: 0,
};

export type NewAssignment = {
  title: string;
  course: string;
  dueDate: string | null;
  difficulty: number;
  estimatedMinutes: number;
  importance: number;
  notes?: string;
  subtasks?: string[];
};

interface State {
  assignments: Assignment[];
  sessions: StudySession[];
  profile: Profile;
  _hydrated: boolean;

  addAssignment: (input: NewAssignment) => Assignment;
  updateAssignment: (id: string, patch: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  setStatus: (id: string, status: Assignment["status"]) => void;

  setSubtasks: (id: string, titles: string[]) => void;
  toggleSubtask: (assignmentId: string, subtaskId: string) => void;
  addSubtask: (assignmentId: string, title: string) => void;
  deleteSubtask: (assignmentId: string, subtaskId: string) => void;

  logSession: (assignmentId: string | null, minutes: number) => void;

  updateProfile: (patch: Partial<Profile>) => void;
  updateCommitments: (patch: Partial<Commitments>) => void;
  setPlan: (plan: Plan) => void;
  completeOnboarding: (data: {
    name: string;
    email: string;
    commitments: Commitments;
  }) => void;

  loadSampleData: () => void;
  resetAll: () => void;
}

let colorIdx = 0;
function colorForCourse(course: string, existing: Assignment[]): string {
  const found = existing.find(
    (a) => a.course.toLowerCase() === course.toLowerCase() && a.courseColor
  );
  if (found?.courseColor) return found.courseColor;
  const c = COURSE_COLORS[colorIdx % COURSE_COLORS.length];
  colorIdx++;
  return c;
}

/** Recompute streak when a task is completed today. */
function bumpStreak(profile: Profile): Profile {
  const today = todayISO();
  if (profile.lastActiveDate === today) return profile;
  let streak = 1;
  if (profile.lastActiveDate) {
    const gap = daysBetween(profile.lastActiveDate, today);
    streak = gap === 1 ? profile.streak + 1 : 1;
  }
  return { ...profile, lastActiveDate: today, streak };
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      assignments: [],
      sessions: [],
      profile: DEFAULT_PROFILE,
      _hydrated: false,

      addAssignment: (input) => {
        const a: Assignment = {
          id: nanoid(8),
          title: input.title.trim(),
          course: input.course.trim() || "General",
          courseColor: colorForCourse(input.course.trim() || "General", get().assignments),
          dueDate: input.dueDate,
          difficulty: input.difficulty,
          estimatedMinutes: input.estimatedMinutes,
          importance: input.importance,
          status: "todo",
          notes: input.notes,
          subtasks: (input.subtasks ?? []).map((t) => ({
            id: nanoid(6),
            title: t,
            done: false,
          })),
          createdAt: Date.now(),
        };
        set((s) => ({ assignments: [a, ...s.assignments] }));
        return a;
      },

      updateAssignment: (id, patch) =>
        set((s) => ({
          assignments: s.assignments.map((a) =>
            a.id === id ? { ...a, ...patch } : a
          ),
        })),

      deleteAssignment: (id) =>
        set((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) })),

      setStatus: (id, status) =>
        set((s) => {
          const assignments = s.assignments.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status,
                  completedAt: status === "done" ? Date.now() : undefined,
                }
              : a
          );
          const profile =
            status === "done" ? bumpStreak(s.profile) : s.profile;
          return { assignments, profile };
        }),

      setSubtasks: (id, titles) =>
        set((s) => ({
          assignments: s.assignments.map((a) =>
            a.id === id
              ? {
                  ...a,
                  subtasks: titles.map((t) => ({
                    id: nanoid(6),
                    title: t,
                    done: false,
                  })),
                }
              : a
          ),
        })),

      toggleSubtask: (assignmentId, subtaskId) =>
        set((s) => ({
          assignments: s.assignments.map((a) =>
            a.id === assignmentId
              ? {
                  ...a,
                  subtasks: a.subtasks.map((st) =>
                    st.id === subtaskId ? { ...st, done: !st.done } : st
                  ),
                }
              : a
          ),
        })),

      addSubtask: (assignmentId, title) =>
        set((s) => ({
          assignments: s.assignments.map((a) =>
            a.id === assignmentId
              ? {
                  ...a,
                  subtasks: [
                    ...a.subtasks,
                    { id: nanoid(6), title: title.trim(), done: false } as Subtask,
                  ],
                }
              : a
          ),
        })),

      deleteSubtask: (assignmentId, subtaskId) =>
        set((s) => ({
          assignments: s.assignments.map((a) =>
            a.id === assignmentId
              ? { ...a, subtasks: a.subtasks.filter((st) => st.id !== subtaskId) }
              : a
          ),
        })),

      logSession: (assignmentId, minutes) =>
        set((s) => {
          if (minutes <= 0) return s;
          const session: StudySession = {
            id: nanoid(8),
            assignmentId,
            minutes: Math.round(minutes),
            date: todayISO(),
            at: Date.now(),
          };
          return {
            sessions: [session, ...s.sessions],
            profile: bumpStreak(s.profile),
          };
        }),

      updateProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),

      updateCommitments: (patch) =>
        set((s) => ({
          profile: {
            ...s.profile,
            commitments: { ...s.profile.commitments, ...patch },
          },
        })),

      setPlan: (plan) => set((s) => ({ profile: { ...s.profile, plan } })),

      completeOnboarding: ({ name, email, commitments }) =>
        set((s) => ({
          profile: {
            ...s.profile,
            name: name.trim(),
            email: email.trim(),
            commitments,
            onboarded: true,
          },
        })),

      loadSampleData: () => {
        const { addAssignment } = get();
        if (get().assignments.length > 0) return;
        SAMPLE.forEach((a) => addAssignment(a));
      },

      resetAll: () =>
        set({ assignments: [], sessions: [], profile: DEFAULT_PROFILE }),
    }),
    {
      name: "academia-ai:v1",
      partialize: (s) => ({
        assignments: s.assignments,
        sessions: s.sessions,
        profile: s.profile,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    }
  )
);

// Sample data — realistic mixed workload for a high-schooler.
const inDays = (n: number) => todayISO(new Date(Date.now() + n * 86_400_000));

const SAMPLE: NewAssignment[] = [
  {
    title: "AP US History DBQ essay",
    course: "AP US History",
    dueDate: inDays(1),
    difficulty: 4,
    estimatedMinutes: 90,
    importance: 5,
    notes: "Progressive Era reforms. 7 documents.",
    subtasks: [
      "Read all 7 documents & annotate",
      "Write thesis + outline",
      "Draft body paragraphs",
      "Add outside evidence",
      "Revise & submit",
    ],
  },
  {
    title: "Calc BC — Section 7.4 problem set",
    course: "Calculus BC",
    dueDate: inDays(0),
    difficulty: 3,
    estimatedMinutes: 45,
    importance: 3,
  },
  {
    title: "Chemistry lab report: titration",
    course: "Chemistry",
    dueDate: inDays(2),
    difficulty: 3,
    estimatedMinutes: 60,
    importance: 4,
  },
  {
    title: "Read The Great Gatsby ch. 4–6",
    course: "English",
    dueDate: inDays(3),
    difficulty: 2,
    estimatedMinutes: 50,
    importance: 3,
  },
  {
    title: "Spanish vocab quiz prep",
    course: "Spanish III",
    dueDate: inDays(4),
    difficulty: 2,
    estimatedMinutes: 25,
    importance: 2,
  },
];
