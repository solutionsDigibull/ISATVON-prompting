# GitHub Copilot — Refactor

## Raw prompt

> Refactor this function, it's too long.

## ISATVON prompt

```markdown
## I — Instructions
You are a senior engineer refactoring production code. Your task: split the function
below into smaller functions without changing behavior. Rules: no behavior change, no
new dependencies, no renaming of the public entry point; keep the file's existing style.

## S — Source
The function and its file context are in the editor selection / attached file:
[FILE PATH]. Its callers are in [CALLER FILES, if known — otherwise: "unknown; treat the
signature as frozen"]. Do not assume test coverage exists.

## A — Automation
Work in these steps:
1. Identify the function's distinct responsibilities.
2. Extract each into a private helper with a single purpose.
3. Keep the original function as a thin orchestrator with the same signature.
Before answering, verify: the public signature is byte-identical; every code path in the
original exists in the refactor (including error paths); no helper is called from only
a comment. If the project has tests for this file, state the command to run them.

## T — Tech stack
Language/framework: [e.g. "TypeScript 5, no new npm packages"]. Use workspace context if
available to check callers; do not invent APIs that aren't in the project.

## V — Variables
- Max helpers: 5 — more means the split is wrong, say so instead
- Comments: only where the original had them or a non-obvious constraint needs stating
- Fallback: if behavior-preserving extraction isn't possible for some path (e.g. tangled
  state), leave that path inline and explain in N. Ask at most 1 clarifying question.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: the full refactored code block, then the test command to verify behavior
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made (especially about unseen
callers), your confidence level and why, and any path you left unrefactored.
```

## Why it's better

- "Too long" became a testable contract: identical signature, all paths preserved, ≤ 5 helpers, no new dependencies.
- S's "signature frozen" default protects unseen callers — the way refactors actually break production.
- The response must end with the command that proves behavior held, not just prettier code.
