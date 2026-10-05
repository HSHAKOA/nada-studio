import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineSegments,
  Mesh,
  PlaneGeometry,
  Points,
  ShaderMaterial,
  Vector2,
  type IUniform,
} from "three";
import { BURACO_NEGRO as B } from "./config";
import { DISCO_FRAG, DISCO_VERT, HALO_FRAG, HORIZONTE_FRAG, NUCLEO_VERT, POEIRA_FRAG, POEIRA_VERT } from "./shaders";

export type Uniformes = Record<string, IUniform>;

// Ordem de desenho. Não há buffer de profundidade: quem decide o que a sombra
// engole é o shader, então o que vem por cima é desenhado depois.
const ORDEM = { halo: 0, horizonte: 1, secundaria: 2, primaria: 3, poeira: 4 } as const;

// Aglomerados: quantos centros, quão espalhado cada um nasce no raio (fração)
// e no ângulo (rad). O giro diferencial depois os estica em arcos.
const AGLOMERADO = { centros: 48, raio: 0.05, arco: 0.3 } as const;

// Sorteio com semente fixa (mulberry32): a composição é a mesma em toda visita.
function sorteio(semente: number) {
  let s = semente;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(aleatorio: () => number) {
  return Math.sqrt(-2 * Math.log(1 - aleatorio())) * Math.cos(2 * Math.PI * aleatorio());
}

function material(vertexShader: string, fragmentShader: string, uniforms: Uniformes) {
  return new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthTest: false, depthWrite: false });
}

type Anel = { raioInterno: number; raioExterno: number; espessura: number; aglomerados: number };

// Uma órbita por elemento (raio, fase, altura), mais densa perto do buraco.
function orbitas(n: number, anel: Anel, concentracao: number, aleatorio: () => number) {
  const { raioInterno, raioExterno, espessura, aglomerados } = anel;
  const sorteiaRaio = () => raioInterno + (raioExterno - raioInterno) * aleatorio() ** concentracao;
  const centros = Array.from({ length: AGLOMERADO.centros }, () => [sorteiaRaio(), aleatorio() * Math.PI * 2]);
  const saida = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let raio = sorteiaRaio();
    let fase = aleatorio() * Math.PI * 2;
    if (aleatorio() < aglomerados) {
      const [r0, f0] = centros[Math.floor(aleatorio() * centros.length)];
      raio = r0 * (1 + gauss(aleatorio) * AGLOMERADO.raio);
      fase = f0 + gauss(aleatorio) * AGLOMERADO.arco;
    }
    raio = Math.min(Math.max(raio, raioInterno), raioExterno);
    saida.set([raio, fase, gauss(aleatorio) * espessura * raio], i * 3);
  }
  return saida;
}

// Disco: cada órbita vira um traço de `segmentos` pedaços. As duas imagens
// (a direta e a que dá a volta no buraco) dividem a mesma geometria.
export function criarDisco(comuns: Uniformes, quantidade: number) {
  const { segmentos, faixas } = B.disco;
  const porTraco = segmentos + 1;
  const vertices = quantidade * porTraco;
  const aleatorio = sorteio(7);
  const orbita = orbitas(quantidade, B.disco, 1.7, aleatorio);
  const posicao = new Float32Array(vertices * 3);
  const traco = new Float32Array(vertices * 3);
  const indice = vertices > 65535 ? new Uint32Array(quantidade * segmentos * 2) : new Uint16Array(quantidade * segmentos * 2);

  for (let i = 0; i < quantidade; i++) {
    const raio = orbita[i * 3];
    // Faixas concêntricas: anéis mais e menos densos, como prata escovada.
    const faixa = 0.4 + 0.6 * Math.sin(raio * faixas + Math.sin(raio * 1.9) * 2.4) ** 2;
    const tinta = (0.2 + 0.8 * aleatorio() ** 1.5) * faixa;
    const semente = aleatorio();
    for (let j = 0; j < porTraco; j++) {
      const v = i * porTraco + j;
      posicao.set(orbita.subarray(i * 3, i * 3 + 3), v * 3);
      traco.set([j / segmentos, tinta, semente], v * 3);
      if (j < segmentos) indice.set([v, v + 1], (i * segmentos + j) * 2);
    }
  }

  const geometria = new BufferGeometry();
  geometria.setAttribute("position", new BufferAttribute(posicao, 3));
  geometria.setAttribute("aTraco", new BufferAttribute(traco, 3));
  geometria.setIndex(new BufferAttribute(indice, 1));

  const proprios: Uniformes = {
    ...comuns,
    uExposicao: { value: B.disco.exposicao },
    uBrilho: { value: B.disco.brilho },
    uEspiral: { value: B.disco.espiral },
    uSecundaria: { value: B.disco.secundaria },
    uSobreSombra: { value: B.disco.sobreSombra },
    uCalor: { value: B.cor.calor },
    uQuente: { value: new Color(B.cor.quente) },
    uRaios: { value: new Vector2(B.disco.raioInterno, B.disco.raioExterno) },
  };
  const imagem = (sinal: 1 | -1, ordem: number) => {
    const linhas = new LineSegments(geometria, material(DISCO_VERT, DISCO_FRAG, { ...proprios, uImagem: { value: sinal } }));
    linhas.renderOrder = ordem;
    linhas.frustumCulled = false; // a posição é calculada no shader
    return linhas;
  };
  return { primaria: imagem(1, ORDEM.primaria), secundaria: imagem(-1, ORDEM.secundaria) };
}

export function criarPoeira(comuns: Uniformes, quantidade: number) {
  const aleatorio = sorteio(23);
  const [menor, maior] = B.poeira.tamanho;
  const grao = new Float32Array(quantidade * 3);
  for (let i = 0; i < quantidade; i++) {
    grao.set([menor + (maior - menor) * aleatorio() ** 3, 0.3 + 0.7 * aleatorio(), aleatorio()], i * 3);
  }

  const geometria = new BufferGeometry();
  geometria.setAttribute("position", new BufferAttribute(orbitas(quantidade, B.poeira, 1.5, aleatorio), 3));
  geometria.setAttribute("aGrao", new BufferAttribute(grao, 3));

  const pontos = new Points(
    geometria,
    material(POEIRA_VERT, POEIRA_FRAG, {
      ...comuns,
      uBrilho: { value: B.poeira.brilho },
      uRaios: { value: new Vector2(B.poeira.raioInterno, B.poeira.raioExterno) },
    })
  );
  pontos.renderOrder = ORDEM.poeira;
  pontos.frustumCulled = false;
  return pontos;
}

// Quadro de frente pra câmera, no plano do buraco, com `alcance` raios de lado.
function nucleo(alcance: number, fragmentShader: string, uniforms: Uniformes, ordem: number) {
  const quadro = new Mesh(new PlaneGeometry(alcance * 2, alcance * 2), material(NUCLEO_VERT, fragmentShader, uniforms));
  quadro.renderOrder = ordem;
  return quadro;
}

export function criarHorizonte(comuns: Uniformes) {
  const { anel, espessura, brilho } = B.horizonte;
  return nucleo(
    anel + 0.1,
    HORIZONTE_FRAG,
    { ...comuns, uAnel: { value: anel }, uEspessura: { value: espessura }, uBrilhoAnel: { value: brilho } },
    ORDEM.horizonte
  );
}

export function criarHalo(comuns: Uniformes) {
  const { forca, alcance } = B.halo;
  return nucleo(
    1 + alcance + 0.1,
    HALO_FRAG,
    { ...comuns, uForca: { value: forca }, uAlcance: { value: alcance }, uAnel: { value: B.horizonte.anel } },
    ORDEM.halo
  );
}
