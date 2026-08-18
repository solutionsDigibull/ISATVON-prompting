import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../helpers";
import { hasCanonicalOrder, parseSections, toPrompt } from "@/lib/isatvon/parse";
import { liteSchema, promptSchema } from "@/lib/isatvon/schema";
import { LITE_KEYS, SECTION_KEYS } from "@/lib/isatvon/types";

function templateBody(file: string): string {
  const src = readFileSync(join(ROOT, "templates", file), "utf8")
    .replace(/\r\n/g, "\n")
    .split("\n");
  const rule = src.findIndex((l) => l.trim() === "---");
  expect(
    rule,
    `${file} must separate its preamble from the template with a '---' rule`
  ).toBeGreaterThan(-1);
  return src
    .slice(rule + 1)
    .join("\n")
    .trim();
}

describe("templates/prompt-template.md", () => {
  const sections = parseSections(templateBody("prompt-template.md"));

  it("has all seven sections in order", () => {
    expect(sections.map((s) => s.key)).toEqual([...SECTION_KEYS]);
  });

  it("satisfies the ISATVON structural invariants", () => {
    const result = promptSchema.safeParse(toPrompt(sections));
    expect(result.error?.issues ?? []).toEqual([]);
  });
});

describe("templates/prompt-template-lite.md", () => {
  const sections = parseSections(templateBody("prompt-template-lite.md"));

  it("has exactly I, O and N", () => {
    expect(sections.map((s) => s.key)).toEqual([...LITE_KEYS]);
    expect(hasCanonicalOrder(sections, LITE_KEYS)).toBe(true);
  });

  it("satisfies the Lite invariants", () => {
    const result = liteSchema.safeParse(toPrompt(sections));
    expect(result.error?.issues ?? []).toEqual([]);
  });
});
