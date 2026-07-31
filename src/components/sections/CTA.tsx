import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { WHATSAPP_LINK, sectionMarkers } from "@/data/content";

export default function CTA() {
  return (
    <section id="comecar" className="section section-invert">
      <div className="wrap text-center">
        <Reveal>
          <div className="flex justify-center">
            <SectionMarker label="Vamos começar" number={sectionMarkers.cta} />
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto max-w-2xl text-[clamp(36px,5.5vw,64px)]">
            Bora recuperar seu tempo?
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="prose-measure mx-auto mt-6 text-[18px] text-white/70">
            A primeira conversa é de graça. Chama no WhatsApp, conta o que
            trava o seu dia e a gente te mostra como resolver.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <a href={WHATSAPP_LINK} className="btn btn-primary mt-10">
            Chamar no WhatsApp →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
