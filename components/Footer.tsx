import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return <footer className="site-footer">
    <div className="frame footer-inner"><Link href="/" aria-label="Black Box home"><Logo /></Link><nav aria-label="Footer"><Link href="/learn">Learn</Link><Link href="/insurers">For insurers</Link><Link href="/security">Security</Link><Link href="/privacy">Privacy</Link><a href="/feed.xml">RSS</a><a href="/llms.txt">llms.txt</a></nav><span className="footer-credit">© 2026 Radius</span></div>
  </footer>;
}
