import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Ewen Bourgeat — Data, IA & Automatisation",
  description:
    "Étudiant ingénieur HPDA à CY Tech, entrepreneur et développeur de systèmes data/IA. Alternance disponible septembre 2026. Missions freelance automatisation IA pour TPE.",
  metadataBase: new URL("https://ewenbourgeat.com"),
  openGraph: {
    title: "Ewen Bourgeat — Data, IA & Automatisation",
    description:
      "Étudiant ingénieur HPDA à CY Tech, entrepreneur et développeur de systèmes data/IA. Alternance disponible septembre 2026. Missions freelance automatisation IA pour TPE.",
    type: "website",
    locale: "fr_FR",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${instrumentSerif.variable} ${GeistSans.variable}`}>
      <body className="font-sans bg-void text-ink antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
