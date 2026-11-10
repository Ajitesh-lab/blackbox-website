import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { APP_ID, ENTITY_DEFINITION, ORG_ID, SITE_ID } from "@/lib/seo";

// Self-hosted, preloaded, with metric-matched fallbacks so text doesn't shift.
const sans = localFont({ src: "./fonts/plex-sans.woff2", weight: "100 700", variable: "--font-sans", display: "swap" });
const mono = localFont({ src: [{ path: "./fonts/plex-mono-400.woff2", weight: "400" }, { path: "./fonts/plex-mono-500.woff2", weight: "500" }], variable: "--font-mono", display: "swap" });

const TITLE = "Black Box: tamper-evident audit logs for AI agents";
const DESC = "Black Box records every model and tool call your AI agent makes, from outside the agent, in a tamper-evident log anyone can verify.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Black Box" },
  description: DESC,
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  applicationName: "Black Box",
  keywords: ["AI agent audit log", "tamper-evident logging", "flight recorder for AI agents", "AI agent observability", "hash chain", "agent tool call logging", "LLM gateway", "offline log verification", "AI agent insurance"],
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  authors: [{ name: "Black Box" }],
  creator: "Radius",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined },
  openGraph: { type: "website", siteName: "Black Box", title: TITLE, description: DESC, url: "/", locale: "en_GB" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};
export const viewport: Viewport = { themeColor: "#08080a", colorScheme: "dark" };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": ORG_ID, name: "Radius", url: SITE_URL, brand: { "@type": "Brand", name: "Black Box" }, logo: { "@type": "ImageObject", url: `${SITE_URL}/apple-icon.png` }, description: "Radius builds Black Box, a flight recorder for AI agents.", knowsAbout: ["AI agent audit logs", "Tamper-evident logging", "Hash chains", "AI agent observability", "Evidence for AI agent insurance claims"] },
    { "@type": "WebSite", "@id": SITE_ID, url: SITE_URL, name: "Black Box", description: DESC, inLanguage: "en", publisher: { "@id": ORG_ID }, about: { "@id": APP_ID } },
    {
      "@type": "SoftwareApplication", "@id": APP_ID, name: "Black Box", alternateName: "Black Box flight recorder for AI agents",
      applicationCategory: "DeveloperApplication", applicationSubCategory: "AI agent audit logging", operatingSystem: "Web", image: `${SITE_URL}/opengraph-image`, audience: { "@type": "BusinessAudience", audienceType: "Teams building AI agents, and insurers covering them" }, description: ENTITY_DEFINITION, url: SITE_URL,
      publisher: { "@id": ORG_ID }, featureList: ["Records every model and tool call at a gateway outside the agent", "SHA-256 hash-chained, tamper-evident ledger", "Offline verification of exported ledgers (in pilot)", "Step-by-step replay of recorded runs"],
      offers: { "@type": "Offer", name: "Free 2-week pilot", price: "0", priceCurrency: "GBP", url: `${SITE_URL}/#pilot`, availability: "https://schema.org/LimitedAvailability" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        {/* lets CSS hide scroll-reveal content only when JS is there to show it */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a href="#main" className="skip">Skip to content</a>
        {children}
        <JsonLd data={jsonLd} />
        {domain && <Script defer data-domain={domain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />}
      </body>
    </html>
  );
}
