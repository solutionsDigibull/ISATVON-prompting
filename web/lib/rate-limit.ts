/**
 * Fixed-window per-IP throttle for the public conversion endpoint.
 *
 * /api/convert is unauthenticated and every call spends Groq credits, so it needs
 * *some* ceiling. State lives in module memory, which means the limit is per
 * serverless instance: a speed bump against a loop from one client, not a wall
 * against a distributed one.
 *
 * ponytail: in-memory and per-instance on purpose. Move to Upstash/Vercel KV if the
 * logs ever show real abuse — the call sites here do not change, only this file.
 */

const hits = new Map<string, number[]>();

export type RateLimitResult = {
  ok: boolean;
  /** Requests still available in the current window. */
  remaining: number;
  /** Seconds until the window frees up — for the Retry-After header. */
  retryAfter: number;
};

export type RateLimitOptions = {
  /** Requests allowed per window. */
  limit?: number;
  /** Window length in milliseconds. */
  windowMs?: number;
  /** Injected for tests; defaults to the wall clock. */
  now?: number;
};

export function rateLimit(key: string, options: RateLimitOptions = {}): RateLimitResult {
  const { limit = 10, windowMs = 60_000, now = Date.now() } = options;
  const cutoff = now - windowMs;

  // Prune every key, not just this one, so an endless stream of distinct IPs
  // cannot grow the map without bound.
  for (const [existing, times] of hits) {
    const live = times.filter((t) => t > cutoff);
    if (live.length) hits.set(existing, live);
    else hits.delete(existing);
  }

  const times = hits.get(key) ?? [];
  if (times.length >= limit) {
    const retryAfter = Math.max(1, Math.ceil((times[0] + windowMs - now) / 1000));
    return { ok: false, remaining: 0, retryAfter };
  }

  times.push(now);
  hits.set(key, times);
  return { ok: true, remaining: limit - times.length, retryAfter: 0 };
}

/**
 * Best-effort client identity. Behind Vercel the first `x-forwarded-for` hop is the
 * client; the fallbacks keep local development working.
 */
export function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Test-only: drop all recorded hits. */
export function resetRateLimit(): void {
  hits.clear();
}
