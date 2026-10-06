// O ponto da marca como sistema.
//
// Não é um objeto global atravessando a página: cada estação tem o seu ponto,
// e a continuidade vem de ser sempre a mesma forma (círculo preto, ~10 px em
// repouso), no mesmo eixo à direita da composição, com as mesmas curvas.
// Ele só aparece quando tem papel na narrativa.
//
// Roteiro da home (desktop com movimento):
//
//   trecho              papel        o que faz                                    onde
//   intro               nascimento   nasce no centro, vira o traço do logotipo    IntroOverlay
//   hero                origem       pendurado na ponta da linha do indicador     Hero
//   saída do hero       queda        a linha recolhe, ele cai pra fora da tela    Hero
//                                    e some lá (não fica parado onde caiu)
//   o que a gente faz   passagem     longe → perto → longe pelo vazio, pousa      WhatWeDo
//                                    como o ponto final do título. Só começa
//                                    depois que a queda saiu da tela: um ponto
//                                    por vez
//   sintomas            ausente      área de leitura
//   antes/depois        impacto      cai sobre o 8 e abre o círculo preto          BeforeAfter
//   portfólio           ausente      as capas mandam
//   formatos            ausente      área de decisão, nada se move
//   chamada final       retorno      reaparece pequeno e abre a seção preta       CTA
//
// Celular: sem viagem. Ficam o impacto (círculo entre Antes e Depois, uma vez)
// e o retorno (círculo da chamada final). Movimento reduzido: nenhum.
// Fora da home: o ponto marca a linha ativa do portfólio, é a raiz do
// ecossistema e abre a chamada final de todas as páginas.

export type PapelPonto = "nascimento" | "origem" | "queda" | "impacto" | "passagem" | "retorno" | "raiz" | "marca";

// Diâmetro do ponto em repouso (px).
export const PONTO_PX = 10;

// Raio de um círculo com centro (x, y) que cobre todo o retângulo w × h.
export function raioQueCobre(x: number, y: number, w: number, h: number) {
  return Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2;
}

// clip-path de círculo em px, a partir de um ponto.
export const circulo = (raio: number, x: number, y: number) => `circle(${raio}px at ${x}px ${y}px)`;
