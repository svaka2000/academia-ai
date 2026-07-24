"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { MOBILE_NAV } from "./nav-config";
import { useAppUI } from "./ui-context";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { openAdd } = useAppUI();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-surface/90 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 items-center px-1">
        {MOBILE_NAV.slice(0, 2).map((item) => (
          <NavButton key={item.href} item={item} pathname={pathname} />
        ))}

        <div className="flex justify-center">
          <button
            onClick={openAdd}
            aria-label="New assignment"
            className="grid h-12 w-12 -translate-y-3 place-items-center rounded-2xl gradient-brand text-white shadow-[var(--shadow-glow)] cursor-pointer active:scale-95 transition-transform"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        {MOBILE_NAV.slice(2, 4).map((item) => (
          <NavButton key={item.href} item={item} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}

function NavButton({
  item,
  pathname,
}: {
  item: (typeof MOBILE_NAV)[number];
  pathname: string;
}) {
  const active =
    item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center gap-0.5 py-2.5 text-[0.62rem] font-medium transition-colors",
        active ? "text-brand-600" : "text-ink-faint"
      )}
    >
      <Icon className="h-[22px] w-[22px]" />
      {item.label}
    </Link>
  );
}
