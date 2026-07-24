"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" aria-label="AcademiaAI home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-[9px] px-3.5 py-2 text-[0.875rem] font-medium text-ink-muted hover:text-ink hover:bg-muted transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/app"
            className="hidden sm:inline-flex h-9 items-center rounded-[10px] px-3.5 text-[0.875rem] font-medium text-ink-soft hover:text-ink hover:bg-muted transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/app"
            className="inline-flex h-9 items-center rounded-[10px] gradient-brand px-4 text-[0.875rem] font-medium text-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)] hover:brightness-[1.05] transition-all"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
