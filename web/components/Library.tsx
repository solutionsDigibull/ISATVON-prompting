"use client";

import { useState } from "react";
import Converter from "./Converter";

const panelCls = "hidden data-[active=true]:block data-[active=true]:motion-safe:animate-pane-in";
const tabPaneCls = "hidden data-[active=true]:block data-[active=true]:motion-safe:animate-pane-in";
const codeCardCls = "b-card mb-8";
const codeHeadCls =
  "flex items-center justify-between gap-3 bg-ink text-white border-b-[3px] border-ink px-4 py-2.5 font-display text-base tracking-[0.1em]";
const preCls = "p-[22px] overflow-x-auto text-[0.83rem] leading-relaxed bg-white whitespace-pre-wrap break-words";
const whyCardCls = "b-card p-[22px] bg-yellow";
const whyListCls =
  "list-none grid gap-2.5 text-[0.92rem] [&>li]:relative [&>li]:pl-6 [&>li]:before:content-['→'] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:font-extrabold";

function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState("Copy");
  return (
    <button
      className="copy-btn"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setLabel("Copied!");
        } catch {
          setLabel("Ctrl+C");
        }
        setTimeout(() => setLabel("Copy"), 1600);
      }}
    >
      {label}
    </button>
  );
}

const FULL_TEMPLATE = `## I — Instructions

You are [ROLE — e.g. "a senior financial analyst"]. Your task: [ONE IMPERATIVE SENTENCE].
Rules: [THE NON-NEGOTIABLES — e.g. "no jargon; never invent figures; British English"].

## S — Source

Use only the following context and inputs: [PASTE DATA / DESCRIBE DOCUMENTS / NAME URLS].
Do not assume: [WHAT THE MODEL MUST NOT FILL IN FROM ITS OWN KNOWLEDGE].

## A — Automation

Work in these steps:
1. [STEP 1]
2. [STEP 2]
3. [STEP N]
Before answering, verify: [SELF-CHECK — e.g. "every claim traces back to S; the word count in V is met"]. If verification fails, revise once, then report the failure in N.

## T — Tech stack

You may use: [ALLOWED CAPABILITIES — e.g. "web search limited to 2025–2026 sources"].
You must not: [FORBIDDEN — e.g. "fabricate citations; run code; browse"].

## V — Variables

- Length: [e.g. "max 300 words"]
- Tone: [e.g. "direct, no hype"]
- Audience: [e.g. "CFO, non-technical"]
- Format limits: [e.g. "no tables; bullets only in O"]
- Fallback: if any constraint cannot be met, say which and why. Ask at most 1 clarifying question, and only if the task is impossible without it. (If the deliverable itself is unknowable, asking first takes precedence over filling sections with invented defaults.)

## O — Outcome

Structure your entire response in ISATVON format:

- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: [EXACT SHAPE — e.g. "a 3-paragraph brief with a one-line recommendation"]
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification

In your N section, always state: every assumption you made, your confidence level and why,
and anything requested that you could not deliver.`;

const LITE_TEMPLATE = `## I — Instructions

You are [ROLE]. Your task: [ONE IMPERATIVE SENTENCE].
Rules: never invent figures or citations; if the task is impossible as stated, ask 1 clarifying question instead of guessing.

## O — Outcome

Structure your response as:

- **I** — the task as you understood it (1 sentence)
- **O** — the answer itself: [EXACT SHAPE — e.g. "the final number with 2–3 lines of working"]
- **N** — assumptions made, confidence (high/medium/low)

## N — Notification

In your N section, state every assumption you made and your confidence level.`;

type Example = {
  id: string;
  side: string;
  chip: string;
  title: string;
  sub: string;
  raw: string;
  prompt: string;
  why: string[];
};

const EXAMPLES: Example[] = [
  {
    id: "generic",
    side: "Generic: Summarize",
    chip: "Summarize a report…",
    title: "Generic: Summarize a document",
    sub: "Any platform. The classic vague ask, made checkable.",
    raw: "Summarize this report for me, keep it short.",
    prompt: `## I — Instructions
You are an executive briefing writer. Your task: summarize the report below for a
decision-maker who has 2 minutes. Rules: no information that is not in the report;
lead with the single most consequential finding.

## S — Source
Use only the report pasted below. Do not assume anything about the company, market,
or time period beyond what the report states.

[PASTE REPORT]

## A — Automation
Work in these steps:
1. List the report's claims and findings.
2. Rank them by consequence to a decision-maker.
3. Draft the summary from the top-ranked items.
Before answering, verify: every sentence in your summary traces to a specific passage
in S; the length limit in V is met. If verification fails, revise once, then report
the failure in N.

## T — Tech stack
Do not use outside knowledge or browsing. Do not fabricate figures the report
does not contain.

## V — Variables
- Length: max 150 words for the summary itself
- Tone: neutral, declarative
- Audience: senior executive, non-specialist
- Fallback: if any constraint cannot be met, say which and why. Ask at most 1
  clarifying question, and only if the task is impossible without it.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: a bold one-line key finding, then one paragraph (max 150 words total)
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, and anything requested that you could not deliver.`,
    why: [
      '"Keep it short" became measurable (150 words) with a declared fallback instead of a silent guess.',
      "The verification step in A stops the model padding the summary with plausible facts the report never stated.",
      "The ISATVON response structure shows whether the model understood the task (I) before you read a word of the summary.",
    ],
  },
  {
    id: "chatgpt",
    side: "ChatGPT: Marketing email",
    chip: "Write a marketing email…",
    title: "ChatGPT: Marketing email",
    sub: "Pin the product facts so the email can't acquire imaginary features.",
    raw: "Write a marketing email for our new project management app.",
    prompt: `## I — Instructions
You are a direct-response copywriter. Your task: write one launch email for our project
management app. Rules: one idea per email; no buzzwords ("revolutionary", "game-changing",
"seamless"); the reader's problem comes before the product.

## S — Source
Product facts (use only these): the app is called [NAME]; it auto-builds project timelines
from a task list; free tier up to 5 users; launches [DATE]. Audience: team leads at
companies of 10–200 people who currently plan in spreadsheets.
Do not assume features, pricing, or integrations beyond the above.

## A — Automation
Work in these steps:
1. State the reader's spreadsheet pain in their words.
2. Present the one feature (auto-timelines) as the resolution.
3. Close with a single CTA to the free tier.
Before answering, verify: every product claim appears in S; the subject line is under
50 characters; there is exactly one CTA. If verification fails, revise once, then report
the failure in N.

## T — Tech stack
Do not browse. Do not invent statistics, testimonials, or customer names.

## V — Variables
- Length: subject ≤ 50 characters; body 120–170 words
- Tone: plain, confident, second person
- Audience: busy team leads, skim readers
- Format: short paragraphs, no bullet lists in the email body
- Fallback: if any constraint cannot be met, say which and why. Ask at most 1
  clarifying question, and only if the task is impossible without it.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: SUBJECT: line, then the email body, then CTA button text
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, and anything requested that you could not deliver.`,
    why: [
      "S pins the product facts, so the email can't acquire imaginary features or fake testimonials, the most common failure of marketing prompts.",
      'The banned-buzzword rule in I and the measurable limits in V replace "make it good" with checkable requirements.',
      "A's verification (claims in S, subject ≤ 50 chars, one CTA) runs before you ever see the draft.",
    ],
  },
  {
    id: "claude",
    side: "Claude: Code review",
    chip: "Review this code…",
    title: "Claude: Code review",
    sub: '"Is it good?" invites vague praise. This restricts the review to defects with line citations.',
    raw: "Can you review this code and tell me if it's good?",
    prompt: `## I — Instructions
You are a senior engineer reviewing a pull request. Your task: review the diff below for
defects only. Rules: cite the exact line for every finding; no style or naming comments
unless they cause a bug; severity on every finding.

## S — Source
Use only the diff pasted below and the stated context: [LANGUAGE/FRAMEWORK, e.g. "Python
3.12, FastAPI service handling payments"]. Do not assume tests, callers, or infrastructure
you cannot see — if a defect depends on unseen code, mark it "needs caller check".

[PASTE DIFF]

## A — Automation
Work in these steps:
1. Trace each changed function's inputs to outputs, noting unhandled paths.
2. Check boundaries: null/empty inputs, error handling, concurrency, injection.
3. Rank findings by severity.
Before answering, verify: every finding names a line number that exists in the diff and
describes a concrete failure scenario, not a preference. Drop any finding that fails this.

## T — Tech stack
Do not run code or browse. Reason from the diff alone; say so when the diff is
insufficient to confirm a defect.

## V — Variables
- Severity scale: critical / major / minor
- Max findings: 10, most severe first
- Tone: direct, no praise padding
- Fallback: if the diff is too incomplete to review a section, say which lines and why.
  Ask at most 1 clarifying question.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: a findings list — \`severity | file:line | defect | failure scenario\` — or "no defects found"
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, and anything requested that you could not deliver.`,
    why: [
      '"Is it good?" invited vague praise; I restricts the review to defects with line citations and severity.',
      "A's verification kills the classic failure mode: findings that are stylistic preferences dressed as bugs.",
      "S's \"needs caller check\" rule makes the model flag what it can't see instead of guessing about unseen callers.",
    ],
  },
  {
    id: "gemini",
    side: "Gemini: Research brief",
    chip: "Research a topic…",
    title: "Gemini: Research brief",
    sub: "Handles both grounded-search and knowledge-cutoff modes explicitly.",
    raw: "Tell me about the current state of small modular reactors.",
    prompt: `## I — Instructions
You are an energy-sector analyst. Your task: produce a research brief on the current state
of small modular reactors (SMRs). Rules: distinguish operating plants from announced
projects; every figure gets a source; no vendor marketing language.

## S — Source
Ground the brief in verifiable, dated developments. Prioritize regulator announcements
(NRC, IAEA), operator statements, and financial filings over press releases. Do not
assume a project is on schedule without a dated source saying so.

## A — Automation
Work in these steps:
1. Establish what is actually operating today, with dates.
2. List the major projects in licensing or construction, with status and expected dates.
3. Summarize the main obstacles (cost, licensing, supply chain).
Before answering, verify: every project named has a status and a date; no figure lacks a
source; operating vs announced are never mixed in one claim. If verification fails,
revise once, then report the failure in N.

## T — Tech stack
Use web/search grounding if available; cite each source with its date. If browsing is
unavailable, state your knowledge cutoff explicitly in N and mark every claim as
"as of [cutoff]". Never fabricate citations.

## V — Variables
- Length: max 500 words
- Tone: neutral analyst, no advocacy for or against nuclear
- Audience: policy staffer, technically literate but not a nuclear engineer
- Fallback: if any constraint cannot be met, say which and why. Ask at most 1
  clarifying question.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: three headed sections — Operating today / In the pipeline / Obstacles — then a 2-sentence outlook
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, anything requested you could not deliver, and your knowledge cutoff if you could
not browse.`,
    why: [
      "The operating-vs-announced rule targets the single biggest error in SMR coverage: reporting announcements as reality.",
      "T handles both Gemini modes (grounded search with dated citations, or an explicit knowledge-cutoff disclaimer) instead of letting stale claims pass as current.",
      '"Tell me about X" became a fixed three-section deliverable with a word cap, so reruns are comparable.',
    ],
  },
  {
    id: "perplexity",
    side: "Perplexity: Market research",
    chip: "Compare tools…",
    title: "Perplexity: Market research",
    sub: '"Best right now" becomes "best fit for this buyer, verified against sources ≤ 12 months old".',
    raw: "What are the best project management tools right now?",
    prompt: `## I — Instructions
You are a software procurement researcher. Your task: compare current project management
tools for a specific buyer (defined in S). Rules: "best" means best fit for that buyer,
not most popular; every price and feature claim needs a cited source.

## S — Source
Buyer profile: a 40-person consultancy, budget ≤ $15/user/month, must have Gantt views
and guest client access. Search scope: vendor pricing pages, credible review sites, and
sources from the last 12 months only. Do not assume pricing from memory — pricing changes;
verify it.

## A — Automation
Work in these steps:
1. Shortlist tools that plausibly meet the buyer's three requirements.
2. Verify each requirement per tool against a current cited source.
3. Eliminate tools failing any requirement; rank the rest by fit.
Before answering, verify: every cell in your comparison has a citation; no source is
older than 12 months; eliminated tools are listed with the failed requirement. If
verification fails, revise once, then report the failure in N.

## T — Tech stack
Use live web search — this task is invalid without it. Cite every source inline with
its date. Never cite a page you did not retrieve.

## V — Variables
- Compare at most 5 finalists
- Tone: neutral, no affiliate-style enthusiasm
- Audience: operations lead making a purchase decision
- Fallback: if a requirement can't be verified for a tool, mark it "unverified" rather
  than guessing. Ask at most 1 clarifying question.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: a comparison table (tool | price | Gantt | guest access | source+date), then a one-paragraph recommendation, then the eliminated list
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, and any requirement you could not verify from current sources.`,
    why: [
      '"Best right now" became "best fit for this buyer, verified against sources ≤ 12 months old". That recency window is exactly what Perplexity is for.',
      "The eliminate-with-reason step surfaces why tools dropped out, which is half the value of procurement research.",
      '"Unverified" as a required marker beats confidently stale pricing copied from training data.',
    ],
  },
  {
    id: "copilot",
    side: "Copilot: Refactor",
    chip: "Refactor a function…",
    title: "Copilot: Refactor",
    sub: '"Too long" becomes a testable contract: identical signature, all paths preserved.',
    raw: "Refactor this function, it's too long.",
    prompt: `## I — Instructions
You are a senior engineer refactoring production code. Your task: split the function
below into smaller functions without changing behavior. Rules: no behavior change, no
new dependencies, no renaming of the public entry point; keep the file's existing style.

## S — Source
The function and its file context are in the editor selection / attached file:
[FILE PATH]. Its callers are in [CALLER FILES, if known — otherwise: "unknown; treat the
signature as frozen"]. Do not assume test coverage exists.

## A — Automation
Work in these steps:
1. Identify the function's distinct responsibilities.
2. Extract each into a private helper with a single purpose.
3. Keep the original function as a thin orchestrator with the same signature.
Before answering, verify: the public signature is byte-identical; every code path in the
original exists in the refactor (including error paths); no helper is called from only
a comment. If the project has tests for this file, state the command to run them.

## T — Tech stack
Language/framework: [e.g. "TypeScript 5, no new npm packages"]. Use workspace context if
available to check callers; do not invent APIs that aren't in the project.

## V — Variables
- Max helpers: 5 — more means the split is wrong, say so instead
- Comments: only where the original had them or a non-obvious constraint needs stating
- Fallback: if behavior-preserving extraction isn't possible for some path (e.g. tangled
  state), leave that path inline and explain in N. Ask at most 1 clarifying question.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: the full refactored code block, then the test command to verify behavior
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made (especially about unseen
callers), your confidence level and why, and any path you left unrefactored.`,
    why: [
      '"Too long" became a testable contract: identical signature, all paths preserved, ≤ 5 helpers, no new dependencies.',
      "S's \"signature frozen\" default protects unseen callers, which is how refactors actually break production.",
      "The response must end with the command that proves behavior held, not just prettier code.",
    ],
  },
  {
    id: "grok",
    side: "Grok: Social post",
    chip: "Announce a launch…",
    title: "Grok: Social post",
    sub: '"Viral" is not a writable instruction. This replaces it with the mechanics that earn shares.',
    raw: "Write a viral post about our AI framework launch.",
    prompt: `## I — Instructions
You are a developer-audience social writer. Your task: write one X/Twitter post announcing
the open-source launch of [FRAMEWORK NAME]. Rules: no "🚀 excited to announce"; no
engagement-bait ("RT if..."); lead with what the reader gets, not what we did.

## S — Source
Facts (use only these): [FRAMEWORK NAME] is an open-source framework that [ONE-LINE VALUE,
e.g. "turns any prompt into a structured, auditable contract"]; Apache-2.0; repo at
[URL]; works with any AI platform. Do not invent stars, users, benchmarks, or endorsements.

## A — Automation
Work in these steps:
1. State the pain the target developer has today, in one line.
2. Present the framework as the fix, in one line.
3. Close with the repo link.
Before answering, verify: the post is within the length limit in V; every claim appears
in S; the banned phrases in I are absent. If verification fails, revise once, then
report the failure in N.

## T — Tech stack
Do not browse or pull real-time trends. Do not fabricate metrics or quote real people.

## V — Variables
- Length: ≤ 280 characters for the post itself
- Tone: dry, confident, developer-to-developer; at most 1 emoji
- Audience: developers who are tired of prompt roulette
- Deliver 3 variants
- Fallback: if any constraint cannot be met, say which and why.

## O — Outcome
Structure your entire response in ISATVON format:
- **I** — the task as you understood it (1 sentence)
- **S** — the sources/context you actually used
- **A** — how you verified the result
- **V** — constraints honored; any broken, with reason
- **O** — the deliverable itself: 3 numbered post variants, each with its character count
- **N** — assumptions made, confidence (high/medium/low), anything skipped

## N — Notification
In your N section, always state: every assumption you made, your confidence level and
why, and anything requested that you could not deliver.`,
    why: [
      '"Viral" is not a writable instruction; the prompt replaces it with the mechanics that earn shares: pain, fix, link, and no announcement clichés.',
      "S's fact list means no invented star counts or fake endorsements, the fastest way to torch a launch.",
      "Per-variant character counts in O make the 280 limit self-verifying instead of hoped-for.",
    ],
  },
];

const REFS = [
  ["Prompting guide", "references/prompting-guide.md"],
  ["COSTAR comparison", "references/costar-comparison.md"],
  ["Response format", "references/response-format.md"],
];

export default function Library() {
  const [panel, setPanel] = useState("template");
  const [tab, setTab] = useState<"full" | "lite">("full");

  function show(id: string) {
    setPanel(id);
    document.querySelector(".main")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="grid min-[900px]:grid-cols-[280px_1fr] min-h-[calc(100vh-68px)]">
      <aside className="bg-white border-b-[3px] min-[900px]:border-b-0 min-[900px]:border-r-[3px] border-ink px-5 py-7 min-[900px]:sticky min-[900px]:top-[68px] min-[900px]:h-[calc(100vh-68px)] min-[900px]:overflow-y-auto max-[900px]:grid max-[900px]:grid-cols-2 max-[900px]:gap-x-3.5 max-[900px]:gap-y-1 max-[900px]:items-start">
        <h4 className="font-display text-[0.95rem] tracking-[0.14em] text-[#777] mt-0 mb-2.5 max-[900px]:col-span-full">
          Templates
        </h4>
        <button
          className="side-link"
          data-active={panel === "template"}
          onClick={() => show("template")}
        >
          Template (Full + Lite)
        </button>
        <h4 className="font-display text-[0.95rem] tracking-[0.14em] text-[#777] mt-5 mb-2.5 max-[900px]:col-span-full">
          Example conversions
        </h4>
        {EXAMPLES.map((e) => (
          <button
            key={e.id}
            className="side-link"
            data-active={panel === e.id}
            onClick={() => show(e.id)}
          >
            {e.side}
          </button>
        ))}
        <h4 className="font-display text-[0.95rem] tracking-[0.14em] text-[#777] mt-5 mb-2.5 max-[900px]:col-span-full">
          References
        </h4>
        {REFS.map(([label, path]) => (
          <a
            key={path}
            className="side-link"
            href={`https://github.com/isatvon/isatvon-prompting/blob/main/${path}`}
            target="_blank"
            rel="noopener"
          >
            {label} ↗
          </a>
        ))}
      </aside>

      <main className="px-11 pt-12 pb-20 min-w-0 max-[900px]:px-5 max-[900px]:pt-9 max-[900px]:pb-[60px]">
        <div className="text-center mb-11">
          <span className="logo-mark display text-[2.2rem] inline-block mb-4.5 px-4 py-1.5">IS</span>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)]">Convert your prompt</h1>
          <p className="text-ink-mute mt-2.5">Paste a raw prompt and get it back in ISATVON structure. Edit, copy, regenerate.</p>

          <Converter />

          <div className="flex flex-wrap gap-3 justify-center mt-7 mb-12">
            {EXAMPLES.map((e) => (
              <button key={e.id} className="chip" onClick={() => show(e.id)}>
                {e.chip}
              </button>
            ))}
          </div>
        </div>

        <section className={panelCls} data-active={panel === "template"}>
          <h2 className="text-[2.2rem] mb-1.5">The ISATVON Template</h2>
          <p className="text-ink-mute mb-7 max-w-[680px]">
            Copy everything into any AI chat <strong>as your message</strong>, not into a
            system prompt or custom instructions. Replace the placeholders. Every section
            is required; supply a sensible default rather than deleting one.
          </p>

          <div className="flex w-fit border-brutal shadow-brutal-sm mb-6" role="tablist">
            <button
              className="font-display text-[1.05rem] tracking-[0.08em] bg-white border-r-2 border-ink last:border-r-0 px-6 py-2.5 cursor-pointer data-[active=true]:bg-primary data-[active=true]:text-white"
              data-active={tab === "full"}
              onClick={() => setTab("full")}
            >
              Full (7 sections)
            </button>
            <button
              className="font-display text-[1.05rem] tracking-[0.08em] bg-white border-r-2 border-ink last:border-r-0 px-6 py-2.5 cursor-pointer data-[active=true]:bg-primary data-[active=true]:text-white"
              data-active={tab === "lite"}
              onClick={() => setTab("lite")}
            >
              Lite (I + O + N)
            </button>
          </div>

          <div className={tabPaneCls} data-active={tab === "full"}>
            <div className={codeCardCls}>
              <div className={codeHeadCls}>
                <span>prompt-template.md</span>
                <CopyButton text={FULL_TEMPLATE} />
              </div>
              <pre className={preCls}>{FULL_TEMPLATE}</pre>
            </div>
          </div>
          <div className={tabPaneCls} data-active={tab === "lite"}>
            <div className={codeCardCls}>
              <div className={codeHeadCls}>
                <span>prompt-template-lite.md</span>
                <CopyButton text={LITE_TEMPLATE} />
              </div>
              <pre className={preCls}>{LITE_TEMPLATE}</pre>
            </div>
            <div className={whyCardCls}>
              <h3 className="text-[1.4rem] mb-3">When to use Lite</h3>
              <ul className={whyListCls}>
                <li>Self-contained reasoning, coding, or one-shot questions with no constraints to enforce and no external sources.</li>
                <li>The full 7 sections add cost without measurable quality gain there.</li>
                <li>If the task has constraints, sources, or a written deliverable, use the full template instead.</li>
              </ul>
            </div>
          </div>
        </section>

        {EXAMPLES.map((e) => (
          <section className={panelCls} data-active={panel === e.id} key={e.id}>
            <h2 className="text-[2.2rem] mb-1.5">{e.title}</h2>
            <p className="text-ink-mute mb-7 max-w-[680px]">{e.sub}</p>
            <div className="b-card mb-7">
              <div className="font-display text-base tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-red-brand text-white">
                Raw prompt
              </div>
              <blockquote className="px-5 py-4 text-[1.1rem] italic text-ink-soft">{e.raw}</blockquote>
            </div>
            <div className={codeCardCls}>
              <div className={codeHeadCls}>
                <span>ISATVON prompt</span>
                <CopyButton text={e.prompt} />
              </div>
              <pre className={preCls}>{e.prompt}</pre>
            </div>
            <div className={whyCardCls}>
              <h3 className="text-[1.4rem] mb-3">Why it&rsquo;s better</h3>
              <ul className={whyListCls}>
                {e.why.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
