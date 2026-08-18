import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../helpers";
import { buildContent, lf } from "@/lib/isatvon/build";

const built = buildContent(ROOT);

describe("generated content", () => {
  it("validates cleanly", () => {
    expect(built.problems).toEqual([]);
  });

  it.each(built.outputs.map(([rel]) => rel))("%s is up to date", (rel) => {
    const expected = built.outputs.find(([r]) => r === rel)![1];
    const actual = lf(readFileSync(join(ROOT, rel), "utf8"));
    // Fails when the markdown changed but `npm run content` was not re-run.
    expect(actual).toBe(expected);
  });

  it("exposes every example to the website", async () => {
    const { EXAMPLES } = await import("@/lib/generated/content");
    expect(EXAMPLES.map((e) => e.meta.id)).toEqual(built.examples.map((e) => e.meta.id));
  });
});
