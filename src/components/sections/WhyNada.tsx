import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers } from "@/data/content";

export default function WhyNada() {
  return (
    <section id="por-que-nada" className="section bg-[#fafafa]">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Por que NADA" number={sectionMarkers.whyNada} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            Do nada nasce tudo.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="prose-measure mt-6 text-[18px] text-black/70">
            Porque toda grande ideia começa do zero. De uma folha em branco,
            de um &ldquo;e se...&rdquo;. A gente pega esse nada (o seu
            problema, o seu tempo perdido, a sua ideia solta) e transforma em
            algo que funciona. Sem complicação. Sem promessa vazia. Só
            solução que entrega.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-8 text-[clamp(24px,3vw,36px)] font-semibold">
            Nada é o começo de tudo.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
