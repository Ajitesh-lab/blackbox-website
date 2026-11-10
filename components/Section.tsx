import { Reveal } from "./Reveal";

/** A numbered section. No rails or rules: an index, a large heading, then content. */
export function Section({ id, n, label, title, lede, center, children }: { id?: string; n: string; label: string; title: string; lede?: React.ReactNode; center?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className="scroll-mt-14">
      <div className="frame py-20 sm:py-32">
        <Reveal className={center ? "mx-auto max-w-3xl text-center" : ""}>
          <p className="label"><span className="mr-3 text-accent">{n}</span>{label}</p>
          <h2 id={id ? `${id}-h` : undefined} className={`display mt-5 text-[34px] sm:text-[54px] ${center ? "" : "max-w-4xl"}`}>{title}</h2>
          {lede && <p className={`mt-6 max-w-2xl text-lg leading-8 text-muted ${center ? "mx-auto" : ""}`}>{lede}</p>}
        </Reveal>
        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}
