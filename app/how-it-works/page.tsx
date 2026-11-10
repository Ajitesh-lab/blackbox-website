import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Story } from "@/components/Story";
import { Crumbs } from "@/components/Crumbs";
import Link from "next/link";
import { BookLink } from "@/components/BookLink";
import { CALL_LABEL } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { abs, breadcrumbs, MODIFIED, ORG_ID, PUBLISHED, SITE_ID } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How Black Box records and verifies an agent run",
  description: "The gateway records every model and tool call outside the agent, a hash chain seals each entry, and an exported ledger can be verified offline.",
  alternates: { canonical: "/how-it-works" },
};

const H2 = "display text-3xl";
const P = "mt-4 max-w-3xl leading-7 text-muted";

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main" className="frame pb-20 pt-12 sm:pb-28 sm:pt-20">
        <Crumbs items={[{ name: "Home", href: "/" }, { name: "How it works" }]} />
        <h1 className="display max-w-4xl text-4xl sm:text-[60px]">How Black Box records and verifies an agent run</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">The design goal is one property: someone who doesn't trust the agent, or us, can still check what happened.</p>
        <div className="mt-8 lg:-mt-6"><Story /></div>
        <div className="relative z-10 mt-8 max-w-3xl space-y-14">
          <section><h2 className={H2}>What's recorded</h2><p className={P}>Every model call and tool call that passes through the gateway: the call name, its arguments, the result, and a timestamp, in order. That is what the agent called, when, with what result.</p></section>
          <section><h2 className={H2}>Why outside the agent</h2><p className={P}>The gateway sits between the agent and the things it calls. The agent has no write access to its own record, so it can't omit or rewrite a step, whether by bug or by prompt injection.</p></section>
          <section>
            <h2 className={H2}>The hash-chain format</h2>
            <p className={P}>Each entry's hash covers the previous entry's hash plus the entry's own contents. The first entry chains from 64 zeros.</p>
            <pre className="mt-4 overflow-x-auto rounded-[14px] bg-panel p-5 font-mono text-[12.5px] leading-6">{`entry_hash = SHA-256( prev_hash + "\\n" + canonical_json(entry) )
entry      = [seq, timestamp, kind, name, args, result]`}</pre>
            <p className={P}>Change any field of any entry and its hash changes, which changes every hash after it. The <Link className="link" href="/#tamper">tamper test on the home page</Link> uses this same construction, and <Link className="link" href="/learn/how-hash-chains-work">how hash chains work</Link> walks through it by hand.</p>
          </section>
          <section><h2 className={H2}>Offline verification (in pilot)</h2><p className={P}>The verifier takes an exported ledger, recomputes the chain from the first entry and reports the first entry that no longer matches. It is designed to run offline, so a third party can check a ledger without our involvement. It's in pilot, and we'll show it to you on the call.</p></section>
          <section>
            <h2 className={H2}>What it doesn't do</h2>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-muted">
              <li>It doesn't prevent incidents or decide whether an action was correct.</li>
              <li>It only sees calls routed through the gateway.</li>
              <li>It shows the record is unaltered. It does not make the agent's decisions good.</li>
            </ul>
          </section>
          <BookLink where="how-it-works">{CALL_LABEL}</BookLink>
        </div>
      </main>
      <Footer />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "TechArticle", headline: "How Black Box records and verifies an agent run", description: metadata.description, datePublished: PUBLISHED, dateModified: MODIFIED, url: abs("/how-it-works"), mainEntityOfPage: abs("/how-it-works"), isPartOf: { "@id": SITE_ID }, author: { "@id": ORG_ID }, publisher: { "@id": ORG_ID } }} />
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "How it works", path: "/how-it-works" }])} />
    </>
  );
}
