import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

const title = "ISATVON vs COSTAR";
const description =
  "Compare ISATVON and COSTAR: full section mapping, what ISATVON adds (verification, tool policy, response contract, assumption reporting) and when to use which.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/isatvon-vs-costar" },
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

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
            What the A Section Catches That <span className="hl hl-primary">COSTAR Can&rsquo;t</span>
          </h2>
          <p className="section-sub">
            COSTAR has no verification slot, so nothing stops the model from
            shipping unchecked claims. In blind benchmarking this showed up
            concretely: a COSTAR-framed launch email invented a &ldquo;40%
            fewer interruptions&rdquo; statistic. The ISATVON version of the
            same task self-verified its word count and constraint list before
            answering and invented nothing, because A ends with an explicit
            self-check and I carries a &ldquo;never invent figures&rdquo;
            rule. That verification step, not the section count, is the
            framework&rsquo;s real edge.
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
