import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers, services } from "@/data/content";

export default function WhatWeDo() {
  return (
    <section id="o-que-fazemos" className="section bg-[#fafafa]">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="O que fazemos" number={sectionMarkers.whatWeDo} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            A gente constrói. Você só usa.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="prose-measure mt-6 text-[18px] text-black/70">
            Do site à automação, montamos tudo do zero — do jeito que o seu
            negócio precisa. Sem template pronto, sem enrolação.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.number} delay={i * 100}>
              <div className="card h-full">
                <span className="eyebrow">{service.number} — {service.title}</span>
                <h3 className="mt-5 text-2xl">{service.headline}</h3>
                <p className="mt-4 text-black/70">{service.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
