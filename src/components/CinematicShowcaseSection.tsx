"use client";

import { useEffect, useRef } from "react";
import { initGSAP } from "@/lib/gsap";

export default function CinematicShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { gsap } = initGSAP();
    const section = sectionRef.current;
    const copy = copyRef.current;

    if (!section || !copy) {
      return;
    }

    const gsapContext = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=1500",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      timeline.fromTo(
        "[data-showcase-reveal]",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.13,
          ease: "power3.out",
          duration: 0.36,
        },
      );

      timeline.to(
        copy,
        {
          yPercent: -42,
          opacity: 0.12,
          ease: "none",
          duration: 0.64,
        },
        0.32,
      );
    }, section);

    return () => {
      gsapContext.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen items-center overflow-hidden border-y border-white/8 bg-[radial-gradient(1100px_520px_at_72%_8%,rgba(168,139,93,0.22),transparent_70%),radial-gradient(900px_520px_at_12%_92%,rgba(138,180,255,0.16),transparent_72%),linear-gradient(180deg,#090b12,#06070b)]"
    >
      <div className="section-shell relative z-10">
        <div ref={copyRef} className="max-w-3xl will-change-transform">
          <p
            data-showcase-reveal
            className="mb-4 inline-flex rounded-full border border-platinum/35 bg-black/35 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-platinum uppercase"
          >
            Dynamic Chassis Story
          </p>
          <h2
            data-showcase-reveal
            className="display-title text-[2rem] font-semibold text-pearl md:text-5xl lg:text-6xl"
          >
            Every Scroll Step Feels
            <span className="block text-accent-soft">Like A Cinematic Reveal</span>
          </h2>
          <p
            data-showcase-reveal
            className="mt-5 max-w-2xl text-sm leading-relaxed text-mist/90 md:text-base"
          >
            Precision engineering highlights emerge layer by layer while the heading
            glides upward, matching the hero section motion language.
          </p>
        </div>
      </div>
    </section>
  );
}
