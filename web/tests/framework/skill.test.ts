import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../helpers";
import { parseFrontmatter } from "@/lib/isatvon/parse";
import { skillFrontmatterSchema } from "@/lib/isatvon/schema";

const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8").replace(/\r\n/g, "\n");

describe("SKILL.md", () => {
  const { meta, body } = parseFrontmatter(read("SKILL.md"));

  it("has valid frontmatter", () => {
    const result = skillFrontmatterSchema.safeParse(meta);
    expect(result.error?.issues ?? []).toEqual([]);
  });

  it("describes when it triggers", () => {
    expect(String((meta as { description?: string }).description)).toMatch(/use when/i);
  });

  it("is byte-identical to the copy the website serves", () => {
    // web/public/isatvon-skill.md is a hand copy; nothing but this test keeps it honest.
    expect(read("web/public/isatvon-skill.md")).toBe(read("SKILL.md"));
  });

  it("lists the phrases that should trigger it", () => {
    // Mirrored into skill-registry.json for agent discovery.
    const triggers = body
      .split("## Trigger phrases")[1]
      ?.split("\n## ")[0]
      ?.split("\n")
      .filter((l) => l.startsWith("- "));
    expect(triggers?.length ?? 0).toBeGreaterThanOrEqual(3);
  });
});
