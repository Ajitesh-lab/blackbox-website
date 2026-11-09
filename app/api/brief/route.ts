import { NextResponse } from "next/server";
import { CALENDLY_URL } from "@/lib/site";

// Never reports success unless the lead was actually delivered to us.
// Needs RESEND_API_KEY, BRIEF_FROM_EMAIL and BRIEF_NOTIFY_EMAIL.
async function send(key: string, body: object) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function POST(req: Request) {
  const { email, hp, campaign } = (await req.json().catch(() => ({}))) as { email?: string; hp?: string; campaign?: string };
  if (hp) return NextResponse.json({ ok: true }); // honeypot: silently drop bots
  if (!email || email.length > 200 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "bad email" }, { status: 400 });

  const key = process.env.RESEND_API_KEY, from = process.env.BRIEF_FROM_EMAIL, notify = process.env.BRIEF_NOTIFY_EMAIL;
  if (!key || !from || !notify) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const lead = await send(key, { from, to: notify, subject: `Brief request: ${email}`, text: `Technical brief requested.\n\nEmail: ${email}\nSource: ${campaign ?? "home"}\n` });
  if (!lead.ok) return NextResponse.json({ error: "delivery failed" }, { status: 502 });

  // Best-effort confirmation to the visitor.
  await send(key, { from, to: email, subject: "Black Box: your technical brief", text: `Thanks for asking. We'll send the 2-page technical brief within 24 hours.\n\nIf you'd rather see it live, pick a 15-minute slot: ${CALENDLY_URL}\n` }).catch(() => {});
  return NextResponse.json({ ok: true });
}
