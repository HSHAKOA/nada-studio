// Serve o export estático (out/) do jeito que o Cloudflare Pages serve:
// /sobre → sobre.html, 404.html pra rota que não existe e Range pros vídeos.
// O `next dev` não serve pra medir (código sem minificar, sem prefetch).
//
//   npm run build && node scripts/qa/servir.mjs          http://127.0.0.1:4173
//   node scripts/qa/servir.mjs 5000                       outra porta
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const RAIZ = resolve("out");
const PORTA = Number(process.argv[2] ?? 4173);
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
};

if (!existsSync(RAIZ)) {
  console.error("servir: pasta out/ não existe; rode npm run build antes.");
  process.exit(1);
}

function arquivoDe(url) {
  const caminho = decodeURIComponent(new URL(url, "http://x").pathname);
  const base = normalize(join(RAIZ, caminho));
  if (!base.startsWith(RAIZ)) return null;
  const opcoes = caminho.endsWith("/") ? [join(base, "index.html")] : [base, `${base}.html`, join(base, "index.html")];
  return opcoes.find((p) => existsSync(p) && statSync(p).isFile()) ?? null;
}

createServer((req, res) => {
  const arquivo = arquivoDe(req.url ?? "/");
  if (!arquivo) {
    res.writeHead(404, { "content-type": TIPOS[".html"] });
    createReadStream(join(RAIZ, "404.html")).pipe(res);
    return;
  }
  const tipo = TIPOS[extname(arquivo)] ?? "application/octet-stream";
  const tamanho = statSync(arquivo).size;
  const faixa = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  if (faixa) {
    const inicio = faixa[1] ? Number(faixa[1]) : 0;
    const fim = faixa[2] ? Number(faixa[2]) : tamanho - 1;
    res.writeHead(206, {
      "content-type": tipo,
      "content-range": `bytes ${inicio}-${fim}/${tamanho}`,
      "content-length": fim - inicio + 1,
      "accept-ranges": "bytes",
    });
    createReadStream(arquivo, { start: inicio, end: fim }).pipe(res);
    return;
  }
  res.writeHead(200, { "content-type": tipo, "content-length": tamanho, "accept-ranges": "bytes" });
  createReadStream(arquivo).pipe(res);
}).listen(PORTA, "127.0.0.1", () => console.log(`out/ em http://127.0.0.1:${PORTA}`));
