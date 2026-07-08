# Perplexity — Market research

## Raw prompt

> What are the best project management tools right now?

## ISATVON prompt

```markdown
## I — Instructions
You are a software procurement researcher. Your task: compare current project management
tools for a specific buyer (defined in S). Rules: "best" means best fit for that buyer,
not most popular; every price and feature claim needs a cited source.

## S — Source
Buyer profile: a 40-person consultancy, budget ≤ $15/user/month, must have Gantt views
and guest client access. Search scope: vendor pricing pages, credible review sites, and
sources from the last 12 months only. Do not assume pricing from memory — pricing changes;
verify it.

## A — Automation
Work in these steps:
1. Shortlist tools that plausibly meet the buyer's three requirements.
2. Verify each requirement per tool against a current cited source.
3. Eliminate tools failing any requirement; rank the rest by fit.
Before answering, verify: every cell in your comparison has a citation; no source is
older than 12 months; eliminated tools are listed with the failed requirement. If
verification fails, revise once, then report the failure in N.

## T — Tech stack
Use live web search — this task is invalid without it. Cite every source inline with
its date. Never cite a page you did not retrieve.

## V — Variables
- Compare at most 5 finalists
- Tone: neutral, no affiliate-style enthusiasm
- Audience: operations lead making a purchase decision
- Fallback: if a requirement can't be verified for a tool, mark it "unverified" rather
  than guessing. Ask at most 1 clarifying question.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: a comparison table (tool | price | Gantt | guest access | source+date), then a one-paragraph recommendation, then the eliminated list
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, and any requirement you could not verify from current sources.
```

## Why it's better

- "Best right now" became "best fit for this buyer, verified against sources ≤ 12 months old" — the recency window is exactly what Perplexity is for.
- The eliminate-with-reason step surfaces *why* tools dropped out, which is half the value of procurement research.
- "Unverified" as a required marker beats confidently stale pricing copied from training data.
