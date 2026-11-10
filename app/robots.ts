import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Public content is open to search engines and AI crawlers alike. Only the
// unlisted per-company pages and the API are kept out.
const AI = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "cohere-ai", "Meta-ExternalAgent", "Bytespider", "Amazonbot", "DuckAssistBot", "MistralAI-User"];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/for/", "/api/"];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }, ...AI.map((userAgent) => ({ userAgent, allow: "/", disallow }))],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
