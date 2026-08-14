"use client";

import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import LogoCarousel from "@/components/ui/LogoCarousel";
import { TECHS } from "@/components/TechMarquee";
import { sectionMarkers } from "@/data/content";

const logos = TECHS.map((tech, i) => ({
  name: tech.nome,
  id: i,
  img: tech.Icone,
}));

export default function ToolsWeBuildWith() {
  return (
    <section id="ferramentas" className="section section-invert">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Ferramentas" number={sectionMarkers.tools} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            A gente constrói com quem já é bom nisso.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="prose-measure mt-6 text-[18px] text-white/70">
            Nada de reinventar roda. A gente escolhe a ferramenta certa pra
            cada parte do seu problema.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-14 max-w-md">
            <LogoCarousel logos={logos} columnCount={3} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
