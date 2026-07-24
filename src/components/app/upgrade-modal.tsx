"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { PRICING, PRO_FEATURES } from "@/lib/pricing";
import { startCheckout } from "@/lib/stripe/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function UpgradeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const profile = useStore((s) => s.profile);
  const setPlan = useStore((s) => s.setPlan);
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [loading, setLoading] = useState(false);

  const price = interval === "year" ? PRICING.annual : PRICING.monthly;

  async function upgrade() {
    setLoading(true);
    const result = await startCheckout(interval, profile.email || undefined);
    if (result === "demo") {
      setPlan("pro");
      toast.success("You're on Pro", {
        description: "Demo mode — add a Stripe key to take real payments.",
      });
      onClose();
    } else if (result === "error") {
      toast.error("Couldn't start checkout. Try again.");
    }
    setLoading(false);
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl gradient-brand text-white shadow-[var(--shadow-glow)]">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">
          Upgrade to Pro
        </h2>
        <p className="mt-1.5 text-[0.9rem] text-ink-muted">
          Unlimited assignments and the full study planner.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-center gap-1 rounded-[12px] bg-muted p-1">
        {(["month", "year"] as const).map((iv) => (
          <button
            key={iv}
            onClick={() => setInterval(iv)}
            className={cn(
              "flex-1 rounded-[9px] px-3 py-1.5 text-[0.82rem] font-medium transition-all cursor-pointer",
              interval === iv
                ? "bg-surface text-ink shadow-[var(--shadow-xs)]"
                : "text-ink-muted hover:text-ink-soft"
            )}
          >
            {iv === "month" ? "Monthly" : "Annual"}
            {iv === "year" && (
              <span className="ml-1.5 rounded-full bg-emerald-soft px-1.5 py-0.5 text-[0.62rem] font-semibold text-emerald-700">
                -35%
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-baseline justify-center gap-1">
        <span className="text-4xl font-bold tracking-[-0.03em] text-ink">
          {price.label}
        </span>
        <span className="text-[0.9rem] text-ink-muted">{price.per}</span>
      </div>

      <ul className="mt-5 space-y-2.5">
        {PRO_FEATURES.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-[0.88rem] text-ink-soft">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-soft text-emerald-700">
              <Check className="h-3 w-3" />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Button onClick={upgrade} loading={loading} size="lg" className="mt-6 w-full">
        {!loading && <Sparkles className="h-4 w-4" />}
        Upgrade — {price.label}
        {price.per}
      </Button>
      <p className="mt-3 text-center text-[0.75rem] text-ink-faint">
        Cancel anytime. Secure checkout by Stripe.
      </p>
    </Modal>
  );
}
