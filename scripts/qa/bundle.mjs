// Mede o export estático (out/): o JS e o CSS que cada página baixa, as fontes,
// a mídia publicada e quais bibliotecas de animação o código importa. Motion e
// Anime.js só entram no bundle se algum arquivo de src/ importar.
//
//   npm run build && node scripts/qa/bundle.mjs
//   node scripts/qa/bundle.mjs --salvar antes.json     guarda a medição
//   node scripts/qa/bundle.mjs --comparar antes.json   mostra a diferença
//
// Tamanhos em gzip nível 9 (o Cloudflare serve brotli, um pouco menor). Os
// scripts noModule (polyfill) ficam fora: navegador moderno não baixa.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const OUT = "out";
const LIBS = {
  gsap: /^gsap(\/|$)/,
  lenis: /^lenis(\/|$)/,
  motion: /^(motion|framer-motion)(\/|$)/,
  animejs: /^animejs(\/|$)/,
  three: /^(three|@react-three\/)/,
};

if (!existsSync(OUT)) {
  console.error("bundle: pasta out/ não existe; rode npm run build antes.");
  process.exit(1);
}

const args = process.argv.slice(2);
const opcao = (nome) => (args.includes(nome) ? args[args.indexOf(nome) + 1] : null);

function listar(dir, lista = []) {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) listar(caminho, lista);
    else lista.push(caminho);
  }
  return lista;
}

const kb = (bytes) => Math.round(bytes / 102.4) / 10;
const gz = (caminho) => gzipSync(readFileSync(caminho), { level: 9 }).length;
const tudo = listar(OUT);

// Por página: o que o HTML pede.
const paginas = {};
for (const html of tudo.filter((p) => p.endsWith(".html"))) {
  const rota = "/" + relative(OUT, html).replace(/\\/g, "/").replace(/(index)?\.html$/, "");
  const texto = readFileSync(html, "utf8");
  const scripts = [...texto.matchAll(/<script([^>]*)>/g)]
    .filter((m) => !/noModule/i.test(m[1]))
    .map((m) => /src="(\/_next\/[^"]+)"/.exec(m[1])?.[1])
    .filter(Boolean);
  const estilos = [...texto.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]);
  const soma = (lista) =>
    lista.map((s) => join(OUT, s.split("?")[0])).filter((p) => existsSync(p)).reduce((t, p) => t + gz(p), 0);
  paginas[rota] = {
    js_gz_kb: kb(soma(scripts)),
    css_gz_kb: kb(soma(estilos)),
    html_gz_kb: kb(gzipSync(texto).length),
    elementos: (texto.match(/<[a-z][^>]*>/gi) || []).length,
  };
}

// Bibliotecas de animação importadas em src/ (import estático e dinâmico).
const imports = Object.fromEntries(Object.keys(LIBS).map((lib) => [lib, []]));
for (const arquivo of listar("src").filter((p) => /\.(tsx?|jsx?|mjs)$/.test(p))) {
  const texto = readFileSync(arquivo, "utf8");
  for (const [, modulo] of texto.matchAll(/(?:from\s+|import\s*\(\s*)["']([^"']+)["']/g)) {
    for (const [lib, re] of Object.entries(LIBS)) {
      const nome = relative("src", arquivo).replace(/\\/g, "/");
      if (re.test(modulo) && !imports[lib].includes(nome)) imports[lib].push(nome);
    }
  }
}

const js = tudo.filter((p) => p.includes(join("_next", "static")) && p.endsWith(".js"));
const css = tudo.filter((p) => p.endsWith(".css"));
const fontes = tudo.filter((p) => /\.woff2?$/.test(p));
const preload = new Set(
  [...readFileSync(join(OUT, "index.html"), "utf8").matchAll(/<link[^>]+href="([^"]+\.woff2)"[^>]*>/g)].map((m) => m[1])
);
const midia = {};
for (const p of tudo.filter((p) => !p.includes("_next"))) {
  const ext = extname(p).toLowerCase();
  if (![".webp", ".avif", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".mp4", ".webm"].includes(ext)) continue;
  midia[ext] ??= { arquivos: 0, mb: 0 };
  midia[ext].arquivos++;
  midia[ext].mb += statSync(p).size / 1048576;
}
for (const ext in midia) midia[ext].mb = Math.round(midia[ext].mb * 10) / 10;

const medicao = {
  paginas,
  js_total: { arquivos: js.length, kb: kb(js.reduce((t, p) => t + statSync(p).size, 0)), gz_kb: kb(js.reduce((t, p) => t + gz(p), 0)) },
  css: css.map((p) => ({ arquivo: relative(OUT, p).replace(/\\/g, "/"), kb: kb(statSync(p).size), gz_kb: kb(gz(p)) })),
  fontes: { arquivos: fontes.length, kb: kb(fontes.reduce((t, p) => t + statSync(p).size, 0)), preload: preload.size },
  midia,
  imports,
};

const rotas = Object.keys(paginas).sort();
const largura = Math.max(...rotas.map((r) => r.length));
console.log(`${"página".padEnd(largura)}  JS gz  CSS gz  HTML gz  elementos`);
for (const rota of rotas) {
  const p = paginas[rota];
  console.log(
    `${rota.padEnd(largura)}  ${String(p.js_gz_kb).padStart(5)}  ${String(p.css_gz_kb).padStart(6)}  ${String(p.html_gz_kb).padStart(7)}  ${String(p.elementos).padStart(9)}`
  );
}
console.log(`\nJS do build: ${medicao.js_total.arquivos} arquivos, ${medicao.js_total.kb} KB (${medicao.js_total.gz_kb} KB gz)`);
for (const c of medicao.css) console.log(`CSS: ${c.arquivo} ${c.kb} KB (${c.gz_kb} KB gz)`);
console.log(`Fontes: ${medicao.fontes.arquivos} arquivos, ${medicao.fontes.kb} KB; ${medicao.fontes.preload} com preload na home`);
console.log("Mídia publicada:", Object.entries(midia).map(([e, m]) => `${e} ${m.arquivos} (${m.mb} MB)`).join(" · "));
console.log("\nBibliotecas de animação importadas em src/:");
for (const [lib, arquivosLib] of Object.entries(imports)) {
  console.log(`  ${lib.padEnd(8)} ${arquivosLib.length ? arquivosLib.join(", ") : "não importada (fora do bundle)"}`);
}

const salvar = opcao("--salvar");
if (salvar) {
  writeFileSync(salvar, JSON.stringify(medicao, null, 2));
  console.log(`\nMedição salva em ${salvar}`);
}

const comparar = opcao("--comparar");
if (comparar) {
  const antes = JSON.parse(readFileSync(comparar, "utf8"));
  console.log(`\nDiferença para ${comparar} (KB gz):`);
  for (const rota of rotas) {
    const a = antes.paginas?.[rota];
    if (!a) {
      console.log(`  ${rota.padEnd(largura)}  página nova`);
      continue;
    }
    const dj = Math.round((paginas[rota].js_gz_kb - a.js_gz_kb) * 10) / 10;
    const dc = Math.round((paginas[rota].css_gz_kb - a.css_gz_kb) * 10) / 10;
    if (dj || dc) console.log(`  ${rota.padEnd(largura)}  JS ${dj > 0 ? "+" : ""}${dj}  CSS ${dc > 0 ? "+" : ""}${dc}`);
  }
  const dt = Math.round((medicao.js_total.gz_kb - antes.js_total.gz_kb) * 10) / 10;
  console.log(`  JS total do build: ${dt > 0 ? "+" : ""}${dt} KB gz`);
}
