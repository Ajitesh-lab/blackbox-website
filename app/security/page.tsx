import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { Faq } from "@/components/Faq";
import { FAQ_SECURITY } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Security & FAQ",
  description: "How Black Box handles your agent's data, what it doesn't claim, and honest answers to the questions teams ask.",
  alternates: { canonical: "/security" },
};

export default function Page() {
  return (
    <DocPage title="What we handle, and what we don't claim." intro="Black Box is early. We'd rather you know exactly where it stands.">
      <section>
        <h2>Data handling</h2>
        <p>The gateway sees the calls your agent makes, so it sees their arguments and results. Hosting region and retention are agreed with you in writing before the pilot starts.</p>
      </section>
      <section>
        <h2>What we don't claim</h2>
        <p>We have no certifications or audit reports today, and we won't imply otherwise. What we offer is a record built so you can check it yourself.</p>
      </section>
      <section>
        <h2>Questions</h2>
        <Faq items={FAQ_SECURITY} />
      </section>
    </DocPage>
  );
}
