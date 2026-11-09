import { ImageResponse } from "next/og";

export const alt = "Black Box: tamper-evident audit logs for AI agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0a0a0b", color: "#ededee", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 600 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: "#ff4f00" }} /> Black Box
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 80, fontWeight: 600, letterSpacing: -3, lineHeight: 1.04, maxWidth: 980 }}>Prove exactly what your AI agent did.</div>
          <div style={{ fontSize: 30, color: "#8b8b93" }}>Tamper-evident audit logs for AI agents</div>
        </div>
        <div style={{ height: 4, width: 220, background: "#ff4f00" }} />
      </div>
    ),
    size
  );
}
