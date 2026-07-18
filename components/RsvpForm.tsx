"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RsvpInteractiveForm } from "@/components/RsvpInteractiveForm";

const dayMoments = [
  { time: "3:30 PM", title: "Catamaran Cruise", detail: "Sail the Barcelona coast together" },
  { time: "7:00 PM", title: "Dinner Celebration", detail: "Purobeach · Hilton Diagonal Mar" },
  { time: "Evening", title: "Under the Stars", detail: "Music, memories, and champagne light" },
];

export function RsvpForm() {
  const [imageRevealed, setImageRevealed] = useState(false);

  const toggleImageReveal = () => {
    setImageRevealed((current) => !current);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:gap-14">
      <aside className="relative overflow-hidden border border-[#d8cfbf] bg-[#061c2b] text-white">
        <div className="relative m-2 sm:m-2.5">
          {/* Gold frame */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-30 h-7 w-7 border-t-2 border-l-2 border-[#d8ad61]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 z-30 h-7 w-7 border-t-2 border-r-2 border-[#d8ad61]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 z-30 h-7 w-7 border-b-2 border-l-2 border-[#d8ad61]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 bottom-0 z-30 h-7 w-7 border-r-2 border-b-2 border-[#d8ad61]"
          />

          <button
            type="button"
            onClick={toggleImageReveal}
            aria-pressed={imageRevealed}
            aria-label={
              imageRevealed
                ? "Hide image details and show celebration info"
                : "Reveal full portrait photo"
            }
            className="relative block aspect-[2/3] w-full cursor-pointer overflow-hidden border border-[#d8ad61]/35 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8ad61]"
          >
            <Image
              src="/RSVP.png"
              alt="Angela Ifonlaja"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
              priority
            />

            {/* Backdrop + all content layered ON the image */}
            <div
              className={`absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-[#061c2b] via-[#061c2b]/75 to-[#061c2b]/15 transition-opacity duration-500 ease-out ${
                imageRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <p className="font-script text-2xl text-[#d8ad61]">7 August 2026</p>
                  <p className="mt-1 font-logo text-2xl">Barcelona awaits</p>
                </div>

                <div>
                  <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
                    The Day Ahead
                  </p>
                  <div className="mt-4 space-y-4">
                    {dayMoments.map((moment) => (
                      <div key={moment.title}>
                        <p className="text-[0.62rem] font-bold tracking-[0.14em] text-[#d8ad61] uppercase">
                          {moment.time}
                        </p>
                        <p className="mt-0.5 font-logo text-base sm:text-lg">{moment.title}</p>
                        <p className="text-xs text-white/65 sm:text-sm">{moment.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/venue"
                  onClick={(event) => event.stopPropagation()}
                  className="inline-flex text-[0.65rem] font-extrabold tracking-[0.14em] text-[#d8ad61] uppercase underline-offset-4 hover:underline"
                >
                  Venue & hotels →
                </Link>

                <p className="text-[0.62rem] font-bold tracking-[0.16em] text-white/50 uppercase">
                  Tap photo to view
                </p>
              </div>
            </div>

            {/* Change `top-8` to move this hint up (smaller) or down (larger): top-4, top-6, top-10, top-12… */}
            <div
              className={`absolute inset-x-0 bottom-20 z-10 flex justify-center px-5 transition-all duration-500 ease-out ${
                imageRevealed
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-3 opacity-0 pointer-events-none"
              }`}
            >
              <span className="bg-[#061c2b]/55 px-3 py-1.5 text-[0.62rem] font-bold tracking-[0.16em] text-white/90 uppercase backdrop-blur-sm">
                Tap to restore
              </span>
            </div>
          </button>
        </div>
      </aside>

      <RsvpInteractiveForm variant="light" />
    </div>
  );
}
