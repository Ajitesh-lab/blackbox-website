import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
export const metadata: Metadata = { title: { absolute: "Black Box: tamper-evident audit logs for AI agents" } };
export default function Page() { return <HomePage />; }
