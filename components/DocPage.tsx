import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function DocPage({ eyebrow, title, intro, light = false, children }: { eyebrow: string; title: string; intro?: string; light?: boolean; children: React.ReactNode }) {
  return (
    <div className={light ? "theme-light bg-bg text-fg" : ""}>
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="display mt-3 text-4xl sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 text-lg leading-8 text-muted">{intro}</p>}
        <div className="mt-12 space-y-12 [&_h2]:display [&_h2]:text-2xl [&_h2+*]:mt-4 [&_p]:leading-7 [&_p]:text-muted [&_li]:leading-7 [&_code]:font-mono [&_code]:text-[0.9em] [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-line [&_pre]:bg-panel [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[12.5px] [&_pre]:leading-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
