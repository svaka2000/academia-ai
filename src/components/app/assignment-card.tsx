"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Clock,
  MoreHorizontal,
  Pencil,
  Sparkles,
  Target,
  Trash2,
  Loader2,
} from "lucide-react";
import { Menu, MenuItem } from "@/components/ui/menu";
import { useStore } from "@/lib/store";
import { useAppUI } from "./ui-context";
import { requestBreakdown } from "@/lib/ai/client";
import {
  computePriority,
  dueLabel,
  formatMinutes,
  urgencyLevel,
} from "@/lib/priority";
import type { Assignment } from "@/lib/types";
import { DIFFICULTY_LABELS } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const URGENCY_STYLES: Record<string, string> = {
  overdue: "text-rose-brand",
  today: "text-amber-brand",
  soon: "text-brand-600",
  upcoming: "text-ink-muted",
  later: "text-ink-faint",
  none: "text-ink-faint",
};

export function AssignmentCard({
  assignment,
  featured = false,
}: {
  assignment: Assignment;
  featured?: boolean;
}) {
  const setStatus = useStore((s) => s.setStatus);
  const toggleSubtask = useStore((s) => s.toggleSubtask);
  const setSubtasks = useStore((s) => s.setSubtasks);
  const deleteAssignment = useStore((s) => s.deleteAssignment);
  const { openEdit } = useAppUI();

  const [expanded, setExpanded] = useState(featured);
  const [breaking, setBreaking] = useState(false);

  const done = assignment.status === "done";
  const priority = computePriority(assignment);
  const level = urgencyLevel(assignment.dueDate);
  const doneSubs = assignment.subtasks.filter((s) => s.done).length;
  const totalSubs = assignment.subtasks.length;

  async function handleBreakdown() {
    setBreaking(true);
    try {
      const res = await requestBreakdown({
        title: assignment.title,
        course: assignment.course,
        notes: assignment.notes,
        estimatedMinutes: assignment.estimatedMinutes,
      });
      setSubtasks(assignment.id, res.steps);
      setExpanded(true);
      toast.success("Broken into steps");
    } catch {
      toast.error("Couldn't break this down.");
    } finally {
      setBreaking(false);
    }
  }

  return (
    <div
      className={cn(
        "group rounded-[var(--radius-lg)] border bg-surface transition-all duration-200",
        done
          ? "border-line opacity-60"
          : featured
            ? "border-brand-200 shadow-[var(--shadow-md)]"
            : "border-line shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] hover:border-line-strong"
      )}
    >
      <div className="flex items-start gap-3 p-4 sm:p-5">
        {/* Complete toggle */}
        <button
          onClick={() => setStatus(assignment.id, done ? "todo" : "done")}
          aria-label={done ? "Mark as not done" : "Mark as done"}
          className={cn(
            "mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 transition-all duration-200 cursor-pointer",
            done
              ? "gradient-brand border-transparent"
              : "border-line-strong hover:border-brand-400"
          )}
        >
          {done && <Check className="h-3.5 w-3.5 text-white" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {featured && !done && (
                <span className="mb-1.5 inline-flex items-center gap-1 rounded-full gradient-brand px-2 py-0.5 text-[0.68rem] font-semibold text-white">
                  <Target className="h-3 w-3" /> Next up
                </span>
              )}
              <h3
                className={cn(
                  "text-[0.95rem] font-semibold leading-snug tracking-[-0.01em] text-ink",
                  done && "line-through text-ink-muted"
                )}
              >
                {assignment.title}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.78rem]">
                <span className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: assignment.courseColor }}
                  />
                  {assignment.course}
                </span>
                <span className="text-line-strong">·</span>
                <span className={cn("font-medium", URGENCY_STYLES[level])}>
                  {dueLabel(assignment.dueDate)}
                </span>
                <span className="text-line-strong">·</span>
                <span className="inline-flex items-center gap-1 text-ink-muted">
                  <Clock className="h-3 w-3" />
                  {formatMinutes(assignment.estimatedMinutes)}
                </span>
              </div>
            </div>

            <Menu
              trigger={
                <span className="grid h-8 w-8 place-items-center rounded-[9px] text-ink-faint hover:bg-muted hover:text-ink transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              }
            >
              {(close) => (
                <>
                  <MenuItem
                    onClick={() => {
                      openEdit(assignment.id);
                      close();
                    }}
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </MenuItem>
                  {totalSubs === 0 && (
                    <MenuItem
                      onClick={() => {
                        close();
                        handleBreakdown();
                      }}
                    >
                      <Sparkles className="h-4 w-4" /> Break into steps
                    </MenuItem>
                  )}
                  <MenuItem
                    danger
                    onClick={() => {
                      deleteAssignment(assignment.id);
                      close();
                      toast("Assignment deleted");
                    }}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </MenuItem>
                </>
              )}
            </Menu>
          </div>

          {/* Subtask progress */}
          {totalSubs > 0 && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="mt-3 flex w-full items-center gap-2.5 cursor-pointer"
            >
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-brand transition-[width] duration-500"
                  style={{ width: `${(doneSubs / totalSubs) * 100}%` }}
                />
              </div>
              <span className="text-[0.72rem] font-medium text-ink-muted">
                {doneSubs}/{totalSubs}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-ink-faint transition-transform",
                  expanded && "rotate-180"
                )}
              />
            </button>
          )}

          {/* Actions row */}
          {!done && (
            <div className="mt-3 flex items-center gap-2">
              <Link
                href={`/app/focus?id=${assignment.id}`}
                className="inline-flex h-8 items-center gap-1.5 rounded-[9px] bg-ink px-3 text-[0.78rem] font-medium text-white hover:bg-ink-soft transition-colors cursor-pointer"
              >
                <Target className="h-3.5 w-3.5" /> Focus
              </Link>
              {totalSubs === 0 && (
                <button
                  onClick={handleBreakdown}
                  disabled={breaking}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[9px] bg-brand-50 px-3 text-[0.78rem] font-medium text-brand-700 hover:bg-brand-100 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {breaking ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  Break down
                </button>
              )}
              {featured && (
                <span className="ml-auto hidden sm:inline text-[0.72rem] text-ink-faint">
                  {DIFFICULTY_LABELS[assignment.difficulty]} · priority {priority}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded subtasks */}
      {expanded && totalSubs > 0 && (
        <div className="border-t border-line px-4 pb-4 pt-3 sm:px-5">
          <ul className="space-y-1">
            {assignment.subtasks.map((st) => (
              <li key={st.id}>
                <button
                  onClick={() => toggleSubtask(assignment.id, st.id)}
                  className="flex w-full items-center gap-2.5 rounded-[9px] px-2 py-1.5 text-left hover:bg-subtle transition-colors cursor-pointer"
                >
                  <span
                    className={cn(
                      "grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border transition-colors",
                      st.done
                        ? "bg-emerald-brand border-transparent"
                        : "border-line-strong"
                    )}
                  >
                    {st.done && <Check className="h-2.5 w-2.5 text-white" />}
                  </span>
                  <span
                    className={cn(
                      "text-[0.83rem]",
                      st.done ? "text-ink-faint line-through" : "text-ink-soft"
                    )}
                  >
                    {st.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
