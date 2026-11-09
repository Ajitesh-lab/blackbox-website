import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-page flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <span className="text-fg">Black Box</span> is built by Radius.
          {CONTACT_EMAIL && <> <a className="underline-offset-4 hover:text-fg hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></>}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <Link className="py-1 hover:text-fg" href="/how-it-works">How it works</Link>
          <Link className="py-1 hover:text-fg" href="/insurers">For insurers</Link>
          <Link className="py-1 hover:text-fg" href="/security">Security &amp; FAQ</Link>
          <Link className="py-1 hover:text-fg" href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
