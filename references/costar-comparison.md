# ISATVON vs COSTAR

[COSTAR](https://towardsdatascience.com/how-i-won-singapores-gpt-4-prompt-engineering-competition-34c195a93d41)
(Context, Objective, Style, Tone, Audience, Response — Sheila Teo / GovTech Singapore)
structures the *ask*. ISATVON structures the ask **and the answer**, and adds three things
COSTAR has no slot for: a self-verification step, a tool policy, and constraints with
declared fallbacks.

## Mapping

| COSTAR | ISATVON | Notes |
|---|---|---|
| **C** — Context | **S** — Source | ISATVON adds the explicit "do not assume" boundary |
| **O** — Objective | **I** — Instructions | ISATVON adds role and hard rules alongside the objective |
| **S** — Style | **V** — Variables | Style becomes a measurable constraint with a fallback |
| **T** — Tone | **V** — Variables | Same |
| **A** — Audience | **V** — Variables | Same |
| **R** — Response | **O** — Outcome | ISATVON's O also requires the reply itself in ISATVON structure |
| *(no equivalent)* | **A** — Automation | Step order + self-verification before answering |
| *(no equivalent)* | **T** — Tech stack | Capabilities allowed/forbidden (search, code, citations) |
| *(no equivalent)* | **N** — Notification | Mandatory assumptions/confidence/omissions report |

## When to use which

- **COSTAR** is lighter and fine for one-shot stylistic tasks: a tweet, a rewrite, a tone
  change. Six sections, no ceremony.
- **ISATVON** earns its extra sections when the answer has to be *trustworthy*: research,
  analysis, code, anything where you need to know what the model assumed, what it used,
  and whether it checked itself. The structured response also makes outputs comparable
  across platforms and across reruns.

Rule of thumb: if you'd be annoyed to discover the model silently invented a fact or broke
a constraint, use ISATVON.
