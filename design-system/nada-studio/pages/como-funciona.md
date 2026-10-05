# Como funciona (`/como-funciona`)

Regras desta página. Valem sobre o [MASTER](../MASTER.md). Código: [como-funciona/page.tsx](../../../src/app/como-funciona/page.tsx), [CenaNada.tsx](../../../src/components/CenaNada.tsx), [HowItWorks.tsx](../../../src/components/sections/HowItWorks.tsx), [Ecosystem.tsx](../../../src/components/sections/Ecosystem.tsx).

## Estrutura

| # | Seção | Fundo | Movimento |
|---|---|---|---|
| 001 | O problema (h1 da página) | branco, dentro da cena NADA | cena NADA atrás |
| — | respiro (`.nada-respiro`, 55svh) | branco | a palavra ocupa a tela sozinha, sem texto na frente |
| 002 | Como funciona (passos) | branco, dentro da cena NADA | linha de progresso desenha com o scroll |
| 003 | A mensalidade | preto, corte seco | padrões de entrada |
| 004 | Tudo conectado (ecossistema) | branco, corte seco | a árvore se monta uma vez |
| 005 | Custo de não fazer | branco | padrões de entrada |
| 006 | Chamada final | preto, círculo do ponto | CTA |

## Cena NADA

- Palco `position: sticky` de 100svh atrás do Problema e dos Passos (`margin-bottom: -100svh`), com as quatro letras do logotipo em contorno, cada uma num plano. CSS 3D com perspectiva de 90vw; sem WebGL.
- Um scrub (0,8) do começo ao fim do bloco: as letras começam longe, à direita do texto (opacidade .22); cada uma chega no seu tempo (até .55) e a palavra passa das bordas da tela no respiro; depois recuam juntas e assentam a .09 como fundo dos passos.
- Celular: as letras em coluna, alternando os lados, traço a .2; cada uma entra uma vez (`top 88%`).
- Movimento reduzido: a palavra parada, a .08, atrás do Problema.
- É a única cena em CSS 3D do site; a outra cena 3D, o buraco negro do Sobre, é WebGL. Rolou inteira sem layout shift (CLS 0 medido em 03/10/2026): é o modelo de palco fixo do site.

## Outras regras

- **Passos:** linha de progresso horizontal a partir de 768, vertical no celular; vai de `top 75%` a `bottom 55%` da lista. Sem movimento, já aparece inteira.
- **Mensalidade:** faixa preta em corte seco (`section-invert`), lista com fio e "·".
- **Ecossistema:** o ponto é a raiz; tronco → espinha → ramos → ações. A partir de 1024, a árvore é horizontal e entra uma vez em cascata (atrasos calculados do centro para as pontas). Abaixo disso, a árvore fica em pé, a espinha desce com o scroll e cada área se monta quando chega.
