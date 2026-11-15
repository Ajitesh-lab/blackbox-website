import { Nav } from "../Nav";
import { Footer } from "../Footer";
import { CALENDLY_URL } from "@/lib/site";
import { HeroMedia } from "./HeroMedia";
import { Scramble } from "./Scramble";
import { Verification } from "./Verification";

function BriefingLink() {
  return <a className="briefing-link" href={CALENDLY_URL}>Request briefing <span aria-hidden="true">↗</span></a>;
}

export function CinematicHome() {
  return <div className="flight-page">
    <Nav />
    <main id="main" className="flight-main">
      <HeroMedia mode="realtime" />
      <section className="flight-hero flight-section" id="what" data-flight-stage="hero">
        <p className="flight-label hero-eyebrow"><Scramble text="BLACK BOX // AGENT FLIGHT RECORDER" /></p>
        <h1><Scramble text="Actions leave evidence." /></h1>
        <div className="hero-bottom">
          <div><p className="flight-copy">Tamper-evident records of what your AI agents did. Independently verifiable. Offline.</p><BriefingLink /></div>
          <div className="hero-coordinate" aria-hidden="true"><span>16 VERTICES / 32 EDGES</span><span>PROJECTION: 4D → 3D</span><span className="coordinate-rule" />SCROLL TO EXAMINE ↓</div>
        </div>
      </section>
      <section className="flight-record flight-section" id="record" data-flight-stage="record">
        <p className="flight-label">01 / RECORD</p>
        <h2><Scramble text="Every link remembers." /></h2>
        <p className="flight-copy">Recorded events link to the events before them. Signed checkpoints seal the sequence.</p>
        <ul className="evidence-list">
          {[['Hash-chained events', '9f2a…d04c'], ['Signed checkpoints', 'c81b…7e92'], ['Exportable evidence', 'a604…3f18']].map(([label, hash]) => <li key={label}><span>{label}</span><button className="redacted-hash" type="button" aria-label={`Reveal illustrative hash: ${hash}`}><span>{hash}</span></button></li>)}
        </ul>
      </section>
      <section className="flight-verify flight-section" id="verify" data-flight-stage="verify">
        <div><p className="flight-label">02 / VERIFY</p><h2><Scramble text="Change one byte. Leave a trace." /></h2><p className="flight-copy">Check exported evidence offline, against keys you independently trust.</p></div>
        <Verification />
      </section>
      <section className="flight-close flight-section" id="briefing" data-flight-stage="sealed">
        <span id="pilot" /><p className="flight-label">03 / PRIVATE BRIEFING</p>
        <h2><Scramble text="Reconstruct what happened." /></h2>
        <p className="flight-copy">A 15-minute introduction to Black Box.</p>
        <div className="close-action"><BriefingLink /><span className="flight-label">15-min intro call</span></div>
        <span className="seal-caption flight-label" aria-hidden="true">SEQUENCE SEALED // READY FOR REVIEW</span>
      </section>
    </main>
    <Footer />
  </div>;
}
