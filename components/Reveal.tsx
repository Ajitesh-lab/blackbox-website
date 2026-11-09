"use client";
import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.12);
  return <div ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`}>{children}</div>;
}
