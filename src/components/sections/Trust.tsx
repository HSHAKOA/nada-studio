import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers, SEM_VENDEDOR, trustBadges } from "@/data/content";

export default function Trust() {
  return (
    <section id="confianca" className="section">
      <div className="wrap">
        <SectionMarker label="Confiança" number={sectionMarkers.trust} />
        <h2 data-entra="titulo" className="max-w-3xl text-[clamp(28px,3.6vw,44px)]">
          A gente entende de negócio antes de entender de código.
        </h2>

        <ul className="mt-12 flex flex-wrap gap-3">
          {trustBadges.map((badge) => (
            <li key={badge} className="border border-black/15 px-5 py-2.5 text-sm font-medium text-black/75">
              {badge}
            </li>
          ))}
        </ul>

        <div data-entra="linha" className="regua-topo mt-14 pt-10">
          <h3 className="text-[clamp(24px,3vw,36px)] font-bold tracking-tight">{SEM_VENDEDOR.titulo}</h3>
          <p className="prose-measure mt-4 text-[18px] text-black/70">{SEM_VENDEDOR.texto}</p>
        </div>
      </div>
    </section>
  );
}
