import FraseSocio from "@/components/FraseSocio";
import RetratoSocio from "@/components/RetratoSocio";
import SectionMarker from "@/components/SectionMarker";
import { foundersIntro, sectionMarkers } from "@/data/content";
import { sociosComRetrato } from "@/lib/retratos";

// Com os dois retratos em public/equipe (hoje): quadro em pé (9:16), em cor,
// canto reto, com a foto se aproximando no scroll (RetratoSocio). Sem eles:
// ficha compacta com a foto pequena, sem quadro preto repetindo o nome
// (src/lib/retratos.ts confere no build). Os retratos só aparecem aqui.
export default function Founders() {
  const founders = sociosComRetrato();
  const comRetrato = founders.every((s) => s.retrato);

  return (
    <section id="quem-e-a-nada" className="section">
      <div className="wrap">
        <SectionMarker label="Quem é a NADA Studio" number={sectionMarkers.founders} />
        <h1 data-entra="titulo" className="max-w-3xl text-[clamp(36px,5vw,64px)]">
          {foundersIntro.header}
        </h1>
        <p className="prose-measure mt-6 text-[18px] text-black/70">{foundersIntro.text}</p>

        <div className={`mt-16 grid gap-x-8 md:grid-cols-2 ${comRetrato ? "gap-y-14" : "gap-y-0"}`}>
          {founders.map((socio, i) => (
            <article key={socio.name} data-entra="linha" className={comRetrato ? "" : "regua-topo pt-8 pb-10"}>
              {comRetrato && socio.retrato && (
                <RetratoSocio src={socio.retrato} alt={`Retrato de ${socio.name}`} posicao={socio.posicao} />
              )}

              <p className="eyebrow">( sócio ) {String(i + 1).padStart(2, "0")}</p>
              <div className="mt-5 flex items-center gap-5">
                {socio.photo && !comRetrato && (
                  // loading lazy: sem isso o React manda um preload da foto
                  // junto com o prefetch da página, em todas as páginas.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={socio.photo}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="h-16 w-16 grayscale contrast-125"
                  />
                )}
                <div>
                  <h2 className="text-[clamp(28px,3vw,40px)] font-black tracking-[-0.03em]">{socio.name}</h2>
                  <p className="text-sm text-black/60">{socio.role}</p>
                </div>
              </div>

              {socio.frase && <FraseSocio frase={socio.frase} atraso={i * 0.2} />}

              <ul className="mt-6 space-y-1.5 text-[15px] text-black/65">
                {socio.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
