import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { ROOT } from "../helpers";

/**
 * Every relative markdown link in the repo has to resolve.
 *
 * Link rot is silent: a renamed reference leaves the skill pointing at nothing and
 * the agent reading it just gets less context, with no error anywhere.
 */
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", ".agents", "coverage"]);

// A byte-for-byte copy of SKILL.md served at a URL — its links are relative to
// where the skill is installed, not to web/public.
const SKIP_FILES = new Set(["web/public/isatvon-skill.md"]);

function markdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (SKIP_DIRS.has(entry.name)) return [];
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

const files = markdownFiles(ROOT)
  .map((f) => relative(ROOT, f).replace(/\\/g, "/"))
  .filter((f) => !SKIP_FILES.has(f))
  .sort();

describe("markdown links", () => {
  it("finds markdown to check", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(files)("%s has no broken relative links", (file) => {
    const text = readFileSync(join(ROOT, file), "utf8");
    const broken = [...text.matchAll(/\]\(([^)\s]+)\)/g)]
      .map((m) => m[1])
      .filter((link) => !/^(https?:|mailto:|#)/.test(link))
      .filter((link) => !existsSync(resolve(dirname(join(ROOT, file)), link.split("#")[0])));

    expect(broken).toEqual([]);
  });
});
