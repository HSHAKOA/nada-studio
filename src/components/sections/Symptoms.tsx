import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { buildWhatsAppLink, ISSO_E_COM_A_GENTE } from "@/data/content";

export default function Symptoms() {
  return (
    <section id="isso-e-com-a-gente" className="section">
      <div className="wrap">
        <Reveal>
          <SectionMarker
            label={ISSO_E_COM_A_GENTE.marcador}
            number={ISSO_E_COM_A_GENTE.num}
          />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            {ISSO_E_COM_A_GENTE.titulo}
          </h2>
        </Reveal>

        <ul className="mt-12 border-t border-black/15 sm:grid sm:grid-cols-2 sm:gap-x-12">
          {ISSO_E_COM_A_GENTE.itens.map((item, i) => (
            <Reveal key={item} as="li" delay={i * 70}>
              <div className="flex items-baseline gap-4 border-b border-black/15 py-5">
                <span className="w-8 shrink-0 text-sm text-black/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[17px] text-black/80">{item}</span>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <p className="prose-measure mt-10 text-[clamp(20px,2.4vw,26px)] font-semibold">
            {ISSO_E_COM_A_GENTE.fecho}
          </p>
        </Reveal>
        <Reveal delay={280}>
          <a
            href={buildWhatsAppLink(ISSO_E_COM_A_GENTE.ctaMsg)}
            className="btn btn-primary mt-8"
          >
            {ISSO_E_COM_A_GENTE.cta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
