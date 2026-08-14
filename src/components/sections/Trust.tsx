import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers, trustBadges } from "@/data/content";

export default function Trust() {
  return (
    <section id="confianca" className="section">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Confiança" number={sectionMarkers.trust} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-3xl text-[clamp(28px,3.6vw,44px)]">
            A gente entende de negócio antes de entender de código.
          </h2>
        </Reveal>

        <div className="mt-14 flex flex-wrap gap-4">
          {trustBadges.map((badge, i) => (
            <Reveal key={badge} delay={i * 70}>
              <span className="inline-flex items-center rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium text-black/75">
                {badge}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
