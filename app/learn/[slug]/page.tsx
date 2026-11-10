import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Crumbs } from "@/components/Crumbs";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { BookLink } from "@/components/BookLink";
import { ARTICLES, anchor, bySlug, wordCount } from "@/lib/articles";
import { abs, APP_ID, breadcrumbs, faqLd, MODIFIED, ORG_ID, PUBLISHED, SITE_ID } from "@/lib/seo";
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
  const words = wordCount(a);
  const mins = Math.max(2, Math.round(words / 220));
  return (
    <>
      <Nav />
      <main id="main" className="frame pb-20 pt-12 sm:pb-28 sm:pt-20">
        <Crumbs items={[{ name: "Home", href: "/" }, { name: "Learn", href: "/learn" }, { name: a.nav ?? a.h1 }]} />
        <article>
          <h1 className="display max-w-4xl text-4xl sm:text-[60px]">{a.h1}</h1>
          <p className="mt-6 font-mono text-xs text-muted">By Black Box · Updated <time dateTime={MODIFIED}>10 Nov 2026</time> · {mins} min read</p>
          <div className="mt-14 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="min-w-0 max-w-3xl">
              <div data-answer>
                <div className="label mb-3 flex items-center gap-2.5"><span aria-hidden className="h-px w-6 bg-accent" />Short answer</div>
                <p className="text-xl leading-9 sm:text-2xl sm:leading-10">{a.answer}</p>
              </div>
              <div className="mt-16 space-y-14">
                {a.sections.map((s) => (
                  <section key={s.h2} id={anchor(s.h2)} className="scroll-mt-20">
                    <h2 className="display text-3xl">{s.h2}</h2>
                    {s.body.map((p) => <p key={p} className="mt-4 text-[17px] leading-8 text-muted">{p}</p>)}
                    {s.list && <ul className="mt-5 space-y-2.5 text-[17px] leading-7 text-muted">{s.list.map((l) => <li key={l} className="flex gap-3"><span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-accent" />{l}</li>)}</ul>}
                    {s.code && <pre className="mt-5 overflow-x-auto rounded-[14px] bg-panel p-5 font-mono text-[12.5px] leading-6">{s.code}</pre>}
                  </section>
                ))}
              </div>
              <section id="faq" className="mt-16 scroll-mt-20">
                <h2 className="display text-3xl">Frequently asked questions</h2>
                <div className="mt-6"><Faq items={a.faq} /></div>
              </section>
            </div>
            <aside className="order-first lg:order-none">
              <nav aria-label="On this page" className="lg:sticky lg:top-24">
                <div className="label mb-4">On this page</div>
                <ol className="space-y-2.5 text-sm">
                  {a.sections.map((s) => <li key={s.h2}><a className="text-muted transition-colors hover:text-fg" href={`#${anchor(s.h2)}`}>{s.h2}</a></li>)}
                  <li><a className="text-muted transition-colors hover:text-fg" href="#faq">Frequently asked questions</a></li>
                </ol>
              </nav>
            </aside>
          </div>
        </article>
        <section className="mt-24 max-w-3xl">
          <h2 className="display text-3xl">See it working</h2>
          <p className="mt-4 text-[17px] leading-8 text-muted">Edit a sample agent log in your browser and watch the chain break, or book a call and bring one workflow.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BookLink where={`learn-${a.slug}`}>{CALL_LABEL}</BookLink>
            <Link href="/#tamper" className="btn btn-ghost">Try the tamper test</Link>
          </div>
        </section>
        <section className="mt-24">
          <h2 className="label mb-2">Related guides</h2>
          <ul>
            {related.map((r) => <li key={r.slug} className="border-b border-line"><Link className="row group flex items-baseline justify-between gap-6 py-5 text-xl font-medium tracking-tight" href={`/learn/${r.slug}`}>{r.h1}<span aria-hidden className="text-dim transition-colors group-hover:text-accent">→</span></Link></li>)}
          </ul>
        </section>
      </main>
      <Footer />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "TechArticle", headline: a.h1, description: a.description, abstract: a.answer,
        datePublished: PUBLISHED, dateModified: MODIFIED, inLanguage: "en", wordCount: words, timeRequired: `PT${mins}M`,
        articleSection: "AI agent audit logs", about: { "@id": APP_ID }, speakable: { "@type": "SpeakableSpecification", cssSelector: ["[data-answer]"] },
        mainEntityOfPage: abs(`/learn/${a.slug}`), url: abs(`/learn/${a.slug}`), isPartOf: { "@id": SITE_ID },
        author: { "@id": ORG_ID }, publisher: { "@id": ORG_ID }, image: abs(`/learn/${a.slug}/opengraph-image`),
      }} />
      <JsonLd data={faqLd(a.faq)} />
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Learn", path: "/learn" }, { name: a.h1, path: `/learn/${a.slug}` }])} />
    </>
  );
}
