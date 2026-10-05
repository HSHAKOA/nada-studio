# Página Motion (`/motion`)

Este arquivo trata da **página** `/motion`, o braço de vídeo e motion da NADA. O sistema de movimento do site inteiro está no [MASTER, seção 5](../MASTER.md#5-motion). Código: [motion/page.tsx](../../../src/app/motion/page.tsx), [MotionHero.tsx](../../../src/components/MotionHero.tsx), [BuracoViajante.tsx](../../../src/components/3d/BuracoViajante.tsx), [AberturaNada.tsx](../../../src/components/AberturaNada.tsx), [PecaVideo.tsx](../../../src/components/PecaVideo.tsx).

## Estrutura

| # | Seção | Ritmo | Movimento |
|---|---|---|---|
| 001 | Hero | `.section` | "Do nada nasce tudo." chega letra por letra, cada uma subindo pela própria linha de base (0,8 s, `expo.out`, 35 ms entre letras); "Inclusive o vídeo." é digitada com o cursor colado na última letra; no fim o cursor sai e a luz passa pela frase uma vez |
| 002 | O que a gente faz | `.section pt-0` | lista editorial (fio, número, título em 900 `clamp(36px, 5vw, 64px)`, texto) |
| 003 | Trabalhos | `.section pt-0` | grupos por competência (Motion design, Edição), cada um com régua, título e contagem; dentro, grade de 2 colunas com as peças |
| 004 | Chamada final | CTA | texto próprio |

- `.motion-titulo`: `clamp(44px, 6.8vw, 104px)`, 900, entrelinha 0.95, tracking -0.045em. A caixa de cada frase corta só no eixo y: o cursor depois do ponto final precisa aparecer.
- **Buraco viajante (001 e 002):** um buraco negro pequeno (a cena do Sobre) atravessa o título e as três frentes conforme a página desce, com o disco acendendo no caminho, e some antes dos trabalhos. Desenhado invertido sob `difference`: no papel fica preto e inverte o texto por onde passa. O three é baixado depois da carga da página, como no Sobre; sem WebGL 2, com economia de dados ou movimento reduzido, a página fica sem ele.
- Grupos: `MOTION_GRUPOS`, na ordem em que aparecem. Título no papel "H3 de lista" (`clamp(22px, 2.6vw, 32px)`), contagem em rótulo de 11 px. Grupo sem peça não aparece.
- Primeira peça: a abertura do site tocando **dentro** do cartão (`AberturaNada`). É um botão: toca uma vez quando 60% do cartão aparece e de novo a cada clique. Movimento reduzido: o quadro final, parado.
- Peça em vídeo (`PecaVideo`): a prévia toca muda em loop no cartão (`CapaVideo`). O clique no quadro ou em "Ver com som · duração" troca pela peça inteira no mesmo quadro, com som e os controles do navegador. Uma peça com som por vez; fora da tela ela pausa; no fim, volta a prévia. Nada da peça inteira é baixado antes do clique. Sem JS, o link abre o arquivo. Movimento reduzido ou economia de dados: fica o pôster, e o clique continua valendo.
- Peça que leva pra fora (hoje, a abertura da Ana Marocci): capa em filme (pôster + vídeo) ou tipográfica, com "Ver no ar".
- Formatos 16:10 e 9:16. A peça em pé tem quadro e legenda na mesma largura (360 px), no meio da coluna, e a prévia só toca enquanto o quadro cruza o meio da tela (com mouse também): uma linha de peças por vez, pra página não passar de 3 vídeos tocando juntos.
- Rótulo ao lado do título: a origem da peça (`ROTULO_ORIGEM`): Cliente, Nosso, Estudo autoral ou Spec edit. No cartão estreito ele desce pra linha de baixo.

## Regras

- Só peça real. Vídeo só onde houver vídeo.
- Trabalho que ninguém contratou sai sempre com o rótulo (estudo autoral ou spec edit), nunca como se fosse de cliente. A descrição só diz o que se vê no vídeo.
- Peça nova: uma linha na tabela de `scripts/motion.mjs` (gera prévia, versão de celular, peça inteira e pôster em `public/motion`) e uma entrada em `MOTION_TRABALHOS`. Não há limite de peças.
- "Ver em tela cheia" da abertura é `<a>` comum, não `<Link>`: a intro precisa de carregamento completo.
- A linguagem do vídeo (corte, edição) vale para os títulos desta página, não para o resto do site.
