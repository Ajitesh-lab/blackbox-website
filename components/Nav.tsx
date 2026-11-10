"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { BookLink } from "./BookLink";
import { CALL_LABEL } from "@/lib/site";

const LINKS = [
  ["/how-it-works", "How it works"],
  ["/insurers", "For insurers"],
  ["/learn", "Learn"],
  ["/security", "Security & FAQ"],
] as const;

export function Nav({ campaign }: { campaign?: string }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 bg-bg/70 backdrop-blur-md">
      <div className="frame flex h-14 items-center justify-between">
        <Link href="/" aria-label="Black Box home"><Logo /></Link>
        <nav className="flex items-center gap-1 text-sm text-muted sm:gap-4" aria-label="Main">
          {LINKS.map(([h, l]) => (
            <Link key={h} aria-current={path.startsWith(h) ? "page" : undefined} className="hidden px-2 py-2 transition-colors hover:text-fg aria-[current]:text-fg md:block" href={h}>{l}</Link>
          ))}
          <BookLink campaign={campaign} where="nav" className="btn btn-primary !h-9 !px-4 !text-sm md:ml-2">{CALL_LABEL}</BookLink>
          <button
            type="button" className="grid h-11 w-11 place-items-center rounded-md hover:text-fg md:hidden"
            aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              {open ? <path d="M3 3l12 12M15 3L3 15" /> : <path d="M2 6h14M2 12h14" />}
            </svg>
          </button>
        </nav>
      </div>
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-bg md:hidden">
          <div className="frame flex flex-col py-2">
            {LINKS.map(([h, l]) => (
              <Link key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-[15px] text-muted hover:text-fg">{l}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
