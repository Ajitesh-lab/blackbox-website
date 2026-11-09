import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { Calendly } from "@/components/Calendly";

export const metadata: Metadata = { title: "Book a call" };

export default async function Page({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const c = (await searchParams).c;
  return (
    <DocPage eyebrow="Book a call" title="20 minutes with the founder."
      intro="Bring one workflow your agent runs. We'll walk through what the replay would look like for it.">
      <section>
        <h2>Before you book</h2>
        <ul className="list-disc space-y-1 pl-5 text-muted">
          <li>Which agent workflow touches production, or would, if it could?</li>
          <li>Where do its calls go today (model provider, tools, shell)?</li>
          <li>Who would need to trust the record: you, a customer, an auditor?</li>
        </ul>
      </section>
      <Calendly campaign={c ?? "book"} height={760} />
    </DocPage>
  );
}
