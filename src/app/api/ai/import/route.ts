import { NextResponse } from "next/server";
import { importAssignments } from "@/lib/ai/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const raw = typeof body.text === "string" ? body.text : "";
    if (raw.trim().length < 3) {
      return NextResponse.json({ error: "Paste some assignments first." }, { status: 400 });
    }
    const result = await importAssignments(raw);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Could not import these." }, { status: 500 });
  }
}
