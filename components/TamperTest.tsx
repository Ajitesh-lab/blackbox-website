"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildBodies, GENERIC, type Flavor } from "@/lib/sample-run";
import { seal, verify, short, type Body, type VerifyResult } from "@/lib/chain";

export function TamperTest({ flavor = GENERIC }: { flavor?: Flavor }) {
  const original = useMemo(() => buildBodies(flavor), [flavor]);
  const [bodies, setBodies] = useState<Body[]>(original);
  const [sealed, setSealed] = useState<string[] | null>(null);
  const [res, setRes] = useState<VerifyResult | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const snapRef = useRef(0);

  useEffect(() => { seal(original).then(setSealed); }, [original]);
  useEffect(() => {
    if (!sealed) return;
    let live = true;
    verify(bodies, sealed).then((v) => { if (live) { setRes(v); if (v.firstBad !== null) snapRef.current++; } });
    return () => { live = false; };
  }, [bodies, sealed]);

  function edit(i: number, args: string) {
    setTouched(true);
    setBodies((bs) => bs.map((b, j) => (j === i ? { ...b, args } : b)));
  }
  function reset() { setBodies(original); setEditing(null); }

  const bad = res?.firstBad ?? null;
  const badCount = res ? res.rows.filter((r) => !r.ok).length : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="eyebrow">ledger · sample run</span>
          <button onClick={reset} disabled={!touched} className="font-mono text-xs text-muted enabled:hover:text-fg disabled:opacity-40">reset</button>
        </div>
        <ol className="divide-y divide-line font-mono text-[12.5px]" aria-label="Hash-chained log entries">
          {bodies.map((b, i) => {
            const r = res?.rows[i];
            const broken = r ? !r.ok : false;
            return (
              <li key={b.seq} className={`px-4 py-2.5 transition-colors ${broken ? "bg-accent/[0.07]" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className="w-5 shrink-0 text-muted">{String(b.seq).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className={b.kind === "model" ? "text-muted" : "text-fg"}>{b.name}</span>
                      <span className="text-muted">{b.t}</span>
                    </div>
                    {editing === i ? (
                      <input
                        autoFocus value={b.args}
                        onChange={(e) => edit(i, e.target.value)}
                        onBlur={() => setEditing(null)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === "Escape") && setEditing(null)}
                        aria-label={`Edit arguments for entry ${b.seq}`}
                        className="mt-1 w-full rounded border border-accent bg-bg px-2 py-1 text-fg"
                      />
                    ) : (
                      <button onClick={() => setEditing(i)} className="mt-0.5 block w-full text-left text-muted hover:text-fg" title="Click to edit">
                        {b.args} <span className="text-muted/60">→ {b.result}</span>
                      </button>
                    )}
                    <div className={`mt-1 flex items-center gap-2 ${broken ? "text-accent" : "text-ok/80"}`}>
                      <span aria-hidden className={`inline-block h-1.5 w-1.5 rounded-full ${broken ? "bg-accent" : "bg-ok/80"}`} />
                      <span>{r ? short(r.recomputed) : "…"}</span>
                      {broken && <span className="text-accent/80">≠ {sealed ? short(sealed[i]) : ""}</span>}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-col gap-4">
        <div className="card flex-1 overflow-hidden">
          <div className="border-b border-line px-4 py-2.5"><span className="eyebrow">verifier · offline</span></div>
          <pre className="whitespace-pre-wrap p-4 font-mono text-[12.5px] leading-6" aria-live="polite">
            <span className="text-muted">$ bbx verify run-0193.ledger</span>{"\n"}
            {res === null ? "…" : bad === null ? (
              <><span className="text-ok">chain intact, {bodies.length} entries</span>{"\n"}<span className="text-muted">head {short(sealed![sealed!.length - 1])}</span></>
            ) : (
              <span key={snapRef.current} className="snap inline-block">
                <span className="text-accent">FAIL entry {String(bad + 1).padStart(2, "0")} ({bodies[bad].name})</span>{"\n"}
                <span className="text-muted">expected </span>{short(sealed![bad])}{"\n"}
                <span className="text-muted">computed </span><span className="text-accent">{short(res.rows[bad].recomputed)}</span>{"\n"}
                <span className="text-muted">{badCount} of {bodies.length} entries no longer verify{"\n"}(entry {String(bad + 1).padStart(2, "0")} and everything after it)</span>
              </span>
            )}
            {res !== null && bad === null && !touched && <>{"\n\n"}<span className="text-muted">Click any row, change an argument, and watch it break.</span><span className="cursor ml-1" /></>}
          </pre>
        </div>
        <p className="text-xs leading-5 text-muted">
          Real SHA-256, computed in your browser. Nothing is sent anywhere. The sample run is illustrative, not customer data.
        </p>
      </div>
    </div>
  );
}
