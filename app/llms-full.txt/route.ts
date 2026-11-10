import { ARTICLES, GLOSSARY } from "@/lib/articles";
import { FAQ_HOME, FAQ_SECURITY } from "@/lib/faq";
import { ENTITY_DEFINITION, abs } from "@/lib/seo";
import { OFFER } from "@/lib/site";

export const dynamic = "force-static";

// Everything an assistant needs, as one plain-text document.
export function GET() {
  const parts: string[] = [];
  parts.push(`# Black Box (full content)\n\n${ENTITY_DEFINITION}\n\nBuilt by Radius. No customers yet; no certifications. ${OFFER.note}\n\n${OFFER.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n`);
  parts.push(`## Frequently asked questions\n\n${[...FAQ_HOME, ...FAQ_SECURITY.filter((f) => !FAQ_HOME.some((h) => h.q === f.q))].map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}\n`);
  for (const a of ARTICLES) {
    parts.push(`## ${a.h1}\nURL: ${abs(`/learn/${a.slug}`)}\n\nShort answer: ${a.answer}\n\n${a.sections.map((s) => `### ${s.h2}\n${s.body.join("\n\n")}${s.list ? "\n" + s.list.map((l) => `- ${l}`).join("\n") : ""}${s.code ? "\n\n" + s.code : ""}`).join("\n\n")}\n\n${a.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}\n`);
  }
  parts.push(`## Glossary\n\n${GLOSSARY.map((g) => `- ${g.term}: ${g.def}`).join("\n")}\n`);
  return new Response(parts.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
