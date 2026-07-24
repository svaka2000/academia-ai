"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "subtle"
  | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "gradient-brand text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)] hover:brightness-[1.05] active:brightness-95",
  secondary:
    "bg-ink text-white hover:bg-ink-soft shadow-[var(--shadow-sm)] active:scale-[0.99]",
  outline:
    "border border-line-strong bg-surface text-ink hover:bg-subtle hover:border-ink-faint active:bg-muted",
  ghost: "text-ink-soft hover:bg-muted hover:text-ink",
  subtle: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  danger:
    "bg-rose-brand text-white hover:brightness-105 shadow-[var(--shadow-sm)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 rounded-[10px] px-3.5 text-[0.82rem]",
  md: "h-11 rounded-[12px] px-5 text-[0.9rem]",
  lg: "h-[52px] rounded-[14px] px-7 text-[0.98rem]",
  icon: "h-10 w-10 rounded-[12px]",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
