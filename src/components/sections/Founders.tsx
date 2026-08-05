import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { founders, foundersIntro, sectionMarkers } from "@/data/content";

export default function Founders() {
  return (
    <section id="quem-e-a-nada" className="section bg-[#fafafa]">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Quem é a NADA" number={sectionMarkers.founders} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            {foundersIntro.header}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="prose-measure mt-6 text-[18px] text-black/70">
            {foundersIntro.text}
          </p>
        </Reveal>

        <div className="mt-14 flex flex-wrap gap-6">
          {founders.map((founder, i) => (
            <Reveal key={founder.name} delay={200 + i * 80}>
              <div className="card flex items-center gap-4">
                {founder.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={founder.photo}
                    alt={founder.name}
                    className="h-16 w-16 shrink-0 rounded-full border border-black/10 object-cover grayscale contrast-125"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-xs text-black/30"
                  >
                    foto
                  </span>
                )}
                <div>
                  <p className="text-lg font-medium">{founder.name}</p>
                  <p className="text-sm text-black/60">{founder.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={360}>
          <p className="mt-14 text-[clamp(22px,2.6vw,30px)] font-semibold">
            {foundersIntro.fecho}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
