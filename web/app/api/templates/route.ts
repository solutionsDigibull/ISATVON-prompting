import { EXAMPLES, TEMPLATES } from "@/lib/generated/content";

/**
 * GET /api/templates — the framework as JSON: both copy-paste templates and the
 * example index. Generated from the repo markdown at build time, so it can be
 * cached hard and never drifts from `templates/` and `examples/`.
 *
 * Documented in docs/api-reference.md and web/public/openapi.yaml.
 */
export function GET() {
  return Response.json(
    {
      templates: TEMPLATES.map((t) => ({
        id: t.slug,
        file: t.file,
        sections: t.keys,
        body: t.body,
      })),
      examples: EXAMPLES.map((e) => ({
        id: e.meta.id,
        title: e.title,
        platform: e.meta.platform,
        difficulty: e.meta.difficulty,
        category: e.meta.category,
        tags: e.meta.tags,
        raw: e.raw,
        prompt: e.prompt,
        why: e.why,
        source: `https://github.com/solutionsDigibull/ISATVON-prompting/blob/main/examples/${e.slug}.md`,
      })),
    },
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
  );
}
