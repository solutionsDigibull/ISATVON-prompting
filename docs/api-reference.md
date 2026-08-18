# API reference

Two public endpoints back the converter at [isatvon.ai](https://www.isatvon.ai). Both are
unauthenticated. The machine-readable version of this page is
[`web/public/openapi.yaml`](../web/public/openapi.yaml), served at
[`/openapi.yaml`](https://www.isatvon.ai/openapi.yaml).

Prompts sent to `/api/convert` are forwarded to Groq for conversion and are not stored by
this service.

---

## `POST /api/convert`

Rewrites a raw prompt into an ISATVON prompt.

### Request

```json
{ "raw": "Write a launch email for our new project management app." }
```

| Field | Type | Rules |
|---|---|---|
| `raw` | string | required, non-blank, ≤ 8000 characters |

### Response `200`

```json
{ "prompt": "## I — Instructions\n…" }
```

`prompt` is markdown: seven `## X — Name` sections, or the three-section Lite form when the
raw prompt is a self-contained one-shot question. The `X-RateLimit-Remaining` header carries
what is left of the current window.

### Errors

Every failure returns `{ "error": { "message": "…" } }`. The message is safe to show a user —
upstream bodies are logged server-side and never forwarded.

| Status | When |
|---|---|
| `400` | `raw` missing, blank, not a string, or over 8000 characters |
| `429` | Rate limit reached — see `Retry-After` |
| `500` | The server has no `GROQ_API_KEY` configured |
| `502` | Upstream failed, or returned a body that was not the expected shape |
| `504` | Upstream exceeded the 30-second timeout |

### Rate limit

10 requests per minute per client, keyed on the first `x-forwarded-for` hop. The counter
lives in the memory of a single serverless instance (`web/lib/rate-limit.ts`), so it bounds
one noisy client rather than a distributed one — a deliberate trade-off, recorded in
[SECURITY.md](../SECURITY.md).

### Example

```bash
curl -sX POST https://www.isatvon.ai/api/convert \
  -H 'Content-Type: application/json' \
  -d '{"raw":"summarize this report, keep it short"}' | jq -r .prompt
```

---

## `GET /api/templates`

The framework as JSON: both copy-paste templates and every example conversion. Generated
from the repository markdown at build time, so it can never disagree with `templates/` and
`examples/`.

### Response `200`

```json
{
  "templates": [
    { "id": "prompt-template", "file": "prompt-template.md",
      "sections": ["I","S","A","T","V","O","N"], "body": "## I — Instructions\n…" }
  ],
  "examples": [
    { "id": "claude", "title": "Claude — Code review", "platform": "Claude",
      "difficulty": "intermediate", "category": "engineering",
      "tags": ["code-review","severity","verification"],
      "raw": "Can you review this code and tell me if it's good?",
      "prompt": "## I — Instructions\n…", "why": ["…"],
      "source": "https://github.com/…/examples/claude-code-review.md" }
  ]
}
```

Cached for a day (`s-maxage=86400`), stale-while-revalidate for a week.

### Example

```bash
curl -s https://www.isatvon.ai/api/templates | jq -r '.templates[0].body'
```

---

## Using the prompt as data

The converter's **JSON** button copies the same structure the API would give you — the
prompt keyed by section:

```json
{ "I": "You are a…", "S": "Use only…", "A": "1. …", "T": "…", "V": "…", "O": "…", "N": "…" }
```

The parser behind it is exported for reuse: `parseSections` and `toPrompt` in
[`web/lib/isatvon/parse.ts`](../web/lib/isatvon/parse.ts), with the structural rules in
[`schema.ts`](../web/lib/isatvon/schema.ts).
