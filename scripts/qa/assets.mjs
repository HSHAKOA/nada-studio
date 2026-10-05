// Confere se todo arquivo local citado no export (HTML e payload das rotas,
// onde estão o srcset das imagens e o src dos vídeos) existe em out/. Pega
// imagem sem as larguras geradas, vídeo renomeado e link interno quebrado.
//
//   npm run build && node scripts/qa/assets.mjs
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
if (!existsSync(OUT)) {
  console.error("assets: pasta out/ não existe; rode npm run build antes.");
  process.exit(1);
}

function listar(dir, lista = []) {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) listar(caminho, lista);
    else lista.push(caminho);
  }
  return lista;
}

const textos = listar(OUT).filter((p) => /\.(html|txt)$/.test(p));

// Arquivo: caminho absoluto local com extensão de asset. O lookbehind evita
// pegar o fim de uma URL externa (".com.br/imagem.png").
const ARQUIVO = /(?<![\w.:/-])\/(?:[\w.-]+\/)*[\w.-]+\.(?:webp|avif|png|jpe?g|gif|svg|ico|mp4|webm|woff2|txt|xml|pdf)\b/g;
// Rota: href interno sem extensão (links do HTML).
const ROTA = /href="(\/[^"#?]*)(?:[#?][^"]*)?"/g;

const faltando = new Map();
const anotar = (caminho, origem) => {
  if (!faltando.has(caminho)) faltando.set(caminho, new Set());
  faltando.get(caminho).add(origem);
};

let arquivos = 0;
let rotas = 0;
for (const texto of textos) {
  const conteudo = readFileSync(texto, "utf8");
  const origem = texto.slice(OUT.length + 1).replace(/\\/g, "/");
  for (const [caminho] of conteudo.matchAll(ARQUIVO)) {
    if (caminho.startsWith("/_next/static/") && caminho.endsWith(".txt")) continue;
    arquivos++;
    if (!existsSync(join(OUT, decodeURIComponent(caminho)))) anotar(caminho, origem);
  }
  if (!texto.endsWith(".html")) continue;
  for (const [, rota] of conteudo.matchAll(ROTA)) {
    if (/\.\w+$/.test(rota) || rota.startsWith("/_next/")) continue;
    rotas++;
    const base = join(OUT, rota);
    const existe = rota === "/" || existsSync(`${base}.html`) || existsSync(join(base, "index.html"));
    if (!existe) anotar(rota, origem);
  }
}

console.log(`${arquivos} referências a arquivo e ${rotas} links internos conferidos em ${textos.length} arquivos.`);
if (faltando.size === 0) {
  console.log("nada faltando.");
} else {
  console.log(`${faltando.size} caminhos sem arquivo em out/:`);
  for (const [caminho, origens] of faltando) console.log(`  ${caminho}  ← ${[...origens].slice(0, 3).join(", ")}`);
  process.exitCode = 1;
}
