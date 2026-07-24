import { cn } from "@/lib/utils";

/**
 * AcademiaAI mark — a geometric "A" built from two ascending strokes
 * (an abstract pathway = progress) with a subtle AI sparkle at the apex.
 * Minimal, single-color-capable, crisp at favicon sizes.
 */
export function LogoMark({
  className,
  gradient = true,
}: {
  className?: string;
  gradient?: boolean;
}) {
  const id = gradient ? "aa-grad" : undefined;
  const stroke = gradient ? `url(#${id})` : "currentColor";
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      {gradient && (
        <defs>
          <linearGradient id={id} x1="8" y1="42" x2="40" y2="6" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b6ef6" />
            <stop offset="1" stopColor="#4338ca" />
          </linearGradient>
        </defs>
      )}
      {/* Left ascending stroke */}
      <path
        d="M9 40 L24 8"
        stroke={stroke}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* Right ascending stroke */}
      <path
        d="M39 40 L24 8"
        stroke={stroke}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* Crossbar (the "path forward" line) */}
      <path
        d="M16 29 H32"
        stroke={stroke}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* AI sparkle */}
      <path
        d="M35.5 12.5c.2 2.6.9 3.3 3.5 3.5-2.6.2-3.3.9-3.5 3.5-.2-2.6-.9-3.3-3.5-3.5 2.6-.2 3.3-.9 3.5-3.5Z"
        fill="#10b981"
      />
    </svg>
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
