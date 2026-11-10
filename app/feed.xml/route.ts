import { ARTICLES } from "@/lib/articles";
import { PUBLISHED, abs } from "@/lib/seo";

export const dynamic = "force-static";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const date = new Date(PUBLISHED).toUTCString();
  const items = ARTICLES.map((a) => `<item><title>${esc(a.h1)}</title><link>${abs(`/learn/${a.slug}`)}</link><guid>${abs(`/learn/${a.slug}`)}</guid><pubDate>${date}</pubDate><description>${esc(a.description)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Black Box: Learn</title><link>${abs("/learn")}</link><description>Guides to AI agent audit logs and tamper-evident logging.</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
