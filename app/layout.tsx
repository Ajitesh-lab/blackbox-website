import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { APP_ID, ENTITY_DEFINITION, ORG_ID, SITE_ID } from "@/lib/seo";

const TITLE = "Black Box: tamper-evident audit logs for AI agents";
const DESC = "Black Box records every model and tool call your AI agent makes, from outside the agent, in a tamper-evident log anyone can verify.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Black Box" },
  description: DESC,
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  applicationName: "Black Box",
  authors: [{ name: "Black Box" }],
  creator: "Radius",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined },
  openGraph: { type: "website", siteName: "Black Box", title: TITLE, description: DESC, url: "/" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};
export const viewport: Viewport = { themeColor: "#0a0a0b" };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": ORG_ID, name: "Radius", url: SITE_URL, brand: { "@type": "Brand", name: "Black Box" }, logo: `${SITE_URL}/icon.svg`, description: "Radius builds Black Box, a flight recorder for AI agents." },
    { "@type": "WebSite", "@id": SITE_ID, url: SITE_URL, name: "Black Box", description: DESC, inLanguage: "en", publisher: { "@id": ORG_ID } },
    {
      "@type": "SoftwareApplication", "@id": APP_ID, name: "Black Box", alternateName: "Black Box flight recorder for AI agents",
      applicationCategory: "DeveloperApplication", operatingSystem: "Web", description: ENTITY_DEFINITION, url: SITE_URL,
      publisher: { "@id": ORG_ID }, featureList: ["Records every model and tool call at a gateway outside the agent", "SHA-256 hash-chained, tamper-evident ledger", "Offline verification of exported ledgers (in pilot)", "Step-by-step replay of recorded runs"],
      offers: { "@type": "Offer", name: "Free 2-week pilot", price: "0", priceCurrency: "GBP" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">Skip to content</a>
        {children}
        <JsonLd data={jsonLd} />
        {domain && <Script defer data-domain={domain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />}
      </body>
    </html>
  );
}
