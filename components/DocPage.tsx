import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function DocPage({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="display text-4xl sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 text-lg leading-8 text-muted">{intro}</p>}
        <div className="mt-12 space-y-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2+*]:mt-4 [&_p]:leading-7 [&_p]:text-muted [&_li]:leading-7 [&_code]:font-mono [&_code]:text-[0.9em] [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-line [&_pre]:bg-panel [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[12.5px] [&_pre]:leading-6">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
