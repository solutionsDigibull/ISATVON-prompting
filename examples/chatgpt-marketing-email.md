# ChatGPT — Marketing email

## Raw prompt

> Write a marketing email for our new project management app.

## ISATVON prompt

```markdown
## I — Instructions
You are a direct-response copywriter. Your task: write one launch email for our project
management app. Rules: one idea per email; no buzzwords ("revolutionary", "game-changing",
"seamless"); the reader's problem comes before the product.

## S — Source
Product facts (use only these): the app is called [NAME]; it auto-builds project timelines
from a task list; free tier up to 5 users; launches [DATE]. Audience: team leads at
companies of 10–200 people who currently plan in spreadsheets.
Do not assume features, pricing, or integrations beyond the above.

## A — Automation
Work in these steps:
1. State the reader's spreadsheet pain in their words.
2. Present the one feature (auto-timelines) as the resolution.
3. Close with a single CTA to the free tier.
Before answering, verify: every product claim appears in S; the subject line is under
50 characters; there is exactly one CTA. If verification fails, revise once, then report
the failure in N.

## T — Tech stack
Do not browse. Do not invent statistics, testimonials, or customer names.

## V — Variables
- Length: subject ≤ 50 characters; body 120–170 words
- Tone: plain, confident, second person
- Audience: busy team leads, skim readers
- Format: short paragraphs, no bullet lists in the email body
- Fallback: if any constraint cannot be met, say which and why. Ask at most 1
  clarifying question, and only if the task is impossible without it.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: SUBJECT: line, then the email body, then CTA button text
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, and anything requested that you could not deliver.
```

## Why it's better

- S pins the product facts, so the email can't acquire imaginary features or fake testimonials — the most common failure of marketing prompts.
- The banned-buzzword rule in I and the measurable limits in V replace "make it good" with checkable requirements.
- A's verification (claims in S, subject ≤ 50 chars, one CTA) runs before you ever see the draft.
