import { Cuboid } from "./Cuboid";
import { short } from "@/lib/chain";

const SW = 196, SH = 16, SD = 116, GAP = 5;

/**
 * The ledger as a physical stack: one slab per entry, each resting on the one
 * before. Entries that no longer verify slide out of true, so the break and
 * everything after it is visible at a glance.
 */
export function ChainStack({ hashes, ok }: { hashes: (string | null)[]; ok: boolean[] }) {
  const n = hashes.length;
  const firstBad = ok.indexOf(false);
  return (
    <div className="scene flex h-[360px] items-center justify-center " aria-hidden>
      <div className="rig" style={{ transform: "scale(1.15) rotateX(-20deg) rotateY(-36deg)" }}>
        {hashes.map((h, i) => {
          const bad = !ok[i];
          const y = (i - (n - 1) / 2) * (SH + GAP);
          return (
            <Cuboid key={i} className={`slab ${bad ? "bad" : ""}`} w={SW} h={SH} d={SD}
              style={{ transform: `translate3d(${bad ? 18 : 0}px, ${y}px, ${bad ? 12 : 0}px) rotateY(${bad ? -4 : 0}deg)`, transitionDelay: `${bad && firstBad >= 0 ? (i - firstBad) * 35 : 0}ms` }}
              faces={{
                front: (
                  <div className="flex h-full items-center gap-2 px-2 font-mono text-[9px] leading-none">
                    <span className={`h-[5px] w-[5px] shrink-0 rounded-full ${bad ? "bg-accent" : "bg-ok/70"}`} />
                    <span className="text-dim">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`tnum ${bad ? "text-accent" : "text-muted"}`}>{h ? short(h) : ""}</span>
                  </div>
                ),
              }} />
          );
        })}
      </div>
    </div>
  );
}
