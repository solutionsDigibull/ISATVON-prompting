/**
 * Reads the canonical markdown at the repo root and renders every derived artifact.
 *
 * Kept separate from `web/scripts/build-content.ts` (which is just the CLI around it)
 * so the tests can call the same code the generator uses, instead of re-implementing
 * the parse and drifting from it.
 */
import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import type { z } from "zod";
import { hasCanonicalOrder, parseFenced, parseFrontmatter, parseSections, toPrompt } from "./parse";
import {
  exampleMetaSchema,
  formatIssues,
  liteSchema,
  promptSchema,
  skillFrontmatterSchema,
} from "./schema";
import {
  DIFFICULTIES,
  LITE_KEYS,
  SECTION_KEYS,
  type ExampleDoc,
  type ExampleMeta,
  type SectionKey,
  type SkillManifest,
  type TemplateDoc,
} from "./types";

export const lf = (s: string) => s.replace(/\r\n/g, "\n");

/**
 * Body of a `## Heading` block, stopping at the next `##` that is *not* inside a
 * fenced code block — the examples embed a whole ISATVON prompt (its own `## I —`
 * headings and all) inside a fence, so a naive scan truncates at the first one.
 */
export function mdSection(body: string, heading: string): string {
  const src = lf(body).split("\n");
  const want = `## ${heading}`.toLowerCase();
  let fenced = false;
  let start = -1;
  const out: string[] = [];

  for (let i = 0; i < src.length; i++) {
    const line = src[i];
    if (/^```/.test(line.trim())) fenced = !fenced;
    if (!fenced && /^## /.test(line)) {
      if (start !== -1) break;
      if (line.trim().toLowerCase() === want) start = i;
      continue;
    }
    if (start !== -1) out.push(line);
  }
  return start === -1 ? "" : out.join("\n").trim();
}

/** Bullet items (`- foo`) of a markdown block. */
const bullets = (block: string) =>
  block
    .split("\n")
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim());

export type BuildResult = {
  examples: ExampleDoc[];
  templates: TemplateDoc[];
  skill: SkillManifest | null;
  triggers: string[];
  /** One line per validation failure; empty means the content is valid. */
  problems: string[];
  /** Repo-relative path → exact file contents (LF). */
  outputs: Array<[string, string]>;
};

export function buildContent(root: string): BuildResult {
  const problems: string[] = [];
  const fail = (msg: string) => problems.push(msg);
  const read = (rel: string) => lf(readFileSync(join(root, rel), "utf8"));

  /* ---------------------------------------------------------------- examples */

  function parseExample(file: string): ExampleDoc | null {
    const source = `examples/${file}`;
    const { meta, body } = parseFrontmatter(read(source));

    const metaResult = exampleMetaSchema.safeParse(meta);
    if (!metaResult.success) {
      fail(formatIssues(metaResult.error, source));
      return null;
    }

    const title = /^# (.+)$/m.exec(body)?.[1]?.trim() ?? "";
    if (!title) fail(`  ${source}: missing the '# Title' heading`);

    const raw = mdSection(body, "Raw prompt")
      .split("\n")
      .filter((l) => l.startsWith(">"))
      .map((l) => l.replace(/^>\s?/, ""))
      .join(" ")
      .trim();
    if (!raw) fail(`  ${source}: '## Raw prompt' has no '> quoted prompt'`);

    const prompt = parseFenced(mdSection(body, "ISATVON prompt"), "markdown");
    if (!prompt) {
      fail(`  ${source}: '## ISATVON prompt' has no fenced markdown block`);
      return null;
    }

    const sections = parseSections(prompt);
    if (!hasCanonicalOrder(sections)) {
      const found = sections.map((s) => s.key).join("") || "(none)";
      fail(`  ${source}: sections must be I-S-A-T-V-O-N in order, found: ${found}`);
    } else {
      const result = promptSchema.safeParse(toPrompt(sections));
      if (!result.success) fail(formatIssues(result.error, source));
    }

    const why = bullets(mdSection(body, "Why it's better"));
    if (why.length < 3) fail(`  ${source}: "Why it's better" needs at least 3 bullets`);

    return {
      slug: basename(file, ".md"),
      meta: metaResult.data as ExampleMeta,
      title,
      raw,
      prompt,
      why,
    };
  }

  const examples = readdirSync(join(root, "examples"))
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .sort()
    .map(parseExample)
    .filter((e): e is ExampleDoc => e !== null)
    .sort((a, b) => a.meta.order - b.meta.order);

  const ids = examples.map((e) => e.meta.id);
  if (new Set(ids).size !== ids.length) fail("  examples/: duplicate `id` in frontmatter");
  const orders = examples.map((e) => e.meta.order);
  if (new Set(orders).size !== orders.length) fail("  examples/: duplicate `order` in frontmatter");

  /* --------------------------------------------------------------- templates */

  function parseTemplate(file: string, keys: readonly SectionKey[]): TemplateDoc | null {
    const source = `templates/${file}`;
    const src = read(source).split("\n");
    const rule = src.findIndex((l) => l.trim() === "---");
    if (rule === -1) {
      fail(`  ${source}: no '---' rule separating the preamble from the template body`);
      return null;
    }
    const body = src
      .slice(rule + 1)
      .join("\n")
      .trim();

    const sections = parseSections(body);
    if (!hasCanonicalOrder(sections, keys)) {
      const found = sections.map((s) => s.key).join("") || "(none)";
      fail(`  ${source}: expected ${keys.join("")} in order, found: ${found}`);
    } else {
      const parsed = toPrompt(sections);
      const result =
        keys.length === 7 ? promptSchema.safeParse(parsed) : liteSchema.safeParse(parsed);
      if (!result.success) fail(formatIssues(result.error as z.ZodError, source));
    }

    return { slug: basename(file, ".md"), file, body, keys: sections.map((s) => s.key) };
  }

  const templates = [
    parseTemplate("prompt-template.md", SECTION_KEYS),
    parseTemplate("prompt-template-lite.md", LITE_KEYS),
  ].filter((t): t is TemplateDoc => t !== null);

  /* ------------------------------------------------------------------- skill */

  const skillText = read("SKILL.md");
  if (skillText !== read("web/public/isatvon-skill.md")) {
    fail("  web/public/isatvon-skill.md: out of sync with SKILL.md (copy it across)");
  }

  const skillParsed = parseFrontmatter(skillText);
  const skillResult = skillFrontmatterSchema.safeParse(skillParsed.meta);
  if (!skillResult.success) fail(formatIssues(skillResult.error, "SKILL.md"));

  const triggers = bullets(mdSection(skillParsed.body, "Trigger phrases")).map((t) =>
    t.replace(/^["“]|["”]$/g, "").trim()
  );

  /* ------------------------------------------------------------------ render */

  const skill = skillResult.success ? (skillResult.data as SkillManifest) : null;
  const outputs: Array<[string, string]> = problems.length
    ? []
    : [
        ["web/lib/generated/content.ts", renderContentTs(templates, examples)],
        ["examples/index.json", renderIndexJson(examples)],
        ["examples/README.md", renderExamplesReadme(examples)],
        ["skill-registry.json", renderRegistry(root, skill, triggers, templates, examples)],
      ];

  return { examples, templates, skill, triggers, problems, outputs };
}

/* ---------------------------------------------------------------- renderers */

function renderContentTs(templates: TemplateDoc[], examples: ExampleDoc[]): string {
  return `// GENERATED by web/scripts/build-content.ts — do not edit.
// Source of truth: SKILL.md, templates/*.md and examples/*.md at the repo root.
// Regenerate with \`npm run content\` (runs automatically before dev and build).

import type { ExampleDoc, TemplateDoc } from "@/lib/isatvon/types";

export const TEMPLATES: TemplateDoc[] = ${JSON.stringify(templates, null, 2)};

export const EXAMPLES: ExampleDoc[] = ${JSON.stringify(examples, null, 2)};

export const FULL_TEMPLATE = TEMPLATES[0].body;
export const LITE_TEMPLATE = TEMPLATES[1].body;
`;
}

function renderIndexJson(examples: ExampleDoc[]): string {
  return (
    JSON.stringify(
      {
        count: examples.length,
        generated_by: "web/scripts/build-content.ts",
        examples: examples.map((e) => ({
          id: e.meta.id,
          title: e.title,
          path: `${e.slug}.md`,
          platform: e.meta.platform,
          difficulty: e.meta.difficulty,
          category: e.meta.category,
          tags: e.meta.tags,
          "raw-quality": e.meta["raw-quality"],
          description: e.meta.tagline,
          raw: e.raw,
        })),
      },
      null,
      2
    ) + "\n"
  );
}

function renderExamplesReadme(examples: ExampleDoc[]): string {
  const rows = (level: string) =>
    examples
      .filter((e) => e.meta.difficulty === level)
      .map(
        (e) =>
          `| [${e.title}](${e.slug}.md) | ${e.meta.platform} | ${e.meta.category} | ` +
          `${e.meta["raw-quality"]} | ${e.meta.tags.map((t) => "`" + t + "`").join(", ")} |`
      )
      .join("\n");

  const tables = DIFFICULTIES.map(
    (level) => `## ${level[0].toUpperCase() + level.slice(1)}

| Example | Platform | Category | Raw quality | Tags |
|---|---|---|---|---|
${rows(level)}`
  ).join("\n\n");

  return `<!-- GENERATED by web/scripts/build-content.ts — do not edit. -->

# Example conversions

${examples.length} before/after conversions. Each shows a real, mediocre raw prompt, the
ISATVON prompt it becomes, and why the rewrite is better. Machine-readable index:
[index.json](index.json).

**Difficulty** describes the prompt, not the reader: *beginner* has one or two constraints,
*intermediate* is multi-constraint or source-grounded, *advanced* adds citation and recency
rules the model has to verify before answering.

**Raw quality** describes the "before" prompt — \`naive\` (vague, the common mistake),
\`mediocre\` (partly structured, unclear intent), \`near-good\` (structured but not rigorous).

${tables}

## Contributing an example

See [../CONTRIBUTING.md](../CONTRIBUTING.md) for the required frontmatter and file shape.
Every example is validated in CI: seven sections in I-S-A-T-V-O-N order, the response
skeleton embedded in O, a fallback line in V, and at least three "why it's better" bullets.
`;
}

function renderRegistry(
  root: string,
  skill: SkillManifest | null,
  triggers: string[],
  templates: TemplateDoc[],
  examples: ExampleDoc[]
): string {
  return (
    JSON.stringify(
      {
        ...(skill ?? {}),
        triggers,
        files: {
          skill: "SKILL.md",
          templates: templates.map((t) => `templates/${t.file}`),
          references: readdirSync(join(root, "references"))
            .filter((f) => f.endsWith(".md"))
            .sort()
            .map((f) => `references/${f}`),
          examples: examples.map((e) => `examples/${e.slug}.md`),
        },
      },
      null,
      2
    ) + "\n"
  );
}
