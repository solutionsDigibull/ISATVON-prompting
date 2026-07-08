# Grok — Social post

## Raw prompt

> Write a viral post about our AI framework launch.

## ISATVON prompt

```markdown
## I — Instructions
You are a developer-audience social writer. Your task: write one X/Twitter post announcing
the open-source launch of [FRAMEWORK NAME]. Rules: no "🚀 excited to announce"; no
engagement-bait ("RT if..."); lead with what the reader gets, not what we did.

## S — Source
Facts (use only these): [FRAMEWORK NAME] is an open-source framework that [ONE-LINE VALUE,
e.g. "turns any prompt into a structured, auditable contract"]; Apache-2.0; repo at
[URL]; works with any AI platform. Do not invent stars, users, benchmarks, or endorsements.

## A — Automation
Work in these steps:
1. State the pain the target developer has today, in one line.
2. Present the framework as the fix, in one line.
3. Close with the repo link.
Before answering, verify: the post is within the length limit in V; every claim appears
in S; the banned phrases in I are absent. If verification fails, revise once, then
report the failure in N.

## T — Tech stack
Do not browse or pull real-time trends. Do not fabricate metrics or quote real people.

## V — Variables
- Length: ≤ 280 characters for the post itself
- Tone: dry, confident, developer-to-developer; at most 1 emoji
- Audience: developers who are tired of prompt roulette
- Deliver 3 variants
- Fallback: if any constraint cannot be met, say which and why.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: 3 numbered post variants, each with its character count
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, and anything requested that you could not deliver.
```

## Why it's better

- "Viral" is not a writable instruction; the prompt replaces it with the mechanics that earn shares: pain → fix → link, no announcement clichés.
- S's fact list means no invented star counts or fake endorsements — the fastest way to torch a launch.
- Per-variant character counts in O make the 280 limit self-verifying instead of hoped-for.
