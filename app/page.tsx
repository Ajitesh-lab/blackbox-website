import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { JsonLd } from "@/components/JsonLd";
import { abs, APP_ID, ENTITY_DEFINITION, MODIFIED, SITE_ID } from "@/lib/seo";

export const metadata: Metadata = { title: { absolute: "Black Box: tamper-evident audit logs for AI agents" } };

export default function Page() {
  return (
    <>
      <HomePage />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebPage", "@id": abs("/#webpage"), url: abs("/"), name: "Black Box: tamper-evident audit logs for AI agents",
        description: ENTITY_DEFINITION, inLanguage: "en", dateModified: MODIFIED, isPartOf: { "@id": SITE_ID }, about: { "@id": APP_ID }, mainEntity: { "@id": APP_ID },
        primaryImageOfPage: { "@type": "ImageObject", url: abs("/opengraph-image") },
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#what"] },
      }} />
    </>
  );
}
