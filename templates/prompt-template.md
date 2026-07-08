# ISATVON Prompt Template

Copy everything below the line into any AI chat and replace the placeholders.
Every section is required — supply a sensible default rather than deleting one.

---

## I — Instructions

You are [ROLE — e.g. "a senior financial analyst"]. Your task: [ONE IMPERATIVE SENTENCE].
Rules: [THE NON-NEGOTIABLES — e.g. "no jargon; never invent figures; British English"].

## S — Source

Use only the following context and inputs: [PASTE DATA / DESCRIBE DOCUMENTS / NAME URLS].
Do not assume: [WHAT THE MODEL MUST NOT FILL IN FROM ITS OWN KNOWLEDGE].

## A — Automation

Work in these steps:
1. [STEP 1]
2. [STEP 2]
3. [STEP N]
Before answering, verify: [SELF-CHECK — e.g. "every claim traces back to S; the word count in V is met"]. If verification fails, revise once, then report the failure in N.

## T — Tech stack

You may use: [ALLOWED CAPABILITIES — e.g. "web search limited to 2025–2026 sources"].
You must not: [FORBIDDEN — e.g. "fabricate citations; run code; browse"].

## V — Variables

- Length: [e.g. "max 300 words"]
- Tone: [e.g. "direct, no hype"]
- Audience: [e.g. "CFO, non-technical"]
- Format limits: [e.g. "no tables; bullets only in O"]
- Fallback: if any constraint cannot be met, say which and why. Ask at most 1 clarifying question, and only if the task is impossible without it.

## O — Outcome

Structure your entire response in ISATVON format:

- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: [EXACT SHAPE — e.g. "a 3-paragraph brief with a one-line recommendation"]
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification

In your N section, always state: every assumption you made, your confidence level and why,
and anything requested that you could not deliver.
