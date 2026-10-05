import type { Metadata } from "next";
import { metadadosDePagina } from "@/lib/metadados";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFixo from "@/components/WhatsAppFixo";
import WhyNada from "@/components/sections/WhyNada";
import ForYouToo from "@/components/sections/ForYouToo";
import ToolsWeBuildWith from "@/components/sections/ToolsWeBuildWith";
import Instagram from "@/components/sections/Instagram";
import CTA from "@/components/sections/CTA";
import { sectionMarkers } from "@/data/content";

export const metadata: Metadata = metadadosDePagina({
  titulo: "Sobre",
  descricao:
    "A história por trás da NADA Studio: de onde veio o nome, a filosofia e pra quem a gente trabalha.",
  caminho: "/sobre",
});

export default function Sobre() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <WhyNada />
        <ForYouToo />
        <ToolsWeBuildWith />
        <Instagram />
        <CTA numero={sectionMarkers.sobreCta} />
      </main>
      <Footer />
      <WhatsAppFixo mensagem="Oi! Li sobre a NADA Studio e quero conversar." />
    </>
  );
}
