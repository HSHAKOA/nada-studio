// Parâmetros visuais do buraco negro do manifesto (/sobre). O que dá pra
// ajustar sem abrir shader está aqui. Unidade de comprimento da cena: o raio
// da sombra (= 1). Ângulos em radianos, tempos em segundos.

// Onde o buraco cai, em unidades do corpo do título (em), a partir do canto de
// cima à esquerda dele: a composição acompanha a escala da tipografia.
export type Enquadramento = { x: number; y: number; raio: number };

// O mesmo ponto já em px, dentro do palco.
export type Alvo = { x: number; y: number; raio: number };

// O que o componente escreve e a cena lê a cada quadro.
export type EstadoCena = {
  progresso: number; // narrativa: 0 nada → 1 tudo
  ponteiroX: number; // -1 a 1, a partir do centro da tela
  ponteiroY: number;
  impulso: number; // 0 a 1, velocidade do scroll
  explosao: number; // 0 a 1: a poeira saindo pro bloco seguinte (Sobre)
};

export const BURACO_NEGRO = {
  // Centro e raio da sombra por largura de tela. No computador o centro fica
  // no fio direito da grade, na altura de "nasce": a sombra não toca letra.
  enquadramento: {
    desktop: { x: 4.74, y: 1.3, raio: 0.55 },
    tablet: { x: 4.9, y: 1.3, raio: 0.6 },
    celular: { x: 4.55, y: 1.72, raio: 0.8 },
  },
  palco: 3.4, // meia altura do canvas, em raios: cabe o halo e a poeira inclinada
  camera: { distancia: 30 }, // quanto menor, mais perspectiva
  inclinacao: 0.13, // quanto acima do plano do disco a gente olha
  rolagem: -0.12, // giro do conjunto no plano da tela
  velocidade: 0.6, // rad/s a 1 raio do centro; cai com r^-1,5 (Kepler)
  doppler: 0.5, // quanto pesa mais o lado do disco que vem na nossa direção
  // Raio de Einstein² = lente × profundidade atrás do buraco. 0,77 é o valor
  // físico: 2 raios de Schwarzschild, com a sombra a 2,6 deles.
  lente: 0.77,
  tempoInicial: 60, // a cena começa com o disco já enrolado
  // Tom quente no miolo do disco: 0 por padrão (o site não tem cor de destaque).
  cor: { tinta: "#000000", papel: "#ffffff", quente: "#5a3418", calor: 0 },

  disco: {
    tracos: 5200,
    segmentos: 10, // por traço: os arcos longos perto do buraco precisam de curva
    raioInterno: 1.15, // a última órbita estável (3 raios de Schwarzschild)
    raioExterno: 5,
    espessura: 0.018, // altura do disco, por unidade de raio
    exposicao: 1.2, // quanto tempo de órbita cada traço registra
    brilho: 0.5, // alfa máximo de um traço
    faixas: 7.3, // frequência dos anéis concêntricos
    espiral: 0.25, // contraste dos dois braços que acendem a matéria
    aglomerados: 0.35, // fração dos traços que nasce em grupo
    secundaria: 0.6, // força da imagem de baixo (a luz que dá a volta)
    sobreSombra: 0.28, // alfa do traço, em papel, quando passa na frente da sombra
  },

  poeira: {
    particulas: 7000,
    raioInterno: 1.6,
    raioExterno: 7,
    espessura: 0.05,
    tamanho: [0.006, 0.018], // diâmetro do grão, em raios
    brilho: 0.4,
    aglomerados: 0.25,
  },

  horizonte: { anel: 1.03, espessura: 0.006, brilho: 0.6 },
  halo: { forca: 0.07, alcance: 1.6 },

  respiro: { periodo: 14, amplitude: 0.07, precessao: 0.018 },
  // influencia: inclinação máxima (rad) com o ponteiro na borda da tela.
  // amortecimento: por segundo; quanto maior, mais rápido o disco alcança o ponteiro.
  mouse: { influencia: 0.05, amortecimento: 1.8 },
  scroll: {
    inclinacao: 0.04, // o disco abre conforme a narrativa avança
    deslocamento: 60, // paralaxe do palco ao atravessar a seção, em px
    aceleracao: 0.35, // a órbita ganha até 35% com o scroll rápido
    velocidadeCheia: 1500, // px/s de scroll que valem o impulso inteiro
    amortecimento: 2.5, // por segundo: o impulso entra e sai sem tranco
  },

  // Fases da narrativa dentro do progresso. Em repouso (nada) o disco já
  // existe com `repouso` da presença: a cena nunca está parada.
  narrativa: { repouso: 0.3, energia: [0.05, 0.55], materia: [0.35, 1], duracaoCelular: 4 },
  entrada: { escala: 0.7, giro: -6, duracao: 1.6, atraso: 0.5 },

  // Passagem pro bloco seguinte (Sobre): a poeira explode e desce até virar o
  // fio que abre o bloco. Começa com o centro do buraco em `inicio` da tela e
  // termina com o fio em `fim`. Os grãos voam num canvas 2D por cima da página
  // (explosao.ts); a poeira do WebGL some quando eles saem e o disco esvazia.
  explosao: { graos: 1200, inicio: "center 40%", fim: "top 60%" },

  // O buraco pequeno que atravessa o começo da página Motion: raio da sombra
  // (px) por largura de tela. Desenhado invertido (tinta branca, sombra
  // branca) sob mix-blend-mode: difference: no papel ele fica preto e, onde
  // passa por cima de texto, a letra vira branca e continua legível.
  viajante: {
    raio: { desktop: 34, tablet: 30, celular: 22 },
    cores: { tinta: "#ffffff", papel: "#000000", sombra: "#ffffff" },
  },

  dpr: 1.5,
  pixelsMax: 2_800_000, // teto do canvas, em pixels de dispositivo
  leve: 0.5, // fração da geometria no celular, em máquina fraca e sem movimento
  alivio: { quadros: 90, limiteMs: 24 }, // média acima disso: a cena alivia
} as const;
