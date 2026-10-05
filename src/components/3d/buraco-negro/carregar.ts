// O que as duas cenas do buraco negro (manifesto do Sobre e o viajante da
// página Motion) fazem antes de baixar o three.

// Contexto pedido antes de baixar o three. Sem WebGL 2, ou só com renderização
// por software, nada é baixado e a página fica sem a cena, como antes.
export const CONTEXTO: WebGLContextAttributes = {
  alpha: true,
  antialias: true,
  depth: false,
  stencil: false,
  premultipliedAlpha: true,
  powerPreference: "low-power",
  failIfMajorPerformanceCaveat: true,
};

// O three é o maior arquivo do site: espera a página carregar e o navegador
// ficar livre, pra não disputar banda e CPU com a primeira pintura.
export function quandoLivre() {
  return new Promise<void>((pronto) => {
    const seguir = () =>
      "requestIdleCallback" in window ? requestIdleCallback(() => pronto(), { timeout: 1500 }) : setTimeout(pronto, 200);
    if (document.readyState === "complete") seguir();
    else window.addEventListener("load", seguir, { once: true });
  });
}

// Economia de dados ligada: a cena não é baixada.
export function economiaDeDados() {
  return Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
}
