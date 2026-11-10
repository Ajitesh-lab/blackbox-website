import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Crumbs } from "./Crumbs";

export const PROSE = "[&_h2]:text-2xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2+*]:mt-4 [&_p]:leading-7 [&_p]:text-muted [&_li]:leading-7 [&_code]:font-mono [&_code]:text-[0.9em] [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-line [&_pre]:bg-panel [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[12.5px] [&_pre]:leading-6";

/** Shared shell for text pages: breadcrumb, title block, then prose in the frame. */
export function DocPage({ title, intro, label, crumb, children }: { title: string; intro?: string; label?: string; crumb?: string; children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main">
        <div className="frame pb-12 pt-12 sm:pb-16 sm:pt-20">
          {crumb && <Crumbs items={[{ name: "Home", href: "/" }, { name: crumb }]} />}
          {label && <p className="label mb-4">{label}</p>}
          <h1 className="display max-w-3xl text-4xl sm:text-[60px]">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{intro}</p>}
        </div>
        <div>
          <div className="frame pb-20 sm:pb-28">
            <div className={`max-w-3xl space-y-12 ${PROSE}`}>{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
