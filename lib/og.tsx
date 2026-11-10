// Shared Open Graph artwork: the recorder, drawn isometrically, beside a title.
export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard({ kicker, title, foot }: { kicker: string; title: string; foot: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#08080a", color: "#ececee", display: "flex", padding: 72, position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#92929a", letterSpacing: 3 }}>
          <div style={{ width: 34, height: 2, background: "#ff4f00" }} />{kicker.toUpperCase()}
        </div>
        <div style={{ fontSize: title.length > 48 ? 58 : 74, fontWeight: 500, letterSpacing: -2.5, lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontSize: 26, color: "#92929a" }}>{foot}</div>
      </div>
      <svg width="400" height="360" viewBox="0 0 360 330" style={{ position: "absolute", right: 56, top: 135 }}>
        <polygon points="180,30 330,100 180,170 30,100" fill="#222226" />
        <polygon points="30,100 180,170 180,300 30,230" fill="#151518" />
        <polygon points="180,170 330,100 330,230 180,300" fill="#0c0c0e" />
        <polygon points="48,108.4 60,114 60,244 48,238.4" fill="#ff4f00" />
        <polygon points="48,108.4 60,114 210,44 198,38.4" fill="#ff4f00" />
        <polygon points="76,206 164,247 164,275 76,234" fill="#060607" />
        <polygon points="84,221 130,242.5 130,246.5 84,225" fill="#ff4f00" />
      </svg>
    </div>
  );
}
