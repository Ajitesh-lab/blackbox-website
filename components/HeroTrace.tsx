"use client";
import { useEffect, useState } from "react";
import { buildBodies, GENERIC } from "@/lib/sample-run";
import { seal, short } from "@/lib/chain";

// Slow animated trace: entries are "written" to the ledger one at a time.
export function HeroTrace() {
  const [rows, setRows] = useState<{ line: string; hash: string }[]>([]);
  useEffect(() => {
    let live = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bodies = buildBodies(GENERIC);
    seal(bodies).then((hashes) => {
      const all = bodies.map((b, i) => ({ line: `${b.t}  ${b.name.padEnd(12)} ${b.args}`, hash: short(hashes[i]) }));
      if (reduce) { setRows(all.slice(0, 7)); return; }
      let n = 0;
      const tick = () => {
        if (!live) return;
        n++;
        setRows(all.slice(Math.max(0, n - 7), n));
        setTimeout(tick, n >= all.length ? 3500 : 1100);
        if (n >= all.length) n = 0;
      };
      tick();
    });
    return () => { live = false; };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-24 mx-auto hidden max-w-page justify-end px-6 opacity-60 lg:flex">
      <div className="w-[520px] overflow-hidden font-mono text-[11.5px] leading-6 [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_70%,transparent)]">
        {rows.map((r, i) => (
          <div key={r.hash + i} className="write flex justify-between gap-4 whitespace-nowrap text-muted">
            <span className="truncate">{r.line}</span>
            <span className="text-accent">{r.hash}</span>
          </div>
        ))}
        <span className="cursor" />
      </div>
    </div>
  );
}
