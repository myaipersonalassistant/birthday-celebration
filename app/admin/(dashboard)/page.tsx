import Link from "next/link";
import { createSupabaseAuthClient } from "@/lib/supabase/server";

async function getOverviewCounts() {
  const supabase = await createSupabaseAuthClient();

  const [rsvp, menu, guestbook, gallery] = await Promise.all([
    supabase
      .from("rsvp_submissions")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("menu_submissions")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("guestbook_messages")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("gallery_media")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    rsvp: rsvp.count ?? 0,
    menu: menu.count ?? 0,
    guestbook: guestbook.count ?? 0,
    gallery: gallery.count ?? 0,
  };
}

const cards = [
  {
    key: "gallery" as const,
    label: "Gallery media",
    href: "/admin/gallery",
    description: "Photos and videos from the celebration",
  },
  {
    key: "rsvp" as const,
    label: "RSVPs",
    href: "/admin/rsvp",
    description: "Guest responses and attendance",
  },
  {
    key: "menu" as const,
    label: "Menu choices",
    href: "/admin/menu",
    description: "Dinner selections from guests",
  },
  {
    key: "guestbook" as const,
    label: "Guestbook",
    href: "/admin/guestbook",
    description: "Messages left for Angela",
  },
];

export default async function AdminOverviewPage() {
  const counts = await getOverviewCounts();

  return (
    <div className="mx-auto max-w-5xl animate-[fadeIn_0.45s_ease-out]">
      <p className="text-xs font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
        Dashboard
      </p>
      <h1 className="mt-2 font-logo text-4xl text-[#061c2b] sm:text-5xl">
        Overview
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#4a5d6a] sm:text-base">
        Manage celebration content and guest responses from one place.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group border border-[#d8cfbf] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#d8ad61]/70 hover:shadow-[0_16px_40px_rgba(11,38,56,0.08)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
                  {card.label}
                </p>
                <p className="mt-3 font-logo text-4xl text-[#061c2b]">
                  {counts[card.key]}
                </p>
                <p className="mt-2 text-sm text-[#4a5d6a]">{card.description}</p>
              </div>
              <span className="text-[#d8ad61] transition group-hover:translate-x-0.5">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
