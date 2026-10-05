import SectionMarker from "@/components/SectionMarker";
import { costOfNotDoing, sectionMarkers, buildWhatsAppLink } from "@/data/content";

export default function CostOfInaction() {
  return (
    <section id="custo" className="section">
      <div className="wrap">
        <SectionMarker label="Custo de não fazer" number={sectionMarkers.costOfNotDoing} />
        <h2 data-entra="titulo" className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
          {costOfNotDoing.header}
        </h2>
        <p className="prose-measure mt-6 text-[18px] text-black/70">{costOfNotDoing.text}</p>
        <p className="mt-8 text-[clamp(22px,2.6vw,30px)] font-semibold">{costOfNotDoing.destaque}</p>
        <a
          href={buildWhatsAppLink("Oi! Quero fazer a conta de quanto tempo eu tô perdendo.")}
          className="link-u mt-6 inline-block py-2 text-lg font-medium"
        >
          {costOfNotDoing.microCta} <span className="seta" aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
