import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

/** Called on return from Checkout to confirm payment before unlocking Pro. */
export async function GET(request: Request) {
  const stripe = getStripe();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!stripe) return NextResponse.json({ paid: true, demo: true });
  if (!sessionId) return NextResponse.json({ paid: false }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid =
      session.payment_status === "paid" || session.status === "complete";
    return NextResponse.json({
      paid,
      email: session.customer_details?.email ?? null,
    });
  } catch (err) {
    console.error("[stripe] verify error:", err);
    return NextResponse.json({ paid: false }, { status: 500 });
  }
}
