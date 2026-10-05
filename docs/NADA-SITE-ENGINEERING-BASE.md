# NADA Site Engineering Base

O site da NADA Studio é a **implementação de referência** da engenharia frontend da NADA: laboratório, referência e base técnica para os sites de clientes. Este documento separa o que se reaproveita do que é identidade da NADA.

**Isto não é template visual.** A base carrega engenharia, qualidade, acessibilidade, performance, responsivo, tooling e primitives. Cada cliente recebe identidade, direção, tese de motion, layout e narrativa próprios. Se um site de cliente começar a parecer o da NADA, a base foi usada errado.

Documentos irmãos: diagnóstico em [auditoria-engenharia.md](auditoria-engenharia.md) · ferramentas em [frontend-toolbox.md](frontend-toolbox.md) · checklist em [NADA-SITE-QA.md](NADA-SITE-QA.md) · roteiro de site novo em [NADA-FRONTEND-BLUEPRINT.md](NADA-FRONTEND-BLUEPRINT.md) · identidade da NADA em [design-system/nada-studio/MASTER.md](../design-system/nada-studio/MASTER.md).

---

## A. Reutilizável

Cada item diz o que é, onde está aqui e o cuidado ao levar.

### Next.js
- **Next 16 (App Router) com `output: "export"`**: site estático, servido pelo Cloudflare Pages. Sem servidor em produção. [next.config.ts](../next.config.ts)
- **Antes de codar, ler `node_modules/next/dist/docs/`** da versão instalada (regra do [AGENTS.md](../AGENTS.md)). A API muda entre versões.
- **Imagem no export estático:** sem otimizador no servidor. `images.loader: "custom"` + [imageLoader.ts](../src/lib/imageLoader.ts) apontando para larguras geradas antes por [imagens.mjs](../scripts/imagens.mjs) (`deviceSizes: [480, 960, 1600]`).
- **View Transitions:** `<ViewTransition>` do React no layout ([layout.tsx](../src/app/layout.tsx)). Desde o Next 16.3 não há flag: `experimental.viewTransition` saiu do schema e quebra o `tsc`. Sem suporte no navegador, a navegação acontece normal.
- **Build no Windows:** o export do Next 16.2 e 16.3 (conferido no 16.3.8) grava os arquivos de prefetch com `\` no nome. [corrigir-export.mjs](../scripts/corrigir-export.mjs) roda no `postbuild` e corrige; no Linux não faz nada. Conferir se ainda é preciso ao atualizar o Next.
- **Dev e build ao mesmo tempo:** no Next 16, o `next dev` escreve em `.next/dev`, então dá para buildar com o dev rodando.

### TypeScript
- `strict`, alias `@/*` → `src/*`, `moduleResolution: bundler`.
- Tipos globais em [globals.d.ts](../src/types/globals.d.ts): `react/canary` (para o `<ViewTransition>`) e as flags de `window` que o script inicial usa.
- Verificação: `npx tsc --noEmit` (rápido, incremental). O build também checa.

### Tailwind v4
- **`@import "tailwindcss" source("..")`** em [globals.css](../src/app/globals.css): só `src/` gera classe. Sem isso, qualquer `.md` fora do `.gitignore` (docs, skills) vira CSS publicado. Nesta base isso custava 97 classes sem uso.
- Tokens de marca no `:root` e expostos ao Tailwind por `@theme inline` (cores, fontes, `--breakpoint-menu`).
- Classes de sistema na `@layer components` (`.section`, `.wrap`, `.btn`, `.regua`...): o utilitário ainda vence quando precisa.
- Regra que precisa vencer utilitário (por exemplo, `display: none` sobre `flex`) fica fora das camadas, comentada.

### Arquitetura responsiva
- **Uma fonte de breakpoints:** `BP` e `MQ` em [motion.ts](../src/lib/motion.ts), espelhados no CSS (`@media`) com comentário apontando de volta.
- **Capacidade, não só largura:** `(hover: hover) and (pointer: fine)` decide inércia, ímã e prévia que segue o ponteiro. Tela larga com toque não ganha efeito de mouse.
- **`useMedia`** com `useSyncExternalStore`: no servidor responde `false`, então a primeira pintura é a variante estreita e o cliente ajusta sem erro de hidratação.
- **`svh`** em altura de tela cheia (hero, palcos). **`cqw`** em componente que escala com a própria caixa (capas: `container-type: inline-size`).
- Estado inicial do celular resolvido no CSS antes da hidratação (Formatos recolhidos desde a primeira pintura) para não pular.

### Imagens e assets
- **Pipeline:** original em `public/<pasta>/nome.webp` → `node scripts/imagens.mjs` → `nome-480.webp`, `nome-960.webp`, `nome-1600.webp` (qualidade por pasta: print 86 com `smartSubsample`, foto 80). O loader troca o `src` pela largura.
- **`next/image` sempre com `sizes` real.** A imagem de LCP pré-carregada com `preload()` do `react-dom` (`imageSrcSet`, `media`, `fetchPriority: "high"`), como no índice do portfólio.
- **Sem hash no nome:** arquivo trocado ganha nome novo, senão o navegador mostra o antigo.
- **Vídeo** ([CapaVideo.tsx](../src/components/CapaVideo.tsx)): pôster = primeiro quadro; `preload="none"` e sem `src` até aparecer; espera a página e o pôster; pausa fora da tela; no toque, um por vez; movimento reduzido ou economia de dados = só o pôster; versão pequena para celular.
- **Gravação de capa** ([gravar-capa.mjs](../scripts/gravar-capa.mjs)): grava o site real quadro a quadro com o relógio virtual do Chrome e monta o MP4 com ffmpeg. Reaproveitável para qualquer portfólio de cliente.
- **Peça de vídeo com som** ([PecaVideo.tsx](../src/components/PecaVideo.tsx), [motion.mjs](../scripts/motion.mjs)): o bruto fica fora de `public/` (o Cloudflare Pages recusa arquivo acima de 25 MiB). O script gera a prévia muda do cartão (720 px, e 480 px para celular), a peça inteira com som e o pôster, e para se algum arquivo passar do teto. A prévia toca pelo `CapaVideo`; a peça inteira só é baixada no clique e toca no mesmo quadro, com os controles do navegador. O `play()` sai de dentro do clique (`flushSync`), senão o navegador barra o som.
- **Cache:** [_headers](../public/_headers) com `immutable` só em `/_next/static/*` (nome com hash) e cabeçalhos de segurança básicos.

### SEO
- Metadata API: `title.template`, `description`, `alternates.canonical` por página, Open Graph e Twitter. Ao sobrescrever `openGraph` numa página, a imagem padrão precisa voltar explícita (o case faz isso).
- JSON-LD no layout: `ProfessionalService` e `FAQPage` gerado dos mesmos dados do FAQ.
- `sitemap.ts` e `robots.ts` com `dynamic = "force-static"`; `opengraph-image.png` + `.alt.txt` pela convenção de arquivo; `public/llms.txt`.
- 404 com `robots: { index: false }`.

### Acessibilidade
- Foco visível de 2 px nos dois temas, nunca removido. Alvos de toque de 44 px.
- `inert` em tudo que está escondido mas na tela (menu fechado, botão fixo escondido) e no fundo quando o menu abre; Esc fecha; o foco só entra no menu quando ele foi aberto pelo teclado (`e.detail === 0`).
- Duplicatas visuais com `aria-hidden` (cópia do rótulo no hover, parênteses do marcador, colunas de dígitos) e o valor real em `sr-only`.
- Estados: `aria-pressed` (sintomas), `aria-expanded` + `aria-controls` (acordeões, menu), `aria-current="page"`, `aria-live="polite"` em texto que muda.
- Intro pulável por botão e por Esc. `lang="pt-BR"`.

### Motion: utilitários e ciclo de vida
- **Portão de movimento:** um script inline no `<head>` põe a classe `motion` no `<html>` antes da primeira pintura, só se o sistema não pede redução. Os estados iniciais das animações ficam no CSS **dentro de `.motion`**, então o HTML já nasce no estado certo (sem piscar). Se o JS não montar em 4 s, a classe sai e tudo aparece. Em JS, `movimentoLiberado()`.
- **Vocabulário declarativo:** o conteúdo declara a intenção (`data-entra="titulo|linha|imagem|marcador"`) e um executor global ([MotionRoot.tsx](../src/components/MotionRoot.tsx)) anima. É o modelo para separar motion de conteúdo.
- **Lenis + GSAP num laço só** ([SmoothScroll.tsx](../src/components/SmoothScroll.tsx)): Lenis no `gsap.ticker`, `lenis.on("scroll", ScrollTrigger.update)`, `lagSmoothing(0)`. Só com mouse de verdade.
- **Trava de scroll com contador** ([scrollLock.ts](../src/lib/scrollLock.ts)): `lenis.stop()` + `overflow: hidden`; dois overlays não destravam um ao outro.
- **Rolagem entre páginas:** restauração do navegador desligada; posição guardada por rota (`sessionStorage`); voltar/recarregar devolve a posição; link novo vai ao topo; âncora espera o layout (dois quadros + refresh) por causa do pin; link para a própria página rola em vez de não fazer nada.
- **Troca de página:** View Transitions com classe (`.pagina`) e elemento compartilhado (capa → topo do case). Um nome por elemento na tela; movimento reduzido desliga.

### Primitives de seção (CSS)
`.section`, `.section-encosta`, `.section-invert`, `.wrap`, `.prose-measure`, `.regua` / `.regua-topo`, `.btn`, `.link-u`, `.seta`, `.rolo`. Os **mecanismos** são reaproveitáveis; os **valores** (cores, cantos, curvas) vêm do design system de cada cliente.

### Performance e QA
Budget na seção [Performance budget](#performance-budget). Checklist e scripts em [NADA-SITE-QA.md](NADA-SITE-QA.md) e [scripts/qa/](../scripts/qa/).

---

## B. Específico da NADA (não reutilizar automaticamente)

| Elemento | Onde |
|---|---|
| Logotipo, `NadaWordmark` e as letras soltas | `NadaWordmark.tsx`, `public/nada-wordmark.svg` |
| Tagline "Do nada nasce tudo" e toda a copy | `data/content.ts`, faixa do rodapé |
| Preto e branco sem cor de destaque; o cromado `.metal` | `globals.css` |
| O ponto da marca e o roteiro das estações (nascimento, origem, queda, impacto, passagem, retorno, raiz) | `lib/ponto.ts`, `Ponto.tsx` |
| O NADA gigante: manifesto do Sobre e a cena NADA em 3D | `WhyNada.tsx`, `CenaNada.tsx` |
| Intro (bang, traço do logotipo, voo até o cabeçalho) e a abertura no cartão | `IntroOverlay.tsx`, `AberturaNada.tsx` |
| Portfólio: dados, sistema de capas (filme, recorte, número, cena, tipográfica), cenas do leitor e da transcrição | `data/portfolio.ts`, `Capa.tsx`, `CapaCena.tsx` |
| Identidade editorial: `( nome ) 00X`, parênteses, numeração de três dígitos, eyebrow em caixa alta, marcador da margem em `difference` | `SectionMarker.tsx`, `MotionRoot.tsx` |
| Assinatura de motion: queda e impacto do ponto, 8 → 10 com dígitos rolando, traço à mão, ponto pousando como ponto final, corte seco do título da página Motion, brilho uma vez por frase | componentes da home e da Motion |
| Narrativa e ordem das seções da home | `app/page.tsx` |
| Visual do botão (canto reto, fundo enchendo de baixo) | `.btn` |
| Escolha de fontes (Archivo + Inter) | `layout.tsx` (a engenharia do `next/font` é reaproveitável; a escolha não) |

O que dá para levar dessas peças é o **mecanismo**, nunca o gesto. Exemplo: "um objeto viaja até um alvo medido no DOM e pousa" é engenharia; "o ponto preto vira o ponto final do título" é NADA.

---

## Primitives

Critério para virar primitive: **aparece mais de uma vez, tem comportamento claro, não carrega identidade da NADA, reduz duplicação e continua flexível.** Nome bonito não é critério.

### Já existem

| Primitive | Forma | Reaproveitar como |
|---|---|---|
| Container | `.wrap`, `.prose-measure` | igual, com os valores do cliente |
| Ritmo de seção | `.section`, `.section-encosta`, `.section-invert` | igual, com a escala do cliente |
| Portão de movimento | script inline + `.motion` + `movimentoLiberado()` | igual |
| Entradas declarativas | `data-entra` + `MotionRoot` (título por linha, régua, imagem que assenta, marcador) | o executor sim; o vocabulário de cada cliente pode mudar |
| Smooth scroll e rolagem entre páginas | `SmoothScroll` + `scrollLock` | igual |
| Breakpoints e mídia | `BP`, `MQ`, `useMedia` | igual, com os breakpoints do cliente |
| Divisor animado | `.regua` / `.regua-topo` + `data-entra="linha"` | igual |
| Revelação de imagem | `data-entra="imagem"` (moldura aparece, miolo assenta, sem máscara) | igual |
| Título por linha | `data-entra="titulo"` (SplitText com máscara de linha, `autoSplit`) | igual |
| Marcador de seção | `SectionMarker` + marcador da margem | mecanismo sim; o formato `( nome ) 00X` é NADA |
| Seção de chamada final | `CTA` com props (9 páginas) | mecanismo e props; o círculo do ponto é NADA |
| Vídeo na tela | `CapaVideo` | extrair como `VideoNaTela` sem `.capa` (abaixo) |
| Troca de página | `<ViewTransition>` no layout + CSS | igual |
| Contato fixo | `WhatsAppFixo` | comum em site de pequeno negócio no Brasil; texto e limiar por projeto |
| Cabeçalho que recolhe | `Navbar` (recolhe ao descer, `inert`, Esc, foco) | o comportamento; o desenho é de cada cliente |

### Extrair quando houver rodada para isso (diferença visual zero esperada)

| Candidato | Hoje | Por quê |
|---|---|---|
| `SectionHeading` (marcador + título + lead) | 16 cópias das mesmas classes | maior duplicação do site |
| `src/lib/gsap.ts` (registra plugins uma vez) | `registerPlugin(ScrollTrigger)` em 9 arquivos | um lugar para plugin novo; nada esquecido |
| `useProgressoScroll(ref, início, fim)` → `--p` | HowItWorks e Ecosystem (celular) | mesmo mecanismo escrito 2 vezes |
| `revelarCirculo()` | círculo a partir de um ponto medido, 4 implementações (Antes/Depois e CTA, celular e desktop) | geometria já está em `lib/ponto.ts`; falta a timeline |
| `PageShell` | Navbar + main + Footer (+ CTA + WhatsApp) em 12 rotas | moldura igual; a home é exceção (hero sem `pt-24`, intro) |
| `VideoNaTela` | `CapaVideo` preso a `.capa` | vídeo de case, depoimento, hero de cliente |
| `.subsecao` | `py-[clamp(56px,8vw,112px)]` inline em 6 lugares | token de ritmo sem nome |

### Não viram primitive

- **`MotionBoundary` e `ReducedMotion` como componentes:** a fronteira já é o `gsap.matchMedia()` + limpeza por componente, e a redução já é o portão. Um componente a mais não acrescenta nada.
- **`ScrollScene` / `StickyScene` / `ScrollTransformationScene`:** hoje há uma cena de cada tipo. Generalizar com um uso é criar framework interno. Documentado como padrão (abaixo); vira componente no segundo uso real.
- **`CaseCover`:** o sistema de capas é identidade do portfólio da NADA.
- **Intro, ponto, cena NADA, Antes/Depois, passagem, traço à mão, faixa do rodapé:** assinatura da NADA (lista B).

---

## Separar motion de conteúdo

- **Modelo a seguir:** `data-entra`. O conteúdo declara, a infraestrutura executa. Texto e dados vêm de `src/data/`, sem conhecer animação.
- **Hoje acoplado:** o Antes/Depois (motor de cena + conteúdo + gesto num componente só), o Hero (rotação das frases + brilho + queda) e a passagem do O que fazemos. O `CTA` já recebe o conteúdo por props.
- **Regra:** generalizar no segundo uso, não no primeiro. Quando extrair, nomear pelo mecanismo (`ScrollTransformationScene`, não `NoAzulBeforeAfter`) e deixar curvas, tempos e geometria como parâmetros com o padrão do projeto.

---

## Tokens de motion

Sistema real hoje (CSS em `:root`, TS em `lib/motion.ts`):

| Categoria | Valor | Curva |
|---|---|---|
| UI rápida | 200 ms (cor, opacidade, borda) · 280 ms (rolo, seta, deslocamento curto) | `--ease-out` / `expo.out` |
| Saída de UI | 160 ms | `--ease-in` / `power3.in` |
| Revelação | 0,9 s (títulos, frases) · régua 1 s · imagem 0,7 s + assentar 1,3 s · botão 0,45 s | `expo.out` |
| Página | sai 150 ms · entra 250 ms (+100 ms) · elemento compartilhado 450 ms (320 ms no celular) | `--ease-in` / `--ease-out` |
| Narrativa | scrub 0,5 a 0,8, `ease: "none"`; trechos internos com `power2.in/out` | o scroll |
| Transformação | por cena (intro, círculos) | `expo.inOut` / `--ease-inout` |
| Saída de cena | 0,5 s | `power3.in` |
| Reduzido | 0: estado final, parado | — |

| Grandeza | Valor |
|---|---|
| Distância | linha sobe 110% (`yPercent`); frase 105%; imagem assenta de 1.07 a 1; seta anda 4 px; pergunta do FAQ 6 px |
| Stagger | linhas do título 0,08 s; lote de réguas e imagens 70 ms |
| Viewport | título `top 90%`; régua e imagem `top 92%`; marcador `top 80%`; reveal no celular `top 80–88%` |

Proposta (não aplicada): completar `lib/motion.ts` com o que hoje está solto nos componentes.

```ts
export const MOTION = {
  ease: { entrada: "expo.out", saida: "power3.in", transforma: "expo.inOut", narrativa: "none" },
  dur: { ui: 0.2, movimento: 0.28, saidaUi: 0.16, entrada: 0.9, saida: 0.5 },
  distancia: { linha: 110, frase: 105, assenta: 1.07 },
  stagger: { linhas: 0.08, lote: 0.07 },
  gatilho: { titulo: "top 90%", lote: "top 92%", marcador: "top 80%" },
  scrub: 0.6,
} as const;
```

Em site de cliente, a estrutura se mantém e os valores mudam com a tese de motion dele.

---

## Tokens de seção

Encontrados: ver [auditoria-engenharia.md](auditoria-engenharia.md#2-ritmo-vertical-encontrado). Escala proposta (**não aplicada**: unificar muda pixels e pede revisão visual):

| Token | Valor | Substitui |
|---|---|---|
| `--espaco-secao` | `clamp(72px, 12vw, 180px)` | `.section` |
| `--espaco-subsecao` | `clamp(56px, 8vw, 112px)` | os 6 inline e o `9vw/128px` da faixa do número |
| `--espaco-encosta` | `clamp(48px, 6vw, 96px)` | `.section-encosta` |
| `--gap-marcador` | 24 px | `mb-6` |
| `--gap-lead` | 24 px | `mt-4`, `mt-6`, `mt-8` depois do título |
| `--gap-conteudo` | 56 px | `mt-12`, `mt-14` |
| `--gap-conteudo-largo` | 64 a 80 px | `mt-16`, `mt-20` |
| Container | 1200 px, gutter `clamp(20px, 5vw, 48px)`, medida 60ch | já é token |
| Breakpoints | 640 · 768 · 1024 · menu (por projeto) · margem (por projeto) | já é token |

Títulos: no lugar dos 25 `clamp()`, papéis fixos (display, H1 de página, H2 de seção, H2 secundário, H3, destaque), cada um com um valor.

---

## Infraestrutura de motion: o padrão

Todo componente com GSAP segue este formato (é o que o site já faz):

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MQ, movimentoLiberado } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function Cena() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const raiz = ref.current;
    // Portão: sem a classe `motion`, o CSS já mostra o estado final.
    if (!raiz || !movimentoLiberado()) return;
    const coisas = gsap.utils.toArray<HTMLElement>(".coisa", raiz);

    // Uma matchMedia por componente: trocou de breakpoint, ela reverte sozinha.
    const mm = gsap.matchMedia();

    mm.add(MQ.tablet, () => {
      // Geometria em função + invalidateOnRefresh: remede a cada refresh.
      const alvo = () => raiz.querySelector<HTMLElement>(".alvo")!.getBoundingClientRect();
      gsap.timeline({
        scrollTrigger: { trigger: raiz, start: "top 80%", end: "top 20%", scrub: 0.6, invalidateOnRefresh: true },
      }).to(coisas, { x: () => alvo().left, ease: "none" });

      // O que não é do GSAP (listener, observer, atributo) é limpo aqui.
      const mover = () => {};
      raiz.addEventListener("pointermove", mover);
      return () => raiz.removeEventListener("pointermove", mover);
    });

    mm.add(MQ.mobile, () => {
      // Celular: sem pin, dispara uma vez.
      gsap.from(coisas, { autoAlpha: 0, scrollTrigger: { trigger: raiz, start: "top 80%", once: true } });
    });

    // Desmontou (troca de página): tudo volta ao estado original.
    return () => mm.revert();
  }, []);

  return <section ref={ref}>{/* … */}</section>;
}
```

| Tema | Regra |
|---|---|
| `gsap.context` | animação fora de `matchMedia` vai num `gsap.context(() => …, raiz)` e sai com `ctx.revert()` |
| Limpeza | `ScrollTrigger.create` solto (sem contexto) sai com `st.kill()`; listener e observer saem no retorno do `mm.add` ou do efeito |
| Estado inicial | no CSS, dentro de `.motion` (sem piscar antes da hidratação); `gsap.from` sozinho deixa o estado final aparecer por um instante |
| Refresh | `ResizeObserver` no `body` com debounce, só quando a altura muda de fato; âncora espera dois quadros + `ScrollTrigger.refresh()` |
| Ordem dos gatilhos | sem pin, a altura das cenas vem do CSS e a ordem de criação não importa (pin, se um dia voltar, leva `refreshPriority: 1`) |
| Overflow global | `body { overflow-x: clip }`, nunca `hidden`: com a trava de rolagem no `<html>`, `hidden` faz do body um contêiner de rolagem e solta todo sticky |
| matchMedia | breakpoints só de `MQ`; nunca um número solto no componente |
| Resize | o ScrollTrigger recalcula sozinho; geometria em função de valor |
| Navegação | o executor global reinicia por `pathname`; cada componente limpa ao desmontar |
| Movimento reduzido | portão no `<head>`, CSS dentro de `.motion`, `movimentoLiberado()` no JS, `@media (prefers-reduced-motion: reduce)` para transições e View Transitions |
| Celular | sem pin, sem viagem; `once`; Lenis desligado no toque; menos partículas em aparelho fraco (`hardwareConcurrency <= 4`) |
| Aba escondida e visibilidade | `requestAnimationFrame` para sozinho; `lagSmoothing(0)` para não voltar em câmera lenta; vídeo pausa fora da tela; efeito que segue o ponteiro fecha em `blur` e `visibilitychange` |
| Palco de tela cheia | **`position: sticky` + timeline em scrub, sem `pin`.** O pin troca o palco para `fixed` e o Chrome registra layout shift (CLS 1 a 2 medido no Antes/Depois); trocado por sticky em 04/10/2026, foi a 0, como a cena NADA. Gatilho = o trilho (pai do palco), nunca o elemento preso |
| Laço | um `requestAnimationFrame` só: Lenis e qualquer laço contínuo no `gsap.ticker`, parados quando invisíveis |
| Propriedades | em scroll, só `transform`, `opacity` e `clip-path` |
| Duas bibliotecas | Motion, GSAP e Anime.js nunca na mesma propriedade do mesmo elemento |

---

## Performance budget

Estado medido em 03/10/2026 (detalhes e método em [auditoria-engenharia.md](auditoria-engenharia.md#8-medições)); JS e CLS rolando atualizados em 04/10/2026 ([pre-motion-hardening.md](pre-motion-hardening.md)). Desktop medido sem limitação: é o limite inferior. Celular: rodada anterior, 390 px, CPU 4×, 4G.

| Métrica | NADA hoje | Limite (bloqueia entrega) | Meta para site novo | Como medir |
|---|---|---|---|---|
| JS inicial por página (gz, sem `noModule`) | 204 a 219 KB | 240 KB | ≤ 200 KB | `node scripts/qa/bundle.mjs` |
| CSS (gz) | 12,9 KB | 15 KB | ≤ 15 KB | `bundle.mjs` |
| Classes de CSS sem uso | 0 | 0 | 0 | `node scripts/qa/classes-fora-do-src.mjs` |
| Fontes no preload | 2 arquivos, ≈ 83 KB | 2 arquivos / 100 KB | 2 famílias, só latin | `bundle.mjs`, DevTools |
| LCP celular (4G, CPU 4×) | home 1,86 s · portfólio 2,13 s | 2,5 s | ≤ 2,0 s | Lighthouse mobile, PageSpeed Insights |
| LCP desktop | 0,22 a 0,34 s | 1,0 s | ≤ 0,8 s | DevTools |
| CLS na carga | 0 | 0,1 | 0 | Lighthouse |
| CLS rolando (roda do mouse) | 0 em todas as rotas e larguras medidas | 0,1 | ≤ 0,05 | trecho de console do [QA](NADA-SITE-QA.md) |
| TBT celular (CPU 4×) | home 1,11 s | não piorar | ≤ 600 ms | Lighthouse mobile |
| INP | não medido | 200 ms | ≤ 200 ms | dado de campo (CrUX / Search Console) |
| Long tasks na carga (desktop) | 0 a 4 (até 473 ms, com a intro) | nenhuma acima de 200 ms fora de intro | 0 | trecho de console |
| Nós no DOM | até 706 | 1.400 | ≤ 800 | trecho de console |
| Imagem servida no celular | 480 px ≈ 19 KB · 960 px ≈ 46 KB | 200 KB por imagem | ≤ 100 KB | DevTools, Network |
| Vídeo por arquivo | em pé ≈ 0,5 MB · largo ≈ 0,6 MB · celular ≈ 0,25 MB · prévia da Motion 0,1 a 1,0 MB (celular 0,06 a 0,5 MB) | 1,2 MB; 0 bytes antes de aparecer | ≤ 1 MB; celular ≤ 0,4 MB | DevTools, Network; `node scripts/motion.mjs` confere o teto |
| Peça inteira com som (só no clique) | 0,8 a 6,8 MB | 12 MB; 0 bytes antes do clique | ≤ 8 MB | `node scripts/motion.mjs` confere o teto; DevTools, Network |
| Vídeos tocando juntos | até 3 (mouse) · 1 (toque) | 3 · 1 | 2 · 1 | trecho de console |
| Animações simultâneas | até 21 CSS/WAAPI + uma cena em scrub por tela | só `transform`/`opacity`/`clip-path` no scroll; uma cena fixa por vez | idem | DevTools, Performance |
| Prefetch de rota na carga | 39 (home) a 54 (portfólio) pedidos | definir política por projeto | ≤ 20 | DevTools, Network (`fetch`) |

Biblioteca instalada e não importada não pesa nada (Motion e Anime.js aqui: 0 byte, conferido). Biblioteca importada globalmente sem uso é proibida.

---

## Regras de engenharia

1. O código do site é a fonte de verdade; design system e docs mudam no mesmo commit.
2. Breakpoints, curvas e tempos vêm de um lugar só (`lib/motion.ts` + `:root`). Nada de número solto em componente.
3. Toda animação passa pelo portão de movimento e tem estado final completo sem JS.
4. Área de decisão não se move.
5. Cena de tela cheia: sticky + scrub, não pin.
6. Uma biblioteca por elemento e por propriedade. GSAP para scroll; Motion para interação React local; Anime.js só em experimento isolado.
7. Plugin e biblioteca só no componente que usa.
8. Tailwind só lê `src/`.
9. Imagem e vídeo passam pelo pipeline (larguras, pôster, nome novo ao trocar).
10. Nada é entregue sem lint, `tsc`, build e o checklist do [QA](NADA-SITE-QA.md).
