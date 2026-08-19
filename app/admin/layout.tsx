import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin — AIRO 6.0",
  description: "AIRO 6.0 Administration Panel",
  robots: "noindex",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
