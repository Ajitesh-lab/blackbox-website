import { NextResponse } from "next/server";

// Sends one automated email via Resend if RESEND_API_KEY is set; otherwise
// it just logs, so the form works in previews without secrets.
export async function POST(req: Request) {
  const { email, campaign } = (await req.json().catch(() => ({}))) as { email?: string; campaign?: string };
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "bad email" }, { status: 400 });
  const key = process.env.RESEND_API_KEY;
  const from = process.env.BRIEF_FROM_EMAIL;
  if (!key || !from) { console.log("[brief] request", { email, campaign }); return NextResponse.json({ ok: true, queued: false }); }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: email, subject: "Black Box: technical brief", text: "Thanks for asking. The 2-page technical brief is attached to a follow-up from Ajitesh shortly.\n\nIf you'd rather see it live: https://calendly.com/ajiteshrawat" }),
  });
  return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 502 });
}
