"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f7f3eb] px-5 py-20 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(216,173,97,0.22),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(6,28,43,0.06),transparent_35%)]" />

      <div className="relative mx-auto max-w-lg animate-[fadeIn_0.6s_ease-out]">
        <p className="text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
          Something went wrong
        </p>
        <h1 className="mt-4 font-logo text-[clamp(2.2rem,6vw,3.4rem)] tracking-[-0.02em] text-[#061c2b]">
          A quiet pause
        </h1>
        <p className="mt-3 font-script text-3xl text-[#d8ad61] sm:text-4xl">
          try again in a moment
        </p>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#4a5d6a] sm:text-base">
          We couldn’t load this page as expected. You can try again, or return
          home to continue exploring the celebration.
        </p>
        <div className="mx-auto mt-6 h-px w-12 bg-[#d8ad61]" />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-[#061c2b] px-6 py-3.5 text-sm font-bold tracking-[0.12em] text-[#d8ad61] uppercase transition hover:brightness-110"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-[#061c2b]/25 px-6 py-3.5 text-sm font-bold tracking-[0.12em] text-[#061c2b] uppercase transition hover:border-[#d8ad61] hover:text-[#d8ad61]"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
