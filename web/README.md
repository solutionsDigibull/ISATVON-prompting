# ISATVON website

Next.js (App Router) site for the ISATVON prompting framework.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

The Prompt Converter needs a Groq API key. Put it in `web/.env.local`:

```
GROQ_API_KEY=gsk_...
```

Without it the site works fully; only live conversion returns an error.

## Deploy (Vercel)

- Set the project **Root Directory** to `web`.
- Add the `GROQ_API_KEY` environment variable.
- Confirm the production domain in `app/config.ts` (`SITE_URL`) — used for
  metadata, sitemap and robots.

## Pages

- `/` — homepage
- `/prompting` — prompt converter + template library (client components in `components/`)
- `/how-it-works`, `/isatvon-vs-costar` — framework docs
- `/privacy`, `/terms` — legal stubs
- `POST /api/convert` — Groq proxy for the converter
