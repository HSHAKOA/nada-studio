# Sobre (`/sobre`)

Regras desta página. Valem sobre o [MASTER](../MASTER.md). Código: [sobre/page.tsx](../../../src/app/sobre/page.tsx), [WhyNada.tsx](../../../src/components/sections/WhyNada.tsx), [BuracoNegro.tsx](../../../src/components/3d/BuracoNegro.tsx), [ForYouToo.tsx](../../../src/components/sections/ForYouToo.tsx), [ToolsWeBuildWith.tsx](../../../src/components/sections/ToolsWeBuildWith.tsx), [Instagram.tsx](../../../src/components/sections/Instagram.tsx).

## Estrutura

| # | Seção | Ritmo | Divisor |
|---|---|---|---|
| 001 | Por que NADA Studio (manifesto, h1) | `.section` | — |
| 002 | Pra quem | `.section pt-0` + fio no topo + `pt-[clamp(56px,8vw,112px)]` | fio (a poeira do buraco negro pousa nele) |
| 003 | Ferramentas | igual à 002 | fio |
| 004 | Instagram | igual à 002 | fio |
| 005 | Chamada final | CTA | círculo do ponto |

## Regras próprias

- **Manifesto:** "do nada / nasce / tudo." em `clamp(64px, 16vw, 232px)`, 900, entrelinha 0.86, tracking -0.055em. O conceito ocupa a escala da página. O texto fica em 6 colunas, a partir da 7.
- **Buraco negro atrás do manifesto:** o nada como o ponto onde tudo começa. Fica no vazio à direita de "nasce", e a sombra nunca toca letra; o disco pode passar por trás das letras. Posição e tamanho são medidos em em do corpo do título, por largura de tela ([config.ts](../../../src/components/3d/buraco-negro/config.ts)), então acompanham a tipografia. No celular, o disco sai pela borda direita.
  - Desenho de gravura: sombra preta chapada, anel de fótons separado dela por um fio de papel, traços de órbita de longa exposição e poeira fina. A lente curva o lado de trás do disco por cima e por baixo da sombra.
  - O núcleo fica preto: a poeira nunca aparece sobre a sombra, e o disco passa na frente dela em papel a 28%.
  - Hierarquia: título, buraco negro, texto. O buraco negro reforça o título, nunca compete com ele.
  - Sem WebGL 2, com economia de dados ou com renderização só por software: a seção fica só com o título, e o three nem é baixado.
- **Passagem pro Pra quem (a partir de 768 px):** descendo do manifesto, a poeira do buraco negro explode, desce em arco e pousa alinhada no fio do bloco 002, que aparece no lugar dela (BURACO_NEGRO.explosao em [config.ts](../../../src/components/3d/buraco-negro/config.ts)). Rolando de volta, ela volta pro buraco. Sem WebGL, no celular ou com movimento reduzido, o fio entra como os outros.
- **Continuação com fio:** Pra quem, Ferramentas e Instagram continuam o mesmo assunto, então não abrem com o espaço inteiro de seção. O divisor é o fio do topo, desenhado na entrada.
- **Ferramentas com ícone:** é a única lista do site com ícone, porque o ícone é a informação (o logotipo da ferramenta que o cliente já usa), não enfeite. São as ferramentas que a NADA liga de fato; a resposta do FAQ repete a lista.
  - **Logos na cor da marca** (decisão do João, 04/10/2026): cada um no tom da própria marca (o Notion fica preto, que é a cor dele). O nome continua em preto /70. Fora daqui, só o logo do bloco do Instagram tem cor.
  - **Onda:** a cada 3,2 s cada logo sai de foco e volta, um depois do outro, com 110 ms entre eles: 0,37 s saindo (opacidade .2, desfoque de 6 px, escala .9) e 0,55 s voltando, com `--ease-inout`. Só o logo se mexe; o nome fica parado. Começa 0,9 s depois de a seção entrar, quando o fio e o título já assentaram.
  - A onda veio de um componente pronto (Logo Cloud, 21st.dev) e foi adaptada: sem o corte reto (`clip-path: inset()`) que escondia cada logo, sem mola no hover, e em CSS puro, sem Motion. Com movimento reduzido, os logos ficam parados e em cor.
- **Pra quem:** lista editorial de quatro públicos (profissionais, pequenos negócios, empresas, quem tem uma tarefa só), cada um com a cena do que sai das costas dele (decisão do João, 04/10/2026). O bloco "pessoa comum" segue fora.
- **Instagram (004):** título, o endereço `@nada.studio.br` em tipografia do manifesto com o logo na cor da marca, e o botão "Seguir no Instagram". O endereço atravessa a tela com o scroll; os dois pontos dele são o ponto da marca, que cai e pousa quando a faixa entra. Parado (sem JS ou com movimento reduzido), ele cabe na largura. A faixa repete o botão: fica fora do teclado e do leitor de tela.
