# Flow guide

Which route to take, from a vague idea to an answer you can act on. Start at the top.

## 1. Should you convert at all?

| Situation | Do this |
|---|---|
| Writing, content, analysis, specs; multi-constraint or source-grounded work | **Convert — full mode.** This is where it measurably pays (4.70/5 vs 3.40 baseline). |
| A self-contained reasoning or coding question, no constraints, no sources | **Lite mode** ([template](../templates/prompt-template-lite.md)) — or skip; baselines already score ~4.8–5.0 here. |
| A tweet rewrite, a tone tweak, a one-line ask | **Skip.** Seven sections cost more than they return. |
| Back-and-forth conversation | **Skip.** This structures deliverables, not chat. |
| You need a machine-validated retry loop with guaranteed exits | **Wrong repo** — you want the [ISATVON specification](https://github.com/isatvon/isatvon). |

## 2. How are you converting?

- **By hand** — copy [prompt-template.md](../templates/prompt-template.md) and fill it in.
  Walkthrough: [first-prompt.md](../docs/tutorials/first-prompt.md).
- **With the agent skill** — install per [INSTALL.md](../INSTALL.md), then *"convert this
  into an ISATVON prompt: …"*.
- **In the browser** — [isatvon.ai/prompting](https://www.isatvon.ai/prompting).
- **From code** — `POST /api/convert` ([API reference](../docs/api-reference.md)).

All four produce the same artifact.

## 3. Do you know the platform?

If yes, tune **S**, **T**, and **V** — never the structure. See
[platform-guide.md](../docs/tutorials/platform-guide.md) for the per-platform rules
(search scope and recency for Perplexity, workspace files for Copilot, the
grounded-or-cutoff branch for Gemini, and so on).

If no, keep it platform-agnostic: no capability assumptions in T beyond "don't fabricate".

## 4. Send it as the user message

Not as a system prompt, not as "custom instructions". In benchmarking that was ignored in
8/8 runs and scored *below* baseline. The framework only works as a full prompt rewrite.

## 5. Read the response in this order

1. **I** — did it understand the task? One sentence. If it is wrong, stop and fix I.
2. **N** — assumptions and confidence. This is the part people skip and should not.
3. **V** — what it honored, and what it broke and why. A declared break is the system working.
4. **A** — what it actually verified.
5. **O** — the deliverable, read last, with all of the above as context.

## 6. Something is off — which section?

| Symptom | Sharpen |
|---|---|
| Answered a different question | **I** — the imperative sentence is ambiguous |
| Invented a fact, figure, or citation | **S** ("do not assume" is too loose) and **T** (forbid it outright) |
| Used stale information | **S** (recency window) and **T** (require retrieval, or force a cutoff declaration) |
| Right content, wrong shape | **O** — spell out the deliverable's exact shape |
| Too long, wrong register | **V** — make the limit a number, name the audience |
| Claimed a check it did not do | **A** — the verification step was not something you could settle |
| Broke a constraint silently | **V** — the fallback line is missing or vague |
| Did more than asked | **O** — the deliverable shape is open-ended |

Change one section, re-send, compare. Because the reply is structured, two runs are
comparable — which is most of why the structure is worth its length.

## 7. Still stuck

- Per-element guidance with good/weak examples: [prompting-guide.md](prompting-guide.md)
- What the terms mean: [domain-model.md](domain-model.md)
- Common questions: [FAQ](../docs/faq.md)
- Seven worked conversions: [examples/](../examples/README.md)
