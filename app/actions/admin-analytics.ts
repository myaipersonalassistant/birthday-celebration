"use server";

import { requireAdminUser } from "@/app/actions/admin-auth";
import { getMenuById } from "@/lib/menu-data";
import { createSupabaseAuthClient } from "@/lib/supabase/server";

export type AnalyticsBar = {
  id: string;
  label: string;
  count: number;
};

export type AnalyticsDay = {
  date: string;
  label: string;
  rsvps: number;
  menus: number;
  guestbook: number;
};

export type AdminAnalyticsData = {
  totals: {
    rsvps: number;
    headcount: number;
    dinner: number;
    cruise: number;
    plusOnes: number;
    menus: number;
    dietaryNotes: number;
    guestbook: number;
    galleryLive: number;
    galleryDrafts: number;
    galleryPhotos: number;
    galleryVideos: number;
  };
  countries: AnalyticsBar[];
  mains: AnalyticsBar[];
  desserts: AnalyticsBar[];
  timeline: AnalyticsDay[];
  /** Menu submissions ÷ RSVP submissions (not matched by person). */
  menuToRsvpRatio: number | null;
  warnings: string[];
};

const countryLabels: Record<string, string> = {
  spain: "Spain",
  nigeria: "Nigeria",
  uk: "United Kingdom",
  usa: "United States",
  other: "Other",
};

/** Local calendar YYYY-MM-DD (avoids UTC day-shift near midnight). */
function localDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayKeyFromTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }
  return localDayKey(date);
}

function dayLabel(isoDate: string) {
  try {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
    }).format(new Date(year, month - 1, day, 12));
  } catch {
    return isoDate;
  }
}

export async function getAdminAnalyticsData(): Promise<AdminAnalyticsData> {
  await requireAdminUser();
  const supabase = await createSupabaseAuthClient();
  const menu = getMenuById("premium");
  const mainItems = menu.courses.find((c) => c.id === "main")?.items ?? [];
  const dessertItems =
    menu.courses.find((c) => c.id === "dessert")?.items ?? [];

  const warnings: string[] = [];

  const [
    rsvpCountRes,
    menuCountRes,
    guestbookCountRes,
    galleryLiveRes,
    galleryDraftRes,
    galleryPhotoRes,
    galleryVideoRes,
    dietaryCountRes,
    rsvps,
    menus,
    guestbookRecent,
  ] = await Promise.all([
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
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("gallery_media")
      .select("id", { count: "exact", head: true })
      .eq("is_published", false),
    supabase
      .from("gallery_media")
      .select("id", { count: "exact", head: true })
      .eq("media_type", "image"),
    supabase
      .from("gallery_media")
      .select("id", { count: "exact", head: true })
      .eq("media_type", "video"),
    supabase
      .from("menu_submissions")
      .select("id", { count: "exact", head: true })
      .not("dietary_notes", "is", null)
      .neq("dietary_notes", ""),
    supabase
      .from("rsvp_submissions")
      .select(
        "country, attend_dinner, join_cruise, bringing_guest, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("menu_submissions")
      .select("selections, created_at")
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("guestbook_messages")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1000),
  ]);

  for (const result of [
    rsvpCountRes,
    menuCountRes,
    guestbookCountRes,
    galleryLiveRes,
    galleryDraftRes,
    galleryPhotoRes,
    galleryVideoRes,
    dietaryCountRes,
    rsvps,
    menus,
    guestbookRecent,
  ]) {
    if (result.error) {
      warnings.push(result.error.message);
    }
  }

  const rsvpTotal = rsvpCountRes.count ?? 0;
  const menuTotal = menuCountRes.count ?? 0;
  const guestbookTotal = guestbookCountRes.count ?? 0;

  const rsvpRows = rsvps.data ?? [];
  const menuRows = menus.data ?? [];
  const guestbookRows = guestbookRecent.data ?? [];

  if (rsvpTotal > rsvpRows.length) {
    warnings.push(
      `Dinner, cruise, plus-ones, countries, and the 14-day RSVP bars use the latest ${rsvpRows.length} of ${rsvpTotal} RSVPs.`,
    );
  }
  if (menuTotal > menuRows.length) {
    warnings.push(
      `Main/dessert bars use the latest ${menuRows.length} of ${menuTotal} menu submissions.`,
    );
  }

  let dinner = 0;
  let cruise = 0;
  let plusOnes = 0;
  let headcount = 0;
  const countryMap = new Map<string, number>();

  for (const row of rsvpRows) {
    headcount += 1 + (row.bringing_guest ? 1 : 0);
    if (row.attend_dinner) dinner += 1;
    if (row.join_cruise) cruise += 1;
    if (row.bringing_guest) plusOnes += 1;
    countryMap.set(row.country, (countryMap.get(row.country) ?? 0) + 1);
  }

  const mainCounts = new Map(mainItems.map((item) => [item.id, 0]));
  const dessertCounts = new Map(dessertItems.map((item) => [item.id, 0]));

  for (const row of menuRows) {
    const selections =
      row.selections && typeof row.selections === "object"
        ? (row.selections as {
            courses?: Record<string, { id?: string; name?: string }[]>;
          })
        : {};
    const mainId = selections.courses?.main?.[0]?.id;
    const dessertId = selections.courses?.dessert?.[0]?.id;
    if (mainId && mainCounts.has(mainId)) {
      mainCounts.set(mainId, (mainCounts.get(mainId) ?? 0) + 1);
    }
    if (dessertId && dessertCounts.has(dessertId)) {
      dessertCounts.set(dessertId, (dessertCounts.get(dessertId) ?? 0) + 1);
    }
  }

  const days: AnalyticsDay[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    d.setDate(d.getDate() - i);
    const key = localDayKey(d);
    days.push({
      date: key,
      label: dayLabel(key),
      rsvps: 0,
      menus: 0,
      guestbook: 0,
    });
  }
  const dayIndex = new Map(days.map((day, index) => [day.date, index]));

  for (const row of rsvpRows) {
    const index = dayIndex.get(dayKeyFromTimestamp(row.created_at));
    if (index != null) days[index].rsvps += 1;
  }
  for (const row of menuRows) {
    const index = dayIndex.get(dayKeyFromTimestamp(row.created_at));
    if (index != null) days[index].menus += 1;
  }
  for (const row of guestbookRows) {
    const index = dayIndex.get(dayKeyFromTimestamp(row.created_at));
    if (index != null) days[index].guestbook += 1;
  }

  const menuToRsvpRatio =
    rsvpTotal > 0 ? Math.round((menuTotal / rsvpTotal) * 100) : null;

  return {
    totals: {
      rsvps: rsvpTotal,
      headcount,
      dinner,
      cruise,
      plusOnes,
      menus: menuTotal,
      dietaryNotes: dietaryCountRes.count ?? 0,
      guestbook: guestbookTotal,
      galleryLive: galleryLiveRes.count ?? 0,
      galleryDrafts: galleryDraftRes.count ?? 0,
      galleryPhotos: galleryPhotoRes.count ?? 0,
      galleryVideos: galleryVideoRes.count ?? 0,
    },
    countries: [...countryMap.entries()]
      .map(([id, count]) => ({
        id,
        label: countryLabels[id] ?? id,
        count,
      }))
      .sort((a, b) => b.count - a.count),
    mains: mainItems.map((item) => ({
      id: item.id,
      label: item.name,
      count: mainCounts.get(item.id) ?? 0,
    })),
    desserts: dessertItems.map((item) => ({
      id: item.id,
      label: item.name,
      count: dessertCounts.get(item.id) ?? 0,
    })),
    timeline: days,
    menuToRsvpRatio,
    warnings: [...new Set(warnings)],
  };
}
