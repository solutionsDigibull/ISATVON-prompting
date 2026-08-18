import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../helpers";
import {
  hasCanonicalOrder,
  parseFenced,
  parseFrontmatter,
  parseSections,
  toPrompt,
} from "@/lib/isatvon/parse";
import { mdSection } from "@/lib/isatvon/build";
import { exampleMetaSchema, promptSchema } from "@/lib/isatvon/schema";
import { SECTION_KEYS } from "@/lib/isatvon/types";

const files = readdirSync(join(ROOT, "examples"))
  .filter((f) => f.endsWith(".md") && f !== "README.md")
  .sort();

describe("examples/", () => {
  it("has at least one example", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s: frontmatter matches the schema", (file) => {
    const { meta } = parseFrontmatter(readFileSync(join(ROOT, "examples", file), "utf8"));
    const result = exampleMetaSchema.safeParse(meta);
    expect(result.error?.issues ?? []).toEqual([]);
    expect(result.success).toBe(true);
  });

  describe.each(files)("%s", (file) => {
    const source = readFileSync(join(ROOT, "examples", file), "utf8");
    const { body } = parseFrontmatter(source);
    const prompt = parseFenced(mdSection(body, "ISATVON prompt"), "markdown") ?? "";
    const sections = parseSections(prompt);

    it("has a title, a raw prompt and a fenced ISATVON prompt", () => {
      expect(/^# .+$/m.test(body)).toBe(true);
      expect(mdSection(body, "Raw prompt")).toMatch(/^>/m);
      expect(prompt).not.toBe("");
    });

    // CONTRIBUTING.md rule 2: seven sections, in order. Presence alone is not enough —
    // an out-of-order prompt reads as valid to a human skimming it.
    it("has all seven sections in I-S-A-T-V-O-N order", () => {
      expect(sections.map((s) => s.key)).toEqual([...SECTION_KEYS]);
      expect(hasCanonicalOrder(sections)).toBe(true);
    });

    it("satisfies the ISATVON structural invariants", () => {
      const result = promptSchema.safeParse(toPrompt(sections));
      expect(result.error?.issues ?? []).toEqual([]);
    });

    it("embeds the response skeleton in O", () => {
      const o = toPrompt(sections).O ?? "";
      for (const key of ["I", "S", "A", "V", "O", "N"]) {
        expect(o).toContain(`**${key}** —`);
      }
    });

    it("explains itself with at least three bullets", () => {
      const why = mdSection(body, "Why it's better")
        .split("\n")
        .filter((l) => l.startsWith("- "));
      expect(why.length).toBeGreaterThanOrEqual(3);
    });
  });
});
