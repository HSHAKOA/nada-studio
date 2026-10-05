import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers } from "@/data/content";

// O "NADA" de fundo agora é o logotipo em profundidade (CenaNada, que envolve
// esta seção e a seguinte na página Como funciona).
export default function Problem() {
  return (
    <section id="o-problema" className="section">
      <div className="wrap">
        <SectionMarker label="O problema" number={sectionMarkers.problem} />
        <h1 data-entra="titulo" className="max-w-3xl text-[clamp(32px,4.2vw,52px)]">
          Todo mundo perde tempo com o repetitivo. Você não precisa.
        </h1>
        <p className="prose-measure mt-8 text-[18px] text-black/70">
          Responder a mesma mensagem toda hora. Copiar dado de um lugar pro
          outro. Anotar pedido no caderno. Mandar o mesmo e-mail dez vezes.
          Cada minuto nisso é um minuto que você não tá vendendo, atendendo
          ou descansando.
        </p>
      </div>
    </section>
  );
}
