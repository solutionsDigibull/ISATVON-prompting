/**
 * Groq client for the prompt converter.
 *
 * GROQ_API_KEY is a server-side env var (Vercel Project Settings → Environment
 * Variables, or web/.env.local for dev) — never shipped to the browser, and the
 * upstream response never reaches the browser either: callers get the converted
 * markdown or a typed error, so upstream payloads cannot leak through.
 */

export const MODEL = "openai/gpt-oss-120b";
export const MAX_RAW_LENGTH = 8000;
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const TIMEOUT_MS = 30_000;

export const SYSTEM = `You convert raw prompts into the ISATVON prompting framework.
Rewrite the user's raw prompt as a complete ISATVON prompt in markdown with these sections:
## I — Instructions (role, one imperative task sentence, hard rules)
## S — Source (context/inputs to use, an explicit "do not assume" boundary; keep the user's pasted material as a placeholder like [PASTE ...] if they reference material not included)
## A — Automation (numbered work steps, then a "Before answering, verify:" self-check tied to S and V; on failure revise once, then report in N)
## T — Tech stack (allowed and forbidden capabilities; always forbid fabricating facts/citations)
## V — Variables (measurable limits: length, tone, audience, format; a fallback line: if a constraint cannot be met, say which and why, ask at most 1 clarifying question)
## O — Outcome (require the entire response in ISATVON format by embedding the skeleton below verbatim)
## N — Notification (require stating every assumption, confidence high/medium/low, anything undeliverable)
The O section must contain these lines exactly as written, changing only [EXACT SHAPE]:
Structure your entire response in ISATVON format:

- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: [EXACT SHAPE]
- **N** — assumptions made, confidence (high/medium/low), anything skipped

Copy the em dash (—) exactly. Never write **I:** or use a hyphen or en dash in its place — a downstream parser reads these markers.
Exception: if the raw prompt is a fully self-contained one-shot question with no constraints or sources, output only the Lite form: I, O, N, and embed only the **I**, **O** and **N** lines of the skeleton.
Invent sensible concrete defaults for details the raw prompt leaves out (word counts, tone, audience) rather than leaving sections vague.
Output ONLY the converted prompt markdown. No commentary, no code fences.`;

/** Why a conversion failed, and what the client should be told. */
export type GroqFailure = "not-configured" | "upstream" | "malformed" | "timeout";

export class GroqError extends Error {
  constructor(
    readonly kind: GroqFailure,
    /** HTTP status to return to the browser. */
    readonly status: number,
    /** Safe, generic message for the browser. */
    readonly publicMessage: string,
    /** Full detail for the server log only. */
    message: string
  ) {
    super(message);
    this.name = "GroqError";
  }
}

/**
 * Convert a raw prompt into ISATVON markdown.
 *
 * @throws {GroqError} when the key is missing, the upstream call fails or times out,
 * or the response does not have the shape the OpenAI-compatible API promises.
 */
export async function convertPrompt(raw: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new GroqError(
      "not-configured",
      500,
      "The conversion service is not configured.",
      "GROQ_API_KEY is not set on the server"
    );
  }

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        max_tokens: 2048,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: "Raw prompt:\n" + raw },
        ],
      }),
    });
  } catch (cause) {
    const timedOut = cause instanceof Error && cause.name === "TimeoutError";
    throw new GroqError(
      timedOut ? "timeout" : "upstream",
      timedOut ? 504 : 502,
      timedOut
        ? "The conversion timed out. Try again, or shorten the prompt."
        : "The conversion service is unavailable. Try again in a moment.",
      `fetch to Groq failed: ${String(cause)}`
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    // The upstream body can carry account and quota detail; log it, never forward it.
    throw new GroqError(
      "upstream",
      response.status === 429 ? 429 : 502,
      response.status === 429
        ? "The conversion service is busy. Try again in a moment."
        : "The conversion service is unavailable. Try again in a moment.",
      `Groq responded ${response.status}: ${JSON.stringify(data)}`
    );
  }

  const content = (data as { choices?: Array<{ message?: { content?: unknown } }> })?.choices?.[0]
    ?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new GroqError(
      "malformed",
      502,
      "The conversion service returned an unexpected response.",
      `Groq 200 with no message content: ${JSON.stringify(data)}`
    );
  }

  return content.trim();
}
