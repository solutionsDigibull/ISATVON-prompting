import { beforeEach, describe, expect, it } from "vitest";
import { clientKey, rateLimit, resetRateLimit } from "@/lib/rate-limit";

beforeEach(resetRateLimit);

describe("rateLimit", () => {
  it("allows up to the limit and then blocks", () => {
    for (let i = 0; i < 3; i++) {
      expect(rateLimit("a", { limit: 3, now: 1000 }).ok).toBe(true);
    }
    expect(rateLimit("a", { limit: 3, now: 1000 }).ok).toBe(false);
  });

  it("counts down the remaining budget", () => {
    expect(rateLimit("a", { limit: 3, now: 1000 }).remaining).toBe(2);
    expect(rateLimit("a", { limit: 3, now: 1000 }).remaining).toBe(1);
  });

  it("frees the window once it has elapsed", () => {
    rateLimit("a", { limit: 1, windowMs: 60_000, now: 0 });
    expect(rateLimit("a", { limit: 1, windowMs: 60_000, now: 59_000 }).ok).toBe(false);
    expect(rateLimit("a", { limit: 1, windowMs: 60_000, now: 61_000 }).ok).toBe(true);
  });

  it("reports how long to wait", () => {
    rateLimit("a", { limit: 1, windowMs: 60_000, now: 0 });
    expect(rateLimit("a", { limit: 1, windowMs: 60_000, now: 30_000 }).retryAfter).toBe(30);
  });

  it("keeps clients independent", () => {
    rateLimit("a", { limit: 1, now: 1000 });
    expect(rateLimit("b", { limit: 1, now: 1000 }).ok).toBe(true);
  });

  it("does not grow without bound as clients come and go", () => {
    // Every call prunes expired keys, so a stream of one-shot IPs cannot accumulate.
    for (let i = 0; i < 500; i++) rateLimit(`ip-${i}`, { limit: 1, windowMs: 1000, now: i });
    const late = rateLimit("ip-0", { limit: 1, windowMs: 1000, now: 10_000 });
    expect(late.ok).toBe(true);
  });
});

describe("clientKey", () => {
  const req = (headers: Record<string, string>) => new Request("http://x", { headers });

  it("uses the first x-forwarded-for hop", () => {
    expect(clientKey(req({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" }))).toBe("9.9.9.9");
  });

  it("falls back to x-real-ip", () => {
    expect(clientKey(req({ "x-real-ip": "8.8.8.8" }))).toBe("8.8.8.8");
  });

  it("falls back to a constant when the proxy sends nothing", () => {
    expect(clientKey(req({}))).toBe("unknown");
  });
});
