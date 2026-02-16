"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { initGSAP } from "@/lib/gsap";

export default function BlueprintSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const realisticRef = useRef<HTMLDivElement>(null);
  const blueprintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = initGSAP();
    const section = sectionRef.current;
    const realistic = realisticRef.current;
    const blueprint = blueprintRef.current;

    if (!section || !realistic || !blueprint) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        realistic,
        { opacity: 1, scale: 1 },
        {
          opacity: 0.2,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            end: "bottom 35%",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        blueprint,
        { opacity: 0, scale: 1.08 },
        {
          opacity: 0.95,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            end: "bottom 35%",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        "[data-blueprint-reveal]",
        { y: 26, opacity: 0 },
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
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <div className="section-shell grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/15 bg-black/40 shadow-luxury">
          <div
            ref={realisticRef}
            className="absolute inset-0"
          >
            <Image
              src="/images/car-realistic.jpg"
              alt="Realistic luxury car render"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          <div
            ref={blueprintRef}
            className="absolute inset-0 mix-blend-screen"
          >
            <Image
              src="/images/car-blueprint.png"
              alt="Technical blueprint overlay"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(138,180,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(138,180,255,0.16)_1px,transparent_1px)] bg-[size:36px_36px]" />
        </div>

        <div>
          <p
            data-blueprint-reveal
            className="mb-4 text-xs font-semibold tracking-[0.26em] text-signal uppercase"
          >
            Precision Draft
          </p>
          <h2
            data-blueprint-reveal
            className="display-title text-4xl font-semibold text-pearl md:text-5xl"
          >
            Sculpted Exterior, Computationally Balanced
          </h2>
          <p
            data-blueprint-reveal
            className="mt-5 text-sm leading-relaxed text-mist/90 md:text-base"
          >
            Active aero surfaces and pressure-channel body lines are modeled for
            stability at high velocity while preserving a clean, unmistakable silhouette.
          </p>
          <ul
            data-blueprint-reveal
            className="mt-8 space-y-3 text-sm text-platinum md:text-base"
          >
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />
              CFD-tuned drag coefficient: 0.23
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Carbon monocoque with titanium reinforcement
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Active rear aero-flap with adaptive response
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
