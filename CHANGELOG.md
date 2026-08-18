# Changelog

## 0.2.0 — 2026-08-18

Framework unchanged; everything below is tooling, docs, and the website. Old prompts
continue to work as written.

### Added

- Example frontmatter (`difficulty`, `category`, `tags`, `raw-quality`, …), a generated
  [examples/README.md](examples/README.md) grouped by difficulty, and a machine-readable
  [examples/index.json](examples/index.json)
- `metadata.version` and `metadata.compatibility` in `SKILL.md`, a `## Trigger phrases`
  section, and a generated `skill-registry.json` for agent discovery
- [templates/response-template.md](templates/response-template.md) — the response contract
  as a standalone file
- [references/domain-model.md](references/domain-model.md) and
  [references/flow-guide.md](references/flow-guide.md)
- [docs/](docs/faq.md): architecture, API reference, FAQ, examples guide, and two tutorials
  (first prompt, platform guide)
- [SECURITY.md](SECURITY.md), [GOVERNANCE.md](GOVERNANCE.md),
  [RELEASING.md](RELEASING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md),
  [CONTRIBUTORS.md](CONTRIBUTORS.md), issue and PR templates
- Test suite (Vitest + Testing Library + Playwright) covering the framework markdown, the
  parser, the API routes and the converter UI; CI, Dependabot, a release workflow that ships
  an installable skill zip, and a pre-commit hook
- Website: a section-structure view of every prompt, download-as-markdown and
  copy-as-JSON, a retry on failure, a feedback control, and `GET /api/templates`

### Fixed

- `POST /api/convert` returned Groq's response body to the browser verbatim, including
  upstream error and quota detail. It now returns a generic message and logs the rest
  server-side.
- `POST /api/convert` had no rate limit — every call spent Groq credits. Now 10 requests per
  minute per client.
- A `200` from Groq with an unexpected shape surfaced in the UI as a raw `TypeError`.
- The website's copies of the templates and examples were hand-typed string literals that
  could drift from the markdown. They are generated now, and CI fails if they are stale.

### Changed

- `templates/prompt-template.md`: a blank line before the numbered list in **A** (markdown
  lint; renders identically)

## 0.1.1 — 2026-07-08

Audit fixes (skill-repo-auditor, scored 88/100):

- EVALS.md: three recorded trigger-eval transcripts (verify prompt, paraphrase, negative case)
- SKILL.md description rewritten in third person ("Converts ...")
- references/prompting-guide.md no longer links onward to another reference file
  (keeps references one level deep from SKILL.md)

## 0.1.0 — 2026-07-08

Initial release.

- SKILL.md: convert any raw prompt into an ISATVON-structured prompt for any AI
  platform, with the response required in ISATVON structure
- Copy-paste `templates/prompt-template.md` (zero-install usage)
- References: per-element prompting guide, COSTAR comparison, response-format contract
- Seven before/after examples: generic, ChatGPT, Claude, Gemini, Perplexity,
  Copilot, Grok
