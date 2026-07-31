"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import SectionMarker from "@/components/SectionMarker";
import { faqItems, sectionMarkers } from "@/data/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="perguntas" className="section bg-[#fafafa]">
      <div className="wrap">
        <Reveal>
          <SectionMarker label="Perguntas" number={sectionMarkers.faq} />
        </Reveal>
        <Reveal delay={80}>
          <h2 className="max-w-2xl text-[clamp(32px,4.2vw,52px)]">
            Perguntas que todo mundo faz.
          </h2>
        </Reveal>

        <div className="mt-14 divide-y divide-black/10 border-t border-black/10">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-lg font-medium">{item.q}</span>
                    <span
                      aria-hidden
                      className={`shrink-0 text-2xl font-light transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="prose-measure pb-6 text-black/70">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
