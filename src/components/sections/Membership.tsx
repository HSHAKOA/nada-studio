import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { membershipItems, sectionMarkers } from "@/data/content";

export default function Membership() {
  return (
    <section id="mensalidade" className="section section-invert">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="A mensalidade" number={sectionMarkers.membership} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            Depois de pronto, a gente continua junto.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 text-white/70">
            Depois de pronto, a gente continua cuidando de tudo:
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {membershipItems.map((item, i) => (
            <Reveal key={item} delay={i * 80}>
              <li className="flex items-start gap-3 border-t border-white/15 pt-4 text-lg">
                <span aria-hidden className="text-white/40">
                  ·
                </span>
                {item}
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={320}>
          <p className="mt-14 text-[clamp(22px,2.6vw,30px)] font-semibold">
            Você cuida do negócio. A gente cuida do resto.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
