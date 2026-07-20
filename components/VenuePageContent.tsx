import Image from "next/image";
import Link from "next/link";
import { cruiseDetails } from "@/lib/cruise-data";
import {
  arrivalNotes,
  eveningVenue,
  eventDateLabel,
  exploreBarcelonaUrl,
  marinaVenue,
  nearbyHotels,
} from "@/lib/venue-data";

function LocationPin({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5c-3.9 0-7 3-7 6.8 0 4.7 5.3 10.3 6.5 11.5a.7.7 0 0 0 1 0C13.7 19.6 19 14 19 9.3c0-3.8-3.1-6.8-7-6.8Zm0 9.4a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z" />
    </svg>
  );
}

function WaveDivider() {
  return (
    <div className="mx-auto flex items-center justify-center gap-3" aria-hidden="true">
      <span className="h-px w-10 bg-[#d8ad61]/50" />
      <span className="size-1.5 rotate-45 bg-[#d8ad61]" />
      <span className="h-px w-10 bg-[#d8ad61]/50" />
    </div>
  );
}

export function VenuePageContent() {
  return (
    <>
      <section className="relative isolate min-h-[72vh] overflow-hidden text-white">
        <Image
          src="/next1.png"
          alt="Purobeach Barcelona at Hilton Diagonal Mar waterfront"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(6,28,43,0.92)_0%,rgba(6,28,43,0.72)_42%,rgba(6,28,43,0.35)_70%,rgba(6,28,43,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(216,173,97,0.18),transparent_40%)]" />

        <div className="relative mx-auto flex min-h-[72vh] w-full max-w-[1240px] flex-col justify-end px-5 pb-14 pt-32 sm:px-8 sm:pb-16 lg:px-12">
          <p className="animate-[menuItemRise_0.7s_ease-out_both] text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
            {eventDateLabel}
          </p>
          <h1 className="mt-3 max-w-3xl animate-[menuItemRise_0.75s_ease-out_0.08s_both] font-logo text-[clamp(2.6rem,7vw,5rem)] leading-[0.95] font-medium tracking-[-0.03em]">
            Where We Gather
          </h1>
          <p className="mt-3 animate-[menuItemRise_0.75s_ease-out_0.14s_both] font-script text-3xl text-[#d8ad61] sm:text-4xl">
            Marina by day · Purobeach & Hilton by evening
          </p>
          <p className="mt-5 max-w-xl animate-[menuItemRise_0.75s_ease-out_0.2s_both] text-sm leading-relaxed text-white/80 sm:text-base">
            A private catamaran from Port Olímpic, then Angela’s birthday dinner at
            Purobeach Barcelona · Hilton Diagonal Mar. Dress code for the evening:
            elegant.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 animate-[menuItemRise_0.75s_ease-out_0.28s_both]">
            <a
              href="#day-marina"
              className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#d7ad62] px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-colors hover:bg-[#edca87]"
            >
              Day · Marina
            </a>
            <a
              href="#evening-hilton"
              className="inline-flex min-h-11 items-center justify-center border border-white/30 px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-white uppercase transition-colors hover:border-[#d8ad61] hover:text-[#d8ad61]"
            >
              Evening · Purobeach
            </a>
            <a
              href="#stay-nearby"
              className="inline-flex min-h-11 items-center justify-center border border-white/30 px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-white uppercase transition-colors hover:border-[#d8ad61] hover:text-[#d8ad61]"
            >
              Stay Nearby
            </a>
            <a
              href="#continue-at-sea"
              className="inline-flex min-h-11 items-center justify-center border border-[#d8ad61]/50 px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#d8ad61] uppercase transition-colors hover:border-[#d8ad61] hover:bg-[#d8ad61]/10"
            >
              Continue at Sea
            </a>
          </div>
        </div>
      </section>

      <section
        id="day-marina"
        className="bg-[#f7f3eb] px-5 py-14 text-[#0b2638] sm:px-8 sm:py-16 lg:px-12"
      >
        <div className="mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="font-script text-2xl text-[#c99b4e]">{marinaVenue.scriptLabel}</p>
            <h2 className="mt-2 font-logo text-[clamp(1.9rem,4vw,3rem)] font-medium tracking-[-0.02em]">
              {marinaVenue.name}
            </h2>
            <WaveDivider />
            <p className="mt-4 text-sm font-semibold tracking-[0.04em] text-[#0b2638] sm:text-base">
              {marinaVenue.timeLabel}
              <span className="mx-2 text-[#c99b4e]">·</span>
              {marinaVenue.sailWindow}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#4a5d6a] sm:text-base">
              {marinaVenue.blurb}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#4a5d6a] sm:text-base">
              {marinaVenue.freeTimeNote}
            </p>

            <div className="mt-8 flex items-start gap-3 border-l-2 border-[#d8ad61] pl-4">
              <LocationPin className="mt-0.5 size-6 shrink-0 text-[#c99b4e]" />
              <div>
                <p className="font-logo text-lg font-semibold">Meeting point</p>
                {marinaVenue.addressLines.map((line) => (
                  <p key={line} className="text-sm text-[#4a5d6a]">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#8a7348] uppercase">
                Boats (one of)
              </p>
              <p className="mt-2 text-sm text-[#0b2638]">
                {marinaVenue.boatNames.join(" · ")}
              </p>
            </div>

            <a
              href={marinaVenue.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-sm bg-[#061c2b] px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-90"
            >
              Marina Directions
            </a>
          </div>

          <div className="relative">
            <div className="absolute -top-3 -left-3 h-16 w-16 border-t border-l border-[#d8ad61]/70" />
            <div className="absolute -right-3 -bottom-3 h-16 w-16 border-r border-b border-[#d8ad61]/70" />
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/1.png"
                alt="Catamaran along the Barcelona coast"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="evening-hilton"
        className="relative overflow-hidden bg-[#061c2b] px-5 py-14 text-white sm:px-8 sm:py-16 lg:px-12"
      >
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
              className="absolute top-1/2 left-0 h-[92%] w-auto max-w-full -translate-y-1/2 object-contain object-left opacity-[0.16]"
            />
          </div>
          <div />
          <div className="relative overflow-hidden">
            <Image
              src="/right.png"
              alt=""
              width={722}
              height={346}
              className="absolute top-1/2 right-0 h-[92%] w-auto max-w-full -translate-y-1/2 object-contain object-right opacity-[0.16]"
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-3 -left-3 h-16 w-16 border-t border-l border-[#d8ad61]/70" />
            <div className="absolute -right-3 -bottom-3 h-16 w-16 border-r border-b border-[#d8ad61]/70" />
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/next2.png"
                alt="Purobeach Barcelona at Hilton Diagonal Mar"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="font-script text-2xl text-[#d8ad61]">{eveningVenue.scriptLabel}</p>
            <h2 className="mt-2 font-logo text-[clamp(1.9rem,4vw,3rem)] font-medium tracking-[-0.02em]">
              {eveningVenue.name}
            </h2>
            <p className="mt-2 font-logo text-base text-white/90 sm:text-xl">
              {eveningVenue.host}
            </p>
            <div className="mt-4 flex items-center gap-3" aria-hidden="true">
              <span className="h-px w-10 bg-[#d8ad61]/50" />
              <span className="size-1.5 rotate-45 bg-[#d8ad61]" />
              <span className="h-px w-10 bg-[#d8ad61]/50" />
            </div>
            <p className="mt-4 text-sm font-semibold tracking-[0.04em] text-white sm:text-base">
              {eveningVenue.timeLabel}
              <span className="mx-2 text-[#d8ad61]">·</span>
              Dress code · {eveningVenue.dressCode}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
              {eveningVenue.blurb}
            </p>

            <div className="mt-8 flex items-start gap-3 border-l-2 border-[#d8ad61] pl-4">
              <LocationPin className="mt-0.5 size-6 shrink-0 text-[#d8ad61]" />
              <div>
                <p className="font-logo text-lg font-semibold">{eveningVenue.shortLabel}</p>
                {eveningVenue.addressLines.map((line) => (
                  <p key={line} className="text-sm text-white/70">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <a
              href={eveningVenue.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-sm bg-[#d7ad62] px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-colors hover:bg-[#edca87]"
            >
              Evening Directions
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3eb] px-5 py-14 text-[#0b2638] sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-[#c99b4e] uppercase">
              Getting There
            </p>
            <h2 className="mt-3 font-logo text-[clamp(1.8rem,4vw,2.8rem)] font-medium">
              Two places · one celebration
            </h2>
            <div className="mx-auto mt-4 h-px w-12 bg-[#c99b4e]" />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {arrivalNotes.map((note, index) => (
              <article
                key={note.title}
                className="border border-[#d8cfbf] bg-white px-5 py-6 shadow-[0_10px_28px_rgba(11,38,56,0.05)] transition-colors duration-300 hover:border-[#d8ad61]/70"
              >
                <p className="font-display text-[0.65rem] tracking-[0.18em] text-[#c99b4e] uppercase">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-logo text-xl font-semibold">{note.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4a5d6a]">{note.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden border border-[#d8cfbf] bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-[#e8e0d2] px-4 py-3">
                <p className="text-[0.65rem] font-bold tracking-[0.14em] text-[#0b2638] uppercase">
                  Day · Port Olímpic
                </p>
                <a
                  href={marinaVenue.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.62rem] font-bold tracking-[0.12em] text-[#c99b4e] uppercase underline-offset-4 hover:underline"
                >
                  Open maps
                </a>
              </div>
              <div className="relative min-h-[220px] sm:min-h-[280px]">
                <iframe
                  title="Map to Port Olímpic marina"
                  src={marinaVenue.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="overflow-hidden border border-[#d8cfbf] bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-[#e8e0d2] px-4 py-3">
                <p className="text-[0.65rem] font-bold tracking-[0.14em] text-[#0b2638] uppercase">
                  Evening · Purobeach & Hilton
                </p>
                <a
                  href={eveningVenue.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.62rem] font-bold tracking-[0.12em] text-[#c99b4e] uppercase underline-offset-4 hover:underline"
                >
                  Open maps
                </a>
              </div>
              <div className="relative min-h-[220px] sm:min-h-[280px]">
                <iframe
                  title="Map to Purobeach Barcelona at Hilton Diagonal Mar"
                  src={eveningVenue.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="stay-nearby"
        className="bg-[#061c2b] px-5 py-14 text-white sm:px-8 sm:py-16 lg:px-12"
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-script text-2xl text-[#d8ad61]">Where to Stay</p>
              <h2 className="mt-2 font-logo text-[clamp(1.9rem,4vw,3rem)] font-medium tracking-[-0.02em]">
                Hotels near Purobeach, Hilton &amp; the marina
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                Six recommended stays close to the celebration. Prefer something else?
                Browse more options on GetYourGuide.
              </p>
            </div>
            <a
              href={exploreBarcelonaUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex min-h-12 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-[#d7ad62] px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-all duration-300 hover:scale-[1.02] hover:bg-[#edca87] sm:self-start lg:self-end"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative inline-flex items-center gap-2">
                More on GetYourGuide
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </a>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {nearbyHotels.map((hotel) => (
              <article
                key={hotel.id}
                className="group flex flex-col overflow-hidden border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d8ad61]/45 hover:bg-white/[0.07]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061c2b]/55 via-transparent to-transparent" />
                  {hotel.featured && (
                    <span className="absolute top-3 left-3 bg-[#d7ad62] px-2.5 py-1 text-[0.58rem] font-extrabold tracking-[0.12em] text-[#102536] uppercase">
                      Evening venue
                    </span>
                  )}
                  <span className="absolute right-3 bottom-3 bg-[#061c2b]/80 px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.12em] text-[#d8ad61] uppercase backdrop-blur-sm">
                    {hotel.walkTime}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[0.62rem] tracking-[0.08em] text-white/55 uppercase">
                      {hotel.distance}
                    </p>
                    <p className="text-[0.62rem] tracking-[0.08em] text-[#d8ad61]/80 uppercase">
                      {hotel.area}
                    </p>
                  </div>
                  <h3 className="mt-2 font-logo text-xl font-semibold leading-snug">
                    {hotel.name}
                  </h3>
                  <p className="mt-1 text-xs italic text-[#d8ad61]/90">{hotel.vibe}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">
                    {hotel.highlight}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4 border-t border-white/10 pt-4">
                    <a
                      href={hotel.bookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[0.65rem] font-extrabold tracking-[0.14em] text-[#d8ad61] uppercase underline-offset-4 transition-colors hover:text-[#edca87] hover:underline"
                    >
                      Book / Details
                    </a>
                    <a
                      href={hotel.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[0.65rem] font-extrabold tracking-[0.14em] text-white/55 uppercase underline-offset-4 transition-colors hover:text-[#d8ad61] hover:underline"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 border border-white/10 bg-white/[0.04] px-5 py-6 text-center sm:px-8">
            <p className="text-sm leading-relaxed text-white/70">
              Looking for different dates, neighbourhoods, or price points?
            </p>
            <a
              href={exploreBarcelonaUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase underline-offset-4 transition-colors hover:text-[#edca87] hover:underline"
            >
              See more options on GetYourGuide →
            </a>
          </div>
        </div>
      </section>

      <section
        id="continue-at-sea"
        className="relative overflow-hidden bg-[#f7f3eb] px-5 py-14 text-[#0b2638] sm:px-8 sm:py-16 lg:px-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid grid-cols-3 opacity-40"
        >
          <div className="relative overflow-hidden">
            <Image
              src="/left.png"
              alt=""
              width={707}
              height={345}
              className="absolute top-0 left-0 h-[80%] w-auto max-w-full object-contain object-left object-top opacity-[0.35]"
            />
          </div>
          <div />
          <div className="relative overflow-hidden">
            <Image
              src="/right.png"
              alt=""
              width={722}
              height={346}
              className="absolute top-0 right-0 h-[80%] w-auto max-w-full object-contain object-right object-top opacity-[0.35]"
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1100px] items-center gap-8 border border-[#d8cfbf] bg-white px-6 py-8 shadow-[0_16px_48px_rgba(11,38,56,0.06)] sm:px-10 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[#c99b4e] uppercase">
              Optional · After 7 August
            </p>
            <h2 className="mt-3 font-logo text-[clamp(1.8rem,4vw,2.6rem)] font-medium tracking-[-0.02em]">
              {cruiseDetails.title}
            </h2>
            <p className="mt-2 font-script text-2xl text-[#c99b4e]/90 sm:text-3xl">
              aboard{" "}
              <span className="ml-1 inline-block font-logo text-[0.75em] font-semibold tracking-[0.04em] text-[#8a6a2e]">
                {cruiseDetails.ship}
              </span>
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#4a5d6a] sm:text-base">
              When the birthday evening ends, you&apos;re welcome to keep the
              celebration going — a 7-night Western Mediterranean sailing from
              Barcelona, {cruiseDetails.dateRangeShort}. Completely optional;
              book directly with MSC.
            </p>
            <p className="mt-3 text-xs tracking-[0.04em] text-[#6b7c88]">
              Barcelona → Cannes → Genoa → La Spezia → Rome → Palma → Barcelona
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-stretch">
            <div className="border border-[#ebe4d8] bg-[#faf8f4] px-5 py-4">
              <p className="text-[0.62rem] font-bold tracking-[0.16em] text-[#c99b4e] uppercase">
                Departs
              </p>
              <p className="mt-1 font-logo text-lg text-[#061c2b]">
                {cruiseDetails.startLabel}
              </p>
              <p className="mt-3 text-[0.62rem] font-bold tracking-[0.16em] text-[#c99b4e] uppercase">
                Returns
              </p>
              <p className="mt-1 font-logo text-lg text-[#061c2b]">
                {cruiseDetails.endLabel}
              </p>
            </div>
            <Link
              href="/cruise"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#061c2b] px-6 text-[0.67rem] font-extrabold tracking-[0.16em] text-white uppercase transition hover:bg-[#0a2a3f]"
            >
              Explore the cruise
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href={cruiseDetails.mscBookingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#061c2b]/20 px-6 text-[0.65rem] font-extrabold tracking-[0.14em] text-[#061c2b] uppercase transition hover:border-[#c99b4e] hover:text-[#c99b4e]"
            >
              Book with MSC
            </a>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f7f3eb] px-5 py-14 text-center text-[#0b2638] sm:px-8 sm:py-16">
        <div className="relative mx-auto max-w-2xl">
          <p className="font-script text-3xl text-[#c99b4e]">See you in Barcelona</p>
          <h2 className="mt-3 font-logo text-2xl font-medium sm:text-3xl">
            Ready to confirm your place?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#4a5d6a]">
            Save your spot for the cruise, dinner, or both — then choose your menu when you’re
            ready.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/rsvp"
              className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#d7ad62] px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-colors hover:bg-[#edca87]"
            >
              RSVP Now
            </Link>
            <Link
              href="/menu"
              className="inline-flex min-h-11 items-center justify-center border border-[#0b2638]/25 px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#0b2638] uppercase transition-colors hover:border-[#c99b4e] hover:text-[#c99b4e]"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
