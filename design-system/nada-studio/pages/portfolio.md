# Portfólio (`/portfolio` e `/portfolio/[slug]`)

Regras do índice, do case e do sistema de capas. Valem sobre o [MASTER](../MASTER.md). Código: [portfolio/page.tsx](../../../src/app/portfolio/page.tsx), [[slug]/page.tsx](../../../src/app/portfolio/[slug]/page.tsx), [PortfolioList.tsx](../../../src/components/sections/PortfolioList.tsx), [Capa.tsx](../../../src/components/Capa.tsx), dados em [portfolio.ts](../../../src/data/portfolio.ts).

## Índice

- Uma seção: marcador 001, H1 `clamp(36px, 5vw, 64px)`, subtítulo e o índice em dois grupos (cliente 002, nosso 003), separados por `mb-24`.
- Linha: número (/40) · nome `clamp(24px, 3vw, 40px)` bold · chamada 15 px /65 · entrega (11 px, caixa alta, a partir de 640) · seta. Fio entre as linhas.
- A linha tem toda a informação em texto. A capa nunca é a única fonte.
- **Selo** (`selo` em [portfolio.ts](../../../src/data/portfolio.ts)): rótulo curto colado no nome, em 11 px, caixa alta, preto. Hoje só "Grátis", na Transcrição de Reuniões. No case, o mesmo rótulo aparece no bloco de Entrega, com a explicação em uma linha.

Prévia da capa por dispositivo:

| Contexto | Comportamento |
|---|---|
| Celular | capa acima de cada item, só quando há material real (a tipográfica não aparece) |
| Tablet, desktop sem mouse ou movimento reduzido | coluna fixa à direita (34%, `sticky`, topo 112 px), trocando com o item que passa pelo meio da tela |
| Desktop com mouse (≥ 1024, ponteiro fino, sem movimento reduzido) | a capa segue o ponteiro numa faixa à direita do texto, sem cobrir nome nem chamada; entra em 240 ms, sai em 160 ms; as outras linhas vão a .35; no teclado, acompanha a linha em foco |

No celular, a primeira capa é pré-carregada com `srcset` e `fetchPriority: high` (é a maior pintura da primeira tela).

## Case

Ordem: voltar → capa 16:10 (pré-carregada, compartilha a transição com o índice) → cabeçalho em 5 colunas (marcador tipo + número, H1 `clamp(40px, 5.5vw, 72px)` em 900 (encolhe até a maior palavra caber inteira na coluna: `.titulo-case`), subtítulo, Entrega e "Faz parte de", link externo) e corpo em 7 colunas (O problema, O que a gente fez, O resultado) → faixa preta do número (se houver número e a capa não for do tipo número) → Por dentro (galeria real; print em pé limitado a 360 px) → O que tem dentro (só no Hub) → Próximo projeto (com fio) → chamada final com a mensagem pronta.

- Ritmo interno de subseção: `clamp(56px, 8vw, 112px)`. A página termina no preto da chamada final.
- A mensagem do WhatsApp sai pronta: o projeto e o motivo ("me identifiquei: …").
- Nada inventado: número só se for real.

## Capas

| Tipo | O que é |
|---|---|
| `filme` | o site real do projeto gravado quadro a quadro ([gravar-capa.mjs](../../../scripts/gravar-capa.mjs)). O pôster é o primeiro quadro. Ocupa a capa inteira, sem marcador |
| `recorte` | pedaço da interface real, inteiro, na proporção dele |
| `numero` | o resultado em tipografia, com a faixa da interface real logo abaixo |
| `foto` | foto real do material |
| `cena` | motion em código para projeto sem tela para filmar (`CapaCena`: leitor, transcrição, jornal). Só transform e opacity; parado = quadro final |
| `tipografica` | sem material: só o nome. Não aparece no celular |

- Fundo preto para cliente; branco com fio para projeto nosso. Marcador `( cliente ) 01` no canto, menos no filme.
- Proporções: 4:5 no índice e na home, 16:10 no topo do case, 9:16 nas peças verticais da página Motion.
- Hover (mouse): imagem, tela, nome e número escalam 1.04 em 0,8 s. Entrada: a moldura aparece e o miolo assenta. Sem máscara.
- Vídeo ([CapaVideo.tsx](../../../src/components/CapaVideo.tsx)): sem `src` até a capa aparecer; espera a página e o pôster carregarem; pausa fora da tela. No toque, um filme por vez (o da faixa do meio). Com movimento reduzido ou economia de dados, fica o pôster. No celular, o case usa a versão pequena do filme largo.

## Regras

- A capa é a prévia em movimento do projeto, nunca o print de uma página parada.
- Interface sempre real, nunca foto de banco.
- Imagem nova em `public/portfolio` ou `public/equipe`: `node scripts/imagens.mjs` (gera 480, 960 e 1600 px).
- Arquivo trocado ganha nome novo: as imagens não têm hash no nome e o navegador guarda a antiga.
