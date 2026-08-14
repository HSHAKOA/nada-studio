import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import AccordionGallery from "@/components/ui/AccordionGallery";
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
      </div>

      <Reveal delay={160}>
        <div className="wrap mt-14">
          <AccordionGallery
            items={SERVICOS}
            orientation="horizontal"
            trigger="hover"
            defaultIndex={1}
            expandRatio={0.46}
            height={520}
            gap={2}
            radius={0}
            tilt={0}
            parallax={0.35}
            duration={0.7}
            ease="power3.out"
            accentColor="#FFFFFF"
            overlayColor="#000000"
            textColor="#FFFFFF"
            grayscale={false}
          />
        </div>
      </Reveal>
    </section>
  );
}
