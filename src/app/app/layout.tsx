import type { Metadata } from "next";
import { AppUIProvider } from "@/components/app/ui-context";
import { AppShell } from "@/components/app/app-shell";

export const metadata: Metadata = {
  title: "Workspace",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppUIProvider>
      <AppShell>{children}</AppShell>
    </AppUIProvider>
  );
}
