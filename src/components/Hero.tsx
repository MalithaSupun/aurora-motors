"use client";

import { useEffect, useRef } from "react";
import { initGSAP } from "@/lib/gsap";
import { createFramePreloader, type FramePreloader } from "@/lib/framePreloader";

const TOTAL_FRAMES = 192;

const getFrameSource = (index: number) =>
  `/frames/hero/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyWrapRef = useRef<HTMLDivElement>(null);
  const primaryCopyRef = useRef<HTMLDivElement>(null);
  const secondaryCopyRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<FramePreloader | null>(null);
  const frameRef = useRef({ index: 1 });

  useEffect(() => {
    const { gsap } = initGSAP();
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const copyWrap = copyWrapRef.current;
    const primaryCopy = primaryCopyRef.current;
    const secondaryCopy = secondaryCopyRef.current;

    if (!section || !canvas || !copyWrap || !primaryCopy || !secondaryCopy) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const renderFrame = (frame: number) => {
      const frameIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frame)));
      const preloader = preloaderRef.current;
      if (!preloader) {
        return;
      }

      preloader.warm(frameIndex, 2);

      const image = preloader.getFrame(frameIndex);
      if (!image || !image.complete || !image.naturalWidth) {
        return;
      }

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

    const updateCanvasSize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      renderFrame(frameRef.current.index);
    };

    preloaderRef.current = createFramePreloader({
      frameCount: TOTAL_FRAMES,
      getFrameSource,
      eagerCount: 32,
      batchSize: 10,
      batchDelayMs: 28,
      onFrameLoad: (loadedFrame) => {
        if (loadedFrame === 1) {
          updateCanvasSize();
        }

        if (Math.abs(loadedFrame - Math.round(frameRef.current.index)) <= 1) {
          renderFrame(frameRef.current.index);
        }
      },
    });
    preloaderRef.current.start();

    updateCanvasSize();

    const gsapContext = gsap.context(() => {
      gsap.set(secondaryCopy, {
        autoAlpha: 0,
        y: 72,
      });

      gsap.to(frameRef.current, {
        index: TOTAL_FRAMES,
        snap: "index",
        ease: "none",
        onUpdate: () => renderFrame(frameRef.current.index),
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2800",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      const copyTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2800",
          scrub: true,
        },
      });

      copyTimeline.to(
        primaryCopy,
        {
          yPercent: -24,
          autoAlpha: 0.2,
          ease: "none",
          duration: 0.42,
        },
        0.16,
      );

      copyTimeline.to(
        copyWrap,
        {
          yPercent: -10,
          ease: "none",
          duration: 0.6,
        },
        0.18,
      );

      copyTimeline.to(
        secondaryCopy,
        {
          autoAlpha: 1,
          y: 0,
          ease: "none",
          duration: 0.3,
        },
        0.35,
      );

      copyTimeline.to(
        secondaryCopy,
        {
          yPercent: -14,
          autoAlpha: 1,
          ease: "none",
          duration: 0.5,
        },
        0.5,
      );

      gsap.to(canvas, {
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2800",
          scrub: true,
        },
      });

      gsap.fromTo(
        "[data-hero-reveal]",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 74%",
            once: true,
          },
        },
      );

      gsap.to("[data-hero-overlay]", {
        opacity: 0.28,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2800",
          scrub: true,
        },
      });
    }, section);

    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      preloaderRef.current?.dispose();
      preloaderRef.current = null;
      gsapContext.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero relative h-screen w-full overflow-hidden bg-obsidian"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        data-hero-overlay
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"
      />
      <div className="section-shell relative z-10 flex h-full flex-col justify-end pb-14 md:pb-20">
        <div
          ref={copyWrapRef}
          className="hero-copy relative max-w-5xl min-h-[440px] will-change-transform md:min-h-[500px]"
        >
          <div ref={primaryCopyRef}>
            <p
              data-hero-reveal
              className="section-kicker mb-4"
            >
              2026 Signature Release
            </p>
            <h1
              data-hero-reveal
              className="display-title max-w-4xl text-[2.35rem] font-semibold text-pearl md:text-6xl lg:text-7xl"
            >
              Aurora Velocity
              <span className="mt-1 block text-platinum">Engineered Like Cinema</span>
            </h1>
            <p
              data-hero-reveal
              className="section-copy mt-5 max-w-2xl text-sm md:text-base"
            >
              A hand-built performance coupe with aerospace-grade carbon architecture,
              adaptive dynamics, and a cabin sculpted in Italian Alcantara.
            </p>
            <div data-hero-reveal className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                className="action-primary accent-ring"
              >
                Reserve Private Viewing
              </button>
              <button
                type="button"
                className="action-secondary"
              >
                Download Brochure
              </button>
            </div>
          </div>

          <div
            ref={secondaryCopyRef}
            className="premium-border pointer-events-none absolute inset-x-0 bottom-0 max-w-3xl rounded-2xl p-5 md:p-7"
          >
            <p className="section-kicker mb-4 w-fit border-signal/35 bg-signal/10 text-signal">
              Dynamic Chassis Story
            </p>
            <h2 className="display-title text-2xl font-semibold text-pearl md:text-4xl">
              Every Scroll Step Feels
              <span className="block text-accent-soft">Like A Cinematic Reveal</span>
            </h2>
            <p className="section-copy mt-4 max-w-2xl text-sm md:text-base">
              Precision engineering highlights emerge layer by layer while this copy
              glides upward with the hero text.
            </p>
            <p className="section-copy mt-3 max-w-2xl text-sm text-mist/80 md:text-base">
              Adaptive suspension intelligence, real-time torque distribution, and aero
              balancing systems continuously tune performance as the narrative unfolds.
            </p>
            <p className="section-copy mt-3 max-w-2xl text-sm text-platinum/90 md:text-base">
              Designed to feel like one uninterrupted automotive film, even while you
              are only scrolling a single section.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
