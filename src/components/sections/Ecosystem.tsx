"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import Ponto from "@/components/Ponto";
import SectionMarker from "@/components/SectionMarker";
import { ECOSSISTEMA, ecosystemIntro, sectionMarkers } from "@/data/content";
import { MQ, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const ms = (n: number) => `${Math.round(n)}ms`;

// Texto que sobe pela própria linha de base (máscara da linha).
function Linha({ children, d, dm, className = "" }: { children: string; d: number; dm: number; className?: string }) {
  return (
    <span className={`eco-texto ${className}`} style={{ "--d": ms(d), "--dm": ms(dm) } as React.CSSProperties}>
      <span>{children}</span>
    </span>
  );
}

// Seu negócio no centro, as áreas e o que cada uma passa a fazer sozinha.
// Desktop: o ponto da marca é a raiz; o tronco sai dele, a espinha abre do
// meio pras pontas, os ramos chegam nas áreas e as ações entram em seguida,
// uma vez, e tudo repousa. Celular: a mesma árvore em pé; a espinha desce com
// a rolagem e cada área se monta quando chega na tela.
export default function Ecosystem() {
  const ecoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eco = ecoRef.current;
    if (!eco || !movimentoLiberado()) return;
    const mm = gsap.matchMedia();

    mm.add(MQ.desktop, () => {
      const st = ScrollTrigger.create({
        trigger: eco,
        start: "top 72%",
        once: true,
        onEnter: () => eco.classList.add("is-in"),
      });
      return () => {
        st.kill();
        eco.classList.remove("is-in");
      };
    });

    mm.add(`(max-width: 1023px)`, () => {
      const areas = gsap.utils.toArray<HTMLElement>(".eco-area", eco);
      const gatilhos = [
        ScrollTrigger.create({
          trigger: eco,
          start: "top 75%",
          end: "bottom 60%",
          onUpdate: (self) => eco.style.setProperty("--p", self.progress.toFixed(3)),
        }),
        ScrollTrigger.create({ trigger: eco, start: "top 80%", once: true, onEnter: () => eco.classList.add("is-raiz") }),
        ...areas.map((area) =>
          ScrollTrigger.create({ trigger: area, start: "top 82%", once: true, onEnter: () => area.classList.add("is-in") })
        ),
      ];
      return () => {
        gatilhos.forEach((g) => g.kill());
        eco.classList.remove("is-raiz");
        eco.style.removeProperty("--p");
        areas.forEach((a) => a.classList.remove("is-in"));
      };
    });

    return () => mm.revert();
  }, []);

  const total = ECOSSISTEMA.areas.length;

  return (
    <section id="ecossistema" className="section">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionMarker label={ecosystemIntro.marcador} number={sectionMarkers.ecosystem} />
            <h2 data-entra="titulo" className="text-[clamp(32px,4.2vw,52px)]">
              {ecosystemIntro.header}
            </h2>
          </div>
          <p className="prose-measure text-[18px] text-black/70 lg:col-span-5">{ecosystemIntro.sub}</p>
        </div>

        <div ref={ecoRef} className="eco mt-16 lg:mt-24" style={{ "--areas": total } as React.CSSProperties}>
          <p className="eco-raiz">
            <Ponto papel="raiz" className="eco-ponto" />
            <Linha d={80} dm={60} className="eco-raiz-nome">
              {ECOSSISTEMA.centro}
            </Linha>
          </p>

          <span aria-hidden className="eco-tronco">
            <span className="eco-espinha" />
          </span>

          <ul className="eco-areas">
            {ECOSSISTEMA.areas.map((area, i) => {
              // Ramos do meio pra fora: os dois do centro saem antes.
              const doCentro = Math.abs(i - (total - 1) / 2);
              const ramo = 780 + doCentro * 90;
              return (
                <li key={area.nome} className="eco-area" style={{ "--d": ms(ramo), "--dm": ms(0) } as React.CSSProperties}>
                  <h3 className="eco-nome">
                    <Linha d={ramo + 120} dm={40}>
                      {area.nome}
                    </Linha>
                  </h3>
                  <ul className="eco-acoes">
                    {area.acoes.map((acao, j) => (
                      <li key={acao}>
                        <Linha d={ramo + 320 + j * 45} dm={160 + j * 70}>
                          {acao}
                        </Linha>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
