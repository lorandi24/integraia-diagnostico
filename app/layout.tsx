import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Diagnóstico de Madurez en IA | IntegraIA by EMET",
  description:
    "Descubra en 7 minutos qué tan preparada está su pyme para aprovechar la Inteligencia Artificial y reciba un roadmap de 90 días con acciones concretas.",
  openGraph: {
    title: "Diagnóstico de Madurez en IA | IntegraIA by EMET",
    description: "Score de madurez, fortalezas, oportunidades y roadmap de 90 días para su pyme.",
    locale: "es_MX",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050B18",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
