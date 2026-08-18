# FAQ

## What problem does ISATVON actually solve?

Two failure modes that survive every "write a better prompt" tip:

1. **You cannot tell whether the model understood you** until you have read the whole answer
   and noticed it answered something else.
2. **The model fills gaps with plausible invention** — a statistic, a citation, a feature
   your product does not have.

ISATVON's answer is structural: the prompt names what may be used (**S**), how to check the
work before answering (**A**), what the limits are and what to do when one cannot be met
(**V**), and the exact shape of the reply (**O**) — including that the reply opens with the
task as understood. A misread is visible in one line instead of five paragraphs.

## Why not just use COSTAR?

COSTAR structures the *ask*. ISATVON structures the ask **and** the answer, and adds the two
mechanisms COSTAR has no slot for: a self-verification step, and an explicit anti-fabrication
boundary. In blind benchmarking those were exactly the failure classes that separated them —
CO-STAR outputs invented statistics; ISATVON outputs did not. Full mapping:
[references/costar-comparison.md](../references/costar-comparison.md).

Use COSTAR (or nothing) for a tweet rewrite. Use ISATVON when the answer has to be checkable.

## Why does it have to go in the user message?

Because condensing it into a system prompt or "custom instructions" **does not work**. In
benchmarking, that mechanism was ignored in 8/8 runs — replicated in a clean session and on
a stronger model — and scored *below* baseline. The framework only works as a full prompt
rewrite, as the message you actually send.

## When is Lite better than the full seven sections?

When the task is self-contained: a reasoning question, a coding one-liner, anything with no
constraints to enforce and no external source to ground against. Baseline models already
score ~4.8–5.0 there, and seven sections add cost without a measurable gain. Use
[templates/prompt-template-lite.md](../templates/prompt-template-lite.md) — I, O, N.

The full template earns its length on writing and content work and on constraint-heavy or
source-grounded tasks (blind benchmark: 4.70/5 vs 3.40 baseline).

## Does this stop hallucination?

No. It **reduces** it and, more usefully, makes it visible. Grounding claims in S, requiring
verification in A, and forcing an assumptions-and-confidence report in N mean an invented
claim usually either gets caught by the model's own check or shows up in N as a low-confidence
assumption you can see. Nothing in a prompt can make a language model incapable of being
wrong. Treat N as the part you read first, not the part you skip.

## Do I need the agent skill, or an account, or the website?

None of them. Copy [templates/prompt-template.md](../templates/prompt-template.md) into any
chat and fill in the placeholders — that is the whole framework. The
[skill](../INSTALL.md) automates the rewrite; the
[website](https://www.isatvon.ai/prompting) does the same in a browser. All three produce the
same thing.

## Does it work on ChatGPT / Claude / Gemini / Perplexity / Copilot / Grok?

Yes — it is markdown, so it works anywhere that reads text. Tailoring it to a platform means
adjusting S, T, and V, not changing the structure: search scope and a recency window for
Perplexity, workspace files and a "run or type-check it" step for Copilot, an explicit
knowledge-cutoff clause for anything that may or may not be browsing. See
[tutorials/platform-guide.md](tutorials/platform-guide.md).

## The model broke a constraint anyway. Is the prompt wrong?

Check V's fallback line first. The framework's position is that a broken constraint should be
*declared*, not silently smoothed over — "say which and why" is a success, not a failure. If
the model broke a constraint without saying so, that is worth an issue: the V wording or the
verification step in A probably needs sharpening.

## Why is the prompt so long? Doesn't that cost more tokens?

It does. The trade is a longer prompt against a re-run: a conversion is a few hundred extra
input tokens, and a misread answer costs you the whole output plus your time. For short
self-contained asks the trade does not pay — that is what Lite mode is for.

## Can I change the sections, or add one?

For your own use, freely. For a change to the framework itself, see
[GOVERNANCE.md](../GOVERNANCE.md): the README's claims are benchmark-backed, so changes to
what a section *means* need evidence, not just preference.

## Is this the same as the ISATVON specification?

No. This repo is **text prompts**. The [ISATVON specification](https://github.com/isatvon/isatvon)
is JSON manifests for bounded agent loops — MCP tools, machine-validated retries, guaranteed
exits — with its own [validator](https://github.com/isatvon/isatvon-validator). Same seven
elements, different artifact. If you need a machine to enforce the contract, you want the
spec; if you need a person to paste something into a chat, you want this.

## How do I add an example?

Write the before/after in a markdown file with the frontmatter block described in
[examples-guide.md](examples-guide.md), then run `npm --prefix web run content` and commit the
regenerated index. CI validates the structure. Real, mediocre prompts convert better than
strawmen — the naive version you actually typed is more useful than an invented bad one.
