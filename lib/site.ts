// Single source of truth for facts that appear in several places.
export const CALL_MINUTES = 15;
export const CALL_LABEL = `Book a ${CALL_MINUTES}-min call`;
export const CALENDLY_URL = "https://calendly.com/ajitesh-rawat";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blackbox-by-radius.netlify.app";

export const OFFER = {
  title: "Free 2-week pilot",
  note: "Free 2-week pilot on one workflow. No card until it ends.",
  steps: [
    `${CALL_MINUTES}-min call: pick one agent workflow.`,
    "We route it through the Black Box gateway with you (a few lines of config).",
    "For two weeks you get a full, verifiable record of every model and tool call.",
    "In return: honest feedback, and a testimonial if it earned one.",
    "Keep it after two weeks on a monthly subscription. No card until then.",
  ],
  after: "If you keep using it after 2 weeks, it becomes a monthly subscription at a price we agree before the pilot starts. We don't take a card until then.",
};
