import type { Metadata } from "next";
import { metadadosDePagina } from "@/lib/metadados";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CenaNada from "@/components/CenaNada";
import WhatsAppFixo from "@/components/WhatsAppFixo";
import Problem from "@/components/sections/Problem";
import HowItWorks from "@/components/sections/HowItWorks";
import Membership from "@/components/sections/Membership";
import Ecosystem from "@/components/sections/Ecosystem";
import CostOfInaction from "@/components/sections/CostOfInaction";
import CTA from "@/components/sections/CTA";
import { CHAMADAS, sectionMarkers } from "@/data/content";

export const metadata: Metadata = metadadosDePagina({
  titulo: "Como funciona",
  descricao:
    "Do primeiro contato à manutenção contínua: como a NADA Studio conduz cada projeto, sem tecniquês.",
  caminho: "/como-funciona",
});

export default function ComoFunciona() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* O logotipo em profundidade atravessa o problema e os passos; o
            respiro entre os dois é onde ele ocupa a tela sozinho. */}
        <CenaNada>
          <Problem />
          <div aria-hidden className="nada-respiro" />
          <HowItWorks />
        </CenaNada>
        <Membership />
        <Ecosystem />
        <CostOfInaction />
        <CTA
          numero={sectionMarkers.comoFuncionaCta}
          titulo={CHAMADAS.comoFunciona.titulo}
          texto={CHAMADAS.comoFunciona.texto}
        />
      </main>
      <Footer />
      <WhatsAppFixo mensagem="Oi! Vi como a NADA Studio trabalha e quero conversar." />
    </>
  );
}
