import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../helpers";
import { SYSTEM } from "@/lib/groq/client";
import { RESPONSE_SKELETON_KEYS } from "@/lib/isatvon/schema";

/**
 * The converter's system prompt has to ask for the same response skeleton that
 * references/response-format.md defines and that every committed example embeds.
 *
 * It did not, and three live conversions produced three different O sections —
 * one with an en dash, one with `**I:**`, one with no skeleton at all. Nothing
 * caught it, because every other test stubs Groq and never reads this string.
 */
const canonical = readFileSync(join(ROOT, "references/response-format.md"), "utf8").replace(
  /\r\n/g,
  "\n"
);

describe("the Groq system prompt", () => {
  it.each(RESPONSE_SKELETON_KEYS)("tells the model to emit the **%s** — marker", (key) => {
    expect(SYSTEM).toContain(`- **${key}** —`);
  });

  it("quotes the skeleton lines exactly as references/response-format.md defines them", () => {
    const lines = canonical
      .split("\n")
      .filter((l) => /^- \*\*[ISAVON]\*\* — /.test(l))
      // the Lite skeleton repeats I/O/N with different wording; the 6-line one is first
      .slice(0, RESPONSE_SKELETON_KEYS.length);

    expect(lines).toHaveLength(RESPONSE_SKELETON_KEYS.length);
    for (const line of lines) expect(SYSTEM).toContain(line);
  });

  it("forbids the separators the model reached for on its own", () => {
    expect(SYSTEM).toMatch(/never write \*\*I:\*\*|colon/i);
  });
});
