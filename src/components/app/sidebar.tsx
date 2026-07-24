"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Sparkles, Plus } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NAV_ITEMS } from "./nav-config";
import { useAppUI } from "./ui-context";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { openAdd, openUpgrade } = useAppUI();
  const profile = useStore((s) => s.profile);

  return (
    <aside className="hidden lg:flex w-[248px] shrink-0 flex-col border-r border-line bg-subtle/40 px-4 py-5">
      <Link href="/app" className="px-2 pb-6">
        <Logo />
      </Link>

      <button
        onClick={openAdd}
        className="mb-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[12px] gradient-brand text-[0.9rem] font-medium text-white shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-glow)] hover:brightness-[1.05] cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        New assignment
      </button>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-[11px] px-3 py-2.5 text-[0.88rem] font-medium transition-colors duration-150",
                active
                  ? "bg-surface text-brand-700 shadow-[var(--shadow-xs)]"
                  : "text-ink-muted hover:bg-muted hover:text-ink"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  active ? "text-brand-600" : "text-ink-faint group-hover:text-ink-soft"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2.5 rounded-[12px] border border-line bg-surface px-3 py-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-amber-50 text-amber-brand">
            <Flame className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="text-[0.9rem] font-semibold text-ink">
              {profile.streak} day{profile.streak === 1 ? "" : "s"}
            </div>
            <div className="text-[0.72rem] text-ink-muted">study streak</div>
          </div>
        </div>

        {profile.plan === "free" ? (
          <button
            onClick={openUpgrade}
            className="w-full rounded-[14px] gradient-brand-soft border border-brand-100 p-3.5 text-left transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-brand-700">
              <Sparkles className="h-3.5 w-3.5" />
              Upgrade to Pro
            </div>
            <p className="mt-0.5 text-[0.72rem] leading-snug text-ink-muted">
              Unlimited assignments & the smart planner.
            </p>
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-[12px] border border-emerald-200 bg-emerald-soft px-3 py-2.5">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            <span className="text-[0.82rem] font-semibold text-emerald-700">
              Pro member
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
