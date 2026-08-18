import { describe, expect, it } from "vitest";
import {
  ensureArray,
  hasCanonicalOrder,
  parseFenced,
  parseFrontmatter,
  parsePrompt,
  parseSections,
  promptMode,
  toPrompt,
} from "@/lib/isatvon/parse";

const FULL = `## I — Instructions
Do the thing.

## S — Source
Only this.

## A — Automation
1. step
Before answering, verify: it traces to S.

## T — Tech stack
No browsing.

## V — Variables
- Length: 100 words
- Fallback: say which constraint broke.

## O — Outcome
- **I** — task
- **N** — assumptions

## N — Notification
State assumptions.`;

describe("parseSections", () => {
  it("returns sections in document order", () => {
    expect(parseSections(FULL).map((s) => s.key)).toEqual(["I", "S", "A", "T", "V", "O", "N"]);
  });

  it("keeps the heading name", () => {
    expect(parseSections(FULL)[3]).toMatchObject({ key: "T", name: "Tech stack" });
  });

  it("ends a section at any h2, not just an ISATVON one", () => {
    const sections = parseSections(
      `## I — Instructions\nbody\n\n## Why it's better\n- not part of I`
    );
    expect(sections).toHaveLength(1);
    expect(sections[0].body).toBe("body");
  });

  it("does not treat a '## ' inside a section body as content", () => {
    const sections = parseSections(`## I — Instructions\nuse the ## marker literally`);
    expect(sections[0].body).toBe("use the ## marker literally");
  });

  it("parses CRLF input identically to LF", () => {
    expect(parseSections(FULL.replace(/\n/g, "\r\n"))).toEqual(parseSections(FULL));
  });

  it("returns nothing for markdown with no sections", () => {
    expect(parseSections("# Title\n\nsome prose")).toEqual([]);
  });
});

describe("hasCanonicalOrder", () => {
  it("rejects out-of-order sections", () => {
    const swapped = FULL.replace("## S — Source", "## X").replace(
      "## A — Automation",
      "## S — Source"
    );
    expect(hasCanonicalOrder(parseSections(swapped))).toBe(false);
  });

  it("rejects a missing section", () => {
    const cut = FULL.replace(/## T — Tech stack\nNo browsing\./, "");
    expect(hasCanonicalOrder(parseSections(cut))).toBe(false);
  });
});

describe("promptMode", () => {
  it("detects full", () => {
    expect(promptMode(parseSections(FULL))).toBe("full");
  });

  it("detects lite", () => {
    const lite = `## I — Instructions\na\n\n## O — Outcome\nb\n\n## N — Notification\nc`;
    expect(promptMode(parseSections(lite))).toBe("lite");
  });

  it("returns null for neither shape", () => {
    expect(promptMode(parseSections("## I — Instructions\na"))).toBeNull();
  });
});

describe("parsePrompt", () => {
  it("maps sections to keys", () => {
    expect(parsePrompt(FULL).T).toBe("No browsing.");
  });

  it("throws with the sections it did find", () => {
    expect(() => parsePrompt("## I — Instructions\na")).toThrow(/found: I/);
  });
});

describe("toPrompt", () => {
  it("keeps the first of a duplicated key", () => {
    const sections = parseSections(`## I — Instructions\nfirst\n\n## I — Instructions\nsecond`);
    expect(toPrompt(sections).I).toBe("first");
  });
});

describe("parseFenced", () => {
  it("extracts a fenced block by language", () => {
    expect(parseFenced("intro\n\n```markdown\ninside\n```\n", "markdown")).toBe("inside");
  });

  it("returns null when the language does not match", () => {
    expect(parseFenced("```ts\ninside\n```", "markdown")).toBeNull();
  });

  it("tolerates trailing whitespace after the info string", () => {
    expect(parseFenced("```markdown  \ninside\n```", "markdown")).toBe("inside");
  });

  it("does not match an info string that merely starts with the language", () => {
    expect(parseFenced("```markdownish\ninside\n```", "markdown")).toBeNull();
  });

  it("returns null for an unterminated fence", () => {
    expect(parseFenced("```markdown\ninside", "markdown")).toBeNull();
  });
});

describe("parseFrontmatter", () => {
  it("returns the whole document when there is no frontmatter", () => {
    expect(parseFrontmatter("# Title")).toEqual({ meta: {}, body: "# Title" });
  });

  it("reads scalars, quoted strings and inline arrays", () => {
    const { meta, body } = parseFrontmatter(
      [
        "---",
        "id: claude",
        "order: 3",
        "tags: [a, b, c]",
        'nav: "Claude: Code review"',
        "---",
        "",
        "# Title",
      ].join("\n")
    );
    expect(meta).toMatchObject({
      id: "claude",
      order: "3",
      tags: ["a", "b", "c"],
      nav: "Claude: Code review",
    });
    expect(body).toBe("# Title");
  });

  it("unescapes quotes inside a quoted value", () => {
    const { meta } = parseFrontmatter('---\ntagline: "\\"Is it good?\\" invites praise."\n---\n');
    expect(meta.tagline).toBe('"Is it good?" invites praise.');
  });

  it("reads a nested object", () => {
    const { meta } = parseFrontmatter("---\nmetadata:\n  version: 1.2.3\n---\n");
    expect(meta.metadata).toEqual({ version: "1.2.3" });
  });

  it("reads a dashed list", () => {
    const { meta } = parseFrontmatter("---\ntags:\n- one\n- two\n---\n");
    expect(meta.tags).toEqual(["one", "two"]);
  });

  it("reads booleans", () => {
    const { meta } = parseFrontmatter("---\ndraft: true\npublished: false\n---\n");
    expect(meta).toMatchObject({ draft: true, published: false });
  });

  it("ignores an unterminated frontmatter block", () => {
    expect(parseFrontmatter("---\nid: x\n").meta).toEqual({});
  });
});

describe("ensureArray", () => {
  it("normalizes scalars, arrays and blanks", () => {
    expect(ensureArray("a")).toEqual(["a"]);
    expect(ensureArray(["a", "b"])).toEqual(["a", "b"]);
    expect(ensureArray(undefined)).toEqual([]);
  });
});
