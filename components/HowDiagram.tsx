"use client";
import { useInView } from "./Reveal";

const NODES = [
  { t: "Your agent", d: "Unchanged. Its model and tool calls are pointed at the gateway." },
  { t: "Gateway", d: "Sits outside the agent and records every model and tool call as it passes through." },
  { t: "Ledger", d: "Each entry is hashed together with the one before it. Edit one and every later hash breaks." },
  { t: "Verifier", d: "Checks an exported ledger offline, built so a third party can run it." },
  { t: "Replay", d: "Step through exactly what was called, when, with what result." },
];

// One continuous orange "seal" line runs through the pipeline: vertical on
// mobile, horizontal from md up. It draws itself as the diagram scrolls in.
export function HowDiagram({ wide = true }: { wide?: boolean }) {
  const [ref, seen] = useInView<HTMLOListElement>(0.2);
  return (
    <ol ref={ref} className={`relative grid gap-8 md:gap-5 ${wide ? "md:grid-cols-5" : ""}`}>
      <span aria-hidden className={`absolute bottom-3 left-[7px] top-3 w-px origin-top bg-accent transition-transform duration-[1400ms] ease-out md:bottom-auto md:left-3 md:right-3 md:top-[7px] md:h-px md:w-auto md:origin-left ${seen ? "scale-100" : "scale-0"}`} />
      {NODES.map((n, i) => (
        <li key={n.t} style={{ transitionDelay: `${i * 220}ms` }}
          className={`relative pl-8 transition-all duration-700 md:pl-0 md:pt-8 ${seen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          <span aria-hidden className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg md:top-0" />
          <div className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</div>
          <div className="mt-1 font-medium">{n.t}</div>
          <p className="mt-1.5 text-sm leading-6 text-muted">{n.d}</p>
        </li>
      ))}
    </ol>
  );
}
