# NADA Site QA

Checklist de entrega para todo site da NADA, este e os de clientes. Roda antes de cada publicação. O que não se aplica ao projeto é marcado como "n/a", não apagado. Limites numéricos no [performance budget](NADA-SITE-ENGINEERING-BASE.md#performance-budget).

## 0. Automático

```bash
npm run lint                                  # zero erro, zero aviso novo
npx tsc --noEmit                              # sem build antes: npx next typegen && npx tsc --noEmit
npm run build                                 # export estático em out/
node scripts/qa/bundle.mjs --comparar qa-anterior.json   # JS/CSS por página e libs importadas
node scripts/qa/classes-fora-do-src.mjs       # CSS publicado sem uso (esperado: nada)
node scripts/qa/assets.mjs                    # arquivo citado sem estar em out/, link interno quebrado
node scripts/qa/servir.mjs                    # serve out/ em http://127.0.0.1:4173 para medir
```

Guardar a medição da entrega com `node scripts/qa/bundle.mjs --salvar qa-AAAA-MM-DD.json` (fora do git, ou em `docs/` se for marco). Medir no `out/` servido, nunca no `next dev`: o dev não minifica e não faz prefetch.

## 1. Viewports

Com o DevTools em modo dispositivo, rolando a página inteira, em cada largura:

| Grupo | Larguras | Conferir |
|---|---|---|
| Desktop | 1440 | grade de 12 colunas, menu completo, efeitos de mouse, cenas fixas, marcador da margem (≥ 1360) |
| Tablet | 1024 · 900 · 800 | menu do celular abaixo do limite do menu, prévias em coluna, sem efeito de mouse no toque |
| Celular | 430 · 390 · 360 | nada transborda na horizontal, título sem palavra cortada, alvos de 44 px, botão fixo de contato, sem pin |
| Fronteiras | 767/768 · 1023/1024 · limite do menu (1179/1180 aqui) · 1359/1360 | cada lado da fronteira com o comportamento certo |

Em toda largura:
- [ ] Nada passa da borda da tela (trecho 3) e não dá para arrastar a página para o lado no celular.
- [ ] Cabeçalho não quebra em duas linhas.
- [ ] Primeira tela: título, texto e CTA visíveis sem rolar (celular inclusive).
- [ ] Imagens nítidas e sem distorção; capa e vídeo na proporção certa.
- [ ] Texto longo (nome de projeto, palavra comprida) não estoura coluna.

## 2. Estados

- [ ] **Teclado:** Tab percorre tudo em ordem; foco sempre visível; menu abre pelo teclado com o foco no primeiro link; Esc fecha e devolve o foco; acordeões abrem com Enter e Espaço; nada escondido recebe foco.
- [ ] **Toque:** nenhum hover preso depois do toque; menu, acordeões e botão fixo funcionam; um vídeo por vez; rolagem nativa (sem Lenis).
- [ ] **Hover (mouse):** botões, links, cabeçalho, capas, prévias. Sair no meio da animação volta de onde está.
- [ ] **Movimento reduzido** (DevTools → Rendering → `prefers-reduced-motion: reduce`, recarregar): tudo visível e completo, sem pin, sem vídeo tocando, sem transição de página, intro curta e parada.
- [ ] **Primeira visita** (aba anônima, ou `?intro`): intro toca uma vez, "Pular" e Esc funcionam, o scroll fica travado durante, o logotipo pousa no lugar do cabeçalho.
- [ ] **Navegação interna:** transição de página, elemento compartilhado (capa → case), página nova começa no topo, cenas reiniciam limpas.
- [ ] **Voltar:** volta para a posição de antes, inclusive depois de uma cena fixa; nenhum elemento flutuante fica preso na tela.
- [ ] **Refresh:** mantém a posição; link com `#âncora` cai na seção certa.
- [ ] **Resize:** atravessar as fronteiras de breakpoint com a página aberta não deixa `transform`, `clip-path` ou estilo preso.
- [ ] **Sem JS** (DevTools → desativar JavaScript): o conteúdo aparece (o portão de movimento solta em até 4 s; a tela preta da intro some em 6 s).
- [ ] **Economia de dados:** vídeo fica no pôster.

## 3. Técnico

- [ ] lint, `tsc` e build sem erro. Nenhum aviso novo.
- [ ] **CLS:** zero na carga (Lighthouse) **e** abaixo de 0,1 rolando a página inteira com a roda do mouse (trecho 2). O Lighthouse não pega mudança de layout durante o scroll; pin é o suspeito número um.
- [ ] **LCP, TBT, long tasks, DOM:** dentro do budget (Lighthouse mobile e trecho 1).
- [ ] **Overflow:** trecho 3 vazio em 360 px e em 1440 px.
- [ ] **Console:** sem erro nem aviso (hidratação, 404, "GSAP target not found", ScrollTrigger duplicado).
- [ ] **Assets:** `scripts/qa/assets.mjs` sem nada faltando. Imagem nova passou por `node scripts/imagens.mjs`.
- [ ] **Links:** internos pelo `assets.mjs`; externos com `target="_blank"` levam `rel="noopener noreferrer"`; WhatsApp abre com a mensagem certa.
- [ ] **404:** rota inexistente mostra a página de erro com cabeçalho visível e `noindex`.
- [ ] **Metadata:** título, descrição e `canonical` por página; imagem de compartilhamento (testar o link no WhatsApp); JSON-LD válido no Rich Results Test; `sitemap.xml` com todas as rotas; `robots.txt`.
- [ ] **Bundle:** `bundle.mjs --comparar` sem aumento inexplicado; biblioteca de animação só aparece importada onde deve.
- [ ] **CSS:** `classes-fora-do-src.mjs` vazio.
- [ ] **Prefetch:** contar os pedidos `fetch` na aba Network ao carregar a página; dentro da política do projeto.
- [ ] **Acessibilidade:** Lighthouse (acessibilidade) sem erro; contraste de texto secundário (alfa /55 a /70) conferido sobre o fundo real.

## 4. Trechos de console

Colar no console do DevTools com o `out/` servido (`node scripts/qa/servir.mjs`).

**1. Carga** (depois de a página assentar):

```js
(async () => {
  const pegar = (type) => new Promise((ok) => {
    const lista = [];
    try {
      const po = new PerformanceObserver((l) => lista.push(...l.getEntries()));
      po.observe({ type, buffered: true });
      setTimeout(() => { lista.push(...po.takeRecords()); po.disconnect(); ok(lista); }, 300);
    } catch { ok([]); }
  });
  const [lcp, cls, lt] = await Promise.all(["largest-contentful-paint", "layout-shift", "longtask"].map(pegar));
  console.table({
    "LCP (ms)": Math.round(lcp.at(-1)?.startTime ?? 0),
    "CLS na carga": +cls.filter((e) => !e.hadRecentInput).reduce((s, e) => s + e.value, 0).toFixed(4),
    "long tasks": lt.length,
    "long tasks (ms)": Math.round(lt.reduce((s, e) => s + e.duration, 0)),
    "maior long task (ms)": Math.round(Math.max(0, ...lt.map((e) => e.duration))),
    "nós no DOM": document.getElementsByTagName("*").length,
    "prefetch (fetch)": performance.getEntriesByType("resource").filter((r) => r.initiatorType === "fetch").length,
  });
})();
```

**2. CLS rolando** (colar, rolar a página inteira com a roda do mouse ou o trackpad, sem a barra de rolagem e sem PageDown, depois ler):

```js
window.__cls = 0;
new PerformanceObserver((l) => l.getEntries().forEach((e) => {
  if (e.hadRecentInput) return;
  window.__cls += e.value;
  if (e.value > 0.01) console.log("layout shift", e.value.toFixed(3), e.sources?.map((s) => s.node));
})).observe({ type: "layout-shift" });
// depois de rolar: window.__cls
```

**3. Overflow horizontal** (lista o que passa da borda sem um ancestral que recorte):

```js
(() => {
  const w = document.documentElement.clientWidth;
  const recortado = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if (o === "hidden" || o === "clip") return true;
    }
    return false;
  };
  return [...document.querySelectorAll("body *")]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > w + 1 || r.left < -1) && getComputedStyle(el).position !== "fixed" && !recortado(el);
    })
    .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 3).join(".")}`);
})();
```

**4. O que está animando agora:**

```js
({
  "animações CSS/WAAPI": document.getAnimations().length,
  "vídeos tocando": [...document.querySelectorAll("video")].filter((v) => !v.paused).length,
});
```

## 5. Registro da entrega

| Data | Commit | JS inicial máx. (gz) | CSS (gz) | LCP celular | CLS rolando | Observações |
|---|---|---|---|---|---|---|
| 03/10/2026 | (não commitado) | 231,8 KB | 12,8 KB | 1,86 s (rodada anterior) | 1,8 a 1,9 na home (pin); 0 no resto | baseline desta base |
| 04/10/2026 | (não commitado) | 219,3 KB | 12,9 KB | 2,69 s (limitação aplicada no Chrome, mais dura que o Lighthouse) | 0 na home; máx. 0,0003 em 60 medições | Next 16.3.8, Antes/Depois sticky; [pre-motion-hardening.md](pre-motion-hardening.md) |
