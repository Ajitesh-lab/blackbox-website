"use client";
import { useMemo, useState } from "react";
import { buildBodies, GENERIC, type Flavor } from "@/lib/sample-run";

export function Replay({ flavor = GENERIC }: { flavor?: Flavor }) {
  const steps = useMemo(() => buildBodies(flavor), [flavor]);
  const [i, setI] = useState(4);
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
              <button onClick={() => setI(j)} className={`flex w-full items-center gap-2 px-4 py-2 text-left ${j === i ? "bg-accent/10 text-fg" : j < i ? "text-muted" : "text-muted/50"} hover:text-fg`}>
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
      <div className="border-t border-line px-4 py-3">
        <label htmlFor="scrub" className="sr-only">Scrub through the run</label>
        <input id="scrub" type="range" min={0} max={steps.length - 1} value={i} onChange={(e) => setI(+e.target.value)} className="w-full accent-[#ff4f00]" />
      </div>
    </div>
  );
}
