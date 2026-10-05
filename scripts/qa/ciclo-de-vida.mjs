// Regressão do ciclo de vida da página: intro, rolagem no F5, voltar/avançar
// e entradas (data-entra) que precisam rearmar. Roda sobre o out/ (o mesmo
// servidor do scripts/qa/servir.mjs) num Chrome sem janela, por CDP, sem
// dependência nova.
//
//   npm run build && node scripts/qa/ciclo-de-vida.mjs           1440 e 390 (≈ 4 min)
//   node scripts/qa/ciclo-de-vida.mjs --todas                    360, 390, 430, 1440 e 1920
//   CHROME=/caminho/do/chrome node scripts/qa/ciclo-de-vida.mjs
//
// O que precisa valer (sai com código 1 se algo falhar):
//   carga nova da home (entrada, nova aba, F5, fechar e reabrir) → topo desde a primeira pintura e intro
//   navegação interna até a home → sem intro, link novo no topo
//   voltar/avançar → a posição de antes, sem intro
//   entrada abaixo da dobra → armada em toda carga e montagem nova, entra ao rolar
//   F5 em outra rota → topo; movimento reduzido → topo, nada escondido, intro sem travar
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ARGS = process.argv.slice(2);
const PORTA = Number(ARGS.find((a) => /^\d+$/.test(a)) ?? 4179);
const TODAS = ARGS.includes("--todas");
const BASE = `http://127.0.0.1:${PORTA}`;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const CHROME = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p));
if (!CHROME) {
  console.error("ciclo-de-vida: Chrome não encontrado. Aponte a variável CHROME.");
  process.exit(2);
}
if (!existsSync("out")) {
  console.error("ciclo-de-vida: pasta out/ não existe; rode npm run build antes.");
  process.exit(2);
}

// ── CDP mínimo ─────────────────────────────────────────────────────────────
class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.id = 0;
    this.pendentes = new Map();
    this.ouvintes = new Set();
    this.aberta = new Promise((r) => this.ws.addEventListener("open", r));
    this.ws.addEventListener("message", (e) => {
      const m = JSON.parse(e.data);
      if (m.id) {
        const p = this.pendentes.get(m.id);
        this.pendentes.delete(m.id);
        if (!p) return;
        if (m.error) p.rej(new Error(`${p.metodo}: ${m.error.message}`));
        else p.res(m.result);
      } else for (const f of this.ouvintes) f(m);
    });
  }
  send(metodo, params = {}, sessionId) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method: metodo, params, sessionId }));
    return new Promise((res, rej) => this.pendentes.set(id, { res, rej, metodo }));
  }
  on(f) {
    this.ouvintes.add(f);
    return () => this.ouvintes.delete(f);
  }
}

async function abrirAba(cdp, contexto, tela) {
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank", browserContextId: contexto });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  const s = (m, p) => cdp.send(m, p, sessionId);
  const excecoes = [];
  const parar = cdp.on((m) => {
    if (m.sessionId === sessionId && m.method === "Runtime.exceptionThrown") excecoes.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
  });
  await s("Page.enable");
  await s("Runtime.enable");
  await s("Emulation.setDeviceMetricsOverride", { width: tela.w, height: tela.h, deviceScaleFactor: tela.movel ? 3 : 1, mobile: !!tela.movel });
  if (tela.movel) await s("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  if (tela.reduzido) await s("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });

  const aguardarCarga = (gatilho) =>
    new Promise((res) => {
      const amostras = [];
      const t = setTimeout(fim, 30000);
      const sair = cdp.on(async (m) => {
        if (m.sessionId !== sessionId) return;
        if (m.method === "Page.domContentEventFired") amostras.push(await y().catch(() => -1));
        if (m.method === "Page.loadEventFired") {
          amostras.push(await y().catch(() => -1));
          fim();
        }
      });
      function fim() {
        clearTimeout(t);
        sair();
        res(amostras);
      }
      gatilho();
    });
  const av = async (expr) => {
    const r = await s("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  };
  const y = () => av("Math.round(scrollY)");

  return {
    tela, av, y, excecoes,
    ir: (url) => aguardarCarga(() => s("Page.navigate", { url })),
    recarregar: () => aguardarCarga(() => s("Page.reload", {})),
    async caminho(alvo, ms = 8000) {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) {
        if ((await av("location.pathname").catch(() => "")) === alvo) return true;
        await espera(100);
      }
      return false;
    },
    // Rolagem de verdade: roda do mouse (passa pelo Lenis) ou arrasto de dedo.
    async rolarAte(alvoY) {
      let anterior = -1;
      let parado = 0;
      for (let k = 0; k < 60; k++) {
        const atual = await y();
        if (atual >= alvoY - 40) break;
        // Chegou ao fim da página: três tentativas sem sair do lugar.
        parado = atual === anterior ? parado + 1 : 0;
        if (parado >= 3) break;
        anterior = atual;
        if (tela.movel) {
          const x = tela.w / 2, de = tela.h * 0.8, dy = -tela.h * 0.55;
          await s("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: de, id: 1 }] });
          for (let i = 1; i <= 12; i++) {
            await s("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: de + (dy * i) / 12, id: 1 }] });
            await espera(20);
          }
          for (let i = 0; i < 5; i++) {
            await s("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: de + dy, id: 1 }] });
            await espera(30);
          }
          await s("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        } else {
          await s("Input.dispatchMouseEvent", { type: "mouseWheel", x: tela.w / 2, y: tela.h / 2, deltaX: 0, deltaY: 400 });
          await espera(250);
        }
        await espera(120);
      }
      await espera(1300);
    },
    async fechar() {
      parar();
      await cdp.send("Target.closeTarget", { targetId }).catch(() => {});
    },
  };
}

// Estado da intro e da entrada usada como sonda (a última com data-entra
// linha ou imagem da página: sempre abaixo da dobra no topo).
const ESTADO = `(() => {
  const o = document.querySelector('.intro');
  const sonda = [...document.querySelectorAll('[data-entra="linha"], [data-entra="imagem"]')].at(-1);
  const r = sonda && sonda.getBoundingClientRect();
  return {
    intro: document.documentElement.dataset.intro || '',
    overlay: o ? getComputedStyle(o).display : 'sem',
    motion: document.documentElement.classList.contains('motion'),
    sondaArmada: !!sonda && !sonda.classList.contains('is-in'),
    sondaAbaixo: !!r && r.top > innerHeight,
    sondaOpacidade: sonda ? Number(getComputedStyle(sonda).opacity) : null,
  };
})()`;

async function introTocou(aba) {
  const e = await aba.av(ESTADO);
  if (e.intro !== "tocar") return false;
  const t0 = Date.now();
  while (Date.now() - t0 < 9000) {
    const x = await aba.av(ESTADO);
    if (x.overlay === "none") return x.intro === "vista";
    await espera(100);
  }
  return false;
}

// ── checagens ──────────────────────────────────────────────────────────────
const resultados = [];
function conferir(tela, nome, ok, detalhe = "") {
  resultados.push({ tela, nome, ok });
  console.log(`${ok ? "ok   " : "FALHOU"} ${tela.padEnd(18)} ${nome}${detalhe ? ` · ${detalhe}` : ""}`);
}
const zerado = (amostras) => amostras.length > 0 && amostras.every((v) => v === 0);

async function rodada(cdp, tela) {
  const { browserContextId: contexto } = await cdp.send("Target.createBrowserContext", {});
  const nome = tela.nome;
  try {
    const a = await abrirAba(cdp, contexto, tela);

    // 1. carga nova da home
    let amostras = await a.ir(BASE + "/");
    let e = await a.av(ESTADO);
    conferir(nome, "carga nova: intro toca", await introTocou(a));
    amostras.push(await a.y());
    conferir(nome, "carga nova: topo do começo ao fim", zerado(amostras), `y ${amostras.join("/")}`);
    conferir(nome, "carga nova: entrada abaixo da dobra armada", e.sondaArmada && e.sondaAbaixo);

    // 2. rola até o fim (a entrada entra) e dá 5 F5 seguidos
    await a.rolarAte(100000);
    conferir(nome, "rolando: a entrada entrou", !(await a.av(ESTADO)).sondaArmada);
    for (let i = 1; i <= 5; i++) {
      amostras = await a.recarregar();
      e = await a.av(ESTADO);
      const tocou = await introTocou(a);
      await espera(400);
      amostras.push(await a.y());
      conferir(nome, `F5 nº ${i}: topo, intro e entrada rearmada`, zerado(amostras) && tocou && e.sondaArmada, `y ${amostras.join("/")} · intro ${tocou}`);
      if (i < 5) await a.rolarAte(1500 + i * 300);
    }

    // 3. a entrada entra de novo depois do F5
    await a.rolarAte(100000);
    conferir(nome, "depois do F5: a entrada entra de novo", !(await a.av(ESTADO)).sondaArmada);

    // 4. três abas novas no mesmo navegador (storage e cookies da visita anterior)
    for (let i = 1; i <= 3; i++) {
      const n = await abrirAba(cdp, contexto, tela);
      amostras = await n.ir(BASE + "/");
      const armada = (await n.av(ESTADO)).sondaArmada;
      const tocouNova = await introTocou(n);
      amostras.push(await n.y());
      conferir(nome, `nova aba nº ${i}: topo, intro e entrada armada`, zerado(amostras) && tocouNova && armada, `y ${amostras.join("/")}`);
      await n.fechar();
    }

    // 5. navegação interna: portfólio pelo link, home pelo logotipo
    await a.av(`window.scrollTo(0, 0)`);
    await espera(600);
    await a.av(`document.querySelector('a[href="/portfolio"]').click()`);
    const foiPortfolio = await a.caminho("/portfolio");
    await espera(1200);
    await a.av(`document.querySelector('header a[href="/"]').click()`);
    const voltouHome = await a.caminho("/");
    await espera(1500);
    e = await a.av(ESTADO);
    conferir(nome, "interna até a home: sem intro, no topo, entrada armada", foiPortfolio && voltouHome && e.intro !== "tocar" && e.overlay === "none" && (await a.y()) === 0 && e.sondaArmada);

    // 6. voltar e avançar: portfólio rolado → case → voltar → avançar → voltar
    await a.av(`document.querySelector('a[href="/portfolio"]').click()`);
    await a.caminho("/portfolio");
    await espera(1200);
    await a.rolarAte(1400);
    const y0 = await a.y();
    const caseHref = await a.av(`(() => { const l = [...document.querySelectorAll('a.indice-item')].find((x) => { const r = x.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight; }); l.click(); return l.getAttribute('href'); })()`);
    await a.caminho(caseHref);
    await espera(1500);
    await a.av("history.back()");
    await a.caminho("/portfolio");
    await espera(2000);
    const y1 = await a.y();
    conferir(nome, "voltar: posição restaurada", Math.abs(y1 - y0) <= 5, `${y0} → ${y1}`);
    await a.av("history.forward()");
    const avancou = await a.caminho(caseHref);
    await espera(1500);
    await a.av("history.back()");
    await a.caminho("/portfolio");
    await espera(2000);
    const y2 = await a.y();
    conferir(nome, "avançar e voltar de novo: posição restaurada", avancou && Math.abs(y2 - y0) <= 5, `${y0} → ${y2}`);

    // 7. voltar até a home: sem intro
    await a.av(`document.querySelector('header a[href="/"]').click()`);
    await a.caminho("/");
    await espera(1500);
    await a.rolarAte(900);
    const yHome = await a.y();
    await a.av(`document.querySelector('a[href="/portfolio"]').click()`);
    await a.caminho("/portfolio");
    await espera(1200);
    await a.av("history.back()");
    await a.caminho("/");
    await espera(2000);
    e = await a.av(ESTADO);
    const yVolta = await a.y();
    conferir(nome, "voltar até a home: sem intro, posição restaurada", e.intro !== "tocar" && e.overlay === "none" && Math.abs(yVolta - yHome) <= 5, `${yHome} → ${yVolta}`);

    // 8. F5 em outra rota
    await a.ir(BASE + "/portfolio");
    await espera(800);
    await a.rolarAte(1500);
    amostras = await a.recarregar();
    await espera(2000);
    amostras.push(await a.y());
    conferir(nome, "F5 em /portfolio: topo", zerado(amostras), `y ${amostras.join("/")}`);

    conferir(nome, "sem exceção de JS", a.excecoes.length === 0, a.excecoes.slice(0, 2).join(" | "));
    await a.fechar();

    // 9. fechar e reabrir: nenhuma aba aberta, o mesmo navegador entra de novo
    const r = await abrirAba(cdp, contexto, tela);
    amostras = await r.ir(BASE + "/");
    const armadaR = (await r.av(ESTADO)).sondaArmada;
    const tocouR = await introTocou(r);
    amostras.push(await r.y());
    conferir(nome, "fechou e reabriu: topo, intro e entrada armada", zerado(amostras) && tocouR && armadaR, `y ${amostras.join("/")}`);
    await r.fechar();
  } finally {
    await cdp.send("Target.disposeBrowserContext", { browserContextId: contexto }).catch(() => {});
  }
}

async function reduzido(cdp, tela) {
  const { browserContextId: contexto } = await cdp.send("Target.createBrowserContext", {});
  try {
    const a = await abrirAba(cdp, contexto, tela);
    await a.ir(BASE + "/");
    await espera(1500);
    await a.rolarAte(1500);
    const amostras = await a.recarregar();
    await espera(2500);
    amostras.push(await a.y());
    const e = await a.av(ESTADO);
    conferir(tela.nome, "movimento reduzido, F5: topo, sem motion, intro some, nada escondido", zerado(amostras) && !e.motion && e.overlay === "none" && e.sondaOpacidade === 1, `y ${amostras.join("/")} · opacidade ${e.sondaOpacidade}`);
    await a.fechar();
  } finally {
    await cdp.send("Target.disposeBrowserContext", { browserContextId: contexto }).catch(() => {});
  }
}

// ── execução ───────────────────────────────────────────────────────────────
const servidor = spawn(process.execPath, [path.join("scripts", "qa", "servir.mjs"), String(PORTA)], { stdio: "ignore" });
const perfil = mkdtempSync(path.join(tmpdir(), "nada-ciclo-"));
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${perfil}`, "--no-first-run", "--no-default-browser-check", "--mute-audio", "--autoplay-policy=no-user-gesture-required", "about:blank"], { stdio: "ignore" });
let codigo = 1;
try {
  let ws;
  for (let i = 0; i < 100 && !ws; i++) {
    await espera(100);
    try {
      const [porta, caminho] = readFileSync(path.join(perfil, "DevToolsActivePort"), "utf8").split("\n");
      ws = `ws://127.0.0.1:${porta}${caminho}`;
    } catch {
      // o Chrome ainda não escreveu a porta
    }
  }
  for (let i = 0; i < 50; i++) {
    if ((await fetch(BASE + "/").then((r) => r.status).catch(() => 0)) === 200) break;
    await espera(100);
  }
  const cdp = new Cdp(ws);
  await cdp.aberta;
  const telas = [
    { nome: "desktop 1440×900", w: 1440, h: 900 },
    ...(TODAS ? [{ nome: "desktop 1920×1080", w: 1920, h: 1080 }, { nome: "celular 360×640", w: 360, h: 640, movel: true }] : []),
    { nome: "celular 390×844", w: 390, h: 844, movel: true },
    ...(TODAS ? [{ nome: "celular 430×932", w: 430, h: 932, movel: true }] : []),
  ];
  for (const tela of telas) await rodada(cdp, tela);
  await reduzido(cdp, { nome: "reduzido 390×844", w: 390, h: 844, movel: true, reduzido: true });
  if (TODAS) await reduzido(cdp, { nome: "reduzido 1440×900", w: 1440, h: 900, reduzido: true });
  await cdp.send("Browser.close").catch(() => {});
  const falhas = resultados.filter((r) => !r.ok);
  console.log(`\nciclo-de-vida: ${resultados.length - falhas.length} de ${resultados.length} checagens ok.`);
  codigo = falhas.length ? 1 : 0;
} catch (e) {
  console.error("ciclo-de-vida: erro no teste:", e.message);
} finally {
  chrome.kill();
  servidor.kill();
  await espera(500);
  try {
    rmSync(perfil, { recursive: true, force: true });
  } catch {
    // perfil ainda preso pelo Chrome: fica na pasta temporária do sistema
  }
}
process.exit(codigo);
