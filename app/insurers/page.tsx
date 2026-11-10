import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { BookLink } from "@/components/BookLink";
import { OFFER, CALL_LABEL } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { abs, breadcrumbs, ORG_ID, APP_ID } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For insurers: verify agent claims from an independent record",
  description: "Attach Black Box to a policyholder's AI agent and get an independent, tamper-evident record of what it did, so you can verify claims and spot fraud.",
  alternates: { canonical: "/insurers" },
};

const FLOW = [
  ["Incident", "A policyholder's agent does something that leads to a claim."],
  ["Export ledger", "The policyholder exports the run's ledger from the gateway."],
  ["Verify offline", "You check the hash chain yourself. Any edit shows up as a broken entry."],
  ["Settle the claim", "Decide from what the agent actually called, when, with what result."],
];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "For insurers", path: "/insurers" }])} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: "Black Box for insurers", serviceType: "Independent, tamper-evident records of AI agent activity for claims verification", description: metadata.description, url: abs("/insurers"), provider: { "@id": ORG_ID }, isRelatedTo: { "@id": APP_ID }, audience: { "@type": "BusinessAudience", audienceType: "Insurers and underwriters covering AI agents" } }} />
      <DocPage crumb="For insurers" title="Settle agent claims from a record nobody can quietly edit." intro="When an AI agent causes a loss, the evidence is usually the agent's own account, or logs its operator can change. Black Box gives you an independent one.">
      <section>
        <h2>The problem for insurers</h2>
        <p>An agent that deletes data, moves money or deploys bad code leaves a trail that the policyholder controls. It's hard to verify a claim, or rule out fraud, from a record the claimant could have altered.</p>
      </section>
      <section>
        <h2>How Black Box helps</h2>
        <p>Black Box records each model and tool call at a gateway outside the agent and seals the entries in a hash chain. An exported ledger is built so a third party can verify it offline, without relying on the policyholder or on us.</p>
      </section>
      <section>
        <h2>A claims workflow</h2>
        <ol className="divide-y divide-line border-y border-line">
          {FLOW.map(([t, d], i) => (
            <li key={t} className="flex gap-5 py-4"><span className="w-5 shrink-0 pt-1 font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span><span><span className="font-medium text-fg">{t}.</span> <span className="text-muted">{d}</span></span></li>
          ))}
        </ol>
        <p>This is what we're building toward, and the offline verifier is in pilot. We'll walk through it on a call. For background, read <Link className="link" href="/learn/ai-agent-insurance-claims-evidence">evidence for AI agent insurance claims</Link> and <Link className="link" href="/learn/how-to-verify-an-ai-agent-log-offline">how to verify an agent's log offline</Link>.</p>
      </section>
      <section>
        <h2>Start with a pilot</h2>
        <p>{OFFER.note} {OFFER.after}</p>
        <div className="mt-6"><BookLink where="insurers">{CALL_LABEL}</BookLink></div>
      </section>
    </DocPage>
    </>
  );
}
