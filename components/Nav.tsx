import Link from "next/link";

export function Nav({ campaign }: { campaign?: string }) {
  const book = campaign ? `/book?c=${campaign}` : "/book";
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-[3px] bg-accent" aria-hidden />
          Black Box
        </Link>
        <nav className="flex items-center gap-1 text-sm text-muted sm:gap-5">
          <Link className="hidden px-2 py-1 hover:text-fg sm:block" href="/how-it-works">How it works</Link>
          <Link className="hidden px-2 py-1 hover:text-fg sm:block" href="/pricing">Pricing</Link>
          <Link className="hidden px-2 py-1 hover:text-fg sm:block" href="/security">Security &amp; FAQ</Link>
          <Link href={book} className="btn btn-primary !h-9 !px-4 !text-sm">Book a 20-min call</Link>
        </nav>
      </div>
    </header>
  );
}
