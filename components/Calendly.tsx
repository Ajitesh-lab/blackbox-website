"use client";
import { useEffect, useRef, useState } from "react";
import { CALENDLY_URL, CALL_MINUTES } from "@/lib/site";
import { track } from "@/lib/analytics";

/**
 * Embeds the 15-min event directly (not the profile page).
 * On the home page the heavy iframe loads on click, or when it nears the viewport.
 * `eager` loads it immediately (used on /book).
 */
export function Calendly({ campaign = "direct", eager = false }: { campaign?: string; eager?: boolean }) {
  const [on, setOn] = useState(eager);
  const box = useRef<HTMLDivElement>(null);
  const src = `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0d0d10&text_color=ececee&primary_color=ff4f00&utm_source=site&utm_campaign=${encodeURIComponent(campaign)}`;

  useEffect(() => {
    if (on || !box.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(box.current);
    return () => io.disconnect();
  }, [on]);

  useEffect(() => {
    const h = (e: MessageEvent) => {
      if (e.origin === "https://calendly.com" && (e.data as { event?: string })?.event === "calendly.event_scheduled") track("calendly_scheduled", { campaign });
    };
    window.addEventListener("message", h);
    return () => window.removeEventListener("message", h);
  }, [campaign]);

  return (
    <div ref={box} className="overflow-hidden rounded-[14px] bg-panel">
      {on ? (
        <iframe title={`Pick a time for a ${CALL_MINUTES}-minute call`} src={src} loading="lazy" className="block h-[1000px] w-full sm:h-[720px]" />
      ) : (
        <div className="flex h-[260px] flex-col items-start justify-center gap-3 p-6">
          <div className="font-medium">Pick a time</div>
          <p className="text-sm text-muted">{CALL_MINUTES} minutes, no prep needed.</p>
          <button className="btn btn-primary" onClick={() => setOn(true)}>Show calendar</button>
          <noscript><a className="btn btn-primary" href={CALENDLY_URL}>Open the calendar</a></noscript>
        </div>
      )}
    </div>
  );
}
