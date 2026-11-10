import type { QA } from "@/lib/faq";

export function Faq({ items }: { items: QA[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden className="font-mono text-dim transition-transform duration-200 group-open:rotate-45">+</span>
          </summary>
          <p className="max-w-2xl pb-5 leading-7 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
