"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { requestImport } from "@/lib/ai/client";
import type { ParsedAssignment } from "@/lib/ai/server";
import { useStore } from "@/lib/store";
import { dueLabel, formatMinutes } from "@/lib/priority";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const EXAMPLE = `Chemistry: Titration lab report - due Friday
AP US History DBQ essay (due tomorrow)
Calc BC 7.4 problem set - due 10/28
English: read Gatsby ch 4-6
Spanish vocab quiz Thursday`;

export function ImportModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addAssignment = useStore((s) => s.addAssignment);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ParsedAssignment[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  function reset() {
    setText("");
    setItems(null);
    setSelected(new Set());
    setLoading(false);
  }

  async function parse() {
    if (text.trim().length < 3) return;
    setLoading(true);
    try {
      const res = await requestImport(text);
      if (res.items.length === 0) {
        toast.error("Couldn't find any assignments in that text.");
      } else {
        setItems(res.items);
        setSelected(new Set(res.items.map((_, i) => i)));
      }
    } catch {
      toast.error("Import failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function confirm() {
    if (!items) return;
    const chosen = items.filter((_, i) => selected.has(i));
    chosen.forEach((it) =>
      addAssignment({
        title: it.title,
        course: it.course,
        dueDate: it.dueDate,
        difficulty: it.difficulty,
        estimatedMinutes: it.estimatedMinutes,
        importance: it.importance,
      })
    );
    toast.success(`Added ${chosen.length} assignment${chosen.length === 1 ? "" : "s"}`, {
      description: "AcademiaAI has prioritized them for you.",
    });
    reset();
    onClose();
  }

  function toggle(i: number) {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setSelected(next);
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      size="lg"
      title="Import assignments"
      description="Paste from Google Classroom, Canvas, or a syllabus — AcademiaAI reads it and fills in the details."
    >
      {!items ? (
        <div className="space-y-4">
          <Textarea
            autoFocus
            className="min-h-[180px] font-[450]"
            placeholder={EXAMPLE}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setText(EXAMPLE)}
              className="text-[0.8rem] text-ink-muted hover:text-brand-600 transition-colors cursor-pointer"
            >
              Use an example
            </button>
            <Button onClick={parse} loading={loading} disabled={text.trim().length < 3}>
              {!loading && <Sparkles className="h-4 w-4" />}
              Read assignments
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-[0.85rem] text-ink-muted">
            Found <span className="font-semibold text-ink">{items.length}</span>.
            Uncheck anything you don&apos;t want.
          </p>
          <div className="max-h-[46vh] space-y-2 overflow-y-auto pr-1">
            {items.map((it, i) => {
              const on = selected.has(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[12px] border px-3.5 py-3 text-left transition-all cursor-pointer",
                    on
                      ? "border-brand-200 bg-brand-50/60"
                      : "border-line bg-surface opacity-60 hover:opacity-100"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border transition-colors",
                      on ? "gradient-brand border-transparent" : "border-line-strong bg-surface"
                    )}
                  >
                    {on && <Check className="h-3.5 w-3.5 text-white" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[0.9rem] font-medium text-ink">
                      {it.title}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.75rem] text-ink-muted">
                      <span>{it.course}</span>
                      <span className="text-line-strong">·</span>
                      <span>{dueLabel(it.dueDate)}</span>
                      <span className="text-line-strong">·</span>
                      <span>{formatMinutes(it.estimatedMinutes)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button onClick={confirm} className="flex-1" disabled={selected.size === 0}>
              Add {selected.size} assignment{selected.size === 1 ? "" : "s"}
            </Button>
            <Button variant="ghost" onClick={() => setItems(null)}>
              Back
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
