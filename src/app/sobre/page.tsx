import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhyNada from "@/components/sections/WhyNada";
import ForYouToo from "@/components/sections/ForYouToo";
import ToolsWeBuildWith from "@/components/sections/ToolsWeBuildWith";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "A história por trás da NADA Studio: de onde veio o nome, a filosofia e pra quem a gente trabalha.",
  alternates: {
    canonical: "/sobre",
  },
};

export default function Sobre() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <WhyNada />
        <ForYouToo />
        <ToolsWeBuildWith />
      </main>
      <Footer />
    </>
  );
}
