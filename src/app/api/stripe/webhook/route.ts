import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

/**
 * Stripe webhook. Verifies the signature and logs subscription lifecycle
 * events. (Entitlement is confirmed on return via /api/stripe/verify, so this
 * is here for auditability and future account-based sync.)
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ received: true, skipped: true });
  }

  const sig = request.headers.get("stripe-signature");
  const payload = await request.text();
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch (err) {
    console.error("[stripe] webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      console.log(`[stripe] ${event.type}`, event.data.object.id);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
