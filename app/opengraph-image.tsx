import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE } from "@/lib/og";

export const alt = "Black Box: tamper-evident audit logs for AI agents";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgCard kicker="Black Box" title="Prove exactly what your AI agent did." foot="Tamper-evident audit logs for AI agents" />, size);
}
