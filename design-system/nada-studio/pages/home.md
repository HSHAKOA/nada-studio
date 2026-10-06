# Home (`/`)

Regras desta página. Valem sobre o [MASTER](../MASTER.md) onde divergem. Código: [page.tsx](../../../src/app/page.tsx).

## Narrativa

Ordem fixa, a resposta antes da história: impacto (com o que a gente é) → serviços → identificação → transformação e prova → portfólio → decisão → fechamento. Quem já sabe o que procura acha o que a NADA Studio faz na primeira tela e na primeira rolagem; a história vem depois. O primeiro trabalho real aparece logo depois do Antes/Depois. (Ordem trocada em 06/10/2026, depois do feedback de posicionamento: antes, os serviços eram o quarto bloco.)

| # | Seção | `id` | Fundo | Movimento | Componente |
|---|---|---|---|---|---|
| — | Intro | — | preto → branco | em toda carga nova da home (entrada, nova aba, F5); nunca no voltar nem na navegação interna; ~3 s (2 s no celular); pular por botão ou Esc | `IntroOverlay` |
| — | Hero | `top` | branco | na chegada, a luz atravessa o título palavra por palavra e termina no cromo; a frase variável troca uma vez (problema → resposta) e para; o cromo brilha a cada frase e, na última, a cada 4 s; fio com o ponto (origem → queda) | `Hero`, `TituloRotativo` |
| 001 | O que a gente faz | `o-que-fazemos` | branco | ≥ 768: depois que o ponto do hero saiu da tela, o ponto passa pelo vazio e pousa como ponto final do título | `WhatWeDo` |
| 002 | Isso é com a gente | `isso-e-com-a-gente` | branco | lista que a pessoa marca (traço à mão); seta pisca até o primeiro clique | `Symptoms` |
| 003 | Antes/Depois | `antes-depois` | branco → preto | ≥ 768: palco preso (sticky) por 160svh com scrub (riscos, queda do ponto, círculo, dígitos rolam até 10, traço circula). Celular: o Depois abre uma vez num círculo | `BeforeAfter` |
| 004 | Portfólio | `portfolio` | branco | capas entram assentando; o filme toca quando a capa está na tela | `PortfolioTeaser` |
| 005 | Formatos | `precos` | branco + caixa preta | nenhum além dos padrões de entrada (área de decisão) | `Pricing` |
| 006 | Vamos começar | `comecar` | preto | o ponto volta e abre a seção num círculo; botão com ímã | `CTA` |
| — | Rodapé | — | preto | faixa ligada à velocidade do scroll | `Footer` |

## Regras próprias

- **Hero:** H1 `clamp(42px, 6.5vw, 78px)` em 900; altura mínima `100svh`; o `<main>` não leva `pt-24` (o hero tem `pt-28`).
  - **Descritor:** acima do título, uma linha diz o que a NADA Studio é ("Estúdio de sites, automação e vídeo."), na fonte dos títulos: Archivo 700, `clamp(20px, 2.4vw, 26px)` (o tamanho do Destaque), tracking -0.02em, em preto, com `text-balance` (em 360 px quebra em duas linhas parelhas). É a primeira coisa lida; não vira eyebrow cinza nem texto de corpo (a versão em Inter foi recusada em 06/10/2026).
  - **Título:** duas frases, o problema e a resposta. Troca uma vez e para na resposta. Sem movimento ou sem JS, só a resposta aparece.
  - **Um nome por serviço:** sites, automação e vídeo. Os mesmos três no descritor, na lista de serviços, no rodapé e no menu ("Vídeo"). Empresa maior tem porta própria (IA para empresas), no pé da lista e no rodapé; fora do cabeçalho (decisão do Eric, 06/10/2026).
- **O que a gente faz:** três linhas com o nome do serviço em 900 `clamp(36px, 5vw, 64px)` (o desenho das frentes da página Motion) e o texto ao lado. A dor fica no texto, nunca no título.
- **Intro:** decidida pelo script do `<head>` antes da pintura ([layout.tsx](../../../src/app/layout.tsx)), pelo tipo de navegação do documento, sem nada guardado no navegador; `?intro` força. Se o JS não chegar, a tela preta some sozinha em 4 s.
- **O ponto:** roteiro completo só aqui ([ponto.ts](../../../src/lib/ponto.ts)). Ausente nos Sintomas, no Portfólio e nos Formatos. Um ponto por vez: a passagem do O que a gente faz começa com o topo da seção a 60% da tela, quando a queda do hero já saiu, e antes disso o viajante fica escondido (`data-ponto="longe"`). O ponto do hero some no fim da queda, já fora da tela: até 06/10/2026 ele ficava parado onde caía, à vista sobre a seção seguinte.
- **Antes/Depois:** o título fica dentro do palco (não existe tela vazia antes de o palco prender) e se repete invertido no Depois. O preto só engole o 8 depois que o ponto toca nele.
- **Portfólio encosta no Antes/Depois** (`section-encosta`): a promessa e a prova ficam juntas.
- **Formatos:** no celular, cada formato recolhe em "O que inclui"; o mais pedido vem primeiro e já aberto. Recolhido desde a primeira pintura, para não pular depois da hidratação.
- **WhatsApp fixo** (abaixo de 1180) com a mensagem da home.

## Transições entre seções

Tabela completa (espaço, divisor, movimento) em [docs/auditoria-engenharia.md](../../../docs/auditoria-engenharia.md#3-divisórias-da-home). Resumo: Hero → O que a gente faz → Sintomas e Portfólio → Formatos são só espaço; Antes/Depois e Formatos → CTA trocam de fundo com o círculo do ponto; Antes/Depois → Portfólio é corte seco de preto para branco; CTA → Rodapé continua no preto.

## Atenção

Até 04/10/2026 o Antes/Depois usava pin, que gerava layout shift no Chrome desktop ao entrar e sair (CLS 1 a 2). Agora o palco é sticky e rola com CLS 0 ([pre-motion-hardening.md](../../../docs/pre-motion-hardening.md)). Qualquer mudança nesse palco mede CLS rolando com a roda do mouse, não só na carga, e não volta para `pin`.
