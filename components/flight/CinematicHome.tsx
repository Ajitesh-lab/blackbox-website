import { HomeScroll } from "./HomeScroll";
import { Nav } from "../Nav";
import { Footer } from "../Footer";
import { CALENDLY_URL } from "@/lib/site";
import { HeroMedia } from "./HeroMedia";
import { Scramble } from "./Scramble";
import { Verification } from "./Verification";

function ModelSlot() {
  return <div className="model-slot" aria-hidden="true" />;
}

function BriefingLink() {
  return <a className="briefing-link" href={CALENDLY_URL}>Request briefing <span aria-hidden="true">↗</span></a>;
}

export function CinematicHome() {
  return <div className="flight-page">
    <HomeScroll />
    <Nav />
    <HeroMedia mode="realtime" />
    <main id="main" className="flight-main">
      <section className="flight-hero flight-section" id="what" data-flight-stage="hero">
        <ModelSlot />
        <p className="flight-label hero-eyebrow"><Scramble text="BLACK BOX // AGENT FLIGHT RECORDER" /></p>
        <h1>Actions leave evidence.</h1>
        <div className="hero-bottom">
          <div><p className="flight-copy">Tamper-evident records of what your AI agents did. Independently verifiable. Offline.</p><BriefingLink /></div>
        </div>
      </section>
      <section className="flight-record flight-section" id="record" data-flight-stage="record">
        <ModelSlot />
        <p className="flight-label">01 / RECORD</p>
        <h2>Every link remembers.</h2>
        <p className="flight-copy">Recorded events link to the events before them. Signed checkpoints seal the sequence.</p>
        <ul className="evidence-list">
          {[['Hash-chained events', '9f2a…d04c'], ['Signed checkpoints', 'c81b…7e92'], ['Exportable evidence', 'a604…3f18']].map(([label, hash]) => <li key={label}><span>{label}</span><span className="evidence-hash" aria-hidden="true">{hash}</span></li>)}
        </ul>
      </section>
      <section className="flight-verify flight-section" id="verify" data-flight-stage="verify">
        <ModelSlot />
        <div><p className="flight-label">02 / VERIFY</p><h2>Change one byte. Leave a trace.</h2><p className="flight-copy">Check exported evidence offline, against keys you independently trust.</p><Verification /></div>
      </section>
      <section className="flight-close flight-section" id="briefing" data-flight-stage="sealed">
        <ModelSlot />
        <span id="pilot" /><p className="flight-label">03 / PRIVATE BRIEFING</p>
        <h2>Reconstruct what happened.</h2>
        <p className="flight-copy">A 15-minute introduction to Black Box.</p>
        <BriefingLink />
      </section>
    </main>
    <Footer />
  </div>;
}
