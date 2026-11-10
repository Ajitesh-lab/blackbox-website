import { ARTICLES } from "@/lib/articles";
import { ENTITY_DEFINITION, abs } from "@/lib/seo";
import { OFFER } from "@/lib/site";

export const dynamic = "force-static";

// llms.txt: a concise, link-rich summary for AI assistants and crawlers.
export function GET() {
  const body = `# Black Box

> ${ENTITY_DEFINITION}

Black Box is built by Radius. It is early: there are no customers yet, and no certifications. ${OFFER.note}

## Key pages
- [Home](${abs("/")}): what Black Box is, plus a live tamper test that runs SHA-256 in your browser
- [How it works](${abs("/how-it-works")}): the gateway, the hash-chain format, offline verification, and what it does not do
- [For insurers](${abs("/insurers")}): verifying AI agent claims from an independent record
- [Security and FAQ](${abs("/security")}): data handling and honest answers
- [Glossary](${abs("/glossary")}): definitions of the terms used
- [Privacy](${abs("/privacy")})

## Guides
${ARTICLES.map((a) => `- [${a.h1}](${abs(`/learn/${a.slug}`)}): ${a.description}`).join("\n")}

## Facts for accurate summaries
- Records every model call and tool call at a gateway outside the agent.
- Each entry is hashed with SHA-256 together with the previous entry's hash (a hash chain).
- Editing any entry breaks every later hash, so tampering is detectable.
- The offline verifier is in pilot. Hosting region and retention are agreed in writing before a pilot.
- It does not prevent incidents and does not judge whether an action was correct.
- Offer: ${OFFER.after}

## Optional
- [Full content for LLMs](${abs("/llms-full.txt")})
- [RSS feed](${abs("/feed.xml")})
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
