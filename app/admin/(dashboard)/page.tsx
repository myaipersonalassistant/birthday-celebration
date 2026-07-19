import Link from "next/link";
import { getAdminOverviewData } from "@/app/actions/admin-overview";

const sectionCards = [
  {
    key: "gallery" as const,
    label: "Studio",
    href: "/admin/studio",
    description: "Photos and videos",
  },
  {
    key: "rsvp" as const,
    label: "RSVPs",
    href: "/admin/rsvp",
    description: "Guest responses",
  },
  {
    key: "menu" as const,
    label: "Menu",
    href: "/admin/menu",
    description: "Evening dinner picks",
  },
  {
    key: "guestbook" as const,
    label: "Guestbook",
    href: "/admin/guestbook",
    description: "Guest messages",
  },
];

const typeLabel: Record<string, string> = {
  rsvp: "RSVP",
  menu: "Menu",
  guestbook: "Guestbook",
  gallery: "Studio",
};

export default async function AdminOverviewPage() {
  const data = await getAdminOverviewData();

  const attentionItems = [
    data.attention.galleryDrafts > 0
      ? {
          href: "/admin/studio",
          title: `${data.attention.galleryDrafts} studio draft${
            data.attention.galleryDrafts === 1 ? "" : "s"
          }`,
          detail: "Publish when ready for guests to see.",
        }
      : null,
    data.attention.dietaryNotes > 0
      ? {
          href: "/admin/menu",
          title: `${data.attention.dietaryNotes} dietary note${
            data.attention.dietaryNotes === 1 ? "" : "s"
          }`,
          detail: "Review kitchen alerts on the menu board.",
        }
      : null,
    data.counts.rsvp === 0
      ? {
          href: "/admin/rsvp",
          title: "No RSVPs yet",
          detail: "Share the invitation when you’re ready for replies.",
        }
      : null,
  ].filter(Boolean) as { href: string; title: string; detail: string }[];

  return (
    <div className="mx-auto max-w-5xl animate-[fadeIn_0.45s_ease-out]">
      <p className="text-xs font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
        Dashboard
      </p>
      <h1 className="mt-2 font-logo text-4xl text-[#061c2b] sm:text-5xl">
        Overview
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#4a5d6a] sm:text-base">
        A quick pulse on guests, Purobeach · Hilton dinner &amp; catamaran plans,
        media, and what needs your attention.
      </p>

      <section className="mt-8 border border-[#061c2b] bg-[#061c2b] px-5 py-6 text-white sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
              Celebration pulse
            </p>
            <p className="mt-1 font-logo text-2xl sm:text-3xl">Guest plans</p>
            <p className="mt-1 text-xs text-white/45">
              Dinner · Purobeach · Hilton from 6:30 · Cruise · marina by 1:00
            </p>
          </div>
          <Link
            href="/admin/rsvp"
            className="text-[0.65rem] font-bold tracking-[0.12em] text-white/60 uppercase transition hover:text-[#d8ad61]"
          >
            Open RSVPs →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Headcount", value: data.rsvp.headcount },
            { label: "Dinner", value: data.rsvp.dinner },
            { label: "Catamaran", value: data.rsvp.cruise },
            { label: "Plus-ones", value: data.rsvp.plusOnes },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-white/10 bg-white/[0.04] px-3 py-3"
            >
              <p className="text-[0.58rem] font-bold tracking-[0.14em] text-white/40 uppercase">
                {stat.label}
              </p>
              <p className="mt-1 font-logo text-3xl tabular-nums text-[#d8ad61]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sectionCards.map((card) => {
          const count = data.counts[card.key];
          const extra =
            card.key === "gallery"
              ? `${data.counts.galleryLive} live · ${data.counts.galleryDrafts} draft`
              : card.key === "rsvp"
                ? `${data.rsvp.headcount} including plus-ones`
                : null;

          return (
            <Link
              key={card.key}
              href={card.href}
              className="group border border-[#d8cfbf] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#d8ad61]/70 hover:shadow-[0_16px_40px_rgba(11,38,56,0.08)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
                    {card.label}
                  </p>
                  <p className="mt-2 font-logo text-4xl text-[#061c2b]">
                    {count}
                  </p>
                  <p className="mt-1 text-sm text-[#4a5d6a]">
                    {extra ?? card.description}
                  </p>
                </div>
                <span className="text-[#d8ad61] transition group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col border border-[#d8cfbf] bg-white p-5 sm:p-6">
          <p className="text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
            Needs attention
          </p>
          {attentionItems.length === 0 ? (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center border border-dashed border-[#d8ad61]/45 bg-[linear-gradient(180deg,#fffbf3_0%,#fbf8f2_100%)] px-5 py-10 text-center">
              <span className="grid size-12 place-items-center rounded-full border border-[#d8ad61]/50 bg-white text-[#c99b4e] shadow-[0_8px_24px_rgba(201,155,78,0.12)]">
                <svg
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 13 4 4L19 7"
                  />
                </svg>
              </span>
              <p className="mt-4 font-logo text-xl text-[#061c2b]">All clear</p>
              <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-[#4a5d6a]">
                No drafts waiting, no dietary alerts, and RSVPs are in motion.
              </p>
              <p className="mt-4 text-[0.6rem] font-bold tracking-[0.16em] text-[#c99b4e] uppercase">
                You’re caught up
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {attentionItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="block border border-[#d8ad61]/35 bg-[#fff8eb] px-4 py-3 transition hover:border-[#d8ad61]"
                  >
                    <p className="font-semibold text-[#061c2b]">{item.title}</p>
                    <p className="mt-0.5 text-sm text-[#5c4a28]">{item.detail}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col border border-[#d8cfbf] bg-white p-5 sm:p-6">
          <div className="flex items-end justify-between gap-3">
            <p className="text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
              Recent activity
            </p>
            <Link
              href="/admin/visitors"
              className="text-[0.65rem] font-bold tracking-[0.1em] text-[#061c2b]/55 uppercase transition hover:text-[#d8ad61]"
            >
              All people →
            </Link>
          </div>
          {data.activity.length === 0 ? (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center border border-dashed border-[#d8cfbf] bg-[#fbf8f2] px-5 py-10 text-center">
              <span className="grid size-12 place-items-center rounded-full border border-[#061c2b]/12 bg-white text-[#061c2b]/45">
                <svg
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l3.5 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              <p className="mt-4 font-logo text-xl text-[#061c2b]">
                Waiting for the first ripple
              </p>
              <p className="mx-auto mt-2 max-w-[18rem] text-sm leading-relaxed text-[#4a5d6a]">
                RSVPs, menu choices, guestbook notes, and studio uploads will
                show up here as they happen.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["RSVP", "Menu", "Guestbook", "Studio"].map((label) => (
                  <span
                    key={label}
                    className="border border-[#061c2b]/10 bg-white px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.12em] text-[#8a7a5c] uppercase"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="mt-1 text-xs text-[#8a7a5c]">
                Showing the latest 8 events
              </p>
              <ul className="mt-4 divide-y divide-[#ebe4d8]">
                {data.activity.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={entry.href}
                      className="flex items-start justify-between gap-3 py-3 transition hover:bg-[#fbf8f2]"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#061c2b]">
                          {entry.title}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-[#4a5d6a]">
                          {entry.detail}
                        </p>
                      </div>
                      <span className="shrink-0 text-[0.6rem] font-bold tracking-[0.1em] text-[#d8ad61] uppercase">
                        {typeLabel[entry.type]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
