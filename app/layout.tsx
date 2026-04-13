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
  title: "Ewen Bourgeat — Ingénieur Data & IA",
  description:
    "Étudiant ingénieur CY Tech (HPDA), je construis des pipelines ML, des automatisations IA et des applications web. Disponible en contrat de professionnalisation Data/IA d'octobre 2026 à octobre 2027.",
  metadataBase: new URL("https://ewenbourgeat.com"),
  openGraph: {
    title: "Ewen Bourgeat — Ingénieur Data & IA",
    description:
      "Pipelines ML, automatisations IA, applications web. Contrat de professionnalisation Data/IA — Oct. 2026.",
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
