// Two interlocking "recorder" links forming a B. Matches app/icon.svg.
export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#ff4f00" />
      <rect x="9" y="6.5" width="14" height="9.5" rx="3.5" fill="none" stroke="#0a0a0b" strokeWidth="2.6" />
      <rect x="9" y="14" width="15.5" height="11.5" rx="3.5" fill="none" stroke="#0a0a0b" strokeWidth="2.6" />
    </svg>
  );
}
export function Logo() {
  return (
    <span className="flex items-center gap-2 font-semibold tracking-tight">
      <LogoMark /> Black Box
    </span>
  );
}
