"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RsvpInteractiveForm } from "@/components/RsvpInteractiveForm";

const dayMoments = [
  {
    time: "1:00 PM",
    title: "Marina Arrival",
    detail: "Port Olímpic · boarding & welcome",
  },
  {
    time: "2:00 PM",
    title: "Catamaran Cruise",
    detail: "One-hour sail along the coast",
  },
  {
    time: "6:30 PM",
    title: "Evening Celebration",
    detail: "Purobeach · Hilton · elegant dress",
  },
];

export function RsvpSection() {
  const [imageRevealed, setImageRevealed] = useState(false);

  return (
    <div id="reservation" className="h-full bg-[#061c2b] px-5 py-5 sm:py-6">
      <div className="grid h-full items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(240px,0.95fr)] lg:gap-7">
        <div className="order-2 flex flex-col lg:order-1">
          <RsvpInteractiveForm variant="dark" headingId="rsvp-heading" />
          <Link
            href="/rsvp"
            className="group mt-5 inline-flex items-center gap-2 self-start text-[0.65rem] font-extrabold tracking-[0.14em] text-[#d8ad61] uppercase transition-all duration-300 hover:gap-3"
          >
            Open full RSVP page
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <aside className="relative order-1 lg:order-2 lg:flex lg:h-full lg:min-h-0 lg:max-h-[560px] lg:flex-col">
          <div className="relative m-0.5 flex-1 overflow-hidden border border-[#d8ad61]/40">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1.5 left-1.5 z-20 h-6 w-6 border-t-2 border-l-2 border-[#d8ad61]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1.5 right-1.5 z-20 h-6 w-6 border-t-2 border-r-2 border-[#d8ad61]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1.5 left-1.5 z-20 h-6 w-6 border-b-2 border-l-2 border-[#d8ad61]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-1.5 bottom-1.5 z-20 h-6 w-6 border-r-2 border-b-2 border-[#d8ad61]"
            />

            <button
              type="button"
              onClick={() => setImageRevealed((current) => !current)}
              aria-pressed={imageRevealed}
              aria-label={
                imageRevealed
                  ? "Hide image details and show celebration info"
                  : "Reveal full portrait photo"
              }
              className="relative block aspect-[2/3] w-full cursor-pointer overflow-hidden text-left lg:aspect-auto lg:h-full lg:min-h-[320px] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#d8ad61]"
            >
              <Image
                src="/RSVP.png"
                alt="Angela Ifonlaja"
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover object-center lg:object-top"
              />

              <div
                className={`absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-[#061c2b] via-[#061c2b]/70 to-transparent transition-opacity duration-500 ease-out ${
                  imageRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <div className="space-y-4 p-5 sm:p-6">
                  <div>
                    <p className="font-script text-2xl text-[#d8ad61]">7 August 2026</p>
                    <p className="mt-1 font-logo text-xl text-white sm:text-2xl">
                      Welcome to Barcelona
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/65">
                      Delighted you’re joining Angela’s celebration.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {dayMoments.map((moment) => (
                      <div key={moment.title}>
                        <p className="text-[0.6rem] font-bold tracking-[0.14em] text-[#d8ad61] uppercase">
                          {moment.time}
                        </p>
                        <p className="mt-0.5 font-logo text-base text-white">{moment.title}</p>
                        <p className="text-xs text-white/65">{moment.detail}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[0.6rem] font-bold tracking-[0.16em] text-white/50 uppercase">
                    Tap photo to view
                  </p>
                </div>
              </div>

              <div
                className={`absolute inset-x-0 top-8 z-10 flex justify-center px-5 transition-all duration-500 ease-out ${
                  imageRevealed
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-3 opacity-0 pointer-events-none"
                }`}
              >
                <span className="bg-[#061c2b]/55 px-3 py-1.5 text-[0.6rem] font-bold tracking-[0.16em] text-white/90 uppercase backdrop-blur-sm">
                  Tap to restore
                </span>
              </div>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
