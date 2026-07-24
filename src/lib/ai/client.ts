"use client";

import type { ParsedAssignment } from "./server";

export async function requestBreakdown(input: {
  title: string;
  course?: string;
  notes?: string;
  estimatedMinutes?: number;
}): Promise<{ steps: string[]; source: "ai" | "heuristic" }> {
  const res = await fetch("/api/ai/breakdown", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed");
  return res.json();
}

export async function requestImport(
  text: string
): Promise<{ items: ParsedAssignment[]; source: "ai" | "heuristic" }> {
  const res = await fetch("/api/ai/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed");
  return res.json();
}
