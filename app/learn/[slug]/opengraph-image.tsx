import { ImageResponse } from "next/og";
import { ARTICLES, bySlug } from "@/lib/articles";
import { OgCard, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;
export function generateStaticParams() { return ARTICLES.map((a) => ({ slug: a.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const a = bySlug((await params).slug);
  return new ImageResponse(<OgCard kicker="Black Box · Guide" title={a?.h1 ?? "Learn"} foot="The flight recorder for AI agents" />, size);
}
