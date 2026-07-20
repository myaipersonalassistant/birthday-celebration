import Image from "next/image";
import Link from "next/link";

const moments = [
  {
    time: "1:00 PM",
    title: "Marina",
    detail: "Moll de Mestral, Port Olímpic — boarding & welcome",
  },
  {
    time: "2:00 PM",
    title: "Catamaran",
    detail: "Private one-hour cruise along the coast",
  },
  {
    time: "3:00 PM",
    title: "Free time",
    detail: "Hotel, city, or freshen up before dinner",
  },
  {
    time: "6:30 PM",
    title: "Evening",
    detail: "Purobeach · Hilton Diagonal Mar — elegant",
  },
];

function CurveRing({ position }: { position: "top" | "bottom" }) {
  const isTop = position === "top";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 60"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 z-20 h-12 w-full sm:h-14 ${
        isTop ? "top-0" : "bottom-0 scale-y-[-1]"
      }`}
    >
      <path
        d="M0 4 Q500 58 1000 4"
        fill="none"
        stroke="#d8ad61"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function DayPlanSection() {
  return (
    <section
      id="day-plan"
      aria-labelledby="day-plan-heading"
      className="relative z-20 overflow-hidden bg-[#061c2b] px-5 pt-12 pb-12 text-white sm:px-8 sm:pt-14 sm:pb-14 lg:px-12"
    >
      <CurveRing position="top" />
      <CurveRing position="bottom" />

      {/* 3 columns: left leaf | clear middle | right leaf */}
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

      <div className="relative z-10 mx-auto max-w-[1240px]">
        <div className="text-center">
          <p className="text-[0.65rem] font-bold tracking-[0.22em] text-[#d8ad61] uppercase sm:text-xs">
            Friday · 7 August 2026
          </p>
          <h2
            id="day-plan-heading"
            className="mt-1.5 font-logo text-xl font-semibold tracking-[0.14em] uppercase sm:text-2xl"
          >
            The Day Ahead
          </h2>
          <p className="mx-auto mt-1.5 max-w-xl font-script text-2xl text-[#d8ad61] sm:text-[1.75rem]">
            From harbour light to evening gold
          </p>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-white/70 sm:text-sm">
            Four clear beats — marina, cruise, free time, then Purobeach ·
            Hilton Diagonal Mar. Dress code for the evening: elegant.
          </p>
          <div className="mx-auto mt-3 h-px w-10 bg-[#d8ad61]" />
        </div>

        <ol className="relative mx-auto mt-6 max-w-md space-y-0 lg:hidden">
          <span
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-[1.15rem] w-px bg-[#d8ad61]/35"
          />
          {moments.map((moment, index) => (
            <li key={moment.time} className="relative flex gap-4 pb-4 last:pb-0">
              <span className="relative z-10 mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-[#d8ad61] bg-[#061c2b] text-[0.6rem] font-bold tracking-[0.08em] text-[#d8ad61]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-[0.6rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
                  {moment.time}
                </p>
                <p className="mt-0.5 font-logo text-lg tracking-[-0.02em]">
                  {moment.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/65">
                  {moment.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <ol className="relative mt-6 hidden lg:grid lg:grid-cols-4 lg:gap-0">
          <span
            aria-hidden="true"
            className="absolute top-4 right-[12.5%] left-[12.5%] h-px bg-[#d8ad61]/40"
          />
          {moments.map((moment, index) => (
            <li
              key={moment.time}
              className="relative flex flex-col items-center px-3 text-center"
            >
              <span className="relative z-10 grid size-8 place-items-center rounded-full border border-[#d8ad61] bg-[#061c2b] text-[0.6rem] font-bold tracking-[0.1em] text-[#d8ad61] shadow-[0_0_0_6px_rgba(6,28,43,1)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-[0.6rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
                {moment.time}
              </p>
              <p className="mt-1 font-logo text-lg tracking-[-0.02em]">
                {moment.title}
              </p>
              <p className="mt-1 max-w-[14rem] text-xs leading-relaxed text-white/65">
                {moment.detail}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-xs leading-relaxed text-white/55 sm:text-sm">
          Optional after the birthday: continue aboard{" "}
          <Link
            href="/cruise"
            className="font-semibold text-[#d8ad61] underline-offset-2 transition hover:text-[#edca87] hover:underline"
          >
            MSC Grandiosa · 8–15 August
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
