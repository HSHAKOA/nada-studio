"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisAtual, registrarLenis, travarScroll } from "@/lib/scrollLock";
import { MQ } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const CHAVE = "nada-y:";

function guardar(caminho: string, y: number) {
  try {
    sessionStorage.setItem(CHAVE + caminho, String(Math.round(y)));
  } catch {}
}

function lido(caminho: string) {
  try {
    const v = sessionStorage.getItem(CHAVE + caminho);
    return v === null ? null : Number(v);
  } catch {
    return null;
  }
}

function irPara(alvo: number | HTMLElement) {
  const lenis = lenisAtual();
  if (lenis) {
    // Inércia em voo (clique com a página ainda deslizando): quando o destino
    // já é o alvo interno do Lenis, o scrollTo dele retorna sem parar a
    // animação, e ela leva a página nova de volta pra posição da antiga.
    // Parar e religar encerra a animação. Travado (menu, intro), já está parado.
    if (!lenis.isStopped) {
      lenis.stop();
      lenis.start();
    }
    // O Lenis guarda a altura da página anterior até o próximo resize dele;
    // sem remedir, o destino é cortado no limite velho.
    lenis.resize();
    lenis.scrollTo(alvo, { immediate: true, force: true });
    return;
  }
  const y = typeof alvo === "number" ? alvo : alvo.getBoundingClientRect().top + scrollY;
  window.scrollTo({ top: y, behavior: "instant" });
}

// Espera a página nova montar os gatilhos (os efeitos dos componentes rodam
// depois deste) e recalcula todos antes de medir onde fica o destino.
function depoisDoLayout(fn: () => void) {
  let segundo = 0;
  const primeiro = requestAnimationFrame(() => {
    segundo = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      fn();
    });
  });
  return () => {
    cancelAnimationFrame(primeiro);
    cancelAnimationFrame(segundo);
  };
}

// Rolagem do site inteiro:
// - Lenis (inércia) só com mouse de verdade; no toque a rolagem é a nativa.
// - Voltar/avançar e recarregar devolvem a posição de cada página. A
//   restauração do navegador fica desligada porque a troca de página do App
//   Router acontece depois dela (e dentro da View Transition): ele rolaria a
//   página velha, não a nova.
// - Âncoras (#secao) caem no lugar certo na própria página, vindo de outra ou
//   abrindo o link direto.
export default function SmoothScroll() {
  const pathname = usePathname();
  const voltando = useRef(false);
  const primeira = useRef(true);
  const caminho = useRef<string | null>(null);
  // Voltar/avançar com a página ainda deslizando (toque): a inércia nativa
  // continua por cima da troca de página e leva junto a posição restaurada
  // (até 1.700 px de erro medido). Travar o scroll no popstate corta a
  // inércia na hora; a trava sai quando a página nova já está no lugar. Com o
  // Lenis (mouse), quem para a inércia é o irPara.
  const soltarVolta = useRef<(() => void) | null>(null);

  useEffect(() => {
    history.scrollRestoration = "manual";

    // A posição é anotada com a página de onde ela veio: quando o evento de
    // voltar chega, a URL já é a da página de destino.
    let espera = 0;
    let pendente: [string, number] | null = null;
    const gravar = () => {
      clearTimeout(espera);
      if (pendente) guardar(...pendente);
      pendente = null;
    };
    const aoRolar = () => {
      // Restaurando: quem rola é a inércia da página velha (já com a URL da
      // nova) ou o próprio irPara, não a pessoa. Gravar aqui estragava a
      // posição guardada da página de destino.
      if (soltarVolta.current) return;
      pendente = [location.pathname, scrollY];
      clearTimeout(espera);
      espera = window.setTimeout(gravar, 120);
    };
    window.addEventListener("scroll", aoRolar, { passive: true });

    const aoVoltar = () => {
      gravar();
      voltando.current = true;
      // Só quando a página muda (o efeito de baixo é quem solta); voltar
      // entre âncoras da mesma página não passa por ele.
      if (lenisAtual() || soltarVolta.current || location.pathname === caminho.current) return;
      const destravar = travarScroll();
      const inicio = performance.now();
      // Rede de segurança: a trava nunca passa disso.
      const seguranca = window.setTimeout(() => soltarVolta.current?.(), 1500);
      soltarVolta.current = () => {
        clearTimeout(seguranca);
        soltarVolta.current = null;
        // A trava descarta os passos da inércia, mas não a encerra: solta
        // cedo, o resto dela ainda empurrava a página restaurada ~20 px.
        // Segura até ela morrer (400 ms desde o voltar).
        window.setTimeout(destravar, Math.max(0, 400 - (performance.now() - inicio)));
      };
    };
    window.addEventListener("popstate", aoVoltar);
    const aoSair = () => {
      gravar();
      guardar(location.pathname, scrollY);
    };
    window.addEventListener("pagehide", aoSair);

    // Link para a própria página, tratado aqui, antes do <Link> do Next (ele
    // vê o preventDefault e não navega; o onClick de quem chamou, como o
    // fechar do menu, continua rodando):
    // - com âncora: rola até a seção (o Next rolaria por fora do Lenis);
    // - sem âncora (o logotipo na home, "Portfólio" no portfólio): volta ao
    //   topo. Sem isso o clique não fazia nada.
    function aoClicar(e: MouseEvent) {
      gravar();
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
      const alvo = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
      if (url.hash && !alvo) return;
      e.preventDefault();
      const suave = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lenis = lenisAtual();
      if (lenis) lenis.scrollTo(alvo ?? 0, { duration: 1.2 });
      else if (alvo) alvo.scrollIntoView({ behavior: suave ? "smooth" : "instant" });
      else window.scrollTo({ top: 0, behavior: suave ? "smooth" : "instant" });
      if (url.hash) history.replaceState(history.state, "", url.hash);
    }
    window.addEventListener("click", aoClicar, true);

    const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (!reduzido && matchMedia(MQ.mouse).matches) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
      });
      registrarLenis(lenis);
      // Um laço só: o Lenis anda no ticker do GSAP e avisa o ScrollTrigger,
      // senão as cenas com scrub atrasam um quadro em relação ao scroll.
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      clearTimeout(espera);
      soltarVolta.current?.();
      window.removeEventListener("popstate", aoVoltar);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("pagehide", aoSair);
      window.removeEventListener("click", aoClicar, true);
      if (tick) gsap.ticker.remove(tick);
      registrarLenis(null);
      lenis?.destroy();
    };
  }, []);

  // A cada página: decide pra onde a rolagem vai.
  useEffect(() => {
    const inicial = primeira.current;
    primeira.current = false;
    const voltou = voltando.current;
    voltando.current = false;
    caminho.current = pathname;
    // Solta a trava do voltar (se houver) depois que a posição foi aplicada.
    const soltar = () => soltarVolta.current?.();
    const depois = (alvo: number | HTMLElement) => {
      const cancelar = depoisDoLayout(() => {
        irPara(alvo);
        soltar();
      });
      return () => {
        cancelar();
        soltar();
      };
    };

    // A intro vai tocar: a página fica no topo, travada por ela.
    if (pathname === "/" && document.documentElement.dataset.intro === "tocar") {
      if (inicial) irPara(0);
      soltar();
      return;
    }

    const hash = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    const tipo = inicial
      ? (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type
      : undefined;
    const restaurar = voltou || tipo === "reload" || tipo === "back_forward";

    if (hash) return depois(hash);
    if (restaurar) {
      const y = lido(pathname);
      if (y !== null) return depois(y);
    }
    // Navegação nova (clique em link, logotipo de outra página) e carregamento
    // inicial: começa no topo. O Next tenta isso sozinho, mas com o Lenis no
    // meio de uma inércia a página podia continuar onde a anterior estava.
    irPara(0);
    soltar();
  }, [pathname]);

  return null;
}
