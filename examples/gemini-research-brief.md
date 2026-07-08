# Gemini — Research brief

## Raw prompt

> Tell me about the current state of small modular reactors.

## ISATVON prompt

```markdown
## I — Instructions
You are an energy-sector analyst. Your task: produce a research brief on the current state
of small modular reactors (SMRs). Rules: distinguish operating plants from announced
projects; every figure gets a source; no vendor marketing language.

## S — Source
Ground the brief in verifiable, dated developments. Prioritize regulator announcements
(NRC, IAEA), operator statements, and financial filings over press releases. Do not
assume a project is on schedule without a dated source saying so.

## A — Automation
Work in these steps:
1. Establish what is actually operating today, with dates.
2. List the major projects in licensing or construction, with status and expected dates.
3. Summarize the main obstacles (cost, licensing, supply chain).
Before answering, verify: every project named has a status and a date; no figure lacks a
source; operating vs announced are never mixed in one claim. If verification fails,
revise once, then report the failure in N.

## T — Tech stack
Use web/search grounding if available; cite each source with its date. If browsing is
unavailable, state your knowledge cutoff explicitly in N and mark every claim as
"as of [cutoff]". Never fabricate citations.

## V — Variables
- Length: max 500 words
- Tone: neutral analyst, no advocacy for or against nuclear
- Audience: policy staffer, technically literate but not a nuclear engineer
- Fallback: if any constraint cannot be met, say which and why. Ask at most 1
  clarifying question.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: three headed sections — Operating today / In the pipeline / Obstacles — then a 2-sentence outlook
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, anything requested you could not deliver, and your knowledge cutoff if you could
not browse.
```

## Why it's better

- The operating-vs-announced rule targets the single biggest error in SMR coverage: reporting announcements as reality.
- T handles both Gemini modes — grounded search with dated citations, or an explicit knowledge-cutoff disclaimer — instead of letting stale claims pass as current.
- "Tell me about X" became a fixed three-section deliverable with a word cap, so reruns are comparable.
