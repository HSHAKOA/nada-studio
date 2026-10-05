# Home (`/`)

Regras desta página. Valem sobre o [MASTER](../MASTER.md) onde divergem. Código: [page.tsx](../../../src/app/page.tsx).

## Narrativa

Ordem fixa: impacto → identificação → transformação e prova → portfólio → serviços → decisão → fechamento. O primeiro trabalho real aparece logo depois do Antes/Depois.

| # | Seção | `id` | Fundo | Movimento | Componente |
|---|---|---|---|---|---|
| — | Intro | — | preto → branco | só na 1ª entrada no site, e só pela home; ~2,5 s (1,6 s no celular); pular por botão ou Esc | `IntroOverlay` |
| — | Hero | `top` | branco | na chegada, a luz atravessa o título palavra por palavra e termina no cromo; a frase variável dá uma volta e para; o cromo brilha a cada frase e, na última, a cada 4 s; fio com o ponto (origem → queda) | `Hero`, `TituloRotativo` |
| 001 | Isso é com a gente | `isso-e-com-a-gente` | branco | lista que a pessoa marca (traço à mão); seta pisca até o primeiro clique | `Symptoms` |
| 002 | Antes/Depois | `antes-depois` | branco → preto | ≥ 768: palco preso (sticky) por 160svh com scrub (riscos, queda do ponto, círculo, dígitos rolam até 10, traço circula). Celular: o Depois abre uma vez num círculo | `BeforeAfter` |
| 003 | Portfólio | `portfolio` | branco | capas entram assentando; o filme toca quando a capa está na tela | `PortfolioTeaser` |
| 004 | O que fazemos | `o-que-fazemos` | branco | ≥ 768: o ponto passa pelo vazio e pousa como ponto final do título | `WhatWeDo` |
| 005 | Formatos | `precos` | branco + caixa preta | nenhum além dos padrões de entrada (área de decisão) | `Pricing` |
| 006 | Vamos começar | `comecar` | preto | o ponto volta e abre a seção num círculo; botão com ímã | `CTA` |
| — | Rodapé | — | preto | faixa ligada à velocidade do scroll | `Footer` |

## Regras próprias

- **Hero:** H1 `clamp(42px, 6.5vw, 78px)` em 900; altura mínima `100svh`; o `<main>` não leva `pt-24` (o hero tem `pt-28`).
- **Intro:** decidida pelo script do `<head>` antes da pintura ([layout.tsx](../../../src/app/layout.tsx)); `?intro` força. Se o JS não chegar, a tela preta some sozinha em 6 s.
- **O ponto:** roteiro completo só aqui ([ponto.ts](../../../src/lib/ponto.ts)). Ausente nos Sintomas, no Portfólio e nos Formatos.
- **Antes/Depois:** o título fica dentro do palco (não existe tela vazia antes de o palco prender) e se repete invertido no Depois. O preto só engole o 8 depois que o ponto toca nele.
- **Portfólio encosta no Antes/Depois** (`section-encosta`): a promessa e a prova ficam juntas.
- **Formatos:** no celular, cada formato recolhe em "O que inclui"; o mais pedido vem primeiro e já aberto. Recolhido desde a primeira pintura, para não pular depois da hidratação.
- **WhatsApp fixo** (abaixo de 1180) com a mensagem da home.

## Transições entre seções

Tabela completa (espaço, divisor, movimento) em [docs/auditoria-engenharia.md](../../../docs/auditoria-engenharia.md#3-divisórias-da-home). Resumo: Hero → Sintomas e Portfólio → O que fazemos → Formatos são só espaço; Antes/Depois e Formatos → CTA trocam de fundo com o círculo do ponto; Antes/Depois → Portfólio é corte seco de preto para branco; CTA → Rodapé continua no preto.

## Atenção

Até 04/10/2026 o Antes/Depois usava pin, que gerava layout shift no Chrome desktop ao entrar e sair (CLS 1 a 2). Agora o palco é sticky e rola com CLS 0 ([pre-motion-hardening.md](../../../docs/pre-motion-hardening.md)). Qualquer mudança nesse palco mede CLS rolando com a roda do mouse, não só na carga, e não volta para `pin`.
