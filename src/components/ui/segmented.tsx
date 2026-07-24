"use client";

import { cn } from "@/lib/utils";

export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex w-full rounded-[12px] bg-muted p-1 gap-1",
        className
      )}
      role="radiogroup"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 rounded-[9px] px-2 py-1.5 text-[0.8rem] font-medium transition-all duration-200 cursor-pointer",
              active
                ? "bg-surface text-ink shadow-[var(--shadow-xs)]"
                : "text-ink-muted hover:text-ink-soft"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function LevelPicker({
  value,
  onChange,
  labels,
  activeClass = "gradient-brand text-white",
}: {
  value: number;
  onChange: (v: number) => void;
  labels: string[];
  activeClass?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            aria-label={`${labels[n]} (${n} of 5)`}
            onClick={() => onChange(n)}
            className={cn(
              "h-9 flex-1 rounded-[10px] text-[0.78rem] font-semibold transition-all duration-150 cursor-pointer",
              active
                ? activeClass
                : "bg-muted text-ink-faint hover:bg-line-strong"
            )}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
