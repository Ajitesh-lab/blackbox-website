import { FAQ } from "@/lib/faq";

export function Faq({ limit }: { limit?: number }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {FAQ.slice(0, limit).map((f) => (
        <details key={f.q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
            {f.q}
            <span aria-hidden className="font-mono text-muted transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 max-w-2xl leading-7 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
