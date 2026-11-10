import Link from "next/link";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { HeroLedger } from "./HeroLedger";
import { TamperTest } from "./TamperTest";
import { HowDiagram } from "./HowDiagram";
import { Replay } from "./Replay";
import { PilotBlock } from "./PilotBlock";
import { Faq } from "./Faq";
import { Calendly } from "./Calendly";
import { BriefForm } from "./BriefForm";
import { BookLink } from "./BookLink";
import { Reveal } from "./Reveal";
import { JsonLd } from "./JsonLd";
import { ARTICLES } from "@/lib/articles";
import { ENTITY_DEFINITION, faqLd } from "@/lib/seo";
import { FAQ_HOME } from "@/lib/faq";
import { CALL_LABEL, CALL_MINUTES, OFFER } from "@/lib/site";
import type { Company } from "@/lib/companies";

const H_DEFAULT = "Prove exactly what your AI agent did.";
const S_DEFAULT = "Black Box records every model and tool call your agent makes, from outside the agent, in a tamper-evident log anyone can verify. Built for teams shipping agents, and the insurers covering them.";

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-page scroll-mt-16 px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
        <h2 className="display max-w-3xl text-3xl sm:text-4xl">{title}</h2>
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}

const PROBLEMS = [
  ["Scattered logs", "Model calls in one tool, shell commands in another, API calls somewhere else. Reconstructing one run means stitching them together by hand."],
  ["The agent's own trace", "If the agent reports what it did, you're trusting the thing under review. A wrong or incomplete self-report looks identical to a right one."],
  ["Logs anyone can edit", "Plain log files and database rows can be changed by anyone with access, and nothing shows that they were."],
];

const COMPARE: [string, string, string][] = [
  ["Question answered", "What did my agent do?", "Can I prove what my agent did?"],
  ["Where it records", "Inside your code, via SDK or callbacks", "At the gateway, outside the agent"],
  ["Edits to the record", "Possible, and not detectable", "Break the hash chain"],
  ["Checking it later", "Trust the vendor's dashboard", "Verify an exported ledger offline"],
];

const OBJECTIONS = [
  ["Setup", "One workflow, a few lines of config"],
  ["Cost to start", "Free for two weeks, no card"],
  ["Stacks", "Confirmed on the call"],
  ["Your data", "Region and retention agreed in writing"],
];

export function HomePage({ company }: { company?: Company }) {
  const slug = company?.slug;
  return (
    <>
      {!company && <JsonLd data={faqLd(FAQ_HOME)} />}
      <Nav campaign={slug} />
      <main id="main">
        <section className="relative overflow-hidden">
          <div className="grid-bg absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid max-w-page items-center gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-24 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <div className="eyebrow">The flight recorder for AI agents</div>
              <h1 className="display mt-5 text-[40px] sm:text-6xl lg:text-[60px]">{company?.headline ?? H_DEFAULT}</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted">{company?.support ?? S_DEFAULT}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <BookLink campaign={slug} where="hero">{CALL_LABEL}</BookLink>
                <a href="#tamper" className="btn btn-ghost">Try the tamper test <span aria-hidden>↓</span></a>
              </div>
              <p className="mt-5 font-mono text-xs text-muted">{OFFER.note}</p>
            </div>
            <HeroLedger />
          </div>
        </section>

        <section aria-labelledby="what-is" className="mx-auto max-w-page px-4 pt-16 sm:px-6 sm:pt-20">
          <h2 id="what-is" className="eyebrow mb-3">What is Black Box?</h2>
          <p className="max-w-3xl text-xl leading-9 sm:text-2xl sm:leading-10">{ENTITY_DEFINITION}</p>
        </section>

        <section aria-label="Who it's for" className="mx-auto grid max-w-page gap-px overflow-hidden border-y border-line bg-line px-0 sm:grid-cols-2 sm:rounded-xl sm:border">
          <a href="#how" className="group bg-bg p-6 hover:bg-panel sm:p-8">
            <div className="font-medium">I build agents</div>
            <p className="mt-1.5 text-sm leading-6 text-muted">Debug runs, and hand customers proof of what the agent did.</p>
            <span className="mt-3 inline-block text-sm text-accent">See how it works <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span></span>
          </a>
          <Link href="/insurers" className="group bg-bg p-6 hover:bg-panel sm:p-8">
            <div className="font-medium">I insure agents</div>
            <p className="mt-1.5 text-sm leading-6 text-muted">Verify claims and spot fraud with an independent record of what the agent did.</p>
            <span className="mt-3 inline-block text-sm text-accent">For insurers <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span></span>
          </Link>
        </section>

        <Section title="When an agent goes wrong, can you prove what happened?">
          <div className="divide-y divide-line border-y border-line">
            {PROBLEMS.map(([t, d], i) => (
              <Reveal key={t}>
                <div className="grid gap-2 py-6 md:grid-cols-[48px_240px_1fr] md:gap-6">
                  <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-medium">{t}</h3>
                  <p className="leading-7 text-muted">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="tamper" eyebrow="Live tamper test" title="Edit the record. Watch the chain break.">
          <p className="mb-6 max-w-2xl leading-7 text-muted">
            A sample agent run{company?.flavor ? ` (a ${company.flavor.workflow})` : ""}, hashed with SHA-256 in your browser. Click any row, change an argument, and the verifier points at the exact entry.
          </p>
          <TamperTest flavor={company?.flavor} />
        </Section>

        <Section id="how" title="The agent never writes its own record, so it can't edit it.">
          <HowDiagram />
          <Link href="/how-it-works" className="mt-8 inline-block text-sm text-muted hover:text-fg">Architecture and the ledger format →</Link>
        </Section>

        <Section title="Step through exactly what happened.">
          <Replay flavor={company?.flavor} />
        </Section>

        <Section title="Tracing tells you what happened. Black Box gives you evidence you can hand to someone else.">
          <p className="mb-6 max-w-2xl leading-7 text-muted">Tracing tools and LLM gateways are good at what they do, and you'll likely keep them. Black Box answers a different question.</p>
          <div className="hidden overflow-hidden rounded-xl border border-line md:block">
            <table className="w-full text-left text-[15px]">
              <caption className="sr-only">Comparison of tracing tools and LLM gateways with Black Box</caption>
              <thead><tr className="border-b border-line bg-panel text-muted"><th scope="col" className="p-4 font-normal"><span className="sr-only">Aspect</span></th><th scope="col" className="p-4 font-normal">Tracing tools &amp; LLM gateways</th><th scope="col" className="p-4 font-medium text-fg">Black Box</th></tr></thead>
              <tbody>{COMPARE.map(([a, b, c]) => (
                <tr key={a} className="border-b border-line last:border-0"><th scope="row" className="p-4 font-normal text-muted">{a}</th><td className="p-4 text-muted">{b}</td><td className="p-4">{c}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {COMPARE.map(([a, b, c]) => (
              <div key={a} className="card p-4 text-[15px]">
                <div className="eyebrow mb-2">{a}</div>
                <p className="text-muted">Tracing tools: {b}</p>
                <p className="mt-1.5">Black Box: {c}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Insurers: settle claims from a record nobody can quietly edit.">
          <p className="max-w-2xl leading-7 text-muted">Attach Black Box to a policyholder's agent and get an independent, tamper-evident record of what it did, so you can verify claims and spot fraud.</p>
          <Link href="/insurers" className="btn btn-ghost mt-6">How it works for insurers <span aria-hidden>→</span></Link>
        </Section>

        <Section eyebrow="Pilot terms" title="How the pilot works">
          <PilotBlock campaign={slug} />
        </Section>

        <Section title="Questions teams ask us">
          <Faq items={FAQ_HOME} />
        </Section>

        <Section title="Learn the ideas behind it">
          <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {ARTICLES.slice(0, 4).map((a) => (
              <li key={a.slug} className="bg-bg"><Link href={`/learn/${a.slug}`} className="block h-full p-5 hover:bg-panel"><div className="font-medium">{a.h1}</div><p className="mt-1.5 text-sm leading-6 text-muted">{a.answer.split(". ")[0]}.</p></Link></li>
            ))}
          </ul>
          <Link href="/learn" className="mt-6 inline-block text-sm text-muted hover:text-fg">All guides →</Link>
        </Section>

        <Section id="call" title={`Book a ${CALL_MINUTES}-min call. Bring one agent workflow and we'll show you what its record would look like.`}>
          <ul className="mb-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
            {OBJECTIONS.map(([k, v]) => (
              <li key={k} className="bg-bg p-4"><div className="font-mono text-xs text-muted">{k}</div><div className="mt-1 text-sm">{v}</div></li>
            ))}
          </ul>
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
