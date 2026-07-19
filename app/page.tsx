import Image from "next/image";
import { Countdown } from "@/components/Countdown";
import { AboutSection } from "@/components/AboutSection";
import { DayPlanSection } from "@/components/DayPlanSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { FindUsSection } from "@/components/FindUsSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QuickInfoSection } from "@/components/QuickInfoSection";
import { RsvpSection } from "@/components/RsvpSection";
import { VenueSection } from "@/components/VenueSection";

type IconProps = {
  className?: string;
};

function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-12a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
  );
}

function LocationIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function ClockIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 2" />
    </svg>
  );
}

function PlayIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8.4 6.2a1 1 0 0 1 1.52-.86l9.1 5.3a1 1 0 0 1 0 1.72l-9.1 5.3A1 1 0 0 1 8 16.8V7.2a1 1 0 0 1 .4-1Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="bg-[#061c2b]">
      <Header />

      <section id="hero" className="relative isolate overflow-hidden text-white">
        <Image
          src="/HeroBg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-center"
        />

        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(3,25,40,0.25)_0%,rgba(3,25,40,0.30)_43%,rgba(3,25,40,0.03)_72%,rgba(3,25,40,0.08)_100%)]" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(3,17,28,0.10),transparent_38%,rgba(3,19,31,0.30)_80%,rgba(6,28,43,0.65)_100%)]" />

        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 px-6 pt-28 pb-10 sm:px-10 lg:h-[650px] lg:min-h-0 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:pt-32 lg:pb-48 xl:px-16">
          <div className="z-10 flex items-center lg:translate-x-15 lg:translate-y-10">
            <div className="max-w-[650px] pb-4 lg:pb-6">
              <p className="font-logo text-lg leading-[1.12] font-semibold tracking-[0.18em] text-[#e3bd76] uppercase sm:text-2xl">
                Appreciation &amp;
                <span className="block">Birthday Celebration</span>
              </p>

              <h1 className="mt-2 font-logo text-[clamp(3.5rem,12vw,8.5rem)] leading-[0.7] font-medium tracking-[-0.035em] lg:text-[clamp(5rem,8.5vw,8.5rem)]">
                Angela
                <span className="mt-3 ml-[20%] block font-script text-[0.6em] leading-[0.85] font-normal tracking-normal text-[#d9ad61] sm:mt-4 sm:ml-[45%]">
                  Ifonlaja
                </span>
              </h1>

              <p className="mt-6 font-logo text-sm font-semibold tracking-[0.25em] text-white sm:mt-7 sm:text-lg">
                STRENGTH <span className="px-2 text-[#d9ad61]">●</span> DIGNITY{" "}
                <span className="px-2 text-[#d9ad61]">●</span> GRACE
              </p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-4 text-[0.68rem] font-semibold tracking-[0.05em] sm:mt-6 sm:text-xs">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="size-5 text-[#d9ad61]" />
                  <span>FRIDAY, 7 AUGUST 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon className="size-5 text-[#d9ad61]" />
                  <span>BARCELONA, SPAIN</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="size-5 text-[#d9ad61]" />
                  <span>1:00 PM</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-stretch gap-4 sm:mt-7 sm:flex-row sm:items-center">
                <a
                  href="/rsvp"
                  className="inline-flex min-h-13 items-center justify-center rounded-sm bg-[#d7ad62] px-8 text-[0.67rem] font-extrabold tracking-[0.18em] text-[#102536] shadow-lg transition-colors hover:bg-[#edca87]"
                >
                  RESERVE YOUR PLACE
                </a>
                <a
                  href="/invitation"
                  className="inline-flex min-h-13 items-center justify-center gap-3 px-4 text-[0.67rem] font-extrabold tracking-[0.14em] transition-colors hover:text-[#e4be77]"
                >
                  <span className="grid size-9 place-items-center rounded-full border border-white">
                    <PlayIcon className="size-3.5 translate-x-px" />
                  </span>
                  WATCH INVITATION
                </a>
              </div>
            </div>
          </div>

          <div className="relative z-[5] mt-1 flex justify-center pt-4 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-24 lg:right-[17%] lg:bottom-0 lg:left-auto lg:mt-0 lg:w-[58%] lg:items-end lg:justify-end lg:pt-0">
            <Image
              src="/angelabg.png"
              alt="Angela Ifonlaja"
              width={500}
              height={514}
              priority
              className="h-auto max-h-[58vh] w-auto max-w-[92vw] translate-y-6 -mb-10 object-contain object-top drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] lg:mb-0 lg:h-[86%] lg:max-h-none lg:max-w-none lg:translate-y-0 lg:object-bottom lg:-translate-y-8"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="countdown-heading"
        className="relative z-20 min-h-[140px] bg-[#061c2b] px-4 py-5 text-white shadow-[0_-16px_60px_rgba(2,14,24,0.45)] sm:min-h-[170px] sm:py-7"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 60"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 -top-14 z-10 h-14 w-full"
        >
          <path d="M0 4 Q500 58 1000 4 L1000 60 L0 60 Z" fill="#061c2b" />
          <path
            d="M0 4 Q500 58 1000 4"
            fill="none"
            stroke="#d8ad61"
            strokeWidth="2"
          />
        </svg>

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

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 sm:gap-5">
          <h2
            id="countdown-heading"
            className="font-script text-3xl leading-none text-white sm:text-4xl"
          >
            Countdown to Celebration
          </h2>
          <Countdown />
        </div>
      </section>

      <ExperienceSection />
      <VenueSection />
      <AboutSection />
      <DayPlanSection />
      <section
        aria-labelledby="rsvp-heading"
        className="grid lg:grid-cols-2 lg:items-stretch"
      >
        <RsvpSection />
        <QuickInfoSection />
      </section>
      <FindUsSection />
      <Footer />
    </main>
  );
}
