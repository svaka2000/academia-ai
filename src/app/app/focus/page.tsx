"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Coffee,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Target,
} from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { useStore } from "@/lib/store";
import { nextTask, todayPlan } from "@/lib/selectors";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DURATIONS = [15, 25, 45];

function FocusInner() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("id");

  const assignments = useStore((s) => s.assignments);
  const toggleSubtask = useStore((s) => s.toggleSubtask);
  const setStatus = useStore((s) => s.setStatus);
  const logSession = useStore((s) => s.logSession);

  const active = todayPlan(assignments);
  const task = useMemo(() => {
    if (requestedId) {
      const found = assignments.find((a) => a.id === requestedId);
      if (found && found.status !== "done") return found;
    }
    return nextTask(assignments);
  }, [assignments, requestedId]);

  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const loggedRef = useRef(0);

  // Reset timer when the task or duration changes.
  useEffect(() => {
    setRemaining(duration * 60);
    setRunning(false);
    loggedRef.current = 0;
  }, [task?.id, duration]);

  // Tick.
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          setRunning(false);
          logFocus(duration * 60);
          toast.success("Session complete", {
            description: "Nice focus. Take a short break.",
          });
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, duration]);

  function logFocus(elapsedSeconds: number) {
    const mins = Math.floor(elapsedSeconds / 60) - loggedRef.current;
    if (mins >= 1 && task) {
      logSession(task.id, mins);
      loggedRef.current += mins;
    }
  }

  function handlePause() {
    setRunning(false);
    logFocus(duration * 60 - remaining);
  }

  function handleComplete() {
    if (!task) return;
    logFocus(duration * 60 - remaining);
    setStatus(task.id, "done");
    setRunning(false);
    toast.success("Done!", { description: "Moving you to the next thing." });
  }

  if (!task) {
    return (
      <div className="animate-fade-up">
        <BackLink />
        <EmptyState
          icon={<Coffee className="h-6 w-6" />}
          title="Nothing to focus on"
          description="You've cleared your plan. Add an assignment or take a well-earned break."
          className="mt-4"
          action={
            <Link href="/app">
              <Button variant="outline">Back to Today</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const progress = ((duration * 60 - remaining) / (duration * 60)) * 100;
  const upcoming = active.filter((a) => a.id !== task.id).slice(0, 2);
  const doneSubs = task.subtasks.filter((s) => s.done).length;

  return (
    <div className="animate-fade-up">
      <BackLink />

      <div className="mx-auto mt-2 max-w-lg text-center">
        <div className="mb-1 flex items-center justify-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: task.courseColor }}
          />
          <span className="text-[0.8rem] font-medium text-ink-muted">
            {task.course}
          </span>
        </div>
        <h1 className="text-balance text-[1.4rem] font-bold tracking-[-0.02em] text-ink sm:text-[1.6rem]">
          {task.title}
        </h1>

        {/* Timer */}
        <div className="my-8 flex justify-center">
          <ProgressRing value={progress} size={228} stroke={16}>
            <div className="text-center">
              <div className="font-bold tabular-nums tracking-[-0.03em] text-ink text-[3rem] leading-none">
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </div>
              <div className="mt-2 text-[0.78rem] font-medium text-ink-muted">
                {running ? "Focusing…" : "Ready when you are"}
              </div>
            </div>
          </ProgressRing>
        </div>

        {/* Duration presets */}
        {!running && remaining === duration * 60 && (
          <div className="mb-5 flex items-center justify-center gap-1.5">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={cn(
                  "h-9 rounded-[10px] px-4 text-[0.82rem] font-medium transition-colors cursor-pointer",
                  duration === d
                    ? "bg-brand-600 text-white"
                    : "bg-muted text-ink-muted hover:bg-line-strong"
                )}
              >
                {d} min
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-2.5">
          <Button
            size="lg"
            onClick={() => (running ? handlePause() : setRunning(true))}
            className="min-w-[148px]"
          >
            {running ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> {remaining === duration * 60 ? "Start" : "Resume"}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setRemaining(duration * 60);
              setRunning(false);
              loggedRef.current = 0;
            }}
            aria-label="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setRemaining((r) => r + 300)}
            aria-label="Add 5 minutes"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Subtasks */}
        {task.subtasks.length > 0 && (
          <div className="mt-8 rounded-[var(--radius-lg)] border border-line bg-surface p-4 text-left">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.82rem] font-semibold text-ink">Steps</span>
              <span className="text-[0.75rem] text-ink-muted">
                {doneSubs}/{task.subtasks.length}
              </span>
            </div>
            <ul className="space-y-0.5">
              {task.subtasks.map((st) => (
                <li key={st.id}>
                  <button
                    onClick={() => toggleSubtask(task.id, st.id)}
                    className="flex w-full items-center gap-2.5 rounded-[9px] px-2 py-2 text-left hover:bg-subtle transition-colors cursor-pointer"
                  >
                    <span
                      className={cn(
                        "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[6px] border transition-colors",
                        st.done
                          ? "bg-emerald-brand border-transparent"
                          : "border-line-strong"
                      )}
                    >
                      {st.done && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <span
                      className={cn(
                        "text-[0.86rem]",
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

        <Button variant="secondary" onClick={handleComplete} className="mt-6 w-full" size="lg">
          <Check className="h-4 w-4" /> Mark complete
        </Button>

        {/* Up next */}
        {upcoming.length > 0 && (
          <div className="mt-8 text-left">
            <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-wide text-ink-faint">
              Up next
            </p>
            <div className="space-y-2">
              {upcoming.map((a) => (
                <Link
                  key={a.id}
                  href={`/app/focus?id=${a.id}`}
                  className="flex items-center gap-3 rounded-[12px] border border-line bg-surface px-3.5 py-3 transition-colors hover:border-line-strong"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-muted text-ink-faint">
                    <Target className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[0.85rem] font-medium text-ink">
                      {a.title}
                    </div>
                    <div className="text-[0.72rem] text-ink-muted">{a.course}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/app"
      className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-ink-muted hover:text-ink transition-colors"
    >
      <ArrowLeft className="h-4 w-4" /> Back
    </Link>
  );
}

export default function FocusPage() {
  return (
    <Suspense fallback={null}>
      <FocusInner />
    </Suspense>
  );
}
