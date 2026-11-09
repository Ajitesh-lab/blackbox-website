import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", description: "What this site collects, why, and how to have it deleted.", alternates: { canonical: "/privacy" } };

export default function Page() {
  return (
    <DocPage title="Privacy" intro="Plain English. This site collects very little.">
      <section><h2>The technical brief form</h2><p>If you ask for the technical brief, we collect your email address and which page you came from. We use it to send you the brief and to follow up about Black Box. We don't sell it or share it.</p></section>
      <section><h2>Booking a call</h2><p>The booking calendar is provided by Calendly. When you book, Calendly collects your name, email and answers, under its own privacy policy.</p></section>
      <section><h2>Analytics</h2><p>We use privacy-friendly, cookieless analytics to count page views and a few key actions (such as booking clicks). It doesn't track you across sites.</p></section>
      <section><h2>The tamper test</h2><p>The tamper test runs entirely in your browser. What you edit is never sent anywhere.</p></section>
      <section><h2>Deleting your data</h2><p>{CONTACT_EMAIL ? <>Email <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we'll delete your details.</> : "Ask on a call or reply to any email from us and we'll delete your details."}</p></section>
    </DocPage>
  );
}
