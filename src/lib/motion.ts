import { useSyncExternalStore } from "react";

// Configuração única de movimento. Toda animação só roda com a classe `motion`
// no <html>, posta no <head> por layout.tsx quando o sistema não pede
// movimento reduzido. Sem ela, o conteúdo aparece parado e completo.

// menu: a partir daqui o cabeçalho mostra o menu completo (--breakpoint-menu).
export const BP = { md: 768, lg: 1024, menu: 1180 } as const;

export const MQ = {
  mobile: `(max-width: ${BP.md - 1}px)`,
  tablet: `(min-width: ${BP.md}px)`,
  desktop: `(min-width: ${BP.lg}px)`,
  // Menu completo no cabeçalho (o do celular some, menu:hidden).
  menu: `(min-width: ${BP.menu}px)`,
  // Mouse de verdade (inércia da roda, ímã, prévia que segue o ponteiro).
  mouse: "(hover: hover) and (pointer: fine)",
  // Efeito que segue o cursor só com mouse de verdade e tela larga.
  ponteiroFino: `(min-width: ${BP.lg}px) and (hover: hover) and (pointer: fine)`,
  // Só existe margem livre pro marcador persistente a partir daqui.
  margem: "(min-width: 1360px)",
  // Prévia do índice flutuando junto do cursor (igual ao CSS de .indice-previa).
  flutuante: `(min-width: ${BP.lg}px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`,
} as const;

// Vocabulário de movimento. O mesmo do CSS (globals.css, :root):
//   entrada      expo.out    ≈ --ease-out   coisa chegando e assentando
//   saida        power3.in   ≈ --ease-in    sai um pouco mais rápido do que entrou
//   transforma   expo.inOut  ≈ --ease-inout um estado virando outro (intro, círculos)
//   narrativa    "none" com scrub: quem dita o ritmo é a rolagem
export const EASE = "expo.out";
export const EASE_SAIDA = "power3.in";
export const EASE_TRANSFORMA = "expo.inOut";

// Durações em segundos. UI responde em até 0,28 s; entradas levam ~0,9 s.
export const DUR = { ui: 0.2, movimento: 0.28, entrada: 0.9, saida: 0.5 } as const;

export function movimentoLiberado() {
  return document.documentElement.classList.contains("motion");
}

export function useMedia(query: string) {
  return useSyncExternalStore(
    (avisar) => {
      const mq = matchMedia(query);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => matchMedia(query).matches,
    () => false
  );
}
