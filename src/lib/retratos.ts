import { existsSync } from "node:fs";
import path from "node:path";
import { founders } from "@/data/content";

// Sócios com o retrato que já está no lugar. O site é estático, então a
// conferência acontece no build: o retrato só entra se a versão que o site
// serve (gerada por scripts/imagens.mjs) existir em public/. Sem o arquivo, o
// campo vem vazio e quem usa não desenha o quadro. Só pra componente de
// servidor (usa o sistema de arquivos).
export function sociosComRetrato() {
  return founders.map((socio) => {
    const servido = socio.retrato?.replace(/\.\w+$/, "-960.webp");
    const existe = servido ? existsSync(path.join(process.cwd(), "public", servido)) : false;
    return { ...socio, retrato: existe ? socio.retrato : undefined };
  });
}
