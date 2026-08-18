import { MAX_RAW_LENGTH, GroqError, convertPrompt } from "@/lib/groq/client";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const LIMIT = 10;
const WINDOW_MS = 60_000;

const error = (message: string, status: number, headers?: HeadersInit) =>
  Response.json({ error: { message } }, { status, headers });

/**
 * POST /api/convert — `{ "raw": "<prompt>" }` → `{ "prompt": "<ISATVON markdown>" }`.
 *
 * Documented in docs/api-reference.md and web/public/openapi.yaml.
 */
export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req), { limit: LIMIT, windowMs: WINDOW_MS });
  if (!limit.ok) {
    return error(
      `Rate limit reached (${LIMIT} conversions per minute). Try again in ${limit.retryAfter}s.`,
      429,
      { "Retry-After": String(limit.retryAfter) }
    );
  }

  const body = await req.json().catch(() => null);
  const raw = (body as { raw?: unknown } | null)?.raw;
  if (typeof raw !== "string" || !raw.trim() || raw.length > MAX_RAW_LENGTH) {
    return error(`Body must be JSON: { "raw": "<prompt, max ${MAX_RAW_LENGTH} chars>" }`, 400);
  }

  try {
    const prompt = await convertPrompt(raw);
    return Response.json(
      { prompt },
      { headers: { "X-RateLimit-Remaining": String(limit.remaining) } }
    );
  } catch (cause) {
    if (cause instanceof GroqError) {
      console.error(`[convert] ${cause.kind}: ${cause.message}`);
      return error(cause.publicMessage, cause.status);
    }
    console.error("[convert] unexpected:", cause);
    return error("Conversion failed unexpectedly. Try again.", 500);
  }
}
