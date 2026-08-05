Auditoria de copy + foto do fundador + prova social (NADA Studio)

Objetivo:
Fechar 3 pendências no site Next.js da NADA Studio, sem recriar nada do zero:
1. Auditar todo o copy do site e remover manias de escrita de IA.
2. Inserir a foto do fundador na seção Trust, tratada em P&B conforme design system.
3. Adicionar dentro da seção Trust um bloco "o que já construímos", mostrando os projetos reais do portfólio como prova de execução (ainda não há case de cliente — ver pendências).

Contexto:
Projeto já avançado (ver docs/contexto-projeto.md e docs/instrucao-finalizacao.md). Seções existentes em src/components/sections/: Problem, WhatWeDo, Ecosystem, HowItWorks, Membership, ForYouToo, WhyNada, Trust, FAQ, CTA. Marcadores editoriais ( Nome ) 00X já numerados 001–010 — não renumerar, os itens novos entram como sub-blocos dentro da seção Trust existente.

Design system: só #000000 e #FFFFFF, 1–2 seções com fundo invertido, objetos 3D glossy, marcadores editoriais, faixa "do nada nasce tudo ·" em loop, headers provocativos em pares. Fonte da verdade de cor é o design system do código, não inventar tom fora dele.

Portfólio real da operação (para o bloco de prova social — três frentes, ver docs/CONTEXTO_INICAL): NADA Studio (o próprio site, Next.js + Three.js), Hub interno (ferramenta de gestão com Eric, Netlify + Supabase), J.Vision Finance / No Azul (app financeiro pessoal, Cakto + Supabase).

Instruções:

1) Auditoria anti-IA
- Rodar a skill avoid-ai-writing (já instalada) em cada string de copy de src/data/content.ts e em qualquer texto hardcoded nos componentes de seção.
- Focar nos pontos de maior risco pro tom da marca: travessão em excesso, bullet com header em negrito repetindo a própria ideia, "não é X, é Y", intensificadores ocos (genuíno, realmente), linguagem promocional de folheto ("vibrante", "aninhado"), conclusões genéricas.
- Devolver: lista do que foi encontrado com o texto original citado, versão reescrita, e resumo do que mudou. Preservar 100% do significado e dos dados técnicos (preço, modelo de cobrança etc.) — só a forma muda.
- Manter o tom da marca: informal, direto, sem tecniquês, headers provocativos em pares.

2) Foto do fundador na seção Trust
- Arquivo da foto: Joao_IMG.jpeg (já está no repo). Assumindo pasta public/ ou public/images/ — conferir caminho exato antes de rodar e ajustar o import se estiver em outro lugar.
- Tratar em preto e branco / duotone puro (#000000 / #FFFFFF), nunca em cor, pra bater com o design system.
- Componente: círculo ou frame retangular com borda fina, mesma lógica visual da logo (respiro em volta, nunca espremer).
- Legenda curta abaixo: nome + "fundador" ou equivalente — decidir o texto exato na hora, tom direto, sem cargo pomposo.
- Posição: dentro de Trust.tsx, ao lado ou acima do bloco de prova social do item 3 — testar os dois e manter o que ficar mais limpo no grid.

3) Bloco "o que já construímos" dentro de Trust
- Marcador editorial: reaproveitar o número da seção Trust já existente (não criar 011) — o bloco é um sub-título dentro da mesma seção.
- Formato: grid de 3 cards, um por projeto do portfólio real listado no Contexto acima.
- Cada card: nome do projeto, uma frase curta do que ele faz (sem enrolação, sem "revolucionário"/"transformador"), badge discreta com a stack (ex: "Next.js + Three.js").
- Enquadramento honesto: isso não é case de cliente (ainda não existe, é pendência aberta) — é prova de capacidade de execução própria. Não fabricar depoimento nem número de resultado que não existe. Frase de abertura do bloco algo como "construído e no ar" ou "o que já colocamos de pé" — testar 2 opções curtas.
- Objetos 3D ou ícone simples P&B por card, sem foto de tela (screenshot quebraria o estilo editorial).

Restrições:
- Não usar cor fora de #000000/#FFFFFF.
- Não inventar métrica, depoimento ou cliente que não existe.
- Não recriar seções do zero, não renumerar marcadores existentes.
- Não copiar estrutura/copy literal de noth.in ou igloo.inc.
- Sem emoji em nenhum lugar do site.
- Seguir os limites da skill avoid-ai-writing (travessão, bullet com bold, intensificador oco, etc.) em qualquer texto novo gerado pros cards e legenda.

Estilo/Tom:
Português informal, direto, sem tecniquês — fala com comerciante, não com dev. Emocional no slogan, credibilidade no nome, nunca fofo demais.

Formato de saída esperado (de quem rodar este prompt no repo):
1. Diff/lista da auditoria de copy (antes → depois).
2. Código do componente de foto dentro de Trust.tsx.
3. Código do bloco "o que já construímos" (3 cards) dentro de Trust.tsx.
4. Nota final confirmando: nenhuma cor fora do design system, nenhum marcador renumerado, nenhum dado inventado.
