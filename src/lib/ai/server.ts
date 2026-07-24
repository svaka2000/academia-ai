import Groq from "groq-sdk";

/**
 * AI service. Prefers Groq (fast, free tier) when GROQ_API_KEY is set, and
 * degrades to deterministic heuristics so the product works with zero keys.
 */

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export function hasLLM(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

let client: Groq | null = null;
function groq(): Groq | null {
  if (!process.env.GROQ_API_KEY) return null;
  if (!client) client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return client;
}

/** Call the LLM and parse a JSON object from the response. Returns null on any failure. */
export async function llmJSON<T>(system: string, user: string): Promise<T | null> {
  const g = groq();
  if (!g) return null;
  try {
    const res = await g.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.4,
      max_tokens: 1400,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const text = res.choices[0]?.message?.content?.trim();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch (err) {
    console.error("[ai] llm call failed, using fallback:", err);
    return null;
  }
}

/* ------------------------------------------------------------------ *
 *  Homework breakdown
 * ------------------------------------------------------------------ */

export async function breakdown(input: {
  title: string;
  course?: string;
  notes?: string;
  estimatedMinutes?: number;
}): Promise<{ steps: string[]; source: "ai" | "heuristic" }> {
  const ai = await llmJSON<{ steps: string[] }>(
    "You are AcademiaAI, a calm, expert study planner. Break a student's assignment into 3-6 concrete, sequential steps. Each step is a short actionable phrase (max 8 words), no numbering, no fluff. Respond as JSON: {\"steps\": string[]}.",
    `Assignment: ${input.title}\nCourse: ${input.course ?? "General"}\nNotes: ${
      input.notes ?? "none"
    }\nEstimated time: ${input.estimatedMinutes ?? "unknown"} minutes`
  );
  if (ai?.steps && Array.isArray(ai.steps) && ai.steps.length > 0) {
    return { steps: ai.steps.slice(0, 6).map(cleanStep), source: "ai" };
  }
  return { steps: heuristicBreakdown(input.title), source: "heuristic" };
}

function cleanStep(s: string): string {
  return String(s).replace(/^\s*[\d.)\-•]+\s*/, "").trim().slice(0, 90);
}

export function heuristicBreakdown(title: string): string[] {
  const t = title.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));

  if (has("essay", "paper", "dbq", "frq essay", "write", "writing", "report")) {
    if (has("lab", "titration", "experiment")) {
      return [
        "Review data & observations",
        "Write methods & procedure",
        "Analyze results",
        "Write discussion & conclusion",
        "Format and submit",
      ];
    }
    return [
      "Research & gather evidence",
      "Write thesis and outline",
      "Draft body paragraphs",
      "Write intro & conclusion",
      "Revise, proofread & submit",
    ];
  }
  if (has("read", "chapter", "ch.", "reading", "novel")) {
    return ["Read the assigned pages", "Annotate key ideas", "Write a short summary"];
  }
  if (has("problem set", "pset", "worksheet", "problems", "homework", "hw", "exercises")) {
    return ["Work through the problems", "Check your answers", "Redo any you missed"];
  }
  if (has("study", "quiz", "test", "exam", "midterm", "final", "vocab")) {
    return [
      "Review notes & key terms",
      "Make flashcards or a study sheet",
      "Do practice questions",
      "Self-test on weak spots",
    ];
  }
  if (has("project", "presentation", "slides", "poster", "build")) {
    return ["Plan & outline the project", "Build the main content", "Review, polish & rehearse"];
  }
  return ["Get set up and started", "Do the main work", "Review and finish"];
}

/* ------------------------------------------------------------------ *
 *  Assignment import (parse pasted Classroom / Canvas text)
 * ------------------------------------------------------------------ */

export interface ParsedAssignment {
  title: string;
  course: string;
  dueDate: string | null;
  difficulty: number;
  estimatedMinutes: number;
  importance: number;
}

export async function importAssignments(
  raw: string
): Promise<{ items: ParsedAssignment[]; source: "ai" | "heuristic" }> {
  const today = new Date().toISOString().slice(0, 10);
  const ai = await llmJSON<{ items: ParsedAssignment[] }>(
    `You are AcademiaAI. Extract each distinct assignment from pasted text (from Google Classroom, Canvas, a syllabus, or notes). For each, infer: title (concise), course, dueDate (ISO yyyy-mm-dd or null), difficulty (1-5), estimatedMinutes (realistic), importance (1-5, higher for tests/essays/projects). Today is ${today}. Convert relative dates ("Friday", "tomorrow", "next week") to absolute ISO dates. Respond as JSON: {"items": Assignment[]}.`,
    raw.slice(0, 4000)
  );
  if (ai?.items && Array.isArray(ai.items) && ai.items.length > 0) {
    return { items: ai.items.map(normalizeParsed).slice(0, 40), source: "ai" };
  }
  return { items: heuristicImport(raw), source: "heuristic" };
}

function normalizeParsed(p: Partial<ParsedAssignment>): ParsedAssignment {
  return {
    title: (p.title || "Untitled assignment").toString().slice(0, 140),
    course: (p.course || "General").toString().slice(0, 60),
    dueDate: normalizeDate(p.dueDate ?? null),
    difficulty: clampInt(p.difficulty, 1, 5, 3),
    estimatedMinutes: clampInt(p.estimatedMinutes, 5, 480, 45),
    importance: clampInt(p.importance, 1, 5, 3),
  };
}

function clampInt(v: unknown, min: number, max: number, dflt: number): number {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return dflt;
  return Math.max(min, Math.min(max, n));
}

function normalizeDate(d: string | null): string | null {
  if (!d) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const t = new Date(d).getTime();
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
}

export function heuristicImport(raw: string): ParsedAssignment[] {
  const lines = raw
    .split(/\r?\n|(?:•|·|—|•)/)
    .map((l) => l.trim())
    .filter((l) => l.length > 2 && !/^(due|assignments?|to-?do|homework)\s*:?\s*$/i.test(l));

  const items: ParsedAssignment[] = [];
  for (const line of lines.slice(0, 40)) {
    const { title, course, dueDate } = parseLine(line);
    if (!title) continue;
    const t = title.toLowerCase();
    const big = /(essay|paper|dbq|frq|project|exam|test|midterm|final|lab)/.test(t);
    items.push({
      title,
      course,
      dueDate,
      difficulty: big ? 4 : 3,
      estimatedMinutes: big ? 75 : 40,
      importance: big ? 4 : 3,
    });
  }
  return items;
}

function parseLine(line: string): { title: string; course: string; dueDate: string | null } {
  let course = "General";
  let dueDate: string | null = null;
  let text = line;

  // Course prefix "Math: ..." or "[Chemistry] ..."
  const coursePrefix = text.match(/^\s*[\[(]?([A-Za-z][A-Za-z0-9 &./-]{1,28})[\])]?\s*[:\-–]\s+(.*)/);
  if (coursePrefix && !/due/i.test(coursePrefix[1])) {
    course = coursePrefix[1].trim();
    text = coursePrefix[2].trim();
  }

  // Due date "due 10/24", "Due: Fri", "(due tomorrow)"
  const dueMatch = text.match(/\(?\s*due[:\s]+([^)]+?)\)?\s*$/i);
  if (dueMatch) {
    dueDate = interpretDate(dueMatch[1].trim());
    text = text.replace(dueMatch[0], "").trim();
  }
  const slash = text.match(/\b(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\b\s*$/);
  if (!dueDate && slash) {
    dueDate = interpretDate(slash[1]);
    text = text.replace(slash[0], "").trim();
  }

  text = text.replace(/[\-–•]\s*$/, "").trim();
  return { title: text, course, dueDate };
}

function interpretDate(s: string): string | null {
  const now = new Date();
  const lower = s.toLowerCase().trim();
  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  if (lower === "today") return iso(now);
  if (lower === "tomorrow") return iso(new Date(now.getTime() + 86_400_000));
  if (lower.includes("next week")) return iso(new Date(now.getTime() + 7 * 86_400_000));

  for (let i = 0; i < weekdays.length; i++) {
    if (lower.startsWith(weekdays[i].slice(0, 3))) {
      const diff = (i - now.getDay() + 7) % 7 || 7;
      return iso(new Date(now.getTime() + diff * 86_400_000));
    }
  }

  const md = lower.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
  if (md) {
    const month = parseInt(md[1], 10) - 1;
    const day = parseInt(md[2], 10);
    let year = md[3] ? parseInt(md[3], 10) : now.getFullYear();
    if (year < 100) year += 2000;
    const d = new Date(year, month, day);
    if (!md[3] && d.getTime() < now.getTime() - 86_400_000) d.setFullYear(year + 1);
    return iso(d);
  }

  const parsed = new Date(s);
  return Number.isNaN(parsed.getTime()) ? null : iso(parsed);
}

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
