"use client";
import { useEffect, useRef, useState } from "react";
import { Cuboid } from "./Cuboid";
import { buildBodies, GENERIC } from "@/lib/sample-run";
import { seal, short, verify } from "@/lib/chain";

const W = 300, H = 176, D = 204;
const BASE = { rx: -21, ry: -33 };

/**
 * Hero figure: the recorder itself. It follows the pointer by a few degrees,
 * can be dragged round, and its front readout shows the head hash of a sample
 * run being written. Real SHA-256, same construction as the tamper test.
 */
export function Recorder() {
  const stage = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<{ seq: number; name: string; args: string; hash: string }[] | null>(null);
  const [ok, setOk] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    const bodies = buildBodies(GENERIC);
    seal(bodies).then(async (h) => {
      const v = await verify(bodies, h);
      setOk(v.firstBad === null);
      setRows(bodies.map((b, i) => ({ seq: b.seq, name: b.name, args: b.args, hash: short(h[i]) })));
    });
  }, []);

  // write one entry at a time, hold on the sealed run, then start a new run
  useEffect(() => {
    if (!rows) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(rows.length); return; }
    const t = setTimeout(() => setN((x) => (x >= rows.length ? 1 : x + 1)), n === 0 ? 300 : n >= rows.length ? 5200 : 1500);
    return () => clearTimeout(t);
  }, [rows, n]);

  useEffect(() => {
    const el = stage.current, r = rig.current;
    if (!el || !r) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = false, t0 = performance.now();
    const cur = { rx: BASE.rx, ry: BASE.ry }, ptr = { x: 0, y: 0 }, drag = { on: false, x: 0, y: 0, yaw: 0, pitch: 0 };

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      if (!drag.on) { drag.yaw *= 0.94; drag.pitch *= 0.94; }
      const ty = BASE.ry + ptr.x * 9 + Math.sin(t * 0.35) * 2.5 + drag.yaw + window.scrollY * 0.07;
      const tx = BASE.rx - ptr.y * 5 + Math.sin(t * 0.27) * 1.2 + drag.pitch - Math.min(10, window.scrollY * 0.02);
      cur.rx += (tx - cur.rx) * 0.07; cur.ry += (ty - cur.ry) * 0.07;
      r.style.transform = `rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      if (visible) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !reduce;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(el);

    const move = (e: PointerEvent) => {
      ptr.x = (e.clientX / window.innerWidth) * 2 - 1; ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (drag.on) { drag.yaw += (e.clientX - drag.x) * 0.4; drag.pitch = Math.max(-28, Math.min(34, drag.pitch - (e.clientY - drag.y) * 0.25)); drag.x = e.clientX; drag.y = e.clientY; }
    };
    const down = (e: PointerEvent) => { if (e.pointerType === "touch") return; drag.on = true; drag.x = e.clientX; drag.y = e.clientY; el.style.cursor = "grabbing"; };
    const up = () => { drag.on = false; el.style.cursor = ""; };
    window.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); el.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up); };
  }, []);

  const shown = rows ? rows.slice(Math.max(0, n - 3), n) : [];
  const head = rows && n > 0 ? rows[n - 1].hash : "········…····";
  const sealed = !!rows && n >= rows.length;

  return (
    <figure className="relative mx-auto w-full min-w-0 max-w-[560px] select-none" aria-label="Black Box recorder writing a sample agent run">
      <div ref={stage} className="scene relative flex h-[330px] cursor-grab items-center justify-center sm:h-[400px] lg:h-[430px]">
        <div className="w-0 origin-center scale-[.78] sm:scale-100 lg:scale-[1.12]">
          <div ref={rig} className="rig w-0" style={{ transform: `rotateX(${BASE.rx}deg) rotateY(${BASE.ry}deg)` }} aria-hidden>
            <div className="ground" style={{ transform: `translateY(${H / 2 + 18}px) rotateX(90deg)` }} />
            {/* mounting tray */}
            <Cuboid className="bb" w={W + 44} h={8} d={D + 44} style={{ transform: `translateY(${H / 2 + 4}px)` }}
              faces={{ top: <><span className="screw left-[10px] top-[10px]" /><span className="screw right-[10px] top-[10px]" /><span className="screw bottom-[10px] left-[10px]" /><span className="screw bottom-[10px] right-[10px]" /></> }} />
            {/* recorder body */}
            <Cuboid className="bb" w={W} h={H} d={D}
              faces={{
                front: (
                  <>
                    <span className="stripe" style={{ left: 22 }} />
                    <div className="absolute inset-[7px] rounded-[3px] border border-white/[.06]" />
                    <div className="absolute left-[46px] top-[20px] font-mono text-[11px] font-medium leading-[15px] tracking-[.2em] text-fg/85">FLIGHT RECORDER<br /><span className="text-muted">DO NOT OPEN</span></div>
                    <div className="absolute right-[18px] top-[21px] flex items-center gap-1.5 font-mono text-[9px] tracking-[.16em] text-muted">
                      <span className={`h-[5px] w-[5px] rounded-full ${sealed ? "bg-ok" : "rec bg-accent"}`} />{sealed ? "SEALED" : "REC"}
                    </div>
                    <div className="absolute bottom-[18px] left-[46px] right-[18px] rounded-[3px] border border-white/[.07] bg-black/50 px-2.5 py-2 font-mono text-[10px] leading-[15px]">
                      <div className="flex justify-between text-dim"><span>HEAD</span><span>ENTRIES</span></div>
                      <div className="tnum flex justify-between"><span className="text-accent">{head}</span><span className="text-fg/90">{String(n).padStart(2, "0")}</span></div>
                    </div>
                  </>
                ),
                top: (
                  <>
                    <span className="stripe" style={{ left: 22 }} />
                    <div className="absolute inset-[7px] rounded-[3px] border border-white/[.06]" />
                    <div className="absolute bottom-[18px] right-[18px] text-right font-mono text-[9px] leading-[14px] tracking-[.18em] text-dim">BBX-01<br />SN 0193</div>
                    <svg className="absolute left-[46px] top-[20px]" width="26" height="26" viewBox="0 0 32 32" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="2">
                      <rect x="9" y="6.5" width="14" height="9.5" rx="3.5" /><rect x="9" y="14" width="15.5" height="11.5" rx="3.5" />
                    </svg>
                  </>
                ),
                right: (
                  <>
                    <div className="absolute inset-[7px] rounded-[3px] border border-white/[.05]" />
                    <div className="absolute left-[22px] top-[22px] font-mono text-[9px] tracking-[.18em] text-dim">GATEWAY IN</div>
                    <div className="absolute left-[22px] top-[42px] flex h-[22px] w-[58px] items-center justify-center gap-[5px] rounded-[4px] border border-white/10 bg-black">
                      {Array.from({ length: 6 }).map((_, i) => <span key={i} className="h-[8px] w-[3px] rounded-[1px] bg-white/15" />)}
                    </div>
                    <div className="absolute bottom-[22px] left-[22px] right-[22px] h-[30px]" style={{ background: "repeating-linear-gradient(180deg, rgba(255,255,255,.07) 0 1px, transparent 1px 6px)" }} />
                  </>
                ),
                back: <span className="stripe" style={{ right: 22 }} />,
                bottom: <span className="stripe" style={{ left: 22 }} />,
              }} />
          </div>
        </div>

        {/* drawing annotations */}
        <div className="label pointer-events-none absolute left-0 top-0 hidden sm:block">Fig. 01<span className="ml-3 normal-case tracking-normal text-dim">Recorder, exterior</span></div>
        <div className="label pointer-events-none absolute right-0 top-0 hidden normal-case tracking-normal text-dim sm:block">drag to rotate</div>
      </div>

      {/* what the recorder is writing right now */}
      <figcaption className="font-mono text-[12px]">
        <div className="flex items-center justify-between text-muted">
          <span className="label">run-0193 · sample</span>
          <span role="status" className={`flex items-center gap-2 ${ok ? "text-ok" : "text-accent"}`}>
            <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-ok" : "bg-accent"}`} />
            {!rows ? "sealing…" : sealed ? `chain intact · ${rows.length} entries` : `writing entry ${String(Math.max(n, 1)).padStart(2, "0")}`}
          </span>
        </div>
        <ol className="mt-2 h-[72px] overflow-hidden" aria-label="Most recent entries">
          {shown.map((r, i) => (
            <li key={`${n}-${r.seq}`} className={`flex h-6 items-center gap-3 ${i === shown.length - 1 ? "write text-fg" : "text-dim"}`}>
              <span className="w-5 shrink-0">{String(r.seq).padStart(2, "0")}</span>
              <span className="w-[92px] shrink-0 truncate">{r.name}</span>
              <span className="min-w-0 flex-1 truncate text-muted">{r.args}</span>
              <span className={`tnum shrink-0 ${i === shown.length - 1 ? "text-accent" : ""}`}>{r.hash}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
