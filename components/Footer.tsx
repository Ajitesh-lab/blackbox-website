"use client";
import Link from "next/link";
import { useState } from "react";
import { buildBodies, GENERIC } from "@/lib/sample-run";
import { seal, verify } from "@/lib/chain";

export function Footer() {
  const [msg, setMsg] = useState<string | null>(null);
  async function run() {
    const bodies = buildBodies(GENERIC);
    const sealed = await seal(bodies);
    const v = await verify(bodies, sealed);
    setMsg(v.firstBad === null ? `chain intact, ${bodies.length} entries` : `chain broken at entry ${v.firstBad + 1}`);
  }
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-page flex-col gap-6 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="text-fg">Black Box</div>
          <div>by Radius. Taking 10 founding teams.</div>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link className="hover:text-fg" href="/how-it-works">How it works</Link>
          <Link className="hover:text-fg" href="/pricing">Pricing</Link>
          <Link className="hover:text-fg" href="/security">Security &amp; FAQ</Link>
          <button onClick={run} className="rounded-md border border-line px-3 py-1.5 font-mono text-xs text-fg hover:border-muted" aria-live="polite">
            {msg ? <span className="text-ok">✓ {msg}</span> : "verify sample log"}
          </button>
        </div>
      </div>
    </footer>
  );
}
