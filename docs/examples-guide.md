# Writing an example conversion

Example conversions are the most useful contribution to this repo: they are what people
actually read before they trust the framework. This is the shape they take and the checks
they have to pass.

## File shape

One file per conversion in `examples/`, named `<platform>-<task>.md` (kebab-case,
`claude-code-review.md`). Do not create subdirectories — the files are linked by URL from
`SKILL.md`, the README, and anywhere anyone has shared them. Difficulty lives in frontmatter.

````markdown
---
id: claude
order: 3
platform: Claude
difficulty: intermediate
category: engineering
tags: [code-review, severity, verification]
raw-quality: naive
contributed-by: your-github-handle
date: 2026-08-18
nav: "Claude: Code review"
chip: "Review this code…"
tagline: "\"Is it good?\" invites vague praise. This restricts the review to defects with line citations."
---

# Claude — Code review

## Raw prompt

> Can you review this code and tell me if it's good?

## ISATVON prompt

```markdown
## I — Instructions
…all seven sections…
```

## Why it's better

- First reason.
- Second reason.
- Third reason.
````

## Frontmatter reference

| Key | Required | What it is |
|---|---|---|
| `id` | yes | kebab-case, unique. The website's panel id. |
| `order` | yes | Unique integer. Position in the sidebar and the index. |
| `platform` | yes | `ChatGPT`, `Claude`, `Gemini`, `Perplexity`, `Copilot`, `Grok`, or `Any`. |
| `difficulty` | yes | `beginner`, `intermediate`, or `advanced` — see below. |
| `category` | yes | Free text: `writing`, `engineering`, `research`, `marketing`… |
| `tags` | yes | At least one. Inline array, kebab-case. |
| `raw-quality` | yes | `naive`, `mediocre`, or `near-good` — see below. |
| `contributed-by` | yes | Your GitHub handle. |
| `date` | yes | `YYYY-MM-DD`. |
| `nav` | yes | Sidebar label on the website. |
| `chip` | yes | Short label for the example chips above the converter. |
| `tagline` | yes | One line on what the conversion fixes. Quote it, and escape inner quotes as `\"`. |

### Difficulty describes the prompt, not the reader

- **beginner** — one or two constraints, no external source.
- **intermediate** — multi-constraint, or grounded in pasted material.
- **advanced** — adds citation, recency, or verification rules the model has to check
  against something outside itself.

### Raw quality describes the "before" prompt

- **naive** — vague, the mistake people actually make (*"summarize this, keep it short"*).
- **mediocre** — partly structured, unclear intent.
- **near-good** — structured but not rigorous: no verification, no fallback, no source
  boundary.

Use a real prompt you or someone else genuinely typed. Strawmen make the conversion look
better than it is and teach nobody anything.

## What CI checks

`npm --prefix web run test:run` runs the same checks the pipeline does:

- frontmatter matches the schema above;
- an `# H1`, a `## Raw prompt` with a `>` quote, and a `## ISATVON prompt` with a fenced
  ` ```markdown ` block;
- **all seven sections, in I-S-A-T-V-O-N order** — order, not just presence;
- **A** ends with a self-verification step;
- **V** has a `Fallback:` line;
- **O** embeds the response skeleton from
  [references/response-format.md](../references/response-format.md);
- at least three `## Why it's better` bullets.

## After you write it

```bash
npm --prefix web run content    # regenerate examples/index.json, examples/README.md, the site data
npm --prefix web run test:run   # validate
```

Commit the regenerated files with your example — the site renders from them, and CI fails if
they are stale.

## Writing the conversion itself

- **Be concrete.** `[PASTE REPORT]` is fine as a placeholder; "some context about the
  company" is not. Every section should be something a reader could use as-is after
  substituting their own material.
- **Make constraints measurable.** "Short" becomes "max 150 words". "Professional" becomes
  a named audience and a banned-phrase list.
- **Make A checkable.** "Verify quality" is not a verification step. "Every sentence traces
  to a passage in S; the word count in V is met" is.
- **Be platform-honest.** Do not require browsing from a model that is not browsing, or code
  execution where there is none. If a capability is conditional, say what to do when it is
  absent — see the Gemini example's knowledge-cutoff clause.
- **Explain the mechanism in "Why it's better".** Not "this prompt is clearer" — *which*
  failure it prevents, and *which* section prevents it.
