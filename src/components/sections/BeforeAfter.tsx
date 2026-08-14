import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers } from "@/data/content";

// Placeholder até termos o primeiro caso real medido. Nada de número inventado.
export default function BeforeAfter() {
  return (
    <section id="antes-depois" className="section bg-[#fafafa]">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Antes / Depois" number={sectionMarkers.beforeAfter} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            Prova, não promessa.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full">
              <span className="eyebrow">Antes</span>
              <p className="mt-6 text-4xl font-semibold text-black/20">—</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="card h-full">
              <span className="eyebrow">Depois</span>
              <p className="mt-6 text-4xl font-semibold text-black/20">—</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <p className="mt-8 text-black/50">
            Primeiro caso real entra aqui assim que fechado. Sem número
            inventado.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
