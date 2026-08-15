import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PROJETOS, SELO_TIPO } from "@/data/portfolio";

// Teaser: só os dois primeiros. A lista inteira mora em /portfolio e não se
// repete aqui.
const DESTAQUES = PROJETOS.slice(0, 2);

export default function PortfolioTeaser() {
  return (
    <section id="portfolio-teaser" className="section">
      <div className="wrap">
        <Reveal>
          <h2 className="max-w-2xl text-[clamp(28px,3.6vw,44px)]">
            O que a gente já construiu.
          </h2>
        </Reveal>

        <ul className="mt-12 border-t border-black/15">
          {DESTAQUES.map((projeto, i) => (
            <Reveal key={projeto.id} as="li" delay={i * 80}>
              <Link
                href="/portfolio"
                className="flex items-baseline gap-4 border-b border-black/15 py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                <span className="w-8 shrink-0 text-sm text-black/40">
                  {projeto.num}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[clamp(20px,2.4vw,28px)] font-bold tracking-tight">
                    {projeto.nome}
                  </span>
                  <span className="mt-1 block text-sm text-black/60">
                    {projeto.subtitulo}
                  </span>
                </span>
                <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.2em] text-black/60 sm:block">
                  {SELO_TIPO[projeto.tipo]}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <Link
            href="/portfolio"
            className="mt-10 inline-block text-[16px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <span className="group relative inline-block py-1">
              Ver tudo →
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-[400ms] ease-out group-hover:scale-x-100"
              />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
