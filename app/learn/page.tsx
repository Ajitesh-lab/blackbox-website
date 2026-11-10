import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Crumbs } from "@/components/Crumbs";
import { JsonLd } from "@/components/JsonLd";
import { ARTICLES, wordCount } from "@/lib/articles";
import { abs, breadcrumbs, ORG_ID, SITE_ID } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Learn: AI agent audit logs, tamper-evident logging and verification",
  description: "Plain-English guides to AI agent audit logs, hash chains, tamper-evident logging, MCP tool call logging, incident review and offline verification.",
  alternates: { canonical: "/learn", types: { "application/rss+xml": "/feed.xml" } },
};

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main" className="frame pb-20 pt-12 sm:pb-28 sm:pt-20">
        <Crumbs items={[{ name: "Home", href: "/" }, { name: "Learn" }]} />
        <h1 className="display max-w-4xl text-4xl sm:text-[60px]">Guides to recording, sealing and verifying what an AI agent did.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">Plain English, one question each, answered in the first paragraph.</p>
        <ul className="mt-16">
          {ARTICLES.map((a, i) => (
            <li key={a.slug} className="border-t border-line">
              <Link href={`/learn/${a.slug}`} className="row group grid gap-x-8 gap-y-2 py-7 md:grid-cols-[40px_1fr_1.1fr_70px] md:items-baseline">
                <span className="hidden font-mono text-xs text-dim md:block">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="text-xl font-medium tracking-tight sm:text-2xl">{a.h1}</h2>
                <p className="text-[15px] leading-7 text-muted">{a.description}</p>
                <span className="font-mono text-[11px] text-dim transition-colors group-hover:text-accent md:text-right">{Math.max(2, Math.round(wordCount(a) / 220))} min →</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-muted">New to the terms? See the <Link className="link" href="/glossary">glossary</Link>, or read <Link className="link" href="/how-it-works">how Black Box works</Link>.</p>
      </main>
      <Footer />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Learn", description: metadata.description, url: abs("/learn"), isPartOf: { "@id": SITE_ID }, publisher: { "@id": ORG_ID }, mainEntity: { "@type": "ItemList", itemListElement: ARTICLES.map((a, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/learn/${a.slug}`), name: a.h1 })) } }} />
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Learn", path: "/learn" }])} />
    </>
  );
}
