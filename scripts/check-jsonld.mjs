/**
 * Validates the JSON-LD the site emits.
 *
 * app/layout.tsx builds the Organization and WebSite graph objects by hand and
 * injects them with dangerouslySetInnerHTML, so nothing type-checks them: a typo in
 * an @id or a missing publisher only shows up as a rejected rich result weeks later.
 * This renders the home page and asserts the shape.
 *
 *   node scripts/check-jsonld.mjs        (expects `next build` to have run)
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = process.env.PORT ?? "3111";
const BASE = `http://localhost:${PORT}`;

// One command string, not argv + shell: passing args through a shell triggers a
// Node deprecation warning and is a quoting hazard.
const server = spawn(`npm run start -- --port ${PORT}`, {
  stdio: "ignore",
  shell: true,
});

const problems = [];
const check = (condition, message) => {
  if (!condition) problems.push(`  ${message}`);
};

try {
  let html = null;
  for (let attempt = 0; attempt < 40 && html === null; attempt++) {
    await sleep(500);
    try {
      const res = await fetch(BASE);
      if (res.ok) html = await res.text();
    } catch {
      // server still starting
    }
  }
  if (html === null) throw new Error(`server did not start on ${BASE}`);

  const blocks = [
    ...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs),
  ].map((m) => m[1]);
  check(blocks.length >= 2, `expected 2 JSON-LD blocks, found ${blocks.length}`);

  const graph = blocks.map((raw, i) => {
    try {
      return JSON.parse(raw);
    } catch (error) {
      problems.push(`  block ${i} is not valid JSON: ${error.message}`);
      return {};
    }
  });

  const org = graph.find((n) => n["@type"] === "Organization");
  const site = graph.find((n) => n["@type"] === "WebSite");

  check(org, "no Organization node");
  check(site, "no WebSite node");

  for (const [label, node, fields] of [
    ["Organization", org, ["@context", "@id", "name", "url", "logo", "description"]],
    ["WebSite", site, ["@context", "@id", "name", "url", "description", "publisher"]],
  ]) {
    if (!node) continue;
    for (const field of fields) check(node[field], `${label} is missing ${field}`);
    check(node["@context"] === "https://schema.org", `${label} has the wrong @context`);
    check(String(node.url ?? "").startsWith("https://"), `${label}.url is not absolute https`);
  }

  if (org && site) {
    check(
      site.publisher?.["@id"] === org["@id"],
      "WebSite.publisher does not point at the Organization @id"
    );
  }

  if (problems.length) {
    console.error("JSON-LD validation failed:\n" + problems.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`JSON-LD ok — ${graph.length} nodes`);
  }
} catch (error) {
  console.error(`JSON-LD validation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  server.kill();
}
