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

const categories: { title: string; items: string[] }[] = [
  {
    title: "Data & ML",
    items: [
      "Python",
      "Pandas",
      "NumPy",
      "scikit-learn",
      "XGBoost",
      "YOLOv8",
      "FFT",
      "Séries temporelles",
      "Détection d'anomalies",
    ],
  },
  {
    title: "Automatisation & IA",
    items: [
      "n8n (avancé)",
      "Claude API",
      "MCP",
      "Gemini API",
      "Prompt engineering",
      "Airtable API",
      "Pinterest API",
    ],
  },
  {
    title: "Web & Backend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Supabase",
      "Vercel",
      "Clerk",
      "Stripe",
      "Brevo",
    ],
  },
  {
    title: "Outils",
    items: [
      "Git / GitHub",
      "Docker (bases)",
      "REST APIs",
      "Agile",
      "JavaFX",
      "Maven",
    ],
  },
];

const timeline: {
  year: string;
  title: string;
  detail: string;
  highlight?: boolean;
}[] = [
  {
    year: "2022",
    title: "Entrée à CY Tech",
    detail: "Génie Mathématique & Informatique — Pau",
  },
  {
    year: "Hiver 2026",
    title: "Échange universitaire UQAC",
    detail: "Canada · Séries temporelles, ML, Algorithmique avancée",
  },
  {
    year: "Sept. 2026",
    title: "Spécialisation HPDA",
    detail:
      "Architecture parallèle · IA & Applications · Compressive Sensing",
  },
  {
    year: "Sept. 2026",
    title: "Alternance Data/IA",
    detail: "Disponible · Toulouse / remote",
    highlight: true,
  },
  {
    year: "Sept. 2027",
    title: "Diplôme ingénieur HPDA",
    detail: "Fin du cursus CY Tech",
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);

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

        // Category titles fade
        gsap.from(".skill-cat-title", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        });

        // Badges pop per category with back.out
        gsap.utils.toArray<HTMLElement>(".skill-cat").forEach((cat) => {
          const badges = cat.querySelectorAll(".skill-badge");
          gsap.from(badges, {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.2)",
            stagger: 0.04,
            scrollTrigger: { trigger: cat, start: "top 80%" },
          });
        });

        // Timeline line draw
        if (timelineLineRef.current) {
          gsap.fromTo(
            timelineLineRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".tl-list",
                start: "top 80%",
                end: "bottom 60%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        // Timeline items: dot pop + text slide
        gsap.utils.toArray<HTMLElement>(".tl-item").forEach((item) => {
          const dot = item.querySelector(".tl-dot");
          if (dot) {
            gsap.from(dot, {
              scale: 0,
              duration: 0.4,
              ease: "back.out(1.7)",
              scrollTrigger: { trigger: item, start: "top 80%" },
            });
          }
          const content = item.querySelector(".tl-content");
          if (content) {
            gsap.from(content, {
              x: 30,
              opacity: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 80%" },
            });
          }
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.from(".skill-cat", {
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        });
        gsap.from(".tl-item", {
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: { trigger: ".tl-list", start: "top 80%" },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
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
            Compétences
          </span>
          <h2 ref={titleRef} className="section-title mt-5 text-ink">
            Compétences
          </h2>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Skills */}
          <div className="lg:col-span-7">
            <div className="space-y-10">
              {categories.map((cat) => (
                <div key={cat.title} className="skill-cat">
                  <span className="skill-cat-title eyebrow">{cat.title}</span>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <li key={item}>
                        <span className="skill-badge inline-flex cursor-default items-center rounded-lg border border-card-border bg-surface px-3 py-1.5 font-sans text-[12.5px] text-ink transition-all duration-200 hover:border-forest hover:bg-forest hover:text-white hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(74,124,89,0.4)]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-5">
            <span className="eyebrow">Formation</span>
            <ol className="tl-list relative mt-6 space-y-8 pl-8">
              {/* Background line */}
              <div className="absolute bottom-0 left-0 top-0 w-px bg-forest/20" />
              {/* Animated line */}
              <div
                ref={timelineLineRef}
                className="absolute bottom-0 left-0 top-0 w-px origin-top bg-forest"
              />
              {timeline.map((item, idx) => (
                <li key={idx} className="tl-item relative">
                  <span
                    className={`tl-dot absolute -left-[37px] top-1.5 grid h-3 w-3 place-items-center rounded-full ${
                      item.highlight
                        ? "bg-forest ring-4 ring-forest/20"
                        : "bg-forest/70"
                    }`}
                  />
                  <div className="tl-content">
                    <div className="font-sans text-[11px] uppercase tracking-[0.18em] text-forest">
                      {item.year}
                    </div>
                    <div className="mt-1 font-serif text-xl text-ink">
                      {item.title}
                    </div>
                    <div className="mt-1 font-sans text-[13px] text-muted">
                      {item.detail}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
