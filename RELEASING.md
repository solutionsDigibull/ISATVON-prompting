# Releasing

The thing being versioned is **the framework** — `SKILL.md`, the templates, the references,
and the examples. The website ships continuously from `main` via Vercel and is not versioned.

## Version policy

Semantic versioning, read against the framework:

| Bump | When |
|---|---|
| **major** | A section's meaning changes, a section is added or removed, or the response contract in [references/response-format.md](references/response-format.md) changes. Anyone reusing an old prompt has to revisit it. |
| **minor** | New guidance, new examples, new references, a new template, or a procedure step in `SKILL.md`. Old prompts still work. |
| **patch** | Wording, typos, clarifications, tooling, website, CI. No behavioural change to a conversion. |

Framework changes — the major ones — need evidence before they get a version at all. See
[GOVERNANCE.md](GOVERNANCE.md).

## The source of truth for the version

`SKILL.md` frontmatter:

```yaml
metadata:
  version: 0.2.0
```

The release workflow refuses to publish a tag that does not match it.

## Checklist

1. **Bump the version** in `SKILL.md` (`metadata.version`).
2. **Copy the skill across**: `cp SKILL.md web/public/isatvon-skill.md` — a test enforces
   that these are byte-identical.
3. **Regenerate**: `npm --prefix web run content` and commit the result.
4. **Write the changelog entry** in [CHANGELOG.md](CHANGELOG.md), heading `## X.Y.Z — YYYY-MM-DD`.
   The release notes are extracted from that exact heading, so the format matters.
   Deprecations go under a `### Deprecations` sub-heading.
5. **Green checks**:

   ```bash
   npm --prefix web run content:check
   npm --prefix web run test:run
   npm --prefix web run typecheck
   npm --prefix web run lint
   npm --prefix web run lint:md
   npm --prefix web run build
   npm --prefix web run test:e2e
   ```

6. **Evals**: if the release changes what a conversion produces, add a transcript to
   [EVALS.md](EVALS.md). A framework change with no eval is not ready.
7. **Merge to `main`**, then tag:

   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

8. **Watch the workflow.** `.github/workflows/release.yml` verifies the tag against
   `SKILL.md`, re-runs the content check and tests, builds
   `isatvon-prompting-skill.zip` (`SKILL.md`, `templates/`, `references/`, `examples/`,
   `skill-registry.json`), extracts the changelog section, and publishes the release.
9. **Check the zip.** Download it and confirm it installs per [INSTALL.md](INSTALL.md) —
   that archive is what Claude Desktop users upload.

## Deprecation policy

There are no `deprecated/` or `in-progress/` directories: with one skill and seven examples
they would be empty scaffolding. The changelog carries the same information, in the place
people already look.

- A deprecation is **announced one minor version ahead**, under `### Deprecations`, saying
  what replaces it.
- Deprecated guidance stays in place, marked, for at least that one minor version.
- Removal happens in the next major, listed under `### Removed`.
- Never silently delete an example or a reference file: they are linked by URL from the
  skill, the README, and anywhere anyone has shared them. If one must go, leave the file with
  a pointer to what replaced it.

## Hotfixes

Only the latest tag is supported; nothing is backported. A hotfix is a patch release from
`main` — same checklist, minus the eval step if the conversion output is unchanged.
