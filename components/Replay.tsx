"use client";
import { useEffect, useMemo, useState } from "react";
import { buildBodies, GENERIC, type Flavor } from "@/lib/sample-run";

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
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="eyebrow">replay · run-0193</span>
        <span className="font-mono text-xs text-muted">{s.t}</span>
      </div>
      <div className="grid md:grid-cols-[220px_1fr]">
        <ol className="max-h-[300px] overflow-auto border-b border-line font-mono text-xs md:border-b-0 md:border-r">
          {steps.map((x, j) => (
            <li key={x.seq}>
              <button onClick={() => { setPlaying(false); setI(j); }} className={`flex w-full items-center gap-2 px-4 py-2 text-left ${j === i ? "bg-accent/10 text-fg" : "text-muted"} hover:text-fg`}>
                <span className={`h-1.5 w-1.5 rounded-full ${j <= i ? "bg-accent" : "bg-line"}`} />
                {String(x.seq).padStart(2, "0")} {x.name}
              </button>
            </li>
          ))}
        </ol>
        <div className="p-5 font-mono text-[13px] leading-7">
          <div className="text-muted">{s.kind === "model" ? "model call" : "tool call"}</div>
          <div className="text-lg text-fg">{s.name}</div>
          <div className="mt-3 text-muted">args</div>
          <div className="break-words">{s.args}</div>
          <div className="mt-3 text-muted">result</div>
          <div className="break-words text-ok">{s.result}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-line px-4 py-3">
        <button type="button" className="min-h-8 rounded-md border border-line px-3 font-mono text-xs hover:border-muted" onClick={() => { if (i >= steps.length - 1) setI(0); setPlaying((p) => !p); }}>{playing ? "pause" : "play"}</button>
        <label htmlFor="scrub" className="sr-only">Scrub through the run</label>
        <input id="scrub" type="range" min={0} max={steps.length - 1} value={i} onChange={(e) => { setPlaying(false); setI(+e.target.value); }} className="w-full flex-1 accent-[#ff4f00]" />
      </div>
    </div>
  );
}
