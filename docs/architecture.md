# Architecture

How this repository is put together, and why.

## The shape of the thing

ISATVON Prompting is **a markdown framework with a website attached**, not an application
with docs attached. That ordering decides almost everything below.

```text
repo root                     the product: zero dependencies, no build step
├── SKILL.md                  the agent skill
├── templates/                copy-paste prompts
├── examples/                 before/after conversions (+ generated index)
├── references/               per-element guidance
├── docs/                     this directory
├── scripts/check-jsonld.mjs  CI check that needs no package.json
└── web/                      the website — where every dependency lives
```

### Why the root has no `package.json`

The README's promise is that you can copy a template into any chat and be done: no install,
no toolchain. A `package.json` at the root would make that a lie the first time someone
cloned it and got a `node_modules`. So **every tool — Vitest, ESLint, Prettier, Playwright,
husky, markdownlint — is a devDependency of `web/`**, and the tests reach *up* to
`../examples` and `../SKILL.md` to validate the framework.

The one exception is `scripts/check-jsonld.mjs`, which is plain Node with no imports, run
from `web/` in CI.

## The four-copies problem

The framework text used to exist in four places, with nothing keeping them in step:

| Copy | Where | Synced by |
|---|---|---|
| Canonical | `templates/*.md`, `examples/*.md` | — |
| Skill | `SKILL.md` → `web/public/isatvon-skill.md` | a manual copy |
| Website | `web/components/Library.tsx` — both templates and all seven examples, re-typed as string literals | nothing |
| Converter | the `SYSTEM` prompt in the convert route | nothing |

Any edit to an example had to be made twice, and the second edit was the one everyone
forgot. Half of what looked like separate work — "validate the examples", "add a searchable
index", "export types", "add an API" — was the same fix.

### The pipeline

```text
SKILL.md ┐
templates/*.md ├─► lib/isatvon/parse.ts ──► lib/isatvon/build.ts ──┬─► lib/generated/content.ts
examples/*.md  ┘        (structure)          (validate + render)   ├─► examples/index.json
                             │                                     ├─► examples/README.md
                             └─► lib/isatvon/schema.ts             └─► skill-registry.json
                                    (invariants)
```

- **`parse.ts`** turns markdown into structure: frontmatter, `## X — Name` sections in
  document order, fenced blocks. No dependencies, safe in the browser — the site's "copy as
  JSON" button uses the same code.
- **`schema.ts`** holds the invariants as Zod schemas.
- **`build.ts`** reads the repo, validates, and renders every derived artifact. It is a
  library, not a script, so the tests call exactly what the generator calls.
- **`scripts/build-content.ts`** is the thin CLI: `npm run content` writes,
  `npm run content:check` verifies (CI and pre-commit).

Generated files are **committed**, so the repo reads correctly on GitHub and the framework
tests run without a build. `generated.test.ts` fails if a commit changes the markdown
without regenerating.

### What the invariants actually check

Not character counts. A `min(50)` floor fails a valid terse section and passes a verbose
empty one. What is checked is the mechanism the framework promises:

- all seven sections, **in I-S-A-T-V-O-N order** (order, not just presence — an out-of-order
  prompt reads fine to a human skimming it);
- **A** contains a self-verification step;
- **V** contains a `Fallback:` line;
- **O** embeds the response skeleton from `references/response-format.md`;
- frontmatter matches `exampleMetaSchema`; `SKILL.md` matches its public copy byte for byte.

## The website

Next.js 16 App Router, Tailwind v4, no state library, no data layer.

```text
web/
├── app/            routes; api/convert (Groq proxy), api/templates (generated JSON)
├── components/     presentational; Library.tsx renders lib/generated/content.ts
├── lib/
│   ├── isatvon/    parse, schema, build, types — the framework as code
│   ├── groq/       the upstream client, and the only place the API key is read
│   ├── rate-limit  per-instance throttle for the public endpoint
│   └── analytics   event bucketing
├── tests/          vitest: framework/, lib/, api/, components/
└── e2e/            playwright, with /api/convert stubbed
```

### The convert route

`route.ts` is deliberately thin: throttle → validate → `convertPrompt` → map a typed
`GroqError` to a status and a safe message. Everything upstream-specific lives in
`lib/groq/client.ts`, which is also the only module that reads `GROQ_API_KEY`.

The upstream response body never reaches the browser. It used to — the route returned Groq's
JSON verbatim, quota messages and all — and there is a test named after that.

## Running an A/B test later

There is one system prompt (`lib/groq/client.ts`) and no traffic split, so an A/B harness
today would measure noise. The plumbing is in place for when there is traffic:

1. Export a second `SYSTEM` variant and pick between them by a hash of the client key, so a
   given user stays in one arm.
2. Add `variant` to the `convert_success` / `convert_fail` / `conversion_feedback` payloads
   in `components/Converter.tsx` — the event shape already carries platform, length and
   latency buckets to segment by.
3. Compare thumbs-up rate and regenerate rate per arm.

Do not add the harness before there is enough traffic to move those rates.

## Decisions worth knowing

| Decision | Why |
|---|---|
| One `SKILL.md`, not a `skills/` tree | One skill with one clear description is what skill-matching rewards. Lite mode and per-platform tailoring are procedure steps, not separate skills; ten files would be ten places for the spec to drift. |
| Examples keep their flat paths | They are linked by URL from the skill, the README, and anywhere anyone has shared them. Difficulty tiers live in frontmatter and the generated index instead. |
| No `next build` duplication in CI | Vercel already builds every push and PR preview. CI adds what Vercel does not: content generation, markdown lint, tests, JSON-LD, e2e. |
| Carets + lockfile, not pinned versions | `package-lock.json` already pins exactly; pinning `package.json` too only makes Dependabot noisier. |
| Vitest over Jest | Next 16 is ESM + TypeScript; Vitest runs the same RTL tests with one config file and no transform wiring. |
