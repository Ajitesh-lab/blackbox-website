"use client";

import { useEffect, useRef } from "react";

export function Scramble({ text }: { text: string }) {
  const glyph = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = glyph.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 620);
        node.textContent = [...text].map((char, i) => char === " " || i / text.length < progress ? char : "01/░+:×"[Math.floor(Math.random() * 7)]).join("");
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [text]);
  return <span className="decode"><span className="sr-only">{text}</span><span className="decode-measure" aria-hidden="true">{text}</span><span className="decode-glyph" ref={glyph} aria-hidden="true">{text}</span></span>;
}
