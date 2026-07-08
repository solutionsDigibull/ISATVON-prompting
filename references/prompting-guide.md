# The Seven Elements as Prompt Sections

How each ISATVON element translates from the [skill-manifest spec](https://github.com/isatvon/isatvon)
into a section of a text prompt, with a good and a weak example line for each.

## I — Instructions (role, task, rules)

**Purpose:** Who the model is, what it must do, and the non-negotiables.

- Good: "You are a senior payments engineer. Task: review this diff for security defects only. Rules: cite the exact line for every finding; no style comments."
- Weak: "Please review my code." *(no role, no scope, no rules)*
- Mistake: burying the task inside the context. The task is one imperative sentence, first.

## S — Source (context and inputs)

**Purpose:** Everything the model must ground its answer in — and what it must NOT invent.

- Good: "Use only the pasted Q3 report and the two customer emails below. Do not assume pricing beyond what they state."
- Weak: "You know our company." *(the model doesn't; it will hallucinate one)*
- Mistake: omitting the "do not assume" line. Untold gaps get filled from training data.

## A — Automation (method + self-verification)

**Purpose:** The step order, ending in a check the model runs on its own output *before* replying.

- Good: "1. Extract every metric. 2. Rank by variance. 3. Draft the brief. Verify: each number appears in S verbatim; if one doesn't, remove it and note it in N."
- Weak: "Think step by step." *(steps unspecified, nothing verified)*
- Mistake: verification that the model can't perform ("check with the finance team") — the check must be executable inside the response.

## T — Tech stack (capabilities allowed/forbidden)

**Purpose:** Which platform capabilities to use or avoid.

- Good: "Use web search restricted to sources from 2025 onward; cite each. Do not run code."
- Weak: "Use the internet if you want." *(unbounded, uncited)*
- Mistake: assuming a capability the platform lacks. Platform-agnostic prompts keep T to "do not fabricate sources or data".

## V — Variables (constraints with a fallback)

**Purpose:** Length, tone, audience, format limits — plus what to do when a constraint can't be met.

- Good: "Max 250 words, plain English, audience is a non-technical CFO. If a constraint can't be met, say which and why; ask at most 1 clarifying question."
- Weak: "Keep it short and professional." *(unmeasurable)*
- Mistake: no fallback. Without one, the model silently breaks a constraint instead of telling you.

## O — Outcome (exact response contract)

**Purpose:** The precise shape of the reply. In ISATVON prompting, O always embeds the
ISATVON response structure (see `references/response-format.md`), making the answer itself auditable.

- Good: "Respond in ISATVON format; your O section is a 3-bullet summary followed by a one-line recommendation."
- Weak: "Give me a good summary." *(shape unspecified)*
- Mistake: describing the format in prose when a skeleton would be unambiguous.

## N — Notification (mandatory meta-reporting)

**Purpose:** Forces the model to surface what usually stays hidden: assumptions, confidence, omissions.

- Good: "State every assumption, your confidence (high/medium/low) with the reason, and anything requested you could not deliver."
- Weak: *(section absent — the most common omission, and the one that costs you silent errors)*
- Mistake: treating N as optional politeness. It's the audit trail of the response.
