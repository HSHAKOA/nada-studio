# NADA Frontend Blueprint

Manual para começar um site novo de cliente com a engenharia da NADA. O site da NADA é a implementação de referência; daqui sai a **engenharia**, nunca a identidade. Os porquês estão em [NADA-SITE-ENGINEERING-BASE.md](NADA-SITE-ENGINEERING-BASE.md).

## Roteiro de um site novo

1. **Descoberta.** Negócio, público, a conversão principal (WhatsApp, formulário, agenda), as páginas e o material real que existe (fotos, prints, vídeos). O que faltar vai para `docs/pendencias-assets.md` do projeto.
2. **Direção.** Com o projeto ainda vazio: `/genjutsu:paint` para a direção visual e a tese de motion, e o UI/UX Pro Max para checar UX e acessibilidade da proposta. O que for decidido vira `design-system/<cliente>/MASTER.md`, escrito por nós (não o rascunho gerado).
3. **Base.** `create-next-app` com TypeScript, Tailwind, ESLint e App Router; copiar a lista [O que copiar](#o-que-copiar-para-novo-projeto); trocar os valores (breakpoints, curvas, fontes, cores) pelos do MASTER do cliente.
4. **Seções.** Uma por arquivo em `components/sections/`, texto em `data/`. Entradas por `data-entra`. Cena por scroll só com tese: `/genjutsu:cast`, uma experiência por vez.
5. **Assets.** Imagens por `scripts/imagens.mjs`, vídeo com pôster e versão de celular, nome novo a cada troca.
6. **QA.** [NADA-SITE-QA.md](NADA-SITE-QA.md) inteiro e o budget. Registrar a medição.
7. **Deploy.** Cloudflare Pages, domínio do cliente, Search Console, analytics do cliente.

---

## Stack base

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | Next.js 16, App Router, `output: "export"` | site estático: rápido, barato, sem servidor para manter |
| Linguagem | TypeScript `strict` | |
| Estilo | Tailwind v4 com `source("..")` + classes de sistema em `@layer components` | utilitário no detalhe, sistema nos padrões |
| Motion de scroll | GSAP + ScrollTrigger (+ SplitText quando tiver título por linha) | timeline e scroll confiáveis |
| Rolagem | Lenis só com mouse | inércia sem estragar o toque |
| Hospedagem | Cloudflare Pages | export estático, cabeçalhos por arquivo `_headers` |

## Dependências

| Pacote | Quando |
|---|---|
| `next`, `react`, `react-dom` | sempre (versões fixas, sem `^`, como aqui) |
| `gsap` | se houver motion por scroll ou timeline |
| `lenis` | se houver inércia com mouse |
| `motion` | só se houver interação React local (gesture, spring, layout); nunca para scroll |
| `animejs` | não entra em produção sem motivo; protótipo isolado |
| `react-icons` (ou SVG próprio) | só quando o ícone é informação |
| dev: `tailwindcss`, `@tailwindcss/postcss`, `typescript`, `eslint`, `eslint-config-next`, `@types/*` | sempre |

`sharp` vem com o Next e é usado só pelos scripts. Não instalar biblioteca "para o futuro" num site de cliente: a NADA já tem as ferramentas disponíveis na base.

## Agent tooling

- `CLAUDE.md` com `@AGENTS.md`; o `AGENTS.md` traz o bloco do Next ("leia `node_modules/next/dist/docs/`") e as regras do projeto, curtas, apontando para os docs.
- **Plugins de usuário** (valem para todo projeto): Genjutsu e UI/UX Pro Max. Detalhes, versões e guardrails em [frontend-toolbox.md](frontend-toolbox.md).
- **Motion AI Kit em escopo de projeto** (`npx motion-ai`, Project, Claude Code) quando o site usar a biblioteca Motion.
- **Skills de projeto:** `avoid-ai-writing-ptbr` para toda copy pública. `.claude/` está no `.gitignore` aqui; num repositório de cliente, decidir se as skills do projeto entram no git.
- **MCP:** `.mcp.json` na raiz só com URLs públicas; login é feito pelo `/mcp`, nunca com token no arquivo.

## Design tooling

| Etapa | Ferramenta | Saída |
|---|---|---|
| Direção visual e tese de motion | `/genjutsu:paint` (projeto vazio) | brainstorm e proposta |
| Regras de UX, acessibilidade, stack | UI/UX Pro Max (`--domain ux`, `--stack nextjs`) | checagem |
| Fonte de verdade | `design-system/<cliente>/MASTER.md` + `pages/` | escrito à mão a partir das decisões |
| Experiência pontual | `/genjutsu:cast` | uma interação, com tese |
| Repertório | React Bits (`llms.txt`), Animmaster | referência de mecanismo, nunca cópia |
| Layout vindo de Figma | MCP do Figma (`get_design_context`) | medidas e tokens do arquivo |

## Estrutura de diretórios

```text
src/
  app/              rotas (page.tsx por rota), layout.tsx (fontes, metadata, script do portão de
                    movimento, JSON-LD, ViewTransition), globals.css, sitemap.ts, robots.ts,
                    opengraph-image.png (+ .alt.txt), icon.png
  components/       infraestrutura e peças de página (SmoothScroll, MotionRoot, Navbar, Footer, CTA)
    sections/       uma seção por arquivo
  data/             todo o texto e o conteúdo, sem JSX
  lib/              motion.ts, scrollLock.ts, imageLoader.ts
  types/            globals.d.ts
scripts/            imagens.mjs, corrigir-export.mjs, gravar-capa.mjs, qa/
design-system/      <cliente>/MASTER.md e pages/
docs/               toolbox, auditorias, pendências de asset
public/             _headers, _redirects, llms.txt, imagens com as larguras geradas
```

## Primitives

Levar os que existem e não carregam identidade: container, ritmo de seção, portão de movimento, entradas declarativas, smooth scroll, breakpoints e `useMedia`, divisor animado, revelação de imagem, título por linha, vídeo na tela, troca de página, cabeçalho que recolhe, contato fixo. Lista completa, candidatos a extrair e o que não vira primitive: [base de engenharia](NADA-SITE-ENGINEERING-BASE.md#primitives).

## Motion infrastructure

- O padrão de componente (portão → `gsap.matchMedia()` → geometria em função → limpeza) está na [base](NADA-SITE-ENGINEERING-BASE.md#infraestrutura-de-motion-o-padrão).
- Tokens de motion: mesma estrutura (entrada, saída, transformação, narrativa, UI), **valores do cliente**.
- Cena de tela cheia: sticky + scrub, não pin.
- Área de decisão não se move. Celular sem pin. Movimento reduzido mostra tudo parado e completo.

## Responsive

- Breakpoints num lugar só (`lib/motion.ts` + `:root`/`@theme`), espelhados no CSS com comentário.
- 768 e 1024 como base; o limite do menu sai do conteúdo do cabeçalho do cliente (aqui 1180, medido com sete links; hoje são seis).
- Efeito de mouse depende de `(hover: hover) and (pointer: fine)`, não da largura.
- `svh` para tela cheia, `cqw` para componente que escala com a caixa.
- Primeira pintura já no estado do celular; o cliente ajusta sem pular.

## Images/assets

- Original em `public/<pasta>/`; `node scripts/imagens.mjs` gera 480, 960 e 1600 px em WebP; o loader serve a largura.
- `next/image` sempre com `sizes`; imagem de LCP com `preload()` e `fetchPriority: "high"`.
- Vídeo: pôster igual ao primeiro quadro, sem `src` até aparecer, versão de celular, pausa fora da tela.
- Nome novo a cada troca de arquivo. Material sempre real.
- Originais grandes que nenhuma página pede podem ficar fora de `public/` (aqui eles são publicados sem uso).

## SEO

- Metadata API com `title.template`, `canonical` por página, Open Graph e Twitter; imagem de compartilhamento de 1200 × 630 com texto alternativo.
- JSON-LD do tipo certo para o negócio (`LocalBusiness`, `ProfessionalService`...) e `FAQPage` quando houver FAQ, gerado dos mesmos dados da página.
- `sitemap.ts` e `robots.ts` estáticos; `llms.txt` com serviços e contato.
- Página 404 com `noindex`.

## Accessibility

- Foco visível nos dois temas; alvos de 44 px; `inert` no que está escondido; Esc fecha; foco entra em overlay só quando aberto pelo teclado.
- Duplicata visual com `aria-hidden` e valor real em `sr-only`.
- Movimento reduzido respeitado do `<head>` até o último componente.
- Contraste do texto secundário (alfa) conferido sobre o fundo real.

## Performance

Budget com estado medido, limite e meta em [base de engenharia](NADA-SITE-ENGINEERING-BASE.md#performance-budget). Os números que mais pesam num site novo: JS inicial ≤ 200 KB gz por página, LCP no celular ≤ 2,0 s, CLS ≤ 0,05 rolando, TBT no celular ≤ 600 ms, vídeo ≤ 1 MB e nada baixado antes de aparecer.

## Testing/QA

- [NADA-SITE-QA.md](NADA-SITE-QA.md) inteiro antes de cada publicação.
- Scripts: `scripts/qa/bundle.mjs`, `classes-fora-do-src.mjs`, `assets.mjs`, `servir.mjs`.
- Ainda não há teste automatizado de navegador. Se o projeto pedir, o primeiro passo é um Playwright rodando os trechos de console do QA nas larguras do checklist.

## Deploy

- `npm run build` gera `out/`; `npm run deploy` publica no Cloudflare Pages (`wrangler pages deploy out`). A autenticação do Wrangler fica na máquina, nunca no repositório.
- `public/_headers`: `immutable` só em `/_next/static/*`; cabeçalhos de segurança (`nosniff`, `SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`).
- `public/_redirects` para domínio antigo.
- Build no Windows precisa do `corrigir-export.mjs` (bug do Next 16.2 e 16.3, conferido no 16.3.8); no Linux do Cloudflare, não.
- Depois do ar: PageSpeed Insights na URL pública, Search Console (Core Web Vitals, inclusive desktop) e analytics do cliente.

## O que copiar para novo projeto

| Arquivo | Levar | Tirar ou trocar |
|---|---|---|
| `src/lib/motion.ts` | tudo | breakpoints e curvas do cliente |
| `src/lib/scrollLock.ts` | tudo | — |
| `src/components/SmoothScroll.tsx` | tudo | prefixo da chave `nada-y:` |
| `src/components/MotionRoot.tsx` | executor de `data-entra` e o `ResizeObserver` | marcador da margem (identidade NADA) |
| `src/app/layout.tsx` | script do portão de movimento, padrão de fontes e de metadata, JSON-LD, `<ViewTransition>` | intro, textos, telefone, ID do analytics, URL |
| `src/app/globals.css` | `@import ... source("..")`, camada base (foco, seleção, Lenis), `.section`, `.wrap`, `.prose-measure`, `.regua`, regras `.motion [data-entra]`, View Transitions, `prefers-reduced-motion` | todo o resto (capas, cenas, ponto, `.metal`, `.eco`, `.ba`, `.nada-*`) e os valores de cor, fonte e ritmo |
| `next.config.ts` | export, imagens (View Transitions não pedem flag desde o Next 16.3) | — |
| `src/lib/imageLoader.ts`, `scripts/imagens.mjs` | tudo | pastas e qualidade |
| `scripts/corrigir-export.mjs` + `postbuild` | enquanto o Next tiver o bug no Windows | — |
| `scripts/qa/*` | tudo | — |
| `scripts/gravar-capa.mjs` | se houver portfólio com capa em filme | lista de projetos e rastreadores |
| `src/types/globals.d.ts` | `react/canary` | flags de `window` que não existirem |
| `src/app/sitemap.ts`, `robots.ts` | padrão | URL e rotas |
| `public/_headers` | tudo | — |
| `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs` | tudo | — |
| `AGENTS.md` | bloco do Next e o formato das regras | as regras da NADA |
| `CapaVideo.tsx` | o mecanismo, como `VideoNaTela` | dependência de `.capa` |
| `Navbar.tsx`, `CTA.tsx`, `WhatsAppFixo.tsx`, `SectionMarker.tsx` | o comportamento | todo o desenho e o ponto |

## O que NÃO copiar

- Logotipo, wordmark, tagline, copy, nome "NADA" em qualquer lugar.
- Preto e branco como paleta, o cromado do hero, o ponto da marca e o roteiro dele.
- Intro, abertura, cena NADA, manifesto gigante, Antes/Depois, passagem do ponto, traço à mão, faixa do rodapé.
- Sistema de capas e dados do portfólio; `public/portfolio/`, `public/equipe/`.
- Formato `( nome ) 00X` dos marcadores e o marcador da margem, a não ser que a identidade do cliente peça algo assim.
- **ID do Google Analytics (`G-BGYNR7JBZW`), número de WhatsApp, Instagram, endereço e JSON-LD da NADA.** Vazar isso num site de cliente mistura métricas e contatos.
- Textos de termos e privacidade: a estrutura serve; o conteúdo é do cliente e precisa ser revisado por ele.
- `public/llms.txt`, `_redirects`, `opengraph-image.png`, ícones.
- Arquivos sem uso que vieram do modelo do Next (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).
