"use client";

import { Flame } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Onboarding } from "./onboarding";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export function AppShell({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const onboarded = useStore((s) => s.profile.onboarded);
  const streak = useStore((s) => s.profile.streak);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Logo />
      </div>
    );
  }

  return (
    <>
      {!onboarded && <Onboarding />}
      <div className="flex min-h-dvh">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile header */}
          <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface/85 backdrop-blur-lg px-4 py-3">
            <Logo />
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[0.78rem] font-semibold text-amber-brand">
              <Flame className="h-3.5 w-3.5" />
              {streak}
            </div>
          </header>

          <main className="flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
      <MobileNav />
    </>
  );
}
