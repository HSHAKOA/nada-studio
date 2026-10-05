import { BURACO_NEGRO as B } from "./config";

// Onde o buraco está na tela agora: centro e raio da sombra, em px.
export type Origem = { x: number; y: number; raio: number };

export type Explosao = {
  atualizar: (p: number) => void;
  destruir: () => void;
};

// Sorteio com semente fixa (mulberry32, o mesmo da cena): a explosão é a
// mesma em toda visita.
function sorteio(semente: number) {
  let s = semente;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const limitar = (v: number) => Math.min(1, Math.max(0, v));
export const suave = (a: number, b: number, v: number) => {
  const t = limitar((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Grao = { raio: number; angulo: number; forca: number; sobe: number; pouso: number };

// Tons de cinza dos traços (alfa em degraus) e o rastro de cada um, em fração
// do caminho do grão.
const TONS = 5;
const RASTRO = 0.012;

// O disco é visto quase de lado e girado no plano da tela (como na cena).
const ACHATA = Math.sin(B.inclinacao + B.scroll.inclinacao);
const COS = Math.cos(B.rolagem);
const SEN = Math.sin(B.rolagem);

// Onde o grão está no caminho (e de 0 a 1): sai do anel inclinado da poeira,
// abre pra fora do centro e pra cima (a explosão) e desce em arco até o ponto
// dele no fio.
function posicao(g: Grao, e: number, o: Origem, f: DOMRect): [number, number] {
  const ax = Math.cos(g.angulo) * g.raio * o.raio;
  const ay = Math.sin(g.angulo) * g.raio * o.raio * ACHATA;
  const x0 = o.x + ax * COS - ay * SEN;
  const y0 = o.y + ax * SEN + ay * COS;
  const dx = x0 - o.x;
  const dy = y0 - o.y;
  const d = Math.hypot(dx, dy) || 1;
  const xc = x0 + (dx / d) * o.raio * 2.2 * g.forca;
  const yc = y0 + (dy / d) * o.raio * 2.2 * g.forca - o.raio * g.sobe;
  const x1 = f.left + g.pouso * f.width;
  const y1 = f.top;
  const u = 1 - e;
  return [u * u * x0 + 2 * u * e * xc + e * e * x1, u * u * y0 + 2 * u * e * yc + e * e * y1];
}

// A poeira do buraco negro explode e desce até virar o fio que abre o bloco
// seguinte. Os grãos saem do mesmo anel inclinado da poeira do WebGL (que some
// ao mesmo tempo), abrem pra fora e pra cima e descem em arco até pousar
// alinhados no fio, que então aparece no lugar deles. Tudo é função do
// progresso `p` (o scroll): rolando de volta, eles voltam pro buraco.
// Canvas 2D fixo por cima da página, visível só durante a passagem.
export function criarExplosao(origem: () => Origem, fio: HTMLElement, quantidade: number): Explosao {
  const canvas = document.createElement("canvas");
  canvas.className = "explosao";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");

  const sorteia = sorteio(31);
  // Até 5 raios: é até onde a poeira aparece (a borda dela some depois disso).
  const graos = Array.from({ length: quantidade }, () => ({
    raio: B.poeira.raioInterno + (5 - B.poeira.raioInterno) * sorteia() ** 1.5,
    angulo: sorteia() * Math.PI * 2,
    forca: 1 + sorteia() * 1.5, // quanto abre pra fora
    sobe: 0.4 + sorteia() * 1.1, // quanto sobe antes de cair (em raios)
    pouso: sorteia(), // onde pousa no fio: 0 na ponta esquerda, 1 na direita
    atraso: sorteia() * 0.3, // fração do progresso antes de sair
    tamanho: 1.2 + sorteia() * 1.8,
    alfa: 0.4 + sorteia() * 0.45,
  }));

  let dpr = 1;
  let largura = 0;
  let altura = 0;
  const medir = () => {
    dpr = Math.min(window.devicePixelRatio || 1, B.dpr);
    largura = window.innerWidth;
    altura = window.innerHeight;
    canvas.width = Math.round(largura * dpr);
    canvas.height = Math.round(altura * dpr);
  };
  medir();
  window.addEventListener("resize", medir);

  let visivel = false;

  function atualizar(p: number) {
    const mostrar = p > 0.001 && p < 0.999;
    if (mostrar !== visivel) {
      visivel = mostrar;
      canvas.style.visibility = mostrar ? "visible" : "hidden";
    }
    if (!mostrar || !ctx) return;

    const o = origem();
    const f = fio.getBoundingClientRect();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, largura, altura);
    ctx.strokeStyle = B.cor.tinta;
    ctx.lineCap = "round";
    // Os grãos aparecem enquanto a poeira do WebGL some, e somem enquanto o
    // fio de verdade aparece.
    const presenca = suave(0, 0.06, p) * (1 - suave(0.86, 1, p));

    // Cada grão é um traço curto do caminho dele (de um instante atrás até
    // agora): comprido na explosão, um ponto ao pousar. Os traços entram em
    // poucos caminhos (por tom e espessura), um stroke por caminho.
    const caminhos = Array.from({ length: TONS * 2 }, () => new Path2D());
    for (const g of graos) {
      const t = limitar((p - g.atraso) / 0.7);
      const e = 1 - (1 - t) ** 3; // sai rápido e pousa devagar
      const [x, y] = posicao(g, e, o, f);
      const [xa, ya] = posicao(g, 1 - (1 - limitar(t - RASTRO)) ** 3, o, f);
      // Perto do fio, o grão afina e clareia pra ficar com a cara dele.
      const tom = Math.round(g.alfa * presenca * (1 - 0.5 * e) * TONS);
      if (tom <= 0) continue;
      const grosso = g.tamanho * (1 - 0.5 * e) > 2.1 ? 1 : 0;
      const c = caminhos[(Math.min(tom, TONS) - 1) * 2 + grosso];
      c.moveTo(xa, ya);
      // Traço de comprimento zero não desenha: o pouso vira um ponto mínimo.
      c.lineTo(Math.hypot(x - xa, y - ya) < 0.5 ? x + 0.5 : x, y);
    }
    caminhos.forEach((c, i) => {
      ctx.globalAlpha = (Math.floor(i / 2) + 1) / TONS;
      ctx.lineWidth = i % 2 ? 2.6 : 1.5;
      ctx.stroke(c);
    });
    ctx.globalAlpha = 1;
  }

  return {
    atualizar,
    destruir() {
      window.removeEventListener("resize", medir);
      canvas.remove();
    },
  };
}
