"use client";
import { useEffect, useState } from "react";
import { buildBodies, GENERIC } from "@/lib/sample-run";
import { seal, short, verify } from "@/lib/chain";

// A crisp, full-opacity ledger card: entries are written one by one, then the
// chain is verified. Real SHA-256, same construction as the tamper test.
export function HeroLedger() {
  const [state, setState] = useState<{ rows: { t: string; name: string; args: string; hash: string }[]; ok: boolean } | null>(null);
  useEffect(() => {
    const bodies = buildBodies(GENERIC).slice(0, 6);
    seal(bodies).then(async (h) => {
      const v = await verify(bodies, h);
      setState({ rows: bodies.map((b, i) => ({ t: b.t, name: b.name, args: b.args, hash: short(h[i]) })), ok: v.firstBad === null });
    });
  }, []);
  return (
    <div className="card overflow-hidden shadow-[0_0_0_1px_rgba(255,79,0,.08),0_24px_60px_-24px_rgba(255,79,0,.18)]" aria-label="Sample ledger">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-xs text-muted">
        <span>run-0193.ledger</span><span>sample</span>
      </div>
      <ol className="divide-y divide-line font-mono text-[12px]">
        {Array.from({ length: 6 }).map((_, i) => {
          const r = state?.rows[i];
          return (
            <li key={i} className={`flex items-baseline gap-3 px-4 py-2.5 ${i > 2 ? "hidden lg:flex" : ""} ${r ? "write" : ""}`} style={r ? { animationDelay: `${i * 260}ms` } : { minHeight: 41 }}>
              <span className="w-4 shrink-0 text-muted">{i + 1}</span>
              <span className="w-[86px] shrink-0 truncate">{r?.name ?? ""}</span>
              <span className="min-w-0 flex-1 truncate text-muted">{r?.args ?? ""}</span>
              <span className="shrink-0 text-accent">{r?.hash ?? ""}</span>
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-2 border-t border-line px-4 py-2.5 font-mono text-xs text-ok" role="status">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ok" />
        {state ? (state.ok ? "chain intact" : "chain broken") : "verifying…"}
      </div>
    </div>
  );
}
