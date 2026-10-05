import SectionMarker from "@/components/SectionMarker";
import { membershipItems, sectionMarkers } from "@/data/content";

export default function Membership() {
  return (
    <section id="mensalidade" className="section section-invert">
      <div className="wrap">
        <SectionMarker label="A mensalidade" number={sectionMarkers.membership} />
        <h2 data-entra="titulo" className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
          Depois de pronto, a gente continua junto.
        </h2>

        <ul className="mt-12 grid gap-x-12 md:grid-cols-2">
          {membershipItems.map((item) => (
            <li key={item} data-entra="linha" className="regua-topo flex items-start gap-3 py-5 text-lg">
              <span aria-hidden className="text-white/40">
                ·
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
