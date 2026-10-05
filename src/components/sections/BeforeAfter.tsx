"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Ponto from "@/components/Ponto";
import SectionMarker from "@/components/SectionMarker";
import { ANTES_DEPOIS, sectionMarkers } from "@/data/content";
import { MQ, movimentoLiberado } from "@/lib/motion";
import { circulo, PONTO_PX, raioQueCobre } from "@/lib/ponto";

gsap.registerPlugin(ScrollTrigger);

type Estado = typeof ANTES_DEPOIS.antes;

// Coluna de 0 a 9 e mais um 0: o zero final permite dar a volta inteira.
const COLUNA = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const posicaoFinal = (digito: string) => (digito === "0" ? 10 : Number(digito));

function Digitos({ valor }: { valor: string }) {
  return (
    <span aria-hidden className="inline-flex">
      {[...valor].map((d, i) => (
        <span key={i} className="inline-block h-[1em] overflow-clip leading-none">
          <span
            data-coluna={posicaoFinal(d)}
            style={{ "--k": posicaoFinal(d) } as React.CSSProperties}
            className="flex flex-col"
          >
            {COLUNA.map((n, j) => (
              <span key={j} className="block h-[1em]">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

// Traço à mão (mesmo gesto do logotipo) circulando o resultado.
function Circulo() {
  return (
    <svg aria-hidden viewBox="0 0 200 100" preserveAspectRatio="none" className="ba-circulo">
      <path
        pathLength={1}
        d="M34 22C72 3 168 4 188 38c16 32-46 58-102 56C30 92 4 70 14 44 22 24 60 12 108 10"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        // Lacuna maior que o traço: "apagado" (offset 1.02) não deixa a ponta
        // arredondada aparecer como um pingo no começo do caminho.
        strokeDasharray="1 2"
      />
    </svg>
  );
}

// Cabeçalho do palco. O título fica dentro do Antes (sem uma tela de vazio
// antes de o palco prender) e se repete, invertido, no Depois: quando o preto
// cobre, a manchete continua no mesmo lugar e só o conteúdo muda.
function Cabeca({ copia = false }: { copia?: boolean }) {
  if (copia) {
    return (
      <div aria-hidden className="ba-cabeca ba-cabeca-copia">
        <SectionMarker label={ANTES_DEPOIS.marcador} number={sectionMarkers.beforeAfter} estatico />
        <p className="ba-titulo">{ANTES_DEPOIS.titulo}</p>
      </div>
    );
  }
  return (
    <div className="ba-cabeca">
      <SectionMarker label={ANTES_DEPOIS.marcador} number={sectionMarkers.beforeAfter} />
      <h2 data-entra="titulo" className="ba-titulo">
        {ANTES_DEPOIS.titulo}
      </h2>
    </div>
  );
}

function Painel({ dados, escuro = false }: { dados: Estado; escuro?: boolean }) {
  return (
    <div
      data-escuro={escuro || undefined}
      className={`ba-estado ${escuro ? "ba-depois bg-black text-white" : "ba-antes bg-white text-black"}`}
    >
      <div className="wrap">
        <Cabeca copia={escuro} />
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="eyebrow">( {dados.label} )</p>
            <h3 className="mt-5 text-[clamp(24px,2.8vw,34px)]">{dados.manchete}</h3>
            <ul className={`mt-6 space-y-3 text-[15px] md:text-base ${escuro ? "text-white/75" : "text-black/65"}`}>
              {dados.linhas.map((linha) => (
                <li key={linha} className="flex items-start gap-3">
                  <span aria-hidden className="font-bold">
                    {escuro ? "✓" : "✕"}
                  </span>
                  <span data-risco={!escuro || undefined}>{linha}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="md:col-span-7 md:text-right">
            <span className="sr-only">
              {dados.valor} {dados.unidade} {dados.legenda}
            </span>
            <span aria-hidden data-valor className="ba-valor relative inline-block font-black leading-[0.8] tracking-[-0.06em]">
              {escuro ? <Digitos valor={dados.valor} /> : dados.valor}
              {escuro && <Circulo />}
            </span>
            <span aria-hidden className="mt-3 block text-[clamp(24px,3vw,44px)] font-bold tracking-tight">
              {dados.unidade}
            </span>
            <span aria-hidden className={`mt-2 block text-sm md:text-base ${escuro ? "text-white/60" : "text-black/55"}`}>
              {dados.legenda}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Assinatura de prova: o visitante leva "8 horas" a "10 minutos" com o
// próprio scroll. Desktop/tablet: um palco preso no topo (sticky) enquanto o
// trilho em volta dele passa; nada de pin. Os itens do Antes são
// riscados, o ponto da marca cai sobre o 8 e vira o círculo preto que cobre
// tudo (o mesmo gesto da intro); no Depois os dígitos rolam até 10 e o traço
// à mão circula o resultado. Celular: os dois estados em sequência, sem pin;
// o Depois abre uma vez num círculo que nasce de um ponto. Movimento
// reduzido: dois blocos parados.
export default function BeforeAfter() {
  const palcoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const palco = palcoRef.current;
    if (!palco || !movimentoLiberado()) return;

    const trilho = palco.parentElement!;
    const depois = palco.querySelector<HTMLElement>(".ba-depois")!;
    const oito = palco.querySelector<HTMLElement>(".ba-antes [data-valor]")!;
    const dez = palco.querySelector<HTMLElement>(".ba-depois [data-valor]")!;
    const ponto = palco.querySelector<HTMLElement>(".ponto")!;
    const colunas = gsap.utils.toArray<HTMLElement>("[data-coluna]", palco);
    const rolar = { yPercent: (i: number) => -Number(colunas[i].dataset.coluna) * (100 / COLUNA.length) };
    const tracoMao = palco.querySelector(".ba-circulo path");
    const riscos = palco.querySelectorAll("[data-risco]");
    const raio = PONTO_PX / 2;

    // Ponto de impacto: o topo do 8, no centro dele (coordenadas do palco).
    // Medido de novo a cada refresh (invalidateOnRefresh + valores em função).
    const impacto = () => {
      const p = palco.getBoundingClientRect();
      const r = oito.getBoundingClientRect();
      const corpo = parseFloat(getComputedStyle(oito).fontSize);
      return { x: r.left - p.left + r.width / 2, y: r.top - p.top + corpo * 0.05, w: p.width, h: p.height };
    };
    const fechado = () => {
      const a = impacto();
      return circulo(0, a.x, a.y);
    };
    const aberto = () => {
      const a = impacto();
      return circulo(raioQueCobre(a.x, a.y, a.w, a.h), a.x, a.y);
    };

    const mm = gsap.matchMedia();

    mm.add(MQ.tablet, () => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          // A altura do trilho (CSS) é a duração; o gatilho é ele, não o palco
          // preso. Fim: o ponto em que o palco solta do topo. Sem pin: o pin
          // trocava o palco pra position: fixed e o Chrome contava CLS ~1 na
          // entrada e ~1 na saída.
          scrollTrigger: {
            trigger: trilho,
            start: "top top",
            end: () => `+=${trilho.offsetHeight - palco.offsetHeight}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        .to(riscos, { textDecorationColor: "rgba(0,0,0,0.7)", opacity: 0.45, stagger: 0.04, duration: 0.12 }, 0.02)
        // Queda: do alto da tela até o topo do 8, acelerando e chegando perto.
        .fromTo(
          ponto,
          { x: () => impacto().x - raio, y: -2 * PONTO_PX, scale: 0.6, autoAlpha: 1 },
          { x: () => impacto().x - raio, y: () => impacto().y - raio, scale: 1, duration: 0.22, ease: "power2.in" },
          0.12
        )
        // Impacto: o círculo preto nasce embaixo do ponto e, quando passa do
        // tamanho dele, o ponto sai: é o mesmo preto que se espalha.
        .fromTo(
          depois,
          { clipPath: fechado },
          { clipPath: aberto, duration: 0.36, ease: "power2.in", immediateRender: false },
          0.34
        )
        // Sai quando o círculo já passou do tamanho dele (raio ~10 px).
        .set(ponto, { autoAlpha: 0 }, 0.373)
        // O número novo só aparece depois que o preto engoliu o 8.
        .fromTo(dez, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.52)
        .fromTo(colunas, { yPercent: 0 }, { ...rolar, duration: 0.24, ease: "power2.out" }, 0.6)
        .fromTo(tracoMao, { strokeDashoffset: 1.02 }, { strokeDashoffset: 0, duration: 0.14, ease: "power1.inOut" }, 0.86);
    });

    mm.add(MQ.mobile, () => {
      // O ponto nasce no alto do Depois e abre o círculo; os números rolam
      // quando chegam na tela.
      const origem = () => ({ x: depois.offsetWidth / 2, y: 40 });
      gsap.set(depois, { clipPath: circulo(0, origem().x, origem().y) });
      gsap
        .timeline({ scrollTrigger: { trigger: depois, start: "top 80%", once: true } })
        .to(depois, { clipPath: () => circulo(raio, origem().x, origem().y), duration: 0.2, ease: "power2.out" })
        .to(depois, {
          clipPath: () => circulo(raioQueCobre(origem().x, origem().y, depois.offsetWidth, depois.offsetHeight), origem().x, origem().y),
          duration: 0.9,
          ease: "power3.inOut",
          // "none" explícito: limpar o estilo devolveria o estado fechado do CSS.
          onComplete: () => gsap.set(depois, { clipPath: "none" }),
        }, "+=0.12");
      gsap
        .timeline({ scrollTrigger: { trigger: dez, start: "top 80%", once: true } })
        .fromTo(colunas, { yPercent: 0 }, { ...rolar, duration: 1.1, ease: "expo.out" }, 0.3)
        .fromTo(tracoMao, { strokeDashoffset: 1.02 }, { strokeDashoffset: 0, duration: 0.6, ease: "power1.inOut" }, 0.8);
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="antes-depois" className="ba">
      <div className="ba-trilho">
        <div ref={palcoRef} className="ba-palco">
          <Painel dados={ANTES_DEPOIS.antes} />
          <Painel dados={ANTES_DEPOIS.depois} escuro />
          <Ponto papel="impacto" className="ba-ponto" />
        </div>
      </div>

      <p className="wrap py-3 text-[13px] text-black/60">
        <Link href={ANTES_DEPOIS.creditoHref} className="link-u inline-block py-3">
          {ANTES_DEPOIS.credito}
        </Link>
      </p>
    </section>
  );
}
