// Classes do CSS publicado que não aparecem em src/. Com o Tailwind lendo só
// src/ (source("..") no @import de globals.css), o esperado é sobrar só o que o
// next/font gera. Qualquer outra veio de um arquivo varrido por engano (docs,
// .md de skill) e é CSS publicado que nenhum elemento usa.
//
//   npm run build && node scripts/qa/classes-fora-do-src.mjs
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const CSS_DIR = join("out", "_next", "static", "chunks");
if (!existsSync(CSS_DIR)) {
  console.error("classes-fora-do-src: rode npm run build antes.");
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

// Classes do CSS publicado, sem os escapes (\[ \: \/ ...). O conteúdo de url()
// sai antes: o ".woff2" do caminho de uma fonte não é classe.
const css = readdirSync(CSS_DIR)
  .filter((f) => f.endsWith(".css"))
  .map((f) => readFileSync(join(CSS_DIR, f), "utf8").replace(/url\([^)]*\)/g, ""))
  .join("\n");
const publicadas = new Set();
for (const [, nome] of css.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)) {
  const classe = nome.replace(/\\(.)/g, "$1");
  if (!/^\d/.test(classe)) publicadas.add(classe);
}

// Tokens de src/: classes escritas em TS/TSX (separadas por espaço, aspas,
// crase ou chave) e classes definidas nos CSS de src/.
const tokens = new Set();
for (const arquivo of listar("src")) {
  const texto = readFileSync(arquivo, "utf8");
  if (arquivo.endsWith(".css")) {
    for (const [, nome] of texto.matchAll(/\.([A-Za-z][\w-]*)/g)) tokens.add(nome);
  } else if (/\.(tsx?|jsx?)$/.test(arquivo)) {
    for (const token of texto.split(/[\s"'`{}]+/)) if (token) tokens.add(token);
  }
}

const NEXT_FONT = /-module__/;
const fora = [...publicadas].filter((c) => !tokens.has(c) && !NEXT_FONT.test(c)).sort();

console.log(`classes no CSS publicado: ${publicadas.size}`);
if (fora.length === 0) {
  console.log("todas vêm de src/ (além das do next/font).");
} else {
  console.log(`${fora.length} classes que não aparecem em src/ (CSS sem uso; confira de onde o Tailwind tirou):`);
  for (const classe of fora) console.log(`  ${classe}`);
  process.exitCode = 1;
}
