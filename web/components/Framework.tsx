// Shared framework visuals: the 4-step pipeline and the 7-section card grid.
// Used on the homepage and the /how-it-works page.

const SECTIONS = [
  ["I", "Instructions", "Role, task and non-negotiable instructions.", "The task as the AI understood it."],
  ["S", "Source", "Approved sources and information the AI must not invent.", "The sources actually used."],
  ["A", "Automation", "Workflow steps, checks and self-verification requirements.", "How the result was produced and verified."],
  ["T", "Tech Stack", "Allowed, required and prohibited tools.", "The tool policy followed during execution."],
  ["V", "Variables", "Length, tone, audience, format, language, depth and fallback rules.", "Constraints followed, missed or modified, with reasons."],
  ["O", "Outcome", "The required output structure and acceptance criteria.", "The completed deliverable."],
  ["N", "Notification", "Assumption, confidence and omission reporting requirements.", "Assumptions, confidence levels, missing inputs and limitations."],
];

// matches the old nth-child(2n)/nth-child(3n) accent cycle
function letterBg(i: number) {
  if ((i + 1) % 3 === 0) return "bg-ink";
  if ((i + 1) % 2 === 0) return "bg-secondary";
  return "bg-primary";
}

export function SevenGrid() {
  return (
    <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-7">
      {SECTIONS.map(([letter, name, prompt, response], i) => (
        <div className="b-card b-card-hover p-6" key={letter}>
          <div className="dots top-2 right-2"></div>
          <div className="flex items-center gap-3.5 mb-3.5">
            <span
              className={`${letterBg(i)} font-display text-[2.2rem] leading-none text-white border-brutal shadow-brutal-sm w-[54px] h-[54px] grid place-items-center shrink-0`}
            >
              {letter}
            </span>
            <h3 className="text-[1.6rem]">{name}</h3>
          </div>
          <dl className="grid gap-2 text-[0.9rem]">
            <dt className="font-display text-[0.85rem] tracking-[0.1em] bg-yellow border-2 border-ink w-fit px-2">
              In the prompt
            </dt>
            <dd className="text-ink-soft">{prompt}</dd>
            <dt className="font-display text-[0.85rem] tracking-[0.1em] bg-yellow border-2 border-ink w-fit px-2">
              In the response
            </dt>
            <dd className="text-ink-soft">{response}</dd>
          </dl>
        </div>
      ))}
    </div>
  );
}

const STEPS = [
  ["Start With a Raw Prompt", "Write your task in normal language. It can be short, rough or incomplete."],
  ["Structure It With ISATVON", "Organise the request into seven sections covering instructions, sources, execution methods, tools, variables, outcomes and reporting requirements."],
  ["Use Your Preferred AI Tool", "Paste the structured prompt into ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok or another capable AI platform."],
  ["Review a Transparent Response", "The AI response should explain what it understood, which sources it used, how it verified the work and what assumptions it made."],
];

export function Pipeline() {
  return (
    <div className="mt-11 flex items-stretch flex-wrap justify-center">
      {STEPS.map(([title, text], i) => (
        <span key={title} className="contents">
          {i > 0 && (
            <div className="self-center font-display text-[2.4rem] text-yellow px-4 max-[900px]:rotate-90 max-[900px]:px-0 max-[900px]:py-2.5">
              →
            </div>
          )}
          <div className="bg-white text-ink border-brutal shadow-[6px_6px_0_var(--color-primary)] px-[22px] py-5 max-w-[250px] flex-[1_1_210px]">
            <h3 className="text-[1.4rem] mb-2">{title}</h3>
            <p className="text-[0.85rem] text-[#444] leading-normal">{text}</p>
          </div>
        </span>
      ))}
    </div>
  );
}
