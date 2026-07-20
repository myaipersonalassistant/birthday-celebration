import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { cruiseDetails, cruiseItinerary } from "@/lib/cruise-data";

export const metadata: Metadata = {
  title: "Celebration at Sea | Angela Ifonlaja",
  description:
    "Optional 7-night MSC Grandiosa Mediterranean cruise, 8–15 August 2026 — Barcelona round-trip after Angela’s birthday celebration.",
};

function ExternalArrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export default function CruisePage() {
  return (
    <main className="min-h-screen bg-[#f7f3eb]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#061c2b] px-5 pt-28 pb-14 text-white sm:px-8 sm:pt-32 sm:pb-16 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(216,173,97,0.22),transparent_42%),radial-gradient(circle_at_85%_5%,rgba(216,173,97,0.12),transparent_38%)]" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid grid-cols-3"
        >
          <div className="relative overflow-hidden">
            <Image
              src="/left.png"
              alt=""
              width={707}
              height={345}
              className="absolute top-0 left-0 h-[70%] w-auto max-w-full object-contain object-left object-top opacity-[0.16] sm:h-[75%]"
            />
          </div>
          <div />
          <div className="relative overflow-hidden">
            <Image
              src="/right.png"
              alt=""
              width={722}
              height={346}
              className="absolute top-0 right-0 h-[70%] w-auto max-w-full object-contain object-right object-top opacity-[0.16] sm:h-[75%]"
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[900px] text-center">
          <p className="animate-[menuItemRise_0.7s_ease-out_both] text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
            Optional · After Barcelona
          </p>
          <h1 className="mt-3 animate-[menuItemRise_0.75s_ease-out_0.06s_both] font-logo text-[clamp(2.6rem,7vw,4.6rem)] font-medium tracking-[-0.03em]">
            {cruiseDetails.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl animate-[menuItemRise_0.75s_ease-out_0.12s_both] font-script text-3xl text-[#d8ad61]/85 sm:text-4xl">
            aboard{" "}
            <span className="ml-1 inline-block font-logo text-[0.72em] font-semibold tracking-[0.04em] text-[#f0d9a0]">
              MSC Grandiosa
            </span>
          </p>
          <p className="mx-auto mt-5 max-w-2xl animate-[menuItemRise_0.75s_ease-out_0.18s_both] text-sm leading-relaxed text-white/75 sm:text-base">
            {cruiseDetails.blurb}
          </p>
          <div className="mx-auto mt-6 h-px w-12 bg-[#d8ad61]" />

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 animate-[menuItemRise_0.8s_ease-out_0.25s_both] sm:flex-row sm:items-center">
            <a
              href={cruiseDetails.mscBookingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#d7ad62] px-7 text-[0.67rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-colors hover:bg-[#edca87]"
            >
              Book with MSC
              <ExternalArrow className="size-3.5" />
            </a>
            <a
              href={cruiseDetails.mscItineraryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 px-4 text-[0.67rem] font-extrabold tracking-[0.14em] text-white/85 uppercase transition-colors hover:text-[#e4be77]"
            >
              View journey details
              <ExternalArrow className="size-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </section>

      {/* Snapshot strip */}
      <section className="border-b border-[#d8cfbf] bg-white px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1100px] gap-6 sm:grid-cols-3 sm:gap-4">
          {[
            { label: "When", value: cruiseDetails.dateRangeShort },
            { label: "Voyage", value: `${cruiseDetails.nights}-night Mediterranean` },
            { label: "Ports", value: "Barcelona round-trip" },
          ].map((item) => (
            <div key={item.label} className="text-center sm:px-4">
              <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#c99b4e] uppercase">
                {item.label}
              </p>
              <p className="mt-2 font-logo text-xl tracking-[-0.02em] text-[#061c2b] sm:text-2xl">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Itinerary */}
      <section className="px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-[#c99b4e] uppercase">
              Western Mediterranean
            </p>
            <h2 className="mt-3 font-logo text-[clamp(1.9rem,4vw,3rem)] font-medium text-[#061c2b]">
              The journey
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#4a5d6a]">
              Sail from Barcelona through France, Italy, and the Balearics —
              returning to Barcelona a week later.
            </p>
            <div className="mx-auto mt-5 h-px w-12 bg-[#c99b4e]" />
          </div>

          {/* Mobile vertical path */}
          <ol className="relative mx-auto mt-10 max-w-sm space-y-0 lg:hidden">
            <span
              aria-hidden="true"
              className="absolute top-4 bottom-4 left-[1.15rem] w-px bg-[#d8ad61]/45"
            />
            {cruiseItinerary.map((stop, index) => (
              <li key={`${stop.port}-${index}`} className="relative flex gap-4 pb-5 last:pb-0">
                <span className="relative z-10 mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-[#d8ad61] bg-[#f7f3eb] text-[0.6rem] font-bold tracking-[0.08em] text-[#8a6a2e]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-logo text-xl tracking-[-0.02em] text-[#061c2b]">
                    {stop.port}
                  </p>
                  <p className="mt-0.5 text-xs tracking-[0.04em] text-[#6b7c88]">
                    {stop.country}
                    <span className="mx-1.5 text-[#d8ad61]">·</span>
                    {stop.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Desktop journey rail */}
          <ol className="relative mt-12 hidden lg:grid lg:grid-cols-7 lg:gap-0">
            <span
              aria-hidden="true"
              className="absolute top-5 right-[7%] left-[7%] h-px bg-[#d8ad61]/50"
            />
            {cruiseItinerary.map((stop, index) => (
              <li
                key={`${stop.port}-${index}`}
                className="relative flex flex-col items-center px-2 text-center"
              >
                <span className="relative z-10 grid size-10 place-items-center rounded-full border border-[#d8ad61] bg-[#f7f3eb] text-[0.65rem] font-bold tracking-[0.1em] text-[#8a6a2e] shadow-[0_0_0_6px_#f7f3eb]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 font-logo text-lg leading-tight tracking-[-0.02em] text-[#061c2b]">
                  {stop.port}
                </p>
                <p className="mt-1 text-[0.65rem] tracking-[0.06em] text-[#6b7c88] uppercase">
                  {stop.note}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* How to book */}
      <section className="relative overflow-hidden bg-[#061c2b] px-5 py-14 text-white sm:px-8 sm:py-16 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(216,173,97,0.16),transparent_40%)]"
        />

        <div className="relative z-10 mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#d8ad61] uppercase">
              Book directly with MSC
            </p>
            <h2 className="mt-3 font-logo text-[clamp(1.9rem,4vw,2.8rem)] font-medium">
              How to join us
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
              {cruiseDetails.note}
            </p>
            <p className="mt-4 text-sm text-white/55">
              Separate from Friday&apos;s Port Olímpic catamaran — this is the
              week-long MSC sailing that begins the next day.
            </p>

            <ul className="mt-8 space-y-3">
              {cruiseDetails.bookingChecklist.map((item) => (
                <li
                  key={item.label}
                  className="flex items-baseline gap-3 border-l-2 border-[#d8ad61] pl-4"
                >
                  <div>
                    <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
                      {item.label}
                    </p>
                    <p className="mt-0.5 font-logo text-xl text-white">
                      {item.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[#d8ad61]/30 bg-white/[0.04] p-6 sm:p-8">
            <p className="font-script text-3xl text-[#d8ad61]">set sail with us</p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              {cruiseDetails.startLabel} → {cruiseDetails.endLabel}
              <br />
              Departing from and returning to {cruiseDetails.departurePort}.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={cruiseDetails.mscBookingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#d7ad62] px-6 text-[0.67rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-colors hover:bg-[#edca87]"
              >
                View cruise &amp; book with MSC
                <ExternalArrow className="size-3.5" />
              </a>
              <a
                href={cruiseDetails.mscItineraryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/20 px-6 text-[0.65rem] font-extrabold tracking-[0.14em] text-white/85 uppercase transition-colors hover:border-[#d8ad61] hover:text-[#e4be77]"
              >
                Open journey details
                <ExternalArrow className="size-3.5 opacity-70" />
              </a>
            </div>
            <p className="mt-5 text-[0.7rem] leading-relaxed text-white/40">
              You will leave this celebration site and complete booking on
              msccruises.co.uk.
            </p>
          </div>
        </div>
      </section>

      {/* Back to celebration day */}
      <section className="px-5 py-12 text-center sm:px-8 sm:py-14 lg:px-12">
        <p className="font-script text-3xl text-[#c99b4e]">first, the birthday</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#4a5d6a]">
          The main celebration is Friday, 7 August in Barcelona — then this
          optional week at sea for those who wish to continue.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/rsvp"
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#061c2b] px-7 text-[0.67rem] font-extrabold tracking-[0.16em] text-white uppercase transition hover:bg-[#0a2a3f]"
          >
            RSVP for 7 August
          </Link>
          <Link
            href="/#day-plan"
            className="inline-flex min-h-11 items-center justify-center px-4 text-[0.67rem] font-extrabold tracking-[0.14em] text-[#061c2b]/70 uppercase transition hover:text-[#c99b4e]"
          >
            See the day ahead
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
