import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#061c2b] px-5 py-20 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(216,173,97,0.2),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(216,173,97,0.1),transparent_38%)]" />

      <div className="relative mx-auto max-w-lg animate-[fadeIn_0.6s_ease-out]">
        <p className="text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
          Page missing
        </p>
        <p className="mt-4 font-logo text-[clamp(4.5rem,18vw,7rem)] leading-none tracking-[-0.04em] text-white/15">
          404
        </p>
        <h1 className="mt-2 font-logo text-[clamp(2.2rem,6vw,3.4rem)] tracking-[-0.02em]">
          This path leads nowhere
        </h1>
        <p className="mt-3 font-script text-3xl text-[#d8ad61] sm:text-4xl">
          lost for a moment
        </p>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
          The page you’re looking for isn’t part of Angela’s celebration site.
          Head home, or continue to the invitation details.
        </p>
        <div className="mx-auto mt-6 h-px w-12 bg-[#d8ad61]" />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-[#d8ad61] px-6 py-3.5 text-sm font-bold tracking-[0.12em] text-[#102536] uppercase transition hover:brightness-105"
          >
            Back home
          </Link>
          <Link
            href="/rsvp"
            className="border border-white/25 px-6 py-3.5 text-sm font-bold tracking-[0.12em] text-white uppercase transition hover:border-[#d8ad61] hover:text-[#d8ad61]"
          >
            RSVP
          </Link>
        </div>
      </div>
    </main>
  );
}
