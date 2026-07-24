import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "emerald" | "amber" | "rose" | "indigo";

const tones: Record<Tone, string> = {
  neutral: "bg-muted text-ink-soft",
  brand: "bg-brand-50 text-brand-700",
  emerald: "bg-emerald-soft text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  indigo: "bg-indigo-50 text-indigo-700",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.72rem] font-medium leading-5",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
