import { cn } from "@/lib/utils";

/**
 * AcademiaAI brand mark — the official gradient "A" (with AI sparkle + wave),
 * served from /public. Transparent background so it drops onto any surface.
 */
export function LogoMark({
  className,
}: {
  className?: string;
  /** kept for API compatibility with earlier call sites */
  gradient?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/academia-mark.png"
      alt="AcademiaAI"
      width={64}
      height={64}
      className={cn("h-8 w-8 object-contain", className)}
      draggable={false}
    />
  );
}

export function Logo({
  className,
  markClassName,
  wordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={cn("h-7 w-7", markClassName)} />
      {wordmark && (
        <span className="text-[1.075rem] font-bold tracking-[-0.02em] text-ink">
          Academia<span className="text-brand-600">AI</span>
        </span>
      )}
    </span>
  );
}
