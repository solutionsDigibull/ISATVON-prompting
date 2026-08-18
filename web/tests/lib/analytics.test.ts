import { describe, expect, it } from "vitest";
import { detectPlatform, errorClass, latencyBucket, lengthBucket } from "@/lib/analytics";

describe("detectPlatform", () => {
  it.each([
    ["write a ChatGPT prompt", "chatgpt"],
    ["for GPT-5 please", "chatgpt"],
    ["a prompt for Claude", "claude"],
    ["use Anthropic's model", "claude"],
    ["ask Gemini about this", "gemini"],
    ["search on Perplexity", "perplexity"],
    ["a Copilot refactor", "copilot"],
    ["post this with Grok", "grok"],
  ])("reads %s as %s", (raw, expected) => {
    expect(detectPlatform(raw)).toBe(expected);
  });

  it("falls back when no platform is named", () => {
    expect(detectPlatform("summarize this report")).toBe("unspecified");
  });

  it("does not match a platform name inside another word", () => {
    expect(detectPlatform("the grokking algorithm")).toBe("unspecified");
  });
});

describe("lengthBucket", () => {
  it.each([
    [0, "<100"],
    [99, "<100"],
    [100, "100-300"],
    [299, "100-300"],
    [300, "300-1k"],
    [999, "300-1k"],
    [1000, "1k-3k"],
    [8000, "3k+"],
  ])("buckets %i as %s", (chars, expected) => {
    expect(lengthBucket(chars)).toBe(expected);
  });
});

describe("latencyBucket", () => {
  it.each([
    [10, "<1s"],
    [999, "<1s"],
    [1000, "1-3s"],
    [2999, "1-3s"],
    [3000, "3-10s"],
    [30_000, "10s+"],
  ])("buckets %ims as %s", (ms, expected) => {
    expect(latencyBucket(ms)).toBe(expected);
  });
});

describe("errorClass", () => {
  it.each([
    [null, "network"],
    [429, "rate-limited"],
    [400, "bad-request"],
    [500, "upstream"],
    [502, "upstream"],
    [418, "other"],
  ])("classifies %s as %s", (status, expected) => {
    expect(errorClass(status)).toBe(expected);
  });
});
