// A luz que atravessa um título preto uma vez (classe .luz em globals.css).
// Usada na chegada do título rotativo (home, IA para empresas) e no fim da
// digitação do título da página Motion.

// Velocidade (em/s) e largura da faixa (em), no corpo do texto. A largura é a
// mesma do background-size de .luz.
export const LUZ = { velocidade: 18, faixa: 1.5 };

type Opcoes = {
  // Quando a faixa começa a andar (ms).
  atrasoMs?: number;
  // Elemento com .metal não recebe a faixa: o brilho dele é outro. Recebe a
  // hora em que a faixa chega nele.
  noCromo?: (metal: HTMLElement, chegaMs: number) => void;
};

// A faixa atravessa os elementos na ordem de leitura, em velocidade
// constante: cada linha emenda no fim da anterior, então ela parece uma só,
// passando de palavra em palavra. A classe .luz só existe durante a passada.
// Devolve a limpeza.
export function passarLuz(elementos: HTMLElement[], { atrasoMs = 0, noCromo }: Opcoes = {}) {
  if (elementos.length === 0) return () => {};
  const corpo = parseFloat(getComputedStyle(elementos[0]).fontSize);
  const v = (LUZ.velocidade * corpo) / 1000; // px por ms
  const faixa = LUZ.faixa * corpo;
  let base = 0;
  let topo = Number.NaN;
  let esquerda = 0;
  let direita = 0;
  const animacoes: { el: HTMLElement; a: Animation }[] = [];

  for (const el of elementos) {
    // Só o eixo x importa (o texto pode estar subindo pela linha de base); a
    // linha nova é reconhecida pela altura.
    const r = el.getBoundingClientRect();
    if (!(Math.abs(r.top - topo) < r.height / 2)) {
      if (!Number.isNaN(topo)) base += direita - esquerda + faixa;
      topo = r.top;
      esquerda = r.left;
    }
    direita = r.right;
    const chega = atrasoMs + (base + r.left - esquerda) / v;

    if (el.classList.contains("metal")) {
      noCromo?.(el, chega);
      continue;
    }
    el.classList.add("luz");
    const a = el.animate(
      [{ backgroundPosition: `${-faixa}px 0` }, { backgroundPosition: `${r.width}px 0` }],
      { duration: (r.width + faixa) / v, delay: chega, fill: "both" }
    );
    a.onfinish = () => {
      el.classList.remove("luz");
      a.cancel();
    };
    animacoes.push({ el, a });
  }

  return () =>
    animacoes.forEach(({ el, a }) => {
      a.cancel();
      el.classList.remove("luz");
    });
}
