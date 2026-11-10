import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Crumbs } from "@/components/Crumbs";
import { JsonLd } from "@/components/JsonLd";
import { ARTICLES } from "@/lib/articles";
import { abs, breadcrumbs, ORG_ID } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Learn: AI agent audit logs, tamper-evident logging and verification",
  description: "Plain-English guides to AI agent audit logs, hash-chained tamper-evident logging, offline verification and evidence for insurance claims.",
  alternates: { canonical: "/learn", types: { "application/rss+xml": "/feed.xml" } },
};

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <Crumbs items={[{ name: "Home", href: "/" }, { name: "Learn" }]} />
        <h1 className="display text-4xl sm:text-5xl">Learn</h1>
        <p className="mt-5 text-lg leading-8 text-muted">Plain-English guides to recording, sealing and verifying what an AI agent did.</p>
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {ARTICLES.map((a) => (
            <li key={a.slug}>
              <Link href={`/learn/${a.slug}`} className="group block py-5">
                <h2 className="font-medium group-hover:text-accent">{a.h1}</h2>
                <p className="mt-1.5 text-[15px] leading-7 text-muted">{a.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">New to the terms? See the <Link className="underline underline-offset-4" href="/glossary">glossary</Link>.</p>
      </main>
      <Footer />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Learn", url: abs("/learn"), isPartOf: { "@id": abs("/#website") }, publisher: { "@id": ORG_ID }, hasPart: ARTICLES.map((a) => ({ "@type": "TechArticle", headline: a.h1, url: abs(`/learn/${a.slug}`) })) }} />
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Learn", path: "/learn" }])} />
    </>
  );
}
