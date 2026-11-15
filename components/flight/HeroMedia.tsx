"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";

const FlightCanvas = dynamic(() => import("./FlightCanvas"), { ssr: false });

class GraphicsBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export type HeroMediaProps = {
  mode: "poster" | "realtime" | "video";
  poster?: string;
  video?: { webm: string; mp4: string };
};

export function HeroMedia({ mode, poster, video }: HeroMediaProps) {
  const [eligible, setEligible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const media = matchMedia("(min-width: 800px) and (prefers-reduced-motion: no-preference)");
    let idle = 0;
    const update = () => { setEligible(media.matches); if (!media.matches) setReady(false); };
    // Wait until the document has loaded before downloading the graphics chunk.
    const load = () => { idle = window.setTimeout(update, 120); };
    if (document.readyState === "complete") load();
    else window.addEventListener("load", load, { once: true });
    media.addEventListener("change", update);
    return () => { clearTimeout(idle); window.removeEventListener("load", load); media.removeEventListener("change", update); };
  }, []);
  const realtime = mode === "realtime" && eligible && !failed;
  return <div className={`hero-media ${ready && realtime ? "media-ready" : ""}`} aria-hidden="true">
    <div className="flight-poster">{poster ? <img src={poster} alt="" /> : <div className="poster-object"><div className="poster-cube outer" /><div className="poster-cube inner" /><span className="poster-axis axis-a" /><span className="poster-axis axis-b" /><span className="poster-axis axis-c" /><span className="poster-axis axis-d" /><i className="poster-node node-a" /><i className="poster-node node-b" /><i className="poster-node node-c" /><i className="poster-node node-d" /></div>}</div>
    {realtime && <GraphicsBoundary onFailure={() => setFailed(true)}><FlightCanvas onReady={() => setReady(true)} onFailure={() => { setFailed(true); setReady(false); }} /></GraphicsBoundary>}
    {mode === "video" && video && eligible && !failed && <video className="flight-film" autoPlay loop muted playsInline poster={poster} onError={() => setFailed(true)}><source src={video.webm} type="video/webm" /><source src={video.mp4} type="video/mp4" /></video>}
  </div>;
}
