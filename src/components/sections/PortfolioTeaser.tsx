import Link from "next/link";
import Capa from "@/components/Capa";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers } from "@/data/content";
import { DESTAQUES_HOME, PROJETOS } from "@/data/portfolio";

const DESTAQUES = PROJETOS.filter((p) => DESTAQUES_HOME.includes(p.slug));

// Prova real logo depois do Antes/Depois: um site, um sistema e um projeto
// físico-digital, cada um com uma linha de resultado. Encosta no Antes/Depois:
// a promessa e a prova ficam juntas.
export default function PortfolioTeaser() {
  return (
    <section id="portfolio" className="section section-encosta">
      <div className="wrap">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionMarker label="Portfólio" number={sectionMarkers.portfolio} />
            <h2 data-entra="titulo" className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
              O que a gente já construiu.
            </h2>
          </div>
          <Link href="/portfolio" className="link-u shrink-0 py-3 text-[15px] font-medium">
            Ver todos os projetos <span className="seta" aria-hidden>→</span>
          </Link>
        </div>

        <ul className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-3">
          {DESTAQUES.map((projeto) => (
            <li key={projeto.slug}>
              <Link href={`/portfolio/${projeto.slug}`} className="capa-link group block">
                <div data-entra="imagem">
                  <Capa projeto={projeto} sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <p className="mt-5 flex items-baseline justify-between gap-4">
                  <span className="text-xl font-bold tracking-tight">
                    <span className="link-u">{projeto.nome}</span>
                  </span>
                  <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-black/55">
                    {projeto.entrega}
                  </span>
                </p>
                <p className="mt-2 text-[15px] text-black/70">{projeto.chamada}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
