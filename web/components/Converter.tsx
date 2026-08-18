"use client";

import { useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { fireConfetti } from "./Confetti";
import { detectPlatform, errorClass, latencyBucket, lengthBucket } from "@/lib/analytics";
import { parseSections, toPrompt } from "@/lib/isatvon/parse";

const fieldCls =
  "font-body text-[0.95rem] leading-normal border-brutal shadow-brutal-sm bg-white px-4 py-3.5 w-full resize-y";

/** Hand the browser a file without a round trip to the server. */
function download(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Converter() {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const [jsonLabel, setJsonLabel] = useState("JSON");
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const preRef = useRef<HTMLPreElement>(null);

  async function convert() {
    if (!raw.trim() || loading) return;
    setLoading(true);
    setError(null);
    setFeedback(null);
    const started = Date.now();
    let status: number | null = null;
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw }),
      });
      status = res.status;
      const data = await res.json().catch(() => null);
      if (!res.ok || typeof data?.prompt !== "string") {
        throw new Error(data?.error?.message || `${res.status} ${res.statusText}`);
      }
      setResult(data.prompt);
      setEditing(false);
      fireConfetti();
      track("convert_success", {
        platform: detectPlatform(raw),
        input: lengthBucket(raw.length),
        output: lengthBucket(data.prompt.length),
        latency: latencyBucket(Date.now() - started),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      track("convert_fail", {
        reason: errorClass(status),
        input: lengthBucket(raw.length),
        latency: latencyBucket(Date.now() - started),
      });
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

  /** The same prompt as `{ I: "...", S: "..." }`, for anyone wiring it into an API. */
  async function copyJson() {
    if (result === null) return;
    const sections = toPrompt(parseSections(result));
    try {
      await navigator.clipboard.writeText(JSON.stringify(sections, null, 2));
      setJsonLabel("Copied!");
    } catch {
      setJsonLabel("Blocked");
    }
    track("export", { format: "json" });
    setTimeout(() => setJsonLabel("JSON"), 1600);
  }

  function vote(value: "up" | "down") {
    setFeedback(value);
    track("conversion_feedback", { value, platform: detectPlatform(raw) });
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
          disabled={loading}
        />
        <button
          className="b-btn b-btn-primary justify-self-center"
          disabled={!raw.trim() || loading}
          onClick={convert}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" /> Converting…
            </>
          ) : (
            "Convert to ISATVON"
          )}
        </button>
      </div>

      {/* role="alert" already implies an assertive live region; a wrapping aria-live
          container on top of it just produces a second announcement. */}
      {error && (
        <div className="b-card max-w-[720px] mx-auto mt-6 text-left" role="alert">
          <div className="font-display text-[1.1rem] tracking-[0.1em] border-b-[3px] border-ink px-[18px] py-2.5 bg-red-brand text-white">
            Conversion failed
          </div>
          <div className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-[0.95rem] m-0">{error}</p>
            <button className="copy-btn" onClick={convert} disabled={loading}>
              Try again
            </button>
          </div>
        </div>
      )}

      {result !== null && (
        <div
          className="b-card max-w-[720px] mx-auto mt-7 text-left"
          role="group"
          aria-label="Converted prompt"
        >
          <div className="flex items-center justify-between gap-3 bg-ink text-white border-b-[3px] border-ink px-4 py-2.5 font-display text-base tracking-[0.1em]">
            <span>isatvon-prompt.md</span>
            <span className="flex gap-2 flex-wrap">
              <button className="copy-btn" onClick={() => setEditing((e) => !e)}>
                {editing ? "Done" : "Edit"}
              </button>
              <button className="copy-btn" onClick={convert} disabled={loading}>
                {loading ? "…" : "Regenerate"}
              </button>
              <button
                className="copy-btn"
                onClick={() => {
                  download("isatvon-prompt.md", result);
                  track("export", { format: "md" });
                }}
              >
                Download
              </button>
              <button className="copy-btn" onClick={copyJson}>
                {jsonLabel}
              </button>
              <button className="copy-btn" onClick={copy}>
                {copyLabel}
              </button>
            </span>
          </div>
          {editing ? (
            <textarea
              className="border-none shadow-none min-h-[320px] font-mono text-[0.83rem] leading-relaxed p-[22px] w-full bg-white"
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
          <div className="flex items-center gap-3 border-t-[3px] border-ink px-4 py-2.5 text-[0.85rem]">
            {feedback ? (
              <span className="text-ink-mute">Thanks — noted.</span>
            ) : (
              <>
                <span className="text-ink-mute">Was this conversion useful?</span>
                <button className="copy-btn" onClick={() => vote("up")} aria-label="Yes, useful">
                  👍
                </button>
                <button
                  className="copy-btn"
                  onClick={() => vote("down")}
                  aria-label="No, not useful"
                >
                  👎
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
