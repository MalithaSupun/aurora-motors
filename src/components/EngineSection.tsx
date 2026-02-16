"use client";

import { useEffect, useRef } from "react";
import { initGSAP } from "@/lib/gsap";

type EngineSpec = {
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
};

const SPECS: EngineSpec[] = [
  { label: "Horsepower", value: 920, suffix: " HP" },
  { label: "0-100 km/h", value: 2.7, suffix: " s", decimals: 1 },
  { label: "Top Speed", value: 356, suffix: " km/h" },
  { label: "Torque", value: 1200, suffix: " Nm" },
];

export default function EngineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const { gsap } = initGSAP();
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-engine-reveal]",
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        },
      );

      counterRefs.current.forEach((counterElement, index) => {
        const spec = SPECS[index];
        if (!counterElement || !spec) {
          return;
        }

        const countState = { value: 0 };
        gsap.to(countState, {
          value: spec.value,
          duration: 2.2,
          delay: index * 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true,
          },
          onUpdate: () => {
            const digits = spec.decimals ?? 0;
            const output = countState.value.toLocaleString(undefined, {
              minimumFractionDigits: digits,
              maximumFractionDigits: digits,
            });
            counterElement.textContent = `${output}${spec.suffix}`;
          },
        });
      });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-white/8 py-24 md:py-32"
    >
      <div className="section-shell">
        <div
          data-engine-reveal
          className="premium-border mb-10 rounded-3xl p-8 shadow-luxury md:mb-12 md:p-10"
        >
          <p className="mb-4 text-xs font-semibold tracking-[0.26em] text-accent-soft uppercase">
            Power Architecture
          </p>
          <h2 className="display-title max-w-3xl text-4xl font-semibold text-pearl md:text-5xl">
            Twin-Turbo V12, Electronically Tuned for Brutal Precision
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-mist/90 md:text-base">
            Variable-geometry boost response, active torque vectoring, and adaptive
            thermal management deliver relentless acceleration with composure.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {SPECS.map((spec, index) => (
            <article
              key={spec.label}
              data-engine-reveal
              className="premium-border rounded-2xl px-6 py-7"
            >
              <p className="text-xs font-semibold tracking-[0.2em] text-platinum/70 uppercase">
                {spec.label}
              </p>
              <p className="mt-4 text-3xl font-semibold text-pearl md:text-4xl">
                <span
                  ref={(element) => {
                    counterRefs.current[index] = element;
                  }}
                >
                  0{spec.suffix}
                </span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
