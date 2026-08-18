# Tailoring a prompt to a platform

The seven sections never change. What changes is **S**, **T**, and **V** — what the model may
ground against, what capabilities it may use, and what limits its output has to respect.
Getting these wrong is how a good prompt produces a confidently stale or fabricated answer.

The rule under all of it: **be platform-honest.** Never require a capability the model does
not have in the session you are actually using, and when a capability is conditional, say
what to do when it is missing.

---

## Perplexity, and anything search-first

**S** — name the search scope and the recency window. This is the whole point of the tool:

```text
Search scope: vendor pricing pages, credible review sites, and sources from the last
12 months only. Do not assume pricing from memory — pricing changes; verify it.
```

**T** — require retrieval and citation, and forbid citing what was not retrieved:

```text
Use live web search — this task is invalid without it. Cite every source inline with
its date. Never cite a page you did not retrieve.
```

**V** — add a marker for what could not be verified, so a gap reads as a gap:

```text
Fallback: if a requirement can't be verified for a tool, mark it "unverified" rather
than guessing.
```

Worked example: [perplexity-market-research.md](../../examples/perplexity-market-research.md).

---

## Copilot, and coding assistants

**S** — name the files, and be explicit about what is *not* visible:

```text
The function and its file context are in the editor selection / attached file: [FILE PATH].
Its callers are in [CALLER FILES, if known — otherwise: "unknown; treat the signature as
frozen"]. Do not assume test coverage exists.
```

**T** — pin the language, framework, and dependency policy:

```text
Language/framework: TypeScript 5, no new npm packages. Use workspace context if available
to check callers; do not invent APIs that aren't in the project.
```

**A** — end with something a machine can settle, not an opinion:

```text
Before answering, verify: the public signature is byte-identical; every code path in the
original exists in the refactor (including error paths). If the project has tests for this
file, state the command to run them.
```

Worked example: [copilot-refactor.md](../../examples/copilot-refactor.md).

---

## Claude

Long context is the strength: paste the whole document rather than a summary of it, and let
**S** carve out what matters. Claude follows negative constraints ("no style comments unless
they cause a bug") closely, so spend the rules budget in **I** on exclusions.

**S** — give it a way to flag what it cannot see instead of guessing:

```text
Do not assume tests, callers, or infrastructure you cannot see — if a defect depends on
unseen code, mark it "needs caller check".
```

**V** — cap the output, or a thorough model will be thorough: `Max findings: 10, most
severe first`.

Worked example: [claude-code-review.md](../../examples/claude-code-review.md).

---

## ChatGPT

General purpose. Tune **T** to the features actually enabled in the session (browsing, code
interpreter, file upload) rather than assuming them.

For content work the load falls on **S** and **V**: pin the product facts so the copy cannot
acquire features you do not have, and make every "make it good" into a number or a named
audience.

```text
Product facts (use only these): the app is called [NAME]; it auto-builds project timelines
from a task list; free tier up to 5 users. Do not assume features, pricing, or integrations
beyond the above.
```

Worked example: [chatgpt-marketing-email.md](../../examples/chatgpt-marketing-email.md).

---

## Gemini

Grounded search may or may not be active, so **T** has to handle both branches explicitly —
this is the single most common way a Gemini answer goes quietly stale:

```text
Use web/search grounding if available; cite each source with its date. If browsing is
unavailable, state your knowledge cutoff explicitly in N and mark every claim as
"as of [cutoff]". Never fabricate citations.
```

Strong on multimodal input: if you are attaching images or PDFs, name them in **S** the way
you would name a document.

Worked example: [gemini-research-brief.md](../../examples/gemini-research-brief.md).

---

## Grok

Fast and informal by default, which is exactly what a social or short-form task wants — and
exactly what needs bounding. Put the banned register in **I**, not in **V**:

```text
Rules: no "🚀 excited to announce"; no engagement-bait ("RT if..."); lead with what the
reader gets, not what we did.
```

**V** — hard character limits and a variant count, with the count shown per variant so the
limit is self-verifying:

```text
- Length: ≤ 280 characters for the post itself
- Deliver 3 variants
```

Worked example: [grok-social-post.md](../../examples/grok-social-post.md).

---

## No platform named

Keep it platform-agnostic: no capability assumptions in **T** beyond "don't fabricate", and
no instruction that depends on tools existing.

```text
Do not use outside knowledge or browsing. Do not fabricate figures the source does not
contain.
```

Worked example: [generic-summarize.md](../../examples/generic-summarize.md).

---

## Quick reference

| Platform | S names | T allows / forbids | V watch out for |
|---|---|---|---|
| Perplexity | search scope + recency window | live search required; cite only retrieved pages | "unverified" marker |
| Copilot | workspace files, unseen callers | language, framework, no new deps | helper count, comment policy |
| Claude | pasted material; flag for the unseen | no browsing unless enabled | cap findings; no praise padding |
| ChatGPT | pinned product facts | only the features enabled this session | measurable limits, named audience |
| Gemini | dated, verifiable sources | search-if-available, else declare cutoff | separate operating from announced |
| Grok | fact list, no metrics | no trends, no invented quotes | character limit, variant count |
| None | pasted material only | no browsing, no fabrication | length and tone as numbers/names |
