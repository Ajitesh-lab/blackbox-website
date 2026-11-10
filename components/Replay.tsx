"use client";
import { useEffect, useMemo, useState } from "react";
import { buildBodies, GENERIC, type Flavor } from "@/lib/sample-run";

/** The replay console. Fills its parent, so it works flat or on the laptop display. */
export function Replay({ flavor = GENERIC }: { flavor?: Flavor }) {
  const steps = useMemo(() => buildBodies(flavor), [flavor]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => (i >= steps.length - 1 ? setPlaying(false) : setI(i + 1)), 900);
    return () => clearTimeout(t);
  }, [playing, i, steps.length]);
  const s = steps[i];
  return (
    <div className="flex h-full min-h-[380px] flex-col bg-bg">
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-line px-3">
        <span aria-hidden className="flex gap-1.5">{[0, 1, 2].map((k) => <span key={k} className="h-2 w-2 rounded-full bg-line" />)}</span>
        <span className="label">Replay · run-0193</span>
        <span className="tnum ml-auto font-mono text-[11px] text-muted">{s.t}</span>
      </div>
      <div className="grid min-h-0 flex-1 md:grid-cols-[210px_1fr]">
        <ol className="max-h-[220px] overflow-auto border-b border-line font-mono text-xs md:max-h-none md:border-b-0 md:border-r" aria-label="Recorded steps">
          {steps.map((x, j) => (
            <li key={x.seq}>
              <button type="button" aria-current={j === i ? "step" : undefined} onClick={() => { setPlaying(false); setI(j); }}
                className={`flex h-[30px] w-full items-center gap-2.5 border-l-2 px-3 text-left transition-colors ${j === i ? "border-accent bg-white/[.04] text-fg" : "border-transparent text-muted hover:text-fg"}`}>
                <span className={j <= i ? "text-accent" : "text-dim"}>{String(x.seq).padStart(2, "0")}</span>
                <span className="truncate">{x.name}</span>
                <span className="ml-auto text-[10px] text-dim">{x.kind}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="min-w-0 p-5 font-mono text-[13px] leading-6" aria-live="polite">
          <div className="label">{s.kind === "model" ? "Model call" : "Tool call"} · entry {String(s.seq).padStart(2, "0")} of {steps.length}</div>
          <div className="mt-2 font-sans text-2xl font-medium tracking-tight text-fg">{s.name}</div>
          <dl className="mt-5 grid grid-cols-[64px_1fr] gap-x-4 gap-y-3">
            <dt className="text-dim">args</dt><dd className="min-w-0 break-words">{s.args}</dd>
            <dt className="text-dim">result</dt><dd className="min-w-0 break-words text-ok">{s.result}</dd>
            <dt className="text-dim">at</dt><dd className="tnum text-muted">{s.t}</dd>
          </dl>
        </div>
      </div>
      <div className="flex h-12 shrink-0 items-center gap-3 border-t border-line px-3">
        <button type="button" className="h-7 w-14 rounded border border-line font-mono text-[11px] hover:border-dim" onClick={() => { if (i >= steps.length - 1) setI(0); setPlaying((p) => !p); }}>{playing ? "pause" : "play"}</button>
        <label htmlFor="scrub" className="sr-only">Scrub through the run</label>
        <input id="scrub" type="range" min={0} max={steps.length - 1} value={i} onChange={(e) => { setPlaying(false); setI(+e.target.value); }} className="scrub w-full flex-1" />
      </div>
    </div>
  );
}
