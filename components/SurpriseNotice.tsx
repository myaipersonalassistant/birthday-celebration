"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "angela-surprise-notice-seen";

export function SurpriseNotice() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== "1") {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setIsOpen(false);
  };

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="surprise-notice-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 sm:px-6"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#020d14]/78 backdrop-blur-md animate-[fadeIn_0.45s_ease-out]"
      />

      <div className="relative w-full max-w-lg overflow-hidden border border-[#d8ad61]/45 bg-[#061c2b] text-white shadow-[0_40px_100px_rgba(0,0,0,0.55)] animate-[scaleIn_0.5s_cubic-bezier(0.22,1,0.36,1)]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 left-3 h-7 w-7 border-t-2 border-l-2 border-[#d8ad61]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 h-7 w-7 border-t-2 border-r-2 border-[#d8ad61]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-3 h-7 w-7 border-b-2 border-l-2 border-[#d8ad61]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 bottom-3 h-7 w-7 border-r-2 border-b-2 border-[#d8ad61]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 size-48 -translate-x-1/2 rounded-full bg-[#d8ad61]/15 blur-3xl"
        />

        <div className="relative px-7 py-10 text-center sm:px-10 sm:py-12">
          <p className="text-[0.65rem] font-bold tracking-[0.28em] text-[#d8ad61] uppercase">
            A private note for guests
          </p>

          <h2
            id="surprise-notice-title"
            className="mt-4 font-logo text-[clamp(1.85rem,5vw,2.75rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-white"
          >
            Shhh… it’s a surprise
          </h2>

          <div className="mx-auto mt-5 h-px w-12 bg-[#d8ad61]/70" />

          <p className="mt-5 font-logo text-lg tracking-[-0.02em] text-white sm:text-xl">
            Please help us celebrate Angela Ifonlaja
          </p>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-[0.95rem]">
            We’re planning a surprise celebration in honour of an incredible wife,
            mother, and woman of faith — and we would love for you to be part of
            this unforgettable occasion.
          </p>

          <p className="mx-auto mt-4 max-w-md border border-[#d8ad61]/30 bg-[#d8ad61]/10 px-4 py-3 text-sm leading-relaxed text-[#edca87]">
            Please keep this event a secret from Angela. Your presence will help
            make this a truly memorable surprise.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/rsvp"
              onClick={dismiss}
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-[#d7ad62] px-8 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-colors hover:bg-[#edca87]"
            >
              Kindly RSVP
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex min-h-12 items-center justify-center border border-white/25 px-8 text-[0.68rem] font-extrabold tracking-[0.16em] text-white uppercase transition-colors hover:border-[#d8ad61] hover:text-[#d8ad61]"
            >
              I understand · Continue
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
