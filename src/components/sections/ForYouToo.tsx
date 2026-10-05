import SectionMarker from "@/components/SectionMarker";
import { buildWhatsAppLink, forYou, sectionMarkers } from "@/data/content";

// Pra quem a NADA Studio trabalha, em lista editorial (fio, número, público e
// a cena do que sai das costas de cada um). O fio do topo é o divisor com o
// manifesto: é ali que a poeira do buraco negro pousa (BuracoNegro.tsx).
export default function ForYouToo() {
  return (
    <section id="pra-quem" className="section pt-0">
      <div className="wrap">
        <div data-entra="linha" className="regua-topo pt-[clamp(56px,8vw,112px)]">
          <SectionMarker label="Pra quem" number={sectionMarkers.forYou} />
          <h2 data-entra="titulo" className="max-w-3xl text-[clamp(32px,4.2vw,52px)]">
            {forYou.title}
          </h2>
          <ol data-entra="linha" className="regua-topo mt-14">
            {forYou.itens.map((item) => (
              <li key={item.num} data-entra="linha" className="regua grid gap-3 py-8 md:grid-cols-12 md:gap-8">
                <span className="text-sm text-black/40 md:col-span-1">{item.num}</span>
                <h3 className="text-[clamp(22px,2.6vw,32px)] md:col-span-4">{item.publico}</h3>
                <p className="text-[17px] text-black/70 md:col-span-7 md:pt-1">{item.texto}</p>
              </li>
            ))}
          </ol>
          <a
            href={buildWhatsAppLink("Oi! Quero tirar uma tarefa repetitiva da minha rotina.")}
            className="link-u mt-10 inline-block py-2 text-lg font-medium"
          >
            Me conta o que você precisa <span className="seta" aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
