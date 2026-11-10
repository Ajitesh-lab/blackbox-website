import Link from "next/link";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Recorder } from "./Recorder";
import { TamperTest } from "./TamperTest";
import { Story } from "./Story";
import { Replay } from "./Replay";
import { Laptop } from "./Laptop";
import { PilotBlock } from "./PilotBlock";
import { Faq } from "./Faq";
import { Calendly } from "./Calendly";
import { BriefForm } from "./BriefForm";
import { BookLink } from "./BookLink";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { JsonLd } from "./JsonLd";
import { ARTICLES } from "@/lib/articles";
import { ENTITY_DEFINITION, faqLd } from "@/lib/seo";
import { FAQ_HOME } from "@/lib/faq";
import { CALL_LABEL, CALL_MINUTES, OFFER } from "@/lib/site";
import type { Company } from "@/lib/companies";

const H_DEFAULT = "Prove exactly what your AI agent did.";
const S_DEFAULT = "Black Box records every model and tool call your agent makes, from outside the agent, in a tamper-evident log anyone can verify. Built for teams shipping agents, and the insurers covering them.";

const SPECS = [
  ["Records", "Every model and tool call"],
  ["Position", "Gateway, outside the agent"],
  ["Seal", "SHA-256 hash chain"],
  ["Verification", "Offline, by anyone (in pilot)"],
];

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
        {/* hero */}
        <section className="relative overflow-hidden">
          <div className="halo absolute inset-0" aria-hidden />
          <div className="frame grid items-center gap-x-10 gap-y-10 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.08fr_1fr] lg:pb-24 lg:pt-28 [&>*]:min-w-0">
            <div>
              <p className="label flex items-center gap-2.5"><span aria-hidden className="h-px w-6 bg-accent" />The flight recorder for AI agents</p>
              <h1 className="display rise mt-6 text-[44px] sm:text-6xl lg:text-[72px]">
                {(company?.headline ?? H_DEFAULT).split(" ").map((w, i) => <span key={i} style={{ animationDelay: `${i * 55}ms` }}>{w}&nbsp;</span>)}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted">{company?.support ?? S_DEFAULT}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <BookLink campaign={slug} where="hero">{CALL_LABEL}</BookLink>
                <a href="#tamper" className="btn btn-ghost">Try the tamper test <span aria-hidden>↓</span></a>
              </div>
              <p className="mt-5 font-mono text-xs text-muted">{OFFER.note}</p>
            </div>
            <Recorder />
          </div>
          <dl className="frame relative flex flex-wrap gap-x-14 gap-y-6 pb-6">
            {SPECS.map(([k, v]) => (
              <div key={k}>
                <dt className="label">{k}</dt>
                <dd className="mt-1.5 text-[15px]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Section id="what" n="01" label="Definition" title="What is Black Box?">
          <p className="-mt-6 max-w-4xl text-2xl leading-[1.5] text-muted sm:text-[32px] sm:leading-[1.42]">{ENTITY_DEFINITION}</p>
          <div className="mt-16 grid gap-x-16 gap-y-10 sm:grid-cols-2" aria-label="Who it's for">
            <a href="#how" className="group block">
              <h3 className="display text-2xl sm:text-3xl">I build agents <span aria-hidden className="inline-block text-accent transition-transform duration-300 group-hover:translate-x-2">→</span></h3>
              <p className="mt-3 max-w-sm leading-7 text-muted">Debug runs, and hand customers proof of what the agent did. <span className="text-fg">See how it works.</span></p>
            </a>
            <Link href="/insurers" className="group block">
              <h3 className="display text-2xl sm:text-3xl">I insure agents <span aria-hidden className="inline-block text-accent transition-transform duration-300 group-hover:translate-x-2">→</span></h3>
              <p className="mt-3 max-w-sm leading-7 text-muted">Verify claims and spot fraud with an independent record of what the agent did. <span className="text-fg">For insurers.</span></p>
            </Link>
          </div>
        </Section>

        <Section id="problem" n="02" label="The problem" title="When an agent goes wrong, can you prove what happened?">
          <div className="grid gap-x-12 gap-y-12 md:grid-cols-3">
            {PROBLEMS.map(([t, d], i) => (
              <Reveal key={t}>
                <div style={{ marginTop: `${i * 0}px` }} className={i === 1 ? "md:mt-14" : i === 2 ? "md:mt-28" : ""}>
                  <span className="font-mono text-xs text-dim">{String.fromCharCode(97 + i)}.</span>
                  <h3 className="mt-3 text-xl font-medium tracking-tight">{t}</h3>
                  <p className="mt-3 leading-7 text-muted">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="tamper" n="03" label="Live tamper test" title="Edit the record. Watch the chain break."
          lede={<>A sample agent run{company?.flavor ? ` (a ${company.flavor.workflow})` : ""}, hashed with SHA-256 in your browser. Click any row, change an argument, and the verifier points at the exact entry.</>}>
          <TamperTest flavor={company?.flavor} />
        </Section>

        <section id="how" aria-labelledby="how-h" className="scroll-mt-14">
          <div className="frame pt-20 sm:pt-32">
            <Reveal>
              <p className="label"><span className="mr-3 text-accent">04</span>How it works</p>
              <h2 id="how-h" className="display mt-5 max-w-4xl text-[34px] sm:text-[54px]">The agent never writes its own record, so it can&apos;t edit it.</h2>
            </Reveal>
            <div className="mt-6 lg:-mt-10"><Story /></div>
            <Link href="/how-it-works" className="link relative z-10 inline-block text-sm lg:-mt-10">Architecture and the ledger format →</Link>
          </div>
        </section>

        <Section id="replay" n="05" label="Replay" title="Step through exactly what happened." center
          lede="Every recorded run can be replayed call by call: what was called, with what arguments, what came back, and when. This one is live. Press play.">
          <Laptop title="Black Box replay console, sample run"><Replay flavor={company?.flavor} /></Laptop>
        </Section>

        <Section id="compare" n="06" label="Tracing vs evidence" title="Tracing tells you what happened. Black Box gives you evidence you can hand to someone else."
          lede="Tracing tools and LLM gateways are good at what they do, and you'll likely keep them. Black Box answers a different question.">
          <table className="w-full text-left">
            <caption className="sr-only">Comparison of tracing tools and LLM gateways with Black Box</caption>
            <thead className="hidden md:table-header-group"><tr><th scope="col" className="w-[22%] pb-4"><span className="sr-only">Aspect</span></th><th scope="col" className="label w-[36%] pb-4 font-normal">Tracing tools &amp; LLM gateways</th><th scope="col" className="label pb-4 font-normal !text-fg">Black Box</th></tr></thead>
            <tbody>{COMPARE.map(([a, b, c]) => (
              <tr key={a} className="block border-t border-line py-6 md:table-row md:py-0">
                <th scope="row" className="label block pb-2 font-normal md:table-cell md:py-7 md:align-baseline">{a}</th>
                <td className="block pb-1 text-muted md:table-cell md:py-7 md:pr-8 md:align-baseline md:text-lg"><span className="md:hidden">Tracing: </span>{b}</td>
                <td className="display block text-xl md:table-cell md:py-7 md:align-baseline md:text-[26px]">{c}</td>
              </tr>
            ))}</tbody>
          </table>
          <Link href="/learn/ai-agent-observability-vs-audit-logs" className="link mt-8 inline-block text-sm">Observability vs audit logs, in detail →</Link>
        </Section>

        <Section id="insurers" n="07" label="For insurers" title="Insurers: settle claims from a record nobody can quietly edit."
          lede="Attach Black Box to a policyholder's agent and get an independent, tamper-evident record of what it did, so you can verify claims and spot fraud.">
          <Link href="/insurers" className="btn btn-ghost -mt-6">How it works for insurers <span aria-hidden>→</span></Link>
        </Section>

        <Section id="pilot" n="08" label="Pilot terms" title="How the pilot works">
          <PilotBlock campaign={slug} />
        </Section>

        <Section id="faq" n="09" label="FAQ" title="Questions teams ask us">
          <Faq items={FAQ_HOME} />
          <Link href="/security" className="link mt-8 inline-block text-sm">Security, data handling and more answers →</Link>
        </Section>

        <Section id="guides" n="10" label="Guides" title="Learn the ideas behind it">
          <ul>
            {ARTICLES.slice(0, 6).map((a, i) => (
              <li key={a.slug} className="border-t border-line">
                <Link href={`/learn/${a.slug}`} className="row group grid gap-x-8 gap-y-1 py-6 md:grid-cols-[40px_1fr_1.1fr_24px] md:items-baseline">
                  <span className="hidden font-mono text-xs text-dim md:block">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-xl font-medium tracking-tight">{a.h1}</h3>
                  <p className="text-[15px] leading-6 text-muted">{a.answer.split(". ")[0]}.</p>
                  <span aria-hidden className="hidden text-dim transition-colors group-hover:text-accent md:block">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/learn" className="link mt-8 inline-block text-sm">All {ARTICLES.length} guides →</Link>
        </Section>

        <Section id="call" n="11" label="Talk to us" title={`Book a ${CALL_MINUTES}-min call. Bring one agent workflow and we'll show you what its record would look like.`}>
          <dl className="mb-12 flex flex-wrap gap-x-14 gap-y-6">
            {OBJECTIONS.map(([k, v]) => (
              <div key={k}><dt className="label">{k}</dt><dd className="mt-1.5 text-[15px]">{v}</dd></div>
            ))}
          </dl>
          <Calendly campaign={slug ?? "home"} />
          <div className="mt-12 max-w-xl">
            <p className="mb-3 text-sm text-muted">Not ready to talk? Get the 2-page technical brief.</p>
            <BriefForm campaign={slug} />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
