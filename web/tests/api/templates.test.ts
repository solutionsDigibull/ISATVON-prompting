import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/templates/route";
import { EXAMPLES } from "@/lib/generated/content";

describe("GET /api/templates", () => {
  it("serves both templates and every example", async () => {
    const body = await GET().json();
    expect(body.templates.map((t: { id: string }) => t.id)).toEqual([
      "prompt-template",
      "prompt-template-lite",
    ]);
    expect(body.examples).toHaveLength(EXAMPLES.length);
  });

  it("gives each example a link back to its markdown source", async () => {
    const body = await GET().json();
    for (const example of body.examples) {
      expect(example.source).toMatch(/^https:\/\/github\.com\/.+\/examples\/.+\.md$/);
    }
  });

  it("is cacheable", () => {
    expect(GET().headers.get("Cache-Control")).toContain("s-maxage");
  });
});
