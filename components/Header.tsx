"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const navigation = [
  { label: "Home", href: "/#hero" },
  { label: "About Angela", href: "/#about" },
  { label: "Venue", href: "/venue" },
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
  { label: "Guestbook", href: "/guestbook" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateHeaderBackground = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (pathname !== "/") {
          setIsPastHero(true);
          return;
        }

        const hero = document.getElementById("hero");
        if (!hero) {
          setIsPastHero((window.scrollY || 0) > 80);
          return;
        }

        setIsPastHero(hero.getBoundingClientRect().bottom <= 100);
      });
    };

    updateHeaderBackground();
    window.addEventListener("scroll", updateHeaderBackground, { passive: true });
    window.addEventListener("resize", updateHeaderBackground);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateHeaderBackground);
      window.removeEventListener("resize", updateHeaderBackground);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  const mobileBackdrop =
    isMounted &&
    createPortal(
      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-[#061c2b]/40 transition-opacity duration-300 xl:hidden ${
          isMenuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      />,
      document.body,
    );

  return (
    <>
      {mobileBackdrop}

      <header
        data-past-hero={isPastHero ? "true" : "false"}
        className={`site-header fixed inset-x-0 top-0 z-50 border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-md transition-[background-color] duration-300 ${
          isPastHero ? "site-header--past" : "site-header--top"
        }`}
      >
        <div className="relative z-50 mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-5 px-4 sm:px-8 lg:h-24 lg:px-12 xl:px-16">
          <Link
            href="/#hero"
            aria-label="Celebrate Angela—home"
            className="relative block h-14 w-36 shrink-0 sm:h-16 sm:w-40"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="absolute top-0 left-0 font-logo text-[1.5rem] leading-none font-medium tracking-[-0.02em] text-white sm:text-[1.7rem]">
              celebrate
            </span>
            <span className="absolute top-4 left-3 w-max whitespace-nowrap font-script text-[3rem] leading-none text-[#d8ad61] drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] sm:text-[3.5rem]">
              Angela
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-5 rotate-12 font-sans text-base"
              >
                ♥
              </span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-7 xl:flex 2xl:gap-9">
            {navigation.map((item) => {
              const isActive =
                item.href.startsWith("/") && !item.href.includes("#")
                  ? pathname === item.href
                  : pathname === "/" && item.label === "Home";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative px-1 py-3 text-[0.72rem] font-bold tracking-[0.08em] uppercase transition-all duration-300 hover:scale-[1.04] hover:font-extrabold hover:tracking-[0.1em] hover:text-[#e0b86e] ${
                    isActive ? "text-[#e0b86e]" : "text-white/90"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-1 bottom-1 h-0.5 origin-left bg-[#e0b86e] transition-transform duration-300 ease-out ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <Link
            href="/rsvp"
            className="group relative hidden min-h-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-[#d7ad62] px-7 text-[0.63rem] font-extrabold tracking-[0.15em] text-[#122536] shadow-[0_8px_24px_rgba(216,173,97,0.25)] transition-all duration-300 hover:scale-[1.04] hover:bg-[#edca87] hover:shadow-[0_10px_28px_rgba(216,173,97,0.4)] xl:inline-flex animate-[softPulse_2.4s_ease-out_infinite]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative inline-flex items-center gap-1.5">
              RSVP NOW
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="group grid size-12 shrink-0 place-items-center rounded-full border border-[#d8ad61]/50 bg-[#071b2a]/60 text-[#d8ad61] transition-all hover:border-[#d8ad61] hover:bg-[#d8ad61] hover:text-[#071b2a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8ad61] xl:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute top-0 left-0 h-px w-5 bg-current transition-transform duration-300 ${
                  isMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute top-[7px] right-0 h-px bg-current transition-all duration-300 ${
                  isMenuOpen ? "w-0 opacity-0" : "w-3.5 opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-300 ${
                  isMenuOpen ? "-translate-y-[8px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        <div
          id="mobile-navigation"
          aria-hidden={!isMenuOpen}
          className={`absolute inset-x-0 top-full z-50 border-t border-white/10 bg-[#061c2b]/95 px-5 py-7 shadow-2xl backdrop-blur-2xl transition-all duration-300 xl:hidden ${
            isMenuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible pointer-events-none -translate-y-3 opacity-0"
          }`}
        >
          <nav aria-label="Mobile navigation" className="mx-auto max-w-lg">
            <div className="grid grid-cols-2 gap-x-6">
              {navigation.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center gap-3 border-b border-white/10 py-4 text-sm font-bold tracking-[0.08em] text-white uppercase transition-colors hover:text-[#d8ad61]"
                >
                  <span className="font-display text-[0.65rem] text-[#d8ad61]/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href="/rsvp"
              onClick={() => setIsMenuOpen(false)}
              className="group relative mt-7 flex min-h-12 w-full items-center justify-center overflow-hidden rounded-sm bg-[#d7ad62] text-xs font-extrabold tracking-[0.18em] text-[#122536] transition-all duration-300 hover:scale-[1.01] hover:bg-[#edca87] animate-[softPulse_2.4s_ease-out_infinite]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative inline-flex items-center gap-1.5">
                RSVP NOW
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>

            <p className="mt-5 text-center font-display text-sm italic text-white/45">
              Barcelona · 7 August 2026
            </p>
          </nav>
        </div>
      </header>
    </>
  );
}
