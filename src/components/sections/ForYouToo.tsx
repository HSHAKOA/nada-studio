import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import {
  forYouPersonal,
  forYouPro,
  sectionMarkers,
  waLink,
} from "@/data/content";

export default function ForYouToo() {
  return (
    <section id="pra-voce" className="section">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Pra você também" number={sectionMarkers.forYou} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            Seu negócio ou o seu dia. A gente resolve os dois.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="prose-measure mt-6 text-[18px] text-black/70">
            Profissional ou não, se você quer usar IA no seu dia a dia, a
            gente monta a solução com você.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full">
              <h3 className="text-xl">{forYouPro.title}</h3>
              <p className="mt-4 text-black/70">{forYouPro.body}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="card h-full">
              <h3 className="text-xl">{forYouPersonal.title}</h3>
              <p className="mt-4 text-black/70">{forYouPersonal.intro}</p>
              <ul className="mt-4 space-y-2">
                {forYouPersonal.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-black/80">
                    <span aria-hidden className="text-black/30">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <p className="mt-14 text-[clamp(22px,2.6vw,30px)] font-semibold">
            Se a tarefa é repetitiva, a gente resolve com você.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <a
            href={waLink("Oi! Quero uma solução pra minha rotina pessoal.")}
            className="mt-6 inline-flex items-center gap-2 text-lg font-medium underline decoration-black/30 underline-offset-4 hover:decoration-black"
          >
            Me conta o que você precisa →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
