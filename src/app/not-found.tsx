import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFoundHero from "@/components/sections/NotFoundHero";
import { IMAGEM_SOCIAL } from "@/lib/metadados";

// Sem og:url: a 404 não tem endereço próprio (herdava o da home).
export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "NADA Studio",
    title: "Página não encontrada · NADA Studio",
    images: [IMAGEM_SOCIAL],
  },
  twitter: {
    card: "summary_large_image",
    title: "Página não encontrada · NADA Studio",
    images: [IMAGEM_SOCIAL],
  },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <NotFoundHero />
      </main>
      <Footer />
    </>
  );
}
