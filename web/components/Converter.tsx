"use client";

import { useRef, useState } from "react";

const fieldCls =
  "font-body text-[0.95rem] leading-normal border-brutal shadow-brutal-sm bg-white px-4 py-3.5 w-full resize-y";

export default function Converter() {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const preRef = useRef<HTMLPreElement>(null);

  async function convert() {
    if (!raw.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || res.status + " " + res.statusText);
      }
      setResult(data.choices[0].message.content.trim());
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setLoading(false);
  }

  async function copy() {
    if (result === null) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopyLabel("Copied!");
    } catch {
      // clipboard API needs a secure context; fall back to selecting the text
      if (preRef.current) window.getSelection()?.selectAllChildren(preRef.current);
      setCopyLabel("Select + Ctrl+C");
    }
    setTimeout(() => setCopyLabel("Copy"), 1600);
  }

  return (
    <>
      <div className="max-w-[720px] mx-auto mt-7 grid gap-3.5 text-left">
        <textarea
          className={fieldCls}
          rows={5}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder='e.g. "Write a launch email for our new app"'
          aria-label="Raw prompt"
        />
        <button
          className="b-btn b-btn-primary justify-self-center"
          disabled={!raw.trim() || loading}
          onClick={convert}
        >
          {loading ? "Converting..." : "Convert to ISATVON"}
        </button>
      </div>

      {error && (
        <div className="b-card max-w-[720px] mx-auto mt-6 text-left">
          <div className="font-display text-[1.1rem] tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-red-brand text-white">
            Conversion failed
          </div>
          <p className="px-5 py-4 text-[0.95rem]">{error}</p>
        </div>
      )}

      {result !== null && (
        <div className="b-card max-w-[720px] mx-auto mt-7 text-left">
          <div className="flex items-center justify-between gap-3 bg-ink text-white border-b-[3px] border-ink px-4 py-2.5 font-display text-base tracking-[0.1em]">
            <span>isatvon-prompt.md</span>
            <span className="flex gap-2">
              <button className="copy-btn" onClick={() => setEditing((e) => !e)}>
                {editing ? "Done" : "Edit"}
              </button>
              <button className="copy-btn" onClick={convert} disabled={loading}>
                {loading ? "..." : "Regenerate"}
              </button>
              <button className="copy-btn" onClick={copy}>
                {copyLabel}
              </button>
            </span>
          </div>
          {editing ? (
            <textarea
              className="border-none shadow-none min-h-[320px] font-mono text-[0.83rem] leading-relaxed p-[22px] w-full"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              aria-label="Edit converted prompt"
              autoFocus
            />
          ) : (
            <pre
              ref={preRef}
              className="p-[22px] overflow-x-auto text-[0.83rem] leading-relaxed bg-white whitespace-pre-wrap break-words"
            >
              {result}
            </pre>
          )}
        </div>
      )}
    </>
  );
}
