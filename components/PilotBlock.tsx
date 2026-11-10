import { OFFER, CALL_LABEL } from "@/lib/site";
import { BookLink } from "./BookLink";

export function PilotBlock({ campaign }: { campaign?: string }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h3 className="display text-3xl sm:text-4xl">{OFFER.title}</h3>
        <p className="mt-4 max-w-md leading-7 text-muted">{OFFER.after}</p>
        <BookLink campaign={campaign} where="pilot" className="btn btn-primary mt-7">{CALL_LABEL}</BookLink>
      </div>
      <ol className="divide-y divide-line border-y border-line">
        {OFFER.steps.map((s, i) => (
          <li key={s} className="flex gap-5 py-4 leading-7">
            <span className="w-5 shrink-0 pt-1 font-mono text-xs text-dim">{String(i + 1).padStart(2, "0")}</span>{s}
          </li>
        ))}
      </ol>
    </div>
  );
}
