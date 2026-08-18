# Your first ISATVON prompt

End to end, with a real prompt: what you type, what you get back, and how to read it. No
install, no account — any AI chat will do.

## 0. The prompt we are fixing

```text
Summarize this report for me, keep it short.
```

Three things are wrong with it, and none of them are obvious until the answer arrives:

- **"Short" is not a number.** The model guesses, and guesses differently every time.
- **Nothing forbids invention.** Anything missing from the report gets filled in from
  training data, fluently.
- **You cannot see what it thought you meant** until you have read the whole summary.

## 1. Start from the template

Copy [templates/prompt-template.md](../../templates/prompt-template.md). Paste it into the
chat **as your message** — not into a system prompt or "custom instructions", where the
structure gets ignored ([why](../faq.md#why-does-it-have-to-go-in-the-user-message)).

## 2. Fill the seven sections

Work top to bottom. Every section gets something; where the raw ask gives you nothing,
supply a sensible default rather than deleting the section.

**I — Instructions.** Who the model is, one imperative sentence, the hard rules.

```text
You are an executive briefing writer. Your task: summarize the report below for a
decision-maker who has 2 minutes. Rules: no information that is not in the report;
lead with the single most consequential finding.
```

**S — Source.** What it may use, and what it must not fill in.

```text
Use only the report pasted below. Do not assume anything about the company, market,
or time period beyond what the report states.

[PASTE REPORT]
```

**A — Automation.** The method, ending in a check it runs *before* answering. This is the
section that does the most work.

```text
Work in these steps:

1. List the report's claims and findings.
2. Rank them by consequence to a decision-maker.
3. Draft the summary from the top-ranked items.

Before answering, verify: every sentence in your summary traces to a specific passage
in S; the length limit in V is met. If verification fails, revise once, then report
the failure in N.
```

**T — Tech stack.** Capabilities allowed and forbidden.

```text
Do not use outside knowledge or browsing. Do not fabricate figures the report
does not contain.
```

**V — Variables.** This is where "short" becomes checkable — and where you say what to do
when a constraint cannot be met.

```text
- Length: max 150 words for the summary itself
- Tone: neutral, declarative
- Audience: senior executive, non-specialist
- Fallback: if any constraint cannot be met, say which and why. Ask at most 1
  clarifying question, and only if the task is impossible without it.
```

**O — Outcome.** The response contract. Copy the skeleton from
[references/response-format.md](../../references/response-format.md) verbatim and fill in the
deliverable's exact shape.

```text
Structure your entire response in ISATVON format:

- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: a bold one-line key finding, then one paragraph
  (max 150 words total)
- **N** — assumptions made, confidence (high/medium/low), anything skipped
```

**N — Notification.** What the meta-report must contain.

```text
In your N section, always state: every assumption you made, your confidence level and
why, and anything requested that you could not deliver.
```

The finished version is [examples/generic-summarize.md](../../examples/generic-summarize.md).

## 3. Read the answer in the right order

The reply comes back in the same structure. Read it out of order:

1. **I first.** One sentence, and it either matches what you wanted or it does not. If it
   does not, stop — nothing below it is worth reading, and you have caught the misread in
   five seconds instead of five paragraphs.
2. **N next.** Assumptions and confidence. "Medium confidence, assumed Q3 figures are
   year-on-year" is the sentence that saves you.
3. **V.** Any constraint it broke, and why. A declared break is the system working.
4. **A.** What it actually checked.
5. **O last.** The deliverable — by now you know how much to trust it.

## 4. Iterate on the section that failed

The structure tells you where to fix things, which is most of its value:

| What went wrong | Section to sharpen |
|---|---|
| Wrong task | **I** — the imperative sentence was ambiguous |
| Invented a fact | **S** (tighten "do not assume") and **T** (forbid it explicitly) |
| Right facts, wrong shape | **O** — spell out the deliverable's shape |
| Too long, too formal | **V** — make the limit a number, name the audience |
| Claimed something it did not check | **A** — the verification step was not checkable |

## 5. Shortcuts, once you have done it once

- **Lite mode.** Self-contained question, no sources, no constraints? Use
  [prompt-template-lite.md](../../templates/prompt-template-lite.md) — I, O, N.
- **Let the skill do it.** Install per [INSTALL.md](../../INSTALL.md) and say
  *"convert this into an ISATVON prompt: …"*.
- **Use the converter.** [isatvon.ai/prompting](https://www.isatvon.ai/prompting) — paste,
  convert, edit, copy.

Next: [platform-guide.md](platform-guide.md) for tuning S, T, and V to a specific model.
