"use client";

import { useEffect, useRef } from "react";
import { movimentoLiberado } from "@/lib/motion";

// Troca de letras no hover (ou foco de teclado) do link em volta: cada letra
// sobe e a cópia entra por baixo, uma depois da outra, da esquerda pra
// direita. A animação é CSS (.troca em globals.css): translate roda no
// compositor, então não depende da thread principal nem obriga o navegador a
// refazer o desfoque do cabeçalho a cada quadro. Toca uma vez por entrada;
// sair no meio deixa terminar. A caixa é a do .rolo, então a altura do
// cabeçalho não muda. O leitor de tela lê o rótulo inteiro.
export default function TrocaDeLetras({ label, className = "" }: { label: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const alvo = el.closest<HTMLElement>("a, button") ?? el;
    const ultima = el.querySelector(".troca-letra:last-child");

    const tocar = () => {
      if (movimentoLiberado()) el.classList.add("tocando");
    };
    // A cópia é igual à letra: voltar todas pro lugar no fim não aparece.
    const terminar = (e: AnimationEvent) => {
      if (e.target === ultima) el.classList.remove("tocando");
    };
    // Toque não tem hover: no celular o link só navega.
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "touch") tocar();
    };
    // Clique de mouse também dá foco; só o foco de teclado toca.
    const onFocus = () => {
      if (alvo.matches(":focus-visible")) tocar();
    };

    alvo.addEventListener("pointerenter", onPointer);
    alvo.addEventListener("focus", onFocus);
    el.addEventListener("animationend", terminar);
    return () => {
      alvo.removeEventListener("pointerenter", onPointer);
      alvo.removeEventListener("focus", onFocus);
      el.removeEventListener("animationend", terminar);
      el.classList.remove("tocando");
    };
  }, []);

  return (
    <span ref={ref} className={`troca ${className}`.trim()}>
      <span className="sr-only">{label}</span>
      <span aria-hidden>
        {Array.from(label).map((letra, i) => (
          <span key={i} className="troca-letra" data-letra={letra} style={{ "--i": i } as React.CSSProperties}>
            {letra}
          </span>
        ))}
      </span>
    </span>
  );
}
