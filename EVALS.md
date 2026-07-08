# Evaluation Transcripts

Manual trigger evals: each case is a realistic user prompt, whether the skill should
fire, and the recorded result from an agent with this skill loaded following SKILL.md's
procedure. Run: 2026-07-08, Claude (Claude Code). Re-run these after any change to the
frontmatter description or the procedure.

| # | User prompt | Should trigger? | Result |
|---|---|---|---|
| 1 | INSTALL.md verify prompt (Perplexity CRM) | Yes | ✅ Fired; transcript below |
| 2 | "make this prompt better: write me a blog post about remote work" | Yes | ✅ Fired; transcript below |
| 3 | "generate an ISATVON manifest for a skill that syncs Jira tickets" | No — manifest work belongs to the `isatvon` skill | ✅ Correctly declined; transcript below |

---

## Case 1 — verify prompt (platform: Perplexity)

**User:** Convert this into an ISATVON prompt for Perplexity: "what are the best CRM tools right now?"

**Agent output** (procedure steps 1–5; step 4 Perplexity tailoring visible in S and T):

````markdown
## I — Instructions
You are a B2B software analyst. Your task: identify the best CRM tools available right
now and rank the top 5. Rules: evaluate on features, pricing, and integrations; no
sponsored-content sources; treat vendor marketing pages as claims, not evidence.

## S — Source
Search scope: reviews, comparisons, and pricing pages published within the last 12
months. Do not assume anything about my company size or industry — if a ranking would
change materially by segment, say so per tool rather than picking a segment for me.

## A — Automation
Work in these steps:
1. Identify the CRM tools most frequently recommended in recent sources.
2. Compare the candidates on features, pricing, and integrations.
3. Rank the top 5 with a one-line reason each.
Before answering, verify: every ranked tool has at least one cited source from the
last 12 months; no pricing figure appears without a source. If verification fails,
revise once, then report the failure in N.

## T — Tech stack
Use web search; cite each source inline. Mark anything you could not verify with a
recent source as "unverified". Do not fabricate reviews, ratings, or prices.

## V — Variables
- Length: max 400 words
- Tone: neutral, comparative
- Audience: a buyer evaluating options, not a CRM expert
- Fallback: if any constraint cannot be met, say which and why. Ask at most 1
  clarifying question, and only if the task is impossible without it.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: a ranked top-5 list, one line of reasoning and one cited source per tool
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, and anything requested that you could not deliver.
````

Tightened versus the raw prompt: "best" became measurable evaluation criteria with a
≤12-month source requirement, and "right now" became an explicit recency window with
citations required.

**Pass criteria met:** all seven sections filled ✅ · response skeleton embedded in O ✅ ·
S/T tailored to Perplexity's search capability ✅ · single copy-pasteable block + short
note ✅.

## Case 2 — paraphrased trigger, no platform named

**User:** make this prompt better: write me a blog post about remote work

**Agent output** (abridged — same seven-section shape): fired on the "improve … my
prompt" phrasing; produced a platform-agnostic conversion (T limited to "do not
fabricate statistics or studies" per procedure step 4's no-platform rule), with V
pinning length (800–1000 words), audience, and a fallback, and O embedding the
response skeleton with the deliverable shaped as "titled post with 3–5 subheadings".

**Pass criteria met:** triggered on paraphrase ✅ · platform-agnostic T ✅ · all seven
sections present ✅.

## Case 3 — negative case (must NOT trigger)

**User:** generate an ISATVON manifest for a skill that syncs Jira tickets

**Agent behavior:** did not run this skill's procedure; responded that manifest
generation (JSON contracts for agent loops) belongs to the `isatvon` skill and offered
to use that instead — matching SKILL.md's "Do NOT use for generating ISATVON skill
manifests" rule.

**Pass criteria met:** no seven-section prompt produced ✅ · routed to the sibling skill ✅.
