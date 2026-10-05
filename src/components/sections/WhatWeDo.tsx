"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Ponto from "@/components/Ponto";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers, SERVICOS } from "@/data/content";
import { MQ, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const BASE = 200; // diâmetro de desenho do ponto viajante (escala pra baixo = nítido)

// Lista editorial no mesmo padrão dos sintomas: número, pergunta grande,
// resposta curta. Sem ícone, sem cartão. O ponto final do título é o ponto da
// marca: no desktop ele chega de longe pelo vazio à direita, passa perto
// (inverte o que cruza) e pousa no fim da frase. Ver src/lib/ponto.ts.
export default function WhatWeDo() {
  const secaoRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const secao = secaoRef.current;
    if (!secao || !movimentoLiberado()) return;
    const viajante = secao.querySelector<HTMLElement>(".passagem-ponto");
    const mm = gsap.matchMedia();

    mm.add(MQ.tablet, () => {
      if (!viajante) return;
      // Onde o ponto final do título fica parado. Medido pelo layout
      // (offsetLeft/offsetTop até a seção), que ignora transform: medido na
      // tela, pegava a linha do título ainda deslocada pela entrada (SplitText)
      // e o pouso ficava abaixo do ponto. Procurado a cada medida: o SplitText
      // refaz as linhas.
      const alvo = () => {
        const final = secao.querySelector<HTMLElement>(".ponto-final")!;
        const d = final.getBoundingClientRect().width;
        let x = 0;
        let y = 0;
        let el: HTMLElement | null = final;
        while (el && el !== secao) {
          x += el.offsetLeft;
          y += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return { x: x + d / 2, y: y + final.offsetHeight / 2, d, w: secao.offsetWidth };
      };

      // Um atributo só decide quem aparece, no CSS: "viajando" mostra o
      // viajante e esconde o ponto do título; "pousado", o contrário. Os dois
      // trocam no mesmo instante, e o GSAP só move o viajante. Antes, o do
      // título aparecia em 0,995 e o viajante só sumia em 1 (no meio, os dois
      // na tela, ou nenhum, com o difference de um sobre o outro), e o sumiço
      // gravado pelo GSAP saía de sincronia depois de um refresh.
      const pousar = (progresso: number) => {
        const estado = progresso > 0.995 ? "pousado" : "viajando";
        if (secao.dataset.ponto !== estado) secao.dataset.ponto = estado;
      };

      const tl = gsap
        .timeline({
          scrollTrigger: {
            trigger: secao,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.6,
            invalidateOnRefresh: true,
            // O refresh (resize, fonte, imagem) mexe no progresso sem passar
            // pelo onUpdate: confere de novo no fim.
            onRefresh: (self) => pousar(self.animation?.progress() ?? 0),
          },
          onUpdate: () => pousar(tl.progress()),
        })
        // Longe → perto: entra pela direita, pequeno, e cresce pelo vazio até
        // passar por cima do fim da frase (o difference inverte as letras).
        .fromTo(
          viajante,
          { x: () => alvo().w * 0.9 - BASE / 2, y: () => alvo().y - 190 - BASE / 2, scale: 0.03 },
          { x: () => alvo().x + 150 - BASE / 2, y: () => alvo().y - 40 - BASE / 2, scale: 0.9, duration: 0.55, ease: "power1.inOut" }
        )
        // Perto → longe: recua cruzando o fim da frase e vira o ponto final.
        .to(viajante, {
          x: () => alvo().x - BASE / 2,
          y: () => alvo().y - BASE / 2,
          scale: () => alvo().d / BASE,
          duration: 0.45,
          ease: "power3.inOut",
        });
      pousar(tl.progress());

      return () => {
        delete secao.dataset.ponto;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={secaoRef} id="o-que-fazemos" className="section relative">
      <div className="wrap">
        <SectionMarker label="O que fazemos" number={sectionMarkers.whatWeDo} />
        <h2 data-entra="titulo" className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
          A gente constrói. Você só usa<span aria-hidden className="ponto-final" />
        </h2>

        <ol data-entra="linha" className="regua-topo mt-14">
          {SERVICOS.map((servico) => (
            <li
              key={servico.num}
              data-entra="linha"
              className="regua grid gap-2 py-7 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              <span className="text-sm text-black/40 md:col-span-1">{servico.num}</span>
              <h3 className="text-[clamp(22px,2.6vw,32px)] md:col-span-7">{servico.titulo}</h3>
              <p className="text-black/70 md:col-span-4">
                {servico.descricao}
                {servico.href && (
                  <Link href={servico.href} className="link-u mt-1 block w-fit py-2 text-sm font-medium text-black">
                    Ver como funciona <span className="seta" aria-hidden>→</span>
                  </Link>
                )}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <Ponto papel="passagem" className="passagem-ponto" />
    </section>
  );
}
