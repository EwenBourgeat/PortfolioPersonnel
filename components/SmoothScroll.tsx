"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SmoothScroll sets up Lenis (smooth scroll library) and wires it into
 * GSAP's ticker + ScrollTrigger. This is the standard awwwards-style
 * scroll layer: native scroll position is still used (so `position: sticky`
 * and `scrollTo` anchors keep working), but the visible movement is
 * lerped on each frame by Lenis, eliminating macOS/trackpad jitter.
 *
 * Placed at the root of the layout so every scroll-driven animation
 * (hero canvas scrub, GSAP ScrollTrigger entrance animations) is in phase.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      // 0.1 is Lenis's recommended default. We were at 0.08 before which
      // felt slightly too smooth when combined with the scrub lerp.
      // With scrub=true on ScrollTrigger, 0.1 here is the sole smoothing
      // source → responsive without jitter.
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      // Keep touch scroll native on mobile — smoothing touch causes issues
      // with iOS rubber-banding and is rarely what users expect.
      syncTouch: false,
    });

    // ScrollTrigger must re-read scroll position on every Lenis tick,
    // otherwise scrubbed animations drift out of sync with the visible scroll.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so there's exactly one rAF loop
    // coordinating scroll smoothing, ScrollTrigger updates, and the hero
    // canvas draw.
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
