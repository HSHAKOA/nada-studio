import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Founders from "@/components/sections/Founders";

export const metadata: Metadata = {
  title: "Equipe",
  description: "Quem constrói a NADA Studio: João e Eric, os dois fundadores.",
  alternates: {
    canonical: "/equipe",
  },
};

export default function Equipe() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Founders />
      </main>
      <Footer />
    </>
  );
}
