import Link from "next/link";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { HeroTrace } from "./HeroTrace";
import { TamperTest } from "./TamperTest";
import { HowDiagram } from "./HowDiagram";
import { Replay } from "./Replay";
import { PricingCards } from "./PricingCards";
import { Faq } from "./Faq";
import { Calendly } from "./Calendly";
import { BriefForm } from "./BriefForm";
import { Reveal } from "./Reveal";
import type { Company } from "@/lib/companies";

const H_DEFAULT = "The flight recorder for AI agents.";
const S_DEFAULT = "Replay every model and tool call. Prove nobody edited the record.";

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-page scroll-mt-16 px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="display mt-3 max-w-3xl text-3xl sm:text-4xl">{title}</h2>
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}

const PROBLEMS = [
  ["Scattered logs", "Model calls in one tool, shell commands in another, API calls somewhere else. Reconstructing a run means stitching them together by hand."],
  ["The agent's own trace", "If the agent reports what it did, you're trusting the thing under review. A wrong or incomplete self-report looks identical to a right one."],
  ["Logs anyone can edit", "Plain log files and database rows can be changed by anyone with access, and nothing shows that they were."],
];

const COMPARE: [string, string, string][] = [
  ["Question answered", "What did my agent do?", "Can I prove what my agent did?"],
  ["Where it records", "Inside your code, via SDK or callbacks", "At the gateway, outside the agent"],
  ["Edits to the record", "Possible, and not detectable", "Break the hash chain"],
  ["Checking it later", "Trust the vendor's dashboard", "Verify an exported ledger offline"],
];

export function HomePage({ company }: { company?: Company }) {
  const slug = company?.slug;
  const book = slug ? `/book?c=${slug}` : "/book";
  return (
    <>
      <Nav campaign={slug} />
      <main>
        <section className="relative overflow-hidden">
          <div className="grid-bg absolute inset-0" aria-hidden />
          <HeroTrace />
          <div className="relative mx-auto max-w-page px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-32">
            <div className="eyebrow">Black Box · by Radius</div>
            <h1 className="display mt-5 max-w-3xl text-[40px] sm:text-6xl lg:text-[68px]">{company?.headline ?? H_DEFAULT}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">{company?.support ?? S_DEFAULT}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={book} className="btn btn-primary">Book a 20-min call</Link>
              <a href="#tamper" className="btn btn-ghost">Try the tamper test <span aria-hidden>↓</span></a>
            </div>
            <p className="mt-6 font-mono text-xs text-muted">No customers yet. Taking 10 founding teams.</p>
          </div>
        </section>

        <Section eyebrow="The problem" title="When an agent goes wrong, can you prove what happened?">
          <div className="grid gap-4 md:grid-cols-3">
            {PROBLEMS.map(([t, d]) => (
              <Reveal key={t}><div className="card h-full p-6"><h3 className="font-medium">{t}</h3><p className="mt-2 text-[15px] leading-7 text-muted">{d}</p></div></Reveal>
            ))}
          </div>
        </Section>

        <Section id="tamper" eyebrow="Live tamper test" title="Edit the record. Watch the chain break.">
          <p className="mb-6 max-w-2xl leading-7 text-muted">
            This is a sample agent run{company?.flavor ? ` (a ${company.flavor.workflow})` : ""}, hashed with SHA-256 in your browser. Click any row, change an argument, and the verifier points at the exact entry.
          </p>
          <TamperTest flavor={company?.flavor} />
        </Section>

        <Section eyebrow="How it works" title="Recorded outside the agent. Sealed. Verifiable without us.">
          <HowDiagram />
          <Link href="/how-it-works" className="mt-6 inline-block text-sm text-muted hover:text-fg">Architecture and the ledger format →</Link>
        </Section>

        <Section eyebrow="Replay" title="Step through exactly what happened.">
          <Replay flavor={company?.flavor} />
        </Section>

        <Section eyebrow="Show vs prove" title="Tracing tools show you what happened. Black Box proves it.">
          <p className="mb-6 max-w-2xl leading-7 text-muted">Tracing tools and LLM gateways are good at what they do, and you'll likely keep them. Black Box answers a different question.</p>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[15px]">
              <thead><tr className="border-b border-line text-muted"><th className="p-4 font-normal" /><th className="p-4 font-normal">Tracing tools &amp; LLM gateways</th><th className="p-4 font-medium text-fg">Black Box</th></tr></thead>
              <tbody>{COMPARE.map(([a, b, c]) => (
                <tr key={a} className="border-b border-line last:border-0"><td className="p-4 text-muted">{a}</td><td className="p-4 text-muted">{b}</td><td className="p-4">{c}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </Section>

        <Section eyebrow="Founding partners" title="Ten places. Priced to make the first ten easy.">
          <PricingCards campaign={slug} />
          <Link href="/pricing" className="mt-6 inline-block text-sm text-muted hover:text-fg">Pricing details and FAQ →</Link>
        </Section>

        <Section eyebrow="FAQ" title="Straight answers.">
          <Faq />
        </Section>

        <Section id="call" eyebrow="Next step" title="20 minutes. Pick a workflow and we'll show you the replay.">
          <Calendly campaign={slug ?? "home"} />
          <div className="mt-10 max-w-xl">
            <p className="mb-3 text-sm text-muted">Not ready to talk? Get the 2-page technical brief.</p>
            <BriefForm campaign={slug} />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
