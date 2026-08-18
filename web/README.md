# ISATVON website

Next.js (App Router) site for the ISATVON prompting framework.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

The Prompt Converter needs a Groq API key. Put it in `web/.env.local`:

```text
GROQ_API_KEY=gsk_...
```

Without it the site works fully; only live conversion returns an error.

## Content is generated, not written here

The templates and example conversions the site renders are parsed from the markdown at
the repo root (`templates/`, `examples/`) into `lib/generated/content.ts` — never edit
that file, and never re-type prompt text into a component.

```bash
npm run content        # regenerate after editing the markdown
npm run content:check  # fail if the committed output is stale (CI + pre-commit)
```

## Checks

```bash
npm run test:run       # vitest: framework, lib, api, component tests
npm run test:e2e       # playwright (stubs /api/convert, never calls Groq)
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm run lint:md        # markdownlint across the whole repo
```

## Deploy (Vercel)

- Set the project **Root Directory** to `web`.
- Add the `GROQ_API_KEY` environment variable.
- Confirm the production domain in `app/config.ts` (`SITE_URL`) — used for
  metadata, sitemap and robots.
