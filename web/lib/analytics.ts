/**
 * Event shaping for the converter's product metrics.
 *
 * Everything here is a bucket, never a raw value: prompt text never leaves the
 * browser, and lengths/latencies are coarse enough that a single conversion cannot
 * be picked out of the aggregate. See app/privacy for the user-facing statement.
 */

/** Which AI platform the user named in their raw prompt, if any. */
const PLATFORMS: Array<[string, RegExp]> = [
  ["chatgpt", /\bchat\s?gpt\b|\bopenai\b|\bgpt-?[45]\b/i],
  ["claude", /\bclaude\b|\banthropic\b/i],
  ["gemini", /\bgemini\b|\bbard\b/i],
  ["perplexity", /\bperplexity\b/i],
  ["copilot", /\bcopilot\b/i],
  ["grok", /\bgrok\b/i],
];

export function detectPlatform(raw: string): string {
  return PLATFORMS.find(([, pattern]) => pattern.test(raw))?.[0] ?? "unspecified";
}

export function lengthBucket(chars: number): string {
  if (chars < 100) return "<100";
  if (chars < 300) return "100-300";
  if (chars < 1000) return "300-1k";
  if (chars < 3000) return "1k-3k";
  return "3k+";
}

export function latencyBucket(ms: number): string {
  if (ms < 1000) return "<1s";
  if (ms < 3000) return "1-3s";
  if (ms < 10_000) return "3-10s";
  return "10s+";
}

/** Coarse failure class — never the raw message, which can carry upstream detail. */
export function errorClass(status: number | null): string {
  if (status === null) return "network";
  if (status === 429) return "rate-limited";
  if (status === 400) return "bad-request";
  if (status >= 500) return "upstream";
  return "other";
}
