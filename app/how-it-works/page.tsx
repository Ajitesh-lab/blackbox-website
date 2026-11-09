import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { HowDiagram } from "@/components/HowDiagram";
import { BookLink } from "@/components/BookLink";
import { CALL_LABEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "How Black Box records and verifies an agent run",
  description: "The gateway records every model and tool call outside the agent, a hash chain seals each entry, and an exported ledger can be verified offline.",
  alternates: { canonical: "/how-it-works" },
};

const H2 = "text-2xl font-semibold tracking-tight";
const P = "mt-4 max-w-3xl leading-7 text-muted";

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-page px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="display max-w-3xl text-4xl sm:text-5xl">How Black Box records and verifies an agent run</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">The design goal is one property: someone who doesn't trust the agent, or us, can still check what happened.</p>
        <div className="mt-14"><HowDiagram /></div>
        <div className="mt-16 max-w-3xl space-y-12">
          <section><h2 className={H2}>What's recorded</h2><p className={P}>Every model call and tool call that passes through the gateway: the call name, its arguments, the result, and a timestamp, in order. That is what the agent called, when, with what result.</p></section>
          <section><h2 className={H2}>Why outside the agent</h2><p className={P}>The gateway sits between the agent and the things it calls. The agent has no write access to its own record, so it can't omit or rewrite a step, whether by bug or by prompt injection.</p></section>
          <section>
            <h2 className={H2}>The hash-chain format</h2>
            <p className={P}>Each entry's hash covers the previous entry's hash plus the entry's own contents. The first entry chains from 64 zeros.</p>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-panel p-4 font-mono text-[12.5px] leading-6">{`entry_hash = SHA-256( prev_hash + "\\n" + canonical_json(entry) )
entry      = [seq, timestamp, kind, name, args, result]`}</pre>
            <p className={P}>Change any field of any entry and its hash changes, which changes every hash after it. The tamper test on the home page uses this same construction.</p>
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
    </>
  );
}
