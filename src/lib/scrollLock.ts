import type Lenis from "lenis";

// Trava única do scroll da página, usada por intro, menu mobile e modal.
// `overflow: hidden` sozinho não basta: o Lenis rola a janela por código e
// ignora o overflow, então a roda do mouse continuava descendo a página por
// trás de um overlay. Com o Lenis ativo, quem trava é o `lenis.stop()`.
// Contador em vez de booleano: dois overlays abertos não se destravam um ao outro.

let lenis: Lenis | null = null;
let travas = 0;

function aplicar() {
  const travado = travas > 0;
  if (lenis) {
    if (travado) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = travado ? "hidden" : "";
}

export function registrarLenis(instancia: Lenis | null) {
  lenis = instancia;
  aplicar();
}

export function travarScroll() {
  travas += 1;
  aplicar();

  let liberada = false;
  return function destravar() {
    if (liberada) return;
    liberada = true;
    travas = Math.max(0, travas - 1);
    aplicar();
  };
}
