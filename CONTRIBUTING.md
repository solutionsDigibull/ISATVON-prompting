# Contributing to ISATVON Prompting

Thanks for your interest! By participating you agree to the
[Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Example conversions** — the most valuable contribution. A real, mediocre raw prompt and
  the ISATVON prompt it becomes. Full guide, including the required frontmatter:
  [docs/examples-guide.md](docs/examples-guide.md).
- **Reference improvements** — sharper good/weak examples in
  [references/prompting-guide.md](references/prompting-guide.md), platform-tailoring notes,
  framework comparisons.
- **Docs and tutorials** — [docs/](docs/faq.md) is newer than the rest of the repo and has
  the most room.
- **SKILL.md improvements** — better trigger phrasing or procedure steps.
- **Framework changes** — a different bar entirely: see [GOVERNANCE.md](GOVERNANCE.md).

## The layout in one paragraph

The markdown at the repo root is the product and has **no dependencies and no build step**.
Everything derived from it — what the website renders, `examples/index.json`,
`examples/README.md`, `skill-registry.json` — is generated and committed, and every tool
lives in `web/`. So: edit the markdown, run the generator, commit both. Details:
[docs/architecture.md](docs/architecture.md).

## Working on it

```bash
cd web && npm install       # everything lives here; the repo root stays dependency-free

npm run content             # regenerate after editing examples/ or templates/
npm run content:check       # what CI runs — fails if the committed output is stale
npm run test:run            # framework, lib, api and component tests
npm run lint:md             # markdown lint across the whole repo
npm run dev                 # the site, on :3000
```

A pre-commit hook (husky) lints and formats what you staged and checks the generated files
are current. `npm install` in `web/` sets it up.

## Pull requests

1. Keep changes focused; one topic per PR.
2. Every example must contain all seven `## X —` sections in I-S-A-T-V-O-N order, with the
   response-format skeleton embedded in O, a `Fallback:` line in V, and a self-verification
   step in A. CI checks all four.
3. Prompts must be platform-honest: don't require capabilities (search, code execution) the
   named platform lacks.
4. Edited `SKILL.md`? Copy it to `web/public/isatvon-skill.md` — a test enforces that they
   are byte-identical.
5. Behaviour change? Bring a test.

The [PR template](.github/PULL_REQUEST_TEMPLATE.md) has the full checklist.

## Good first contributions

- An example in a category the library is thin on: legal, finance, data analysis, support,
  education.
- A conversion that **didn't** help, with why — the failure catalogue on the
  [roadmap](GOVERNANCE.md#roadmap) has to start somewhere.
- A sharper "weak vs good" pair in [references/prompting-guide.md](references/prompting-guide.md).

## Reporting problems

Bugs and ideas: [issue templates](.github/ISSUE_TEMPLATE). Questions and prompts that worked:
Discussions. Security: **do not open an issue** — see [SECURITY.md](SECURITY.md).

By contributing you agree your contributions are licensed under Apache 2.0.
