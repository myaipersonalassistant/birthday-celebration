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
    description: "Dinner choices",
  },
  {
    key: "guestbook" as const,
    label: "Guestbook",
    href: "/admin/guestbook",
    description: "Guest messages",
  },
];

const quickActions = [
  {
    href: "/admin/analytics",
    label: "View analytics",
    detail: "RSVPs, menu, guestbook trends",
  },
  {
    href: "/admin/visitors",
    label: "Guest ledger",
    detail: "All people across touchpoints",
  },
  {
    href: "/admin/studio",
    label: "Open studio",
    detail: "Add photos or videos",
  },
  {
    href: "/admin/rsvp",
    label: "Review RSVPs",
    detail: "Dinner, cruise, plus-ones",
  },
  {
    href: "/admin/menu",
    label: "Kitchen board",
    detail: "Mains, desserts, dietary",
  },
  {
    href: "/admin/guestbook",
    label: "Moderate guestbook",
    detail: "Read or remove notes",
  },
];

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/guestbook", label: "Guestbook" },
  { href: "/venue", label: "Venue" },
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
        A quick pulse on guests, dining, media, and what needs your attention.
      </p>

      {/* Celebration pulse */}
      <section className="mt-8 border border-[#061c2b] bg-[#061c2b] px-5 py-6 text-white sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
              Celebration pulse
            </p>
            <p className="mt-1 font-logo text-2xl sm:text-3xl">Guest plans</p>
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
            { label: "Cruise", value: data.rsvp.cruise },
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

      {/* Section counts */}
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

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Attention + activity */}
        <div className="space-y-6">
          <section className="border border-[#d8cfbf] bg-white p-5 sm:p-6">
            <p className="text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
              Needs attention
            </p>
            {attentionItems.length === 0 ? (
              <p className="mt-3 text-sm text-[#4a5d6a]">
                Nothing urgent — drafts published, dietary notes clear, RSVPs
                flowing in.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {attentionItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="block border border-[#d8ad61]/35 bg-[#fff8eb] px-4 py-3 transition hover:border-[#d8ad61]"
                    >
                      <p className="font-semibold text-[#061c2b]">{item.title}</p>
                      <p className="mt-0.5 text-sm text-[#5c4a28]">
                        {item.detail}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="border border-[#d8cfbf] bg-white p-5 sm:p-6">
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
            <p className="mt-1 text-xs text-[#8a7a5c]">
              Showing the latest 8 events
            </p>
            {data.activity.length === 0 ? (
              <p className="mt-3 text-sm text-[#4a5d6a]">
                Activity will appear here as guests RSVP, choose menus, sign the
                guestbook, or you upload media.
              </p>
            ) : (
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
            )}
          </section>
        </div>

        {/* Quick actions + public links */}
        <div className="space-y-6">
          <section className="border border-[#d8cfbf] bg-white p-5 sm:p-6">
            <p className="text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
              Quick actions
            </p>
            <ul className="mt-4 space-y-2">
              {quickActions.map((action) => (
                <li key={action.href}>
                  <Link
                    href={action.href}
                    className="flex items-center justify-between gap-3 border border-[#ebe4d8] px-4 py-3 transition hover:border-[#d8ad61] hover:bg-[#fbf8f2]"
                  >
                    <div>
                      <p className="font-medium text-[#061c2b]">{action.label}</p>
                      <p className="text-sm text-[#4a5d6a]">{action.detail}</p>
                    </div>
                    <span className="text-[#d8ad61]">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-[#d8cfbf] bg-white p-5 sm:p-6">
            <p className="text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
              Public pages
            </p>
            <p className="mt-2 text-sm text-[#4a5d6a]">
              Jump to the guest-facing site to preview what visitors see.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border border-[#061c2b]/15 px-3 py-2 text-[0.65rem] font-bold tracking-[0.1em] text-[#061c2b] uppercase transition hover:border-[#d8ad61] hover:text-[#d8ad61]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
