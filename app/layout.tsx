import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Black Box: the flight recorder for AI agents", template: "%s · Black Box" },
  description: "Replay every model and tool call your agent makes, and prove nobody edited the record.",
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#0a0a0b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en">
      <body>
        {children}
        {domain && <Script defer data-domain={domain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />}
      </body>
    </html>
  );
}
