"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DUR, EASE, MQ, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Padrões de entrada do site inteiro, um disparo cada (once):
//   data-entra="titulo"   título sobe pela própria linha de base (máscara da linha)
//   data-entra="linha"    régua (.regua/.regua-topo) se desenha da esquerda
//   data-entra="imagem"   a moldura aparece e a imagem assenta dentro dela
//   data-entra="marcador" parênteses se abrem e o número sobe pela linha dele
// Texto corrido não anima. Os estados iniciais ficam no CSS (globals.css).
export default function MotionRoot() {
  const pathname = usePathname();
  const fixoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    window.__nadaMotion = true;
    if (!movimentoLiberado()) return;

    const ctx = gsap.context(() => {
      marcadorPersistente(fixoRef.current);

      gsap.utils.toArray<HTMLElement>('[data-entra="titulo"]').forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            el.classList.add("is-split");
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: DUR.entrada,
              ease: EASE,
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          },
        });
      });

      ScrollTrigger.batch('[data-entra="linha"], [data-entra="imagem"]', {
        start: "top 92%",
        once: true,
        onEnter: (lote) =>
          (lote as HTMLElement[]).forEach((el, i) => {
            el.style.setProperty("--atraso", `${i * 70}ms`);
            el.classList.add("is-in");
          }),
      });

      // O marcador só abre quando já está na zona de leitura. Disparando na
      // borda de baixo da tela, a abertura acabava antes de alguém olhar.
      ScrollTrigger.batch('[data-entra="marcador"]', {
        start: "top 80%",
        once: true,
        onEnter: (lote) =>
          (lote as HTMLElement[]).forEach((el) => {
            el.classList.add("is-in");
            abrirMarcador(el);
          }),
      });
    });

    return () => ctx.revert();
  }, [pathname]);

  // Página mudou de altura (acordeão, imagem, fonte): os gatilhos abaixo
  // recalculam a posição. Debounce curto; só quando a altura muda de fato.
  useEffect(() => {
    let altura = document.body.scrollHeight;
    let espera = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(espera);
      espera = window.setTimeout(() => {
        if (document.body.scrollHeight === altura) return;
        altura = document.body.scrollHeight;
        ScrollTrigger.refresh();
      }, 150);
    });
    ro.observe(document.body);
    return () => {
      clearTimeout(espera);
      ro.disconnect();
    };
  }, []);

  return (
    <span ref={fixoRef} aria-hidden className="marcador-fixo">
      <span className="marcador-fixo-num" />
    </span>
  );
}

// Desktop largo: o número da seção atual fica na margem esquerda e troca com
// rolagem de dígito, como folhear um impresso. Fora de seção marcada (topo,
// rodapé), some. A visibilidade é só da classe; o GSAP mexe só na posição.
function marcadorPersistente(fixo: HTMLSpanElement | null) {
  const num = fixo?.firstElementChild as HTMLElement | null;
  if (!fixo || !num || !matchMedia(MQ.margem).matches) return;
  fixo.classList.remove("is-on"); // página nova: começa escondido
  const ativos = new Set<string>();
  let atual = "";
  const mostrar = () => {
    const proximo = [...ativos].sort().at(-1) ?? "";
    fixo.classList.toggle("is-on", Boolean(proximo));
    if (!proximo || proximo === atual) return;
    const descendo = proximo > atual;
    atual = proximo;
    num.textContent = proximo;
    gsap.fromTo(
      num,
      { yPercent: descendo ? 100 : -100 },
      { yPercent: 0, duration: 0.45, ease: EASE, overwrite: true }
    );
  };
  gsap.utils.toArray<HTMLElement>('[data-entra="marcador"]').forEach((marcador) => {
    const secao = marcador.closest("section");
    const n = marcador.querySelector<HTMLElement>(".marcador-num")?.dataset.num;
    if (!secao || !n) return;
    ScrollTrigger.create({
      trigger: secao,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => {
        if (self.isActive) ativos.add(n);
        else ativos.delete(n);
        mostrar();
      },
    });
  });
}

// Os parênteses se afastam devagar o bastante pra serem vistos e o número
// entra em seguida, subindo por dentro da própria linha (o gesto do número
// da margem e do menu). A curva é a única fora do vocabulário do site: com
// expo.inOut o afastamento inteiro acontecia em 0,3 s no meio da duração.
function abrirMarcador(el: HTMLElement) {
  const nome = el.querySelector(".marcador-nome");
  const num = el.querySelector(".marcador-num > span");
  const tl = gsap.timeline();
  if (nome) {
    tl.fromTo(nome, { width: 0 }, { width: "auto", duration: 1.1, ease: "power2.inOut", clearProps: "width" }, 0.1);
  }
  if (num) {
    tl.fromTo(num, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: EASE, clearProps: "transform" }, nome ? 0.85 : 0.1);
  }
}
