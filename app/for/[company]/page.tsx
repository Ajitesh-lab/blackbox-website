import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { COMPANIES, bySlug } from "@/lib/companies";

export const dynamicParams = false;
export function generateStaticParams() { return COMPANIES.map((c) => ({ company: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ company: string }> }): Promise<Metadata> {
  const c = bySlug((await params).company);
  // personal pages are unlisted
  return { title: c ? `For ${c.name}` : "Black Box", robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ company: string }> }) {
  const c = bySlug((await params).company);
  if (!c) notFound();
  return <HomePage company={c} />;
}
