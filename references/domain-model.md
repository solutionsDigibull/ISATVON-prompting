# Domain model

The shared vocabulary for this repo. Skills, examples, tests, and docs use these terms in
exactly this sense; if you are adding content, match them rather than inventing a synonym.

## The seven elements

| Key | Name | In the prompt | In the response |
|---|---|---|---|
| **I** | Instructions | Role, the task in one imperative sentence, hard rules | The task as the model understood it |
| **S** | Source | Approved context and inputs, plus what must not be assumed | The sources it actually used |
| **A** | Automation | The method, ending in a self-verification step | How it verified the result |
| **T** | Tech stack | Capabilities allowed and forbidden | — |
| **V** | Variables | Measurable constraints plus a fallback | Constraints honored, or broken with a reason |
| **O** | Outcome | The exact response contract | The deliverable itself |
| **N** | Notification | The meta-reporting required | Assumptions, confidence, omissions |

## Core terms

**Raw prompt** — the unstructured request someone actually typed. *"Summarize this report,
keep it short."*

**Converted prompt** (or **structured prompt**) — the result of a conversion: seven sections
in I-S-A-T-V-O-N order, with the response contract embedded in O.

**Conversion** — rewriting a raw prompt into a converted prompt. What `SKILL.md` and
`/api/convert` both do.

**Full mode** — all seven sections. The default.

**Lite mode** — I, O, N only, for a self-contained one-shot question with no constraints to
enforce and no external source to ground against.

**Self-verification step** — the instruction at the end of A telling the model to check
something *before* it answers ("every claim traces to S; the word count in V is met"), and
what to do when the check fails. A check a machine or a reader could settle; not "verify
quality".

**Constraint** — a limit in V that can be checked: a word count, a named audience, a banned
phrase list, a format rule.

**Fallback** — the line in V saying what to do when a constraint cannot be met: name it, say
why, ask at most one clarifying question. A declared break is a success, not a failure.

**Response contract** — the skeleton in O requiring the reply itself to come back in ISATVON
structure. Canonical text: [response-format.md](response-format.md).

**Response skeleton** — the literal `- **I** — …` lines that carry the contract. Their
presence in O is checked in CI.

## Failure modes the framework targets

**Fabrication** — inventing facts, figures, citations, or product features. Countered by S's
"do not assume" boundary and T's explicit prohibition.

**Hidden assumption** — filling a gap from training data without saying so. Countered by N's
required assumptions report.

**Silent constraint break** — quietly exceeding a limit rather than flagging it. Countered by
V's fallback.

**Unverified output** — answering without checking. Countered by A's verification step.

**Misread task** — answering a different question than the one asked. Countered by O
requiring the reply to open with the task as understood, so the misread is visible in one
line.

**Scope creep** — delivering more or other than asked. Countered by O's exact deliverable
shape.

## Repository terms

**Skill** — `SKILL.md` at the repo root: the agent-readable procedure for performing a
conversion. One skill, deliberately; Lite mode and platform tailoring are steps within it.

**Trigger phrase** — a phrase that should cause an agent to use the skill. Listed in
SKILL.md's `## Trigger phrases` section and mirrored into `skill-registry.json`.

**Template** — a copy-paste skeleton in `templates/`, usable with no agent at all.

**Example** (or **example conversion**) — a before/after file in `examples/`: raw prompt,
converted prompt, and three or more reasons the conversion is better.

**Difficulty** — `beginner` / `intermediate` / `advanced`. A property of the *prompt's*
complexity, not the reader's skill.

**Raw quality** — how bad the "before" prompt is: `naive`, `mediocre`, `near-good`.

**Canonical content** — the hand-edited markdown at the repo root. The single source of
truth.

**Generated content** — everything derived from it: `web/lib/generated/content.ts`,
`examples/index.json`, `examples/README.md`, `skill-registry.json`. Committed, never
hand-edited, verified by `npm run content:check`.

## Adjacent, and not the same thing

**COSTAR** — Context, Objective, Style, Tone, Audience, Response. Structures the ask only.
Mapping: [costar-comparison.md](costar-comparison.md).

**The ISATVON specification** — [isatvon/isatvon](https://github.com/isatvon/isatvon): JSON
manifests for bounded agent loops. Same seven elements, machine-enforced, different artifact.
This repo produces text prompts, not manifests.
