"use client";

import { Fragment, useState } from "react";
import Converter from "./Converter";
import PromptView from "./PromptView";
import { GITHUB } from "@/app/config";
import { EXAMPLES, FULL_TEMPLATE, LITE_TEMPLATE } from "@/lib/generated/content";
import { DIFFICULTIES } from "@/lib/isatvon/types";

const panelCls = "hidden data-[active=true]:block data-[active=true]:motion-safe:animate-pane-in";
const tabPaneCls = "hidden data-[active=true]:block data-[active=true]:motion-safe:animate-pane-in";
const codeCardCls = "b-card mb-8";
const codeHeadCls =
  "flex items-center justify-between gap-3 bg-ink text-white border-b-[3px] border-ink px-4 py-2.5 font-display text-base tracking-[0.1em]";
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

const REFS = [
  ["Prompting guide", "references/prompting-guide.md"],
  ["COSTAR comparison", "references/costar-comparison.md"],
  ["Response format", "references/response-format.md"],
];

export default function Library() {
  const [panel, setPanel] = useState("template");
  const [tab, setTab] = useState<"full" | "lite">("full");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function show(id: string) {
    setPanel(id);
    document.querySelector(".main")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className={
        "grid min-h-[calc(100vh-68px)] transition-[grid-template-columns] duration-200 " +
        (sidebarOpen ? "min-[900px]:grid-cols-[280px_1fr]" : "min-[900px]:grid-cols-[0px_1fr]")
      }
    >
      <button
        className="copy-btn hidden min-[900px]:block fixed top-[78px] z-20 transition-[left] duration-200"
        style={{ left: sidebarOpen ? "290px" : "10px" }}
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>
      <aside
        className={
          "bg-white border-b-[3px] min-[900px]:border-b-0 min-[900px]:border-r-[3px] border-ink py-7 min-[900px]:sticky min-[900px]:top-[68px] min-[900px]:h-[calc(100vh-68px)] min-[900px]:overflow-y-auto max-[900px]:grid max-[900px]:grid-cols-2 max-[900px]:gap-x-3.5 max-[900px]:gap-y-1 max-[900px]:items-start px-5 min-[900px]:min-w-0 min-[900px]:overflow-x-hidden min-[900px]:whitespace-nowrap min-[900px]:transition-[padding] min-[900px]:duration-200 " +
          (sidebarOpen ? "" : "min-[900px]:px-0 min-[900px]:border-r-0")
        }
      >
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
        {DIFFICULTIES.map((level) => (
          <Fragment key={level}>
            <h4 className="font-display text-[0.95rem] tracking-[0.14em] text-[#777] mt-5 mb-2.5 max-[900px]:col-span-full capitalize">
              {level} examples
            </h4>
            {EXAMPLES.filter((e) => e.meta.difficulty === level).map((e) => (
              <button
                key={e.meta.id}
                className="side-link"
                data-active={panel === e.meta.id}
                onClick={() => show(e.meta.id)}
              >
                {e.meta.nav}
              </button>
            ))}
          </Fragment>
        ))}
        <h4 className="font-display text-[0.95rem] tracking-[0.14em] text-[#777] mt-5 mb-2.5 max-[900px]:col-span-full">
          References
        </h4>
        {REFS.map(([label, path]) => (
          <a
            key={path}
            className="side-link"
            href={`${GITHUB}/blob/main/${path}`}
            target="_blank"
            rel="noopener"
          >
            {label} ↗
          </a>
        ))}
      </aside>

      <main className="px-11 pt-12 pb-20 min-w-0 max-[900px]:px-5 max-[900px]:pt-9 max-[900px]:pb-[60px]">
        <div className="text-center mb-11">
          <span className="logo-mark display text-[2.2rem] inline-block mb-4.5 px-4 py-1.5">
            IS
          </span>
          <h1 className="text-[clamp(2rem,4.5vw,3.2rem)]">Convert your prompt</h1>
          <p className="text-ink-mute mt-2.5">
            Paste a raw prompt and get it back in ISATVON structure. Edit, copy, regenerate.
          </p>

          <Converter />

          <div className="flex flex-wrap gap-3 justify-center mt-7 mb-12">
            {EXAMPLES.map((e) => (
              <button key={e.meta.id} className="chip" onClick={() => show(e.meta.id)}>
                {e.meta.chip}
              </button>
            ))}
          </div>
        </div>

        <section className={panelCls} data-active={panel === "template"}>
          <h2 className="text-[2.2rem] mb-1.5">The ISATVON Template</h2>
          <p className="text-ink-mute mb-7 max-w-[680px]">
            Copy everything into any AI chat <strong>as your message</strong>, not into a system
            prompt or custom instructions. Replace the placeholders. Every section is required;
            supply a sensible default rather than deleting one.
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
              <PromptView text={FULL_TEMPLATE} />
            </div>
          </div>
          <div className={tabPaneCls} data-active={tab === "lite"}>
            <div className={codeCardCls}>
              <div className={codeHeadCls}>
                <span>prompt-template-lite.md</span>
                <CopyButton text={LITE_TEMPLATE} />
              </div>
              <PromptView text={LITE_TEMPLATE} />
            </div>
            <div className={whyCardCls}>
              <h3 className="text-[1.4rem] mb-3">When to use Lite</h3>
              <ul className={whyListCls}>
                <li>
                  Self-contained reasoning, coding, or one-shot questions with no constraints to
                  enforce and no external sources.
                </li>
                <li>The full 7 sections add cost without measurable quality gain there.</li>
                <li>
                  If the task has constraints, sources, or a written deliverable, use the full
                  template instead.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {EXAMPLES.map((e) => (
          <section className={panelCls} data-active={panel === e.meta.id} key={e.meta.id}>
            <h2 className="text-[2.2rem] mb-1.5">{e.title}</h2>
            <p className="text-ink-mute mb-4 max-w-[680px]">{e.meta.tagline}</p>
            <p className="flex flex-wrap gap-2 mb-7 text-[0.75rem] font-display tracking-[0.1em]">
              <span className="border-brutal px-2 py-0.5 bg-yellow capitalize">
                {e.meta.difficulty}
              </span>
              <span className="border-brutal px-2 py-0.5 bg-white">{e.meta.platform}</span>
              {e.meta.tags.map((t) => (
                <span key={t} className="border-brutal px-2 py-0.5 bg-white text-ink-mute">
                  {t}
                </span>
              ))}
            </p>
            <div className="b-card mb-7">
              <div className="font-display text-base tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-red-brand text-white">
                Raw prompt
              </div>
              <blockquote className="px-5 py-4 text-[1.1rem] italic text-ink-soft">
                {e.raw}
              </blockquote>
            </div>
            <div className={codeCardCls}>
              <div className={codeHeadCls}>
                <span>ISATVON prompt</span>
                <CopyButton text={e.prompt} />
              </div>
              <PromptView text={e.prompt} />
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
