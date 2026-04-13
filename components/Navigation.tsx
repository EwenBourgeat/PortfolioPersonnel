"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const links = [
  { href: "#about", label: "À propos" },
  { href: "#projects", label: "Projets" },
  { href: "#skills", label: "Compétences" },
  { href: "#contact", label: "Contact" },
];

function NavLink({
  href,
  label,
  scrolled,
}: {
  href: string;
  label: string;
  scrolled: boolean;
}) {
  const groupRef = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    if (groupRef.current)
      gsap.to(groupRef.current, {
        yPercent: -50,
        duration: 0.3,
        ease: "power2.inOut",
      });
  };
  const onLeave = () => {
    if (groupRef.current)
      gsap.to(groupRef.current, {
        yPercent: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
  };

  return (
    <a
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative block overflow-hidden font-sans text-[13px] tracking-[0.04em] transition-colors ${
        scrolled ? "text-ink" : "text-white"
      }`}
      style={{ height: "1.3em" }}
    >
      <span ref={groupRef} className="block">
        <span className="block leading-[1.3]">{label}</span>
        <span className="block leading-[1.3]">{label}</span>
      </span>
    </a>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 2.6);
      if (progressRef.current) {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        progressRef.current.style.transform = `scaleX(${p})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;
    const onEnter = () =>
      gsap.to(logo, {
        letterSpacing: "4px",
        duration: 0.3,
        ease: "power2.out",
      });
    const onLeave = () =>
      gsap.to(logo, {
        letterSpacing: "normal",
        duration: 0.3,
        ease: "power2.out",
      });
    logo.addEventListener("mouseenter", onEnter);
    logo.addEventListener("mouseleave", onLeave);
    return () => {
      logo.removeEventListener("mouseenter", onEnter);
      logo.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed inset-x-0 top-0 z-[100] h-[2px]">
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-forest"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-void shadow-[0_1px_0_rgba(255,255,255,0.06)]"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <a
            ref={logoRef}
            href="#top"
            className={`font-serif text-3xl leading-none transition-colors ${
              scrolled ? "text-ink" : "text-white"
            }`}
            aria-label="Accueil — Ewen Bourgeat"
          >
            EB
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  scrolled={scrolled}
                />
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="inline-flex items-center rounded-[10px] bg-forest px-5 py-2.5 font-sans text-[13px] font-medium tracking-[0.02em] text-white transition-colors hover:bg-sage"
              >
                Me contacter
              </a>
            </li>
          </ul>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className={`relative z-[60] inline-flex h-10 w-10 items-center justify-center md:hidden ${
              open ? "text-ink" : scrolled ? "text-ink" : "text-white"
            }`}
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 top-0 block h-px w-6 bg-current transition-transform ${
                  open ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 block h-px w-6 bg-current transition-transform ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 z-40 bg-void transition-opacity duration-300 md:hidden ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <ul className="flex h-full flex-col items-center justify-center gap-8 px-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-4xl text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-4">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center rounded-[10px] bg-forest px-7 py-3 font-sans text-sm font-medium text-white"
              >
                Me contacter
              </a>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
