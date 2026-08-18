# Governance

## Who decides

[DigiBull](https://digibull.ai) maintains this repository. Maintainers review and merge; the
final call on framework changes sits with them. Everything else — examples, references,
tutorials, tooling — is open to anyone, and contributed examples are the most welcome
contribution there is.

## What counts as a framework change

A change to **what a section means, what it must contain, or how many there are** is a
framework change. So is a change to the response contract in
[references/response-format.md](references/response-format.md), or to a claim the README
makes.

Everything else — wording, new examples, new guidance, tooling, the website — is an ordinary
change and needs nothing beyond review.

## Framework changes need evidence

The claims in this repo are benchmark-backed: the 4.70/5 vs 3.40 result on constraint-heavy
work, the finding that a system prompt scores *below* baseline, the observation that CO-STAR
outputs invented statistics where ISATVON's did not. That is the standard a change to the
framework has to meet.

A proposal to change the framework should say:

1. **What fails today.** A concrete prompt and a concrete bad answer — not a preference.
2. **Which failure class it belongs to** ([domain-model.md](references/domain-model.md)):
   fabrication, hidden assumption, silent constraint break, unverified output, misread task,
   scope creep.
3. **What the change is**, in the smallest form that fixes it.
4. **Evidence it works.** Same task, same model, before and after, more than once. Add the
   transcripts to [EVALS.md](EVALS.md).
5. **What it costs.** Every section is tokens someone pays for on every call.

Adding a section is the highest bar in the repo. Seven is already a lot to ask someone to
fill in; an eighth needs to earn its place against the option of sharpening an existing one.

## What is not up for debate

- **The prompt goes in the user message.** Tested, replicated, and it lost as a system
  prompt. A proposal to "just make it custom instructions" needs to beat that evidence.
- **Anti-fabrication and self-verification stay.** They are the two mechanisms that separate
  this from COSTAR.
- **The root stays dependency-free.** Zero-install is the point; tooling lives in `web/`.

## Review expectations

- One topic per pull request.
- CI must be green: content generation, markdown lint, tests, typecheck, lint, build, e2e.
- New examples: frontmatter, seven sections in order, and the checks in
  [docs/examples-guide.md](docs/examples-guide.md). Real prompts, not strawmen.
- Changes to `SKILL.md` must be copied to `web/public/isatvon-skill.md` — a test enforces it.
- Behaviour changes come with a test. "Tests pass" is not the same as "this is tested".
- Maintainers aim to respond within a week. A quiet PR is a busy maintainer, not a rejection —
  ping it.

## Releases

Semantic versioning, with the framework — not the website — as the thing being versioned.
Process and version policy: [RELEASING.md](RELEASING.md).

## Roadmap

Priorities, in order:

1. **More examples, broader.** Legal, finance, data analysis, support, education — the
   library is currently engineering- and marketing-heavy.
2. **More evals.** [EVALS.md](EVALS.md) has trigger transcripts; per-element ablations
   (which sections carry the gain, on which task types) would be worth more.
3. **Non-English prompts.** The framework is language-agnostic in principle and entirely
   untested in practice.
4. **Failure catalogue.** A reference of conversions that did *not* help, and why.

Suggestions belong in Discussions.

## Changing this document

Same process as a framework change: open an issue, make the case, get maintainer agreement.
