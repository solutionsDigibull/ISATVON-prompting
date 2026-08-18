import {
  LITE_KEYS,
  SECTION_KEYS,
  type ISATVONPrompt,
  type ParsedSection,
  type PartialPrompt,
  type SectionKey,
} from "./types";

const SECTION_RE = /^## ([ISATVON]) — (.+)$/;
const ANY_H2_RE = /^## /;

/** Normalize line endings so a CRLF checkout parses identically to LF. */
function lines(md: string): string[] {
  return md.replace(/\r\n/g, "\n").split("\n");
}

/**
 * Split `## X — Name` blocks out of a markdown prompt, in document order.
 *
 * Any `## ` heading ends the current section, not just an ISATVON one — so trailing
 * prose like `## Why it's better` never gets absorbed into N.
 */
export function parseSections(md: string): ParsedSection[] {
  const out: ParsedSection[] = [];
  let current: ParsedSection | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (current) {
      current.body = buffer.join("\n").trim();
      out.push(current);
    }
    current = null;
    buffer = [];
  };

  for (const line of lines(md)) {
    const match = SECTION_RE.exec(line);
    if (match) {
      flush();
      current = { key: match[1] as SectionKey, name: match[2].trim(), body: "" };
    } else if (ANY_H2_RE.test(line)) {
      flush();
    } else if (current) {
      buffer.push(line);
    }
  }
  flush();
  return out;
}

/** Collapse parsed sections into a keyed object. A repeated key keeps the first. */
export function toPrompt(sections: ParsedSection[]): PartialPrompt {
  const prompt: PartialPrompt = {};
  for (const section of sections) {
    if (!(section.key in prompt)) prompt[section.key] = section.body;
  }
  return prompt;
}

/** True when the sections appear in canonical order and none are missing. */
export function hasCanonicalOrder(
  sections: ParsedSection[],
  expected: readonly SectionKey[] = SECTION_KEYS
): boolean {
  const keys = sections.map((s) => s.key);
  return keys.length === expected.length && keys.every((k, i) => k === expected[i]);
}

/** Which section set a prompt uses, or null if it matches neither shape. */
export function promptMode(sections: ParsedSection[]): "full" | "lite" | null {
  if (hasCanonicalOrder(sections, SECTION_KEYS)) return "full";
  if (hasCanonicalOrder(sections, LITE_KEYS)) return "lite";
  return null;
}

/** Parse a full seven-section prompt, throwing if any section is missing or out of order. */
export function parsePrompt(md: string): ISATVONPrompt {
  const sections = parseSections(md);
  if (!hasCanonicalOrder(sections)) {
    const found = sections.map((s) => s.key).join("") || "(none)";
    throw new Error(`Expected sections ISATVON in order, found: ${found}`);
  }
  return toPrompt(sections) as ISATVONPrompt;
}

/** Extract the first fenced code block, optionally requiring an info string. */
export function parseFenced(md: string, lang?: string): string | null {
  const fence = lang ? new RegExp("^```" + lang + "\\s*$") : /^```/;
  const src = lines(md);
  const start = src.findIndex((l) => fence.test(l));
  if (start === -1) return null;
  const end = src.findIndex((l, i) => i > start && /^```\s*$/.test(l));
  if (end === -1) return null;
  return src
    .slice(start + 1, end)
    .join("\n")
    .trim();
}

export type Frontmatter = { meta: Record<string, unknown>; body: string };

/**
 * Read a `---` delimited frontmatter block.
 *
 * Deliberately a subset of YAML — flat `key: value`, quoted strings, inline
 * `[a, b]` arrays, `- item` lists, and one level of nesting. That covers every
 * key this repo uses; anything richer should be a real schema, not more parser.
 */
export function parseFrontmatter(md: string): Frontmatter {
  const src = md.replace(/\r\n/g, "\n");
  if (!src.startsWith("---\n")) return { meta: {}, body: src };
  const end = src.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: src };

  const block = src.slice(4, end).split("\n");
  // Drop the blank line(s) between the closing `---` and the first line of content.
  const body = src.slice(src.indexOf("\n", end + 1) + 1).replace(/^\n+/, "");
  const meta: Record<string, unknown> = {};

  let parentKey: string | null = null;
  let listKey: string | null = null;
  let listTarget: Record<string, unknown> = meta;

  for (const line of block) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const listItem = /^(\s*)- (.*)$/.exec(line);
    if (listItem && listKey) {
      if (!Array.isArray(listTarget[listKey])) listTarget[listKey] = [];
      (listTarget[listKey] as unknown[]).push(scalar(listItem[2]));
      continue;
    }

    const entry = /^(\s*)([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!entry) continue;
    const [, indent, key, rest] = entry;
    const nested = indent.length > 0;
    const target = nested && parentKey ? (meta[parentKey] as Record<string, unknown>) : meta;

    if (!nested) parentKey = null;

    if (rest === "") {
      // Either a nested object or the head of a `- item` list; decided by what follows.
      target[key] = {};
      listKey = key;
      listTarget = target;
      if (!nested) parentKey = key;
      continue;
    }

    target[key] = scalar(rest);
    listKey = null;
  }

  // A `key:` that collected list items became an array; one that collected nothing
  // and has no children stays an empty object -> normalize to an empty array.
  normalizeEmpties(meta);
  return { meta, body };
}

function normalizeEmpties(obj: Record<string, unknown>) {
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) continue;
    if (value && typeof value === "object") {
      const inner = value as Record<string, unknown>;
      if (Object.keys(inner).length === 0) obj[key] = [];
      else normalizeEmpties(inner);
    }
  }
}

function scalar(raw: string): unknown {
  const value = raw.trim();
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    return inner ? inner.split(",").map((v) => scalar(v)) : [];
  }
  if (
    (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
    (value.startsWith("'") && value.endsWith("'") && value.length > 1)
  ) {
    return value.slice(1, -1).replace(/\\"/g, '"');
  }
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}

/** Turn a `- item` list under a key into a real array (used while parsing lists). */
export function ensureArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (value === undefined || value === null || value === "") return [];
  return [String(value)];
}
