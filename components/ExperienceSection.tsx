import Image from "next/image";

type ExperienceIconProps = {
  name: "cruise" | "dinner" | "birthday" | "memories";
};

function ExperienceIcon({ name }: ExperienceIconProps) {
  const sharedProps = {
    "aria-hidden": true,
    className: "size-11 text-[#c99b4e]",
    fill: "none",
    viewBox: "0 0 48 48",
    stroke: "currentColor",
    strokeWidth: 1.6,
  };

  if (name === "cruise") {
    return (
      <svg {...sharedProps}>
        <path
          fill="currentColor"
          stroke="none"
          d="M23 6.5h1.5v25H23zM21.5 10 9 29h12.5V10ZM26 12v17h12L26 12ZM8 32h32l-4.2 6H14L8 32Z"
        />
        <path
          strokeLinecap="round"
          d="M6 40c4.5 0 4.5 2 9 2s4.5-2 9-2 4.5 2 9 2 4.5-2 9-2"
        />
      </svg>
    );
  }

  if (name === "dinner") {
    return (
      <svg {...sharedProps}>
        <path
          fill="currentColor"
          stroke="none"
          d="M10 6h2v11h2V6h2v11h2V6h2v11c0 4-2 6.4-4 7.4V42h-4V24.4c-2-1-4-3.4-4-7.4V6ZM31.5 6C27.4 6 25 10.2 25 15.2c0 4.1 1.7 7.6 4.5 8.8v18h4V24c2.8-1.2 4.5-4.7 4.5-8.8C38 10.2 35.6 6 31.5 6Z"
        />
      </svg>
    );
  }

  if (name === "birthday") {
    return (
      <svg {...sharedProps}>
        <path
          fill="currentColor"
          stroke="none"
          d="M18 8h2v7h-2zM23 6h2v9h-2zM28 8h2v7h-2zM17 17h14v6H17zM13 25h22v7H13zM8 34h32v8H8z"
        />
        <path
          fill="currentColor"
          stroke="none"
          d="M19 8c-2-1.6-.8-4 0-4s2 2.4 0 4ZM24 6c-2-1.6-.8-4 0-4s2 2.4 0 4ZM29 8c-2-1.6-.8-4 0-4s2 2.4 0 4Z"
        />
        <path
          stroke="#f7f3eb"
          strokeWidth="1.3"
          d="M17 20c2 0 2 1.5 4 1.5s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 2-1.5M13 28c2.8 0 2.8 1.8 5.5 1.8S21.3 28 24 28s2.8 1.8 5.5 1.8S32.3 28 35 28M8 37c4 0 4 2 8 2s4-2 8-2 4 2 8 2 4-2 8-2"
        />
      </svg>
    );
  }

  return (
    <svg {...sharedProps}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(18 16 22)">
          <path d="M9 7h14l-1.5 13c-.5 4.4-3 6.7-5.5 6.7s-5-2.3-5.5-6.7L9 7Z" />
          <path d="M16 27v13M10.5 40h11" />
          <path fill="currentColor" stroke="none" d="M11 14h10l-.7 6c-.4 3.1-2 4.7-4.3 4.7s-4-1.6-4.3-4.7L11 14Z" />
        </g>
        <g transform="rotate(-18 32 22)">
          <path d="M25 7h14l-1.5 13c-.5 4.4-3 6.7-5.5 6.7s-5-2.3-5.5-6.7L25 7Z" />
          <path d="M32 27v13M26.5 40h11" />
          <path fill="currentColor" stroke="none" d="M27 14h10l-.7 6c-.4 3.1-2 4.7-4.3 4.7s-4-1.6-4.3-4.7L27 14Z" />
        </g>
        <path d="m21 12 6 3" />
        <circle cx="23" cy="6" r="1" fill="currentColor" stroke="none" />
        <circle cx="28" cy="3.5" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="33" cy="6" r=".8" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

const experiences = [
  {
    icon: "cruise" as const,
    title: "Mediterranean Cruise",
    image: "/1.png",
    alt: "Luxury catamaran sailing along the Barcelona coast",
  },
  {
    icon: "dinner" as const,
    title: "Dinner Under the Stars",
    image: "/2.png",
    alt: "Candlelit seaside dinner under palm trees",
  },
  {
    icon: "birthday" as const,
    title: "Birthday Celebration",
    image: "/3.png",
    alt: "Elegant birthday cake surrounded by candles",
  },
  {
    icon: "memories" as const,
    title: "Memories Together",
    image: "/4.png",
    alt: "Friends raising champagne glasses in celebration",
  },
];

export function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative overflow-hidden bg-[#f7f3eb] px-5 py-16 text-[#0b2638] sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[#d8ad61]/35" />
      <div className="mx-auto max-w-[1240px]">
        <h2
          id="experience-heading"
          className="text-center font-logo text-2xl font-semibold tracking-[0.14em] uppercase sm:text-3xl"
        >
          The Experience
        </h2>
        <div className="mx-auto mt-4 h-px w-12 bg-[#c99b4e]" />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((experience) => (
            <article
              key={experience.title}
              className="overflow-hidden border border-[#d8cfbf] bg-white shadow-[0_12px_35px_rgba(17,38,52,0.08)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex min-h-40 flex-col items-center justify-center px-5 py-6 text-center">
                <ExperienceIcon name={experience.icon} />
                <h3 className="mt-3 max-w-48 font-logo text-lg leading-[1.05] font-semibold tracking-[0.04em] uppercase sm:text-xl">
                  {experience.title}
                </h3>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={experience.image}
                  alt={experience.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
