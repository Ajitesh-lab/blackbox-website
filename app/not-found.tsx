import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CALL_LABEL } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-page px-4 py-28 sm:px-6">
        <div className="eyebrow">404</div>
        <h1 className="display mt-3 text-4xl sm:text-5xl">That page isn't in the ledger.</h1>
        <p className="mt-4 text-muted">It may have moved, or the link was mistyped.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-ghost">Back home</Link>
          <Link href="/book" className="btn btn-primary">{CALL_LABEL}</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
