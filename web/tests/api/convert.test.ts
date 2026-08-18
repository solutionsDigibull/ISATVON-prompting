import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/convert/route";
import { resetRateLimit } from "@/lib/rate-limit";

const post = (body: unknown, ip = "1.2.3.4") =>
  POST(
    new Request("http://localhost/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );

const groqOk = (content: string) =>
  new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });

let counter = 0;
/** A fresh IP per test so the module-level throttle cannot bleed across tests. */
const ip = () => `10.0.0.${++counter}`;

beforeEach(() => {
  resetRateLimit();
  vi.stubEnv("GROQ_API_KEY", "test-key");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/convert", () => {
  it("returns the converted prompt", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(groqOk("## I — Instructions\nDo it.")));
    const res = await post({ raw: "write me an email" }, ip());
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ prompt: "## I — Instructions\nDo it." });
  });

  it("sends the raw prompt and the ISATVON system prompt upstream", async () => {
    const fetchMock = vi.fn().mockImplementation(() => groqOk("ok"));
    vi.stubGlobal("fetch", fetchMock);
    await post({ raw: "summarize this" }, ip());
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.messages[0].content).toContain("ISATVON prompting framework");
    expect(sent.messages[1].content).toContain("summarize this");
  });

  it.each([
    ["a missing raw field", {}],
    ["a non-string raw", { raw: 42 }],
    ["an empty raw", { raw: "   " }],
    ["unparseable JSON", "{not json"],
  ])("rejects %s with 400", async (_label, body) => {
    vi.stubGlobal("fetch", vi.fn());
    const res = await post(body, ip());
    expect(res.status).toBe(400);
  });

  it("rejects a prompt over the length cap", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const res = await post({ raw: "x".repeat(8001) }, ip());
    expect(res.status).toBe(400);
    expect((await res.json()).error.message).toContain("8000");
  });

  it("returns 500 when the API key is not configured", async () => {
    vi.stubEnv("GROQ_API_KEY", "");
    vi.stubGlobal("fetch", vi.fn());
    const res = await post({ raw: "hello" }, ip());
    expect(res.status).toBe(500);
    expect((await res.json()).error.message).toMatch(/not configured/i);
  });

  it("throttles after 10 requests a minute from one client", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => groqOk("ok"))
    );
    const client = ip();
    for (let i = 0; i < 10; i++) {
      expect((await post({ raw: "hello" }, client)).status).toBe(200);
    }
    const res = await post({ raw: "hello" }, client);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBeTruthy();
    expect((await res.json()).error.message).toMatch(/rate limit/i);
  });

  it("throttles per client, not globally", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => groqOk("ok"))
    );
    const noisy = ip();
    for (let i = 0; i < 10; i++) await post({ raw: "hello" }, noisy);
    expect((await post({ raw: "hello" }, ip())).status).toBe(200);
  });

  // The old route piped Groq's body straight to the browser, quota detail and all.
  it("never forwards the upstream error body", async () => {
    const upstream = { error: { message: "org_abc has exceeded its quota", key: "sk-secret" } };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(upstream), { status: 400 }))
    );
    const res = await post({ raw: "hello" }, ip());
    const text = JSON.stringify(await res.json());
    expect(res.status).toBe(502);
    expect(text).not.toContain("org_abc");
    expect(text).not.toContain("sk-secret");
  });

  it("passes an upstream 429 through as 429", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 429 })));
    expect((await post({ raw: "hello" }, ip())).status).toBe(429);
  });

  // A 200 with an unexpected shape used to surface in the UI as a raw TypeError.
  it("returns 502 for a 200 with no message content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [] })))
    );
    const res = await post({ raw: "hello" }, ip());
    expect(res.status).toBe(502);
    expect((await res.json()).error.message).toMatch(/unexpected response/i);
  });

  it("returns 504 when the upstream call times out", async () => {
    const timeout = Object.assign(new Error("aborted"), { name: "TimeoutError" });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(timeout));
    const res = await post({ raw: "hello" }, ip());
    expect(res.status).toBe(504);
    expect((await res.json()).error.message).toMatch(/timed out/i);
  });

  it("returns 502 when the upstream call fails outright", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNRESET")));
    expect((await post({ raw: "hello" }, ip())).status).toBe(502);
  });
});
