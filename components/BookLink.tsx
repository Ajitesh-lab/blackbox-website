"use client";
import Link from "next/link";
import { track } from "@/lib/analytics";

export function BookLink({ campaign, where, className = "btn btn-primary", children }: { campaign?: string; where: string; className?: string; children: React.ReactNode }) {
  return (
    <Link href={campaign ? `/book?c=${campaign}` : "/book"} className={className} onClick={() => track("book_click", { where, campaign: campaign ?? "none" })}>
      {children}
    </Link>
  );
}
