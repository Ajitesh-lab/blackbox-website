import type { Metadata } from "next";
import Link from "next/link";
import { DocPage } from "@/components/DocPage";
import { JsonLd } from "@/components/JsonLd";
import { GLOSSARY } from "@/lib/articles";
import { abs, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Glossary: AI agent audit logs and tamper-evident logging",
  description: "Short definitions of AI agent audit log, hash chain, tamper-evident log, gateway, ledger, offline verification and replay.",
  alternates: { canonical: "/glossary" },
};

export default function Page() {
  return (
    <>
      <DocPage title="Glossary" intro="Short definitions of the terms used on this site.">
        <dl className="divide-y divide-line border-y border-line">
          {GLOSSARY.map((g) => (
            <div key={g.term} id={g.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="py-5">
              <dt className="font-medium text-fg">{g.term}</dt>
              <dd className="mt-1.5 leading-7 text-muted">{g.def}{g.link && <> <Link className="underline underline-offset-4 hover:text-accent" href={g.link}>Read more</Link></>}</dd>
            </div>
          ))}
        </dl>
      </DocPage>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "DefinedTermSet", name: "Black Box glossary", url: abs("/glossary"), hasDefinedTerm: GLOSSARY.map((g) => ({ "@type": "DefinedTerm", name: g.term, description: g.def, inDefinedTermSet: abs("/glossary") })) }} />
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Glossary", path: "/glossary" }])} />
    </>
  );
}
