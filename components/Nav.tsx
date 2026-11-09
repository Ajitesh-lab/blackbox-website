"use client";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { BookLink } from "./BookLink";
import { CALL_LABEL } from "@/lib/site";

const LINKS = [
  ["/how-it-works", "How it works"],
  ["/insurers", "For insurers"],
  ["/security", "Security & FAQ"],
] as const;

export function Nav({ campaign }: { campaign?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Black Box home"><Logo /></Link>
        <nav className="flex items-center gap-1 text-sm text-muted sm:gap-5" aria-label="Main">
          {LINKS.map(([h, l]) => (
            <Link key={h} className="hidden px-2 py-2 hover:text-fg md:block" href={h}>{l}</Link>
          ))}
          <BookLink campaign={campaign} where="nav" className="btn btn-primary !h-9 !px-4 !text-sm">{CALL_LABEL}</BookLink>
          <button
            type="button" className="grid h-11 w-11 place-items-center rounded-md hover:text-fg md:hidden"
            aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              {open ? <path d="M3 3l12 12M15 3L3 15" /> : <path d="M2 5h14M2 9h14M2 13h14" />}
            </svg>
          </button>
        </nav>
      </div>
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-bg md:hidden">
          <div className="mx-auto flex max-w-page flex-col px-4 py-2">
            {LINKS.map(([h, l]) => (
              <Link key={h} href={h} onClick={() => setOpen(false)} className="py-3 text-[15px] text-muted hover:text-fg">{l}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
