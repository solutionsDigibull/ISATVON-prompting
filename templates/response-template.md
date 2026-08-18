# ISATVON Response Template

The response contract as a standalone file — the same skeleton
[prompt-template.md](prompt-template.md) embeds in its **O** section.

Two ways to use it:

- **When writing a prompt by hand**, copy the block below into your O section and replace
  `[EXACT SHAPE]` with the deliverable's precise format.
- **When a model ignored the structure** and answered in prose, send just the block with
  *"reformat your previous answer into this structure"*. Some platforms compress the
  structure on the first pass and comply on the second.

Rationale for each section and how to read a reply:
[references/response-format.md](../references/response-format.md).

---

## Full (default)

```text
Structure your entire response in ISATVON format:

- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: [EXACT SHAPE]
- **N** — assumptions made, confidence (high/medium/low), anything skipped
```

## Compact (Lite mode)

For a self-contained question with no constraints to enforce and no external sources — it
keeps the wrong-problem check (I) and the assumptions report (N) and drops the sections that
would be empty:

```text
Structure your response as:

- **I** — the task as you understood it (1 sentence)
- **O** — the answer itself: [EXACT SHAPE]
- **N** — assumptions made, confidence (high/medium/low)
```

## Read it in this order

1. **I** — wrong restatement means wrong answer. Stop and fix the prompt's I section.
2. **N** — assumptions and confidence.
3. **V** — anything broken, and why. A declared break is the system working.
4. **A** — what it actually checked.
5. **O** — the deliverable, last.
