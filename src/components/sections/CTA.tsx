"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionMarker from "@/components/SectionMarker";
import { buildWhatsAppLink, DIAGNOSTICO_CTA, sectionMarkers } from "@/data/content";
import { MQ, movimentoLiberado } from "@/lib/motion";
import { circulo, PONTO_PX, raioQueCobre } from "@/lib/ponto";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  numero?: string;
  titulo?: string;
  texto?: string;
  botao?: string;
  mensagem?: string;
};

// Fecho com o mesmo gesto da abertura: o ponto da marca reaparece pequeno no
// vazio acima da chamada, para um instante e abre num círculo que vira a
// seção preta. O círculo é a entrada: o texto aparece conforme ele passa.
// Único botão magnético do site (só com mouse).
export default function CTA({
  numero = sectionMarkers.cta,
  titulo = "Bora recuperar seu tempo?",
  texto = "Chama no WhatsApp, conta o que trava o seu dia e a gente te mostra como resolver.",
  botao = DIAGNOSTICO_CTA,
  mensagem = "Oi! Quero o diagnóstico gratuito. Posso contar o que trava o meu dia?",
}: Props) {
  const secaoRef = useRef<HTMLElement>(null);
  const imaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const secao = secaoRef.current;
    const ima = imaRef.current;
    const botaoEl = ima?.firstElementChild;
    if (!secao || !ima || !botaoEl || !movimentoLiberado()) return;

    // Origem: no meio do respiro de cima, acima do marcador.
    const origem = () => ({
      x: secao.offsetWidth / 2,
      y: parseFloat(getComputedStyle(secao).paddingTop) * 0.5,
      w: secao.offsetWidth,
      h: secao.offsetHeight,
    });
    const ponto = (r: number) => () => {
      const o = origem();
      return circulo(r, o.x, o.y);
    };
    const aberto = () => {
      const o = origem();
      return circulo(raioQueCobre(o.x, o.y, o.w, o.h), o.x, o.y);
    };
    const raio = PONTO_PX / 2;
    const mm = gsap.matchMedia();

    mm.add(MQ.tablet, () => {
      gsap.set(secao, { clipPath: ponto(0)() });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: secao,
            start: () => `top+=${origem().y} 82%`,
            end: "top 8%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(secao, { clipPath: ponto(0) }, { clipPath: ponto(raio), duration: 0.1, ease: "power2.out" })
        .to(secao, { clipPath: aberto, duration: 0.78, ease: "power2.in" }, "+=0.12");
    });

    mm.add(MQ.mobile, () => {
      gsap.set(secao, { clipPath: ponto(0)() });
      gsap
        .timeline({ scrollTrigger: { trigger: secao, start: "top 82%", once: true } })
        .to(secao, { clipPath: ponto(raio), duration: 0.2, ease: "power2.out" })
        .to(secao, { clipPath: aberto, duration: 0.9, ease: "power3.inOut", clearProps: "clipPath" }, "+=0.15");
    });

    mm.add(MQ.ponteiroFino, () => {
      const x = gsap.quickTo(botaoEl, "x", { duration: 0.5, ease: "power3" });
      const y = gsap.quickTo(botaoEl, "y", { duration: 0.5, ease: "power3" });
      // Mede o invólucro parado, não o botão que se mexe.
      const mover = (e: PointerEvent) => {
        const r = ima.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const perto = Math.hypot(dx, dy) < 160;
        x(perto ? dx * 0.25 : 0);
        y(perto ? dy * 0.25 : 0);
      };
      const soltar = () => {
        x(0);
        y(0);
      };
      secao.addEventListener("pointermove", mover);
      secao.addEventListener("pointerleave", soltar);
      return () => {
        secao.removeEventListener("pointermove", mover);
        secao.removeEventListener("pointerleave", soltar);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={secaoRef} id="comecar" className="section section-invert">
      <div className="wrap text-center">
        <div className="flex justify-center">
          <SectionMarker label="Vamos começar" number={numero || undefined} />
        </div>
        <h2 className="mx-auto max-w-4xl text-[clamp(44px,8vw,112px)] font-black leading-[0.95] tracking-[-0.04em]">
          {titulo}
        </h2>
        <p className="prose-measure mx-auto mt-8 text-[18px] text-white/70">{texto}</p>
        <span ref={imaRef} className="mt-12 inline-block">
          {/* O rótulo vem dos dados e pode ser longo ("Me identifiquei com esse
              projeto"): quebra em duas linhas em vez de passar da tela a 360 px. */}
          <a href={buildWhatsAppLink(mensagem)} className="btn btn-primary min-h-14 px-9 text-base whitespace-normal text-balance">
            {botao} <span className="seta" aria-hidden>→</span>
          </a>
        </span>
      </div>
    </section>
  );
}
