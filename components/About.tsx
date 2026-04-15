"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function splitChars(el: HTMLElement): HTMLSpanElement[] {
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
      const clip = document.createElement("span");
      clip.style.overflow = "hidden";
      clip.style.display = "inline-block";
      clip.style.verticalAlign = "bottom";
      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.textContent = c;
      clip.appendChild(inner);
      w.appendChild(clip);
      chars.push(inner);
    }
    el.appendChild(w);
    if (wIdx < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
  return chars;
}

function formatNum(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null);
  const stat2Ref = useRef<HTMLDivElement>(null);
  const stat3Ref = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLUListElement>(null);

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
              start: "top 70%",
            },
          });
        }

        // Title split chars
        if (titleRef.current) {
          const chars = splitChars(titleRef.current);
          gsap.from(chars, {
            y: 60,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.025,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          });
        }

        // Body text fade
        if (bodyRef.current) {
          gsap.from(bodyRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.4,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          });
        }

        // Left visual block
        gsap.from(".about-left", {
          opacity: 0,
          x: -60,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        });

        // Counters
        const animateCounter = (
          el: HTMLElement | null,
          target: number,
          prefix = "",
        ) => {
          if (!el) return;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
            },
            onUpdate: () => {
              el.textContent = `${prefix}${formatNum(obj.val)}`;
            },
          });
        };

        animateCounter(stat1Ref.current, 7);
        animateCounter(stat2Ref.current, 2600, "~");
        animateCounter(stat3Ref.current, 10000);

        // Green underlines
        gsap.from(".stat-line", {
          scaleX: 0,
          duration: 2,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
        });

        // Stat labels
        gsap.from(".stat-label", {
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
        });

        // Social links
        gsap.from(".about-links", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.from(".about-left", {
          opacity: 0,
          duration: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        });
        if (stat1Ref.current) stat1Ref.current.textContent = "7";
        if (stat2Ref.current) stat2Ref.current.textContent = "~2\u2009600";
        if (stat3Ref.current) stat3Ref.current.textContent = "10\u2009000";
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative px-6 py-28 md:px-10 md:py-40"
      style={{
        background: "linear-gradient(to bottom, #0D1117, #111827)",
      }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
        {/* Left — visual block */}
        <div className="about-left lg:col-span-5">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface">
            <Image
              src="/photoprofile.jpeg"
              alt="Ewen Bourgeat"
              fill
              className="object-cover object-center"
              priority
            />
            <span className="absolute left-6 top-6 font-sans text-[10px] tracking-[0.22em] uppercase text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Portfolio · 2026
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 font-sans text-xs text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Disponible sept. 2026
            </span>
            <span className="inline-flex items-center rounded-full border border-forest/40 bg-surface px-4 py-2 font-sans text-xs text-forest">
              Toulouse, France
            </span>
          </div>
        </div>

        {/* Right — copy */}
        <div className="lg:col-span-7">
          <span
            ref={eyebrowRef}
            className="eyebrow inline-block"
            style={{ clipPath: "inset(0 0% 0 0)" }}
          >
            À propos
          </span>
          <h2 ref={titleRef} className="section-title mt-5 text-ink">
            Étudiant ingénieur, entrepreneur, obsédé par ce qui fonctionne en production.
          </h2>
          <p
            ref={bodyRef}
            className="mt-8 max-w-2xl font-sans text-[17px] leading-relaxed text-muted"
          >
            4ème année à CY Tech, spécialisation High Performance Data Analysis
            dès septembre 2026. J&apos;ai lancé une micro-entreprise
            d&apos;automatisation IA pour des PME, fait un échange universitaire
            à l&apos;UQAC au Canada, et déployé plusieurs projets en production
            — seul. Ce que je cherche&nbsp;: une alternance Data/IA où aller
            vite, apprendre sur des vrais problèmes, et contribuer concrètement
            dès le premier jour.
          </p>

          {/* Stats */}
          <ul
            ref={statsRef}
            className="mt-10 grid grid-cols-3 gap-6 border-y border-card-border py-8"
          >
            <li className="relative pb-3">
              <div
                ref={stat1Ref}
                className="font-serif text-3xl text-ink md:text-4xl"
              >
                0
              </div>
              <div className="stat-label mt-2 font-sans text-xs uppercase tracking-[0.14em] text-muted">
                Saisons de
                <br />
                données PL
              </div>
              <div className="stat-line absolute bottom-0 left-0 h-px w-full origin-left bg-forest" />
            </li>
            <li className="relative border-l border-card-border pl-6 pb-3">
              <div
                ref={stat2Ref}
                className="font-serif text-3xl text-ink md:text-4xl"
              >
                0
              </div>
              <div className="stat-label mt-2 font-sans text-xs uppercase tracking-[0.14em] text-muted">
                Matchs
                <br />
                analysés
              </div>
              <div className="stat-line absolute bottom-0 left-6 right-0 h-px origin-left bg-forest" />
            </li>
            <li className="relative border-l border-card-border pl-6 pb-3">
              <div
                ref={stat3Ref}
                className="font-serif text-3xl text-ink md:text-4xl"
              >
                0
              </div>
              <div className="stat-label mt-2 font-sans text-xs uppercase tracking-[0.14em] text-muted">
                Impressions/mois
                <br />
                automatisées
              </div>
              <div className="stat-line absolute bottom-0 left-6 right-0 h-px origin-left bg-forest" />
            </li>
          </ul>

          {/* Links */}
          <div className="about-links mt-10 flex flex-wrap items-center gap-6">
            <a
              href="https://github.com/EwenBourgeat"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 font-sans text-sm text-ink transition-colors hover:text-forest"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.15v3.18c0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
              </svg>
              github.com/EwenBourgeat
            </a>
            <a
              href="https://www.linkedin.com/in/ewen-bourgeat"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 font-sans text-sm text-ink transition-colors hover:text-forest"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
              </svg>
              linkedin.com/in/ewen-bourgeat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
