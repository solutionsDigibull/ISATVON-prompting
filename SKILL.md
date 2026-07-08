---
name: isatvon-prompting
description: Converts any raw prompt into an ISATVON-structured prompt for any AI platform (ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, ...), with the response also returned in ISATVON structure. Use when the user asks to improve, structure, convert, or rewrite a prompt, asks for an "ISATVON prompt", or wants a COSTAR-style prompting framework.
license: Apache-2.0
---

# ISATVON Prompting

You rewrite a raw, unstructured prompt into an **ISATVON-structured prompt**: seven markdown
sections (I-S-A-T-V-O-N) that work on any AI platform and instruct the model to return its
**answer in ISATVON structure too** — so both the ask and the response are auditable.

Think COSTAR, plus verification, tool policy, and constraints with fallbacks.

Element guide: [references/prompting-guide.md](references/prompting-guide.md) ·
COSTAR mapping: [references/costar-comparison.md](references/costar-comparison.md)

## When to use

- The user asks to "improve / structure / rewrite / convert my prompt" or for an "ISATVON prompt".
- The user wants a reusable, high-quality prompt for ChatGPT, Claude, Gemini, Perplexity,
  Copilot, Grok, or any other AI platform.
- The user mentions COSTAR or asks for a prompting framework.

Do NOT use for generating ISATVON **skill manifests** (JSON contracts for agent loops) —
that is the [isatvon](https://github.com/isatvon/isatvon) skill. This skill produces
**text prompts**, not manifests.

## Procedure

### 1. Extract intent

Read the raw prompt. Identify the task, the implicit audience, and the desired deliverable.
Ask at most 1–2 questions, and only if the goal is genuinely ambiguous — otherwise state
your assumptions in the converted prompt's N section and proceed.

### 2. Fill the seven sections

Start from [templates/prompt-template.md](templates/prompt-template.md):

| Section | What goes in it |
|---|---|
| **I — Instructions** | Role for the model, the task in one imperative sentence, and the rules that bound it. |
| **S — Source** | Context, data, and references the model must use — and what it must not assume. |
| **A — Automation** | The step-by-step method, ending with a **self-verification step** the model runs before answering (e.g. "check every claim traces to S"). |
| **T — Tech stack** | Capabilities/tools to use or avoid: web search, code execution, no fabricated citations. |
| **V — Variables** | Constraints: length, tone, audience, format limits — plus a fallback ("if a constraint can't be met, say which and why; ask at most 1 clarifying question"). |
| **O — Outcome** | The exact response format. Always embed the ISATVON response structure from [references/response-format.md](references/response-format.md). |
| **N — Notification** | Meta-reporting the model must include: assumptions made, confidence, what was skipped. |

Every section must be filled — if the raw prompt gives nothing for a section, supply a
sensible default rather than dropping it.

### 3. Require an ISATVON response

The O section always instructs the model to structure its reply as
I (task as understood) → S (sources used) → A (how it verified) → V (constraints honored
or broken) → O (the deliverable itself) → N (assumptions & confidence). Copy the skeleton
from [references/response-format.md](references/response-format.md) verbatim into O.

### 4. Tailor to the platform (if named)

- **Perplexity / search-first tools** — S names the search scope and recency window; T requires cited sources.
- **Copilot / coding assistants** — S names the workspace files; T pins languages/frameworks; A ends with "run or type-check the result".
- **ChatGPT / Claude / Gemini / Grok** — general purpose; tune T to available features (browsing, code interpreter) and V to tone.
- No platform named → keep it platform-agnostic (no tool assumptions in T beyond "don't fabricate").

### 5. Emit

Output the converted prompt as **one copy-pasteable markdown block**, then 1–2 sentences on
what was added or tightened versus the raw prompt. Do not explain the framework itself
unless asked.

## Worked examples

Before/after conversions showing the expected concreteness:

- [examples/generic-summarize.md](examples/generic-summarize.md) — platform-agnostic baseline
- [examples/chatgpt-marketing-email.md](examples/chatgpt-marketing-email.md)
- [examples/claude-code-review.md](examples/claude-code-review.md)
- [examples/gemini-research-brief.md](examples/gemini-research-brief.md)
- [examples/perplexity-market-research.md](examples/perplexity-market-research.md)
- [examples/copilot-refactor.md](examples/copilot-refactor.md)
- [examples/grok-social-post.md](examples/grok-social-post.md)
