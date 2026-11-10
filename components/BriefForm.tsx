"use client";
import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/site";
import { track } from "@/lib/analytics";

export function BriefForm({ campaign }: { campaign?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    try {
      const r = await fetch("/api/brief", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: f.get("email"), hp: f.get("company_website"), campaign }),
      });
      if (r.ok) track("brief_request", { campaign: campaign ?? "none" });
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }
  if (state === "done") return <p role="status" className="text-sm text-ok">Got it. We'll email you the 2-page technical brief within 24 hours.</p>;
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor="brief-email">Work email</label>
      <input id="brief-email" name="email" type="email" required autoComplete="email" placeholder="you@company.com"
        className="h-11 shrink-0 rounded-full sm:flex-1 border border-line bg-panel px-4 text-sm placeholder:text-dim" />
      <input name="company_website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <button disabled={state === "sending"} className="btn btn-ghost">{state === "sending" ? "Sending…" : "Get the technical brief by email"}</button>
      {state === "error" && (
        <span role="alert" className="text-sm text-accent">
          Couldn't send that. {CONTACT_EMAIL ? <>Email us at <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> instead.</> : "Book a call instead."}
        </span>
      )}
    </form>
  );
}
