import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
// Public routes only. /for/* pages are unlisted on purpose.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/how-it-works", "/insurers", "/security", "/book", "/privacy"].map((p) => ({ url: `${SITE_URL}${p}` }));
}
