"use client";

import { useEffect, useRef } from "react";
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

type Project = {
  tag: string;
  title: string;
  description: string;
  stack: string[];
  href?: string;
  hrefLabel?: string;
  visual: "ml" | "automation" | "fullstack";
};

const projects: Project[] = [
  {
    tag: "Machine Learning",
    title: "PL Match Predictor",
    description:
      "7 saisons de Premier League, ~2 600 matchs, trois modèles ML en compétition. Pipeline complet — feature engineering, entraînement, évaluation — et une app Streamlit qui prédit les matchs de la saison en cours en temps réel. XGBoost gagne.",
    stack: ["Python", "Pandas", "scikit-learn", "XGBoost", "Streamlit"],
    href: "https://github.com/EwenBourgeat",
    hrefLabel: "Voir sur GitHub",
    visual: "ml",
  },
  {
    tag: "Automatisation IA",
    title: "Affiliation IA — calmhomespaces.com",
    description:
      "Une machine à contenu autonome. 6 workflows n8n qui sélectionnent des produits, génèrent du contenu via Gemini, composent les visuels en Python et publient automatiquement sur Pinterest — sans intervention humaine. 10 000 impressions/mois en production. Mon premier projet entrepreneurial qui tourne 24h/24.",
    stack: [
      "n8n",
      "Claude API",
      "Gemini API",
      "Python",
      "Airtable",
      "Pinterest API",
    ],
    href: "https://calmhomespaces.com",
    hrefLabel: "calmhomespaces.com",
    visual: "automation",
  },
  {
    tag: "Full-Stack",
    title: "Plateforme de gestion de formations — QRMG",
    description:
      "Plateforme web de gestion de formations développée seul en 3 mois de stage — de zéro à la production. Auth, rôles, paiements Stripe, emails automatisés, espace admin complet. Déployée sur qrmgformations.fr.",
    stack: [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Supabase",
      "Stripe",
      "Clerk",
      "Brevo",
    ],
    href: "https://qrmgformations.fr",
    hrefLabel: "qrmgformations.fr",
    visual: "fullstack",
  },
];

function Visual({ kind }: { kind: Project["visual"] }) {
  if (kind === "ml") {
    return (
      <svg
        viewBox="0 0 480 360"
        className="h-full w-full"
        aria-hidden="true"
      >
        <rect width="480" height="360" fill="#1A2332" />
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="48"
            y1={60 + i * 48}
            x2="448"
            y2={60 + i * 48}
            stroke="#F0EDE8"
            strokeOpacity="0.06"
          />
        ))}
        {[140, 95, 175, 120, 200, 155, 220].map((h, i) => (
          <rect
            key={i}
            x={64 + i * 52}
            y={300 - h}
            width="34"
            height={h}
            fill="#4A7C59"
            opacity={0.25 + i * 0.1}
          />
        ))}
        <path
          d="M 64 200 Q 130 140 200 160 T 340 90 T 460 110"
          stroke="#F0EDE8"
          strokeWidth="2"
          fill="none"
        />
        {[64, 130, 200, 270, 340, 400, 460].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={[200, 160, 160, 110, 90, 105, 110][i]}
            r="3.5"
            fill="#F0EDE8"
          />
        ))}
        <text
          x="48"
          y="40"
          fontFamily="Geist, sans-serif"
          fontSize="11"
          fill="#F0EDE8"
          letterSpacing="2"
        >
          MODEL ACCURACY · XGB
        </text>
      </svg>
    );
  }
  if (kind === "automation") {
    return (
      <svg
        viewBox="0 0 480 360"
        className="h-full w-full"
        aria-hidden="true"
      >
        <rect width="480" height="360" fill="#1A2332" />
        <text
          x="48"
          y="40"
          fontFamily="Geist, sans-serif"
          fontSize="11"
          fill="#F0EDE8"
          letterSpacing="2"
        >
          n8n WORKFLOW · 6 NODES
        </text>
        <g stroke="#4A7C59" strokeWidth="1.5" fill="none">
          <path d="M 110 130 C 160 130, 160 200, 220 200" />
          <path d="M 220 200 C 280 200, 280 130, 340 130" />
          <path d="M 220 200 C 280 200, 280 270, 340 270" />
          <path
            d="M 340 130 C 400 130, 400 200, 440 200"
            strokeDasharray="4 4"
          />
          <path
            d="M 340 270 C 400 270, 400 200, 440 200"
            strokeDasharray="4 4"
          />
        </g>
        {[
          { cx: 90, cy: 130 },
          { cx: 220, cy: 200 },
          { cx: 340, cy: 130 },
          { cx: 340, cy: 270 },
          { cx: 440, cy: 200 },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r="22" fill="#4A7C59" />
            <circle
              cx={n.cx}
              cy={n.cy}
              r="22"
              fill="none"
              stroke="#F0EDE8"
              strokeOpacity="0.15"
            />
          </g>
        ))}
        <circle cx="440" cy="200" r="5" fill="#F0EDE8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" aria-hidden="true">
      <rect width="480" height="360" fill="#1A2332" />
      <text
        x="48"
        y="40"
        fontFamily="Geist, sans-serif"
        fontSize="11"
        fill="#F0EDE8"
        letterSpacing="2"
      >
        DASHBOARD · QRMG
      </text>
      <rect
        x="48"
        y="68"
        width="384"
        height="240"
        rx="14"
        fill="#111827"
        stroke="#F0EDE8"
        strokeOpacity="0.1"
      />
      <rect x="48" y="68" width="96" height="240" rx="14" fill="#4A7C59" />
      {[110, 140, 170, 200].map((y, i) => (
        <rect
          key={i}
          x="64"
          y={y}
          width="64"
          height="6"
          rx="3"
          fill="#FFFFFF"
          opacity={0.55}
        />
      ))}
      {[100, 140, 180].map((y, i) => (
        <g key={i}>
          <rect
            x="168"
            y={y}
            width="240"
            height="34"
            rx="6"
            fill="#243044"
          />
          <rect
            x="180"
            y={y + 10}
            width="120"
            height="6"
            rx="3"
            fill="#F0EDE8"
            opacity="0.55"
          />
          <rect
            x="180"
            y={y + 20}
            width="80"
            height="5"
            rx="2"
            fill="#F0EDE8"
            opacity="0.25"
          />
          <circle cx="388" cy={y + 17} r="6" fill="#4A7C59" />
        </g>
      ))}
      <rect
        x="168"
        y="240"
        width="240"
        height="48"
        rx="8"
        fill="#4A7C59"
        opacity="0.1"
      />
      <text
        x="184"
        y="270"
        fontFamily="Instrument Serif, serif"
        fontSize="22"
        fill="#F0EDE8"
      >
        128
      </text>
      <text
        x="240"
        y="270"
        fontFamily="Geist, sans-serif"
        fontSize="10"
        fill="#F0EDE8"
        opacity="0.6"
        letterSpacing="2"
      >
        STAGIAIRES ACTIFS
      </text>
    </svg>
  );
}

export default function Projects() {
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

        // Cards alternating entry
        gsap.utils
          .toArray<HTMLElement>(".project-card")
          .forEach((card, i) => {
            gsap.from(card, {
              opacity: 0,
              x: i % 2 === 0 ? -80 : 80,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 80%" },
            });
          });

        // Tag badge pop
        gsap.utils
          .toArray<HTMLElement>(".project-card")
          .forEach((card) => {
            const tag = card.querySelector(".project-tag");
            if (tag) {
              gsap.from(tag, {
                scale: 0,
                duration: 0.4,
                ease: "back.out(1.7)",
                scrollTrigger: { trigger: card, start: "top 75%" },
              });
            }
          });

      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils
          .toArray<HTMLElement>(".project-card")
          .forEach((card) => {
            gsap.from(card, {
              opacity: 0,
              duration: 0.5,
              scrollTrigger: { trigger: card, start: "top 80%" },
            });
          });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative px-6 py-28 md:px-10 md:py-40"
      style={{ background: "#111827" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span
            ref={eyebrowRef}
            className="eyebrow inline-block"
            style={{ clipPath: "inset(0 0% 0 0)" }}
          >
            Projets
          </span>
          <h2 ref={titleRef} className="section-title mt-5 text-ink">
            Projets
          </h2>
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 space-y-12 sm:space-y-20 md:space-y-28 lg:space-y-40">
          {projects.map((p, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={p.title}
                className="project-card grid grid-cols-1 items-center gap-6 sm:gap-10 lg:grid-cols-12 lg:gap-16"
              >
                <div
                  className={`order-1 lg:col-span-7 ${
                    reverse ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
                    <Visual kind={p.visual} />
                  </div>
                </div>

                <div
                  className={`order-2 lg:col-span-5 ${
                    reverse ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <span className="project-tag inline-flex items-center rounded-full bg-forest/15 px-3 py-1 font-sans text-[11px] font-medium tracking-[0.12em] uppercase text-forest">
                    {p.tag}
                  </span>
                  <h3 className="mt-5 font-serif text-2xl leading-[1.05] text-ink sm:text-3xl md:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-5 font-sans text-[15px] leading-relaxed text-muted">
                    {p.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.stack.map((s, si) => (
                      <span
                        key={s}
                        className="rounded-md border border-card-border bg-card px-2.5 py-1 font-sans text-[11px] tracking-wide text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-7 inline-flex items-center gap-2 font-sans text-sm text-forest transition-opacity hover:opacity-70"
                    >
                      {p.hrefLabel}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M8 7h9v9" />
                      </svg>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
