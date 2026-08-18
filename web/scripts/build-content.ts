/**
 * CLI around `lib/isatvon/build.ts`.
 *
 * Inputs (canonical, hand-edited):  SKILL.md, templates/*.md, examples/*.md
 * Outputs (generated, never edited): web/lib/generated/content.ts, examples/index.json,
 *                                    examples/README.md, skill-registry.json
 *
 *   npm run content         regenerate
 *   npm run content:check   verify the committed output is current (CI + pre-commit)
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContent, lf } from "../lib/isatvon/build";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const CHECK = process.argv.includes("--check");

const { examples, templates, problems, outputs } = buildContent(ROOT);

if (problems.length) {
  console.error("Content validation failed:\n" + problems.join("\n"));
  process.exit(1);
}

let stale = 0;
for (const [rel, content] of outputs) {
  const target = join(ROOT, rel);
  if (CHECK) {
    let current = "";
    try {
      current = lf(readFileSync(target, "utf8"));
    } catch {
      current = "";
    }
    if (current !== content) {
      console.error(`stale: ${rel}`);
      stale++;
    }
  } else {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content, "utf8");
    console.log(`wrote  ${rel}`);
  }
}

if (CHECK) {
  if (stale) {
    console.error(`\n${stale} generated file(s) out of date — run \`npm run content\`.`);
    process.exit(1);
  }
  console.log(`content ok — ${examples.length} examples, ${templates.length} templates`);
}
