import {
  CalendarClock,
  ListTodo,
  Settings,
  Sun,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Today", icon: Sun },
  { href: "/app/assignments", label: "Assignments", icon: ListTodo },
  { href: "/app/planner", label: "Planner", icon: CalendarClock },
  { href: "/app/focus", label: "Focus", icon: Target },
  { href: "/app/progress", label: "Progress", icon: TrendingUp },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

/** Bottom mobile bar shows the 5 most-used destinations. */
export const MOBILE_NAV = NAV_ITEMS.filter((n) => n.href !== "/app/settings");
