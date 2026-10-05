import type { IconType } from "react-icons";
import {
  SiClickup,
  SiGmail,
  SiGooglecalendar,
  SiGoogledrive,
  SiGoogleforms,
  SiGooglemeet,
  SiGooglesheets,
  SiInstagram,
  SiMercadopago,
  SiNotion,
  SiPix,
  SiWhatsapp,
} from "react-icons/si";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers } from "@/data/content";

// Tecnologia não é argumento de venda: em vez da grade de fornecedores, as
// ferramentas que o cliente já usa no dia a dia. A lista é a que os sócios
// passaram (o que a NADA Studio de fato liga); a resposta do FAQ repete ela.
// Cada logo na cor da própria marca, a exceção ao preto e branco pedida em
// 04/10/2026 (pages/sobre.md). A onda que passa por eles fica no globals.css.
const FERRAMENTAS: { nome: string; Icone: IconType; cor: string }[] = [
  { nome: "WhatsApp", Icone: SiWhatsapp, cor: "#25D366" },
  { nome: "Instagram", Icone: SiInstagram, cor: "#FF0069" },
  { nome: "Gmail", Icone: SiGmail, cor: "#EA4335" },
  { nome: "Google Agenda", Icone: SiGooglecalendar, cor: "#4285F4" },
  { nome: "Google Drive", Icone: SiGoogledrive, cor: "#4285F4" },
  { nome: "Planilhas", Icone: SiGooglesheets, cor: "#34A853" },
  { nome: "Google Forms", Icone: SiGoogleforms, cor: "#7248B9" },
  { nome: "Google Meet", Icone: SiGooglemeet, cor: "#00897B" },
  { nome: "Notion", Icone: SiNotion, cor: "#000000" },
  { nome: "ClickUp", Icone: SiClickup, cor: "#7B68EE" },
  { nome: "Pix", Icone: SiPix, cor: "#32BCAD" },
  { nome: "Mercado Pago", Icone: SiMercadopago, cor: "#00B1EA" },
];

export default function ToolsWeBuildWith() {
  return (
    <section id="ferramentas" className="section pt-0">
      <div className="wrap">
        <div data-entra="linha" className="regua-topo pt-[clamp(56px,8vw,112px)]">
          <SectionMarker label="Ferramentas" number={sectionMarkers.tools} />
          <h2 data-entra="titulo" className="text-[clamp(28px,3.4vw,44px)]">
            Funciona com o que você já usa.
          </h2>
          <ul className="onda-logos mt-10 flex flex-wrap gap-x-10 gap-y-5 text-black/70">
            {FERRAMENTAS.map(({ nome, Icone, cor }, i) => (
              <li key={nome} className="flex items-center gap-3" style={{ "--i": i } as React.CSSProperties}>
                <Icone size={22} color={cor} aria-hidden="true" />
                <span className="text-[15px]">{nome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
