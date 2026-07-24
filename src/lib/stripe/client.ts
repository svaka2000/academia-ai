"use client";

export async function startCheckout(
  interval: "month" | "year",
  email?: string
): Promise<"redirect" | "demo" | "error"> {
  try {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interval, email }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return "redirect";
    }
    if (data.demo) return "demo";
    return "error";
  } catch {
    return "error";
  }
}

export async function openPortal(email: string): Promise<"redirect" | "demo" | "error"> {
  try {
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return "redirect";
    }
    if (data.demo) return "demo";
    return "error";
  } catch {
    return "error";
  }
}

export async function verifyCheckout(sessionId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/stripe/verify?session_id=${encodeURIComponent(sessionId)}`);
    const data = await res.json();
    return Boolean(data.paid);
  } catch {
    return false;
  }
}
