import { NextResponse } from "next/server";
import { breakdown } from "@/lib/ai/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json({ error: "A title is required." }, { status: 400 });
    }
    const result = await breakdown({
      title,
      course: body.course,
      notes: body.notes,
      estimatedMinutes: body.estimatedMinutes,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Could not break this down." }, { status: 500 });
  }
}
