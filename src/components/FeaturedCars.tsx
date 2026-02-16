"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { initGSAP } from "@/lib/gsap";

type FeaturedCar = {
  name: string;
  year: string;
  power: string;
  price: string;
  image: string;
};

const FEATURED_CARS: FeaturedCar[] = [
  {
    name: "Aurora Velocity GT",
    year: "2026",
    power: "920 HP",
    price: "$820,000",
    image: "/frames/hero/ezgif-frame-146.jpg",
  },
  {
    name: "Aurora Eclipse R",
    year: "2025",
    power: "870 HP",
    price: "$760,000",
    image: "/frames/hero/ezgif-frame-168.jpg",
  },
  {
    name: "Aurora Atlas S",
    year: "2026",
    power: "790 HP",
    price: "$690,000",
    image: "/frames/hero/ezgif-frame-182.jpg",
  },
  {
    name: "Aurora Phantom RS",
    year: "2024",
    power: "940 HP",
    price: "$910,000",
    image: "/frames/hero/ezgif-frame-191.jpg",
  },
];

export default function FeaturedCars() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const { gsap } = initGSAP();
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-feature-reveal]",
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
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <div className="section-shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 md:mb-12">
          <div>
            <p
              data-feature-reveal
              className="mb-4 text-xs font-semibold tracking-[0.26em] text-accent-soft uppercase"
            >
              Featured Collection
            </p>
            <h2
              data-feature-reveal
              className="display-title text-4xl font-semibold text-pearl md:text-5xl"
            >
              Signature Inventory
            </h2>
          </div>
          <button
            type="button"
            data-feature-reveal
            className="rounded-full border border-platinum/40 px-6 py-3 text-xs font-semibold tracking-[0.2em] text-platinum uppercase transition hover:border-accent hover:text-accent-soft"
          >
            View Full Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {FEATURED_CARS.map((car) => (
            <article
              key={car.name}
              data-feature-reveal
              className="group premium-border overflow-hidden rounded-2xl"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="display-title text-2xl font-semibold text-pearl">
                    {car.name}
                  </h3>
                  <p className="text-xs tracking-[0.2em] text-platinum uppercase">
                    {car.year}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between text-sm text-mist/90">
                  <p>{car.power}</p>
                  <p className="font-semibold text-accent-soft">{car.price}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
