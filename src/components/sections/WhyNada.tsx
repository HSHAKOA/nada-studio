import Link from "next/link";
import SectionMarker from "@/components/SectionMarker";
import BuracoNegro from "@/components/3d/BuracoNegro";
import { sectionMarkers } from "@/data/content";

// O manifesto é o conceito da marca: ocupa a escala da página. Atrás do
// título, o buraco negro: o nada como o ponto onde tudo começa.
export default function WhyNada() {
  return (
    <section id="por-que-nada" className="section isolate">
      <div className="wrap">
        <SectionMarker label="Por que NADA Studio" number={sectionMarkers.whyNada} />
        <BuracoNegro>
          <h1
            data-entra="titulo"
            className="text-[clamp(64px,16vw,232px)] font-black leading-[0.86] tracking-[-0.055em]"
          >
            do nada
            <br />
            nasce
            <br />
            tudo.
          </h1>
        </BuracoNegro>

        <div className="mt-16 grid gap-8 md:grid-cols-12">
          <p className="text-[clamp(18px,1.7vw,22px)] leading-relaxed text-black/75 md:col-span-6 md:col-start-7">
            Tudo começa do zero. De uma folha em branco, de um &ldquo;e se...&rdquo;. A
            gente pega esse nada (o seu problema, o seu tempo perdido, a sua ideia
            solta) e faz virar coisa que funciona. Sites, sistemas e a forma como
            eles são mostrados.
          </p>
          <p className="md:col-span-6 md:col-start-7">
            <Link href="/motion" className="link-u inline-block py-2 text-[17px] font-medium">
              Conhecer o braço de vídeo e motion <span className="seta" aria-hidden>→</span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
