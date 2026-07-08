# Contributing to ISATVON Prompting

Thanks for your interest!

## Ways to contribute

- **Example conversions** — the most valuable contribution. Add a file to `examples/`
  following the existing shape: **Raw prompt** → **ISATVON prompt** (all seven sections,
  in order, with the response-format skeleton embedded in O) → **Why it's better**
  (3 bullets). Real, mediocre raw prompts convert better than strawmen.
- **Reference improvements** — sharper good/weak examples in
  `references/prompting-guide.md`, platform-tailoring notes, framework comparisons.
- **SKILL.md improvements** — better trigger phrasing or procedure steps.

This repo is markdown only — no build step, no dependencies, no CI. The ISATVON
specification itself lives in [isatvon/isatvon](https://github.com/isatvon/isatvon);
spec changes go there.

## Pull requests

1. Keep changes focused; one topic per PR.
2. Every example must contain all seven `## X —` sections in I-S-A-T-V-O-N order.
3. Prompts must be platform-honest: don't require capabilities (search, code) the named
   platform lacks.

By contributing you agree your contributions are licensed under Apache 2.0.
