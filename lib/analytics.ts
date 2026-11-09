type P = Record<string, string | number | boolean>;
declare global { interface Window { plausible?: ((n: string, o?: { props?: P }) => void) & { q?: unknown[] } } }

/** Fires a Plausible custom event. No-ops (and queues) when analytics isn't configured. */
export function track(name: string, props?: P) {
  if (typeof window === "undefined") return;
  try {
    window.plausible =
      window.plausible ||
      Object.assign(function (...a: unknown[]) { (window.plausible!.q = window.plausible!.q || []).push(a); }, {});
    window.plausible(name, props ? { props } : undefined);
  } catch {}
}
