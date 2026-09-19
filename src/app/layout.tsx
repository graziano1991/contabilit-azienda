import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinanzaCore",
  description: "Centro di controllo finanziario e operativo dell'azienda",
  themeColor: "#0b1a37",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
