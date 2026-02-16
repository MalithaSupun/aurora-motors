"use client";

import { useEffect, useRef } from "react";
import { initGSAP } from "@/lib/gsap";
import { createFramePreloader, type FramePreloader } from "@/lib/framePreloader";

const TOTAL_THIRD_FRAMES = 192;

const getThirdFrameSource = (index: number) =>
  `/frames/third/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

const CITIES = ["Monaco", "Dubai", "Singapore", "London", "Los Angeles"];

export default function GlobeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const preloaderRef = useRef<FramePreloader | null>(null);
  const frameStateRef = useRef({ index: 1 });
  const hasStartedPreloadRef = useRef(false);

  useEffect(() => {
    const { gsap, ScrollTrigger } = initGSAP();
    const section = sectionRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    if (!section || !backgroundCanvas) {
      return;
    }

    const context2d = backgroundCanvas.getContext("2d");
    if (!context2d) {
      return;
    }

    const renderFrame = (frame: number) => {
      const frameIndex = Math.max(1, Math.min(TOTAL_THIRD_FRAMES, Math.round(frame)));
      const preloader = preloaderRef.current;
      if (!preloader) {
        return;
      }

      preloader.warm(frameIndex, 2);
      const image = preloader.getFrame(frameIndex);
      if (!image || !image.complete || !image.naturalWidth) {
        return;
      }

      const width = backgroundCanvas.width;
      const height = backgroundCanvas.height;
      context2d.clearRect(0, 0, width, height);

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      context2d.drawImage(image, x, y, drawWidth, drawHeight);
    };

    const updateCanvasSize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = section.clientWidth;
      const height = section.clientHeight;

      backgroundCanvas.width = Math.floor(width * ratio);
      backgroundCanvas.height = Math.floor(height * ratio);
      backgroundCanvas.style.width = `${width}px`;
      backgroundCanvas.style.height = `${height}px`;

      renderFrame(frameStateRef.current.index);
    };

    preloaderRef.current = createFramePreloader({
      frameCount: TOTAL_THIRD_FRAMES,
      getFrameSource: getThirdFrameSource,
      eagerCount: 8,
      batchSize: 6,
      batchDelayMs: 34,
      onFrameLoad: (loadedFrame) => {
        if (loadedFrame === 1) {
          updateCanvasSize();
        }

        if (Math.abs(loadedFrame - Math.round(frameStateRef.current.index)) <= 1) {
          renderFrame(frameStateRef.current.index);
        }
      },
    });
    preloaderRef.current.warm(1, 0);

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const context = gsap.context(() => {
      const startPreload = () => {
        if (hasStartedPreloadRef.current) {
          return;
        }
        hasStartedPreloadRef.current = true;
        preloaderRef.current?.start();
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        once: true,
        onEnter: startPreload,
      });

      gsap.to(frameStateRef.current, {
        index: TOTAL_THIRD_FRAMES,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: () => {
            renderFrame(frameStateRef.current.index);
          },
        },
      });

      gsap.to(backgroundCanvas, {
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        "[data-globe-reveal]",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
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
      window.removeEventListener("resize", updateCanvasSize);
      preloaderRef.current?.dispose();
      preloaderRef.current = null;
      hasStartedPreloadRef.current = false;
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32">
      <canvas
        ref={backgroundCanvasRef}
        className="absolute inset-0 h-full w-full"
        aria-label="Global presence cinematic background sequence"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/86 via-black/55 to-black/80" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/76 via-black/24 to-black/38" />

      <div className="section-shell relative z-10 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p
            data-globe-reveal
            className="mb-4 text-xs font-semibold tracking-[0.26em] text-signal uppercase"
          >
            Global Presence
          </p>
          <h2
            data-globe-reveal
            className="display-title text-4xl font-semibold text-pearl md:text-5xl"
          >
            Crafted for Roads Across Five Continents
          </h2>
          <p
            data-globe-reveal
            className="mt-5 max-w-xl text-sm leading-relaxed text-mist/90 md:text-base"
          >
            Aurora Motors operates private delivery and concierge service centers in
            London, Dubai, Singapore, Monaco, and Los Angeles.
          </p>
          <div data-globe-reveal className="mt-8 flex flex-wrap gap-3 text-xs">
            {CITIES.map((city) => (
              <span
                key={city}
                className="rounded-full border border-signal/30 bg-signal/10 px-4 py-2 tracking-[0.14em] text-signal uppercase"
              >
                {city}
              </span>
            ))}
          </div>
        </div>

        <div className="premium-border rounded-3xl p-6 md:p-8">
          <p
            data-globe-reveal
            className="text-xs font-semibold tracking-[0.22em] text-platinum uppercase"
          >
            Service Network
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div data-globe-reveal className="rounded-xl border border-white/12 bg-black/30 p-4">
              <p className="text-xs text-platinum/80 uppercase">Live Hubs</p>
              <p className="mt-2 text-3xl font-semibold text-pearl">05</p>
            </div>
            <div data-globe-reveal className="rounded-xl border border-white/12 bg-black/30 p-4">
              <p className="text-xs text-platinum/80 uppercase">24/7 Support</p>
              <p className="mt-2 text-3xl font-semibold text-pearl">Yes</p>
            </div>
            <div data-globe-reveal className="rounded-xl border border-white/12 bg-black/30 p-4">
              <p className="text-xs text-platinum/80 uppercase">Avg Delivery</p>
              <p className="mt-2 text-3xl font-semibold text-pearl">11d</p>
            </div>
            <div data-globe-reveal className="rounded-xl border border-white/12 bg-black/30 p-4">
              <p className="text-xs text-platinum/80 uppercase">Track Access</p>
              <p className="mt-2 text-3xl font-semibold text-pearl">Global</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
