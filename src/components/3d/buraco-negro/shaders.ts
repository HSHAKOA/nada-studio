// GLSL do buraco negro. Unidade: raio da sombra = 1. A câmera olha o centro do
// buraco a uDist de distância, pelo eixo -z; o disco gira no plano xz do
// próprio grupo, que a cena inclina.

const LENTE = /* glsl */ `
uniform float uDist;
uniform float uLente;

// Lente gravitacional (lente fina), em espaço de câmera. Quem está atrás do
// buraco aparece fora do lugar, porque a luz contorna a massa:
//   beta   onde o ponto apareceria sem lente, no plano do buraco
//   re2    raio de Einstein², que cresce com a profundidade atrás do buraco
//   imagem +1 primária (mesmo lado, empurrada pra fora) ou -1 secundária
//          (lado oposto, colada na sombra)
// Devolve a posição vista em plano (em raios) e a profundidade em atras: o
// fragmento decide com eles o que a sombra engole e o que passa na frente.
vec3 curvar(vec3 p, float imagem, out float atras, out vec2 plano) {
  float fundo = -p.z;
  atras = fundo - uDist;
  vec2 beta = p.xy * (uDist / fundo);
  float b = max(length(beta), 1e-4);
  float re2 = uLente * max(atras, 0.0);
  float theta = 0.5 * (b + imagem * sqrt(b * b + 4.0 * re2));
  plano = beta * (theta / b);
  return vec3(plano * (fundo / uDist), p.z);
}
`;

const ORBITA = /* glsl */ `
uniform float uTempo;
uniform float uVelocidade;
uniform float uDoppler;

// Kepler: quem está perto gira mais rápido.
float velocidadeAngular(float raio) {
  return uVelocidade * pow(raio, -1.5);
}

// O lado que vem na nossa direção pesa mais.
float doppler(float ang) {
  return 1.0 + uDoppler * cos(ang);
}
`;

// Tinta sobre papel: fora da sombra o traço é tinta; na frente dela vira
// papel (o gesto do difference do site); atrás dela, some.
const TINTA = /* glsl */ `
uniform vec3 uTinta;
uniform vec3 uPapel;
varying float vAlfa;
varying float vAtras;
varying vec2 vPlano;

float sobreSombra() {
  return step(dot(vPlano, vPlano), 1.0);
}
`;

// ── Disco de acreção: traços de longa exposição ───────────────────────────
// position = órbita (raio, fase, altura); aTraco = (ponto ao longo do traço,
// de 0 na cauda a 1 na cabeça · tinta · semente).
export const DISCO_VERT = /* glsl */ `
${LENTE}
${ORBITA}
attribute vec3 aTraco;
uniform float uRelogio;
uniform float uEnergia;
uniform float uMateria;
uniform float uRespiro;
uniform float uRepouso;
uniform float uImagem;
uniform float uExposicao;
uniform float uBrilho;
uniform float uEspiral;
uniform float uSecundaria;
uniform float uCalor;
uniform float uExplosao;
uniform vec2 uRaios;
varying float vAlfa;
varying float vAtras;
varying vec2 vPlano;
varying float vCalor;

const float PASSO_ESPIRAL = 6.0;

void main() {
  float raio = position.x;
  // A cabeça do traço está no agora; a cauda, um tempo de exposição atrás.
  float exposicao = uExposicao * mix(0.3, 1.0, uEnergia);
  float ang = position.y + velocidadeAngular(raio) * (uTempo - (1.0 - aTraco.x) * exposicao);
  vec4 mv = modelViewMatrix * vec4(cos(ang) * raio, position.z, sin(ang) * raio, 1.0);
  gl_Position = projectionMatrix * vec4(curvar(mv.xyz, uImagem, vAtras, vPlano), 1.0);

  // O disco se estende pra fora conforme a matéria chega.
  float alcance = mix(mix(uRaios.x, uRaios.y, 0.45), uRaios.y, uMateria);
  float perfil = smoothstep(uRaios.x, uRaios.x + 0.2, raio) * (1.0 - smoothstep(alcance * 0.55, alcance, raio));
  // Dois braços em espiral girando devagar: a matéria acende ao passar por eles.
  float espiral = 1.0 + uEspiral * sin(2.0 * ang - PASSO_ESPIRAL * log(raio) + uRelogio * 0.05);
  float cintila = 0.8 + 0.2 * sin(uRelogio * (0.3 + aTraco.z) + aTraco.z * 50.0);
  float presenca = mix(uRepouso, 1.0, uEnergia) * (1.0 + uRespiro);
  vAlfa = uBrilho * aTraco.y * aTraco.x * perfil * doppler(ang) * espiral * cintila * presenca;
  // Na passagem pro bloco seguinte, o disco esvazia junto com a poeira.
  vAlfa *= 1.0 - 0.65 * smoothstep(0.02, 0.5, uExplosao);
  // A imagem secundária só existe pra quem está atrás do buraco.
  if (uImagem < 0.0) vAlfa *= uSecundaria * smoothstep(0.0, 0.4, vAtras);
  vCalor = uCalor * (1.0 - smoothstep(uRaios.x, uRaios.x + 1.5, raio));
}
`;

export const DISCO_FRAG = /* glsl */ `
${TINTA}
uniform vec3 uQuente;
uniform float uImagem;
uniform float uSobreSombra;
varying float vCalor;

void main() {
  float dentro = sobreSombra();
  if (dentro > 0.5 && (vAtras > 0.0 || uImagem < 0.0)) discard;
  vec3 tinta = mix(uTinta, uQuente, vCalor);
  gl_FragColor = vec4(mix(tinta, uPapel, dentro), vAlfa * mix(1.0, uSobreSombra, dentro));
  #include <colorspace_fragment>
}
`;

// ── Poeira: a matéria que orbita por fora ─────────────────────────────────
// position = órbita (raio, fase, altura); aGrao = (diâmetro em raios · tinta · semente).
export const POEIRA_VERT = /* glsl */ `
${LENTE}
${ORBITA}
attribute vec3 aGrao;
uniform float uRelogio;
uniform float uMateria;
uniform float uRespiro;
uniform float uEscala;
uniform float uBrilho;
uniform float uExplosao;
uniform vec2 uRaios;
varying float vAlfa;
varying float vAtras;
varying vec2 vPlano;

void main() {
  float raio = position.x;
  float ang = position.y + velocidadeAngular(raio) * uTempo;
  vec4 mv = modelViewMatrix * vec4(cos(ang) * raio, position.z, sin(ang) * raio, 1.0);
  gl_Position = projectionMatrix * vec4(curvar(mv.xyz, 1.0, vAtras, vPlano), 1.0);

  // Grão menor que um pixel e meio não encolhe: clareia.
  float px = aGrao.x * uEscala * (uDist / -mv.z);
  gl_PointSize = max(px, 1.5);

  // A matéria chega de dentro pra fora: uma frente que avança com o progresso.
  float frente = mix(uRaios.x, uRaios.y + 1.5, uMateria);
  float revelada = 1.0 - smoothstep(frente - 1.5, frente, raio);
  float borda = 1.0 - smoothstep(uRaios.y * 0.6, uRaios.y, raio);
  float cintila = 0.75 + 0.25 * sin(uRelogio * (0.4 + aGrao.z) + aGrao.z * 70.0);
  vAlfa = uBrilho * aGrao.y * revelada * borda * doppler(ang) * cintila * (1.0 + uRespiro) * min(1.0, px * px / 2.25);
  // Na passagem pro bloco seguinte, a poeira sai daqui e voa no canvas 2D.
  vAlfa *= 1.0 - smoothstep(0.0, 0.1, uExplosao);
}
`;

// A poeira nunca aparece sobre a sombra: o núcleo fica preto.
export const POEIRA_FRAG = /* glsl */ `
${TINTA}

void main() {
  if (sobreSombra() > 0.5) discard;
  float grao = 1.0 - smoothstep(0.55, 1.0, length(gl_PointCoord - 0.5) * 2.0);
  gl_FragColor = vec4(uTinta, vAlfa * grao);
  #include <colorspace_fragment>
}
`;

// ── Núcleo: quadros de frente pra câmera, no plano do buraco ──────────────
export const NUCLEO_VERT = /* glsl */ `
varying vec2 vP;

void main() {
  vP = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// A sombra: chapada, sem textura (preta; branca no viajante, que é desenhado
// invertido). Colado nela, o anel de fótons; o fio de papel entre os dois é a
// luz que desenha a borda.
export const HORIZONTE_FRAG = /* glsl */ `
uniform vec3 uTinta;
uniform vec3 uSombra;
uniform float uAnel;
uniform float uEspessura;
uniform float uBrilhoAnel;
uniform float uRespiro;
uniform float uDoppler;
varying vec2 vP;

void main() {
  float r = length(vP);
  float px = fwidth(r);
  float sombra = clamp((1.0 - r) / px + 0.5, 0.0, 1.0);
  // Traço do anel: fino, nunca menos que um pixel e meio.
  float meia = max(uEspessura, px * 0.75);
  float anel = clamp((meia - abs(r - uAnel)) / px + 0.5, 0.0, 1.0);
  anel *= uBrilhoAnel * (1.0 + uRespiro) * (1.0 + uDoppler * vP.x / max(r, 1e-4));
  gl_FragColor = vec4(mix(uTinta, uSombra, sombra), max(sombra, anel));
  #include <colorspace_fragment>
}
`;

// Halo: a zona de distorção em volta da sombra, como grafite esfumado. Começa
// depois do anel, pra não sujar o fio de papel.
export const HALO_FRAG = /* glsl */ `
uniform vec3 uTinta;
uniform float uForca;
uniform float uAlcance;
uniform float uAnel;
uniform float uRelogio;
uniform float uEnergia;
uniform float uRespiro;
uniform float uRepouso;
varying vec2 vP;

void main() {
  float r = length(vP);
  float queda = 1.0 - smoothstep(1.0, 1.0 + uAlcance, r);
  float ang = atan(vP.y, vP.x);
  float mancha = 1.0 + 0.18 * sin(ang * 2.0 + uRelogio * 0.21) * sin(ang * 3.0 - uRelogio * 0.13);
  float alfa = uForca * queda * queda * smoothstep(uAnel, uAnel + 0.06, r) * mancha
    * (1.0 + 3.0 * uRespiro) * mix(uRepouso, 1.0, uEnergia);
  gl_FragColor = vec4(uTinta, alfa);
  #include <colorspace_fragment>
}
`;
