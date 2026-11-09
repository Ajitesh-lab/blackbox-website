"use client";
import Script from "next/script";

const BASE = "https://calendly.com/ajiteshrawat";

export function Calendly({ campaign = "direct", height = 700 }: { campaign?: string; height?: number }) {
  const url = `${BASE}?hide_gdpr_banner=1&background_color=0a0a0b&text_color=ededee&primary_color=ff4f00&utm_source=site&utm_campaign=${encodeURIComponent(campaign)}`;
  return (
    <>
      <div className="calendly-inline-widget overflow-hidden rounded-xl border border-line" data-url={url} style={{ minWidth: 280, height }} />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <noscript>
        <a className="btn btn-primary" href={BASE}>Book on Calendly</a>
      </noscript>
    </>
  );
}
