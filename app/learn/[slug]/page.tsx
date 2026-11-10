import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Crumbs } from "@/components/Crumbs";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { BookLink } from "@/components/BookLink";
import { ARTICLES, bySlug } from "@/lib/articles";
import { abs, breadcrumbs, faqLd, MODIFIED, ORG_ID, PUBLISHED, SITE_ID } from "@/lib/seo";
import { CALL_LABEL } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return ARTICLES.map((a) => ({ slug: a.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = bySlug((await params).slug);
  if (!a) return {};
  return {
    title: a.title, description: a.description,
    alternates: { canonical: `/learn/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.description, url: `/learn/${a.slug}`, publishedTime: PUBLISHED, modifiedTime: MODIFIED, authors: ["Black Box"] },
    twitter: { card: "summary_large_image", title: a.title, description: a.description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const a = bySlug((await params).slug);
  if (!a) notFound();
  const related = a.related.map((s) => bySlug(s)).filter(Boolean) as typeof ARTICLES;
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <Crumbs items={[{ name: "Home", href: "/" }, { name: "Learn", href: "/learn" }, { name: a.h1 }]} />
        <article>
          <h1 className="display text-4xl sm:text-5xl">{a.h1}</h1>
          <p className="mt-4 font-mono text-xs text-muted">By Black Box · Updated <time dateTime={MODIFIED}>10 Nov 2026</time></p>
          <div className="mt-8 rounded-xl border border-line bg-panel p-5" data-answer>
            <div className="eyebrow mb-2">Short answer</div>
            <p className="text-[17px] leading-8">{a.answer}</p>
          </div>
          <div className="mt-12 space-y-10">
            {a.sections.map((s) => (
              <section key={s.h2}>
                <h2 className="text-2xl font-semibold tracking-tight">{s.h2}</h2>
                {s.body.map((p) => <p key={p} className="mt-4 leading-7 text-muted">{p}</p>)}
                {s.list && <ul className="mt-4 list-disc space-y-1.5 pl-5 leading-7 text-muted">{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
                {s.code && <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-panel p-4 font-mono text-[12.5px] leading-6">{s.code}</pre>}
              </section>
            ))}
          </div>
          <section className="mt-14">
            <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
            <div className="mt-4"><Faq items={a.faq} /></div>
          </section>
        </article>
        <section className="mt-14 rounded-xl border border-line p-6">
          <h2 className="font-medium">See it working</h2>
          <p className="mt-2 text-[15px] leading-7 text-muted">Edit a sample agent log in your browser and watch the chain break, or book a call and bring one workflow.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/#tamper" className="btn btn-ghost">Try the tamper test</Link>
            <BookLink where={`learn-${a.slug}`}>{CALL_LABEL}</BookLink>
          </div>
        </section>
        <section className="mt-14">
          <h2 className="eyebrow mb-4">Related</h2>
          <ul className="space-y-3">
            {related.map((r) => <li key={r.slug}><Link className="underline-offset-4 hover:text-accent hover:underline" href={`/learn/${r.slug}`}>{r.h1}</Link></li>)}
          </ul>
        </section>
      </main>
      <Footer />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "TechArticle", headline: a.h1, description: a.description, abstract: a.answer,
        datePublished: PUBLISHED, dateModified: MODIFIED, inLanguage: "en",
        mainEntityOfPage: abs(`/learn/${a.slug}`), url: abs(`/learn/${a.slug}`), isPartOf: { "@id": SITE_ID },
        author: { "@id": ORG_ID }, publisher: { "@id": ORG_ID }, image: abs(`/learn/${a.slug}/opengraph-image`),
      }} />
      <JsonLd data={faqLd(a.faq)} />
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Learn", path: "/learn" }, { name: a.h1, path: `/learn/${a.slug}` }])} />
    </>
  );
}
