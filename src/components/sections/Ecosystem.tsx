import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import OrbitalEcosystem from "@/components/OrbitalEcosystem";
import { ecosystemIntro, sectionMarkers } from "@/data/content";

export default function Ecosystem() {
  return (
    <section id="ecossistema" className="section">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="O ecossistema" number={sectionMarkers.ecosystem} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            {ecosystemIntro.header}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="prose-measure mt-6 text-[18px] text-black/70">
            {ecosystemIntro.sub}
          </p>
        </Reveal>
      </div>

      <div className="mt-16">
        <OrbitalEcosystem />
      </div>
    </section>
  );
}
