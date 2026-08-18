# Installing ISATVON Prompting

## Zero-install (any platform)

No agent needed: copy [templates/prompt-template.md](templates/prompt-template.md) into
ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, or any other AI chat and replace the
placeholders. That's the whole framework.

Self-contained one-shot question? Use
[templates/prompt-template-lite.md](templates/prompt-template-lite.md) instead. Walkthrough:
[docs/tutorials/first-prompt.md](docs/tutorials/first-prompt.md).

## In the browser

[isatvon.ai/prompting](https://www.isatvon.ai/prompting) — paste a raw prompt, get the
structured version back, edit it, copy it. Nothing to install.

## Claude Code (as an Agent Skill)

```bash
mkdir -p ~/.claude/skills/isatvon-prompting
cp -r SKILL.md templates references examples ~/.claude/skills/isatvon-prompting/
```

(Windows PowerShell: `New-Item -ItemType Directory -Force "$HOME\.claude\skills\isatvon-prompting"` then
`Copy-Item SKILL.md,templates,references,examples -Destination "$HOME\.claude\skills\isatvon-prompting" -Recurse -Force`.)

For a single project instead of your user profile, use `.claude/skills/isatvon-prompting/`
inside the project.

## Claude Desktop

Download `isatvon-prompting-skill.zip` from the
[latest release](https://github.com/solutionsDigibull/ISATVON-prompting/releases/latest) and
upload it via **Settings → Capabilities → Skills**. It contains `SKILL.md`, `templates/`,
`references/`, `examples/`, and `skill-registry.json`.

To build it yourself from a clone:

```bash
zip -r isatvon-prompting-skill.zip SKILL.md templates references examples skill-registry.json
```

## Other agents

The skill is plain markdown with YAML frontmatter, so anything that loads `SKILL.md` files
can use it. [`skill-registry.json`](skill-registry.json) — generated from `SKILL.md` — gives
a discovery layer the name, version, description, trigger phrases and file inventory in one
JSON document.

## Verify

Start a new session and try a trigger prompt:

> Convert this into an ISATVON prompt for Perplexity: "what are the best CRM tools right now?"

The agent should follow SKILL.md: fill all seven sections, embed the ISATVON response
structure in O, tailor S/T to Perplexity's search capabilities, and emit one
copy-pasteable prompt block.

Recorded transcripts of that check, including a negative case: [EVALS.md](EVALS.md).
