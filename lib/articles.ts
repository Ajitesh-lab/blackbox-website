// Explainer content. Written to answer one question each, directly, in the
// first paragraph. Guardrails: no statistics, no customers, no certifications,
// nothing claiming a feature that isn't confirmed. General technical facts only.
import type { QA } from "./faq";

export type Section = { h2: string; body: string[]; list?: string[]; code?: string };
export type Article = {
  slug: string;
  title: string; // <title> and og:title
  h1: string;
  description: string;
  answer: string; // direct answer shown at the top, reused in schema and llms.txt
  sections: Section[];
  faq: QA[];
  related: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "ai-agent-audit-log",
    title: "What is an AI agent audit log?",
    h1: "What is an AI agent audit log?",
    description: "An AI agent audit log is a record of every model call and tool call an agent makes. Learn what it should contain, who can edit it, and how to make it trustworthy.",
    answer: "An AI agent audit log is an ordered record of everything an agent did: each model call, each tool call, its arguments, its result and when it happened. It is only useful as evidence if the agent cannot write to it and nobody can change it without it showing.",
    sections: [
      { h2: "What should an agent audit log contain?", body: ["At minimum, every model call and every tool call, in order. For each entry you want the name of the call, its arguments, the result that came back, and a timestamp.", "That is enough to answer the questions that come up after something goes wrong: what did the agent call, in what order, with what input, and what happened."], list: ["The call name (for example a shell command, a database query or an API request)", "The arguments the agent passed", "The result it received", "A timestamp and a sequence number", "A link to the entry before it, so ordering can be checked"] },
      { h2: "Why is an ordinary log not enough?", body: ["Most agent logs are written by the agent's own code, or sit in a file or database that anyone with access can change. In both cases the record is only as trustworthy as whoever wrote or can edit it.", "That is fine for debugging. It is a problem when someone needs to rely on the record: a customer asking what the agent did to their data, a colleague reviewing an incident, or an insurer assessing a claim."] },
      { h2: "What makes an audit log trustworthy?", body: ["Two properties. First, it is recorded from outside the agent, so the agent cannot omit or rewrite its own steps. Second, it is tamper-evident, so any later edit is detectable.", "A common way to get the second property is a hash chain, where each entry's hash covers the previous entry's hash. Changing any entry breaks every hash after it."] },
      { h2: "How does Black Box approach it?", body: ["Black Box records calls at a gateway outside the agent, seals each entry in a SHA-256 hash chain, and is built so an exported ledger can be verified offline by a third party. The live tamper test on the home page shows the idea working in your browser."] },
    ],
    faq: [
      { q: "Is an audit log the same as observability or tracing?", a: "No. Tracing helps you understand and debug what your agent did. An audit log is meant to be relied on as evidence, which means it must be recorded outside the agent and be tamper-evident." },
      { q: "Do I need an audit log if my agent only reads data?", a: "It matters most when an agent writes, deploys, spends money or touches production. Read-only agents carry less risk, but a record can still be useful for review." },
    ],
    related: ["tamper-evident-logging-for-ai-agents", "ai-agent-observability-vs-audit-logs", "ai-agent-flight-recorder"],
  },
  {
    slug: "tamper-evident-logging-for-ai-agents",
    title: "Tamper-evident logging for AI agents, explained",
    h1: "Tamper-evident logging for AI agents, explained",
    description: "How a SHA-256 hash chain makes an AI agent's log tamper-evident: how it works, what it proves, and what it does not.",
    answer: "A tamper-evident log is one where any change to an earlier entry can be detected later. The standard technique is a hash chain: each entry stores a hash that covers its own contents and the previous entry's hash, so editing one entry breaks every hash after it.",
    sections: [
      { h2: "How does a hash chain work?", body: ["Take the first entry and hash its contents together with a fixed starting value. Take the second entry and hash its contents together with the first entry's hash. Continue down the log.", "Because each hash depends on the one before it, changing any field of any entry changes that entry's hash, which changes the next, and so on to the end."], code: `entry_hash = SHA-256( prev_hash + "\\n" + canonical_json(entry) )\nentry      = [seq, timestamp, kind, name, args, result]` },
      { h2: "How do you detect tampering?", body: ["A verifier recomputes the chain from the first entry and compares each result to the stored hash. The first mismatch is the entry that was changed, and everything after it stops matching.", "You can try this yourself in the tamper test on the Black Box home page: edit any argument and the verifier points at the exact entry."] },
      { h2: "What does a hash chain not prove?", body: ["Tamper-evidence means edits are detectable, not that the original record was complete or that the agent's decisions were good. A hash chain also cannot, on its own, stop someone who controls the whole log from rebuilding every hash. That is why a copy of the latest hash, or an exported ledger, should be held by someone other than the party being checked.", "How Black Box handles anchoring and exports is something we walk through on a call, against your setup."] },
      { h2: "Why use SHA-256?", body: ["SHA-256 is a widely implemented hash function available in every major language and in browsers through the Web Crypto API. That makes a log easy for a third party to verify with tools they already trust."] },
    ],
    faq: [
      { q: "Is a hash chain the same as a blockchain?", a: "A blockchain is a hash chain distributed across many parties with a consensus mechanism. A hash-chained log uses the same linking idea without the network or consensus." },
      { q: "Can a hash chain be edited without detection?", a: "Not if a verifier holds a trusted copy of an earlier hash or an exported ledger. Someone who controls the whole log and has no external copy to compare against could rebuild it, which is why independent copies matter." },
    ],
    related: ["how-to-verify-an-ai-agent-log-offline", "ai-agent-audit-log", "record-ai-agent-tool-calls-at-the-gateway"],
  },
  {
    slug: "ai-agent-observability-vs-audit-logs",
    title: "AI agent observability vs audit logs: what's the difference?",
    h1: "AI agent observability vs audit logs",
    description: "Tracing and observability tools help you debug an AI agent. An audit log helps you prove what it did. Here is how they differ and why you may want both.",
    answer: "Observability and tracing tools help you understand and debug what an AI agent did. An audit log is meant to be relied on as evidence: it is recorded outside the agent and is tamper-evident. Most teams benefit from both, because they answer different questions.",
    sections: [
      { h2: "What do tracing tools do well?", body: ["Tracing and LLM observability tools, such as LangSmith and Langfuse, are built for debugging, evaluation and monitoring. They show you prompts, responses, latency and cost, usually by instrumenting your code or sitting in the request path.", "You will likely keep using them. Black Box is not a replacement."] },
      { h2: "What is different about an audit log?", body: ["The question changes from \"what did my agent do?\" to \"can I prove what my agent did, to someone who does not trust me or the agent?\"", "That needs the record to be written from outside the agent, so it cannot be omitted or rewritten, and to be tamper-evident, so an edit shows up."] },
      { h2: "A side-by-side comparison", body: ["Typical tracing tools record inside your code through an SDK or callbacks, and you check the result by trusting the dashboard. An audit log records at a gateway outside the agent, and the result can be checked by anyone with the exported ledger."], list: ["Question answered: what did it do, versus can I prove it", "Where it records: inside your code, versus at the gateway", "Edits to the record: possible and not detectable, versus break the hash chain", "Checking later: trust the dashboard, versus verify an exported ledger offline"] },
    ],
    faq: [
      { q: "Do I still need LangSmith or Langfuse?", a: "Probably. They solve debugging and evaluation. Black Box answers a different question: proving what the agent did." },
      { q: "Does Black Box replace an LLM gateway?", a: "No. It records calls that pass through a gateway outside the agent. It is not trying to replace routing, caching or model management tools." },
    ],
    related: ["ai-agent-audit-log", "record-ai-agent-tool-calls-at-the-gateway", "ai-agent-flight-recorder"],
  },
  {
    slug: "how-to-verify-an-ai-agent-log-offline",
    title: "How to verify an AI agent's log offline",
    h1: "How to verify an AI agent's log offline",
    description: "How a third party can check an AI agent's hash-chained log without an account and without trusting the vendor.",
    answer: "To verify an agent's log offline, export the ledger, recompute the SHA-256 hash chain from the first entry, and compare each hash to the one stored. The first mismatch is the entry that was changed. Nothing about this requires an account or a network connection.",
    sections: [
      { h2: "What do you need?", body: ["An exported copy of the ledger and the published description of the hash format. The format Black Box uses is on the how-it-works page."], list: ["The exported ledger (entries and their stored hashes)", "The hash format: SHA-256 over the previous hash plus canonical JSON of the entry", "Any SHA-256 implementation"] },
      { h2: "What are the steps?", body: ["Start from the fixed genesis value, then walk the log in order."], list: ["Set prev to 64 zeros", "For each entry, compute SHA-256(prev + newline + canonical entry)", "Compare the result to the entry's stored hash", "If they match, set prev to that hash and continue", "If not, report this entry as the first that fails"] },
      { h2: "Why does offline matter?", body: ["If checking a log requires the vendor's dashboard, you are trusting the vendor. Offline verification means a customer, an auditor or an insurer can check the record themselves.", "The Black Box offline verifier is in pilot. The tamper test on the home page runs the same check in your browser."] },
    ],
    faq: [
      { q: "Can I verify a log without trusting the vendor?", a: "That is the design goal. Verification uses a public hash format and an exported ledger, so it does not depend on the vendor's servers." },
      { q: "What does a failed verification tell me?", a: "It tells you the first entry whose contents no longer match its stored hash, and that every entry after it can no longer be relied on." },
    ],
    related: ["tamper-evident-logging-for-ai-agents", "ai-agent-audit-log", "ai-agent-insurance-claims-evidence"],
  },
  {
    slug: "ai-agent-insurance-claims-evidence",
    title: "Evidence for AI agent insurance claims",
    h1: "Evidence for AI agent insurance claims",
    description: "When an AI agent causes a loss, the record of what it did is usually controlled by the policyholder. Here is how a tamper-evident log helps insurers verify claims.",
    answer: "When an AI agent causes a loss, the evidence is usually the agent's own account or logs the operator controls. A tamper-evident record, written outside the agent and verifiable offline, gives an insurer an independent way to check what happened and to spot altered evidence.",
    sections: [
      { h2: "Why is agent evidence hard to trust?", body: ["An agent that deletes data, moves money or deploys bad code leaves a trail. That trail is normally written by the agent's own code or stored where the policyholder can edit it.", "An insurer assessing the claim has no way to tell a complete, original record from an edited one."] },
      { h2: "What would a better record look like?", body: ["One recorded outside the agent, in order, with each entry chained to the one before. The insurer can then verify an exported ledger and see exactly where, if anywhere, it was altered."] },
      { h2: "What is the workflow?", body: ["This is what Black Box is building toward, and the offline verifier is in pilot."], list: ["Incident: the agent does something that leads to a claim", "Export: the policyholder exports the run's ledger", "Verify: the insurer checks the hash chain offline", "Settle: decide from what the agent actually called, when, with what result"] },
      { h2: "What are the limits?", body: ["A verified ledger shows what the agent called and that the record was not altered. It does not decide whether the action was reasonable or whether the policy covers it."] },
    ],
    faq: [
      { q: "Does Black Box work with insurers today?", a: "We have no insurer customers yet. We are running free 2-week pilots with a small number of teams, and we are interested in talking to insurers." },
      { q: "Is a Black Box ledger admissible in court?", a: "We make no claim about legal admissibility. It is built so a third party can verify the log offline." },
    ],
    related: ["how-to-verify-an-ai-agent-log-offline", "tamper-evident-logging-for-ai-agents", "ai-agent-audit-log"],
  },
  {
    slug: "record-ai-agent-tool-calls-at-the-gateway",
    title: "Why record AI agent tool calls at a gateway",
    h1: "Why record AI agent tool calls at a gateway, outside the agent",
    description: "Recording an AI agent's model and tool calls at a gateway, rather than inside the agent, stops the agent from omitting or rewriting its own record.",
    answer: "Record at a gateway outside the agent because then the agent has no write access to its own record. It cannot leave a step out or rewrite one, whether through a bug, a prompt injection or a compromised dependency.",
    sections: [
      { h2: "What goes wrong when the agent records itself?", body: ["If the agent or its SDK writes the log, the log is only as reliable as that code. A bug can drop entries. A prompt injection can change behaviour. In both cases the record may look complete when it is not."] },
      { h2: "What does a gateway change?", body: ["A gateway sits between the agent and the things it calls: model providers, tools, shells, APIs. Every call passes through it, so it can record each one independently of what the agent reports."] },
      { h2: "What are the trade-offs?", body: ["The gateway adds a network hop, so latency should be measured on your workflow. It also only sees calls routed through it. Black Box measures the added latency during the pilot rather than quoting a number here."] },
    ],
    faq: [
      { q: "Do I have to change my agent's code?", a: "You route its model and tool calls through the gateway with a few lines of config. We set it up with you during the pilot." },
      { q: "What if the agent bypasses the gateway?", a: "Then those calls are not recorded. The gateway only sees traffic routed through it, which is one of the limits we state openly." },
    ],
    related: ["ai-agent-observability-vs-audit-logs", "tamper-evident-logging-for-ai-agents", "ai-agent-flight-recorder"],
  },
  {
    slug: "ai-agent-flight-recorder",
    title: "What is a flight recorder for AI agents?",
    h1: "What is a flight recorder for AI agents?",
    description: "A flight recorder for AI agents records every model and tool call so you can replay what happened and prove the record was not altered.",
    answer: "A flight recorder for AI agents is a system that records every model call and tool call an agent makes, independently of the agent, so that after an incident you can replay exactly what happened and verify that the record was not edited.",
    sections: [
      { h2: "Why the flight recorder analogy?", body: ["Aircraft flight recorders are built to survive the incident and to be trusted afterwards, because investigators cannot rely on the crew's account alone. They are also painted international orange so they can be found in wreckage.", "AI agents that touch production face the same problem: after something goes wrong, you need a record that does not depend on the thing under review."] },
      { h2: "What does it do?", body: ["Three things, in order."], list: ["Records every model and tool call from outside the agent", "Seals each entry in a hash chain so edits are detectable", "Lets you replay the run step by step, and verify the ledger offline"] },
      { h2: "Is Black Box one?", body: ["That is the idea behind Black Box. You can see a sample replay and edit the record yourself in the tamper test on the home page."] },
    ],
    faq: [
      { q: "Does a flight recorder prevent incidents?", a: "No. It shows what the agent called, when, with what result, and whether the record was altered. It does not stop an agent doing something wrong." },
      { q: "Who needs one?", a: "Teams whose agents run code, call tools or touch production, and anyone who has to rely on a record of what an agent did, such as customers or insurers." },
    ],
    related: ["ai-agent-audit-log", "ai-agent-observability-vs-audit-logs", "ai-agent-insurance-claims-evidence"],
  },
];

export const bySlug = (s: string) => ARTICLES.find((a) => a.slug === s);

export const GLOSSARY: { term: string; def: string; link?: string }[] = [
  { term: "AI agent audit log", def: "An ordered record of every model call and tool call an AI agent makes, intended to be relied on as evidence.", link: "/learn/ai-agent-audit-log" },
  { term: "Flight recorder for AI agents", def: "A system that records an agent's calls independently of the agent so the run can be replayed and the record verified.", link: "/learn/ai-agent-flight-recorder" },
  { term: "Tamper-evident log", def: "A log in which any change to an earlier entry can be detected later.", link: "/learn/tamper-evident-logging-for-ai-agents" },
  { term: "Hash chain", def: "A sequence of entries where each entry's hash covers its own contents and the previous entry's hash, so changing one entry breaks all later hashes.", link: "/learn/tamper-evident-logging-for-ai-agents" },
  { term: "Gateway", def: "A component between an agent and the things it calls, through which every model and tool call passes and can be recorded independently.", link: "/learn/record-ai-agent-tool-calls-at-the-gateway" },
  { term: "Ledger", def: "The exported, hash-chained record of an agent run." },
  { term: "Offline verification", def: "Checking a ledger's hash chain with no account and no network access to the vendor.", link: "/learn/how-to-verify-an-ai-agent-log-offline" },
  { term: "Replay", def: "Stepping through a recorded run to see exactly what was called, when, with what result." },
  { term: "Tool call", def: "An action an agent takes beyond generating text, such as running a shell command, querying a database or calling an API." },
  { term: "Prompt injection", def: "Untrusted input that changes an agent's behaviour. A record kept outside the agent still captures what the agent then did." },
];
