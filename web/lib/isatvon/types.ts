/**
 * Public types for the ISATVON prompt format.
 *
 * The markdown in `templates/` and `examples/` is the canonical source; everything
 * the site renders is parsed from it (see `web/scripts/build-content.ts`). These
 * types are the contract between that parse step and the app.
 */

/** The seven ISATVON section keys, in canonical order. */
export const SECTION_KEYS = ["I", "S", "A", "T", "V", "O", "N"] as const;

/** The three keys a Lite prompt uses, in canonical order. */
export const LITE_KEYS = ["I", "O", "N"] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

/** Human-readable name of each section, as it appears in the `## X — Name` heading. */
export const SECTION_NAMES: Record<SectionKey, string> = {
  I: "Instructions",
  S: "Source",
  A: "Automation",
  T: "Tech stack",
  V: "Variables",
  O: "Outcome",
  N: "Notification",
};

/** A parsed prompt: every section present, mapped to its body text. */
export type ISATVONPrompt = Record<SectionKey, string>;

/** A parsed prompt that may be missing sections (Lite, or malformed input). */
export type PartialPrompt = Partial<ISATVONPrompt>;

/** One `## X — Name` block, kept in document order so ordering can be asserted. */
export type ParsedSection = {
  key: SectionKey;
  /** The heading text after the em dash, e.g. "Instructions". */
  name: string;
  body: string;
};

/** Difficulty tiers, ordered easiest first — drives the sidebar and examples/README.md. */
export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

/** How bad the "before" prompt is — the ladder contributors pick from. */
export type RawQuality = "naive" | "mediocre" | "near-good";

/** Frontmatter on every file in `examples/`. */
export type ExampleMeta = {
  id: string;
  order: number;
  platform: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  "raw-quality": RawQuality;
  "contributed-by": string;
  date: string;
  /** Sidebar label on the website. */
  nav: string;
  /** Short label for the example chips above the converter. */
  chip: string;
  /** One-line subtitle shown under the example's heading. */
  tagline: string;
};

/** A fully parsed example conversion. */
export type ExampleDoc = {
  /** Filename without extension, e.g. "claude-code-review". */
  slug: string;
  meta: ExampleMeta;
  /** The `# ...` H1 of the file. */
  title: string;
  /** The raw, unstructured "before" prompt. */
  raw: string;
  /** The converted ISATVON prompt, verbatim from the fenced block. */
  prompt: string;
  /** The "Why it's better" bullets. */
  why: string[];
};

/** A copy-paste template from `templates/`. */
export type TemplateDoc = {
  slug: string;
  /** Filename as published, e.g. "prompt-template.md". */
  file: string;
  /** The template body only — the prose preamble above the `---` rule is stripped. */
  body: string;
  /** Full templates carry all seven keys; lite carries I/O/N. */
  keys: SectionKey[];
};

/** Frontmatter of the repo-root SKILL.md. */
export type SkillManifest = {
  name: string;
  description: string;
  license: string;
  metadata?: {
    version?: string;
    compatibility?: string[];
  };
};
