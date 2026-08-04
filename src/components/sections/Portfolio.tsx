import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { portfolioIntro, portfolioProjects, sectionMarkers } from "@/data/content";

export default function Portfolio() {
  return (
    <section id="portfolio" className="section">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Portfólio" number={sectionMarkers.portfolio} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            {portfolioIntro.header}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="prose-measure mt-6 text-[18px] text-black/70">
            {portfolioIntro.sub}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {portfolioProjects.map((project, i) => (
            <Reveal key={project.title} delay={i * 100}>
              <div className="card h-full">
                <span className="eyebrow">{project.tag}</span>
                <h3 className="mt-5 text-2xl">{project.title}</h3>
                <p className="mt-4 text-black/70">{project.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={320}>
          <p className="mt-14 text-[clamp(22px,2.6vw,30px)] font-semibold">
            {portfolioIntro.fecho}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
