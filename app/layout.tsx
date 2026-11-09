import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const TITLE = "Black Box: tamper-evident audit logs for AI agents";
const DESC = "Black Box records every model and tool call your AI agent makes, from outside the agent, in a tamper-evident log anyone can verify.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Black Box" },
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Black Box", title: TITLE, description: DESC, url: "/" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};
export const viewport: Viewport = { themeColor: "#0a0a0b" };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: "Radius", url: SITE_URL },
    { "@type": "SoftwareApplication", name: "Black Box", applicationCategory: "DeveloperApplication", operatingSystem: "Web", description: DESC, publisher: { "@type": "Organization", name: "Radius" } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">Skip to content</a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {domain && <Script defer data-domain={domain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />}
      </body>
    </html>
  );
}
