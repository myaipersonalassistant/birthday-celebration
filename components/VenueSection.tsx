"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  { src: "/next1.png", alt: "Purobeach Barcelona venue view" },
  { src: "/next2.png", alt: "Purobeach Barcelona terrace" },
  { src: "/next3.png", alt: "Purobeach Barcelona evening ambiance" },
];

const AUTO_ROTATE_MS = 5_000;

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5c-3.9 0-7 3-7 6.8 0 4.7 5.3 10.3 6.5 11.5a.7.7 0 0 0 1 0C13.7 19.6 19 14 19 9.3c0-3.8-3.1-6.8-7-6.8Zm0 9.4a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
      />
    </svg>
  );
}

export function VenueSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section
      id="venue"
      aria-labelledby="venue-heading"
      className="relative isolate h-[380px] overflow-hidden text-white sm:h-[420px]"
    >
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`-z-20 object-cover object-center transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,18,32,1)_0%,rgba(2,18,32,0.75)_28%,rgba(2,18,32,0.48)_48%,rgba(2,18,32,0)_62%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,18,32,0.12),transparent_35%,transparent_70%,rgba(2,18,32,0.18)_100%)]" />

      <div className="relative mx-auto flex h-full w-full max-w-[1440px] items-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="max-w-lg">
          <p className="font-script text-2xl leading-none text-[#d8ad61] sm:text-3xl">Our Venue</p>

          <h2
            id="venue-heading"
            className="mt-2 font-logo text-[clamp(1.9rem,3.8vw,3.2rem)] leading-[0.98] font-medium tracking-[-0.02em]"
          >
            Purobeach Barcelona
          </h2>

          <p className="mt-1.5 font-logo text-base leading-snug text-white/95 sm:text-xl">
            Hilton Diagonal Mar Barcelona
          </p>

          <div className="mt-5 flex items-start gap-3">
            <LocationIcon className="mt-0.5 size-7 shrink-0 text-[#d8ad61] sm:size-8" />
            <p className="text-sm leading-relaxed text-white/90">
              Pg. del Taulat, 262, 264
              <br />
              Sant Martí, 08019 Barcelona, Spain
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Purobeach+Barcelona+Hilton+Diagonal+Mar"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-[#d7ad62] px-8 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-colors hover:bg-[#edca87] sm:w-fit"
          >
            Get Directions
          </a>
        </div>
      </div>

      <div className="absolute right-5 bottom-5 z-10 flex gap-3 sm:right-10">
        <button
          type="button"
          aria-label="Previous venue image"
          onClick={goToPrevious}
          className="grid size-10 place-items-center rounded-full border border-white/25 bg-[#061c2b]/55 text-white backdrop-blur-sm transition-colors hover:border-[#d8ad61] hover:text-[#d8ad61]"
        >
          <ChevronIcon direction="left" />
        </button>
        <button
          type="button"
          aria-label="Next venue image"
          onClick={goToNext}
          className="grid size-10 place-items-center rounded-full border border-white/25 bg-[#061c2b]/55 text-white backdrop-blur-sm transition-colors hover:border-[#d8ad61] hover:text-[#d8ad61]"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
    </section>
  );
}
