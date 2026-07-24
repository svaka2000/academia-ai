"use client";

import { useMemo, useState } from "react";
import { ListTodo, Plus, Upload } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { AssignmentCard } from "@/components/app/assignment-card";
import { EmptyState } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { useAppUI } from "@/components/app/ui-context";
import { useStore } from "@/lib/store";
import { byPriority } from "@/lib/priority";
import { courseList } from "@/lib/selectors";
import { cn } from "@/lib/utils";

type Filter = "todo" | "done" | "all";

export default function AssignmentsPage() {
  const assignments = useStore((s) => s.assignments);
  const { openAdd, openImport } = useAppUI();
  const [filter, setFilter] = useState<Filter>("todo");
  const [course, setCourse] = useState<string | null>(null);

  const courses = useMemo(() => courseList(assignments), [assignments]);

  const filtered = useMemo(() => {
    let list = [...assignments];
    if (filter === "todo") list = list.filter((a) => a.status !== "done");
    if (filter === "done") list = list.filter((a) => a.status === "done");
    if (course) list = list.filter((a) => a.course === course);
    return list.sort(byPriority());
  }, [assignments, filter, course]);

  const counts = {
    todo: assignments.filter((a) => a.status !== "done").length,
    done: assignments.filter((a) => a.status === "done").length,
    all: assignments.length,
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Assignments"
        subtitle="Everything on your plate, ordered by what matters most."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={openImport}>
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        }
      />

      {assignments.length === 0 ? (
        <EmptyState
          icon={<ListTodo className="h-6 w-6" />}
          title="No assignments yet"
          description="Add assignments manually or import them from Google Classroom or Canvas."
          action={
            <div className="flex gap-2.5">
              <Button onClick={openImport}>Import</Button>
              <Button variant="outline" onClick={openAdd}>
                Add manually
              </Button>
            </div>
          }
        />
      ) : (
        <>
          {/* Status filter */}
          <div className="mb-4 inline-flex rounded-[12px] bg-muted p-1">
            {(["todo", "done", "all"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-[9px] px-3.5 py-1.5 text-[0.82rem] font-medium capitalize transition-all cursor-pointer",
                  filter === f
                    ? "bg-surface text-ink shadow-[var(--shadow-xs)]"
                    : "text-ink-muted hover:text-ink-soft"
                )}
              >
                {f === "todo" ? "To do" : f} ({counts[f]})
              </button>
            ))}
          </div>

          {/* Course filter */}
          {courses.length > 1 && (
            <div className="mb-5 flex flex-wrap gap-1.5">
              <CourseChip
                active={course === null}
                onClick={() => setCourse(null)}
                label="All courses"
              />
              {courses.map((c) => (
                <CourseChip
                  key={c.name}
                  active={course === c.name}
                  onClick={() => setCourse(c.name)}
                  label={c.name}
                  color={c.color}
                />
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <EmptyState title="Nothing here" description="Try a different filter." />
          ) : (
            <div className="space-y-3">
              {filtered.map((a) => (
                <AssignmentCard key={a.id} assignment={a} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CourseChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.78rem] font-medium transition-colors cursor-pointer",
        active
          ? "border-brand-200 bg-brand-50 text-brand-700"
          : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink"
      )}
    >
      {color && (
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      )}
      {label}
    </button>
  );
}
