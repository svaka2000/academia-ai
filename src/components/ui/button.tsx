"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * shadcn / Base UI button, extended with AcademiaAI's brand variants
 * (gradient primary, ink secondary, subtle, danger) and a `loading` state.
 */
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap select-none cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-55 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
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
      },
      size: {
        xs: "h-8 rounded-[9px] px-3 text-[0.78rem]",
        sm: "h-9 rounded-[10px] px-3.5 text-[0.82rem]",
        md: "h-11 rounded-[12px] px-5 text-[0.9rem]",
        lg: "h-[52px] rounded-[14px] px-7 text-[0.98rem]",
        icon: "h-10 w-10 rounded-[12px]",
        "icon-xs": "h-7 w-7 rounded-[9px]",
        "icon-sm": "h-8 w-8 rounded-[10px]",
        "icon-lg": "h-11 w-11 rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

function Button({
  className,
  variant,
  size,
  loading,
  children,
  disabled,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & { loading?: boolean }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
