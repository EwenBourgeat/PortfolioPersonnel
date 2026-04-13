"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface HeroProps {
  totalFrames: number;
}

const frameUrl = (i: number) =>
  `/frames/frame_${String(i + 1).padStart(4, "0")}.webp`;

export default function Hero({ totalFrames }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const outroTextRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // "medium" quality is visually indistinguishable from "high" for
    // natural imagery and noticeably faster per draw on integrated GPUs.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";

    const bitmaps: (ImageBitmap | null)[] = new Array(totalFrames).fill(null);
    let currentFrame = 0;
    let targetFrame = 0;
    let pendingDraw = false;
    let cancelled = false;

    const draw = () => {
      pendingDraw = false;
      const bmp = bitmaps[targetFrame];
      if (!bmp) return;
      currentFrame = targetFrame;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = bmp.width;
      const ih = bmp.height;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = Math.round((cw - dw) / 2);
      const dy = Math.round((ch - dh) / 2);

      // No fillRect: cover-fit guarantees drawImage covers the whole canvas,
      // so the background fill is wasted work (~6M pixels on retina).
      ctx.drawImage(bmp, dx, dy, Math.ceil(dw), Math.ceil(dh));
    };

    const requestDraw = (idx: number) => {
      targetFrame = idx;
      if (pendingDraw) return;
      pendingDraw = true;
      requestAnimationFrame(draw);
    };

    const resize = () => {
      // Use native device pixel ratio, capped at 2 (higher gives diminishing
      // returns and wastes GPU memory on Retina HiDPI external monitors).
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      requestDraw(currentFrame);
    };

    // Target bitmap size: match the canvas cover dimension so drawImage
    // does a near-1:1 blit, and cap to keep GPU texture memory reasonable
    // (76 × 2880² × 4 bytes = ~2.4 GB, which exceeds most GPU texture caches
    // and causes texture-upload stutter on fast scrub). 2048² × 76 ≈ 1.2 GB
    // — fits in most GPU caches while staying sharp on retina.
    const BITMAP_TARGET = 2048;

    const loadFrame = async (i: number): Promise<void> => {
      try {
        const res = await fetch(frameUrl(i));
        if (!res.ok) return;
        const blob = await res.blob();
        // Browser-native off-thread resize during decode. Much faster than
        // letting drawImage rescale at every draw, and keeps GPU textures
        // at a predictable, manageable size.
        const bmp = await createImageBitmap(blob, {
          resizeWidth: BITMAP_TARGET,
          resizeHeight: BITMAP_TARGET,
          resizeQuality: "high",
        });
        if (cancelled) {
          bmp.close?.();
          return;
        }
        bitmaps[i] = bmp;
      } catch {
        // Ignore individual frame failures — we will still render nearest.
      }
    };

    // Full preload strategy: download + decode EVERY frame as ImageBitmap
    // before unlocking the page. This is what Apple's product pages do.
    // The one-time cost at load is worth the perfectly smooth scrub.
    (async () => {
      const BATCH = 8;
      let loaded = 0;
      for (let i = 0; i < totalFrames; i += BATCH) {
        if (cancelled) return;
        const end = Math.min(i + BATCH, totalFrames);
        const batch: Promise<void>[] = [];
        for (let j = i; j < end; j++) {
          batch.push(
            loadFrame(j).then(() => {
              loaded++;
              setProgress(loaded / totalFrames);
            }),
          );
        }
        await Promise.all(batch);
      }
      if (cancelled) return;

      // GPU texture warm-up: draw every bitmap at a tiny destination so the
      // browser uploads each one to GPU texture memory now, instead of
      // during the first scrub-through (which causes per-frame stutters the
      // first time each texture is used).
      for (let i = 0; i < totalFrames; i++) {
        const bmp = bitmaps[i];
        if (bmp) ctx.drawImage(bmp, 0, 0, 2, 2);
      }

      setIsReady(true);
      requestDraw(0);
    })();

    resize();
    window.addEventListener("resize", resize);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      // scrub: true — direct mapping to Lenis's already-lerped scroll
      // position. Adding an extra scrub lerp on top of Lenis creates
      // compound smoothing that feels like drag/lag.
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        const idx = Math.min(
          totalFrames - 1,
          Math.max(0, Math.round(p * (totalFrames - 1))),
        );
        if (idx !== targetFrame) requestDraw(idx);

        if (introTextRef.current) {
          const fade =
            p < 0.2 ? 1 : p > 0.35 ? 0 : 1 - (p - 0.2) / 0.15;
          introTextRef.current.style.opacity = String(fade);
          introTextRef.current.style.transform = `translate3d(0, ${(1 - fade) * -40}px, 0)`;
        }
        if (scrollHintRef.current) {
          scrollHintRef.current.style.opacity = String(p < 0.05 ? 1 : 0);
        }
        if (outroTextRef.current) {
          const fade = p < 0.85 ? 0 : Math.min(1, (p - 0.85) / 0.12);
          outroTextRef.current.style.opacity = String(fade);
          outroTextRef.current.style.transform = `translate3d(0, ${(1 - fade) * 20}px, 0)`;
        }
      },
    });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
      st.kill();
      for (const bmp of bitmaps) bmp?.close?.();
    };
  }, [totalFrames]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] no-select bg-void"
      aria-label="Animation d'introduction"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full block will-change-transform"
          style={{ transform: "translateZ(0)" }}
        />

        {/* Loader with real progress */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex flex-col items-center justify-center z-30 bg-void transition-opacity duration-700 ${
            isReady ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-center gap-5">
            <div className="font-serif text-3xl text-white/90">EB</div>
            <div className="relative h-px w-40 overflow-hidden bg-white/15">
              <div
                className="absolute inset-y-0 left-0 bg-white transition-[width] duration-150 ease-out"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="font-sans text-[10px] tracking-[0.24em] uppercase text-white/55">
              {Math.round(progress * 100).toString().padStart(2, "0")} · Chargement
            </div>
          </div>
        </div>

        {/* Intro text overlay */}
        <div
          ref={introTextRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 pointer-events-none text-center will-change-[opacity,transform]"
        >
          <h1 className="hero-title text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.65)]">
            Ewen Bourgeat
          </h1>
          <p className="mt-6 text-white/90 text-sm sm:text-base md:text-lg font-sans tracking-[0.04em] drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]">
            Ingénieur Data &amp; IA · Contrat de professionnalisation oct. 2026
          </p>
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-white/70 font-sans text-[10px] tracking-[0.24em] uppercase pointer-events-none transition-opacity duration-500"
        >
          Scroller
          <span className="block h-10 w-px bg-white/55 animate-[scrollhint_1.8s_ease-in-out_infinite]" />
        </div>

        {/* Outro text overlay */}
        <div
          ref={outroTextRef}
          className="absolute inset-0 flex items-center justify-center z-10 px-6 pointer-events-none text-center opacity-0 will-change-[opacity,transform]"
        >
          <span className="hero-title text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.65)]">
            Bienvenue.
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollhint {
          0%, 100% { transform: scaleY(0.4); transform-origin: top; opacity: 0.4; }
          50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
        }
      `}</style>
    </section>
  );
}
