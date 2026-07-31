import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { pageMeta, GITHUB } from "../config";

const title = "ISATVON vs COSTAR: Which Prompting Framework?";
const description =
  "Compare ISATVON and COSTAR: full section mapping, what ISATVON adds (verification, tool policy, response contract, assumption reporting) and when to use which.";

export const metadata: Metadata = pageMeta(title, description, "/isatvon-vs-costar");

const MAPPING_ROWS: [string, string, string][] = [
  ["Context", "S| Source", "The explicit “do not assume” boundary"],
  ["Objective", "I| Instructions", "Role and hard rules alongside the objective"],
  ["Style", "V| Variables", "Style becomes a measurable constraint with a fallback"],
  ["Tone", "V| Variables", "Same"],
  ["Audience", "V| Variables", "Same"],
  ["Response", "O| Outcome", "The reply itself in ISATVON structure"],
  ["Not covered", "A| Automation", "Step order + self-verification before answering"],
  ["Not covered", "T| Tech Stack", "Capabilities allowed/forbidden (search, code, citations)"],
  ["Not covered", "N| Notification", "Mandatory assumptions/confidence/omissions report"],
];

const tableCls =
  "w-full border-collapse bg-white border-brutal-thick shadow-brutal min-w-[640px] [&_:is(th,td)]:border-2 [&_:is(th,td)]:border-ink [&_:is(th,td)]:px-[18px] [&_:is(th,td)]:py-3.5 [&_:is(th,td)]:text-left [&_td]:text-[0.94rem] [&_strong]:font-extrabold";
const thCls = "font-display text-[1.3rem] tracking-[0.06em] bg-paper";

export default function VsCostarPage() {
  return (
    <>
      <header className="pt-24 pb-12">
        <div className="container">
          <h1 className="text-[clamp(2.6rem,4.5vw,4.4rem)] mb-6">
            ISATVON <span className="hl">vs</span> COSTAR
          </h1>
          <p className="max-w-[620px] mb-9 text-[1.12rem] text-ink-soft">
            COSTAR (Context, Objective, Style, Tone, Audience, Response)
            structures the ask. ISATVON structures the ask and the answer, and
            adds three things COSTAR has no slot for: a self-verification
            step, a tool policy, and constraints with declared fallbacks.
          </p>
        </div>
      </header>

      <section className="section pt-12">
        <div className="container">
          <h2 className="section-title">
            Section <span className="hl">Mapping</span>
          </h2>
          <Reveal>
            <div className="mt-12 overflow-x-auto">
              <table className={tableCls}>
                <thead>
                  <tr>
                    <th className={thCls}>COSTAR</th>
                    <th className={`${thCls} bg-yellow`}>ISATVON</th>
                    <th className={`${thCls} bg-yellow`}>ISATVON adds</th>
                  </tr>
                </thead>
                <tbody>
                  {MAPPING_ROWS.map(([costar, isatvon, adds], i) => {
                    const [letter, name] = isatvon.split("|");
                    return (
                      <tr key={i}>
                        <td>{costar}</td>
                        <td className="bg-yellow">
                          <strong>{letter}</strong> {name}
                        </td>
                        <td className="bg-yellow">{adds}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white border-y-[3px] border-ink">
        <div className="container">
          <h2 className="section-title">
            What COSTAR <span className="hl">Gets Right</span>
          </h2>
          <p className="section-sub">
            COSTAR is a good framework and most of ISATVON overlaps with it. It
            came out of a competition-winning prompt engineering practice, and
            its six sections cover the things people most often leave out of a
            prompt: who the model is talking to, in what register, and what the
            reply should look like. If your prompts currently consist of one
            sentence and a hope, adopting COSTAR is a large improvement for very
            little effort.
          </p>
          <p className="section-sub">
            The mapping table above shows this directly. Five of COSTAR&rsquo;s
            six sections map cleanly onto ISATVON sections. ISATVON is not a
            replacement for the idea behind COSTAR; it is the same idea extended
            to cover what happens after the model starts writing.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">
            The Three Sections COSTAR <span className="hl hl-primary">Has No Slot For</span>
          </h2>
          <p className="section-sub">
            Every framework encodes a theory of where prompts fail. COSTAR&rsquo;s
            theory is that they fail because the ask is underspecified. ISATVON
            accepts that and adds a second theory: they also fail because the
            answer is unaccountable. Three sections exist only to address that.
          </p>
          <Reveal>
            <div className="mt-12 grid gap-9 items-start min-[900px]:grid-cols-3">
              <div className="b-card">
                <div className="font-display text-[1.1rem] tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-yellow">
                  A — Automation
                </div>
                <div className="p-5 text-[0.9rem]">
                  <p className="mb-3">
                    Fixes the step order, then ends with a self-check the model
                    has to run before it is allowed to answer: every figure
                    sourced, every constraint met, every claim checked.
                  </p>
                  <p>
                    A prompt without this asks for an answer. A prompt with it
                    asks for a checked answer. That is a different request, and
                    models respond to it differently.
                  </p>
                </div>
              </div>
              <div className="b-card">
                <div className="font-display text-[1.1rem] tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-yellow">
                  T — Tech Stack
                </div>
                <div className="p-5 text-[0.9rem]">
                  <p className="mb-3">
                    States which capabilities are allowed and which are
                    forbidden: web search, code execution, citations, image
                    generation.
                  </p>
                  <p>
                    Without it the model decides for itself whether to look
                    something up or answer from memory, and it does not tell you
                    which it chose. Two runs of the same prompt can differ for
                    that reason alone.
                  </p>
                </div>
              </div>
              <div className="b-card">
                <span className="stamp">N</span>
                <div className="font-display text-[1.1rem] tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-yellow">
                  N — Notification
                </div>
                <div className="p-5 text-[0.9rem]">
                  <p className="mb-3">
                    Requires a closing report: assumptions made, confidence
                    level, and anything requested that was not delivered.
                  </p>
                  <p>
                    This is the section that changes review time most. Silent
                    omissions are the expensive failure mode, because you only
                    find them after you have acted on the output.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white border-y-[3px] border-ink">
        <div className="container">
          <h2 className="section-title">
            The Same Task, <span className="hl">Both Ways</span>
          </h2>
          <p className="section-sub">
            Take a concrete request: summarise a 30-page vendor contract for a
            non-lawyer.
          </p>
          <Reveal>
            <div className="mt-12 grid gap-9 items-start min-[900px]:grid-cols-2">
              <div className="b-card">
                <div className="font-display text-[1.1rem] tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-green-brand">
                  Under COSTAR
                </div>
                <div className="p-5 text-[0.9rem]">
                  <p className="mb-3">
                    You get context (the contract), an objective (summarise the
                    obligations), a style (plain English), a tone (neutral), an
                    audience (a non-lawyer) and a response shape (bullets).
                  </p>
                  <p>
                    You will very likely get a good summary. What you will not
                    get is any indication of which clauses the model skipped
                    because they were ambiguous, whether it read all 30 pages or
                    the first ten, or whether &ldquo;90-day termination
                    window&rdquo; came from the document or from what contracts
                    usually say.
                  </p>
                </div>
              </div>
              <div className="b-card">
                <span className="stamp">ISATVON</span>
                <div className="font-display text-[1.1rem] tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-green-brand">
                  Under ISATVON
                </div>
                <div className="p-5 text-[0.9rem]">
                  <p className="mb-3">
                    You get all of the above, plus: S pins the summary to the
                    supplied document and forbids filling gaps from general
                    contract knowledge. A requires the model to confirm it
                    covered every section before answering. T forbids web
                    search. N forces it to list the clauses it found ambiguous
                    and state its confidence.
                  </p>
                  <p>
                    The summary itself may be similar. The difference is that
                    you now know what it is based on, and where not to trust it.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
          <p className="section-sub mt-9">
            This is the general pattern. ISATVON rarely produces a dramatically
            better deliverable. It produces a deliverable you can review in
            minutes instead of re-reading the source to check it.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">
            What ISATVON <span className="hl hl-primary">Costs You</span>
          </h2>
          <p className="section-sub">
            Seven sections and a mandated response format are not free, and the
            honest comparison includes the downsides.
          </p>
          <Reveal>
            <div className="mt-12 grid gap-9 items-start min-[900px]:grid-cols-3">
              <div className="b-card flex gap-4 px-[22px] py-[18px] items-baseline">
                <span className="not-x">✕</span>
                <div>
                  <strong className="block">Length</strong>
                  An ISATVON prompt is longer to write and longer to read than a
                  COSTAR one. For a tweet rewrite, the prompt would exceed the
                  deliverable.
                </div>
              </div>
              <div className="b-card flex gap-4 px-[22px] py-[18px] items-baseline">
                <span className="not-x">✕</span>
                <div>
                  <strong className="block">Verbose replies</strong>
                  The O and N sections mean the answer arrives wrapped in meta.
                  That is the point, but it is friction when you just wanted the
                  paragraph.
                </div>
              </div>
              <div className="b-card flex gap-4 px-[22px] py-[18px] items-baseline">
                <span className="not-x">✕</span>
                <div>
                  <strong className="block">Not enforcement</strong>
                  A self-check is still the model checking itself. It catches
                  more than no check at all; it is not a validator, and it does
                  not make the output correct.
                </div>
              </div>
            </div>
          </Reveal>
          <p className="section-sub mt-9">
            The{" "}
            <a
              className="underline"
              href={`${GITHUB}/blob/main/templates/prompt-template-lite.md`}
              target="_blank"
              rel="noopener"
            >
              Lite template
            </a>{" "}
            exists for the middle ground: the ISATVON sections that matter most,
            without the full ceremony.
          </p>
        </div>
      </section>

      <section className="section bg-white border-y-[3px] border-ink">
        <div className="container">
          <h2 className="section-title">
            What the A Section Catches That <span className="hl hl-primary">COSTAR Can&rsquo;t</span>
          </h2>
          <p className="section-sub">
            COSTAR has no verification slot, so nothing stops the model from
            shipping unchecked claims. In our own side-by-side testing this
            showed up concretely: a COSTAR-framed launch email invented a
            &ldquo;40% fewer interruptions&rdquo; statistic out of nothing. The
            ISATVON version of the same task self-verified its word count and
            constraint list before answering and invented no figures, because A
            ends with an explicit self-check and I carries a &ldquo;never invent
            figures&rdquo; rule. This is an internal comparison, not a published
            benchmark, and one task is not evidence of a rate. The point is the
            mechanism: that verification step, not the section count, is where
            the difference comes from.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">
            When to Use <span className="hl">Which</span>
          </h2>
          <Reveal>
            <div className="mt-12 grid gap-9 items-start min-[900px]:grid-cols-2">
              <div className="b-card">
                <div className="font-display text-[1.1rem] tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-green-brand">
                  Use COSTAR
                </div>
                <div className="p-5 text-[0.9rem]">
                  <p>
                    COSTAR is lighter and fine for one-shot stylistic tasks: a
                    tweet, a rewrite, a tone change. Six sections, no ceremony.
                  </p>
                </div>
              </div>
              <div className="b-card">
                <span className="stamp">ISATVON</span>
                <div className="font-display text-[1.1rem] tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-green-brand">
                  Use ISATVON
                </div>
                <div className="p-5 text-[0.9rem]">
                  <p>
                    ISATVON earns its extra sections when the answer has to be
                    trustworthy: research, analysis, code, anything where you
                    need to know what the model assumed, what it used, and
                    whether it checked itself. The structured response also
                    makes outputs comparable across platforms and across reruns.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
          <p className="section-sub mt-9">
            Rule of thumb: if you&rsquo;d be annoyed to discover the model
            silently invented a fact or broke a constraint, use ISATVON.
          </p>
          <div className="text-center mt-9">
            <Link className="b-btn b-btn-primary" href="/prompting">Convert Your Prompt</Link>
          </div>
        </div>
      </section>
    </>
  );
}
