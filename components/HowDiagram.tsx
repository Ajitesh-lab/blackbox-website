"use client";
import { useInView } from "./Reveal";

const NODES = [
  { t: "Your agent", d: "Unchanged. Points its model and tool calls at the gateway.", tag: "no SDK" },
  { t: "Gateway", d: "Sits outside the agent. Records every model and tool call as it passes through.", tag: "records" },
  { t: "Ledger", d: "Each entry is hashed with the one before it. Edit one and the chain breaks.", tag: "seals" },
  { t: "Verifier", d: "Checks an exported ledger offline. No account, no call home.", tag: "proves" },
  { t: "Replay", d: "Step through exactly what was called, when, with what result.", tag: "shows" },
];

export function HowDiagram() {
  const [ref, seen] = useInView<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className="grid gap-3 md:grid-cols-5">
      {NODES.map((n, i) => (
        <div key={n.t} style={{ transitionDelay: `${i * 180}ms` }}
          className={`card relative p-4 transition-all duration-700 ${seen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          <div className="font-mono text-[11px] uppercase tracking-wider text-accent">{n.tag}</div>
          <div className="mt-2 font-medium">{n.t}</div>
          <p className="mt-1.5 text-sm leading-6 text-muted">{n.d}</p>
          {i < NODES.length - 1 && (
            <span aria-hidden className={`absolute -right-2.5 top-1/2 z-10 hidden h-px w-5 bg-accent transition-all duration-700 md:block ${seen ? "scale-x-100" : "scale-x-0"}`} style={{ transitionDelay: `${i * 180 + 300}ms` }} />
          )}
        </div>
      ))}
    </div>
  );
}
