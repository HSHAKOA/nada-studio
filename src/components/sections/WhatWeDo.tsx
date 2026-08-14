import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { serviceIcons } from "@/components/icons/ServiceIcons";
import { sectionMarkers, SERVICOS } from "@/data/content";

export default function WhatWeDo() {
  return (
    <section id="o-que-fazemos" className="section bg-[#fafafa]">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="O que fazemos" number={sectionMarkers.whatWeDo} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            A gente constrói. Você só usa.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICOS.map((servico, i) => {
            const Icon = serviceIcons[servico.icone];
            return (
              <Reveal key={servico.id} delay={i * 80}>
                <div className="card flex h-full flex-col">
                  <Icon aria-hidden="true" className="h-10 w-10 text-black" />
                  <span className="eyebrow mt-6">{servico.num}</span>
                  <h3 className="mt-3 text-xl">{servico.titulo}</h3>
                  <p className="mt-3 text-black/70">{servico.descricao}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
