import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { sectionMarkers, steps } from "@/data/content";

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Como funciona" number={sectionMarkers.howItWorks} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            Sem tecniquês. Do começo ao fim.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 90}>
              <div className="flex gap-5 border-t border-black/10 pt-6">
                <span
                  className="text-3xl text-black/25"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.number}
                </span>
                <div>
                  <h3 className="text-xl">{step.title}</h3>
                  <p className="mt-2 text-black/70">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
