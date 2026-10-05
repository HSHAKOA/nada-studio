import type { Metadata } from "next";
import { metadadosDePagina } from "@/lib/metadados";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFixo from "@/components/WhatsAppFixo";
import FAQ from "@/components/sections/FAQ";
import Trust from "@/components/sections/Trust";
import CTA from "@/components/sections/CTA";
import { CHAMADAS, sectionMarkers } from "@/data/content";

export const metadata: Metadata = metadadosDePagina({
  titulo: "FAQ",
  descricao:
    "Perguntas frequentes sobre os serviços da NADA Studio.",
  caminho: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <FAQ />
        <Trust />
        <CTA
          numero={sectionMarkers.faqCta}
          titulo={CHAMADAS.faq.titulo}
          texto={CHAMADAS.faq.texto}
          botao={CHAMADAS.faq.botao}
          mensagem={CHAMADAS.faq.msg}
        />
      </main>
      <Footer />
      <WhatsAppFixo mensagem={CHAMADAS.faq.msg} />
    </>
  );
}
