import { OFFER } from "@/lib/site";
import { BookLink } from "./BookLink";
import { CALL_LABEL } from "@/lib/site";

export function PilotBlock({ campaign }: { campaign?: string }) {
  return (
    <div id="pilot" className="grid scroll-mt-20 gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <h3 className="display text-2xl sm:text-3xl">{OFFER.title}</h3>
        <p className="mt-4 max-w-md leading-7 text-muted">{OFFER.after}</p>
        <BookLink campaign={campaign} where="pilot" className="btn btn-primary mt-7">{CALL_LABEL}</BookLink>
      </div>
      <ol className="divide-y divide-line border-y border-line">
        {OFFER.steps.map((s, i) => (
          <li key={s} className="flex gap-4 py-4 leading-7">
            <span className="w-5 shrink-0 font-mono text-sm text-accent">{i + 1}</span>{s}
          </li>
        ))}
      </ol>
    </div>
  );
}
