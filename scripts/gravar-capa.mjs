// Grava as capas em movimento do portfólio: o site real de cada projeto,
// quadro a quadro, e monta o filme que a capa toca (src/components/CapaVideo).
//
//   node scripts/gravar-capa.mjs ana            grava e monta os dois formatos
//   node scripts/gravar-capa.mjs ana --folha    grava e gera a folha de quadros (pra escolher os cortes)
//   node scripts/gravar-capa.mjs ana --montar   só refaz a montagem com os quadros já gravados
//   node scripts/gravar-capa.mjs ana --pe       só o formato em pé (ou --larga)
//   node scripts/gravar-capa.mjs todos
//
// Precisa do Chrome e do ffmpeg instalados (variáveis CHROME e FFMPEG, se não
// estiverem no lugar padrão). CHROME_PORTA usa um Chrome já aberto com
// depuração remota (pra sistema com login: a pessoa loga na janela e o script
// grava nela). Depois de gravar: node scripts/imagens.mjs
//
// Por que quadro a quadro: o relógio da página fica na mão do script. O tempo
// do JavaScript (timers, requestAnimationFrame) é o relógio virtual do Chrome,
// e as animações de CSS correm quase paradas e são avançadas à mão a cada quadro.
// Cada quadro é um PNG inteiro, sem depender da velocidade da máquina nem da
// rede. Os rastreadores ficam bloqueados: a gravação não entra nas métricas
// do cliente.
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const FPS = 30;
const DT = 1000 / FPS;
const SAIDA = "public/portfolio";
const TRABALHO = path.join(os.tmpdir(), "nada-capas");

// Em pé (4:5): índice e home, com o site em layout de celular.
// Larga (16:10): topo do case, em layout de computador.
// Grava maior do que a saída e reduz: letra mais limpa.
const FORMATOS = {
  pe: { largura: 480, altura: 600, escala: 2.5, celular: true, saidas: { "": [864, 1080] } },
  larga: { largura: 1280, altura: 800, escala: 2, celular: false, saidas: { "": [1600, 1000], "-p": [960, 600] } },
};

const RASTREADORES = [
  "*google-analytics.com*",
  "*googletagmanager.com*",
  "*connect.facebook.net*",
  "*facebook.com/tr*",
  "*doubleclick.net*",
  "*clarity.ms*",
  "*hotjar.com*",
];

const dorme = (ms) => new Promise((r) => setTimeout(r, ms));
const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ── Chrome ────────────────────────────────────────────────────────────────
async function abrirChrome() {
  if (process.env.CHROME_PORTA) return { porta: Number(process.env.CHROME_PORTA), fechar() {} };
  const exe = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
  const porta = 9340;
  const proc = spawn(
    exe,
    [
      "--headless=new",
      `--remote-debugging-port=${porta}`,
      `--user-data-dir=${path.join(TRABALHO, "chrome")}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--hide-scrollbars",
      "--mute-audio",
      "about:blank",
    ],
    { stdio: "ignore" }
  );
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(`http://127.0.0.1:${porta}/json/version`);
      return { porta, fechar: () => proc.kill() };
    } catch {
      await dorme(200);
    }
  }
  throw new Error("O Chrome não abriu. Confira a variável CHROME.");
}

// Avança as animações de CSS e da Web Animations API, que o relógio virtual
// não alcança. Quando aparece, cada uma passa a correr a um milésimo da
// velocidade (na prática, parada) e anda `dt` por quadro aqui; no fim,
// `finish()` dispara o que a página espera (transitionend, animationend, a
// promessa `finished`).
// Não dá pra parar de vez: com pause(), velocidade 0 ou a linha do tempo
// parada pelo CDP (Animation.setPlaybackRate), a captura de tela trava.
// A boia: com o relógio parado e nenhuma animação ativa, o Chrome não entrega
// quadro e a captura trava. Um ponto invisível de 1 px, animado sem fim,
// mantém os quadros saindo.
const AVANCAR_ANIMACOES = (dt) => `(() => {
  if (!window.__capaBoia && document.documentElement) {
    const boia = document.createElement("div");
    boia.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;pointer-events:none;z-index:2147483647";
    document.documentElement.appendChild(boia);
    window.__capaBoia = boia.animate([{ opacity: 0.001 }, { opacity: 0.002 }], { duration: 100000, iterations: Infinity });
  }
  const vistas = (window.__capaAnimacoes ||= new WeakMap());
  for (const a of document.getAnimations()) {
    try {
      let e = vistas.get(a);
      if (!e) {
        e = { t: 0, taxa: Math.abs(a.playbackRate || 1) };
        vistas.set(a, e);
        a.playbackRate = 0.001;
      } else e.t += ${dt} * e.taxa;
      const fim = a.effect ? a.effect.getComputedTiming().endTime : Infinity;
      if (Number.isFinite(fim) && e.t >= fim) {
        a.playbackRate = e.taxa;
        a.finish();
      } else a.currentTime = e.t;
    } catch {}
  }
})()`;

// Uma tomada: uma aba com o relógio controlado, gravando numa pasta.
class Tomada {
  constructor(alvo, ws, formato, pasta, porta) {
    Object.assign(this, { alvo, ws, formato, pasta, porta, n: 0, id: 0, marcas: {} });
    this.pendentes = new Map();
    this.expirados = 0;
    this.aguardando = null;
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && this.pendentes.has(d.id)) {
        const { ok, erro } = this.pendentes.get(d.id);
        this.pendentes.delete(d.id);
        if (d.error) erro(new Error(d.error.message));
        else ok(d.result);
      } else if (d.method === "Emulation.virtualTimeBudgetExpired") {
        if (this.aguardando) {
          const ok = this.aguardando;
          this.aguardando = null;
          ok(true);
        } else this.expirados++;
      }
    };
  }

  // Sem resposta em 90 s reais, falha dizendo qual comando ficou pendurado.
  send(method, params = {}) {
    return new Promise((ok, erro) => {
      const id = ++this.id;
      const prazo = setTimeout(() => {
        this.pendentes.delete(id);
        erro(new Error(`${method} sem resposta (quadro ${this.n}) ${String(params.expression ?? "").slice(0, 80)}`));
      }, 90000);
      this.pendentes.set(id, {
        ok: (r) => (clearTimeout(prazo), ok(r)),
        erro: (e) => (clearTimeout(prazo), erro(e)),
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Não espera promessa: com o relógio parado, uma promessa da página que
  // dependa de timer (um scrollTo "suave" embrulhado, por exemplo) nunca resolve.
  async js(expressao) {
    const r = await this.send("Runtime.evaluate", { expression: expressao, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  }

  // Espera o orçamento de tempo virtual acabar (ou desiste depois de `limite` ms reais).
  expirou(limite) {
    if (this.expirados) {
      this.expirados--;
      return Promise.resolve(true);
    }
    return new Promise((ok) => {
      this.aguardando = ok;
      setTimeout(() => {
        if (this.aguardando === ok) {
          this.aguardando = null;
          ok(false);
        }
      }, limite);
    });
  }

  // Anda `ms` de tempo virtual. Com pedido de rede em aberto o relógio espera
  // (imagem e fonte chegam antes de o tempo andar); se um pedido ficar
  // pendurado, o relógio anda assim mesmo.
  async avancar(ms) {
    await this.send("Emulation.setVirtualTimePolicy", { policy: "pauseIfNetworkFetchesPending", budget: ms });
    if (await this.expirou(6000)) return;
    await this.send("Emulation.setVirtualTimePolicy", { policy: "advance", budget: ms });
    await this.expirou(6000);
  }

  // Por padrão a visita é "de primeira vez" (dados do site apagados): abertura
  // que só toca uma vez toca aqui. Em sistema com login, passar
  // { primeiraVisita: false } pra manter a sessão aberta.
  async navegar(url, { primeiraVisita = true } = {}) {
    if (primeiraVisita) {
      await this.send("Storage.clearDataForOrigin", { origin: new URL(url).origin, storageTypes: "local_storage,session_storage,cookies" }).catch(() => {});
    }
    await this.send("Emulation.setVirtualTimePolicy", { policy: "pause" });
    this.send("Page.navigate", { url }).catch(() => {});
    await dorme(300);
  }

  async passo(capturar = true) {
    await this.avancar(DT);
    try {
      await this.js(AVANCAR_ANIMACOES(DT));
    } catch {
      // documento ainda trocando
    }
    if (!capturar) return;
    const { data } = await this.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(this.pasta, `${String(this.n).padStart(6, "0")}.png`), Buffer.from(data, "base64"));
    this.n++;
  }

  async gravar(ms) {
    for (let i = 0; i < Math.round(ms / DT); i++) await this.passo(true);
  }

  async pular(ms) {
    for (let i = 0; i < Math.round(ms / DT); i++) await this.passo(false);
  }

  marca(nome) {
    this.marcas[nome] = this.n;
  }

  // Posição de rolagem que deixa o alvo (número ou seletor) a `folga` px do topo.
  async destino(alvo, folga = 0) {
    if (typeof alvo === "number") return alvo;
    const y = await this.js(`(() => {
      const el = document.querySelector(${JSON.stringify(alvo)});
      return el ? Math.round(el.getBoundingClientRect().top + scrollY) : null;
    })()`);
    if (y === null) throw new Error(`Não achei ${alvo}`);
    return Math.max(0, y - folga);
  }

  // Salta pra lá sem gravar (corte).
  async irPara(alvo, folga = 0) {
    await this.js(`window.scrollTo({ top: ${await this.destino(alvo, folga)}, behavior: "instant" }); 0`);
  }

  // Rola a página até o alvo em `ms`, gravando.
  async rolar(alvo, ms, { folga = 0, curva = suave } = {}) {
    const de = await this.js("scrollY");
    const ate = await this.destino(alvo, folga);
    const quadros = Math.max(1, Math.round(ms / DT));
    for (let i = 1; i <= quadros; i++) {
      await this.js(`window.scrollTo({ top: ${Math.round(de + (ate - de) * curva(i / quadros))}, behavior: "instant" }); 0`);
      await this.passo(true);
    }
  }

  // Rola pro lado, dentro de um elemento (quadro mais largo que a tela), gravando.
  async rolarLado(seletor, x, ms, curva = suave) {
    const quadros = Math.max(1, Math.round(ms / DT));
    const de = await this.js(`document.querySelector(${JSON.stringify(seletor)}).scrollLeft`);
    for (let i = 1; i <= quadros; i++) {
      await this.js(`document.querySelector(${JSON.stringify(seletor)}).scrollLeft = ${Math.round(de + (x - de) * curva(i / quadros))}; 0`);
      await this.passo(true);
    }
  }

  // Cliques são por código (el.click()): com o relógio parado, o evento de
  // toque ou de mouse do CDP fica sem resposta. Vale em cena e fora dela.
  async clicar(seletor) {
    const ok = await this.js(`(() => {
      const el = document.querySelector(${JSON.stringify(seletor)});
      if (el) el.click();
      return Boolean(el);
    })()`);
    if (!ok) throw new Error(`Não achei ${seletor}`);
  }

  // Clica no primeiro elemento clicável que contém o texto.
  async clicarTexto(texto, dentro = "body") {
    const ok = await this.js(`(() => {
      const el = [...document.querySelectorAll(${JSON.stringify(dentro)} + " :is(button, a, label, [role=button])")].find((e) => e.textContent.includes(${JSON.stringify(texto)}));
      if (el) el.click();
      return Boolean(el);
    })()`);
    if (!ok) throw new Error(`Não achei o texto "${texto}"`);
  }

  async digitar(seletor, texto) {
    const ok = await this.js(`(() => { const el = document.querySelector(${JSON.stringify(seletor)}); if (el) el.focus(); return Boolean(el); })()`);
    if (!ok) throw new Error(`Não achei ${seletor}`);
    await this.send("Input.insertText", { text: texto });
  }

  // Escreve letra por letra, gravando (o campo recebe foco; nada é enviado).
  async digitarEmCena(seletor, texto, quadrosPorLetra = 2) {
    const ok = await this.js(`(() => { const el = document.querySelector(${JSON.stringify(seletor)}); if (el) el.focus(); return Boolean(el); })()`);
    if (!ok) throw new Error(`Não achei ${seletor}`);
    for (const letra of texto) {
      await this.send("Input.insertText", { text: letra });
      for (let i = 0; i < quadrosPorLetra; i++) await this.passo(true);
    }
  }

  // Esconde o que não é do site (o selo do servidor de desenvolvimento).
  esconder(seletor) {
    return this.estilo(seletor + " { display: none !important; }");
  }

  // Borra o que não pode aparecer: nome de cliente, contato, valor.
  // Depois de carregar cada tela, chamar conferirBorrado() antes de gravar.
  borrar(seletores) {
    this.borrados = [...(this.borrados ?? []), ...seletores];
    return this.estilo(seletores.join(", ") + " { filter: blur(6px) !important; }");
  }

  // Trava da gravação: todo elemento que deveria estar borrado tem de estar.
  // Se algum não estiver (o site trocou de classe, o estilo não entrou), para
  // aqui, antes de qualquer quadro com dado de terceiro ir pro disco.
  // `presente`: seletor que tem de existir na tela (prova de que ela carregou).
  async conferirBorrado(presente) {
    const falhas = await this.js(`(() => {
      const falhas = [];
      if (${JSON.stringify(presente ?? "")} && !document.querySelector(${JSON.stringify(presente ?? "")})) falhas.push("(ausente) " + ${JSON.stringify(presente ?? "")});
      for (const s of ${JSON.stringify(this.borrados ?? [])}) {
        for (const el of document.querySelectorAll(s)) {
          if (!getComputedStyle(el).filter.includes("blur")) { falhas.push(s); break; }
        }
      }
      return falhas;
    })()`);
    if (falhas.length) throw new Error(`Borrado não aplicado em: ${falhas.join(", ")}. Gravação interrompida.`);
  }

  // CSS da gravação. Chamar antes de navegar: vale desde o primeiro quadro.
  // Entra como folha construída (adoptedStyleSheets): um <style> injetado é
  // barrado por site com política de segurança de conteúdo (CSP) restrita.
  async estilo(regras) {
    const css = JSON.stringify(regras);
    await this.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `{ const folha = new CSSStyleSheet(); folha.replaceSync(${css}); document.adoptedStyleSheets = [...document.adoptedStyleSheets, folha]; }`,
    });
  }

  async fechar() {
    fs.writeFileSync(path.join(this.pasta, "marcas.json"), JSON.stringify({ quadros: this.n, marcas: this.marcas }, null, 1));
    await fetch(`http://127.0.0.1:${this.porta}/json/close/${this.alvo.id}`).catch(() => {});
    this.ws.close();
  }
}

async function novaTomada(porta, formato, pasta) {
  fs.rmSync(pasta, { recursive: true, force: true });
  fs.mkdirSync(pasta, { recursive: true });
  const alvo = await (await fetch(`http://127.0.0.1:${porta}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(alvo.webSocketDebuggerUrl);
  await new Promise((ok, erro) => {
    ws.onopen = ok;
    ws.onerror = erro;
  });
  const t = new Tomada(alvo, ws, formato, pasta, porta);
  await t.send("Page.enable");
  await t.send("Runtime.enable");
  await t.send("Network.enable");
  await t.send("Network.setBlockedURLs", { urls: RASTREADORES });
  await t.send("Emulation.setDeviceMetricsOverride", {
    width: formato.largura,
    height: formato.altura,
    deviceScaleFactor: formato.escala,
    mobile: formato.celular,
  });
  if (formato.celular) {
    await t.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await t.send("Emulation.setUserAgentOverride", {
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
  }
  // Em janela com interface (sistema com login) a barra de rolagem aparece e
  // ocupa espaço; no modo sem interface ela já não existe.
  await t.estilo("html { scrollbar-width: none; } ::-webkit-scrollbar { display: none; }");
  return t;
}

// ── Montagem ──────────────────────────────────────────────────────────────
function ffmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  if (spawnSync("ffmpeg", ["-version"]).status === 0) return "ffmpeg";
  // Instalado pelo winget e ainda fora do PATH desta sessão.
  const pacotes = path.join(process.env.LOCALAPPDATA ?? "", "Microsoft/WinGet/Packages");
  for (const pacote of fs.existsSync(pacotes) ? fs.readdirSync(pacotes) : []) {
    if (!pacote.startsWith("Gyan.FFmpeg")) continue;
    for (const versao of fs.readdirSync(path.join(pacotes, pacote))) {
      const exe = path.join(pacotes, pacote, versao, "bin/ffmpeg.exe");
      if (fs.existsSync(exe)) return exe;
    }
  }
  throw new Error("ffmpeg não encontrado. Instale (winget install Gyan.FFmpeg.Essentials) ou aponte a variável FFMPEG.");
}

// Segmentos, na ordem:
//   { pasta, de, ate }            quadros gravados (índices, inclusive)
//   { parado: arquivo, dur }      imagem parada por `dur` segundos
// `entra: { tipo, dur }` liga o segmento ao anterior por uma transição do
// xfade do ffmpeg (fade, circleopen, circleclose...). Sem `entra`, corte seco.
function montar(segmentos, [largura, altura], arquivo, crf = 26) {
  const args = ["-y", "-hide_banner", "-loglevel", "error"];
  const filtros = [];
  const duracoes = [];
  segmentos.forEach((s, i) => {
    if (s.parado) {
      args.push("-loop", "1", "-framerate", String(FPS), "-t", String(s.dur), "-i", s.parado);
      duracoes.push(s.dur);
    } else {
      const quadros = s.ate - s.de + 1;
      args.push("-framerate", String(FPS), "-start_number", String(s.de), "-t", String(quadros / FPS), "-i", path.join(s.pasta, "%06d.png"));
      duracoes.push(quadros / FPS);
    }
    // Preenche a saída (corta o excesso no centro) e fixa cor e relógio, que o
    // xfade exige iguais nas duas pontas.
    filtros.push(
      `[${i}:v]scale=${largura}:${altura}:force_original_aspect_ratio=increase:flags=lanczos,crop=${largura}:${altura},setsar=1,fps=${FPS},format=gbrp,settb=AVTB,setpts=PTS-STARTPTS[v${i}]`
    );
  });
  let atual = "v0";
  let total = duracoes[0];
  for (let i = 1; i < segmentos.length; i++) {
    const { entra } = segmentos[i];
    const saida = `m${i}`;
    if (entra) {
      filtros.push(`[${atual}][v${i}]xfade=transition=${entra.tipo}:duration=${entra.dur}:offset=${(total - entra.dur).toFixed(4)}[${saida}]`);
      total += duracoes[i] - entra.dur;
    } else {
      filtros.push(`[${atual}][v${i}]concat=n=2:v=1:a=0[${saida}]`);
      total += duracoes[i];
    }
    atual = saida;
  }
  // BT.709 declarado: sem isso o navegador adivinha a matriz e a cor do filme
  // sai diferente da do pôster.
  filtros.push(`[${atual}]scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[fim]`);
  args.push(
    "-filter_complex", filtros.join(";"),
    "-map", "[fim]",
    "-c:v", "libx264", "-preset", "veryslow", "-crf", String(process.env.CRF ?? crf),
    "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-movflags", "+faststart", "-an", "-r", String(FPS),
    arquivo
  );
  const r = spawnSync(ffmpeg(), args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`ffmpeg falhou em ${arquivo}:\n${r.stderr}`);
  return { duracao: total, kb: Math.round(fs.statSync(arquivo).size / 1024) };
}

// Folha de quadros: um a cada `passo`, com o índice, pra escolher os cortes.
async function folha(pasta, arquivo, passo = 6, colunas = 8) {
  const total = JSON.parse(fs.readFileSync(path.join(pasta, "marcas.json"), "utf8")).quadros;
  const indices = [];
  for (let i = 0; i < total; i += passo) indices.push(i);
  const meta = await sharp(path.join(pasta, "000000.png")).metadata();
  const w = 200;
  const h = Math.round((w * meta.height) / meta.width);
  const pecas = await Promise.all(
    indices.map(async (n, i) => ({
      input: await sharp(path.join(pasta, `${String(n).padStart(6, "0")}.png`))
        .resize(w, h)
        .composite([
          {
            input: Buffer.from(
              `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="22"><rect width="62" height="22" fill="#000"/><text x="5" y="16" font-family="monospace" font-size="14" fill="#fff">${n}</text></svg>`
            ),
            left: 0,
            top: 0,
          },
        ])
        .png()
        .toBuffer(),
      left: (i % colunas) * (w + 4),
      top: Math.floor(i / colunas) * (h + 4),
    }))
  );
  await sharp({
    create: { width: colunas * (w + 4), height: Math.ceil(indices.length / colunas) * (h + 4), channels: 3, background: "#333" },
  })
    .composite(pecas)
    .jpeg({ quality: 82 })
    .toFile(arquivo);
}

const quadro = (pasta, n) => path.join(pasta, `${String(n).padStart(6, "0")}.png`);

// ── Roteiros ──────────────────────────────────────────────────────────────
// Cada projeto: `gravar(tomada, formato)` dirige a página e `montar(pasta,
// formato)` devolve os segmentos do filme. O filme começa e termina no mesmo
// quadro parado, que também é o pôster: o loop não tem emenda.
const ROTEIROS = {};

// Ana Marocci: a abertura da marca. Começa na marca completa (pôster), segue
// pela passagem do próprio site até a primeira tela, mostra a foto dela e
// volta ao creme pra marca se desenhar de novo.
ROTEIROS.ana = {
  slug: "ana",
  async gravar(t, f) {
    await t.navegar("https://anamaroccinutri.com.br");
    await t.gravar(5200); // abertura, passagem e a primeira tela assentando
    if (f === "pe") {
      await t.rolar('img[alt="Ana Marocci, nutricionista"]', 2200, { folga: 30 }); // a foto no arco entra inteira
      await t.gravar(1300);
    } else await t.gravar(1500);
    t.marca("fim");
  },
  montar(pasta, f, m) {
    const MARCA = 78; // marca completa, antes de a passagem começar
    return {
      poster: quadro(pasta, MARCA),
      segmentos: [
        { parado: quadro(pasta, MARCA), dur: 0.7 },
        { pasta, de: MARCA, ate: m.fim - 1 },
        { pasta, de: 0, ate: MARCA, entra: { tipo: "fade", dur: 0.3 } },
      ],
    };
  },
};

// Thayana de Oliveira: a triagem. Primeira tela (pôster), o cartão da
// triagem, a primeira pergunta e duas perguntas de marcar avançando com a
// barra de progresso. Gravado do código rodando local (npm run dev na pasta
// do site, porta 3210): nenhuma resposta sai da máquina e nada é enviado.
// As três primeiras perguntas pedem texto e são preenchidas fora de cena.
ROTEIROS.thayana = {
  slug: "thayana",
  async gravar(t, f) {
    const continuar = '#triagem-form button[type="submit"]';
    const avancar = async () => {
      await t.js(`document.querySelector(${JSON.stringify(continuar)}).click(); 0`);
      await t.pular(700);
    };
    await t.esconder("nextjs-portal");
    await t.navegar(process.env.THAYANA ?? "http://localhost:3210/");
    await t.gravar(3000); // a primeira tela entrando
    t.marca("hero");

    // Corte pro cartão da triagem, com o botão na tela.
    if (f === "pe") {
      const y = await t.js(`(() => { const b = [...document.querySelectorAll("#triagem button")].find((e) => e.textContent.includes("Começar a triagem")).getBoundingClientRect(); return Math.round(b.bottom + scrollY - innerHeight + 70); })()`);
      await t.irPara(y);
    } else await t.irPara("#triagem", 60);
    await t.pular(900);
    t.marca("cartao");
    await t.gravar(900);
    await t.clicarTexto("Começar a triagem", "#triagem");
    await t.gravar(1700); // a primeira pergunta aparece
    t.marca("cartaoFim");

    await t.digitar("#triage-name", "Marina");
    await avancar();
    await t.digitar("#triage-age", "34");
    await avancar();
    await t.digitar("#triage-city", "Jundiaí, SP");
    await avancar();
    await avancar(); // pergunta aberta, opcional
    await t.clicarTexto("Estresse no dia a dia", "#triagem");
    await avancar();

    if (f === "pe") await t.irPara('#triagem [role="progressbar"]', 50);
    await t.pular(500);
    t.marca("perguntas");
    await t.gravar(800);
    await t.clicarTexto("Alguns meses", "#triagem");
    await t.gravar(650);
    await t.clicar(continuar);
    await t.gravar(1200);
    await t.clicarTexto("primeira vez", "#triagem");
    await t.gravar(650);
    await t.clicar(continuar);
    await t.gravar(1300);
    t.marca("fim");
  },
  montar(pasta, f, m) {
    const hero = quadro(pasta, m.hero - 1);
    return {
      poster: hero,
      segmentos: [
        { parado: hero, dur: 1 },
        { pasta, de: m.cartao, ate: m.cartaoFim - 1, entra: { tipo: "fade", dur: 0.4 } },
        { pasta, de: m.perguntas, ate: m.fim - 1, entra: { tipo: "fade", dur: 0.3 } },
        { pasta, de: 0, ate: m.hero - 1, entra: { tipo: "fade", dur: 0.4 } },
      ],
    };
  },
};

// Mileide Rodrigues: a pergunta que abre o site. Primeira tela (pôster),
// rolagem até a lista "Você continua dizendo que está tudo bem." e a volta
// pra frase entrando de novo.
ROTEIROS.mileide = {
  slug: "mileide",
  // Em 480 px a barra fixa do WhatsApp encobre o botão da primeira tela; em 560 px os dois aparecem.
  formatos: { pe: { largura: 560, altura: 700, escala: 2.2 } },
  crf: 28, // rolagem longa sobre foto: um ponto a mais de compressão, sem perda visível
  async gravar(t) {
    await t.navegar("https://mileidepsi.com.br");
    await t.gravar(3000); // a primeira tela entrando
    t.marca("hero");
    await t.gravar(600);
    await t.rolar("h2", 4600, { folga: 90 });
    await t.gravar(1100);
    t.marca("fim");
  },
  montar(pasta, f, m) {
    const hero = quadro(pasta, m.hero - 1);
    return {
      poster: hero,
      segmentos: [
        { parado: hero, dur: 0.8 },
        { pasta, de: m.hero, ate: m.fim - 1 },
        { pasta, de: 0, ate: m.hero - 1, entra: { tipo: "fade", dur: 0.4 } },
      ],
    };
  },
};

// Espaço GC Style: do balcão pro catálogo. A arte do banner (pôster) abre em
// círculo pro catálogo: a grade de perfumes, o quiz e o resultado. As etapas
// 2 a 5 do quiz são respondidas fora de cena. Tudo roda no navegador; o
// pedido pelo WhatsApp não é tocado.
ROTEIROS["gc-style"] = {
  slug: "gc-style",
  async gravar(t, f) {
    await t.navegar("https://catalogo-perfumes.pages.dev");
    await t.pular(2500);
    await t.irPara('img[alt="9PM Black Men"]', f === "pe" ? 96 : 110);
    await t.pular(700);
    t.marca("grade");
    await t.gravar(500);
    await t.rolar((await t.js("scrollY")) + (f === "pe" ? 430 : 330), 2100);
    await t.gravar(300);
    await t.clicarTexto("Descobrir Meu Perfume Ideal");
    await t.gravar(1500); // a folha do quiz sobe
    await t.clicarTexto("Cítricos & Aromáticos", ".quiz-sheet");
    await t.gravar(450);
    await t.clicarTexto("Aquáticos & Verdes", ".quiz-sheet");
    await t.gravar(900);
    t.marca("quizFim");

    await t.clicarTexto("Avançar", ".quiz-sheet");
    await t.pular(700);
    for (let etapa = 2; etapa <= 5; etapa++) {
      await t.js(`[...document.querySelectorAll(".quiz-sheet button")].filter((b) => b.textContent.trim() && !/Avançar|Voltar|Tanto faz|Ver resultado/.test(b.textContent))[0].click(); 0`);
      await t.pular(300);
      await t.clicarTexto(etapa === 5 ? "Ver resultado" : "Avançar", ".quiz-sheet");
      await t.pular(700);
    }
    await t.pular(600);
    t.marca("resultado");
    await t.gravar(1700);
    t.marca("fim");
  },
  montar(pasta, f, m) {
    const banner = path.join(SAIDA, f === "pe" ? "gcstyle-banner.webp" : "gcstyle-banners.webp");
    return {
      poster: banner,
      segmentos: [
        { parado: banner, dur: 1.3 },
        { pasta, de: m.grade, ate: m.quizFim - 1, entra: { tipo: "circleopen", dur: 0.6 } },
        { pasta, de: m.resultado, ate: m.fim - 1, entra: { tipo: "fade", dur: 0.3 } },
        { parado: banner, dur: 0.7, entra: { tipo: "circleclose", dur: 0.6 } },
      ],
    };
  },
};

// ── Sistemas com login ────────────────────────────────────────────────────
// Gravados numa janela do Chrome com a sessão aberta por quem tem a senha:
//   chrome --remote-debugging-port=9350 --user-data-dir=<perfil só pra isso>
//   CHROME_PORTA=9350 HUB_URL=https://... node scripts/gravar-capa.mjs hub
// O script abre uma aba própria, mantém a sessão (primeiraVisita: false) e
// borra, desde o primeiro quadro, o que é de terceiro ou é número interno.
// O endereço vem de variável de ambiente (HUB_URL, TORRE_URL): este
// repositório é público e endereço de sistema interno não entra nele.
function endereco(variavel) {
  const url = process.env[variavel];
  if (!url) throw new Error(`Defina ${variavel} com o endereço do sistema (ele não fica no repositório).`);
  return url.replace(/\/$/, "");
}

// Hub NADA Studio: o painel, o quadro de produção de conteúdo e o funil.
// Borrado: nomes e contatos do funil, títulos de projeto de cliente, a última
// atualização, os valores do gráfico financeiro e as metas. Cofre e
// Financeiro não são abertos.
ROTEIROS.hub = {
  slug: "hub",
  async gravar(t, f) {
    await t.borrar([
      ".dashboard-latest b",
      ".activity-list .activity-text",
      ".trend-chart svg text",
      ".goals-mini .goal-mini-top",
      // CRM e Projetos: tudo do cartão, menos o rodapé (etapa e ações).
      ".crm-page .feature-card > :not(.feature-card-footer)",
      ".projects-page .feature-card > :not(.feature-card-footer)",
    ]);
    await t.navegar(endereco("HUB_URL") + "/painel", { primeiraVisita: false });
    await t.pular(3000); // os dados chegam
    await t.conferirBorrado(".activity-list .activity-text");
    t.marca("painel");
    await t.gravar(1200);
    await t.rolar(".dashboard-duo", 2400, { folga: f === "pe" ? 90 : 130 }); // conteúdo por etapa e o funil
    await t.gravar(1000);
    t.marca("painelFim");

    await t.clicar('a[href="/producao"]');
    await t.irPara(0);
    await t.pular(1800);
    t.marca("producao");
    await t.gravar(900);
    // O quadro segue pra direita até a última coluna (Publicado).
    const fimDoQuadro = await t.js(`(() => { const b = document.querySelector(".board"); return b.scrollWidth - b.clientWidth; })()`);
    await t.rolarLado(".board", fimDoQuadro, f === "pe" ? 3000 : 2400);
    await t.gravar(800);
    t.marca("producaoFim");

    await t.clicar('a[href="/crm"]');
    await t.irPara(0);
    await t.pular(3000);
    await t.conferirBorrado(".crm-page .feature-card > :not(.feature-card-footer)");
    t.marca("crm");
    await t.gravar(800);
    await t.rolar(f === "pe" ? 420 : 300, 2000);
    await t.gravar(600);
    t.marca("fim");
  },
  montar(pasta, f, m) {
    const painel = quadro(pasta, m.painel);
    return {
      poster: painel,
      segmentos: [
        { parado: painel, dur: 0.8 },
        { pasta, de: m.painel, ate: m.painelFim - 1 },
        { pasta, de: m.producao, ate: m.producaoFim - 1, entra: { tipo: "fade", dur: 0.3 } },
        { pasta, de: m.crm, ate: m.fim - 1, entra: { tipo: "fade", dur: 0.3 } },
        { parado: painel, dur: 0.6, entra: { tipo: "fade", dur: 0.4 } },
      ],
    };
  },
};

// Torre de Controle: o Início e a lista de vagas ordenada pela nota (as mesmas
// telas da galeria do case). Borrado: o e-mail de quem está logado. Currículo,
// dossiê e conexões não são abertos.
ROTEIROS.torre = {
  slug: "torre",
  async gravar(t) {
    await t.borrar([".topo-dir .rotulo"]);
    await t.navegar(endereco("TORRE_URL") + "/", { primeiraVisita: false });
    await t.pular(3000);
    await t.conferirBorrado(".topo-dir .rotulo");
    t.marca("inicio");
    await t.gravar(1500);
    await t.clicar('a[href="#vagas"]');
    await t.irPara(0);
    await t.gravar(1300);
    await t.rolar(560, 2800);
    await t.gravar(800);
    t.marca("fim");
  },
  montar(pasta, f, m) {
    const inicio = quadro(pasta, m.inicio);
    return {
      poster: inicio,
      segmentos: [
        { parado: inicio, dur: 0.8 },
        { pasta, de: m.inicio, ate: m.fim - 1 },
        { parado: inicio, dur: 0.6, entra: { tipo: "fade", dur: 0.4 } },
      ],
    };
  },
};

// ── Ferramentas do Hub (cada uma é um projeto próprio no portfólio) ───────
// Mesma janela logada e mesmo endereço (HUB_URL). Nenhum botão que busca,
// envia ou salva é clicado: só navegação, rolagem e troca de aba. O único
// texto escrito em cena (o pedido ao assistente) não é enviado.
const BORRAR_HUB = [
  ".dashboard-latest b",
  ".activity-list .activity-text",
  ".trend-chart svg text",
  ".goals-mini .goal-mini-top",
  // CRM e Projetos: tudo do cartão, menos o rodapé (etapa e ações).
  ".crm-page .feature-card > :not(.feature-card-footer)",
  ".projects-page .feature-card > :not(.feature-card-footer)",
  // Lista de contatos: tudo, menos a coluna de ações.
  ".crm-page tbody td:not(:last-child)",
  // Prospecção: a mensagem de abordagem, a contagem do dia e os números e
  // nomes do relatório.
  ".template-textarea",
  ".prospect-security-banner .security-badge",
  ".performance-report-container .kpi-value",
  ".performance-report-container .kpi-sub",
  ".follow-up-info",
  ".niche-ranking-info",
  ".niche-rate-text",
  ".tone-comp-header",
  ".tone-comparison-item .muted",
];

// Fim da rolagem lateral de um quadro (a última coluna encostada na direita).
const fimDoQuadro = (t) => t.js(`(() => { const b = document.querySelector(".board"); return b.scrollWidth - b.clientWidth; })()`);

// Filme de ferramenta: começa e termina no primeiro quadro (o pôster).
const filmeEmPartes = (pasta, m, partes) => {
  const poster = quadro(pasta, m[partes[0][0]]);
  return {
    poster,
    segmentos: [
      { parado: poster, dur: 0.8 },
      ...partes.map(([de, ate], i) => ({ pasta, de: m[de], ate: m[ate] - 1, ...(i ? { entra: { tipo: "fade", dur: 0.3 } } : {}) })),
      { parado: poster, dur: 0.6, entra: { tipo: "fade", dur: 0.4 } },
    ],
  };
};

// Prospecção ativa: a busca de empresas (abordagem, nicho, região, filtros) e
// o relatório, com os números borrados. O botão de buscar não é tocado.
ROTEIROS["prospeccao-ativa"] = {
  slug: "prospeccao-ativa",
  crf: 30, // tela cheia de texto miúdo rolando: sem isso o filme passa de 1,5 MB
  async gravar(t, f) {
    await t.borrar(BORRAR_HUB);
    await t.navegar(endereco("HUB_URL") + "/crm", { primeiraVisita: false });
    await t.pular(3000);
    await t.clicarTexto("Prospecção & Campanhas", ".pill-tabs");
    await t.pular(1800);
    await t.conferirBorrado(".template-textarea");
    await t.irPara(".pill-tabs", f === "pe" ? 80 : 110);
    await t.pular(400);
    t.marca("busca");
    await t.gravar(1200);
    await t.rolar(".niche-accordion", 2200, { folga: f === "pe" ? 110 : 170 }); // os nichos
    await t.gravar(700);
    await t.rolar(".prospect-search-grid", 1900, { folga: f === "pe" ? 110 : 200 }); // segmento, região, filtros
    await t.gravar(1000);
    t.marca("buscaFim");

    await t.clicarTexto("Relatório de Performance", ".prospect-subnav");
    await t.pular(1800);
    await t.conferirBorrado(".performance-report-container .kpi-value");
    await t.irPara(".prospect-subnav", f === "pe" ? 90 : 130);
    await t.pular(400);
    t.marca("relatorio");
    await t.gravar(900);
    await t.rolar((await t.js("scrollY")) + (f === "pe" ? 320 : 260), 1700);
    await t.gravar(600);
    t.marca("fim");
  },
  montar: (pasta, f, m) => filmeEmPartes(pasta, m, [["busca", "buscaFim"], ["relatorio", "fim"]]),
};

// Funil de clientes: as colunas do funil e a lista de contatos, com tudo que
// identifica alguém borrado.
ROTEIROS["funil-de-clientes"] = {
  slug: "funil-de-clientes",
  async gravar(t, f) {
    await t.borrar(BORRAR_HUB);
    await t.navegar(endereco("HUB_URL") + "/crm", { primeiraVisita: false });
    await t.pular(3500);
    await t.conferirBorrado(".crm-page .feature-card > :not(.feature-card-footer)");
    await t.irPara(".pill-tabs", f === "pe" ? 80 : 110);
    await t.pular(400);
    t.marca("funil");
    await t.gravar(1000);
    await t.rolar((await t.js("scrollY")) + (f === "pe" ? 420 : 320), 2200);
    await t.gravar(700);
    t.marca("funilFim");

    await t.clicarTexto("Contatos", ".pill-tabs");
    await t.pular(2000);
    await t.conferirBorrado(".crm-page tbody td:not(:last-child)");
    await t.irPara(".pill-tabs", f === "pe" ? 80 : 110);
    await t.pular(400);
    t.marca("contatos");
    await t.gravar(900);
    await t.rolar((await t.js("scrollY")) + (f === "pe" ? 360 : 300), 1900);
    await t.gravar(600);
    t.marca("fim");
  },
  montar: (pasta, f, m) => filmeEmPartes(pasta, m, [["funil", "funilFim"], ["contatos", "fim"]]),
};

// Assistente do Hub: o painel abre sobre o painel geral e um pedido é escrito
// (o texto é um dos exemplos do próprio assistente). Não é enviado.
ROTEIROS["assistente-do-hub"] = {
  slug: "assistente-do-hub",
  async gravar(t) {
    await t.borrar(BORRAR_HUB);
    await t.navegar(endereco("HUB_URL") + "/painel", { primeiraVisita: false });
    await t.pular(3000);
    await t.conferirBorrado(".activity-list .activity-text");
    t.marca("painel");
    await t.gravar(900);
    await t.clicar(".assistant-fab");
    await t.gravar(1400); // o painel abre
    await t.digitarEmCena(".assistant-input textarea", "O que está atrasado no financeiro?");
    await t.gravar(1500);
    t.marca("fim");
  },
  montar: (pasta, f, m) => filmeEmPartes(pasta, m, [["painel", "fim"]]),
};

// Produção de conteúdo: o quadro da ideia ao publicado e o calendário.
ROTEIROS["producao-de-conteudo"] = {
  slug: "producao-de-conteudo",
  async gravar(t, f) {
    await t.borrar(BORRAR_HUB);
    await t.navegar(endereco("HUB_URL") + "/producao", { primeiraVisita: false });
    await t.pular(3000);
    await t.irPara(0);
    t.marca("quadro");
    await t.gravar(1000);
    await t.rolarLado(".board", await fimDoQuadro(t), f === "pe" ? 3000 : 2400);
    await t.gravar(900);
    t.marca("quadroFim");

    await t.clicarTexto("Calendário", ".pill-tabs");
    await t.pular(1500);
    t.marca("calendario");
    await t.gravar(1600);
    t.marca("fim");
  },
  montar: (pasta, f, m) => filmeEmPartes(pasta, m, [["quadro", "quadroFim"], ["calendario", "fim"]]),
};

// Projetos e tarefas: o quadro do pendente ao entregue e os filtros por tipo.
// Os títulos (que têm nome de cliente) ficam borrados.
ROTEIROS["projetos-e-tarefas"] = {
  slug: "projetos-e-tarefas",
  async gravar(t, f) {
    const borrado = ".projects-page .feature-card > :not(.feature-card-footer)";
    await t.borrar(BORRAR_HUB);
    await t.navegar(endereco("HUB_URL") + "/projetos", { primeiraVisita: false });
    await t.pular(3500);
    await t.conferirBorrado(borrado);
    await t.irPara(0);
    t.marca("quadro");
    await t.gravar(1000);
    await t.rolarLado(".board", await fimDoQuadro(t), f === "pe" ? 3000 : 2400);
    await t.gravar(800);
    t.marca("quadroFim");

    await t.rolarLado(".board", 0, 1);
    await t.clicarTexto("Cliente", ".pill-tabs");
    await t.pular(900);
    await t.conferirBorrado(borrado);
    t.marca("filtros");
    await t.gravar(1100);
    await t.clicarTexto("Interno", ".pill-tabs");
    await t.pular(100);
    await t.conferirBorrado(borrado);
    await t.gravar(1200);
    t.marca("fim");
  },
  montar: (pasta, f, m) => filmeEmPartes(pasta, m, [["quadro", "quadroFim"], ["filtros", "fim"]]),
};

// ── Sistema feito pra uma empresa privada (não citada) ────────────────────
// Gravado numa cópia de demonstração que roda só nesta máquina, com dados
// inventados, relógio fixo e sem a marca da empresa: nenhuma tela mostra
// cliente, funcionário ou número real, então nada precisa ser borrado. A
// cópia não fala com banco nem com automação. Fica em brutos/hub-demo (fora
// do git):  node brutos/hub-demo/build.mjs && node brutos/hub-demo/servir.mjs
const demo = () => (process.env.DEMO_URL ?? "http://127.0.0.1:5599").replace(/\/$/, "");
const abrirDemo = async (t, tela) => {
  await t.navegar(demo() + "/");
  await t.pular(3000); // fontes e dados da demonstração
  await t.js(`${tela}; 0`);
  await t.pular(900);
};

// Controle de ponto: o dia de hoje e o mês, o banco de horas e os dois
// disparos do último dia do mês (o aviso de dia sem registro e o espelho em PDF).
ROTEIROS.ponto = {
  slug: "ponto",
  async gravar(t, f) {
    await abrirDemo(t, `navigate("ponto")`);
    t.marca("registros");
    await t.gravar(1300);
    await t.rolar(f === "pe" ? 640 : 330, 2600); // do dia de hoje ao resumo e à tabela do mês
    await t.gravar(1100);
    t.marca("registrosFim");

    await t.js(`switchPontoTab("banco"); 0`);
    await t.irPara(".ponto-tab", f === "pe" ? 70 : 28); // as abas no topo, o banco de horas logo abaixo
    await t.pular(600);
    t.marca("banco");
    await t.gravar(1700);
    t.marca("bancoFim");

    await t.js(`navigate("envios"); 0`);
    await t.pular(1500);
    await t.irPara("#envios-lista .card:nth-child(3)", f === "pe" ? 70 : 28);
    await t.pular(100);
    t.marca("envios");
    await t.gravar(1900);
    t.marca("fim");
  },
  montar: (pasta, f, m) => filmeEmPartes(pasta, m, [["registros", "registrosFim"], ["banco", "bancoFim"], ["envios", "fim"]]),
};

// Implantação de clientes: a lista por semana (com quem atrasou no topo), um
// cliente aberto com o roteiro e o prazo, a ata pronta pro WhatsApp e o
// painel que pausa as mensagens automáticas. Nenhum botão de envio é tocado.
ROTEIROS.implantacao = {
  slug: "implantacao",
  async gravar(t, f) {
    await abrirDemo(t, `navigate("implantacoes")`);
    t.marca("lista");
    await t.gravar(1200);
    await t.rolar(f === "pe" ? 560 : 420, 2600); // cada cliente na sua semana
    await t.gravar(900);
    t.marca("listaFim");

    await t.js(`openCliente("c3", "implantacoes"); 0`);
    await t.pular(900);
    await t.irPara(0);
    t.marca("cliente");
    await t.gravar(1100);
    await t.rolar(f === "pe" ? 560 : 260, 2200); // as semanas concluídas e a lista da semana em andamento
    await t.gravar(900);
    t.marca("clienteFim");

    await t.js(`gerarAtaFaseWA("c3", "fase_4"); 0`);
    await t.pular(500);
    t.marca("ata");
    await t.gravar(2000);
    t.marca("ataFim");

    await t.js(`closeModal("modal-ata"); navigate("envios"); 0`);
    await t.pular(1500);
    await t.irPara("#envios-lista", f === "pe" ? 70 : 28);
    await t.pular(100);
    t.marca("envios");
    await t.gravar(1800);
    t.marca("fim");
  },
  montar: (pasta, f, m) => filmeEmPartes(pasta, m, [["lista", "listaFim"], ["cliente", "clienteFim"], ["ata", "ataFim"], ["envios", "fim"]]),
};

async function main() {
  const [nome, ...opcoes] = process.argv.slice(2);
  const nomes = nome === "todos" ? Object.keys(ROTEIROS) : [nome];
  if (!nome || nomes.some((n) => !ROTEIROS[n])) {
    console.log(`uso: node scripts/gravar-capa.mjs <${Object.keys(ROTEIROS).join("|")}|todos> [--folha] [--montar] [--pe|--larga]`);
    process.exit(1);
  }
  const soMontar = opcoes.includes("--montar");
  const formatos = Object.keys(FORMATOS).filter((f) => !opcoes.some((o) => o === "--pe" || o === "--larga") || opcoes.includes(`--${f}`));
  const chrome = soMontar ? null : await abrirChrome();
  try {
    for (const projeto of nomes) {
      const roteiro = ROTEIROS[projeto];
      for (const f of formatos) {
        // O roteiro pode trocar o enquadramento de um formato (tela do projeto que não cabe no padrão).
        const formato = { ...FORMATOS[f], ...roteiro.formatos?.[f] };
        const pasta = path.join(TRABALHO, projeto, f);
        if (!soMontar) {
          const tomada = await novaTomada(chrome.porta, formato, pasta);
          const inicio = Date.now();
          await roteiro.gravar(tomada, f);
          await tomada.fechar();
          console.log(`${projeto} ${f}: ${tomada.n} quadros em ${Math.round((Date.now() - inicio) / 1000)} s`, tomada.marcas);
        }
        if (opcoes.includes("--folha")) {
          await folha(pasta, path.join(TRABALHO, `${projeto}-${f}.jpg`));
          console.log(`  folha: ${path.join(TRABALHO, `${projeto}-${f}.jpg`)}`);
          continue;
        }
        const { marcas } = JSON.parse(fs.readFileSync(path.join(pasta, "marcas.json"), "utf8"));
        const { segmentos, poster } = await roteiro.montar(pasta, f, marcas);
        const sufixo = f === "larga" ? "-larga" : "";
        for (const [variante, tamanho] of Object.entries(formato.saidas)) {
          const arquivo = path.join(SAIDA, `capa-${roteiro.slug}${sufixo}${variante}.mp4`);
          const r = montar(segmentos, tamanho, arquivo, roteiro.crf);
          console.log(`  ${arquivo}: ${r.duracao.toFixed(1)} s, ${r.kb} KB`);
        }
        const [w, h] = formato.saidas[""];
        await sharp(poster)
          .resize(w, h, { fit: "cover", kernel: "lanczos3" })
          .webp({ quality: 92, smartSubsample: true })
          .toFile(path.join(SAIDA, `capa-${roteiro.slug}${sufixo}.webp`));
      }
    }
  } finally {
    chrome?.fechar();
  }
}

await main();
