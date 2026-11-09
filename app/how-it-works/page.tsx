import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { HowDiagram } from "@/components/HowDiagram";

export const metadata: Metadata = { title: "How it works" };

export default function Page() {
  return (
    <DocPage light eyebrow="How it works" title="Recorded outside the agent. Verified without us."
      intro="The design goal is one property: someone who doesn't trust the agent, or us, can still check what happened.">
      <HowDiagram />
      <section>
        <h2>What's recorded</h2>
        <p>Every model call and tool call that passes through the gateway: the call name, its arguments, the result, and a timestamp, in order. That is what the agent called, when, with what result.</p>
      </section>
      <section>
        <h2>Why outside the agent</h2>
        <p>The gateway sits between the agent and the things it calls. The agent never writes its own record, so it can't omit or rewrite a step, whether by bug or by prompt injection.</p>
      </section>
      <section>
        <h2>The hash-chain format</h2>
        <p>Each entry's hash covers the previous entry's hash plus the entry's own contents. The first entry chains from 64 zeros.</p>
        <pre>{`entry_hash = SHA-256( prev_hash + "\\n" + canonical_json(entry) )
entry      = [seq, timestamp, kind, name, args, result]`}</pre>
        <p>Change any field of any entry and its hash changes, which changes every hash after it. That is exactly what the tamper test on the home page does, with the same construction.</p>
      </section>
      <section>
        <h2>Offline verification</h2>
        <p>The verifier takes an exported ledger, recomputes the chain from the first entry and reports the first entry that no longer matches. It needs no account and makes no network calls. It's built so a third party can verify the log offline.</p>
      </section>
      <section>
        <h2>What it doesn't do</h2>
        <ul className="list-disc space-y-1 pl-5 text-muted">
          <li>It doesn't prevent incidents or decide whether an action was correct.</li>
          <li>It only sees calls routed through the gateway.</li>
          <li>It shows the record is unaltered. It does not make the agent's decisions good.</li>
        </ul>
      </section>
    </DocPage>
  );
}
