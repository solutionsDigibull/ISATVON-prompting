"use client";

import Link from "next/link";
import { useState } from "react";
import { GITHUB } from "@/app/config";

const LINKS: [string, string][] = [
  ["/how-it-works", "Framework"],
  ["/#how", "How It Works"],
  ["/#use-cases", "Use Cases"],
  ["/isatvon-vs-costar", "ISATVON vs COSTAR"],
  ["/prompting", "Prompt Library"],
];

const linkCls =
  "no-underline font-semibold text-[0.92rem] hover:bg-yellow hover:shadow-[2px_2px_0_var(--color-ink)]";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white border-b-[3px] border-ink">
      <div className="container flex items-center justify-between h-[68px] gap-4">
        <Link className="logo" href="/">
          <span className="logo-mark">IS</span>ISATVON
        </Link>
        <button
          className="min-[900px]:hidden bg-white border-brutal shadow-brutal-sm font-display text-base px-3 py-1.5 cursor-pointer"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
        <ul
          className={`${open ? "flex" : "hidden"} min-[900px]:flex list-none items-center gap-[26px]
            max-[900px]:absolute max-[900px]:top-[68px] max-[900px]:left-0 max-[900px]:right-0
            max-[900px]:bg-white max-[900px]:border-b-[3px] max-[900px]:border-ink
            max-[900px]:flex-col max-[900px]:items-start max-[900px]:p-5`}
          onClick={() => setOpen(false)}
        >
          {LINKS.map(([href, label], i) => (
            <li
              key={href}
              className="max-[900px]:motion-safe:animate-pane-in-stagger"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <Link className={linkCls} href={href}>
                {label}
              </Link>
            </li>
          ))}
          <li
            className="max-[900px]:motion-safe:animate-pane-in-stagger"
            style={{ animationDelay: "0.2s" }}
          >
            <a className={linkCls} href={GITHUB} target="_blank" rel="noopener">
              GitHub
            </a>
          </li>
          <li
            className="max-[900px]:motion-safe:animate-pane-in-stagger"
            style={{ animationDelay: "0.24s" }}
          >
            <Link
              className="b-btn b-btn-primary text-[0.95rem] px-[18px] py-[7px]"
              href="/prompting"
            >
              Convert Your Prompt
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
