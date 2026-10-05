"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiInstagram } from "react-icons/si";
import SectionMarker from "@/components/SectionMarker";
import { INSTAGRAM, INSTAGRAM_LINK, sectionMarkers } from "@/data/content";
import { movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// A cor do logo é a da marca, como nos logos das Ferramentas.
const COR_INSTAGRAM = "#FF0069";

// Bloco do Instagram no Sobre. O endereço em tipografia gigante atravessa a
// tela conforme a página rola (só transform, em scrub), e os dois pontos dele
// são o ponto da marca: caem e pousam na linha de base quando a faixa entra.
// Sem JS ou com movimento reduzido, o endereço fica parado e cabe na largura.
export default function Instagram() {
  const faixaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const faixa = faixaRef.current;
    const nome = faixa?.querySelector<HTMLElement>(".insta-nome");
    if (!faixa || !nome || !movimentoLiberado()) return;
    const pontos = gsap.utils.toArray<HTMLElement>(".insta-ponto", faixa);

    // Largura útil da faixa: sem o recuo que alinha com o .wrap.
    const cabe = () => {
      const cs = getComputedStyle(faixa);
      return faixa.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    };

    const ctx = gsap.context(() => {
      // Começa com o início à mostra e termina com o fim encostado na direita.
      gsap.fromTo(
        nome,
        { x: 0 },
        {
          x: () => Math.min(0, cabe() - nome.offsetWidth),
          ease: "none",
          scrollTrigger: { trigger: faixa, start: "top bottom", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
        }
      );

      // Queda do ponto (power2.in, a curva das quedas do ponto no site), um
      // depois do outro.
      const queda = gsap.timeline({ scrollTrigger: { trigger: faixa, start: "top 75%", once: true } });
      pontos.forEach((ponto, i) => {
        queda
          .fromTo(ponto, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, i * 0.18)
          .fromTo(ponto, { y: () => -nome.offsetHeight }, { y: 0, duration: 0.6, ease: "power2.in" }, i * 0.18);
      });
    }, faixa);

    return () => ctx.revert();
  }, []);

  const partes = INSTAGRAM.usuario.split(".");

  return (
    <section id="instagram" className="section pt-0">
      <div className="wrap">
        <div data-entra="linha" className="regua-topo pt-[clamp(56px,8vw,112px)]">
          <SectionMarker label={INSTAGRAM.marcador} number={sectionMarkers.instagram} />
          <h2 data-entra="titulo" className="max-w-3xl text-[clamp(32px,4.2vw,52px)]">
            {INSTAGRAM.titulo}
          </h2>
        </div>
      </div>

      {/* A faixa repete o botão de baixo: fica fora do teclado e do leitor de tela. */}
      <a
        ref={faixaRef}
        href={INSTAGRAM_LINK}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="insta-faixa mt-14"
      >
        <span className="insta-nome">
          <SiInstagram className="insta-logo" color={COR_INSTAGRAM} />
          {partes.map((parte, i) => (
            <Fragment key={parte}>
              {i > 0 && <span className="insta-ponto" />}
              {parte}
            </Fragment>
          ))}
        </span>
      </a>

      <div className="wrap">
        <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-12">
          <SiInstagram size={18} color={COR_INSTAGRAM} aria-hidden="true" />
          {INSTAGRAM.botao} <span className="seta" aria-hidden>↗</span>
        </a>
      </div>
    </section>
  );
}
