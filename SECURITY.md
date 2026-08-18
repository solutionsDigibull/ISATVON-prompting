# Security Policy

## Scope

This repository is mostly markdown — a prompting framework, templates, and examples. The
parts with an attack surface are:

- **`web/`** — the Next.js site deployed at [isatvon.ai](https://www.isatvon.ai)
- **`POST /api/convert`** — a public, unauthenticated endpoint that proxies to Groq
- **`GET /api/templates`** — a public, read-only endpoint serving generated content

Prompts submitted to `/api/convert` are forwarded to Groq for conversion and are not stored
by this project. Product metrics are bucketed and never include prompt text — see
[the privacy page](https://www.isatvon.ai/privacy).

## Supported versions

The framework ships from `main`; only the latest tag is supported. Fixes land on `main` and
go out in the next release rather than being backported.

## Reporting a vulnerability

Email **<security@digibull.ai>** with:

- what you found and where (URL, endpoint, or file),
- the steps to reproduce it,
- what an attacker could do with it.

Please do not open a public issue for anything exploitable.

We aim to acknowledge within 3 working days and to ship a fix or a mitigation within 30
days. We will credit you in the changelog unless you would rather stay anonymous, and we
ask that you hold public disclosure for 90 days or until a fix ships, whichever is sooner.

## Known limits, by design

- **The rate limit on `/api/convert` is per serverless instance** (`web/lib/rate-limit.ts`).
  It bounds a single noisy client, not a distributed one. Reports of *distributed* abuse are
  useful; "the limit resets across instances" is a documented trade-off, not a finding.
- **Converted prompts are model output.** ISATVON reduces fabrication by requiring
  verification and source boundaries; it does not make a model's output trustworthy on its
  own. Do not treat a converted prompt or a model's answer as validated input to anything
  security-sensitive.
- **No authentication or accounts.** There is nothing to log into and no user data to leak.
