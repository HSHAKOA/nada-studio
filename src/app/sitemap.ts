import type { MetadataRoute } from "next";
import { PROJETOS } from "@/data/portfolio";

export const dynamic = "force-static";

const siteUrl = "https://www.nadastudio.com.br";

const PAGINAS: [string, MetadataRoute.Sitemap[number]["changeFrequency"], number][] = [
  ["", "monthly", 1],
  ["/sobre", "monthly", 0.7],
  ["/portfolio", "monthly", 0.8],
  ["/motion", "monthly", 0.7],
  ["/ia-para-empresas", "monthly", 0.7],
  ["/equipe", "monthly", 0.6],
  ["/como-funciona", "monthly", 0.7],
  ["/faq", "monthly", 0.6],
  ...PROJETOS.map((p): [string, "monthly", number] => [`/portfolio/${p.slug}`, "monthly", 0.6]),
  ["/termos-de-uso", "yearly", 0.3],
  ["/politica-de-privacidade", "yearly", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGINAS.map(([caminho, changeFrequency, priority]) => ({
    url: `${siteUrl}${caminho}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
