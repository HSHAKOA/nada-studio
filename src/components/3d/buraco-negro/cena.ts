import { Color, Group, MathUtils, PerspectiveCamera, Scene, WebGLRenderer, type BufferGeometry } from "three";
import { BURACO_NEGRO as B, type Alvo, type EstadoCena } from "./config";
import { criarDisco, criarHalo, criarHorizonte, criarPoeira, type Uniformes } from "./camadas";

export type Cena = {
  redimensionar: (largura: number, altura: number, alvo: Alvo) => void;
  atualizar: (dt: number, estado: EstadoCena) => void;
  aliviar: () => boolean;
  destruir: () => void;
};

// Desenha só a primeira metade (os elementos foram sorteados em ordem
// aleatória, então metade é uma amostra uniforme). `passo`: índices por elemento.
function metade(geometria: BufferGeometry, passo: number) {
  const total = geometria.index ? geometria.index.count : geometria.getAttribute("position").count;
  geometria.setDrawRange(0, Math.floor(total / 2 / passo) * passo);
}

// Cores da cena: o padrão é tinta sobre papel (config.ts). O viajante da
// página Motion troca pelas invertidas.
export type Cores = { tinta?: string; papel?: string; sombra?: string };

// O renderer usa o contexto que o componente já criou (o WebGL 2 é testado
// antes de baixar o three) e compila os shaders antes do primeiro quadro.
export async function criarCena(
  canvas: HTMLCanvasElement,
  gl: WebGL2RenderingContext,
  leve: boolean,
  cores: Cores = {}
): Promise<Cena> {
  const renderer = new WebGLRenderer({
    canvas,
    context: gl,
    alpha: true,
    antialias: true,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);

  const camera = new PerspectiveCamera(30, 1, 1, 100);
  camera.position.z = B.camera.distancia;

  const comuns: Uniformes = {
    uTempo: { value: B.tempoInicial },
    uRelogio: { value: 0 },
    uEnergia: { value: 0 },
    uMateria: { value: 0 },
    uRespiro: { value: 0 },
    uRepouso: { value: B.narrativa.repouso },
    uDist: { value: B.camera.distancia },
    uLente: { value: B.lente },
    uVelocidade: { value: B.velocidade },
    uDoppler: { value: B.doppler },
    uEscala: { value: 1 },
    uExplosao: { value: 0 },
    uTinta: { value: new Color(cores.tinta ?? B.cor.tinta) },
    uPapel: { value: new Color(cores.papel ?? B.cor.papel) },
    uSombra: { value: new Color(cores.sombra ?? B.cor.tinta) },
  };

  const fracao = leve ? B.leve : 1;
  const disco = criarDisco(comuns, Math.round(B.disco.tracos * fracao));
  const poeira = criarPoeira(comuns, Math.round(B.poeira.particulas * fracao));
  const halo = criarHalo(comuns);
  const horizonte = criarHorizonte(comuns);

  // giro: a composição inteira no plano da tela. plano: o disco inclinado.
  const plano = new Group();
  plano.rotation.order = "YXZ";
  plano.add(disco.secundaria, disco.primaria, poeira);
  const giro = new Group();
  giro.rotation.z = B.rolagem;
  giro.add(halo, horizonte, plano);
  const mundo = new Scene();
  mundo.add(giro);

  await renderer.compileAsync(mundo, camera);

  let relogio = 0;
  let tempo = B.tempoInicial;
  const suave = { x: 0, y: 0, impulso: 0 };
  let teto: number = B.dpr;
  let reduzida = false;
  let medida: { largura: number; altura: number; alvo: Alvo } | null = null;

  function aplicarTamanho() {
    if (!medida) return;
    const { largura, altura, alvo } = medida;
    const dpr = Math.min(teto, window.devicePixelRatio || 1, Math.sqrt(B.pixelsMax / (largura * altura)));
    renderer.setPixelRatio(dpr);
    renderer.setSize(largura, altura, false);
    // Eixo óptico no centro do buraco; 1 unidade = raio da sombra em px.
    const cheiaL = 2 * Math.max(alvo.x, largura - alvo.x);
    const cheiaA = 2 * Math.max(alvo.y, altura - alvo.y);
    camera.fov = MathUtils.radToDeg(2 * Math.atan(cheiaA / alvo.raio / 2 / B.camera.distancia));
    camera.setViewOffset(cheiaL, cheiaA, cheiaL / 2 - alvo.x, cheiaA / 2 - alvo.y, largura, altura);
    comuns.uEscala.value = alvo.raio * dpr;
  }

  return {
    redimensionar(largura, altura, alvo) {
      medida = { largura, altura, alvo };
      aplicarTamanho();
    },

    atualizar(dt, estado) {
      relogio += dt;
      const k = 1 - Math.exp(-dt * B.mouse.amortecimento);
      suave.x += (estado.ponteiroX - suave.x) * k;
      suave.y += (estado.ponteiroY - suave.y) * k;
      suave.impulso += (estado.impulso - suave.impulso) * (1 - Math.exp(-dt * B.scroll.amortecimento));
      tempo += dt * (1 + B.scroll.aceleracao * suave.impulso);

      const p = estado.progresso;
      const [e0, e1] = B.narrativa.energia;
      const [m0, m1] = B.narrativa.materia;
      // Respiro e precessão em frequências que não se alinham: nunca repete igual.
      const fase = (relogio / B.respiro.periodo) * Math.PI * 2;
      plano.rotation.x =
        B.inclinacao + B.scroll.inclinacao * p + B.respiro.precessao * Math.sin(fase * 0.6) - B.mouse.influencia * suave.y;
      plano.rotation.y = B.mouse.influencia * suave.x + B.respiro.precessao * Math.cos(fase * 0.37);

      comuns.uTempo.value = tempo;
      comuns.uRelogio.value = relogio;
      comuns.uEnergia.value = MathUtils.smoothstep(p, e0, e1);
      comuns.uMateria.value = MathUtils.smoothstep(p, m0, m1);
      comuns.uRespiro.value = B.respiro.amplitude * Math.sin(fase);
      comuns.uExplosao.value = estado.explosao;
      renderer.render(mundo, camera);
    },

    // Primeiro baixa a resolução; depois, metade da geometria.
    aliviar() {
      if (teto > 1 && renderer.getPixelRatio() > 1) {
        teto = 1;
        aplicarTamanho();
        return true;
      }
      if (reduzida) return false;
      reduzida = true;
      metade(disco.primaria.geometry, B.disco.segmentos * 2);
      metade(poeira.geometry, 1);
      return true;
    },

    destruir() {
      for (const objeto of [halo, horizonte, disco.primaria, disco.secundaria, poeira]) {
        objeto.geometry.dispose();
        objeto.material.dispose();
      }
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
