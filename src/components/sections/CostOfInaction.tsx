import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { costOfNotDoing, sectionMarkers, waLink } from "@/data/content";

export default function CostOfInaction() {
  return (
    <section id="custo" className="section bg-[#fafafa]">
      <div className="wrap">
        <Reveal>
          <SectionMarker
            label="Custo de não fazer"
            number={sectionMarkers.costOfNotDoing}
          />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            {costOfNotDoing.header}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="prose-measure mt-6 text-[18px] text-black/70">
            {costOfNotDoing.text}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-8 text-[clamp(22px,2.6vw,30px)] font-semibold">
            {costOfNotDoing.destaque}
          </p>
        </Reveal>
        <Reveal delay={300}>
          <a
            href={waLink("Oi! Quero fazer a conta de quanto tempo eu tô perdendo.")}
            className="mt-6 inline-flex items-center gap-2 text-lg font-medium underline decoration-black/30 underline-offset-4 hover:decoration-black"
          >
            {costOfNotDoing.microCta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
