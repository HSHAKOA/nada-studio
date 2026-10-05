# NADA Studio · Design system (MASTER)

Fonte de verdade do sistema visual **que já existe** no site, extraída do código em 03/10/2026. Não é proposta: cada valor aqui está em `src/`. Quando o código mudar, este arquivo muda junto, no mesmo commit.

- **Hierarquia (convenção do UI/UX Pro Max):** se existir `pages/<página>.md`, as regras dele valem sobre este arquivo naquela página. Páginas com arquivo próprio: [home](pages/home.md), [portfolio](pages/portfolio.md), [motion](pages/motion.md), [como-funciona](pages/como-funciona.md), [sobre](pages/sobre.md).
- **Proteção:** o UI/UX Pro Max não sobrescreve este arquivo sem `--force`. Nunca rodar `--design-system --persist --force` para `nada-studio`.
- **Isto é a identidade da NADA.** Não reaproveitar em site de cliente. A engenharia reaproveitável está em [docs/NADA-SITE-ENGINEERING-BASE.md](../../docs/NADA-SITE-ENGINEERING-BASE.md).

Arquivos-fonte: [globals.css](../../src/app/globals.css) (tokens, componentes, motion em CSS), [motion.ts](../../src/lib/motion.ts) (breakpoints, curvas, tempos), [ponto.ts](../../src/lib/ponto.ts) (o ponto da marca), [components/](../../src/components/).

---

## 1. Marca

### Cor

| Papel | Valor | Onde |
|---|---|---|
| Fundo | `#fff` (`--background`) | `body` |
| Tinta | `#000` (`--foreground`) | `body`, títulos |
| Seção escura | fundo `#000`, texto `#fff` | `.section-invert`, `[data-escuro]` |
| Seleção | fundo `#000`, texto `#fff` | `::selection` |

Não existe cor de destaque. A hierarquia é feita com **alfa do preto ou do branco**:

| Alfa | Uso |
|---|---|
| /75 a /80 | corpo forte: manifesto, itens marcados, citação |
| **/70** | corpo secundário padrão (64 usos de `text-black/70`) |
| /65 | apoio em listas e no case |
| /55 a /60 | metadado, legenda, eyebrow (`.eyebrow` = .55; no escuro .6) |
| /40 a /45 | numeração de lista, rótulo apagado |
| /10 e /15 | fios e bordas; /25 na borda do botão secundário |

Exceções reais (as únicas):
- `.metal`: gradiente cromado na palavra variável do título rotativo (hero da home e IA para empresas). Uma passada de brilho quando a palavra chega; na última frase, a passada se repete a cada 4 s com o título na tela ([TituloRotativo.tsx](../../src/components/TituloRotativo.tsx)).
- `.luz`: na chegada do título rotativo, uma faixa clara atravessa as palavras pretas uma vez, na ordem de leitura, e termina no cromo; no título da página Motion, passa pela frase digitada. Só existe durante a passada ([luz.ts](../../src/lib/luz.ts)).
- Cor de interface de cliente só aparece **dentro** da mídia do portfólio (vídeo ou print real).
- Retratos dos sócios na página Equipe: em cor, sem filtro (decisão do João, 03/10/2026).
- Logos da lista Ferramentas, na página Sobre: cada um na cor da própria marca, com o nome em preto /70 (decisão do João, 04/10/2026; ver [pages/sobre.md](pages/sobre.md)). O logo do Instagram no bloco 004 do Sobre segue a mesma regra.
- `box-shadow` só como fio (`0 0 0 1px`) em capa clara e como brilho do ponto na abertura (intro e `AberturaNada`).
- `bg-white/85 backdrop-blur-md` no cabeçalho rolado: legibilidade sobre o conteúdo. É o único blur de fundo do site e não é glassmorphism. O outro desfoque é de passagem: na onda da lista Ferramentas, cada logo sai de foco e volta.
- Buraco negro do Sobre ([BuracoNegro.tsx](../../src/components/3d/BuracoNegro.tsx)): tinta sobre papel, só alfa do preto, e papel onde o disco passa na frente da sombra. O halo em volta da sombra é a zona de distorção da cena, não gradiente decorativo.

### Logotipo

- `NadaWordmark` ([NadaWordmark.tsx](../../src/components/NadaWordmark.tsx)), gerado de `public/nada-wordmark.svg`. Não editar os paths à mão.
- Cada letra é um path com `data-letra` e `pathLength="1"`, o que permite desenhar o traço na intro e na abertura. STUDIO fica em `data-studio`.
- Cor pelo `fill` herdado: preto; `fill-white` no rodapé. Larguras em uso: 120 px (cabeçalho e rodapé) e `min(64vw, 560px)` (intro).
- A marca nunca aparece como "NADA" solto em texto corrido: ou é o logotipo, ou "NADA Studio".

### O ponto

- Círculo preto de 10 px (`--ponto`, `PONTO_PX`), classe `.ponto`, componente `Ponto` com `data-papel` no DOM.
- Roteiro e papéis em [ponto.ts](../../src/lib/ponto.ts): nascimento (intro), origem e queda (hero), impacto (Antes/Depois), passagem (O que fazemos), retorno (chamada final), raiz (ecossistema), marca (página atual no menu, linha ativa do portfólio).
- Só aparece quando tem papel. Em área de leitura ou de decisão, ausente.
- Ponto final de título: `.ponto-final` (0,19em), o ponto da marca no lugar do glifo.

### Marcadores

- `SectionMarker`: `( nome ) 00X`. Eyebrow de 13 px, caixa alta, 0,14em. Numeração por página, três dígitos, em `sectionMarkers` ([content.ts](../../src/data/content.ts)).
- Entrada: os parênteses se abrem (1,1 s, `power2.inOut`) e o número sobe pela própria linha.
- Marcador fixo da margem (≥ 1360 px): o número da seção atual à esquerda, branco com `mix-blend-mode: difference`, trocando com rolagem de dígito.
- Variações: `( cliente ) 01` e `( nosso ) 03` nas capas, `( ANTES )`, `( motion ) 01`, `( sócio ) 01`.

---

## 2. Tipografia

| Variável | Família | Pesos carregados | Uso |
|---|---|---|---|
| `--font-display` | Archivo (next/font, latin) | 600, 700, 900 | h1 a h3, números grandes, capas |
| `--font-body` | Inter (next/font, latin) | 400, 500 | corpo e interface |

Base (`@layer base`): h1, h2 e h3 em Archivo 700, `letter-spacing: -0.02em`, `line-height: 1.05`, `text-wrap: balance`. Parágrafo com `line-height: 1.6`.

Escala de títulos em uso (valor real e papel):

| Papel | Tamanho | Peso / entrelinha / tracking | Onde |
|---|---|---|---|
| Manifesto | `clamp(64px, 16vw, 232px)` | 900 / 0.86 / -0.055em | Sobre |
| Número de prova | `clamp(120px, 19vw, 300px)` (BA) · `clamp(64px, 12vw, 184px)` (case) | 900 / 0.8 a 0.9 / -0.05 a -0.06em | Antes/Depois, case |
| Erro | `clamp(56px, 10vw, 148px)` | 900 / 0.9 / -0.045em | 404 |
| Chamada final | `clamp(44px, 8vw, 112px)` | 900 / 0.95 / -0.04em | CTA |
| Título da página Motion | `clamp(44px, 6.8vw, 104px)` | 900 / 0.95 / -0.045em | /motion |
| Hero | `clamp(42px, 6.5vw, 78px)` | 900 / 1.02 / -0.035em | Home |
| H1 do case | `clamp(40px, 5.5vw, 72px)` | 900 / 0.95 / -0.035em | case |
| H1 de página | `clamp(36px, 5vw, 64px)` (IA: `clamp(36px, 5.6vw, 76px)`) | 700 | portfólio, equipe, IA |
| **H2 de seção (padrão)** | **`clamp(32px, 4.2vw, 52px)`** | 700 / 1.05 / -0.02em | 16 usos + `.ba-titulo` |
| H2 secundário | `clamp(28px, 3.4vw, 44px)` | 700 | grupos do portfólio, Ferramentas, Hub |
| H3 grande | `clamp(24px, 2.8vw, 34px)` | 700 | manchete do Antes/Depois, diagnóstico |
| H3 de lista | `clamp(22px, 2.6vw, 32px)` | 700 | serviços, ferramentas do Hub |
| Destaque | `clamp(20px, 2.4vw, 26px)` | 600 | fecho dos sintomas |

Corpo:

| Papel | Tamanho | Cor |
|---|---|---|
| Lead | 18 px (hero: 18 → 20 px a partir de 768) · `clamp(18px, 1.7vw, 22px)` no manifesto | /70 |
| Corpo de lista | 17 px | /70 a /80 |
| Corpo pequeno, resposta | 15 px | /65 a /70 |
| Meta | 13 px | /55 a /60 |
| Rótulo em caixa alta | 11 px, tracking 0.18em | /55 |
| Eyebrow | 13 px, 500, 0.14em, caixa alta | .55 (no escuro .6) |

Números de marcador e da margem usam `font-variant-numeric: tabular-nums`.

A escala tem quase duplicatas (por exemplo `clamp(28px, 3.6vw, 44px)` e `clamp(26px, 3.4vw, 44px)` ao lado de `clamp(28px, 3.4vw, 44px)`); a lista completa está em [auditoria-engenharia.md](../../docs/auditoria-engenharia.md). **Título novo usa um papel desta tabela, não um clamp inventado.**

---

## 3. Layout

| Token | Valor | Onde |
|---|---|---|
| Largura máxima | 1200 px | `.wrap` |
| Gutter | `clamp(20px, 5vw, 48px)` | `.wrap` |
| Medida de leitura | 60ch | `.prose-measure` |
| Grade | 12 colunas a partir de 768 (5/7, 1/7/4, 6 com início na 7) | seções |
| Seção | padding vertical `clamp(72px, 12vw, 180px)` | `.section` |
| Seção que encosta | topo `clamp(48px, 6vw, 96px)` | `.section-encosta` |
| Subseção | `clamp(56px, 8vw, 112px)` | case, galeria, continuações do Sobre |
| Respiro do cabeçalho | `pt-24` (96 px) no `<main>` das páginas internas; o hero usa `pt-28` | páginas |
| Marcador → título | 24 px (`mb-6`) | `SectionMarker` |

Duas seções seguidas somam os dois paddings: o espaço padrão entre seções é de 144 a 360 px. Por isso existem `section-encosta` e `pt-0`.

Breakpoints (`BP` e `MQ` em [motion.ts](../../src/lib/motion.ts), espelhados no CSS):

| Nome | Valor | O que muda |
|---|---|---|
| sm | 640 | pontual: sintomas em 2 colunas, coluna de entrega no índice |
| md (tablet) | 768 | grade de 12 colunas, palco preso (sticky) do Antes/Depois, viagens do ponto, índice com prévia lateral |
| lg (desktop) | 1024 | ecossistema em árvore horizontal, prévia flutuante (com mouse), ímã do CTA |
| menu | 1180 (`--breakpoint-menu`) | menu completo e botão no cabeçalho; abaixo disso, menu do celular e WhatsApp fixo |
| margem | 1360 | marcador fixo na margem |
| mouse | `(hover: hover) and (pointer: fine)` | Lenis, ímã, prévia que segue o ponteiro |

---

## 4. Componentes

### Botões (`.btn`)
- Canto reto. Altura mínima de 48 px, padding 12 × 26, 15 px peso 500, borda de 1 px.
- `btn-primary`: preto com texto branco (invertido sobre fundo escuro). `btn-secondary`: transparente com borda `rgba(0,0,0,.25)`.
- Hover (só com hover real): o fundo enche de baixo para cima (`scaleY`, 0,45 s, `--ease-out`), a cor inverte e a seta sai pela direita enquanto a cópia dela entra pela esquerda. É transição, não keyframe: sair no meio volta do ponto em que está.
- `btn-pill`: só o botão do cabeçalho. Pílula, com o texto trocando por máscara (`.rolo`).
- Chamada final: `min-h-14 px-9 text-base`, com ímã (só ponteiro fino a partir de 1024).

### Links
- `.link-u`: sublinhado de 1 px que entra pela esquerda e sai pela direita (0,45 s). A seta (`.seta`) anda 4 px no hover.
- Links de lista e de rodapé com `py-3`, para dar alvo de toque de 44 px.

### Listas editoriais (o padrão do site no lugar de cards)
- Fio no topo (`.regua-topo`) e em cada item (`.regua`), com opacidade .15, desenhado da esquerda na entrada (`data-entra="linha"`).
- Item: número pequeno (/40), título grande, resposta curta. Sem ícone, sem caixa.
- Usado em sintomas (marcáveis), serviços, capacidades (Motion), frentes (IA), índice do portfólio e ferramentas do Hub.

### Cabeçalho (`Navbar`)
- Fixo e transparente no topo. Rolado: `bg-white/85 backdrop-blur-md border-b border-black/10`.
- Recolhe ao descer (depois de 160 px, com tolerância de 8 px) e volta ao subir. O foco de teclado segura o cabeçalho aberto.
- A partir de 1180: sete links e o botão pílula; a página atual tem o ponto (5 px) antes do rótulo; no hover, as letras do link sobem e a cópia entra por baixo, uma depois da outra, da esquerda pra direita (`TrocaDeLetras`: animação CSS de translate, no compositor, pra não brigar com o desfoque do cabeçalho).
- Abaixo de 1180: botão de duas linhas (44 px) e menu de tela cheia branco com links centralizados. Trava o scroll, deixa `main` e `footer` inertes e fecha no Esc.

### Rodapé (`Footer`)
- Preto. A faixa "do nada nasce tudo" (`Marquee`) corre entre dois fios, com velocidade e inclinação ligadas ao scroll.
- Quatro colunas (`1.2fr 1fr 1fr 1fr`): marca, frase e ícones sem caixa (só o ícone, com área de toque de 44 px); navegação; serviços; contato. Selos como texto puro, sem borda (decisão do João, 04/10/2026). Linha final em 12 px.
- Sem retrato dos sócios: as fotos só aparecem na página Equipe (decisão do João, 03/10/2026).

### Chamada final (`CTA`)
- Seção preta no fim de toda página (`#comecar`), com o conteúdo por props. Na entrada, o ponto reaparece no respiro de cima e abre a seção num círculo. Botão com ímã.

### Caixas
Não há card no sentido de SaaS. As caixas que existem:
- Diagnóstico gratuito (Formatos): bloco preto chapado, `p-8 md:p-12`.
- Formatos: colunas separadas por fio (`divide-x`), sem fundo e sem sombra.

### Contato fixo (`WhatsAppFixo`)
- Abaixo de 1180: botão largo na base. Aparece depois de 70% da primeira tela, inverte sobre fundo escuro e some quando a chamada final ou o rodapé entram. Escondido, também sai do teclado (`inert`).

### Capas
Sistema próprio do portfólio. Ver [pages/portfolio.md](pages/portfolio.md).

### Foco e alvo de toque
- Contorno de 2 px com offset de 3 px, preto no claro e branco no escuro. Nunca removido.
- Alvos de toque a partir de 44 px (`min-h-11`).

---

## 5. Motion

Vocabulário (CSS `:root` e [motion.ts](../../src/lib/motion.ts)):

| Papel | CSS | GSAP | Tempo |
|---|---|---|---|
| Entrada: chegar e assentar; interação | `--ease-out` `cubic-bezier(.16,1,.3,1)` | `expo.out` | 0,9 s nas entradas, 0,28 s na UI |
| Saída: um pouco mais rápida que a entrada | `--ease-in` `cubic-bezier(.7,0,.84,0)` | `power3.in` | 0,16 s na UI, 0,5 s em cena |
| Transformação: um estado virando outro | `--ease-inout` `cubic-bezier(.87,0,.13,1)` | `expo.inOut` | por cena |
| Narrativa | (sem curva) | `ease: "none"` com scrub | o scroll dita o ritmo |
| UI | `--t-ui` 200 ms (cor, opacidade, borda) · `--t-mov` 280 ms (rolo, seta) · `--t-saida` 160 ms | `DUR.ui`, `DUR.movimento` | |

Exceções que o código documenta: marcador (`power2.inOut`, 1,1 s), quedas e impactos do ponto (`power2.in`), ímã (`power3`, 0,5 s).

Padrões de entrada (`MotionRoot`, um disparo cada):

| `data-entra` | O que faz | Gatilho |
|---|---|---|
| `titulo` | as linhas sobem pela própria linha de base (SplitText com máscara), 0,9 s, stagger .08 | `top 90%` |
| `linha` | a régua se desenha da esquerda (1 s); em lote, 70 ms entre itens | `top 92%` |
| `imagem` | a moldura aparece (0,7 s) e o miolo assenta de 1.07 para 1 (1,3 s) | `top 92%` |
| `marcador` | os parênteses se abrem e o número sobe | `top 80%` |

Texto corrido não anima.

- **Retrato do sócio** (`RetratoSocio`, página Equipe): a foto se aproxima com o scroll. Cresce de 1 a 1,1 dentro do quadro, que não se mexe, enquanto ele sobe do pé da tela até o meio (scrub 0,6, `ease: "none"`), a partir da altura da testa, e recua na volta. Sem pin, então vale também no celular. No lugar do assentar de 1.07 a 1 das outras imagens.
- **Frase do sócio** (`FraseSocio`, página Equipe): duas batidas. A primeira metade da frase sobe pela linha de base, como os títulos; a segunda começa 0,6 s depois, como quem fala e depois conclui. Um disparo (`top 90%`); lado a lado, a segunda frase começa 0,2 s depois da primeira.
- **Título rotativo** (`TituloRotativo`, hero da home e IA para empresas): linha fixa e frases que se revezam embaixo, cada uma com a palavra em cromo. Na chegada, a luz atravessa o título em velocidade constante (18 em/s), palavra por palavra, e termina no brilho do cromo. As frases dão uma volta e param na última, cujo cromo brilha a cada 4 s (pausa fora da tela). Movimento reduzido: a primeira frase, parada.
- **Retrato do sócio no hover** (`RetratoSocio`): com mouse, a foto se aproxima até 1,1 quando o ponteiro passa por cima (0,8 s, `--ease-out`); no toque, a aproximação continua sendo a do scroll. Nunca as duas juntas.
- **Buraco negro do manifesto** (`BuracoNegro`, página Sobre): WebGL (three) atrás do título, que continua HTML. A narrativa anda com o scroll, do topo até o centro do buraco chegar a 20% da tela (scrub 0,8): primeiro só a sombra, o anel e poucos traços; depois o disco acende; por fim a poeira chega, de dentro pra fora. Paralaxe de 60 px na seção e mouse de poucos graus (só ponteiro fino a partir de 1024). Celular: a mesma narrativa uma vez, em 4 s. Movimento reduzido: um quadro parado, completo. Os parâmetros ficam em [config.ts](../../src/components/3d/buraco-negro/config.ts).
  - Passagem pro bloco 002 (a partir de 768 px): a poeira explode, desce em arco e pousa alinhada no fio que abre o "Pra quem", que então aparece no lugar dela. Scrub entre o centro do buraco a 40% da tela e o fio a 60%; rolando de volta, ela volta. Os grãos são um canvas 2D fixo por cima da página, só durante a passagem ([explosao.ts](../../src/components/3d/buraco-negro/explosao.ts)); a poeira do WebGL some quando eles saem e o disco esvazia. O fio fica escondido por `--fio` até o pouso.
- **Buraco viajante** (`BuracoViajante`, página Motion): a mesma cena, pequena, atravessa o título e as três frentes conforme a página desce, com o disco acendendo no caminho, e some antes dos trabalhos. Desenhado invertido sob `mix-blend-mode: difference` (o gesto do marcador da margem): no papel fica preto e, onde passa por cima de texto, a letra vira branca. Quadrado preso (sticky) que anda por transform; sem pin.
- **Bloco do Instagram** (página Sobre): o endereço em tipografia do manifesto atravessa a tela com o scroll (transform, scrub) e os dois pontos dele são o ponto da marca, que cai (`power2.in`) e pousa na linha de base.
- **Rolagem:** Lenis só com mouse de verdade (duração 1,1, curva exponencial), rodando no ticker do GSAP. No toque, rolagem nativa. Âncoras, voltar e avançar caem no lugar certo mesmo com o pin.
- **Troca de página:** View Transitions. O conteúdo sai em 150 ms e entra em 250 ms (com 100 ms de espera); a capa do índice vira o topo do case em 450 ms (320 ms no celular).

Regras:
- Toda animação depende da classe `motion` no `<html>`, posta antes da primeira pintura quando o sistema não pede movimento reduzido. Sem ela, tudo aparece parado e completo.
- Área de decisão não se move: Formatos, botões de contato, formulários.
- No celular não há pin nem viagem do ponto, e as entradas disparam uma vez.
- Máscara só em círculo, nascendo de um ponto. Nunca retangular.
- Loop só onde o loop é o gesto: a seta dos sintomas até o primeiro clique, a faixa do rodapé, as capas em cena e em filme, a onda dos logos das Ferramentas (Sobre), o brilho do cromo na última frase do título rotativo. Nunca o texto do título se mexendo em loop.

---

## 6. Proibições

- Glassmorphism. O blur do cabeçalho é a única exceção, e é funcional.
- Gradiente decorativo ou "de IA". Exceção: `.metal` e `.luz` no título rotativo e no título da Motion.
- Card de SaaS: caixa com sombra, canto arredondado, ícone em cima.
- `box-shadow` como profundidade (só fio de 1 px).
- Reveal ou máscara retangular: wipe, cortina, quadrado abrindo.
- Bento sem função.
- 3D sem narrativa. As cenas 3D contam a marca: o NADA do Como funciona (CSS 3D), na passagem do problema para os passos; o buraco negro do Sobre (WebGL), o nada como o ponto onde tudo começa; e a mesma cena, pequena, atravessando o começo da página Motion. Um contexto WebGL por página, nunca mais de um vivo.
- Efeito copiado de biblioteca sem adaptação (React Bits, Animmaster, CodePen).
- Animação em área de decisão.
- Cor de destaque, foto de banco, ícone decorativo em lista de serviço.
- Capa que é print de página parado: a capa é a prévia em movimento do projeto.
- "NADA" solto como texto.

---

## 7. Mapa de páginas

| Página | Arquivo | Regras próprias |
|---|---|---|
| `/` | [page.tsx](../../src/app/page.tsx) | [pages/home.md](pages/home.md) |
| `/portfolio`, `/portfolio/[slug]` | [portfolio/](../../src/app/portfolio/) | [pages/portfolio.md](pages/portfolio.md) |
| `/motion` | [motion/page.tsx](../../src/app/motion/page.tsx) | [pages/motion.md](pages/motion.md) |
| `/como-funciona` | [como-funciona/page.tsx](../../src/app/como-funciona/page.tsx) | [pages/como-funciona.md](pages/como-funciona.md) |
| `/sobre` | [sobre/page.tsx](../../src/app/sobre/page.tsx) | [pages/sobre.md](pages/sobre.md) |
| `/equipe`, `/faq`, `/ia-para-empresas`, termos, privacidade, 404 | [app/](../../src/app/) | só este MASTER |
