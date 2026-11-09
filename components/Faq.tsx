import type { QA } from "@/lib/faq";

export function Faq({ items }: { items: QA[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group py-4">
          <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-4 font-medium">
            {f.q}
            <span aria-hidden className="font-mono text-muted transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 max-w-2xl leading-7 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
