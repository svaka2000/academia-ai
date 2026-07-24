"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  CreditCard,
  Plus,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import { useAppUI } from "@/components/app/ui-context";
import { useStore } from "@/lib/store";
import { verifyCheckout, openPortal } from "@/lib/stripe/client";
import { FREE_ACTIVE_LIMIT } from "@/lib/pricing";
import { toast } from "sonner";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const hourLabel = (h: number) => {
  const p = h < 12 ? "AM" : "PM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:00 ${p}`;
};

function SettingsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const profile = useStore((s) => s.profile);
  const assignments = useStore((s) => s.assignments);
  const updateProfile = useStore((s) => s.updateProfile);
  const updateCommitments = useStore((s) => s.updateCommitments);
  const setPlan = useStore((s) => s.setPlan);
  const loadSampleData = useStore((s) => s.loadSampleData);
  const resetAll = useStore((s) => s.resetAll);
  const { openUpgrade } = useAppUI();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [activityInput, setActivityInput] = useState("");

  // Handle return from Stripe Checkout.
  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (!checkout) return;
    if (checkout === "cancelled") {
      toast("Checkout cancelled");
      router.replace("/app/settings");
      return;
    }
    if (checkout === "success") {
      const sessionId = searchParams.get("session_id");
      (async () => {
        if (!sessionId) {
          setPlan("pro");
        } else {
          const paid = await verifyCheckout(sessionId);
          if (paid) {
            setPlan("pro");
            toast.success("Welcome to Pro", {
              description: "Everything's unlocked. Thank you!",
            });
          } else {
            toast.error("We couldn't confirm your payment.");
          }
        }
        router.replace("/app/settings");
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function addActivity() {
    const v = activityInput.trim();
    if (v && !profile.commitments.activities.includes(v)) {
      updateCommitments({ activities: [...profile.commitments.activities, v] });
    }
    setActivityInput("");
  }

  async function manageBilling() {
    if (!profile.email) {
      toast.error("Add your email above first.");
      return;
    }
    const res = await openPortal(profile.email);
    if (res === "demo") {
      setPlan("free");
      toast("Downgraded to Free", {
        description: "Demo mode — real billing opens the Stripe portal.",
      });
    } else if (res === "error") {
      toast.error("Couldn't open billing. Try again later.");
    }
  }

  const activeCount = assignments.filter((a) => a.status !== "done").length;

  return (
    <div className="animate-fade-up max-w-3xl">
      <PageHeader title="Settings" subtitle="Your account, schedule, and plan." />

      <div className="space-y-5">
        {/* Account */}
        <Card className="p-5 sm:p-6">
          <SectionTitle icon={<User className="h-4 w-4" />} title="Account" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="set-name">Name</Label>
              <Input
                id="set-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => updateProfile({ name: name.trim() })}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="set-email">Email</Label>
              <Input
                id="set-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => updateProfile({ email: email.trim() })}
                placeholder="you@school.edu"
              />
            </div>
          </div>
        </Card>

        {/* Schedule */}
        <Card className="p-5 sm:p-6">
          <SectionTitle icon={<Sparkles className="h-4 w-4" />} title="Study schedule" />
          <p className="mt-1 text-[0.8rem] text-ink-muted">
            AcademiaAI plans your work inside this window and protects your sleep.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Study from</Label>
              <Select
                value={profile.commitments.studyStartHour}
                onChange={(e) => updateCommitments({ studyStartHour: Number(e.target.value) })}
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {hourLabel(h)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Wind down by</Label>
              <Select
                value={profile.commitments.studyEndHour}
                onChange={(e) => updateCommitments({ studyEndHour: Number(e.target.value) })}
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {hourLabel(h)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Sleep (hours)</Label>
              <Select
                value={profile.commitments.sleepHours}
                onChange={(e) => updateCommitments({ sleepHours: Number(e.target.value) })}
              >
                {[6, 7, 8, 9, 10].map((h) => (
                  <option key={h} value={h}>
                    {h} hours
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="set-act">Commitments</Label>
            <div className="flex gap-2">
              <Input
                id="set-act"
                placeholder="e.g. Wrestling, part-time job, robotics club"
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addActivity();
                  }
                }}
              />
              <Button type="button" variant="outline" size="icon" onClick={addActivity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {profile.commitments.activities.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {profile.commitments.activities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[0.78rem] font-medium text-brand-700"
                  >
                    {a}
                    <button
                      onClick={() =>
                        updateCommitments({
                          activities: profile.commitments.activities.filter((x) => x !== a),
                        })
                      }
                      className="text-brand-400 hover:text-brand-700 cursor-pointer"
                      aria-label={`Remove ${a}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Plan & billing */}
        <Card className="p-5 sm:p-6">
          <SectionTitle icon={<CreditCard className="h-4 w-4" />} title="Plan & billing" />
          {profile.plan === "pro" ? (
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-[11px] gradient-brand text-white">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[0.95rem] font-semibold text-ink">
                    AcademiaAI Pro
                  </div>
                  <div className="text-[0.8rem] text-ink-muted">
                    Unlimited assignments & the full planner.
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={manageBilling}>
                Manage billing
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[0.95rem] font-semibold text-ink">Free plan</div>
                  <div className="text-[0.8rem] text-ink-muted">
                    {activeCount}/{FREE_ACTIVE_LIMIT} active assignments used
                  </div>
                </div>
                <Button onClick={openUpgrade}>
                  <Sparkles className="h-4 w-4" /> Upgrade
                </Button>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full gradient-brand transition-[width] duration-500"
                  style={{
                    width: `${Math.min(100, (activeCount / FREE_ACTIVE_LIMIT) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Data */}
        <Card className="p-5 sm:p-6">
          <SectionTitle icon={<Trash2 className="h-4 w-4" />} title="Data" />
          <p className="mt-1 text-[0.8rem] text-ink-muted">
            Your data lives privately on this device — nothing is stored on our servers.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {assignments.length === 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  loadSampleData();
                  toast.success("Sample data loaded");
                }}
              >
                <Check className="h-4 w-4" /> Load sample data
              </Button>
            )}
            <Button
              variant="danger"
              onClick={() => {
                if (
                  confirm(
                    "Reset everything? This deletes all assignments, sessions, and settings on this device."
                  )
                ) {
                  resetAll();
                  toast("All data cleared");
                }
              }}
            >
              <Trash2 className="h-4 w-4" /> Reset all data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-muted text-ink-soft">
        {icon}
      </span>
      <h2 className="text-[0.95rem] font-semibold text-ink">{title}</h2>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsInner />
    </Suspense>
  );
}
