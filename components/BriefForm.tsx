"use client";
import { useState } from "react";

export function BriefForm({ campaign }: { campaign?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setState("sending");
    try {
      const r = await fetch("/api/brief", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, campaign }) });
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }
  if (state === "done") return <p className="text-sm text-ok">Sent. One email with the 2-page technical brief, nothing else.</p>;
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor="brief-email">Work email</label>
      <input id="brief-email" name="email" type="email" required placeholder="you@company.com"
        className="h-11 flex-1 rounded-lg border border-line bg-panel px-3 text-sm placeholder:text-muted" />
      <button disabled={state === "sending"} className="btn btn-ghost">{state === "sending" ? "Sending…" : "Email me the 2-page brief"}</button>
      {state === "error" && <span className="text-sm text-accent">Something went wrong. Try again.</span>}
    </form>
  );
}
