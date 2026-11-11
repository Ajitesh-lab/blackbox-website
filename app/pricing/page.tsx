import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { PricingCards } from "@/components/PricingCards";
import { Faq } from "@/components/Faq";
import { FAQ_HOME } from "@/lib/faq";

export const metadata: Metadata = { title: "Pricing" };

export default function Page() {
  return (
    <DocPage label="Pricing" title="Founding partners get the best deal we'll ever offer."
      intro="We're taking 10 founding teams. Everyone else pays standard pricing.">
      <PricingCards />
      <section>
        <h2>Pricing FAQ</h2>
        <Faq items={FAQ_HOME.slice(1, 3)} />
      </section>
    </DocPage>
  );
}
