import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Prima il font "Inter" era solo nominato in CSS senza essere mai caricato:
// il browser faceva silenziosamente fallback al font di sistema. next/font
// lo scarica in build (self-hosted, zero richieste esterne a runtime) e lo
// espone come variabile CSS, che è la stessa referenziata da --font-sans:
// da qui in poi l'app usa davvero Inter, non più un surrogato.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinanzaCore",
  description: "Centro di controllo finanziario e operativo dell'azienda",
  themeColor: "#05050c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
