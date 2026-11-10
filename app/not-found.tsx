import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CALL_LABEL } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="frame py-28 sm:py-40">
        <p className="label"><span className="mr-3 text-accent">404</span>Entry not found</p>
        <h1 className="display mt-5 text-4xl sm:text-[60px]">That page isn't in the ledger.</h1>
        <p className="mt-4 text-muted">It may have moved, or the link was mistyped.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">Back home</Link>
          <Link href="/learn" className="btn btn-ghost">Read the guides</Link>
          <Link href="/book" className="btn btn-ghost">{CALL_LABEL}</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
