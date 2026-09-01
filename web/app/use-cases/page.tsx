import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { pageMeta } from "../config";

const title = "9 Ways the ISATVON Framework Helps Teams Build Better AI Workflows";
const description =
  "ISATVON combines structured instructions, source data, tools, quality rules, expected outcomes and notifications to turn random AI prompts into reliable, repeatable AI workflows.";

export const metadata: Metadata = pageMeta(title, description, "/use-cases");

const whiteSection = "section bg-white border-y-[3px] border-ink";
const arrowList =
  "mt-3 mb-4 list-none grid gap-2 text-[0.9rem] [&>li]:relative [&>li]:pl-[22px] [&>li]:before:content-['→'] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:font-extrabold [&>li]:before:text-secondary";
const tableCls =
  "w-full border-collapse bg-white border-brutal-thick shadow-brutal min-w-[640px] [&_:is(th,td)]:border-2 [&_:is(th,td)]:border-ink [&_:is(th,td)]:px-[18px] [&_:is(th,td)]:py-3.5 [&_:is(th,td)]:text-left [&_td]:text-[0.94rem] [&_strong]:font-extrabold";
const thCls = "font-display text-[1.3rem] tracking-[0.06em] bg-paper";

const ELEMENTS: [string, string][] = [
  ["Instructions", "Defines what AI needs to do, its role, and the process"],
  ["Source Data", "Provides the right information and context"],
  ["Automation", "Executes the work via LLMs or scripts"],
  ["Tools", "Connects AI with applications, APIs, and systems"],
  ["Variant", "Defines quality standards, rules, and validation"],
  ["Outcome", "Specifies the expected final result"],
  ["Notification", "Defines delivery, alerts, and next actions"],
];

type Block = { p: string } | { list: string[] };

const USE_CASES: { title: string; tagline: string; blocks: Block[]; outcome: string }[] = [
  {
    title: "1. PRD Checklist (Input)",
    tagline: "Create Better Product Requirements Before Development Begins",
    blocks: [
      {
        p: "Product teams often start development with incomplete requirements, missing edge cases, and unclear expectations.",
      },
      {
        p: "ISATVON helps teams review the Product Requirements Document (PRD) before development begins. AI evaluates:",
      },
      {
        list: [
          "Business objectives",
          "User requirements",
          "Feature completeness",
          "Technical considerations",
          "Missing scenarios",
          "Acceptance criteria",
        ],
      },
    ],
    outcome:
      "A structured PRD review with missing points identified before they become development problems.",
  },
  {
    title: "2. PRD Output Format",
    tagline: "Convert Ideas Into Developer-Ready Product Documents",
    blocks: [
      {
        p: "Great products start with clear communication between business and engineering teams.",
      },
      { p: "ISATVON helps transform rough ideas into structured product documents. It creates:" },
      {
        list: [
          "Product overview",
          "User stories",
          "Functional requirements",
          "Technical requirements",
          "Acceptance criteria",
          "Success metrics",
        ],
      },
    ],
    outcome: "Teams move from ideas to execution faster with fewer misunderstandings.",
  },
  {
    title: "3. Prompt Productivity",
    tagline: "Create Repeatable AI Prompts Instead of Starting From Zero",
    blocks: [
      { p: "Most teams waste time rewriting similar prompts repeatedly." },
      { p: "ISATVON helps create reusable prompt templates that capture:" },
      {
        list: [
          "Role",
          "Context",
          "Instructions",
          "Data requirements",
          "Quality checks",
          "Expected output",
        ],
      },
      { p: "Examples:" },
      {
        list: [
          "Marketing content generation",
          "SEO analysis",
          "Research workflows",
          "Coding assistance",
          "Business reporting",
        ],
      },
    ],
    outcome: "Teams spend less time writing prompts and more time getting valuable AI results.",
  },
  {
    title: "4. LLM-as-a-Judge",
    tagline: "Let AI Evaluate AI Output",
    blocks: [
      {
        p: "Generating content is only one part of an AI workflow. The bigger challenge is knowing whether the output is good enough.",
      },
      {
        p: "ISATVON enables LLM-as-a-Judge workflows where one AI generates content and another AI evaluates quality.",
      },
      { p: "Evaluation areas:" },
      {
        list: [
          "Accuracy",
          "Completeness",
          "Brand alignment",
          "Formatting",
          "Compliance",
          "Overall quality score",
        ],
      },
    ],
    outcome: "AI workflows become self-checking and more reliable.",
  },
  {
    title: "5. Skill Manifest (Input)",
    tagline: "Turn AI Knowledge Into Reusable Skills",
    blocks: [
      { p: "AI agents become more powerful when they have clearly defined skills." },
      { p: "ISATVON helps generate structured AI skills that define:" },
      {
        list: [
          "Required inputs",
          "Processing steps",
          "Tools needed",
          "Validation rules",
          "Expected outputs",
        ],
      },
      { p: "Examples:" },
      {
        list: [
          "SEO Audit Skill",
          "Competitor Research Skill",
          "Content Brief Skill",
          "Data Analysis Skill",
        ],
      },
    ],
    outcome: "Teams can build a library of reusable AI capabilities.",
  },
  {
    title: "6. Skill Manifest (Output)",
    tagline: "Standardize How AI Skills Deliver Results",
    blocks: [
      { p: "A powerful AI skill is useless if every output looks different." },
      { p: "ISATVON defines a consistent output format for every AI skill. It controls:" },
      {
        list: [
          "Required sections",
          "Data fields",
          "Report structure",
          "Quality standards",
          "Delivery format",
        ],
      },
    ],
    outcome: "AI outputs become predictable, readable, and ready for business use.",
  },
  {
    title: "7. One-Click Installation",
    tagline: "Deploy AI Workflows Faster",
    blocks: [
      { p: "Building AI workflows from scratch takes time." },
      { p: "ISATVON enables packaged AI workflows that can include:" },
      {
        list: [
          "Prompt structure",
          "Tool connections",
          "Configuration",
          "Validation rules",
          "Output settings",
        ],
      },
    ],
    outcome: "Teams can move from experimentation to deployment faster.",
  },
  {
    title: "8. Digital Twin Mapping",
    tagline: "Convert Business Processes Into AI Workflows",
    blocks: [
      { p: "Every business has processes, decisions, rules, and knowledge." },
      { p: "ISATVON helps map these processes into AI-ready digital workflows." },
      { p: "Examples:" },
      {
        list: [
          "Manufacturing operations",
          "Customer support processes",
          "Sales workflows",
          "Internal approvals",
        ],
      },
      { p: "AI understands:" },
      { list: ["Inputs", "Decision points", "Actions", "Exceptions", "Outputs"] },
    ],
    outcome: "Businesses can transform operational knowledge into scalable AI systems.",
  },
  {
    title: "9. Automated Unit Testing",
    tagline: "Improve Software Quality With AI Validation",
    blocks: [
      { p: "Developers spend significant time creating and maintaining tests." },
      { p: "ISATVON helps AI understand:" },
      {
        list: [
          "Application requirements",
          "Code structure",
          "Expected behaviour",
          "Testing scenarios",
        ],
      },
      { p: "AI can generate:" },
      { list: ["Test cases", "Validation scenarios", "Error checks", "Test reports"] },
    ],
    outcome: "Developers build and validate software faster with AI assistance.",
  },
];

export default function UseCasesPage() {
  return (
    <>
      <header className="pt-24 pb-12 text-center">
        <div className="container max-w-[760px] mx-auto">
          <h1 className="text-[clamp(2.4rem,5.5vw,4.2rem)] mb-5">
            9 Ways the ISATVON <span className="hl">Framework</span> Helps Teams Build Better AI
            Workflows
          </h1>
          <p className="text-[1.2rem] font-semibold mb-6">
            Move From Random AI Prompts to Reliable AI Systems
          </p>
          <p className="text-[1.05rem] text-ink-soft mb-4">
            Most people use AI by asking questions and hoping for the right answer. The ISATVON
            framework, developed by Srinath Rangaswamy, Co-Founder at DigiBull AI, changes this
            approach.
          </p>
          <p className="text-[1.05rem] text-ink-soft mb-4">
            By combining structured instructions, source data, tools, quality rules, expected
            outcomes and notifications, ISATVON helps teams create repeatable AI workflows that are
            easier to build, evaluate and scale.
          </p>
          <p className="text-[1.05rem] text-ink-soft">
            Whether you are building products, writing requirements, generating code, or automating
            business processes, ISATVON provides the structure AI needs to deliver consistent
            results.
          </p>
        </div>
      </header>

      <section className={whiteSection}>
        <div className="container">
          <h2 className="section-title">
            How Does ISATVON <span className="hl">Work</span>?
          </h2>
          <p className="section-sub">
            Every AI workflow created with ISATVON follows seven core elements:
          </p>
          <Reveal>
            <div className="mt-9 overflow-x-auto">
              <table className={tableCls}>
                <thead>
                  <tr>
                    <th className={thCls}>Element</th>
                    <th className={`${thCls} bg-yellow`}>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {ELEMENTS.map(([element, purpose]) => (
                    <tr key={element}>
                      <td>
                        <strong>{element}</strong>
                      </td>
                      <td className="bg-yellow">{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">
            9 Use Cases for <span className="hl">ISATVON</span>
          </h2>
          <p className="section-sub">
            Here are nine ways ISATVON turns AI from a simple response generator into a structured
            execution framework.
          </p>
          <Reveal>
            <div className="mt-12 grid gap-9 items-start min-[900px]:grid-cols-3">
              {USE_CASES.map(({ title: caseTitle, tagline, blocks, outcome }) => (
                <div className="b-card p-6" key={caseTitle}>
                  <h3 className="text-[1.25rem] mb-1">{caseTitle}</h3>
                  <p className="font-semibold mb-3">{tagline}</p>
                  {blocks.map((block, i) =>
                    "list" in block ? (
                      <ul className={arrowList} key={i}>
                        {block.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[0.92rem] mb-2" key={i}>
                        {block.p}
                      </p>
                    )
                  )}
                  <p className="text-[0.92rem] mt-2 italic text-ink-soft">{outcome}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-primary border-y-4 border-ink text-center">
        <div className="container max-w-[760px] mx-auto">
          <p className="display text-white text-[clamp(2.2rem,5.5vw,3.6rem)] mb-5">
            Use ISATVON to Build AI Workflows That Actually Work
          </p>
          <p className="text-white/90 mb-3">
            ISATVON is a structured AI workflow framework that starts with prompts and extends into
            automation, evaluation, and AI agents. AI is powerful, but without structure it produces
            inconsistent results. ISATVON provides the framework to design, evaluate, and automate
            AI workflows across development, business, and operations.
          </p>
          <p className="text-white font-semibold mb-7">
            Structure your AI. Scale your workflows. Build with confidence.
          </p>
          <Link className="b-btn hover:bg-yellow" href="/prompting">
            Start Building With ISATVON
          </Link>
        </div>
      </section>
    </>
  );
}
