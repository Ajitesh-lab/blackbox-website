import type { Body } from "./chain";

export type Flavor = {
  /** short label used in copy, e.g. "deploy" */
  workflow: string;
  steps: Omit<Body, "seq" | "t">[];
};

const T0 = Date.UTC(2026, 10, 3, 14, 2, 11);
const stamp = (i: number) => new Date(T0 + i * 1840).toISOString().slice(11, 23) + "Z";

export function buildBodies(f: Flavor): Body[] {
  return f.steps.map((s, i) => ({ seq: i + 1, t: stamp(i), ...s }));
}

export const GENERIC: Flavor = {
  workflow: "agent run",
  steps: [
    { kind: "model", name: "plan", args: "task=rotate staging db credentials", result: "3 steps planned" },
    { kind: "tool", name: "vault.read", args: "path=staging/db/readonly", result: "ok (secret redacted)" },
    { kind: "tool", name: "sql.query", args: "SELECT count(*) FROM sessions", result: "rows=48213" },
    { kind: "model", name: "decide", args: "confirm target=staging", result: "proceed" },
    { kind: "tool", name: "vault.write", args: "path=staging/db/app rotate=true", result: "version=14" },
    { kind: "tool", name: "shell.exec", args: "kubectl rollout restart deploy/api -n staging", result: "exit=0" },
    { kind: "tool", name: "http.get", args: "https://staging.internal/healthz", result: "200 ok 41ms" },
    { kind: "model", name: "summarise", args: "steps=6", result: "rotation complete" },
    { kind: "tool", name: "slack.post", args: "#infra \"staging creds rotated\"", result: "ts=1730642547.0021" },
    { kind: "tool", name: "ticket.close", args: "INFRA-482", result: "closed" },
  ],
};
