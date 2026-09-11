import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFoundHero from "@/components/sections/NotFoundHero";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <NotFoundHero />
      </main>
      <Footer />
    </>
  );
}
