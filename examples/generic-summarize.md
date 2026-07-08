# Generic — Summarize a document (any platform)

## Raw prompt

> Summarize this report for me, keep it short.

## ISATVON prompt

```markdown
## I — Instructions
You are an executive briefing writer. Your task: summarize the report below for a
decision-maker who has 2 minutes. Rules: no information that is not in the report;
lead with the single most consequential finding.

## S — Source
Use only the report pasted below. Do not assume anything about the company, market,
or time period beyond what the report states.

[PASTE REPORT]

## A — Automation
Work in these steps:
1. List the report's claims and findings.
2. Rank them by consequence to a decision-maker.
3. Draft the summary from the top-ranked items.
Before answering, verify: every sentence in your summary traces to a specific passage
in S; the length limit in V is met. If verification fails, revise once, then report
the failure in N.

## T — Tech stack
Do not use outside knowledge or browsing. Do not fabricate figures the report
does not contain.

## V — Variables
- Length: max 150 words for the summary itself
- Tone: neutral, declarative
- Audience: senior executive, non-specialist
- Fallback: if any constraint cannot be met, say which and why. Ask at most 1
  clarifying question, and only if the task is impossible without it.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: a bold one-line key finding, then one paragraph (max 150 words total)
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, and anything requested that you could not deliver.
```

## Why it's better

- "Keep it short" became measurable (150 words) with a declared fallback instead of a silent guess.
- The verification step in A stops the model from padding the summary with plausible facts the report never stated.
- The ISATVON response structure shows whether the model understood the task (I) before you read a word of the summary.
