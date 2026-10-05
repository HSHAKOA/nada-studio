# Auditoria de engenharia do site (03/10/2026)

Retrato da engenharia estrutural do site como está hoje: anatomia das páginas, divisórias entre seções, sistemas implícitos, fronteiras de motion, camadas e medições. Não trata de copy nem de portfólio. O que deve ser reaproveitado em outros sites está em [NADA-SITE-ENGINEERING-BASE.md](NADA-SITE-ENGINEERING-BASE.md); este arquivo é o diagnóstico que sustenta aquele.

Método: leitura de todo o `src/` (≈ 7.500 linhas), `scripts/`, `next.config.ts` e `public/_headers`; contagem de tokens no código; build de produção medido no `out/` com [scripts/qa/bundle.mjs](../scripts/qa/bundle.mjs); runtime medido no Chrome desktop (janela de 1920 × 855, sem limitação de CPU nem de rede, export servido por [scripts/qa/servir.mjs](../scripts/qa/servir.mjs)).

---

## 1. Anatomia das páginas

As 9 páginas de conteúdo repetem a mesma moldura: `<Navbar/>` + `<main className="pt-24">` + seções + `<CTA/>` + `<Footer/>` + `<WhatsAppFixo/>`. A home troca o `pt-24` pelo hero (`pt-28`, `min-h-[100svh]`) e tem a intro. Termos, privacidade e 404 têm só cabeçalho e rodapé; os dois documentos usam `main.section.pt-32` com `.wrap.prose-measure`.

| Página | Seções (marcador · `id`) | Fundo | Motion por scroll |
|---|---|---|---|
| `/` | hero `top` · 001 `isso-e-com-a-gente` · 002 `antes-depois` · 003 `portfolio` · 004 `o-que-fazemos` · 005 `precos` · 006 `comecar` | B, B, B→P, B, B, B, P | queda do ponto, pin do Antes/Depois, passagem do ponto, círculo do CTA |
| `/como-funciona` | 001 `o-problema` · respiro · 002 `como-funciona` · 003 `mensalidade` · 004 `ecossistema` · 005 `custo` · 006 `comecar` | B, B, B, P, B, B, P | cena NADA (sticky + scrub), linha dos passos, árvore, círculo |
| `/sobre` | 001 `por-que-nada` · 002 `pra-quem` · 003 `ferramentas` · 004 `instagram` · 005 `comecar` | B, B, B, B, P | círculo |
| `/portfolio` | 001 `portfolio` (002 cliente, 003 nosso) · 004 `comecar` | B, P | prévia que segue o ponteiro, círculo |
| `/portfolio/[slug]` | capa · cabeçalho/blocos · número · galeria · "dentro" · próximo · `comecar` | B, B, P, B, B, B, P | círculo |
| `/motion` | 001 hero · 002 capacidades · 003 trabalhos · 004 `comecar` | B, B, B, P | corte do título, abertura no cartão, círculo |
| `/ia-para-empresas` | 001 `ia` · 002 frentes · 003 `comecar` | B, B, P | círculo |
| `/faq` | 001 `perguntas` · 002 `confianca` · 003 `comecar` | B, B, P | círculo |
| `/equipe` | 001 `quem-e-a-nada` · 002 `comecar` | B, P | círculo |

B = branco, P = preto. Toda página tem `#comecar`, que o `WhatsAppFixo` usa para sumir.

## 2. Ritmo vertical encontrado

| Valor | Onde | Usos |
|---|---|---|
| `.section`: `clamp(72px, 12vw, 180px)` em cima e embaixo | quase toda seção | ≈ 25 |
| `.section-encosta`: topo `clamp(48px, 6vw, 96px)` | Portfólio da home | 1 |
| `section pt-0` | continuações (Sobre, Motion, IA) | 6 |
| `clamp(56px, 8vw, 112px)` (py, pt ou pb) | case, galeria, continuações do Sobre | 6 |
| `clamp(56px, 9vw, 128px)` | faixa do número no case | 1 |
| `pt-28` / `pb-8`, `min-h-[100svh]` | hero | 1 |
| `pt-32` | termos e privacidade | 2 |
| `py-16` | rodapé | 1 |
| 72 px / 40 px | estados do Antes/Depois (celular / palco fixo) | 1 |
| `mb-24` | grupos do índice do portfólio | 1 |

Entre título e conteúdo, o mesmo papel tem cinco valores: `mt-10`, `mt-12`, `mt-14`, `mt-16`, `mt-20`. Entre título e lead, três: `mt-4`, `mt-6`, `mt-8`. Marcador → título é sempre `mb-6`.

## 3. Divisórias da home

| De | Para | Espaçamento | Elemento divisor | Movimento | Funciona? | Reutilizável? |
|---|---|---|---|---|---|---|
| Hero | Isso é com a gente (001) | hero `pb-8` + topo da seção `clamp(72,12vw,180)`; o hero ocupa a tela, o corte é a dobra | nenhum; indicador (fio + ponto) no canto | ≥ 768: scrub `top top → +=55%`, a linha recolhe e o ponto cai até 95% da altura da tela crescendo 1,7×. Celular: o indicador some no primeiro scroll | sim: o ponto sai antes da área de leitura | o mecanismo (saída do hero amarrada a um scrub curto) sim; o ponto é NADA |
| Isso é com a gente | Antes/Depois (002) | fundo da seção `clamp(72,12vw,180)`; o Antes/Depois não tem padding de seção, o palco começa com o título dentro | nenhum, mesmo branco | ≥ 768: pin de 160% com scrub 0,6 (riscos → queda do ponto → círculo preto → dígitos → traço). Celular: sem pin; o Depois abre uma vez num círculo | visualmente sim; **gera layout shift no Chrome desktop** (seção 8) | o mecanismo ("cena de transformação" com geometria medida) sim; o gesto 8 → 10 e o ponto, não |
| Antes/Depois | Portfólio (003) | o palco termina em preto; linha de crédito (`py-3` + link `py-3`); Portfólio com `section-encosta` | troca de fundo preto → branco em corte seco; o crédito vira legenda | saída do pin; capas entram assentando | sim: "a prova encosta na promessa" | `section-encosta` sim (modificador de ritmo) |
| Portfólio | O que fazemos (004) | os dois paddings: 144 a 360 px | só espaço; a lista abre com fio | ≥ 768: o ponto viaja pelo vazio (scrub `top 80% → top 20%`) e pousa como ponto final do título | sim | viagem até um alvo medido no DOM sim; pouso no glifo é assinatura NADA |
| O que fazemos | Formatos (005) | os dois paddings | só espaço; a caixa preta do diagnóstico é o primeiro bloco | nenhum além dos padrões de entrada | sim | a regra "área de decisão não se move" sim |
| Formatos | Vamos começar (006) | os dois paddings; o ponto nasce no meio do respiro de cima do CTA | círculo (`clip-path`) que nasce de um ponto de 10 px e cobre a seção | ≥ 768: scrub `top+=origem 82% → top 8%`; celular: uma vez | sim | `CTA` já é primitive (9 páginas); o círculo a partir de um ponto medido é mecanismo reutilizável |
| Vamos começar | Rodapé | CTA `clamp(72,12vw,180)` + rodapé `py-16` | preto contínuo; fio `border-white/10`; faixa entre fios | faixa ligada à velocidade do scroll, só quando visível | sim: a página termina no preto | estrutura do rodapé sim; frase e marca não |

## 4. Divisórias nas outras páginas e tipos encontrados

- **Como funciona:** Problema → respiro de 55svh (a palavra NADA ocupa a tela) → Passos, tudo dentro do mesmo palco sticky; Passos → Mensalidade e Mensalidade → Ecossistema em corte seco de fundo; Custo → CTA no círculo.
- **Sobre:** Manifesto → Pra quem → Ferramentas com `section pt-0` + fio no topo + `pt-[clamp(56px,8vw,112px)]`.
- **Motion e IA:** continuações com `section pt-0`, sem fio (a lista abre com o próprio fio).
- **Case:** subseções com `clamp(56px, 8vw, 112px)`, faixa preta do número em corte seco, "Próximo projeto" com fio, e a página termina no CTA.

Tipos de divisória que o site usa:

| Tipo | Como | Quando |
|---|---|---|
| Espaço | `.section` + `.section` (os dois paddings) | troca de assunto |
| Espaço curto | `.section-encosta` | o conteúdo continua o anterior (prova depois da promessa) |
| Fio + respiro | `section pt-0` + `.regua-topo` + `pt-[clamp(56px,8vw,112px)]` | continuação do mesmo assunto |
| Corte seco de fundo | `.section-invert` colado no branco, sem transição | faixas estruturais (Mensalidade, número do case, fim do Antes/Depois, rodapé) |
| Círculo a partir do ponto | `clip-path: circle()` com origem medida | estações narrativas (impacto, retorno). É a única máscara do site |
| Palco compartilhado | `position: sticky` atrás de várias seções | cena NADA |
| Objeto que conecta | o ponto cai, passa, pousa | hero → sintomas, O que fazemos |

Onde a seção depende da anterior: o Portfólio da home (encosta no fim do Antes/Depois) e o CTA (calcula a origem do círculo pelo próprio padding de topo). Nenhuma seção mede a anterior; as dependências são de ritmo, não de código.

## 5. Sistemas implícitos

| Sistema | Existe? | Como | Duplicado? |
|---|---|---|---|
| Section rhythm | sim, implícito | `.section`, `.section-encosta`, `pt-0`, clamp de subseção solto em 6 lugares | o clamp de subseção está repetido inline |
| Section shell | sim, implícito | `<section id className="section"><div className="wrap">…` | repetido em ≈ 25 seções |
| Section heading | sim, implícito | `SectionMarker` + `h2[data-entra=titulo].max-w-2xl.text-[clamp(32px,4.2vw,52px)]` + lead opcional | **16 repetições** das mesmas classes |
| Section marker | sim, componente | `SectionMarker` + `sectionMarkers` + marcador da margem | não; numeração manual por página |
| Section transition | parcial | `lib/ponto.ts` tem `circulo()` e `raioQueCobre()`; o resto é por componente | o círculo é implementado 4 vezes (Antes/Depois celular e desktop, CTA celular e desktop) |
| Scroll scene | sim, por componente | sticky (Antes/Depois, CenaNada), scrub de viagem (WhatWeDo, Hero), progresso em `--p` (HowItWorks, Ecosystem) | o "progresso → `--p`" está escrito 2 vezes |
| Content container | sim | `.wrap` (39 usos) e `.prose-measure` | não |
| Responsive behavior | sim | `BP`/`MQ` em `lib/motion.ts` espelhados no CSS; `useMedia` | breakpoints repetidos em CSS literal (768, 1024, 1360) por necessidade |
| Motion behavior | sim | classe `motion` no `<html>`, `data-entra` + `MotionRoot`, `gsap.matchMedia()` por componente | `gsap.registerPlugin(ScrollTrigger)` em 9 arquivos (inofensivo, idempotente) |
| Page shell | sim, implícito | Navbar + main + Footer (+ CTA + WhatsAppFixo) | Navbar e Footer em 12 rotas; CTA e WhatsApp em 9 |

## 6. Motion: gatilhos e fronteiras

| Componente | Gatilho | Início → fim | Tipo | Breakpoint | Limpeza |
|---|---|---|---|---|---|
| `MotionRoot` | cada `[data-entra=titulo]` | `top 90%` | once, SplitText `autoSplit` | todos | `gsap.context` revertido a cada página |
| `MotionRoot` | lote de `linha` e `imagem` | `top 92%` | once (classe `is-in`) | todos | idem |
| `MotionRoot` | lote de `marcador` | `top 80%` | once + timeline | todos | idem |
| `MotionRoot` | cada seção com marcador | `top 50% → bottom 50%` | toggle do marcador da margem | ≥ 1360 (checado ao montar) | idem |
| `Hero` | hero | `top bottom → bottom top` | toggle (pausa o relógio das frases fora da tela) | todos | `ctx.revert()` |
| `Hero` | hero | `top top → +=55%` | scrub 0,5 | ≥ 768 | `mm.revert()` |
| `BeforeAfter` | trilho do palco | `top top → +(trilho − palco)` (160svh) | scrub 0,6 sobre palco **sticky**, `invalidateOnRefresh` | ≥ 768 | `mm.revert()` |
| `BeforeAfter` | Depois; número | `top 80%` | once | < 768 | `mm.revert()` |
| `WhatWeDo` | seção | `top 80% → top 20%` | scrub 0,6, `invalidateOnRefresh` | ≥ 768 | `mm.revert()` + atributo |
| `CTA` | seção | `top+=origem 82% → top 8%` | scrub 0,5, `invalidateOnRefresh` | ≥ 768 | `mm.revert()` |
| `CTA` | seção | `top 82%` | once | < 768 | `mm.revert()` |
| `CenaNada` | cena inteira | `0 → bottom bottom` | scrub 0,8 sobre palco **sticky** | ≥ 768 | `mm.revert()` |
| `CenaNada` | cada letra | `top 88%` | once | < 768 | `mm.revert()` |
| `HowItWorks` | lista | `top 75% → bottom 55%` | progresso → `--p` | todos | `st.kill()` |
| `Ecosystem` | árvore | `top 72%` | once (classe) | ≥ 1024 | `mm` com kill e limpeza de classe |
| `Ecosystem` | árvore e áreas | `top 75% → bottom 60%`, `top 80%`, `top 82%` | progresso + once | < 1024 | idem |

Outros laços e observadores:

| Onde | O quê | Para quê |
|---|---|---|
| `MotionRoot` | `ResizeObserver(body)`, debounce 150 ms | `ScrollTrigger.refresh()` quando a altura da página muda de fato |
| `SmoothScroll` | Lenis no `gsap.ticker`, `lagSmoothing(0)` | um laço só; as cenas com scrub não atrasam um quadro |
| `Marquee` | `gsap.ticker` + `IntersectionObserver` | só anda visível |
| `CapaVideo` | `IntersectionObserver` (mouse: 50%; toque: faixa do meio) | toca e pausa; um por vez no toque |
| `PortfolioList` | `IntersectionObserver` (−45%) + `pointermove`/`scroll`/`focusin` | prévia do índice |
| `WhatsAppFixo` | dois `IntersectionObserver` + `scroll` | some no fim, inverte no escuro |
| `AberturaNada` | `IntersectionObserver` (60%) | toca uma vez |
| `IntroOverlay` | `requestAnimationFrame` por 600 ms | partículas do bang (não roda com a aba escondida) |

Fronteiras: cada componente cria e limpa os próprios gatilhos, presos à própria seção. A única cena que atravessa seções é a `CenaNada` (Problema + respiro + Passos), por ser um invólucro. O ponto da queda do hero vive no DOM do hero e só visualmente cai sobre os Sintomas.

**Movimento reduzido:** a classe `motion` só é posta quando o sistema não pede redução, e todo componente com GSAP confere `movimentoLiberado()`. Sem ela, os estados iniciais do CSS não se aplicam e o conteúdo aparece completo. Continuam animando com redução: hover de botão e link, abrir do FAQ e dos Formatos, zoom de capa no hover (micro-interações disparadas pela pessoa; o critério AA permite). A decisão é tomada no carregamento: mudar a preferência com a página aberta só vale depois de recarregar.

## 7. Camadas, overflow, sticky e pin

| Camada | z | Elemento |
|---|---|---|
| Intro | 100 | `IntroOverlay` (fixed) |
| Cabeçalho | 50 | `header` (fixed) e o botão do menu |
| Menu do celular | 40 | `#menu-mobile` (fixed, < 1180) |
| Marcador da margem | 40 | `.marcador-fixo` (fixed, ≥ 1360; nunca junto com o menu) |
| Flutuantes | 30 | `WhatsAppFixo`, prévia do índice no desktop |
| Local | ≤ 10 | conteúdo do hero (10), ponto da passagem (5), ponto do impacto e fio da capa (3), marcador da capa (2), conteúdo da cena NADA (1), fundo do botão (−1, com `isolation: isolate`) |

- **Overflow:** `body { overflow-x: clip }` é a guarda global (até 04/10/2026 era `hidden`; com a trava do menu, o body virava contêiner de rolagem e todo sticky soltava). As máscaras de linha usam `overflow: clip` (não cria contêiner de rolagem, então não quebra o sticky). `overflow: hidden` fica em botão, capa, palco NADA, palco do Antes/Depois, acordeões, faixa do rodapé e retrato.
- **Sticky:** palco do Antes/Depois (100svh num trilho de 260svh, ≥ 768), palco NADA (100svh), prévia do índice no tablet (`top: 112px`).
- **Pin:** nenhum. O Antes/Depois saiu do pin em 04/10/2026 ([pre-motion-hardening.md](pre-motion-hardening.md)).
- **Âncoras:** não há `scroll-margin-top`. Funciona porque o cabeçalho recolhe ao descer e porque o topo de toda seção tem pelo menos 72 px de respiro. O `SmoothScroll` espera os gatilhos da página nova montarem (dois quadros + refresh) antes de medir o destino.

## 8. Medições

Build de produção (`out/`), gzip nível 9, sem o polyfill `noModule` (que navegador moderno não baixa):

| | Antes desta rodada | Depois |
|---|---|---|
| JS inicial por página | 221,6 a 231,8 KB | igual (mesmos chunks, mesmos hashes) |
| JS total do build | 979,4 KB (325,5 KB gz) | igual |
| Motion / Anime.js no bundle | não instalados | instalados, **nenhum import, nenhum byte** |
| CSS | 72,2 KB (14,4 KB gz), 573 classes | **63,2 KB (12,8 KB gz), 476 classes** |
| Fontes | 10 arquivos (293 KB); 2 com preload (≈ 83 KB): Archivo e Inter, latin | igual |
| HTML (gz) | 32 a 62 KB; maior: `/sobre` | igual |
| Elementos no HTML | 253 (404) a 664 (home) | igual |

Mídia publicada: 162 WebP (9 MB no total; servidos por largura: 480 px ≈ 19 KB, 960 px ≈ 46 KB, 1600 px ≈ 71 KB em média) e 33 MP4 (14,4 MB no total; capa em pé ≈ 492 KB, larga ≈ 600 KB, larga de celular ≈ 246 KB em média). Nenhum vídeo baixa antes de aparecer.

Runtime (Chrome desktop, 1920 × 855, sem limitação; é o limite inferior, o celular é bem mais lento):

| Página | LCP | CLS na carga | CLS rolando | Long tasks na carga | Nós no DOM | Prefetch de rota |
|---|---|---|---|---|---|---|
| `/` 1ª visita (com intro) | 336 ms (h1) | 0 | **1,8 a 1,9** | 4 (473 ms; maior 188 ms) | 706 | 39 req (≈ 354 KB sem compressão) + 30 (≈ 243 KB) rolando |
| `/` visita de retorno | 216 ms | 0 | (igual) | 1 (100 ms) | 706 | idem |
| `/como-funciona` | 304 ms | 0 | **0** | 0 | 485 | — |
| `/portfolio` | 288 ms | 0 | — | 0 | 462 | 54 req (≈ 473 KB sem compressão) |

Rolando a home inteira: até 21 animações CSS/WAAPI ao mesmo tempo, até 3 vídeos tocando juntos (desktop com mouse) e ≈ 1,8 MB de vídeo baixado.

Medições de celular da rodada anterior (390 px, CPU 4×, 4G; em [auditoria-2-implementacao.md](auditoria-2-implementacao.md)): LCP da home 1,86 s, portfólio 2,13 s; TBT da home 1,11 s.

## 9. Achados

Corrigidos: 5 (03/10/2026), 1 e 2 (04/10/2026, em [pre-motion-hardening.md](pre-motion-hardening.md)). O resto é proposta.

1. **Corrigido em 04/10/2026:** o palco virou sticky com a mesma timeline; CLS rolando 0 em todas as larguras. Diagnóstico original: **Layout shift no pin do Antes/Depois (desktop).** Rolando com a roda do mouse (eventos reais, passando pelo Lenis), o Chrome registra duas mudanças de layout de 0,92 a 0,99 no `.ba-palco`, uma ao entrar e outra ao sair do pin; o CLS da sessão vai a 1,8 a 1,9 (o limite bom é 0,1). As entradas saem com `previousRect` vazio e `currentRect` de tela cheia, exatamente quando o ScrollTrigger troca o palco para `position: fixed` e de volta. O Lighthouse não vê, porque mede só a carga; o dado de campo (CrUX, Search Console) vê. A cena NADA, que usa `position: sticky`, rolou inteira com CLS 0. **Proposta:** levar o palco do Antes/Depois para `sticky` com a mesma timeline em scrub, sem `pin`, numa rodada própria com QA visual. Antes, conferir o CLS de desktop no Search Console.
2. **Corrigido em 04/10/2026:** `next` 16.3.8 (o `eslint-config-next` ficou em 16.2.12: não depende da versão do `next` e a 16.3.8 não fecha nenhum alerta). Diagnóstico original: **Next.js 16.2.12 com alertas críticos de segurança** (`npm audit`: execução remota de código em servidor Windows, na otimização de imagem com AVIF e no `next/og`; corrigidos na 16.3.8, sem salto major). Em produção o site é export estático no Cloudflare, sem servidor Next, mas o `next dev` roda nesta máquina Windows. **Proposta:** atualizar `next` e `eslint-config-next` para 16.3.8 numa rodada própria, com build e QA visual. Os outros alertas (postcss, sharp, cadeia do eslint) são de ferramentas de desenvolvimento.
3. **Volume de prefetch.** (Com o Next 16.3.8 caiu: no mesmo método, a home foi de 55 para 26 pedidos e o portfólio de 95 para 36; a política continua em aberto.) Todo `<Link>` que entra na tela pede a rota inteira (rotas estáticas). A home faz 69 pedidos de prefetch e o índice do portfólio 54, com até ≈ 600 KB sem compressão (a compressão do Cloudflare reduz bastante). **Proposta:** medir no 4G e definir política: prefetch na navegação principal e nos CTAs; `prefetch={false}` ou prefetch por intenção (hover) em listas longas e no rodapé.
4. **Tarefas longas na primeira visita.** A intro acrescenta ≈ 370 ms de tarefas longas no desktop rápido (473 ms contra 100 ms na volta); no celular o TBT da home já era 1,11 s. **Proposta:** perfilar o início (SplitText de todos os títulos, criação dos gatilhos, partículas) e adiar o que não está na tela.
5. **Tailwind varria arquivos fora de `src/`. Corrigido.** As classes citadas nos `.md` de `.agents/skills/` (e em qualquer doc fora do `.gitignore`) viravam CSS publicado: 97 classes que nenhum elemento usa. Agora `@import "tailwindcss" source("..")` limita a varredura a `src/`. O CSS caiu 9 KB (1,6 KB gz); as 26 páginas têm HTML idêntico ao anterior (fora o nome do CSS e o buildId); nenhuma classe removida aparece em `src/` (checado por token, com controle positivo). Sem isso, a própria documentação desta rodada engordaria o CSS.
6. **Quase duplicatas de token:** 25 tamanhos de título em `clamp()` (o padrão de H2 tem 16 usos, mas há variantes como `3.4vw` e `3.6vw` para o mesmo papel); 8 níveis de alfa no texto preto; 5 valores para "título → conteúdo"; 2 valores para subseção. **Proposta:** a escala da base de engenharia, aplicada só com revisão visual.
7. **Repetição estrutural:** a moldura de página em 12 rotas, o cabeçalho de seção 16 vezes, o círculo do ponto 4 vezes, o progresso em `--p` 2 vezes, o registro do ScrollTrigger em 9 arquivos. Candidatos a primitive na base de engenharia.
8. **Numeração manual dos marcadores** (`sectionMarkers`): funciona, mas reordenar seção exige renumerar à mão.
9. **README desatualizado:** cita Lucide React, Vercel Analytics e Speed Insights, que não estão no `package.json` (o README está modificado no working tree; não foi mexido).
10. **Arquivos publicados sem uso:** `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` (modelo do create-next-app) e `NADAlogopretatransparente.png` não são referenciados em `src/` nem em `scripts/`. Os 39 originais WebP de `public/portfolio` (≈ 3,6 MB) também vão para o `out/` sem que nenhuma página os peça: o loader sempre serve as larguras geradas.
11. **Marcador da margem** confere `(min-width: 1360px)` só ao montar a página: atravessar 1360 px redimensionando só vale na próxima navegação.
