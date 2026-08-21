import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "AIRO 6.0 — Sairam Engineering College",
  description:
    "AIRO 6.0 — Annual Technical Symposium by the Department of Artificial Intelligence and Data Science, Sairam Engineering College. Register now for exciting AI and tech events.",
  keywords: "AIRO 6.0, Sairam Engineering College, AIDS department, AI symposium, tech events, registration",
  openGraph: {
    title: "AIRO 6.0 — Sairam Engineering College",
    description: "Annual Technical Symposium by the Department of AI & Data Science",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <CustomCursor />
        <Navbar />
        <main className="page-wrapper">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
