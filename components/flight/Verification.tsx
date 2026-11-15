"use client";
import { useEffect, useRef, useState } from "react";

export function Verification() {
  const panel = useRef<HTMLElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const node = panel.current;
    if (!node) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) timer = setTimeout(() => { setFailed(true); window.dispatchEvent(new CustomEvent("flight-tamper", { detail: true })); }, 1700);
      else { clearTimeout(timer); setFailed(false); window.dispatchEvent(new CustomEvent("flight-tamper", { detail: false })); }
    }, { threshold: 0.55 });
    observer.observe(node);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);
  return <figure ref={panel} className={`verification-panel ${failed ? "integrity-failed" : ""}`}>
    <div className="terminal-top"><span>INDEPENDENT VERIFICATION</span><span>OFFLINE</span></div>
    <div className="terminal-body"><p className="terminal-command">$ verify evidence.export</p><p>→ Trusted key loaded</p><p>→ Checkpoint signature valid</p><p className="terminal-pass">✓ Original sequence: PASS</p><div className="terminal-result" role="status" aria-live="polite">{failed ? <><p>→ Event 008: one byte changed</p><p>digest 9f2a…d04c → 62be…a710</p><p className="terminal-fail">× INTEGRITY FAIL / link mismatch</p></> : <p>Awaiting illustrative byte change<span className="terminal-cursor">_</span></p>}</div></div>
    <figcaption>Illustrative tamper demonstration</figcaption>
  </figure>;
}
