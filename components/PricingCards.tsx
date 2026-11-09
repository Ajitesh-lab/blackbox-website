import Link from "next/link";

export function PricingCards({ campaign }: { campaign?: string }) {
  const book = campaign ? `/book?c=${campaign}` : "/book";
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
        <div className="card relative border-accent/60 p-7">
          <div className="flex items-center justify-between">
            <span className="eyebrow !text-accent">Founding partners</span>
            <span className="rounded-full border border-accent/50 px-2.5 py-0.5 font-mono text-xs text-accent">10 places</span>
          </div>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="display text-5xl">$1,000</span><span className="text-muted">/ month</span>
          </div>
          <ul className="mt-5 space-y-2 text-[15px] leading-6">
            <li>Up to 3 agents</li>
            <li>No license fee</li>
            <li>Price locked for 12 months</li>
            <li className="text-muted">In return: a testimonial, once it's earned</li>
          </ul>
          <Link href={book} className="btn btn-primary mt-7">Book a 20-min call</Link>
        </div>
        <div className="card p-7">
          <span className="eyebrow">Standard</span>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="display text-3xl text-muted">$5,000</span><span className="text-muted">license</span>
          </div>
          <div className="mt-1 text-muted">+ $2,500 / agent / month</div>
          <p className="mt-5 text-sm leading-6 text-muted">For teams who join after the founding places are taken.</p>
        </div>
      </div>
      <div className="card mt-4 flex flex-col gap-1 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><span className="font-medium">Free 2-week pilot.</span> <span className="text-muted">One workflow, set up with you. Conversion terms agreed up front, so there are no surprises.</span></div>
      </div>
    </div>
  );
}
