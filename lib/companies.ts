// One data file drives every /for/<company> page. Add a row, get a page.
// Only add a company once its copy is real. Copy must stay within the claims
// guardrails: no customers, logos, certifications or unbuilt features.
import type { Flavor } from "./sample-run";

export type Company = { slug: string; name: string; headline: string; support: string; flavor?: Flavor };

const deploy: Flavor = {
  workflow: "deploy",
  steps: [
    { kind: "model", name: "plan", args: "task=ship PR #2291 to prod", result: "4 steps planned" },
    { kind: "tool", name: "git.diff", args: "main..pr-2291 --stat", result: "6 files, +212 -48" },
    { kind: "tool", name: "ci.status", args: "pr=2291", result: "passed (14m)" },
    { kind: "model", name: "decide", args: "risk=low migrate=false", result: "proceed" },
    { kind: "tool", name: "deploy.start", args: "env=prod service=api sha=9f3c1ab", result: "rollout=r-8841" },
    { kind: "tool", name: "k8s.wait", args: "rollout r-8841 timeout=300s", result: "ready 6/6" },
    { kind: "tool", name: "http.get", args: "https://api.example.com/healthz", result: "200 ok 38ms" },
    { kind: "tool", name: "metrics.query", args: "p95_latency 5m", result: "212ms (baseline 208ms)" },
    { kind: "model", name: "summarise", args: "steps=7", result: "deploy healthy" },
    { kind: "tool", name: "slack.post", args: "#deploys \"api 9f3c1ab live\"", result: "ok" },
  ],
};

export const COMPANIES: Company[] = [
  {
    slug: "kestrel",
    name: "Kestrel",
    headline: "Replay every deploy your Kestrel agent makes.",
    support: "Black Box records each model and tool call at the gateway and seals it in a hash chain, so after a deploy you can show exactly what ran, in order, and prove the record wasn't edited.",
    flavor: deploy,
  },
];

export const bySlug = (slug: string) => COMPANIES.find((c) => c.slug === slug);
