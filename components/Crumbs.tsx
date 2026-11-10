import Link from "next/link";
export function Crumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center gap-2">
            {it.href ? <Link href={it.href} className="transition-colors hover:text-fg">{it.name}</Link> : <span aria-current="page" className="text-fg">{it.name}</span>}
            {i < items.length - 1 && <span aria-hidden className="text-dim">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
