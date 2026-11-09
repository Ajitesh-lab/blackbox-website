// Hash-chain format used by the tamper test. Real SHA-256 via Web Crypto.
// entry_hash = SHA-256( prev_hash || "\n" || canonical_json(body) )
// The first entry's prev_hash is 64 zeros.

export const GENESIS = "0".repeat(64);

export type Body = {
  seq: number;
  t: string; // timestamp, fixed for the sample run
  kind: "model" | "tool";
  name: string;
  args: string; // the field the visitor edits
  result: string;
};

export function canonical(b: Body): string {
  // fixed key order -> deterministic bytes
  return JSON.stringify([b.seq, b.t, b.kind, b.name, b.args, b.result]);
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf), (x) => x.toString(16).padStart(2, "0")).join("");
}

export async function hashEntry(prev: string, b: Body): Promise<string> {
  return sha256Hex(prev + "\n" + canonical(b));
}

/** Build the sealed chain (hashes as written at record time). */
export async function seal(bodies: Body[]): Promise<string[]> {
  const out: string[] = [];
  let prev = GENESIS;
  for (const b of bodies) {
    prev = await hashEntry(prev, b);
    out.push(prev);
  }
  return out;
}

export type VerifyRow = { recomputed: string; ok: boolean };
export type VerifyResult = { rows: VerifyRow[]; firstBad: number | null };

/**
 * Re-derive the whole chain from the current contents and compare each
 * entry to the sealed hash. Editing entry k changes its hash, which changes
 * every later hash, so everything from k down stops matching.
 */
export async function verify(bodies: Body[], sealed: string[]): Promise<VerifyResult> {
  const rows: VerifyRow[] = [];
  let prev = GENESIS;
  let firstBad: number | null = null;
  for (let i = 0; i < bodies.length; i++) {
    const h = await hashEntry(prev, bodies[i]);
    const ok = h === sealed[i];
    if (!ok && firstBad === null) firstBad = i;
    rows.push({ recomputed: h, ok });
    prev = h;
  }
  return { rows, firstBad };
}

export const short = (h: string) => h.slice(0, 8) + "…" + h.slice(-4);
