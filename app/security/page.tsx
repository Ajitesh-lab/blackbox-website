import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = { title: "Security & FAQ" };

export default function Page() {
  return (
    <DocPage light eyebrow="Security &amp; FAQ" title="What we handle, and what we don't claim."
      intro="Black Box is early. We'd rather you know exactly where it stands.">
      <section>
        <h2>Data handling</h2>
        <p>The gateway sees the calls your agent makes, so it sees their arguments and results. Where logs live and how long they're kept are decided with you during the pilot, and written down before anything runs. [TODO: confirm hosting region and retention defaults before launch.]</p>
      </section>
      <section>
        <h2>What we don't claim</h2>
        <p>We have no certifications or audit reports today, and we won't imply otherwise. What we offer is a record built so you can check it yourself.</p>
      </section>
      <section>
        <h2>FAQ</h2>
        <Faq />
      </section>
    </DocPage>
  );
}
