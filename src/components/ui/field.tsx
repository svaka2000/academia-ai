"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input as ShadInput } from "@/components/ui/input";
import { Textarea as ShadTextarea } from "@/components/ui/textarea";

/**
 * AcademiaAI form primitives — thin brand-styled wrappers over the shadcn
 * Input/Textarea, plus a styled native Select and Label. Keeps the app's
 * existing form call sites working while sitting on shadcn underneath.
 */

const controlBase =
  "w-full rounded-[12px] border border-line-strong bg-surface px-3.5 text-[0.9rem] text-ink placeholder:text-ink-faint transition-all duration-200 focus-visible:border-brand-400 focus-visible:ring-4 focus-visible:ring-brand-100 focus-visible:outline-none disabled:opacity-60 disabled:bg-subtle";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-[0.8rem] font-medium text-ink-soft mb-1.5",
        className
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.ComponentProps<typeof ShadInput>) {
  return <ShadInput className={cn(controlBase, "h-11", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<typeof ShadTextarea>) {
  return (
    <ShadTextarea
      className={cn(
        controlBase,
        "py-2.5 min-h-[92px] resize-y leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(controlBase, "h-11 appearance-none pr-9 cursor-pointer", className)}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
