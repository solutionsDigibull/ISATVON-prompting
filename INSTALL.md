# Installing ISATVON Prompting

## Zero-install (any platform)

No agent needed: copy [templates/prompt-template.md](templates/prompt-template.md) into
ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, or any other AI chat and replace the
placeholders. That's the whole framework.

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

Zip the same four items (`SKILL.md`, `templates/`, `references/`, `examples/`) and upload
the archive via **Settings → Capabilities → Skills**.

## Verify

Start a new session and try a trigger prompt:

> Convert this into an ISATVON prompt for Perplexity: "what are the best CRM tools right now?"

The agent should follow SKILL.md: fill all seven sections, embed the ISATVON response
structure in O, tailor S/T to Perplexity's search capabilities, and emit one
copy-pasteable prompt block.
