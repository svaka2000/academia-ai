import { NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe/server";
import { PRICING } from "@/lib/pricing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const body = await request.json().catch(() => ({}));
  const interval: "month" | "year" = body.interval === "year" ? "year" : "month";
  const email: string | undefined =
    typeof body.email === "string" && body.email.includes("@") ? body.email : undefined;

  // No key configured → tell the client to run the demo upgrade.
  if (!stripe) {
    return NextResponse.json({ demo: true });
  }

  const price = interval === "year" ? PRICING.annual : PRICING.monthly;
  const base = siteUrl(request);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      allow_promotion_codes: true,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            recurring: { interval },
            unit_amount: price.amount,
            product_data: {
              name: "AcademiaAI Pro",
              description: "Unlimited assignments, smart planner, and full analytics.",
            },
          },
        },
      ],
      success_url: `${base}/app/settings?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/app/settings?checkout=cancelled`,
      metadata: { product: "academia-ai-pro", interval },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] checkout error:", err);
    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 500 }
    );
  }
}
