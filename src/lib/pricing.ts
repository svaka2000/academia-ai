export const PRICING = {
  monthly: { amount: 499, label: "$4.99", per: "/month", interval: "month" as const },
  annual: { amount: 3900, label: "$39", per: "/year", interval: "year" as const, note: "Save 35%" },
};

export const FREE_FEATURES = [
  "Up to 10 active assignments",
  "AI prioritized daily plan",
  "Homework breakdown into steps",
  "Focus mode & study timer",
  "Progress & streak tracking",
];

export const PRO_FEATURES = [
  "Unlimited assignments & courses",
  "Smart study planner around your schedule",
  "Advanced AI breakdown & import",
  "Full progress analytics & history",
  "Priority AI (faster, smarter)",
  "Everything in Free",
];

/** Free plan caps active assignments; Pro is unlimited. */
export const FREE_ACTIVE_LIMIT = 10;
