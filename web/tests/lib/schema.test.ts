import { describe, expect, it } from "vitest";
import {
  exampleMetaSchema,
  formatIssues,
  liteSchema,
  promptSchema,
  skillFrontmatterSchema,
} from "@/lib/isatvon/schema";

const SKELETON = ["I", "S", "A", "V", "O", "N"].map((k) => `- **${k}** — x`).join("\n");

const valid = {
  I: "You are a writer. Do the thing.",
  S: "Use only the pasted report.",
  A: "1. read\nBefore answering, verify: every claim traces to S.",
  T: "No browsing. Never fabricate citations.",
  V: "- Length: 150 words\n- Fallback: say which constraint broke and why.",
  O: `Structure your entire response in ISATVON format:\n${SKELETON}`,
  N: "State every assumption and your confidence.",
};

describe("promptSchema", () => {
  it("accepts a well-formed prompt", () => {
    expect(promptSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an empty section", () => {
    const result = promptSchema.safeParse({ ...valid, T: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects A with no self-verification step", () => {
    const result = promptSchema.safeParse({ ...valid, A: "1. read\n2. write" });
    expect(result.error?.issues[0].message).toMatch(/self-verification/);
  });

  it("rejects V with no fallback", () => {
    const result = promptSchema.safeParse({ ...valid, V: "- Length: 150 words" });
    expect(result.error?.issues[0].message).toMatch(/fallback/);
  });

  it("rejects O without the response skeleton", () => {
    const result = promptSchema.safeParse({ ...valid, O: "a 150-word summary" });
    expect(result.error?.issues[0].message).toMatch(/response skeleton/);
  });

  it("does not reject a terse but complete section", () => {
    // A character floor would fail this; the structural invariants should not.
    expect(promptSchema.safeParse({ ...valid, T: "No tools." }).success).toBe(true);
  });
});

describe("liteSchema", () => {
  it("accepts I/O/N with the compact skeleton", () => {
    const lite = {
      I: "Do the thing.",
      O: "- **I** — task\n- **O** — answer\n- **N** — assumptions",
      N: "State assumptions.",
    };
    expect(liteSchema.safeParse(lite).success).toBe(true);
  });

  it("rejects a missing skeleton key", () => {
    const lite = { I: "x", O: "- **I** — task\n- **O** — answer", N: "y" };
    expect(liteSchema.safeParse(lite).success).toBe(false);
  });
});

describe("exampleMetaSchema", () => {
  const meta = {
    id: "claude",
    order: 3,
    platform: "Claude",
    difficulty: "intermediate",
    category: "engineering",
    tags: ["code-review"],
    "raw-quality": "naive",
    "contributed-by": "someone",
    date: "2026-07-08",
    nav: "Claude: Code review",
    chip: "Review this code…",
    tagline: "A tagline.",
  };

  it("accepts valid frontmatter", () => {
    expect(exampleMetaSchema.safeParse(meta).success).toBe(true);
  });

  it("coerces the order that the YAML-lite parser reads as a string", () => {
    expect(exampleMetaSchema.parse({ ...meta, order: "3" }).order).toBe(3);
  });

  it("rejects an unknown difficulty", () => {
    expect(exampleMetaSchema.safeParse({ ...meta, difficulty: "expert" }).success).toBe(false);
  });

  it("rejects a non-kebab id", () => {
    expect(exampleMetaSchema.safeParse({ ...meta, id: "Claude Code" }).success).toBe(false);
  });

  it("rejects a malformed date", () => {
    expect(exampleMetaSchema.safeParse({ ...meta, date: "08-07-2026" }).success).toBe(false);
  });

  it("requires at least one tag", () => {
    expect(exampleMetaSchema.safeParse({ ...meta, tags: [] }).success).toBe(false);
  });
});

describe("skillFrontmatterSchema", () => {
  const skill = { name: "isatvon-prompting", description: "Converts…", license: "Apache-2.0" };

  it("accepts the minimum manifest", () => {
    expect(skillFrontmatterSchema.safeParse(skill).success).toBe(true);
  });

  it("accepts optional metadata", () => {
    const withMeta = { ...skill, metadata: { version: "1.2.3", compatibility: ["Claude Code"] } };
    expect(skillFrontmatterSchema.safeParse(withMeta).success).toBe(true);
  });

  it("rejects a non-semver version", () => {
    const bad = { ...skill, metadata: { version: "1.2" } };
    expect(skillFrontmatterSchema.safeParse(bad).success).toBe(false);
  });
});

describe("formatIssues", () => {
  it("prefixes each problem with its source file", () => {
    const result = promptSchema.safeParse({ ...valid, V: "no fallback here" });
    expect(formatIssues(result.error!, "examples/x.md")).toContain("examples/x.md: V —");
  });
});
