"use client";

import { useState } from "react";
import { Sparkles, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { LevelPicker } from "@/components/ui/segmented";
import { requestBreakdown } from "@/lib/ai/client";
import { DIFFICULTY_LABELS, IMPORTANCE_LABELS } from "@/lib/types";
import type { NewAssignment } from "@/lib/store";
import { formatMinutes } from "@/lib/priority";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TIME_PRESETS = [15, 30, 45, 60, 90, 120];

export function AssignmentForm({
  initial,
  courses,
  submitLabel = "Add assignment",
  onSubmit,
  onCancel,
}: {
  initial?: Partial<NewAssignment>;
  courses: string[];
  submitLabel?: string;
  onSubmit: (a: NewAssignment) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [course, setCourse] = useState(initial?.course ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [minutes, setMinutes] = useState(initial?.estimatedMinutes ?? 45);
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? 3);
  const [importance, setImportance] = useState(initial?.importance ?? 3);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [steps, setSteps] = useState<string[]>(initial?.subtasks ?? []);
  const [breaking, setBreaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBreakdown() {
    if (!title.trim()) {
      setError("Add a title first so AcademiaAI knows what to break down.");
      return;
    }
    setBreaking(true);
    try {
      const res = await requestBreakdown({
        title,
        course,
        notes,
        estimatedMinutes: minutes,
      });
      setSteps(res.steps);
      toast.success(
        res.source === "ai" ? "Broken into steps" : "Broken into steps",
        { description: `${res.steps.length} clear steps to work through.` }
      );
    } catch {
      toast.error("Couldn't break this down. Try again.");
    } finally {
      setBreaking(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give your assignment a title.");
      return;
    }
    onSubmit({
      title: title.trim(),
      course: course.trim() || "General",
      dueDate: dueDate || null,
      difficulty,
      estimatedMinutes: minutes,
      importance,
      notes: notes.trim() || undefined,
      subtasks: steps,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <Label htmlFor="af-title">Assignment</Label>
        <Input
          id="af-title"
          autoFocus
          placeholder="e.g. AP US History DBQ essay"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="af-course">Course</Label>
          <Input
            id="af-course"
            list="course-options"
            placeholder="e.g. Chemistry"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <datalist id="course-options">
            {courses.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="af-due">Due date</Label>
          <Input
            id="af-due"
            type="date"
            value={dueDate ?? ""}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Estimated time · {formatMinutes(minutes)}</Label>
        <div className="flex flex-wrap gap-1.5">
          {TIME_PRESETS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMinutes(m)}
              className={cn(
                "h-9 rounded-[10px] px-3 text-[0.8rem] font-medium transition-colors cursor-pointer",
                minutes === m
                  ? "bg-brand-600 text-white"
                  : "bg-muted text-ink-muted hover:bg-line-strong"
              )}
            >
              {formatMinutes(m)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Difficulty · {DIFFICULTY_LABELS[difficulty]}</Label>
          <LevelPicker
            value={difficulty}
            onChange={setDifficulty}
            labels={DIFFICULTY_LABELS}
          />
        </div>
        <div>
          <Label>Importance · {IMPORTANCE_LABELS[importance]}</Label>
          <LevelPicker
            value={importance}
            onChange={setImportance}
            labels={IMPORTANCE_LABELS}
            activeClass="bg-indigo-brand text-white"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="mb-0">Steps</Label>
          <button
            type="button"
            onClick={handleBreakdown}
            disabled={breaking}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[0.75rem] font-medium text-brand-700 hover:bg-brand-100 transition-colors cursor-pointer disabled:opacity-60"
          >
            {breaking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Break it down
          </button>
        </div>
        {steps.length > 0 ? (
          <ul className="space-y-1.5">
            {steps.map((s, i) => (
              <li
                key={i}
                className="group flex items-center gap-2 rounded-[10px] border border-line bg-subtle px-3 py-2 text-[0.85rem] text-ink-soft"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-[0.68rem] font-semibold text-brand-700">
                  {i + 1}
                </span>
                <span className="flex-1">{s}</span>
                <button
                  type="button"
                  onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                  className="opacity-0 group-hover:opacity-100 text-ink-faint hover:text-rose-brand transition-opacity cursor-pointer"
                  aria-label="Remove step"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[0.8rem] text-ink-faint">
            Optional — let AI split this into an ordered checklist.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="af-notes">Notes (optional)</Label>
        <Textarea
          id="af-notes"
          placeholder="Any details — page numbers, prompt, requirements…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && <p className="text-[0.8rem] text-rose-brand">{error}</p>}

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" className="flex-1">
          <Plus className="h-4 w-4" />
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
