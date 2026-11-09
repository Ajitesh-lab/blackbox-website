// Honest answers. No customers, no certifications, nothing that isn't built.
export const FAQ: { q: string; a: string }[] = [
  { q: "Do you have customers?", a: "Not yet. We're taking 10 founding teams, and you'd be one of the first. That's why the founding price exists." },
  { q: "Can the agent tamper with its own record?", a: "The record is written by the gateway, outside the agent, so the agent never holds the pen. Entries are hash-chained, so editing any one breaks every hash after it." },
  { q: "Do I have to trust you to check the log?", a: "No. The verifier runs offline on an exported ledger. It's built so a third party can verify the log without our involvement." },
  { q: "How big is the setup?", a: "One workflow and a few lines of config to route calls through the gateway. We set up the pilot with you on a call." },
  { q: "Will it slow my agent down?", a: "The gateway adds a hop. We'll measure it on your workflow during the pilot and show you the numbers rather than quote one here." },
  { q: "What does it not do?", a: "It doesn't prevent incidents or judge whether an action was right. It shows what the agent called, when, with what result, and proves the record wasn't altered." },
];
