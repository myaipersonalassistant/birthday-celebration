import Image from "next/image";
import Link from "next/link";
import { arrivalNotes, nearbyHotels, venueDetails } from "@/lib/venue-data";

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
          alt="Purobeach Barcelona at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(6,28,43,0.92)_0%,rgba(6,28,43,0.72)_42%,rgba(6,28,43,0.35)_70%,rgba(6,28,43,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(216,173,97,0.18),transparent_40%)]" />

        <div className="relative mx-auto flex min-h-[72vh] w-full max-w-[1240px] flex-col justify-end px-5 pb-14 pt-32 sm:px-8 sm:pb-16 lg:px-12">
          <p className="animate-[menuItemRise_0.7s_ease-out_both] text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
            Celebration Destination
          </p>
          <h1 className="mt-3 max-w-3xl animate-[menuItemRise_0.75s_ease-out_0.08s_both] font-logo text-[clamp(2.6rem,7vw,5rem)] leading-[0.95] font-medium tracking-[-0.03em]">
            {venueDetails.name}
          </h1>
          <p className="mt-3 animate-[menuItemRise_0.75s_ease-out_0.14s_both] font-script text-3xl text-[#d8ad61] sm:text-4xl">
            where the evening begins
          </p>
          <p className="mt-5 max-w-xl animate-[menuItemRise_0.75s_ease-out_0.2s_both] text-sm leading-relaxed text-white/80 sm:text-base">
            A Mediterranean beach club at {venueDetails.host} — sand, skyline, and golden hour
            for Angela’s birthday in Barcelona.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 animate-[menuItemRise_0.75s_ease-out_0.28s_both]">
            <a
              href={venueDetails.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#d7ad62] px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-colors hover:bg-[#edca87]"
            >
              Get Directions
            </a>
            <a
              href="#stay-nearby"
              className="inline-flex min-h-11 items-center justify-center border border-white/30 px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-white uppercase transition-colors hover:border-[#d8ad61] hover:text-[#d8ad61]"
            >
              Stay Nearby
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3eb] px-5 py-14 text-[#0b2638] sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto grid max-w-[1240px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="font-script text-2xl text-[#c99b4e]">The Setting</p>
            <h2 className="mt-2 font-logo text-[clamp(1.9rem,4vw,3rem)] font-medium tracking-[-0.02em]">
              Hilton Diagonal Mar
            </h2>
            <WaveDivider />
            <p className="mt-6 text-sm leading-relaxed text-[#4a5d6a] sm:text-base">
              Purobeach unfolds along Barcelona’s eastern shoreline — open terraces, sea air, and
              that soft coastal light that turns evenings golden. The celebration gathers here on{" "}
              {venueDetails.dateLabel}, from {venueDetails.timeLabel}.
            </p>

            <div className="mt-8 flex items-start gap-3 border-l-2 border-[#d8ad61] pl-4">
              <LocationPin className="mt-0.5 size-6 shrink-0 text-[#c99b4e]" />
              <div>
                <p className="font-logo text-lg font-semibold">{venueDetails.host}</p>
                {venueDetails.addressLines.map((line) => (
                  <p key={line} className="text-sm text-[#4a5d6a]">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-3 -left-3 h-16 w-16 border-t border-l border-[#d8ad61]/70" />
            <div className="absolute -right-3 -bottom-3 h-16 w-16 border-r border-b border-[#d8ad61]/70" />
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/next2.png"
                alt="Purobeach Barcelona terrace"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#061c2b] px-5 py-14 text-white sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-[#d8ad61] uppercase">
              Getting There
            </p>
            <h2 className="mt-3 font-logo text-[clamp(1.8rem,4vw,2.8rem)] font-medium">
              Arrive with ease
            </h2>
            <div className="mx-auto mt-4 h-px w-12 bg-[#d8ad61]" />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {arrivalNotes.map((note, index) => (
              <article
                key={note.title}
                className="border border-white/10 bg-white/5 px-5 py-6 transition-colors duration-300 hover:border-[#d8ad61]/45 hover:bg-white/[0.07]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <p className="font-display text-[0.65rem] tracking-[0.18em] text-[#d8ad61] uppercase">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-logo text-xl font-semibold">{note.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{note.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 overflow-hidden border border-white/10">
            <div className="relative min-h-[260px] sm:min-h-[340px]">
              <iframe
                title="Map to Purobeach Barcelona"
                src={venueDetails.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="stay-nearby"
        className="bg-[#f7f3eb] px-5 py-14 text-[#0b2638] sm:px-8 sm:py-16 lg:px-12"
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-2xl">
            <p className="font-script text-2xl text-[#c99b4e]">Where to Stay</p>
            <h2 className="mt-2 font-logo text-[clamp(1.9rem,4vw,3rem)] font-medium tracking-[-0.02em]">
              Hotels very close to the venue
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4a5d6a] sm:text-base">
              Six nearby stays within a short walk — or a quick taxi — of Purobeach and Hilton
              Diagonal Mar. Book early for August.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {nearbyHotels.map((hotel) => (
              <article
                key={hotel.id}
                className="group flex flex-col overflow-hidden border border-[#d8cfbf] bg-white shadow-[0_12px_30px_rgba(11,38,56,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d8ad61]/70 hover:shadow-[0_18px_40px_rgba(11,38,56,0.1)]"
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
                      Closest
                    </span>
                  )}
                  <span className="absolute right-3 bottom-3 bg-[#061c2b]/80 px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.12em] text-[#d8ad61] uppercase backdrop-blur-sm">
                    {hotel.walkTime}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[0.62rem] tracking-[0.08em] text-[#4a5d6a] uppercase">
                      {hotel.distance}
                    </p>
                    <p className="text-[0.62rem] tracking-[0.08em] text-[#8a7348] uppercase">
                      {hotel.area}
                    </p>
                  </div>
                  <h3 className="mt-2 font-logo text-xl font-semibold leading-snug">
                    {hotel.name}
                  </h3>
                  <p className="mt-1 text-xs italic text-[#8a7348]">{hotel.vibe}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#4a5d6a]">
                    {hotel.highlight}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4 border-t border-[#e8e0d2] pt-4">
                    <a
                      href={hotel.bookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[0.65rem] font-extrabold tracking-[0.14em] text-[#061c2b] uppercase underline-offset-4 transition-colors hover:text-[#c99b4e] hover:underline"
                    >
                      Book / Details
                    </a>
                    <a
                      href={hotel.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[0.65rem] font-extrabold tracking-[0.14em] text-[#061c2b]/55 uppercase underline-offset-4 transition-colors hover:text-[#c99b4e] hover:underline"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#061c2b] px-5 py-14 text-center text-white sm:px-8 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(216,173,97,0.16),transparent_45%)]" />
        <div className="relative mx-auto max-w-2xl">
          <p className="font-script text-3xl text-[#d8ad61]">See you by the sea</p>
          <h2 className="mt-3 font-logo text-2xl font-medium sm:text-3xl">
            Ready for the evening?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Choose your dinner, save your spot, and we’ll take care of the rest under the Barcelona
            sky.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/menu"
              className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#d7ad62] px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-colors hover:bg-[#edca87]"
            >
              View Menu
            </Link>
            <Link
              href="/rsvp"
              className="inline-flex min-h-11 items-center justify-center border border-white/30 px-7 text-[0.68rem] font-extrabold tracking-[0.16em] text-white uppercase transition-colors hover:border-[#d8ad61] hover:text-[#d8ad61]"
            >
              RSVP Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
