import type { Metadata } from "next";
import { Archivo, Inter, Caveat } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "NADA Studio — Do nada nasce tudo",
  description:
    "A gente cria seu site, automatiza o repetitivo e cuida de tudo por você. Você foca no que importa: vender.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${inter.variable} ${caveat.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
