"use client";

import { useState } from "react";
import { parseSections } from "@/lib/isatvon/parse";
import { SECTION_NAMES, type SectionKey } from "@/lib/isatvon/types";

/**
 * Renders an ISATVON prompt with its structure visible: a section rail you can click
 * to jump to a block, and `[PLACEHOLDER]` tokens picked out of the prose.
 *
 * The highlighter is a two-token regex rather than a syntax-highlighting library —
 * this content is one known format that is 90% prose, and Shiki/Prism would be a
 * megabyte of parser to colour two things.
 */
const PLACEHOLDER = /(\[[^\]\n]+\])/g;

function Body({ text }: { text: string }) {
  return (
    <>
      {text.split(PLACEHOLDER).map((part, i) =>
        // startsWith/endsWith, not .test — a /g regex carries lastIndex between calls
        part.startsWith("[") && part.endsWith("]") ? (
          <mark key={i} className="bg-yellow px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function PromptView({ text }: { text: string }) {
  const sections = parseSections(text);
  const [active, setActive] = useState<SectionKey | null>(null);

  // Nothing parsed (an edited or partial prompt) — show it as plain text.
  if (!sections.length) {
    return (
      <pre className="p-[22px] overflow-x-auto text-[0.83rem] leading-relaxed bg-white whitespace-pre-wrap break-words">
        {text}
      </pre>
    );
  }

  return (
    <div className="grid min-[760px]:grid-cols-[132px_1fr]">
      <nav
        className="flex min-[760px]:flex-col gap-1 p-3 border-b-[3px] min-[760px]:border-b-0 min-[760px]:border-r-[3px] border-ink overflow-x-auto"
        aria-label="Prompt sections"
      >
        {sections.map((s) => (
          <button
            key={s.key}
            className="side-link mb-0 whitespace-nowrap text-[0.8rem]"
            data-active={active === s.key}
            onClick={() => setActive(active === s.key ? null : s.key)}
            title={SECTION_NAMES[s.key]}
          >
            <b className="font-display text-base mr-1.5">{s.key}</b>
            <span className="text-ink-mute">{s.name}</span>
          </button>
        ))}
      </nav>

      <div className="min-w-0 p-[22px] grid gap-4 text-[0.83rem] leading-relaxed">
        {sections.map((s) => (
          <section
            key={s.key}
            data-active={active === s.key}
            className="grid gap-1 -mx-2 px-2 py-1 data-[active=true]:bg-yellow/25 data-[active=true]:outline-2 data-[active=true]:outline-ink"
          >
            <h4 className="font-display text-[1.05rem] tracking-[0.08em] m-0">
              {s.key} — {s.name}
            </h4>
            <pre className="m-0 font-mono overflow-x-auto whitespace-pre-wrap break-words">
              <Body text={s.body} />
            </pre>
          </section>
        ))}
      </div>
    </div>
  );
}
