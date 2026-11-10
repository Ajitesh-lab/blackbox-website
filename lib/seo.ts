import { SITE_URL } from "./site";

export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#software`;
export const PUBLISHED = "2026-11-10";
export const MODIFIED = "2026-11-10";

export const ENTITY_DEFINITION =
  "Black Box is a flight recorder for AI agents. It records every model call and tool call an agent makes at a gateway outside the agent, seals each entry in a SHA-256 hash chain, and lets anyone verify an exported log offline.";

export const abs = (path: string) => `${SITE_URL}${path}`;

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
