"use client";
import { useEffect, useRef, useState } from "react";
import { Cuboid } from "./Cuboid";
import { buildBodies, GENERIC } from "@/lib/sample-run";
import { seal, short } from "@/lib/chain";

const STEPS = [
  { t: "Your agent", d: "Unchanged. Its model and tool calls are pointed at the gateway." },
  { t: "Gateway", d: "Sits outside the agent and records every model and tool call as it passes through." },
  { t: "Ledger", d: "Each entry is hashed together with the one before it. Edit one and every later hash breaks." },
  { t: "Verifier", d: "Checks an exported ledger offline, built so a third party can run it." },
  { t: "Replay", d: "Step through exactly what was called, when, with what result." },
];

const W = 300, D = 204, LID = 80, SHELL = 96, N = 5;
const SAMPLE = buildBodies(GENERIC).slice(0, N);

/**
 * Scroll-driven explainer. The recorder stays pinned while the five parts
 * scroll past; it turns with the scroll and changes state per part: calls
 * stream through it, it opens to show the sealed entries, they verify, then
 * fan out for replay. All text is real DOM, in order, for readers and crawlers.
 */
export function Story() {
  const root = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const [step, setStep] = useState(0);
  const [hashes, setHashes] = useState<string[]>([]);

  useEffect(() => { seal(SAMPLE).then((h) => setHashes(h.map(short))); }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = root.current, r = rig.current;
      if (!el || !r) return;
      const mid = window.innerHeight * 0.55;
      let best = 0, dist = Infinity;
      items.current.forEach((li, i) => {
        if (!li) return;
        const b = li.getBoundingClientRect(), d = Math.abs((b.top + b.bottom) / 2 - mid);
        if (d < dist) { dist = d; best = i; }
      });
      setStep(best);
      const box = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - box.top) / (box.height + window.innerHeight)));
      if (!reduce) r.style.transform = `rotateX(${-24 + p * 8}deg) rotateY(${-58 + p * 78}deg)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  const open = step >= 2, verified = step >= 3, fan = step >= 4, flow = step === 1;

  return (
    <div ref={root} className="relative grid gap-x-16 lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
      {/* pinned model */}
      <div className="pointer-events-none sticky top-14 z-10 -mx-5 h-[300px] overflow-x-clip lg:overflow-visible bg-gradient-to-b from-bg from-80% to-transparent sm:-mx-8 lg:top-0 lg:mx-0 lg:h-screen lg:bg-none" aria-hidden>
        <div className="scene flex h-full items-center justify-center">
          <div className="scale-[.55] sm:scale-[.7] lg:scale-[1.2]">
            <div className="transition-transform duration-700 ease-out" style={{ transform: `translateY(${open ? 70 : 0}px)`, transformStyle: "preserve-3d" }}>
              <div ref={rig} className="rig" style={{ transform: "rotateX(-22deg) rotateY(-34deg)" }}>
                <div className="ground" style={{ transform: "translateY(96px) rotateX(90deg)" }} />
                {/* calls in, calls out */}
                {[-1, 1].map((side) => (
                  <div key={side} className={`beam ${flow ? "on" : ""}`} style={{ transform: `translateX(${side * (W / 2 + 82)}px)` }}>
                    <span className="absolute -top-6 font-mono text-[11px] tracking-[.14em] text-muted" style={side < 0 ? { left: 0 } : { right: 0 }}>{side < 0 ? "AGENT" : "MODELS · TOOLS"}</span>
                  </div>
                ))}
                {/* sealed entries */}
                {SAMPLE.map((b, i) => (
                  <Cuboid key={b.seq} className="slab entry" w={W - 44} h={13} d={D - 44}
                    style={{
                      opacity: open ? 1 : 0, transitionDelay: `${open ? i * 60 : 0}ms`,
                      transform: !open ? `translateY(${-10 + i * 4}px)` : fan ? `translate3d(${(i - 2) * 46}px, ${-150 + i * 26}px, ${(2 - i) * 34}px)` : `translateY(${-142 + i * 21}px)`,
                    }}
                    faces={{
                      front: (
                        <div className="flex h-full items-center gap-2 px-2 font-mono text-[8.5px] leading-none">
                          <span className={`h-1 w-1 rounded-full transition-colors duration-300 ${verified ? "bg-ok" : "bg-white/20"}`} style={{ transitionDelay: `${verified ? 200 + i * 140 : 0}ms` }} />
                          <span className="text-dim">{String(b.seq).padStart(2, "0")}</span><span className="text-muted">{b.name}</span>
                          <span className="tnum ml-auto text-accent">{hashes[i] ?? ""}</span>
                        </div>
                      ),
                    }} />
                ))}
                {/* shell */}
                <Cuboid className="bb" w={W} h={SHELL} d={D} style={{ transform: `translateY(${SHELL / 2 - 8}px)` }}
                  faces={{
                    front: (
                      <>
                        <span className="stripe" style={{ left: 22 }} />
                        <div className="absolute bottom-[16px] left-[46px] right-[18px] rounded-[3px] border border-white/[.07] bg-black/50 px-2.5 py-2 font-mono text-[10px] leading-[15px]">
                          <div className="flex justify-between text-dim"><span>HEAD</span><span>{verified ? "VERIFIED" : open ? "SEALED" : flow ? "REC" : "IDLE"}</span></div>
                          <div className="tnum text-accent">{hashes[N - 1] ?? "········…····"}</div>
                        </div>
                      </>
                    ),
                    top: <div className="absolute inset-0 bg-[#040405]" />,
                    right: <div className="absolute bottom-[18px] left-[22px] right-[22px] h-[30px]" style={{ background: "repeating-linear-gradient(180deg, rgba(255,255,255,.07) 0 1px, transparent 1px 6px)" }} />,
                    back: <span className="stripe" style={{ right: 22 }} />,
                  }} />
                {/* lid */}
                <Cuboid className="bb lidpart" w={W} h={LID} d={D} style={{ transform: `translateY(${-LID / 2 - 8 - (open ? 156 : 0)}px)` }}
                  faces={{
                    front: (
                      <>
                        <span className="stripe" style={{ left: 22 }} />
                        <div className="absolute left-[46px] top-[20px] font-mono text-[11px] font-medium leading-[15px] tracking-[.2em] text-fg/85">FLIGHT RECORDER<br /><span className="text-muted">DO NOT OPEN</span></div>
                      </>
                    ),
                    top: <span className="stripe" style={{ left: 22 }} />,
                    back: <span className="stripe" style={{ right: 22 }} />,
                    bottom: <div className="absolute inset-0 bg-[#040405]" />,
                  }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* the five parts */}
      <ol className="relative lg:py-[22vh]">
        {STEPS.map((s, i) => (
          <li key={s.t} ref={(el) => { items.current[i] = el; }} className={`flex min-h-[46vh] flex-col justify-center py-8 transition-opacity duration-500 lg:min-h-[62vh] ${i === step ? "opacity-100" : "opacity-30"}`}>
            <div className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}<span className="ml-2 text-dim">/ 05</span></div>
            <h3 className="display mt-3 text-4xl sm:text-5xl">{s.t}</h3>
            <p className="mt-4 max-w-md text-lg leading-8 text-muted">{s.d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
