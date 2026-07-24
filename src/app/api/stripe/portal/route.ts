import { NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe/server";

export const runtime = "nodejs";

/** Opens the Stripe customer portal for the given email (if a customer exists). */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ demo: true });

  const body = await request.json().catch(() => ({}));
  const email: string | undefined =
    typeof body.email === "string" ? body.email : undefined;
  if (!email) {
    return NextResponse.json({ error: "No email on file." }, { status: 400 });
  }

  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json(
        { error: "No billing account found for this email." },
        { status: 404 }
      );
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${siteUrl(request)}/app/settings`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] portal error:", err);
    return NextResponse.json(
      { error: "Could not open billing portal." },
      { status: 500 }
    );
  }
}
