# Frontend toolbox

Ferramentas de design, motion e UX à disposição dos sites da NADA Studio: o que cada uma faz, onde está instalada e quando usar. Estado conferido em 03/10/2026.

## Hierarquia de decisão

| Decisão | Quem manda |
|---|---|
| Direção | Genjutsu + design system do projeto (na NADA: [design-system/nada-studio/MASTER.md](../design-system/nada-studio/MASTER.md)) |
| UX | UI/UX Pro Max |
| Scroll narrativo | GSAP (ScrollTrigger) |
| Motion React local | Motion, quando fizer sentido |
| Experimentos isolados | Anime.js (opcional) |
| Repertório | React Bits + Animmaster |

**Nenhuma biblioteca define a identidade.** A biblioteca entrega o mecanismo; a direção vem do projeto.

## Tabela

| Ferramenta | Papel | Instalada? | Uso preferencial | Evitar |
|---|---|---|---|---|
| [GSAP](https://gsap.com/) 3.15.0 | motor de motion do site | sim, `dependencies` | scroll choreography, timelines, SVG, ScrollTrigger, SplitText, sequências narrativas | importar plugin que a página não usa; controlar a mesma propriedade que o Motion |
| [Lenis](https://lenis.darkroom.engineering/) 1.3.26 | rolagem com inércia | sim, `dependencies` | só com mouse de verdade, no ticker do GSAP | ligar no toque (`syncTouch`) |
| [Motion](https://motion.dev/) 14.0.0 | motion React local | sim, `dependencies`, **sem nenhum import** | gestures, springs, layout transitions, `AnimatePresence`, interação baseada em estado | scroll narrativo; mesmo elemento animado pelo GSAP |
| [Motion AI Kit](https://motion.dev/ai-kit) (`motion-ai` 14.1.0) | skill `/motion`, agente `motion-reviewer`, MCP oficial | **não: ação manual** (o instalador exige terminal interativo) | docs atualizadas do Motion, CSS spring, MotionScore (Motion+) | instalar em escopo global |
| [Three.js](https://threejs.org/) 0.186.1 | WebGL | sim, `dependencies` (`@types/three` em dev) | o buraco negro do Sobre e o viajante da Motion, num chunk próprio baixado sob demanda | R3F e drei sem necessidade; WebGL em cena sem narrativa |
| [Anime.js](https://animejs.com/) 4.5.0 | toolkit experimental e secundário | sim, `dependencies`, **sem nenhum import** | protótipo isolado, texto, SVG, WAAPI | produto principal; mesma experiência que o GSAP |
| [Genjutsu](https://github.com/AThevon/genjutsu) 3.3.0 | direção de motion e visual | sim, plugin de usuário (todos os projetos) | `/genjutsu:cast` numa experiência específica | `/genjutsu:paint` neste repositório (substitui os tokens); `bunshin` em projeto existente |
| [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) 2.13.0 | inteligência de UI e UX | sim, plugin de usuário (todos os projetos) | regras de UX, acessibilidade, responsivo, stack Next.js, revisão | gerar design system genérico por cima de um MASTER real |
| [React Bits](https://reactbits.dev/get-started/index) | catálogo de referência | não (referência) | estudar mecanismo, timing, acessibilidade | publicar componente sem adaptar |
| [Animmaster](https://animmasterlib.dev/) | repertório (produto pago) | não (não há método de instalação) | pesquisa e comparação | copiar efeito |

---

## GSAP

- **Versão 3.15.0.** Desde a 3.13 o GSAP inteiro é gratuito, inclusive os plugins que eram pagos e inclusive para uso comercial (licença "no charge" padrão: <https://gsap.com/standard-license>).
- **Plugins disponíveis na versão instalada** (`node_modules/gsap/dist`): ScrollTrigger, SplitText, Flip, MotionPathPlugin, MotionPathHelper, DrawSVGPlugin, MorphSVGPlugin, Observer, ScrollSmoother, ScrollToPlugin, ScrambleTextPlugin, TextPlugin, CustomEase, CustomBounce, CustomWiggle, EasePack, Draggable, InertiaPlugin, Physics2DPlugin, PhysicsPropsPlugin, CSSRulePlugin, EaselPlugin, PixiPlugin, GSDevTools.
- **Usados hoje:** ScrollTrigger (9 arquivos) e SplitText (`MotionRoot`). O resto não entra no bundle.
- **Regra:** carregar o plugin só no componente que usa. `gsap.registerPlugin()` no topo do módulo que importa (é idempotente). Não importar `gsap/all`.
- Traço de SVG: o site desenha com `pathLength="1"` + `stroke-dasharray` (CSS ou atributo animado pelo GSAP), sem DrawSVG. MorphSVG e MotionPath ficam para quando a experiência pedir.

## Three.js

- **Versão 0.186.1**, puro (sem React Three Fiber nem drei). Uma cena só ([buraco-negro/](../src/components/3d/buraco-negro/)), em dois lugares: o buraco negro do Sobre ([BuracoNegro.tsx](../src/components/3d/BuracoNegro.tsx)) e o viajante pequeno da página Motion ([BuracoViajante.tsx](../src/components/3d/BuracoViajante.tsx)), desenhado invertido sob `mix-blend-mode: difference`. A explosão do Sobre (poeira até o fio do bloco seguinte) é canvas 2D, sem three ([explosao.ts](../src/components/3d/buraco-negro/explosao.ts)). Carregamento e contexto em comum: [carregar.ts](../src/components/3d/buraco-negro/carregar.ts).
- **Carregamento:** `import()` dentro do efeito, depois do `load` e com o navegador livre. O contexto WebGL 2 é pedido antes; sem ele (ou só com renderização por software, ou com economia de dados), o three não é baixado. Chunk próprio de ~536 KB (~133 KB gz); o JS inicial da página não muda.
- **Laço:** o ticker do GSAP, o mesmo do Lenis. Nada de `requestAnimationFrame` próprio nem estado React por quadro: a cena lê um objeto mutável e escreve em uniforms.
- **Custo:** DPR até 1,5 e teto de 2,8 milhões de pixels no canvas. Fora da tela, nada é desenhado. Abaixo de ~42 quadros por segundo, a cena baixa a resolução e depois metade da geometria. Medido numa Intel UHD integrada a 1920×1080, com MSAA e cena completa: de 3,7 a 5,4 ms por quadro (página inteira).
- **Limpeza:** geometrias, materiais e renderer descartados, e o contexto é perdido de propósito ao sair da página (20 idas e voltas, nunca mais de um contexto vivo).

## Motion

- **Versão 14.0.0**, instalada para experiências futuras. Nenhum componente importa: o bundle não mudou (medido, ver [auditoria-engenharia.md](auditoria-engenharia.md#8-medições)).
- Em componente cliente: `import { motion } from "motion/react"`. Em componente servidor: `import * as motion from "motion/react-client"`. Nunca `framer-motion`.
- Movimento reduzido: `useReducedMotion()` ou `<MotionConfig reducedMotion="user">`, além da classe `motion` do site.

### Motion ou GSAP

| Prefira Motion para | Prefira GSAP para |
|---|---|
| gestures (drag, hover, tap com física) | scroll choreography |
| springs | timelines complexas |
| animação React local, presa ao estado do componente | SVG |
| layout transitions (`layout`, `layoutId`) | MotionPath |
| entrada e saída com `AnimatePresence` | ScrollTrigger (pin, scrub) |
| | sequências narrativas |

**Nunca deixar Motion e GSAP controlando a mesma propriedade do mesmo elemento.** Se um elemento tem tween do GSAP em `transform`, o Motion não toca nele (e vice-versa).

## Motion AI Kit (ação manual pendente)

O instalador oficial (`npx motion-ai`) é interativo e sai com "motion-ai is interactive — run it in a terminal" quando não há terminal. O código dele foi lido antes (pacote `motion-ai@14.1.0`, repositório `motiondivision/ai-kit`); não foi improvisada instalação manual.

**Passo manual** (no terminal do VS Code, na raiz do projeto):

```bash
npx motion-ai@14.1.0
```

1. Install scope: **Project**
2. Agents: marcar **Claude Code (.claude)** (espaço) e Enter
3. Install now? **Yes**

O que ele cria (conferido no código do pacote):
- `.claude/skills/motion/` (skill `/motion`: boas práticas, docs, CSS spring, transition preview, performance audit)
- `.claude/agents/motion-reviewer.md` (agente de MotionScore para auditar várias áreas)
- `.mcp.json` na raiz, com merge se o arquivo existir: `motion` → `https://mcp.motion.dev` (aberto, sem login) e `motion-plus` → `https://mcp.motion.dev/plus` (OAuth)

Depois:
- Reiniciar o Claude Code e aprovar os servidores do `.mcp.json` quando ele perguntar. `/mcp` mostra o estado.
- `motion-plus` pede login pelo próprio Claude Code (`/mcp` → motion-plus → autenticar). **MotionScore exige assinatura Motion+.** Não há chave para colar em arquivo.
- `.claude/` está no `.gitignore`: a skill e o agente ficam só nesta máquina. O `.mcp.json` tem só URLs públicas e pode ir para o git.

## Anime.js

- **Versão 4.5.0, MIT.** Módulos ESM separados (`animejs`, `animejs/svg`, `animejs/text`, `animejs/timer`, `animejs/scope`, `animejs/utils`...). `three` é peer opcional; está instalado por causa do buraco negro (Sobre e Motion), e nenhuma experiência com Anime.js o usa.
- **Classificação: toolkit experimental / secundário.** Útil para pequenos experimentos, animação de texto, SVG, WAAPI e protótipos isolados.
- No produto principal, o GSAP continua sendo o motor. Anime.js e GSAP nunca na mesma experiência.

## Genjutsu

- **Instalado:** 3.3.0, plugin de usuário (`genjutsu@genjutsu`, `~/.claude/plugins`). Vale para todos os projetos desta máquina.
- **Disponível na 3.3.0:** `/genjutsu:cast` (propõe uma *interaction thesis* antes de escrever código e carrega os módulos certos) e `/genjutsu:paint` (brainstorm, design system, implementação e auditoria). Módulos: motion-principles, gsap, framer-motion, css-native, canvas-generative, threejs-r3f, design-audit, desktop-principles, mobile-principles e uma cópia própria do UI/UX Pro Max.
- **Não disponível na 3.3.0:** o catálogo de *tells* (42 padrões que um modelo produz sem ninguém pedir) entrou na **4.0.0, marcada como breaking**; o `/genjutsu:bunshin` (site inteiro com time de subagentes) entrou na 4.1.0 (30/09/2026). Não foi atualizado: upgrade major é decisão manual.
  ```bash
  claude plugin marketplace update genjutsu
  claude plugin update genjutsu@genjutsu     # reiniciar o Claude Code depois
  ```
- **Guardrails:**
  - **`/genjutsu:paint` nunca neste repositório.** O próprio protocolo dele para projeto existente é substituir os tokens e estilos pelo design system novo ("the thesis overrides it"). Em site de cliente, só no começo, antes de existir código, ou num branch separado.
  - **`/genjutsu:cast`** é o uso principal aqui: uma experiência por vez, adaptando ao código que existe, sempre filtrado pelo MASTER.
  - **`bunshin`** não roda em projeto existente.

## UI/UX Pro Max

- **Instalado:** 2.13.0, plugin de usuário (`ui-ux-pro-max@ui-ux-pro-max-skill`). Skills: `ui-ux-pro-max` e as subskills `design`, `design-system`, `brand`, `ui-styling`, `banner-design`, `slides`.
- **Por que não foi instalado de novo no projeto** (`npx ui-ux-pro-max-cli init --ai claude`): o CLI copiaria as mesmas 7 skills para `.claude/skills/`, duplicando nomes genéricos (`design`, `brand`, `slides`) ao lado das do plugin, e `.claude/` está no `.gitignore`, então a cópia não seria versionada. A versão mais nova do CLI é a 2.15.0 (mesma contagem de dados, CSVs revisados). Para atualizar sem duplicar:
  ```bash
  claude plugin marketplace update ui-ux-pro-max-skill
  claude plugin update ui-ux-pro-max@ui-ux-pro-max-skill   # reiniciar depois
  ```
- **Python:** os scripts rodam com `python` (3.12 nesta máquina). `python3` aqui é o atalho da Microsoft Store e não funciona; a skill já tenta `python`, depois `python3`, depois `py -3`.
- **Design system persistente:** a convenção nativa é `design-system/<projeto>/MASTER.md` + `pages/<página>.md` (a página sobrescreve o MASTER). O da NADA está em [design-system/nada-studio/](../design-system/nada-studio/MASTER.md), escrito à mão a partir do código. O `--persist` não sobrescreve um MASTER que existe; **nunca usar `--force` nele**.
- **Uso no site da NADA:** `--domain ux`, `--stack nextjs` e revisão de acessibilidade/responsivo. `--design-system` só em projeto novo, como ponto de partida para discutir, nunca como identidade pronta.

## React Bits

**Estado: REFERÊNCIA DISPONÍVEL — REGISTRY PRO NÃO CONFIGURADA.**

- Biblioteca gratuita, licença MIT + Commons Clause (uso pessoal e comercial liberado; não pode revender a biblioteca). Cada componente tem 4 variantes (JS/TS × CSS/Tailwind) e dependências próprias (gsap, motion, three, ogl): conferir antes de usar.
- **Catálogo para agentes:** <https://reactbits.dev/llms.txt> (lista todos os componentes com o nome de CLI). É o jeito não invasivo de consultar.
- **CLI por componente** (exige config do shadcn ou do jsrepo):
  ```bash
  npx shadcn@latest add https://reactbits.dev/r/<Componente>-TS-TW
  npx jsrepo@latest add https://reactbits.dev/r/<Componente>-TS-TW
  ```
- **MCP:** o React Bits usa o MCP do shadcn (`npx shadcn@latest mcp init --client claude`) com o registry `"@react-bits": "https://reactbits.dev/r/{name}.json"` no `components.json`. Este projeto não usa shadcn, então **não foi inicializado** só para isso. Fica como opção para projeto que já use shadcn.
- **React Bits Pro:** registry separado e com licença (`@reactbits-starter`), configurado com chave no `components.json`. Não há licença configurada. Nunca inventar chave, registry ou token.

### Política de uso

**Pode:** estudar mecanismo, timing, interação, estrutura, acessibilidade e comportamento responsivo.

**Não pode:** copiar visualmente um componente e publicar sem adaptação.

Todo uso passa pelo filtro: **isso parece NADA Studio (ou o cliente) ou parece React Bits?** Se parece biblioteca, refazer.

## Animmaster

- **O que é:** catálogo pago de componentes animados (cerca de 60% HTML/CSS/JS, 30% React, 10% Next), entregue por pasta no Google Drive depois da compra. Não tem pacote npm, CLI, registry, MCP nem skill. Não foi criado pacote fictício.
- **Papel:** repertório de motion e interação. Pesquisa, comparação, inspiração técnica, descoberta de padrões.
- **Nunca:** copiar dez efeitos diferentes para a mesma página. Mesmo filtro do React Bits.

## Outras ferramentas já presentes

| Ferramenta | Onde | Para quê |
|---|---|---|
| `avoid-ai-writing-ptbr` | skill do projeto (`.claude/skills/`) | copy em português sem cara de IA, com as regras de texto da NADA |
| `higgsfield-*` | skills do projeto (`.agents/skills/`) | imagem, vídeo e brand kit |
| `design:accessibility-review`, `design:design-critique` | plugin de usuário | auditoria WCAG e crítica de design |
| `cloudflare:web-perf` | plugin de usuário | Core Web Vitals e Lighthouse |
| Next.js docs locais | `node_modules/next/dist/docs/` | API da versão instalada (o AGENTS.md manda ler antes de codar) |
