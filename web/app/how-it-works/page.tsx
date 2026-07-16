import type { Metadata } from "next";
import Link from "next/link";
import { Pipeline, SevenGrid } from "@/components/Framework";
import Reveal from "@/components/Reveal";
import { GITHUB } from "../config";

const title = "How the ISATVON Framework Works";
const description =
  "How ISATVON structures the prompt and the AI response across seven sections: instructions, sources, execution, tools, variables, outcomes and notification.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/how-it-works" },
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const RESPONSE_ROWS = [
  ["I", "The model solved the wrong problem: visible in one sentence, before you read the rest."],
  ["S", "Answers grounded in training data instead of your supplied context announce themselves."],
  ["A", "“Verified: nothing” means unchecked claims are visible."],
  ["V", "Silently broken constraints (length, tone, scope) are reported."],
  ["O", "The deliverable, cleanly separable from the meta and easy to copy out."],
  ["N", "Hidden assumptions and low-confidence guesses are disclosed, not dressed up as facts."],
];

export default function HowItWorksPage() {
  return (
    <>
      <header className="pt-24 pb-12 text-center">
        <div className="container">
          <h1 className="text-[clamp(3rem,8vw,5.6rem)] max-w-[900px] mx-auto mb-7">
            How the ISATVON <span className="hl">Framework</span> Works
          </h1>
          <p className="max-w-[620px] mx-auto text-[1.12rem] text-ink-soft">
            ISATVON transforms a raw request into a structured prompt, and
            contracts the response so what the AI understood, used, verified
            and assumed is visible in every reply.
          </p>
        </div>
      </header>

      <section className="dark-band section">
        <div className="container">
          <span className="section-label">The process</span>
          <h2 className="section-title">
            From Raw Request to <span className="hl">Reviewable Response</span>
          </h2>
          <Reveal>
            <Pipeline />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="section-label">The framework</span>
          <h2 className="section-title">
            The Seven <span className="hl">Sections</span>
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

      <section className="section bg-white border-y-[3px] border-ink">
        <div className="container">
          <h2 className="section-title">
            Reading an ISATVON <span className="hl">Response</span>
          </h2>
          <p className="section-sub">
            Every ISATVON prompt&rsquo;s O section asks for the reply in the
            same structure, so the response is auditable at a glance.
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
            Check I first: a wrong restatement means a wrong answer; stop and
            re-prompt. Scan V and N for broken constraints and assumptions you
            disagree with. Only then read O.
          </p>
        </div>
      </section>

      <section className="section bg-primary border-y-4 border-ink text-center">
        <div className="container">
          <p className="display text-white text-[clamp(2.4rem,6vw,4rem)] mb-5">
            Try it on your next prompt
          </p>
          <div className="flex gap-[18px] justify-center flex-wrap">
            <Link className="b-btn hover:bg-yellow" href="/prompting">Convert Your Prompt</Link>
            <a
              className="b-btn hover:bg-yellow"
              href={`${GITHUB}/blob/main/templates/prompt-template.md`}
              target="_blank"
              rel="noopener"
            >
              Copy the Template
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
