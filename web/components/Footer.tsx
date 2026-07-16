import Link from "next/link";
import { GITHUB } from "@/app/config";

const COLUMNS: [string, [string, string, boolean?][]][] = [
  [
    "Framework",
    [
      ["/how-it-works", "How ISATVON Works"],
      [`${GITHUB}/blob/main/templates/prompt-template.md`, "Full Template", true],
      [`${GITHUB}/blob/main/references/prompting-guide.md`, "Prompting Guide", true],
      ["/isatvon-vs-costar", "ISATVON vs COSTAR"],
    ],
  ],
  [
    "Resources",
    [
      ["/prompting", "Prompt Converter"],
      ["/prompting", "Prompt Library"],
      [`${GITHUB}/tree/main/examples`, "Examples", true],
      [`${GITHUB}/blob/main/INSTALL.md`, "Installation Guide", true],
      [GITHUB, "GitHub", true],
    ],
  ],
  [
    "Ecosystem",
    [
      ["https://github.com/isatvon/isatvon", "ISATVON Specification", true],
      ["https://github.com/isatvon/isatvon-validator", "Validator", true],
      [`${GITHUB}/blob/main/CONTRIBUTING.md`, "Contributing", true],
      ["https://digibull.ai", "DigiBull AI", true],
    ],
  ],
  [
    "Legal",
    [
      [`${GITHUB}/blob/main/LICENSE`, "Apache 2.0 Licence", true],
      ["/privacy", "Privacy Policy"],
      ["/terms", "Terms of Use"],
    ],
  ],
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white pt-[60px] pb-8">
      <div className="container">
        <div className="grid grid-cols-1 min-[560px]:grid-cols-2 min-[900px]:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10 mb-11 [&_ul_a]:text-[#ccc] [&_ul_a]:no-underline [&_ul_a]:text-[0.92rem] [&_ul_a:hover]:text-white [&_ul_a:hover]:underline">
          <div>
            <Link className="logo text-white mb-3" href="/">
              <span className="logo-mark">IS</span>ISATVON
            </Link>
            <p className="text-[#aaa] text-[0.9rem] max-w-[300px]">
              Structured prompting for reliable, reviewable and reusable AI
              outputs. An open prompting framework by DigiBull AI.
            </p>
          </div>
          {COLUMNS.map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-[1.2rem] tracking-[0.1em] mb-3.5 text-yellow">
                {title}
              </h4>
              <ul className="list-none grid gap-2">
                {links.map(([href, label, external]) => (
                  <li key={label}>
                    {external ? (
                      <a href={href} target="_blank" rel="noopener">
                        {label}
                      </a>
                    ) : (
                      <Link href={href}>{label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-[#333] pt-[22px] text-[0.85rem] text-[#888] flex justify-between flex-wrap gap-2.5">
          <span>© 2026 DigiBull AI. ISATVON is available under the Apache 2.0 Licence.</span>
          <a
            className="text-[#888] hover:text-white hover:underline"
            href={GITHUB}
            target="_blank"
            rel="noopener"
          >
            github.com/isatvon/isatvon-prompting
          </a>
        </div>
      </div>
    </footer>
  );
}
