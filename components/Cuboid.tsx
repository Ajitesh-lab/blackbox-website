import type { CSSProperties, ReactNode } from "react";

type Faces = Partial<Record<"front" | "back" | "left" | "right" | "top" | "bottom", ReactNode>>;

/**
 * A box built from six real DOM faces (CSS 3D, no canvas), so whatever sits on
 * a face stays crisp text that is selectable, accessible and server-rendered.
 * w/h/d are px along x/y/z. Face geometry lives in globals.css (.cuboid).
 */
export function Cuboid({ w, h, d, className = "", style, faces = {} }: { w: number; h: number; d: number; className?: string; style?: CSSProperties; faces?: Faces }) {
  return (
    <div className={`cuboid ${className}`} style={{ "--w": `${w}px`, "--h": `${h}px`, "--d": `${d}px`, ...style } as CSSProperties}>
      {(["front", "back", "right", "left", "top", "bottom"] as const).map((k) => (
        <div key={k} className={`f f-${k}`}>{faces[k]}</div>
      ))}
    </div>
  );
}
