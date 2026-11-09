// Honest answers. No customers, no certifications, nothing that isn't built.
export type QA = { q: string; a: string };

export const FAQ_HOME: QA[] = [
  { q: "Do you have customers?", a: "Not yet. We're running free 2-week pilots with a small number of teams, and you'd be one of the first." },
  { q: "What happens after the 2 weeks?", a: "If you keep using it, it becomes a monthly subscription at a price we agree before the pilot starts. If not, you walk away." },
  { q: "Do I need to give you my card to start?", a: "No. We don't take a card until the pilot ends." },
  { q: "How big is the setup?", a: "One workflow and a few lines of config to route its calls through the gateway. We do it with you on the pilot." },
  { q: "Will it slow my agent down?", a: "The gateway adds a hop. We'll measure it on your workflow during the pilot and show you the numbers rather than quote one here." },
  { q: "Which stacks do you support?", a: "We confirm that on the call, against the workflow you want to record." },
];

export const FAQ_SECURITY: QA[] = [
  { q: "Where is my data stored?", a: "Hosting region and retention are agreed with you in writing before the pilot starts." },
  { q: "Can the agent tamper with its own record?", a: "The gateway writes the record from outside the agent, so the agent has no write access to it. Entries are hash-chained, so editing any one breaks every hash after it." },
  { q: "Do I have to trust you to check the log?", a: "No. The verifier is built so a third party can check an exported ledger offline, without our involvement. It's in pilot." },
  { q: "What does it not do?", a: "It doesn't prevent incidents or judge whether an action was right. It shows what the agent called, when, with what result, and whether the record was altered." },
  { q: "Do you have certifications?", a: "No. We have no certifications or audit reports today and won't imply otherwise." },
  { q: "Do you have customers?", a: "Not yet. We're running free 2-week pilots with a small number of teams, and you'd be one of the first." },
];
