"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function splitCharsOpen(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent || "";
  el.textContent = "";
  el.setAttribute("aria-label", text);
  const chars: HTMLSpanElement[] = [];
  const words = text.split(" ");
  words.forEach((word, wIdx) => {
    const w = document.createElement("span");
    w.style.display = "inline-block";
    w.style.whiteSpace = "nowrap";
    for (const c of word) {
      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.textContent = c;
      w.appendChild(inner);
      chars.push(inner);
    }
    el.appendChild(w);
    if (wIdx < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
  return chars;
}

const nebula = [
  { x: 15, y: 25, size: 180, opacity: 0.04, blur: 45, dur: 18 },
  { x: 70, y: 55, size: 160, opacity: 0.05, blur: 40, dur: 22 },
  { x: 40, y: 75, size: 200, opacity: 0.03, blur: 50, dur: 20 },
  { x: 80, y: 20, size: 140, opacity: 0.05, blur: 35, dur: 16 },
];

const borderStyle = (
  draw: string,
): React.CSSProperties & Record<string, string> => ({
  padding: "1.5px",
  background: `conic-gradient(from 315deg at 0% 0%, #4A7C59 calc(var(--draw) * 360deg), transparent calc(var(--draw) * 360deg))`,
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
  WebkitMask:
    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  "--draw": draw,
});

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Eyebrow clip reveal
        if (eyebrowRef.current) {
          gsap.from(eyebrowRef.current, {
            clipPath: "inset(0 100% 0 0)",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          });
        }

        // Chaotic split chars
        if (titleRef.current) {
          const chars = splitCharsOpen(titleRef.current);
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          });
          chars.forEach((char, i) => {
            tl.from(
              char,
              {
                x: gsap.utils.random(-100, 100),
                y: gsap.utils.random(-60, 60),
                rotation: gsap.utils.random(-30, 30),
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
              },
              i * 0.02,
            );
          });
        }

        // Subtitle
        gsap.from(".contact-subtitle", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });

        // CTA buttons with border draw
        gsap.utils.toArray<HTMLElement>(".cta-btn").forEach((btn, i) => {
          const obj = { draw: 0 };
          const fill = btn.querySelector(".cta-fill") as HTMLElement | null;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
            delay: 0.5 + i * 0.15,
          });
          tl.to(obj, {
            draw: 1,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => {
              btn.style.setProperty("--draw", String(obj.draw));
            },
          });
          if (fill) {
            tl.to(
              fill,
              { opacity: 1, duration: 0.3, ease: "power2.out" },
              "-=0.1",
            );
          }
        });

        // Phone number
        gsap.from(".contact-phone", {
          opacity: 0,
          y: 10,
          duration: 0.6,
          delay: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.from(".contact-fade", {
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        });
        gsap.utils.toArray<HTMLElement>(".cta-btn").forEach((btn) => {
          btn.style.setProperty("--draw", "1");
          const fill = btn.querySelector(".cta-fill") as HTMLElement | null;
          if (fill) fill.style.opacity = "1";
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-32 md:px-10 md:py-48"
      style={{ background: "#111827" }}
    >
      {/* Green nebula particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {nebula.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: "#4A7C59",
              opacity: p.opacity,
              filter: `blur(${p.blur}px)`,
              animation: `drift-${i} ${p.dur}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <span
          ref={eyebrowRef}
          className="eyebrow contact-fade inline-block"
          style={{ clipPath: "inset(0 0% 0 0)" }}
        >
          Contact
        </span>
        <h2
          ref={titleRef}
          className="contact-fade mt-6 font-serif text-[clamp(44px,7vw,96px)] leading-[0.96] tracking-[-0.025em] text-ink"
        >
          Disponible dès septembre 2026.
        </h2>
        <p className="contact-subtitle contact-fade mt-8 font-sans text-base text-muted md:text-lg">
          Alternance Data/IA · Missions freelance automatisation IA &amp; n8n pour PME
          <br className="hidden sm:block" />
          <span className="sm:ml-0"> Toulouse / remote · ewen.bourgeat.tech@gmail.com</span>
        </p>

        <div className="contact-fade mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          {/* Primary CTA */}
          <a
            href="mailto:ewen.bourgeat.tech@gmail.com"
            className="cta-btn relative inline-flex items-center justify-center rounded-[12px] px-7 py-3.5 font-sans text-sm font-medium text-white overflow-hidden"
            style={{ "--draw": "0" } as React.CSSProperties}
          >
            <span
              className="cta-border pointer-events-none absolute inset-0 rounded-[12px]"
              style={borderStyle("0")}
            />
            <span className="cta-fill pointer-events-none absolute inset-0 rounded-[12px] bg-forest opacity-0" />
            <span className="relative z-10">Écrire à Ewen</span>
          </a>

          {/* Secondary CTAs */}
          <a
            href="https://www.linkedin.com/in/ewen-bourgeat"
            target="_blank"
            rel="noreferrer"
            className="cta-btn relative inline-flex items-center justify-center rounded-[12px] px-7 py-3.5 font-sans text-sm font-medium text-forest overflow-hidden transition-colors hover:bg-forest hover:text-white"
            style={{ "--draw": "0" } as React.CSSProperties}
          >
            <span
              className="cta-border pointer-events-none absolute inset-0 rounded-[12px]"
              style={borderStyle("0")}
            />
            <span className="relative z-10">LinkedIn</span>
          </a>
          <a
            href="https://github.com/EwenBourgeat"
            target="_blank"
            rel="noreferrer"
            className="cta-btn relative inline-flex items-center justify-center rounded-[12px] px-7 py-3.5 font-sans text-sm font-medium text-forest overflow-hidden transition-colors hover:bg-forest hover:text-white"
            style={{ "--draw": "0" } as React.CSSProperties}
          >
            <span
              className="cta-border pointer-events-none absolute inset-0 rounded-[12px]"
              style={borderStyle("0")}
            />
            <span className="relative z-10">GitHub</span>
          </a>
        </div>

        <p className="contact-phone contact-fade mt-10 font-sans text-xs tracking-wide text-muted/70">
          07 83 83 34 53
        </p>
      </div>
    </section>
  );
}
