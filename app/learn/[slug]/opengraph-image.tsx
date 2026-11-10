import { ImageResponse } from "next/og";
import { ARTICLES, bySlug } from "@/lib/articles";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;
export function generateStaticParams() { return ARTICLES.map((a) => ({ slug: a.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const a = bySlug((await params).slug);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0a0a0b", color: "#ededee", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 600 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#ff4f00" }} /> Black Box · Learn
        </div>
        <div style={{ fontSize: 70, fontWeight: 600, letterSpacing: -2.5, lineHeight: 1.06, maxWidth: 1000 }}>{a?.h1 ?? "Learn"}</div>
        <div style={{ height: 4, width: 220, background: "#ff4f00" }} />
      </div>
    ),
    size
  );
}
