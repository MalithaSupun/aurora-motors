"use client";

import { useEffect, useRef } from "react";
import { initGSAP } from "@/lib/gsap";
import { createFramePreloader, type FramePreloader } from "@/lib/framePreloader";

const TOTAL_SECOND_FRAMES = 192;

const getSecondFrameSource = (index: number) =>
  `/frames/second/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

export default function BlueprintSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const realisticCanvasRef = useRef<HTMLCanvasElement>(null);
  const blueprintCanvasRef = useRef<HTMLCanvasElement>(null);
  const preloaderRef = useRef<FramePreloader | null>(null);
  const frameStateRef = useRef({ index: 1 });
  const hasStartedPreloadRef = useRef(false);

  useEffect(() => {
    const { gsap, ScrollTrigger } = initGSAP();
    const section = sectionRef.current;
    const realisticCanvas = realisticCanvasRef.current;
    const blueprintCanvas = blueprintCanvasRef.current;

    if (!section || !realisticCanvas || !blueprintCanvas) {
      return;
    }

    const realisticContext = realisticCanvas.getContext("2d");
    const blueprintContext = blueprintCanvas.getContext("2d");

    if (!realisticContext || !blueprintContext) {
      return;
    }

    const drawToCanvas = (
      context: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      image: HTMLImageElement,
    ) => {
      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);

      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      context.drawImage(image, x, y, drawWidth, drawHeight);
    };

    const renderFrame = (frame: number) => {
      const frameIndex = Math.max(1, Math.min(TOTAL_SECOND_FRAMES, Math.round(frame)));
      const preloader = preloaderRef.current;
      if (!preloader) {
        return;
      }

      preloader.warm(frameIndex, 2);
      const image = preloader.getFrame(frameIndex);

      if (!image || !image.complete || !image.naturalWidth) {
        return;
      }

      drawToCanvas(realisticContext, realisticCanvas, image);
      drawToCanvas(blueprintContext, blueprintCanvas, image);
    };

    const updateCanvasSize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = section.clientWidth;
      const height = section.clientHeight;

      realisticCanvas.width = Math.floor(width * ratio);
      realisticCanvas.height = Math.floor(height * ratio);
      realisticCanvas.style.width = `${width}px`;
      realisticCanvas.style.height = `${height}px`;

      blueprintCanvas.width = Math.floor(width * ratio);
      blueprintCanvas.height = Math.floor(height * ratio);
      blueprintCanvas.style.width = `${width}px`;
      blueprintCanvas.style.height = `${height}px`;

      renderFrame(frameStateRef.current.index);
    };

    preloaderRef.current = createFramePreloader({
      frameCount: TOTAL_SECOND_FRAMES,
      getFrameSource: getSecondFrameSource,
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
        index: TOTAL_SECOND_FRAMES,
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

      gsap.fromTo(
        realisticCanvas,
        { opacity: 1, scale: 1 },
        {
          opacity: 0.28,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 30%",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        blueprintCanvas,
        { opacity: 0, scale: 1.08 },
        {
          opacity: 0.95,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 30%",
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

    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      preloaderRef.current?.dispose();
      preloaderRef.current = null;
      hasStartedPreloadRef.current = false;
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <canvas
        ref={realisticCanvasRef}
        className="absolute inset-0 h-full w-full"
        aria-label="Realistic luxury car motion sequence"
      />
      <canvas
        ref={blueprintCanvasRef}
        className="absolute inset-0 h-full w-full mix-blend-screen saturate-0 contrast-125 brightness-110 hue-rotate-[150deg]"
        aria-label="Technical blueprint motion sequence"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(138,180,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(138,180,255,0.16)_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/88 via-black/46 to-black/74" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/40" />

      <div className="section-shell relative z-10 py-24 md:py-32">
        <div className="premium-border max-w-2xl rounded-3xl p-6 md:p-8">
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
