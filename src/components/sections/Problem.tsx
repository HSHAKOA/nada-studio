import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers } from "@/data/content";

export default function Problem() {
  return (
    <section id="o-problema" className="section relative overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-bold text-[26vw] leading-none text-black/[0.04]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        NADA
      </span>

      <div className="wrap relative z-10">
        <Reveal>
          <SectionMarker label="O problema" number={sectionMarkers.problem} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-3xl text-[clamp(32px,4.2vw,52px)]">
            Todo mundo perde tempo com o repetitivo. Você não precisa.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="prose-measure mt-8 text-[18px] text-black/70">
            Responder a mesma mensagem toda hora. Copiar dado de um lugar pro
            outro. Anotar pedido no caderno. Mandar o mesmo e-mail dez vezes.
            Cada minuto nisso é um minuto que você não tá vendendo, atendendo
            ou descansando.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-8 text-[clamp(22px,2.6vw,30px)] font-semibold">
            A gente existe pra devolver esse tempo.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
