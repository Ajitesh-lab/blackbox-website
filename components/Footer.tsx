import Link from "next/link";
import { Logo } from "./Logo";
import { ARTICLES } from "@/lib/articles";
import { ENTITY_DEFINITION } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";

const COLS: [string, [string, string][]][] = [
  ["Product", [["/how-it-works", "How it works"], ["/#tamper", "Tamper test"], ["/#replay", "Replay"], ["/#pilot", "Free 2-week pilot"], ["/book", "Book a call"]]],
  ["Who it's for", [["/#how", "Teams building agents"], ["/insurers", "Insurers"], ["/security", "Security & FAQ"], ["/glossary", "Glossary"], ["/privacy", "Privacy"]]],
];

export function Footer() {
  return (
    <footer className="rule mt-10">
      <div className="frame grid gap-12 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{ENTITY_DEFINITION}</p>
          <p className="mt-4 text-sm text-muted">
            Built by Radius.
            {CONTACT_EMAIL && <> <a className="link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></>}
          </p>
        </div>
        <nav aria-label="Footer" className="grid gap-10 text-sm sm:grid-cols-[1fr_1fr_1.6fr]">
          {COLS.map(([h, links]) => (
            <div key={h}>
              <h2 className="label">{h}</h2>
              <ul className="mt-4 space-y-2.5">
                {links.map(([href, l]) => <li key={href}><Link className="text-muted transition-colors hover:text-fg" href={href}>{l}</Link></li>)}
              </ul>
            </div>
          ))}
          <div>
            <h2 className="label">Guides</h2>
            <ul className="mt-4 space-y-2.5">
              {ARTICLES.map((a) => <li key={a.slug}><Link className="text-muted transition-colors hover:text-fg" href={`/learn/${a.slug}`}>{a.nav ?? a.h1}</Link></li>)}
              <li><Link className="text-fg" href="/learn">All guides →</Link></li>
            </ul>
          </div>
        </nav>
      </div>
      <div>
        <div className="frame flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5 font-mono text-[11px] text-dim">
          <span>© 2026 Radius · Black Box</span>
          <span className="flex gap-5"><a className="hover:text-fg" href="/feed.xml">RSS</a><a className="hover:text-fg" href="/llms.txt">llms.txt</a><a className="hover:text-fg" href="/sitemap.xml">Sitemap</a></span>
        </div>
      </div>
    </footer>
  );
}
