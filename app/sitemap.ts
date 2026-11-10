import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ARTICLES } from "@/lib/articles";
import { MODIFIED } from "@/lib/seo";

// Public routes only. /for/* pages are unlisted on purpose.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(MODIFIED);
  const core: [string, number][] = [["", 1], ["/how-it-works", 0.9], ["/insurers", 0.9], ["/learn", 0.8], ["/security", 0.7], ["/glossary", 0.6], ["/book", 0.6], ["/privacy", 0.2]];
  return [
    ...core.map(([p, priority]) => ({ url: `${SITE_URL}${p}`, lastModified, priority, changeFrequency: "monthly" as const })),
    ...ARTICLES.map((a) => ({ url: `${SITE_URL}/learn/${a.slug}`, lastModified, priority: 0.8, changeFrequency: "monthly" as const })),
  ];
}
