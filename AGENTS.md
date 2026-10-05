<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nada-rules -->
# NADA Studio: regras do projeto

Este repositório é o site da NADA Studio e a implementação de referência da engenharia frontend da NADA. Não é template visual: em site de cliente, leva-se a engenharia, nunca a identidade.

Ler antes de mexer:
- visual ou motion → `design-system/nada-studio/MASTER.md` (e `pages/<página>.md`, que vale sobre o MASTER)
- engenharia, primitives, padrão de motion, budget → `docs/NADA-SITE-ENGINEERING-BASE.md`
- ferramentas (GSAP, Motion, Anime.js, Genjutsu, UI/UX Pro Max, React Bits, Animmaster) → `docs/frontend-toolbox.md`
- site novo de cliente → `docs/NADA-FRONTEND-BLUEPRINT.md`
- entrega → `docs/NADA-SITE-QA.md`; diagnóstico atual → `docs/auditoria-engenharia.md`

Regras:
- Preto e branco. Sem glassmorphism, gradiente decorativo, card de SaaS, sombra de profundidade, bento sem função, 3D sem narrativa. Máscara só em círculo, nascendo do ponto; nunca reveal retangular.
- Capa de portfólio é a prévia em movimento do projeto, nunca print parado. Interface e número sempre reais.
- GSAP para scroll e timeline; Motion só para interação React local; Anime.js só em experimento isolado. Nunca duas bibliotecas na mesma propriedade do mesmo elemento. Biblioteca só é importada onde é usada.
- Toda animação passa por `movimentoLiberado()` (classe `motion`), usa `gsap.matchMedia()` com limpeza e tem estado final completo sem JS. Área de decisão (preços, contato, formulário) não se move. Celular sem pin.
- Cena de tela cheia: `position: sticky` + scrub, não `pin: true` (o pin troca o palco pra `fixed` e o Chrome conta CLS ~1 na entrada e ~1 na saída; o Antes/Depois saiu do pin em 04/10/2026). O `body` fica com `overflow-x: clip`, nunca `hidden`: com `hidden`, a trava do menu solta todo sticky da tela.
- Breakpoints, curvas e tempos só de `src/lib/motion.ts` e do `:root`. Título novo usa um papel da escala do MASTER.
- Tailwind só lê `src/` (`source("..")` em `globals.css`).
- Imagem nova em `public/portfolio`, `public/equipe` ou `public/motion`: `node scripts/imagens.mjs`. Vídeo novo da página Motion: `node scripts/motion.mjs` (o bruto fica em `brutos/motion/`, fora de `public/` e do git). Arquivo trocado ganha nome novo.
- `/genjutsu:paint` nunca neste repositório (substitui os tokens existentes); usar `/genjutsu:cast`, uma experiência por vez. `bunshin` não roda aqui. UI/UX Pro Max: nunca `--persist --force` em `design-system/nada-studio`.
- Copy pública passa pela skill `avoid-ai-writing-ptbr`. A marca é "NADA Studio" ou o logotipo, nunca "NADA" solto.
- Antes de entregar: `npm run lint`, `npx tsc --noEmit`, `npm run build` e os scripts de `scripts/qa/`.
<!-- END:nada-rules -->
