"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { initGSAP } from "@/lib/gsap";

const INTERIOR_IMAGES = [
  { src: "/vehicles/vehicle-4.png", alt: "Bespoke grand tourer profile" },
  { src: "/vehicles/vehicle-2.png", alt: "Precision digital cockpit and console" },
  { src: "/vehicles/vehicle-3.png", alt: "Luxury performance body architecture" },
];

export default function InteriorSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { gsap } = initGSAP();
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-interior-copy]",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        },
      );

      gsap.utils
        .toArray<HTMLElement>("[data-parallax-frame]")
        .forEach((frame, index) => {
          gsap.fromTo(
            frame,
            { yPercent: -6 + index * 2 },
            {
              yPercent: 6 - index * 1.5,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <div className="section-shell">
        <div className="mb-10 max-w-3xl md:mb-12">
          <p
            data-interior-copy
            className="section-kicker mb-4"
          >
            Interior Craft
          </p>
          <h2
            data-interior-copy
            className="display-title text-4xl font-semibold text-pearl md:text-5xl"
          >
            Quiet Opulence in Motion
          </h2>
          <p
            data-interior-copy
            className="section-copy mt-5 text-sm md:text-base"
          >
            Every touch point is wrapped in full-grain leather, matte metal, and
            hand-finished carbon trim. Acoustic glass and adaptive ambience isolate the
            cabin from the outside world.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {INTERIOR_IMAGES.map((item, index) => (
            <article
              key={item.src}
              className={`group relative overflow-hidden rounded-2xl border border-white/15 ${
                index === 0
                  ? "md:col-span-5 md:row-span-2"
                  : index === 1
                    ? "md:col-span-7"
                    : "md:col-span-7"
              }`}
            >
              <div
                className={`relative ${
                  index === 0 ? "h-[30rem] md:h-[38rem]" : "h-72"
                }`}
              >
                <div data-parallax-frame className="absolute inset-0">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={
                      index === 0
                        ? "(min-width: 768px) 42vw, 100vw"
                        : "(min-width: 768px) 58vw, 100vw"
                    }
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="text-xs font-semibold tracking-[0.2em] text-accent-soft uppercase">
                  Suite {index + 1}
                </p>
                <p className="mt-2 max-w-xs text-sm text-pearl/95">{item.alt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
