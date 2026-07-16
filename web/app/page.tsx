import Link from "next/link";
import { GITHUB } from "./config";
import { Pipeline, SevenGrid } from "@/components/Framework";
import Reveal from "@/components/Reveal";

const faqs = [
  {
    q: "What is the ISATVON prompting framework?",
    a: "ISATVON is a seven-section framework for creating structured AI prompts. It defines instructions, sources, execution methods, tools, variables, outcomes and notification requirements such as assumptions and confidence.",
  },
  {
    q: "What does ISATVON stand for?",
    a: "ISATVON stands for Instructions, Source, Automation, Tech Stack, Variables, Outcome and Notification.",
  },
  {
    q: "Which AI platforms support ISATVON?",
    a: "ISATVON uses plain text, so it can be used with ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok and other AI systems that accept natural-language prompts.",
  },
  {
    q: "How is ISATVON different from COSTAR?",
    a: "COSTAR mainly structures the request. ISATVON also defines execution methods, tool-use policies, verification requirements, measurable constraints and structured reporting of assumptions and confidence.",
  },
  {
    q: "Does ISATVON prevent AI hallucinations?",
    a: "No framework can guarantee that. ISATVON reduces the risk by establishing source boundaries, requiring verification and making unsupported assumptions more visible.",
  },
  {
    q: "Is ISATVON free?",
    a: "Yes. ISATVON is an open framework released under the Apache 2.0 licence. It is free to use, adapt and share.",
  },
  {
    q: "Do I need to install anything?",
    a: "No installation is required to use the basic framework. The template can be copied as plain text or markdown and used with an existing AI platform.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const PLATFORMS = ["ChatGPT", "Claude", "Gemini", "Perplexity", "Copilot", "Grok"];

const STRUCTURE_ROWS = [
  ["I", "Clear Instructions", "Define the AI’s role, exact task and non-negotiable rules before execution begins."],
  ["S", "Grounded Sources", "Specify the documents, data or references the AI may use and what it must not invent or assume."],
  ["A", "Verifiable Execution", "Define the workflow, checks and self-verification steps required before the final response."],
  ["T", "Controlled Tool Use", "State which tools, integrations and capabilities are allowed, required or prohibited."],
  ["V", "Measurable Constraints", "Set clear requirements for length, audience, tone, language, format, depth and fallback behaviour."],
  ["O", "Defined Outcomes", "Describe the exact deliverable instead of allowing the AI to choose its own response structure."],
  ["N", "Visible Assumptions", "Require the AI to disclose uncertainty, missing information, assumptions and confidence levels."],
];

const MOCK_ROWS = [
  ["I", "Instructions:", "role, task, hard rules"],
  ["S", "Source:", "context to use, gaps not to fill"],
  ["A", "Automation:", "method + self-verification"],
  ["T", "Tech stack:", "tools allowed & forbidden"],
  ["V", "Variables:", "measurable limits + fallback"],
  ["O", "Outcome:", "the exact response contract"],
  ["N", "Notification:", "assumptions & confidence report"],
];

const RESPONSE_ROWS = [
  ["I", "The task as understood"],
  ["S", "The sources actually used"],
  ["A", "The execution and verification method"],
  ["V", "The constraints followed"],
  ["O", "The final deliverable"],
  ["N", "The assumptions, omissions and confidence level"],
];

const FAILURES = [
  "irrelevant or incomplete responses",
  "unsupported claims",
  "invented details",
  "hidden assumptions",
  "inconsistent formatting",
  "repeated correction prompts",
];

const BENEFITS: [string, string, string][] = [
  ["min-[900px]:col-span-4 bg-yellow", "Reduce Misunderstood Tasks", "The model restates the assignment, making incorrect interpretation easier to identify."],
  ["min-[900px]:col-span-2", "Reduce Unsupported Claims", "Explicit source boundaries reduce the likelihood of invented facts and untraceable statements."],
  ["min-[900px]:col-span-2", "Reduce Repetitive Prompt Revisions", "Clear constraints and deliverables reduce the need for repeated correction prompts."],
  ["min-[900px]:col-span-4 bg-primary text-white [&_p]:text-[#ffe4da]", "Improve Output Consistency", "Teams can apply the same prompting structure across departments, projects and AI platforms."],
  ["min-[900px]:col-span-3", "Improve AI Quality Control", "Verification steps, source reporting and assumption disclosure make responses easier to audit."],
  ["min-[900px]:col-span-3", "Avoid AI Platform Lock-In", "ISATVON works as portable plain text instead of tying your workflow to one AI product."],
];

const USE_CASES: [string, string, string[]][] = [
  ["Research and Analysis", "Define approved sources, research boundaries, comparison criteria and citation requirements.", ["Market research", "Competitor analysis", "Policy reviews", "Executive briefs", "Research summaries"]],
  ["Content and Marketing", "Control the target audience, tone, keywords, structure, factual grounding and call to action.", ["Website content", "Blogs and articles", "Campaign copy", "Social media content", "Product messaging", "SEO and content briefs"]],
  ["Software Development", "Specify the development environment, permitted libraries, coding standards, testing requirements and expected output.", ["Code generation", "Debugging", "Code review", "Refactoring", "Technical documentation", "Test planning"]],
  ["Business Operations", "Turn unclear business requests into repeatable AI-assisted workflows.", ["SOP creation", "Proposals", "Meeting summaries", "Process documentation", "Internal reports", "Operational checklists"]],
  ["Data Analysis and Reporting", "Define datasets, calculation rules, validation checks and reporting formats.", ["KPI analysis", "Dashboard summaries", "Data interpretation", "Management reports", "Performance reviews"]],
  ["AI Agents and Automation", "Use ISATVON as a human-readable specification before converting the workflow into stricter machine-executable instructions.", ["Agent instructions", "Tool policies", "Workflow planning", "Pre-execution validation", "Automation specifications"]],
];

const MARQUEE_ITEMS = [...PLATFORMS, ...USE_CASES.map(([name]) => name)];

const VS_ROWS: [string, string][] = [
  ["S| Source", "Explicit source boundaries"],
  ["A| Automation", "Execution and verification methods"],
  ["T| Tech Stack", "Tool-use policies"],
  ["V| Variables", "Measurable constraints and fallback rules"],
  ["O| Outcome", "A defined response contract"],
  ["N| Notification", "Assumption and confidence reporting"],
];

const STATS: [string, string, string, string][] = [
  ["7", "text-primary", "Structured Sections", "One framework covering both prompt construction and response reporting."],
  ["0", "text-secondary", "Required Dependencies", "Use ISATVON as markdown or plain text without installing another platform."],
  ["6+", "text-ink", "AI Platforms", "Use the same structure with ChatGPT, Claude, Gemini, Perplexity, Copilot and Grok."],
  ["100%", "text-primary", "Open Source", "Inspect the framework, adapt it to your workflow and contribute through GitHub."],
];

const CHIPS = [
  "Report summarisation",
  "Market research",
  "Code review",
  "Content creation",
  "Tool comparison",
  "Software refactoring",
  "Product launch planning",
  "Business analysis",
];

const squareList =
  "list-none grid gap-2.5 [&>li]:relative [&>li]:pl-[26px] [&>li]:before:content-['■'] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:text-primary";
const arrowList =
  "mt-3 list-none grid gap-2 text-[0.9rem] [&>li]:relative [&>li]:pl-[22px] [&>li]:before:content-['→'] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:font-extrabold [&>li]:before:text-secondary";
const whiteSection = "section bg-white border-y-[3px] border-ink";
const tableCls =
  "w-full border-collapse bg-white border-brutal-thick shadow-brutal min-w-[640px] [&_:is(th,td)]:border-2 [&_:is(th,td)]:border-ink [&_:is(th,td)]:px-[18px] [&_:is(th,td)]:py-3.5 [&_:is(th,td)]:text-left [&_td]:text-[0.94rem] [&_strong]:font-extrabold";
const thCls = "font-display text-[1.3rem] tracking-[0.06em] bg-paper";

export default function Home() {
  return (
    <>
      {/* ---------- Hero: asymmetric split ---------- */}
      <header className="pt-24 pb-[72px] overflow-hidden">
        <div className="container grid gap-12 items-center lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h1 className="text-[clamp(2.6rem,4.5vw,4.4rem)] mb-6">
              ISATVON: A Structured Prompting Framework for{" "}
              <span className="hl hl-primary mx-1 my-1.5">Reliable AI Outputs</span>
            </h1>
            <p className="max-w-[620px] mb-9 text-[1.12rem] text-ink-soft">
              Turn vague AI requests into clear, controlled, and verifiable
              prompts for ChatGPT, Claude, Gemini, and other AI platforms.
            </p>
            <Reveal delay={0.1}>
              <div className="flex gap-[18px] flex-wrap">
                <Link className="b-btn b-btn-primary" href="/prompting">
                  Convert Your Prompt
                </Link>
                <Link className="b-btn b-btn-yellow" href="/#framework">
                  Explore the Framework
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="b-card text-left lg:-rotate-1">
              <div className="mock-bar">your-prompt.md</div>
              <div className="mock-body">
                {MOCK_ROWS.map(([letter, label, text]) => (
                  <div className="mock-row" key={letter}>
                    <span className="mock-letter">{letter}</span>
                    <span>
                      <strong>{label}</strong> {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ---------- One framework, multiple platforms ---------- */}
      <section className="section pb-12">
        <div className="container">
          <h2 className="section-title display">
            One Prompting Framework for <span className="hl">Multiple AI Platforms</span>
          </h2>
          <p className="section-sub">
            ISATVON works in plain text, so you can use the same structured
            prompt across different AI tools without rebuilding your workflow
            for every platform. Your prompts remain portable, reusable and
            easier to maintain even when your preferred AI platform changes.
          </p>
        </div>
      </section>
      <section className="bg-white border-y-[3px] border-ink py-[30px] overflow-hidden">
        <div className="flex flex-nowrap w-max motion-safe:animate-marquee">
          {[0, 1].map((copy) => (
            <div className="flex flex-nowrap" key={copy} aria-hidden={copy === 1 || undefined}>
              <Link href="/" className="logo mr-3.5 shrink-0">
                <span className="logo-mark">IS</span>ISATVON
              </Link>
              {MARQUEE_ITEMS.map((item) => (
                <span
                  key={item}
                  className="font-display text-[1.35rem] whitespace-nowrap border-2 border-ink px-[18px] py-1 bg-paper shadow-brutal-xs mr-3.5"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Vague requests, into execution briefs ---------- */}
      <section className="section">
        <div className="container">
          <h2 className="section-title display">
            Turn Vague AI Requests Into <span className="hl">Clear Execution Briefs</span>
          </h2>
          <p className="section-sub">
            Most prompts explain what the user wants but fail to define how the
            AI should complete the task. They often leave critical details
            unclear, including:
          </p>
          <Reveal>
            <div className="b-card max-w-[640px] mx-auto my-9 px-[30px] py-[26px]">
              <ul className={`${squareList} text-[0.95rem]`}>
                <li>What the AI must do</li>
                <li>Which sources it may use</li>
                <li>What information it must not assume</li>
                <li>Which tools are permitted</li>
                <li>How the result should be verified</li>
                <li>What the final output must contain</li>
                <li>How uncertainty should be reported</li>
              </ul>
            </div>
          </Reveal>
          <p className="section-sub">
            ISATVON converts a basic request into a structured execution brief.
            This reduces ambiguity, makes assumptions visible and gives the AI
            a clear response contract.
          </p>
        </div>
      </section>

      {/* ---------- Why prompts produce inconsistent results ---------- */}
      <section className={whiteSection}>
        <div className="container">
          <h2 className="section-title display">
            Why Most AI Prompts Produce <span className="hl hl-primary">Inconsistent Results</span>
          </h2>
          <p className="section-sub">
            Weak AI output is often blamed entirely on the model. In practice,
            many failures begin with incomplete instructions. When sources,
            constraints, verification steps and expected outcomes are missing,
            the AI is forced to interpret the task and fill in the gaps. This
            can lead to:
          </p>
          <Reveal>
            <div className="my-10 mx-auto max-w-[900px] grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
              {FAILURES.map((f) => (
                <div
                  key={f}
                  className="flex gap-3 items-center border-2 border-ink bg-white shadow-brutal-sm px-4 py-3 font-semibold text-[0.92rem]"
                >
                  <span className="not-x text-[1.1rem] min-w-[28px]">✕</span>
                  {f}
                </div>
              ))}
            </div>
          </Reveal>
          <p className="section-sub">
            ISATVON gives each critical part of the task a defined place in the
            prompt.
          </p>
        </div>
      </section>

      {/* ---------- Structure, not just more words ---------- */}
      <section className="section">
        <div className="container">
          <h2 className="section-title display">
            Better AI Prompts Need <span className="hl">Structure</span>, Not Just More Words
          </h2>
          <p className="section-sub">
            A long prompt is not automatically a good prompt. Reliable
            prompting depends on clearly defining the task, evidence, process,
            tools, limitations and final deliverable. ISATVON provides a
            repeatable structure for controlling each of these elements.
          </p>
          <Reveal>
            <div className="mt-11 grid gap-x-14 border-b-2 border-ink min-[900px]:grid-cols-2">
              {STRUCTURE_ROWS.map(([letter, title, text]) => (
                <div className="flex gap-[18px] py-5 border-t-2 border-ink items-baseline" key={letter}>
                  <span className="font-display text-[1.7rem] leading-none bg-ink text-white min-w-10 text-center py-1 shrink-0">
                    {letter}
                  </span>
                  <div>
                    <h3 className="text-[1.35rem] mb-1">{title}</h3>
                    <p className="text-[0.92rem] text-ink-soft">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- How it works (H2) ---------- */}
      <section className="dark-band section" id="how">
        <div className="container">
          <span className="section-label">How it works</span>
          <h2 className="section-title">
            How the ISATVON Prompting <span className="hl">Framework Works</span>
          </h2>
          <p className="section-sub">
            ISATVON transforms a raw request into a structured prompt that can
            be used across leading generative AI platforms.
          </p>
          <Reveal>
            <Pipeline />
          </Reveal>
          <div className="text-center mt-11">
            <Link className="b-btn b-btn-primary" href="/prompting">Convert Your Prompt</Link>
          </div>
        </div>
      </section>

      {/* ---------- The seven sections (H2) ---------- */}
      <section className="section" id="framework">
        <div className="container">
          <span className="section-label">The framework</span>
          <h2 className="section-title">
            The Seven Sections of the <span className="hl">ISATVON Framework</span>
          </h2>
          <p className="section-sub">
            ISATVON stands for Instructions, Source, Automation, Tech Stack,
            Variables, Outcome and Notification. Each section works in two
            directions: it tells the AI how to perform the task, and it tells
            the AI what it must report in the response.
          </p>
          <Reveal>
            <SevenGrid />
          </Reveal>
        </div>
      </section>

      {/* ---------- Structure the response ---------- */}
      <section className={whiteSection}>
        <div className="container">
          <h2 className="section-title display">
            Structure the AI <span className="hl">Response</span>, Not Just the Prompt
          </h2>
          <p className="section-sub">
            Most prompting frameworks focus on organising the user&rsquo;s
            request but provide limited control over what the AI reports back.
            ISATVON creates a two-way structure. The prompt defines how the
            task should be executed. The response then explains how the task
            was understood, completed and verified.
          </p>
          <Reveal>
            <div className="b-card max-w-[720px] mx-auto my-10 text-left">
              <div className="mock-bar">isatvon-response.md</div>
              <div className="mock-body">
                {RESPONSE_ROWS.map(([letter, text]) => (
                  <div className="mock-row" key={letter}>
                    <span className="mock-letter">{letter}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <p className="section-sub">
            This makes AI output easier to inspect, compare, review and reuse
            in professional workflows.
          </p>
        </div>
      </section>

      {/* ---------- Benefits: bento ---------- */}
      <section className="section">
        <div className="container">
          <h2 className="section-title display">
            Benefits of Using <span className="hl">Structured AI Prompts</span>
          </h2>
          <Reveal>
            <div className="mt-12 grid gap-6 min-[900px]:grid-cols-6">
              {BENEFITS.map(([cell, title, text]) => (
                <div className={`b-card b-card-hover p-[26px] ${cell}`} key={title}>
                  <h3 className="text-[1.5rem] mb-2">{title}</h3>
                  <p className="text-[0.94rem] text-ink-soft">{text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Use cases (H2): horizontal scroll-snap ---------- */}
      <section className="dark-band section" id="use-cases">
        <div className="container">
          <span className="section-label">Use cases</span>
          <h2 className="section-title">
            ISATVON <span className="hl">Use Cases</span>
          </h2>
          <p className="section-sub">
            ISATVON is designed for tasks where clarity, repeatability,
            verification and output control matter.
          </p>
          <Reveal>
            <div className="brutal-scroll mt-12 grid grid-flow-col auto-cols-[min(340px,82vw)] gap-6 overflow-x-auto snap-x snap-mandatory px-1 pt-1 pb-[22px] [&>*]:snap-start">
              {USE_CASES.map(([title, text, items]) => (
                <div className="b-card p-6" key={title}>
                  <h3 className="text-[1.6rem]">{title}</h3>
                  <p>{text}</p>
                  <ul className={arrowList}>
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Before / after example ---------- */}
      <section className="section">
        <div className="container">
          <h2 className="section-title display">
            See the Difference Between a <span className="hl hl-primary">Raw Prompt</span> and an <span className="hl">ISATVON Prompt</span>
          </h2>
          <Reveal>
            <div className="mt-12 grid gap-9 items-start min-[900px]:grid-cols-2">
              <div className="b-card">
                <div className="font-display text-[1.1rem] tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-red-brand text-white">
                  Raw prompt
                </div>
                <div className="p-5 text-[0.9rem]">
                  <blockquote className="text-[1.15rem] italic text-ink-soft">
                    &ldquo;Review this code and tell me what is wrong.&rdquo;
                  </blockquote>
                  <p className="mt-4 mb-2.5 font-semibold">This prompt does not define:</p>
                  <ul className={squareList}>
                    <li>The programming environment</li>
                    <li>The review criteria</li>
                    <li>The severity levels</li>
                    <li>The verification process</li>
                    <li>The expected output format</li>
                    <li>Whether assumptions are allowed</li>
                  </ul>
                </div>
              </div>
              <div className="b-card">
                <span className="stamp">ISATVON</span>
                <div className="font-display text-[1.1rem] tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-green-brand">
                  Structured ISATVON prompt
                </div>
                <div className="p-5 text-[0.9rem]">
                  <p>
                    Act as a senior Python reviewer. Review only the supplied
                    code for correctness, security and maintainability. Do not
                    assume missing dependencies. Classify findings as Critical,
                    High, Medium or Low. Explain each issue, identify the
                    affected function and provide a minimal corrected snippet.
                    Verify that every recommendation relates directly to the
                    submitted code. Report assumptions separately.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
          <p className="section-sub mt-9">
            The structured prompt produces a narrower, more relevant and
            easier-to-review response.
          </p>
          <div className="text-center mt-8">
            <Link className="b-btn" href="/prompting">Open the Prompt Library</Link>
          </div>
        </div>
      </section>

      {/* ---------- vs COSTAR (H2) ---------- */}
      <section className={whiteSection}>
        <div className="container">
          <h2 className="section-title">
            ISATVON <span className="hl">vs</span> COSTAR Prompting Framework
          </h2>
          <p className="section-sub">
            COSTAR helps structure context, objectives, style, tone, audience
            and response requirements. ISATVON covers similar foundations while
            adding explicit controls for sources, execution methods, tool use,
            verification, measurable constraints and assumption reporting.
          </p>
          <Reveal>
            <div className="mt-9 overflow-x-auto">
              <table className={tableCls}>
                <thead>
                  <tr>
                    <th className={thCls}>Section</th>
                    <th className={`${thCls.replace("bg-paper", "bg-yellow")}`}>What ISATVON adds</th>
                  </tr>
                </thead>
                <tbody>
                  {VS_ROWS.map(([section, adds]) => {
                    const [letter, name] = section.split("|");
                    return (
                      <tr key={letter}>
                        <td>
                          <strong>{letter}</strong>
                          {name}
                        </td>
                        <td className="bg-yellow">{adds}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="section-sub mt-9">
            ISATVON is not intended to replace every prompting method. It is
            better suited to tasks where accuracy, consistency, traceability
            and output control matter more than speed alone.
          </p>
          <div className="text-center mt-8">
            <Link className="b-btn" href="/isatvon-vs-costar">Compare ISATVON and COSTAR</Link>
          </div>
        </div>
      </section>

      {/* ---------- Converter teaser ---------- */}
      <section className="section">
        <div className="container text-center">
          <h2 className="section-title display">
            Convert a Raw Prompt Into an <span className="hl">ISATVON Prompt</span>
          </h2>
          <p className="section-sub">
            Paste a basic request into the ISATVON Prompt Converter. The
            converter organises your request into instructions, approved
            sources, execution steps, tool requirements, measurable variables,
            expected outcomes, and assumption and confidence reporting. Review
            the generated structure, adjust the details and use it with your
            preferred AI platform.
          </p>
          <Reveal>
            <div className="b-card max-w-[720px] mx-auto mt-9 text-left">
              <div className="mock-bar">raw-prompt.txt</div>
              <div className="px-[26px] py-[22px]">
                <p className="italic text-ink-soft">
                  &ldquo;Create a competitor analysis for our SaaS product using
                  the attached research.&rdquo;
                </p>
              </div>
            </div>
          </Reveal>
          <div className="flex gap-[18px] justify-center flex-wrap mt-7">
            <Link className="b-btn b-btn-primary" href="/prompting">Convert Your Prompt</Link>
            <Link className="b-btn b-btn-yellow" href="/prompting">Open the Prompt Library</Link>
          </div>
          <p className="text-[0.85rem] text-ink-mute max-w-[560px] mx-auto mt-5">
            The converter improves prompt structure. It cannot compensate for
            missing context, unreliable source material or unrealistic
            requirements.
          </p>
        </div>
      </section>

      {/* ---------- Templates ---------- */}
      <section className={whiteSection}>
        <div className="container text-center">
          <h2 className="section-title display">
            Explore Ready-to-Use ISATVON <span className="hl">Prompt Templates</span>
          </h2>
          <p className="section-sub">
            Start with a structured template instead of building every
            professional prompt from scratch. The ISATVON Prompt Library
            includes adaptable templates for:
          </p>
          <Reveal>
            <div className="flex flex-wrap gap-3 justify-center mt-7 mb-12">
              {CHIPS.map((c) => (
                <Link className="chip" href="/prompting" key={c}>
                  {c}
                </Link>
              ))}
            </div>
          </Reveal>
          <Link className="b-btn" href="/prompting">Open the Prompt Library</Link>
        </div>
      </section>

      {/* ---------- Open & portable: stats band ---------- */}
      <section className="section">
        <div className="container">
          <h2 className="section-title display">
            An Open and Portable <span className="hl">AI Prompting Framework</span>
          </h2>
          <Reveal>
            <div className="mt-12 grid gap-8 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
              {STATS.map(([num, color, title, text]) => (
                <div className="b-card px-6 py-[30px] text-center" key={title}>
                  <div className={`font-display text-[4rem] leading-none ${color}`}>{num}</div>
                  <h3 className="text-[1.3rem] mt-2.5 mb-1.5">{title}</h3>
                  <p className="font-semibold mt-2">{text}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <div className="text-center mt-11">
            <a className="b-btn" href={GITHUB} target="_blank" rel="noopener">View on GitHub</a>
          </div>
        </div>
      </section>

      {/* ---------- When not to use ---------- */}
      <section className="section bg-white border-t-[3px] border-ink">
        <div className="container">
          <h2 className="section-title display">
            When <span className="hl hl-primary">Not</span> to Use ISATVON
          </h2>
          <p className="section-sub">ISATVON is not the right tool for every AI request.</p>
          <Reveal>
            <div className="mt-10 grid gap-5 max-w-[760px] mx-auto">
              <div className="b-card flex gap-4 px-[22px] py-[18px] items-baseline">
                <span className="not-x">✕</span>
                <div><strong className="block">Simple Creative Requests</strong> A basic caption, rewrite or tone adjustment usually does not require all seven sections.</div>
              </div>
              <div className="b-card flex gap-4 px-[22px] py-[18px] items-baseline">
                <span className="not-x">✕</span>
                <div><strong className="block">Casual AI Conversations</strong> ISATVON is designed for structured deliverables, not ordinary back-and-forth conversation.</div>
              </div>
              <div className="b-card flex gap-4 px-[22px] py-[18px] items-baseline">
                <span className="not-x">✕</span>
                <div><strong className="block">Incomplete or Unreliable Sources</strong> A well-structured prompt cannot produce dependable analysis from poor information.</div>
              </div>
              <div className="b-card flex gap-4 px-[22px] py-[18px] items-baseline">
                <span className="not-x">✕</span>
                <div><strong className="block">Strict Machine-Execution Contracts</strong> Deterministic agent loops, schemas, retries and guaranteed tool execution require a machine-readable <a className="underline" href="https://github.com/isatvon/isatvon" target="_blank" rel="noopener">specification</a> and <a className="underline" href="https://github.com/isatvon/isatvon-validator" target="_blank" rel="noopener">validator</a>.</div>
              </div>
              <div className="b-card flex gap-4 px-[22px] py-[18px] items-baseline">
                <span className="not-x">✕</span>
                <div><strong className="block">High-Risk Decisions Without Expert Review</strong> ISATVON improves transparency but does not replace legal, medical, financial, security or other professional judgement.</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="section bg-primary border-y-4 border-ink text-center">
        <div className="container">
          <p className="display text-white text-[clamp(2.4rem,6vw,4rem)] mb-5">
            Stop Re-Prompting. Start Specifying.
          </p>
          <p className="text-white max-w-[560px] mx-auto mb-7">
            Give AI the instructions, evidence, boundaries and output contract
            it needs to perform useful work. Turn your next vague request into
            a structured, reviewable and reusable AI prompt.
          </p>
          <div className="flex gap-[18px] justify-center flex-wrap mb-[18px]">
            <Link className="b-btn hover:bg-yellow" href="/prompting">Convert Your Prompt</Link>
            <Link className="b-btn hover:bg-yellow" href="/prompting">Copy the Template</Link>
          </div>
          <p className="text-[0.85rem] text-[#ffd9cc] mt-4">Open framework. Works with your existing AI tools.</p>
        </div>
      </section>

      {/* ---------- FAQ (H2) ---------- */}
      <section className="section" id="faq">
        <div className="container">
          <h2 className="section-title">
            Frequently Asked <span className="hl">Questions</span>
          </h2>
          <Reveal>
            <div className="mt-10 grid gap-[18px] max-w-[820px] mx-auto">
              {faqs.map(({ q, a }) => (
                <details className="group bg-white border-brutal shadow-brutal-sm" key={q}>
                  <summary className="cursor-pointer list-none font-display uppercase text-[1.25rem] tracking-[0.04em] px-5 py-4 flex justify-between items-baseline gap-3 [&::-webkit-details-marker]:hidden after:content-['+'] after:text-[1.4rem] after:shrink-0 group-open:after:content-['-'] group-open:border-b-2 group-open:border-ink group-open:bg-yellow">
                    {q}
                  </summary>
                  <p className="px-5 py-4 text-[0.95rem] text-ink-soft">{a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>
    </>
  );
}
