"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Cuboid } from "./Cuboid";

// Design size in px; the whole model is scaled to fit its container.
const LW = 680, LH = 440, LT = 9;      // lid: width, height, thickness
const BD = 450, BT = 13;               // base: depth, thickness
const TILT = 15;                       // camera pitch, and how far the lid leans back
const DESIGN_W = 820, DESIGN_H = 640;
const MIN_SCALE = 0.8;                 // below this the screen is too small to use: render flat

const ROWS = [14, 14, 13, 12];

/**
 * A laptop built from DOM faces. The lid opens as it scrolls into view and
 * ends up square to the viewer, so `children` (a live, interactive component)
 * render on the display at 1:1 and stay fully usable.
 */
export function Laptop({ children, title }: { children: ReactNode; title: string }) {
  // Server render and no-JS get the flat console; the model is an upgrade.
  const wrap = useRef<HTMLDivElement>(null);
  const lid = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / DESIGN_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const flat = scale === null || scale < MIN_SCALE;

  // The lid opens with the scroll, and the whole machine settles from a
  // three-quarter view to square-on as it reaches the middle of the screen.
  useEffect(() => {
    if (flat) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const update = () => {
      raf = 0;
      const el = wrap.current;
      if (!el || !lid.current || !rig.current) return;
      const b = el.getBoundingClientRect(), vh = window.innerHeight;
      const p = reduce ? 1 : ease(Math.min(1, Math.max(0, (vh * 0.85 - b.top) / (vh * 0.62))));
      lid.current.style.transform = `rotateX(${-90 + p * (90 + TILT)}deg)`;
      rig.current.style.transform = `translateY(-64px) rotateX(${-TILT - (1 - p) * 26}deg) rotateY(${(1 - p) * -24}deg)`;
      lid.current.style.pointerEvents = p > 0.98 ? "auto" : "none";
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [flat]);

  const s = scale ?? 1;

  return (
    <div ref={wrap}>
      {flat ? (
        <div className="card overflow-hidden">{children}</div>
      ) : (
        <div className="scene mx-auto" style={{ width: DESIGN_W * s, height: DESIGN_H * s, perspective: 2600 }}>
          <div style={{ width: DESIGN_W, height: DESIGN_H, transform: `scale(${s})`, transformOrigin: "0 0", transformStyle: "preserve-3d" }}>
            <div ref={rig} className="rig h-full w-full" style={{ transform: `translateY(-64px) rotateX(${-TILT}deg)` }}>
              <div className="ground" aria-hidden style={{ width: LW + 160, height: BD + 120, transform: `translate3d(0, ${LH / 2 + BT + 4}px, ${BD / 2}px) rotateX(90deg)` }} />
              {/* base */}
              <Cuboid className="alu" w={LW} h={BT} d={BD} style={{ transform: `translate3d(0, ${LH / 2 + BT / 2}px, ${BD / 2}px)` }}
                faces={{
                  top: (
                    <div aria-hidden className="absolute inset-0">
                      <div className="absolute left-[44px] right-[44px] top-[30px] grid h-[196px] gap-[5px] rounded-[8px] bg-[#101012] p-[7px]" style={{ gridTemplateRows: "repeat(5, 1fr)" }}>
                        {ROWS.map((k, r) => (
                          <div key={r} className="grid gap-[5px]" style={{ gridTemplateColumns: `repeat(${k}, 1fr)` }}>
                            {Array.from({ length: k }).map((_, i) => <span key={i} className="key" />)}
                          </div>
                        ))}
                        <div className="grid gap-[5px]" style={{ gridTemplateColumns: "1fr 1fr 1fr 1.3fr 5.6fr 1.3fr 1fr 1fr 1fr" }}>
                          {Array.from({ length: 9 }).map((_, i) => <span key={i} className="key" />)}
                        </div>
                      </div>
                      <div className="absolute bottom-[26px] left-1/2 h-[160px] w-[270px] -translate-x-1/2 rounded-[10px] border border-white/[.07] bg-white/[.015]" />
                    </div>
                  ),
                  front: <div aria-hidden className="absolute left-1/2 top-0 h-[4px] w-[92px] -translate-x-1/2 rounded-b-[5px] bg-black/60" />,
                }} />
              {/* lid, hinged along the back edge of the base */}
              <div ref={lid} className="lid" style={{ transformStyle: "preserve-3d", transform: `rotateX(${TILT}deg)` }}>
                <Cuboid className="lidc" w={LW} h={LH} d={LT} style={{ transform: `translateZ(${-LT / 2}px)` }}
                  faces={{
                    front: (
                      <div className="absolute inset-0 rounded-[14px_14px_0_0] bg-black p-[11px] pb-[18px]">
                        <div className="relative h-full w-full overflow-hidden rounded-[6px] border border-white/[.06] bg-bg" role="group" aria-label={title}>
                          {children}
                        </div>
                        <span aria-hidden className="absolute left-1/2 top-[4px] h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-white/10" />
                      </div>
                    ),
                    back: (
                      <div aria-hidden className="absolute inset-0 grid place-items-center rounded-[14px_14px_0_0] bg-gradient-to-b from-[#1c1c20] to-[#141417]">
                        <svg width="54" height="54" viewBox="0 0 32 32" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1.6">
                          <rect x="9" y="6.5" width="14" height="9.5" rx="3.5" /><rect x="9" y="14" width="15.5" height="11.5" rx="3.5" />
                        </svg>
                      </div>
                    ),
                  }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
