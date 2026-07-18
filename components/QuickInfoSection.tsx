type InfoIconName =
  | "travel"
  | "hotels"
  | "directions"
  | "weather"
  | "things"
  | "guestbook";

function InfoIcon({ name }: { name: InfoIconName }) {
  const shared = {
    "aria-hidden": true as const,
    className: "size-10 text-[#0b2638]",
    viewBox: "0 0 48 48",
    fill: "currentColor",
  };

  if (name === "travel") {
    return (
      <svg {...shared}>
        <path d="M40.8 14.6 27.5 21.2l-7.2-12.8-4.1 2.3 4.9 12.1-10.4 5.2-3.6-3.8-2.8 1.6 6.4 5.5H6.2l2.1 3.9h12.8l7.1 6.2 2.6-2-4.2-5.5 10.5-5.3 3.4 8.1 4.1-1.7-1.3-9.2 9.4-4.7-2.1-1.1z" />
      </svg>
    );
  }

  if (name === "hotels") {
    return (
      <svg {...shared}>
        <path d="M8 36V22c0-1.7 1.3-3 3-3h5V16c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v3h5c1.7 0 3 1.3 3 3v14h-4v-3H12v3H8Zm7-14h18v-6c0-1.1-.9-2-2-2H17c-1.1 0-2 .9-2 2v6Zm-3 8h24v-8H12v8Z" />
        <path d="M17.5 17.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm13 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Z" />
      </svg>
    );
  }

  if (name === "directions") {
    return (
      <svg {...shared}>
        <path d="M8.5 11h11.2l2.4 5H39.5v21H8.5V11Zm3.5 3.5v18h24v-13H20.4l-2.4-5H12Zm5.5 0 1.7 3.5h3.5L21 14.5h-3.5Z" />
        <path d="M24 21.5c-2.6 0-4.7 2-4.7 4.5 0 3.2 4.7 7.8 4.7 7.8s4.7-4.6 4.7-7.8c0-2.5-2.1-4.5-4.7-4.5Zm0 6.3a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6Z" />
      </svg>
    );
  }

  if (name === "weather") {
    return (
      <svg {...shared}>
        <circle cx="24" cy="24" r="8" />
        <rect x="22.2" y="7" width="3.6" height="6" rx="1.2" />
        <rect x="22.2" y="35" width="3.6" height="6" rx="1.2" />
        <rect x="7" y="22.2" width="6" height="3.6" rx="1.2" />
        <rect x="35" y="22.2" width="6" height="3.6" rx="1.2" />
        <rect x="11.2" y="11.2" width="3.6" height="6" rx="1.2" transform="rotate(-45 13 14.2)" />
        <rect x="33.2" y="33.2" width="3.6" height="6" rx="1.2" transform="rotate(-45 35 36.2)" />
        <rect x="33.2" y="11.2" width="3.6" height="6" rx="1.2" transform="rotate(45 35 14.2)" />
        <rect x="11.2" y="33.2" width="3.6" height="6" rx="1.2" transform="rotate(45 13 36.2)" />
      </svg>
    );
  }

  if (name === "things") {
    return (
      <svg {...shared}>
        <path d="M15.5 12h3.4l1.8-3h6.6l1.8 3H33c2.2 0 4 1.8 4 4v18c0 2.2-1.8 4-4 4H15.5c-2.2 0-4-1.8-4-4V16c0-2.2 1.8-4 4-4Zm8.5 21.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0-3.2a3.8 3.8 0 1 1 0-7.6 3.8 3.8 0 0 1 0 7.6ZM33 18.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z" />
      </svg>
    );
  }

  return (
    <svg {...shared} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
      <rect x="9" y="18" width="30" height="19" rx="1.5" />
      <path d="m9 18 15 12 15-12" />
      <path
        fill="currentColor"
        stroke="none"
        d="M24 16.5c-2.8-2.8.3-6.8 2.8-4.8 1.2.9 1.6 2 1.6 2s.4-1.1 1.6-2c2.5-2 5.6 2 2.8 4.8L24 24l-6.8-7.5Z"
      />
    </svg>
  );
}

const infoCards = [
  {
    icon: "travel" as const,
    title: "Travel Information",
    description: "Everything you need to plan your trip.",
    href: "#travel",
  },
  {
    icon: "hotels" as const,
    title: "Hotels",
    description: "Recommended hotels near the venue.",
    href: "#travel",
  },
  {
    icon: "directions" as const,
    title: "Directions",
    description: "How to get to Purobeach Barcelona.",
    href: "#venue",
  },
  {
    icon: "weather" as const,
    title: "Weather",
    description: "August in Barcelona is beautiful!",
    href: "#travel",
  },
  {
    icon: "things" as const,
    title: "Things to Do",
    description: "Explore the best of Barcelona.",
    href: "#travel",
  },
  {
    icon: "guestbook" as const,
    title: "Guestbook",
    description: "Leave a birthday message for Angela.",
    href: "/guestbook",
  },
];

export function QuickInfoSection() {
  return (
    <div
      id="travel"
      className="flex h-full flex-col justify-center bg-[#f7f3eb] px-5 py-10 text-[#0b2638] sm:px-8 lg:px-8 xl:px-10"
    >
      <h2
        id="quick-info-heading"
        className="text-center font-logo text-xl font-semibold tracking-[0.14em] uppercase sm:text-2xl"
      >
        Quick Information
      </h2>
      <div className="mx-auto mt-3 h-px w-12 bg-[#c99b4e]" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {infoCards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            className="flex min-h-36 flex-col items-center justify-center rounded-md border border-[#e4ddd0] bg-white px-4 py-6 text-center shadow-[0_10px_30px_rgba(11,38,56,0.06)] transition-transform duration-300 hover:-translate-y-1"
          >
            <InfoIcon name={card.icon} />
            <h3 className="mt-3 font-logo text-base font-semibold tracking-[0.06em] uppercase">
              {card.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#4a5d6a] sm:text-sm">
              {card.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
