// Roda depois do `next build` (script "postbuild").
//
// O export estático do Next 16.2 e 16.3 (conferido no 16.3.8) grava um
// arquivo por segmento de rota pro prefetch do roteador
// (out/<rota>/__next.<segmento>.txt). O nome sai de
// `path.relative`, que no Windows devolve "\" e não "/"; a troca por "." só
// pega "/" (node_modules/next/dist/export/index.js e
// shared/lib/segment-cache/segment-value-encoding.js). Resultado no Windows:
//   out/faq/__next.faq/__PAGE__.txt      (pasta + arquivo)
// em vez de
//   out/faq/__next.faq.__PAGE__.txt      (o que o navegador pede)
// Cada pedido errado recebia o 404.html inteiro e a navegação perdia o
// prefetch. No Linux (build do Cloudflare Pages ou CI) não acontece e este
// script não faz nada.
import { existsSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
if (!existsSync(OUT)) {
  console.error("corrigir-export: pasta out/ não existe; rode depois do next build.");
  process.exit(1);
}

const pastasErradas = [];
(function procurar(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    if (!item.isDirectory()) continue;
    const caminho = join(dir, item.name);
    if (item.name.startsWith("__next.")) pastasErradas.push(caminho);
    else procurar(caminho);
  }
})(OUT);

let movidos = 0;
for (const pasta of pastasErradas) {
  const arquivos = [];
  (function listar(dir) {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      const caminho = join(dir, item.name);
      if (item.isDirectory()) listar(caminho);
      else arquivos.push(caminho);
    }
  })(pasta);

  for (const arquivo of arquivos) {
    // __next.portfolio + $d$slug\__PAGE__.txt  →  __next.portfolio.$d$slug.__PAGE__.txt
    const resto = relative(pasta, arquivo).split(sep).join(".");
    const destino = `${pasta}.${resto}`;
    if (existsSync(destino)) {
      console.error(`corrigir-export: ${destino} já existe; nada foi sobrescrito.`);
      process.exit(1);
    }
    renameSync(arquivo, destino);
    movidos++;
  }
  rmSync(pasta, { recursive: true });
}

// Conferência: não pode sobrar nenhuma pasta de segmento.
const sobrou = [];
(function conferir(dir) {
  for (const item of readdirSync(dir)) {
    const caminho = join(dir, item);
    if (!statSync(caminho).isDirectory()) continue;
    if (item.startsWith("__next.")) sobrou.push(caminho);
    else conferir(caminho);
  }
})(OUT);
if (sobrou.length) {
  console.error("corrigir-export: ainda há pastas de segmento:", sobrou.join(", "));
  process.exit(1);
}

console.log(
  movidos
    ? `corrigir-export: ${movidos} arquivos de prefetch renomeados (${pastasErradas.length} pastas).`
    : "corrigir-export: nada a corrigir."
);
