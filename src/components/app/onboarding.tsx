"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Plus, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/field";
import { useStore } from "@/lib/store";
import { useAppUI } from "./ui-context";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
function hourLabel(h: number) {
  const period = h < 12 ? "AM" : "PM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:00 ${period}`;
}

export function Onboarding() {
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const loadSampleData = useStore((s) => s.loadSampleData);
  const { openImport, openAdd } = useAppUI();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sleepHours, setSleepHours] = useState(8);
  const [studyStartHour, setStudyStartHour] = useState(16);
  const [studyEndHour, setStudyEndHour] = useState(22);
  const [activities, setActivities] = useState<string[]>([]);
  const [activityInput, setActivityInput] = useState("");

  function addActivity() {
    const v = activityInput.trim();
    if (v && !activities.includes(v)) setActivities([...activities, v]);
    setActivityInput("");
  }

  function finish(then?: "import" | "add" | "sample") {
    completeOnboarding({
      name,
      email,
      commitments: { sleepHours, studyStartHour, studyEndHour, activities },
    });
    if (then === "sample") loadSampleData();
    if (then === "import") setTimeout(openImport, 250);
    if (then === "add") setTimeout(openAdd, 250);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-[22px] border border-line bg-surface p-7 shadow-[var(--shadow-lg)]">
          {/* Progress dots */}
          <div className="mb-6 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === step ? "w-6 bg-brand-600" : i < step ? "w-1.5 bg-brand-300" : "w-1.5 bg-line-strong"
                )}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <Step key="welcome">
                <h1 className="text-center text-[1.4rem] font-bold tracking-[-0.02em] text-ink">
                  Welcome to AcademiaAI
                </h1>
                <p className="mt-2 text-center text-[0.9rem] leading-relaxed text-ink-muted">
                  Add your assignments once. We&apos;ll organize everything into a
                  clear daily plan — so you always know exactly what to work on next.
                </p>
                <div className="mt-6">
                  <Label htmlFor="ob-name">What should we call you?</Label>
                  <Input
                    id="ob-name"
                    autoFocus
                    placeholder="Your first name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setStep(1)}
                  />
                </div>
                <Button className="mt-5 w-full" size="lg" onClick={() => setStep(1)}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </Step>
            )}

            {step === 1 && (
              <Step key="schedule">
                <h1 className="text-center text-[1.3rem] font-bold tracking-[-0.02em] text-ink">
                  Your week, roughly
                </h1>
                <p className="mt-1.5 text-center text-[0.875rem] text-ink-muted">
                  So your plan fits around real life. You can change this anytime.
                </p>

                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Study from</Label>
                      <Select
                        value={studyStartHour}
                        onChange={(e) => setStudyStartHour(Number(e.target.value))}
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
                        value={studyEndHour}
                        onChange={(e) => setStudyEndHour(Number(e.target.value))}
                      >
                        {HOURS.map((h) => (
                          <option key={h} value={h}>
                            {hourLabel(h)}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ob-act">
                      Commitments (sports, work, clubs)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="ob-act"
                        placeholder="e.g. Wrestling practice"
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
                    {activities.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {activities.map((a) => (
                          <span
                            key={a}
                            className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[0.78rem] font-medium text-brand-700"
                          >
                            {a}
                            <button
                              onClick={() => setActivities(activities.filter((x) => x !== a))}
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
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(0)}>
                    Back
                  </Button>
                  <Button className="flex-1" size="lg" onClick={() => setStep(2)}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Step>
            )}

            {step === 2 && (
              <Step key="start">
                <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-emerald-soft text-emerald-700">
                  <Check className="h-5 w-5" />
                </div>
                <h1 className="text-center text-[1.3rem] font-bold tracking-[-0.02em] text-ink">
                  You&apos;re set{name ? `, ${name}` : ""}
                </h1>
                <p className="mt-1.5 text-center text-[0.875rem] text-ink-muted">
                  Add your assignments and AcademiaAI takes it from there.
                </p>

                <div className="mt-5 space-y-2.5">
                  <button
                    onClick={() => finish("import")}
                    className="flex w-full items-center gap-3 rounded-[14px] border border-brand-200 bg-brand-50/50 p-4 text-left transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-[10px] gradient-brand text-white">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-[0.9rem] font-semibold text-ink">
                        Import from Classroom or Canvas
                      </div>
                      <div className="text-[0.76rem] text-ink-muted">
                        Paste your list — AI fills in the details
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => finish("add")}
                    className="flex w-full items-center gap-3 rounded-[14px] border border-line bg-surface p-4 text-left transition-all hover:bg-subtle cursor-pointer"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-muted text-ink-soft">
                      <Plus className="h-4 w-4" />
                    </span>
                    <div className="text-[0.9rem] font-semibold text-ink">
                      Add one manually
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => finish("sample")}
                  className="mt-4 w-full text-center text-[0.8rem] text-ink-muted hover:text-brand-600 transition-colors cursor-pointer"
                >
                  Just exploring? Start with sample data
                </button>
              </Step>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Step({ children }: { children: React.ReactNode; key: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
