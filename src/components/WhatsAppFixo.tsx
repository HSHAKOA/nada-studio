"use client";

import { useEffect, useRef } from "react";
import { buildWhatsAppLink } from "@/data/content";
import { BP } from "@/lib/motion";

// Botão fixo de WhatsApp abaixo de 1180 px (onde o cabeçalho não mostra o
// botão). Aparece depois da primeira tela, inverte a cor sobre fundo escuro e
// some quando a chamada final ou o rodapé entram (não duplica a ação nem
// cobre conteúdo). Escondido, sai também do teclado e do leitor de tela.
export default function WhatsAppFixo({ mensagem }: { mensagem: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const botao = ref.current;
    if (!botao || !matchMedia(`(max-width: ${BP.menu - 1}px)`).matches) return;

    let passouTopo = false;
    const fins = new Set<Element>();
    const escuros = new Set<Element>();
    const atualizar = () => {
      const visivel = passouTopo && fins.size === 0;
      botao.toggleAttribute("data-visivel", visivel);
      botao.inert = !visivel;
      botao.toggleAttribute("data-claro", escuros.size > 0);
    };
    const marcar = (conjunto: Set<Element>) => (entradas: IntersectionObserverEntry[]) => {
      entradas.forEach((e) => (e.isIntersecting ? conjunto.add(e.target) : conjunto.delete(e.target)));
      atualizar();
    };

    const aoRolar = () => {
      const passou = window.scrollY > window.innerHeight * 0.7;
      if (passou === passouTopo) return;
      passouTopo = passou;
      atualizar();
    };
    const ioFim = new IntersectionObserver(marcar(fins));
    // Só a faixa da base da tela, onde o botão fica.
    const ioEscuro = new IntersectionObserver(marcar(escuros), { rootMargin: "-90% 0px 0px 0px" });

    document.querySelectorAll("#comecar, footer").forEach((el) => ioFim.observe(el));
    // Só fundo escuro do conteúdo: o overlay do menu (invisível, mas sempre na
    // tela) contaria como escuro o tempo todo.
    document.querySelectorAll("main .section-invert, main [data-escuro]").forEach((el) => ioEscuro.observe(el));
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();
    atualizar();

    return () => {
      window.removeEventListener("scroll", aoRolar);
      ioFim.disconnect();
      ioEscuro.disconnect();
    };
  }, []);

  return (
    <a
      ref={ref}
      href={buildWhatsAppLink(mensagem)}
      inert
      className="btn btn-primary pointer-events-none fixed inset-x-4 bottom-4 z-30 translate-y-24 opacity-0 transition-[translate,opacity] duration-300 ease-[var(--ease-out)] data-visivel:pointer-events-auto data-visivel:translate-y-0 data-visivel:opacity-100 data-claro:[--btn-bg:#fff] data-claro:[--btn-borda:#fff] data-claro:[--btn-fg:#000] md:left-auto md:right-6 md:bottom-6 menu:hidden"
    >
      Falar no WhatsApp
    </a>
  );
}
