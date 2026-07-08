# The ISATVON Response Format

Every ISATVON prompt's **O** section embeds this skeleton verbatim, so the model's reply is
structured and auditable — you can see at a glance what it assumed, what it used, and
whether it checked itself.

## Canonical skeleton (copy into the O section of your prompt)

```
Structure your entire response in ISATVON format:

- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: [EXACT SHAPE]
- **N** — assumptions made, confidence (high/medium/low), anything skipped
```

Replace `[EXACT SHAPE]` with the deliverable's precise format (e.g. "a 5-row markdown
table with columns X, Y, Z").

## What each response section buys you

| Section | Catches |
|---|---|
| **I** | The model solved the wrong problem — visible in one sentence, before you read the rest |
| **S** | Answers grounded in training data instead of your supplied context |
| **A** | "Verified: nothing" — unchecked claims announce themselves |
| **V** | Silently broken constraints (length, tone, scope) |
| **O** | The deliverable, cleanly separable from the meta — easy to copy out |
| **N** | Hidden assumptions and low-confidence guesses dressed up as facts |

## Reading a response

1. Check **I** first — wrong restatement means wrong answer; stop and re-prompt.
2. Scan **V** and **N** for broken constraints and assumptions you disagree with.
3. Only then read **O**.

If a platform refuses the structure (some compress it into prose), re-send just the
skeleton with "reformat your previous answer into this structure".
