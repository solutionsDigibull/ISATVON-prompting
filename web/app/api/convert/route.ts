// GROQ_API_KEY is a server-side env var (Vercel Project Settings > Environment
// Variables, or web/.env.local for dev) — never shipped to the browser.

const SYSTEM = `You convert raw prompts into the ISATVON prompting framework.
Rewrite the user's raw prompt as a complete ISATVON prompt in markdown with these sections:
## I — Instructions (role, one imperative task sentence, hard rules)
## S — Source (context/inputs to use, an explicit "do not assume" boundary; keep the user's pasted material as a placeholder like [PASTE ...] if they reference material not included)
## A — Automation (numbered work steps, then a "Before answering, verify:" self-check tied to S and V; on failure revise once, then report in N)
## T — Tech stack (allowed and forbidden capabilities; always forbid fabricating facts/citations)
## V — Variables (measurable limits: length, tone, audience, format; a fallback line: if a constraint cannot be met, say which and why, ask at most 1 clarifying question)
## O — Outcome (require the entire response in ISATVON format: I task-as-understood, S sources used, A verification done, V constraints honored, O the deliverable with its exact shape, N assumptions and confidence)
## N — Notification (require stating every assumption, confidence high/medium/low, anything undeliverable)
Exception: if the raw prompt is a fully self-contained one-shot question with no constraints or sources, output only the Lite form: I, O, N.
Invent sensible concrete defaults for details the raw prompt leaves out (word counts, tone, audience) rather than leaving sections vague.
Output ONLY the converted prompt markdown. No commentary, no code fences.`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const raw = body?.raw;
  if (typeof raw !== "string" || !raw.trim() || raw.length > 8000) {
    return Response.json(
      { error: { message: 'Body must be JSON: { "raw": "<prompt, max 8000 chars>" }' } },
      { status: 400 }
    );
  }
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    return Response.json(
      { error: { message: "GROQ_API_KEY is not configured on the server" } },
      { status: 500 }
    );
  }
  const groq = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2048,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: "Raw prompt:\n" + raw },
      ],
    }),
  });
  const data = await groq.json();
  return Response.json(data, { status: groq.status });
}
