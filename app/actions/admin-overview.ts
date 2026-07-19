"use server";

import { requireAdminUser } from "@/app/actions/admin-auth";
import { createSupabaseAuthClient } from "@/lib/supabase/server";

export type OverviewActivity = {
  id: string;
  type: "rsvp" | "menu" | "guestbook" | "gallery";
  title: string;
  detail: string;
  href: string;
  createdAt: string;
};

export type AdminOverviewData = {
  counts: {
    rsvp: number;
    menu: number;
    guestbook: number;
    gallery: number;
    galleryLive: number;
    galleryDrafts: number;
  };
  rsvp: {
    dinner: number;
    cruise: number;
    plusOnes: number;
    headcount: number;
  };
  attention: {
    galleryDrafts: number;
    dietaryNotes: number;
    recentGuestbook: number;
  };
  activity: OverviewActivity[];
};

function timeLabel(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  await requireAdminUser();
  const supabase = await createSupabaseAuthClient();

  const [
    rsvpCount,
    menuCount,
    guestbookCount,
    galleryCount,
    galleryLiveCount,
    galleryDraftCount,
    dietaryCount,
    recentRsvps,
    recentMenus,
    recentGuestbook,
    recentGallery,
    rsvpRows,
  ] = await Promise.all([
    supabase.from("rsvp_submissions").select("id", { count: "exact", head: true }),
    supabase.from("menu_submissions").select("id", { count: "exact", head: true }),
    supabase
      .from("guestbook_messages")
      .select("id", { count: "exact", head: true }),
    supabase.from("gallery_media").select("id", { count: "exact", head: true }),
    supabase
      .from("gallery_media")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("gallery_media")
      .select("id", { count: "exact", head: true })
      .eq("is_published", false),
    supabase
      .from("menu_submissions")
      .select("id", { count: "exact", head: true })
      .not("dietary_notes", "is", null)
      .neq("dietary_notes", ""),
    supabase
      .from("rsvp_submissions")
      .select("id, first_name, last_name, attend_dinner, join_cruise, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("menu_submissions")
      .select("id, guest_name, dietary_notes, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("guestbook_messages")
      .select("id, author_name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("gallery_media")
      .select("id, title, media_type, is_published, created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("rsvp_submissions")
      .select("attend_dinner, join_cruise, bringing_guest"),
  ]);

  let dinner = 0;
  let cruise = 0;
  let plusOnes = 0;
  let headcount = 0;

  for (const row of rsvpRows.data ?? []) {
    headcount += 1 + (row.bringing_guest ? 1 : 0);
    if (row.attend_dinner) dinner += 1;
    if (row.join_cruise) cruise += 1;
    if (row.bringing_guest) plusOnes += 1;
  }

  const activity: OverviewActivity[] = [];

  for (const row of recentRsvps.data ?? []) {
    const plans = [
      row.attend_dinner ? "Dinner" : null,
      row.join_cruise ? "Cruise" : null,
    ]
      .filter(Boolean)
      .join(" · ");

    activity.push({
      id: `rsvp-${row.id}`,
      type: "rsvp",
      title: `${row.first_name} ${row.last_name}`,
      detail: `RSVP · ${plans || "Response"} · ${timeLabel(row.created_at)}`,
      href: "/admin/rsvp",
      createdAt: row.created_at,
    });
  }

  for (const row of recentMenus.data ?? []) {
    activity.push({
      id: `menu-${row.id}`,
      type: "menu",
      title: row.guest_name,
      detail: `Menu choice${
        row.dietary_notes?.trim() ? " · dietary note" : ""
      } · ${timeLabel(row.created_at)}`,
      href: "/admin/menu",
      createdAt: row.created_at,
    });
  }

  for (const row of recentGuestbook.data ?? []) {
    activity.push({
      id: `guestbook-${row.id}`,
      type: "guestbook",
      title: row.author_name,
      detail: `Guestbook · ${row.message.slice(0, 60)}${
        row.message.length > 60 ? "…" : ""
      }`,
      href: "/admin/guestbook",
      createdAt: row.created_at,
    });
  }

  for (const row of recentGallery.data ?? []) {
    activity.push({
      id: `gallery-${row.id}`,
      type: "gallery",
      title: row.title,
      detail: `Studio ${row.media_type} · ${
        row.is_published ? "Live" : "Draft"
      } · ${timeLabel(row.created_at)}`,
      href: "/admin/studio",
      createdAt: row.created_at,
    });
  }

  activity.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return {
    counts: {
      rsvp: rsvpCount.count ?? 0,
      menu: menuCount.count ?? 0,
      guestbook: guestbookCount.count ?? 0,
      gallery: galleryCount.count ?? 0,
      galleryLive: galleryLiveCount.count ?? 0,
      galleryDrafts: galleryDraftCount.count ?? 0,
    },
    rsvp: {
      dinner,
      cruise,
      plusOnes,
      headcount,
    },
    attention: {
      galleryDrafts: galleryDraftCount.count ?? 0,
      dietaryNotes: dietaryCount.count ?? 0,
      recentGuestbook: guestbookCount.count ?? 0,
    },
    activity: activity.slice(0, 8),
  };
}
