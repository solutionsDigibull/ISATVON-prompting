## What this changes

<!-- One or two sentences. One topic per PR. -->

## Why

<!-- The problem it fixes. For a framework change, see GOVERNANCE.md — a concrete
     prompt and a concrete bad answer, plus evidence the change helps. -->

## Checklist

- [ ] One topic
- [ ] `npm --prefix web run test:run` passes
- [ ] `npm --prefix web run content:check` passes (or the regenerated files are committed)
- [ ] Docs updated if behaviour changed

**If this adds or edits an example** (see [docs/examples-guide.md](https://github.com/solutionsDigibull/ISATVON-prompting/blob/main/docs/examples-guide.md)):

- [ ] Frontmatter complete, `id` and `order` unique
- [ ] Seven sections, in I-S-A-T-V-O-N order
- [ ] A ends with a self-verification step; V has a `Fallback:` line
- [ ] O embeds the response skeleton
- [ ] Three or more "why it's better" bullets, each naming the failure it prevents
- [ ] Platform-honest — no capability the named platform lacks
- [ ] The raw prompt is real, not a strawman

**If this touches `SKILL.md`:**

- [ ] Copied to `web/public/isatvon-skill.md` (a test enforces it)
- [ ] `metadata.version` bumped if the procedure changed
