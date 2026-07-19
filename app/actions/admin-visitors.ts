"use server";

import { requireAdminUser } from "@/app/actions/admin-auth";
import { createSupabaseAuthClient } from "@/lib/supabase/server";

export type VisitorSource = "rsvp" | "menu" | "guestbook";

export type AdminVisitor = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  country: string | null;
  location: string | null;
  sources: VisitorSource[];
  attendDinner: boolean | null;
  joinCruise: boolean | null;
  bringingGuest: boolean | null;
  guestName: string | null;
  dietaryNotes: string | null;
  menuMain: string | null;
  menuDessert: string | null;
  guestbookMessage: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
};

const countryLabels: Record<string, string> = {
  spain: "Spain",
  nigeria: "Nigeria",
  uk: "United Kingdom",
  usa: "United States",
  other: "Other",
};

function countryLabel(value: string | null) {
  if (!value) return null;
  return countryLabels[value] ?? value;
}

function normalizeEmail(email: string | null | undefined) {
  const value = email?.trim().toLowerCase();
  return value || null;
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

function mergeVisitor(
  current: AdminVisitor | undefined,
  next: Omit<AdminVisitor, "sources"> & { source: VisitorSource },
): AdminVisitor {
  if (!current) {
    return {
      ...next,
      sources: [next.source],
    };
  }

  const sources = current.sources.includes(next.source)
    ? current.sources
    : [...current.sources, next.source];

  const firstSeenAt =
    new Date(next.firstSeenAt).getTime() < new Date(current.firstSeenAt).getTime()
      ? next.firstSeenAt
      : current.firstSeenAt;
  const lastSeenAt =
    new Date(next.lastSeenAt).getTime() > new Date(current.lastSeenAt).getTime()
      ? next.lastSeenAt
      : current.lastSeenAt;

  return {
    id: current.id,
    name: current.name || next.name,
    email: current.email || next.email,
    phone: current.phone || next.phone,
    country: current.country || next.country,
    location: current.location || next.location,
    sources,
    attendDinner: next.attendDinner ?? current.attendDinner,
    joinCruise: next.joinCruise ?? current.joinCruise,
    bringingGuest: next.bringingGuest ?? current.bringingGuest,
    guestName: next.guestName || current.guestName,
    dietaryNotes: next.dietaryNotes || current.dietaryNotes,
    menuMain: next.menuMain || current.menuMain,
    menuDessert: next.menuDessert || current.menuDessert,
    guestbookMessage: next.guestbookMessage || current.guestbookMessage,
    firstSeenAt,
    lastSeenAt,
  };
}

export async function getAdminVisitors(): Promise<AdminVisitor[]> {
  await requireAdminUser();
  const supabase = await createSupabaseAuthClient();

  const [rsvps, menus, guestbook] = await Promise.all([
    supabase
      .from("rsvp_submissions")
      .select(
        "id, first_name, last_name, email, phone, country, attend_dinner, join_cruise, bringing_guest, guest_name, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("menu_submissions")
      .select("id, guest_name, email, dietary_notes, selections, created_at")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("guestbook_messages")
      .select("id, author_name, location, message, created_at")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const byKey = new Map<string, AdminVisitor>();

  for (const row of rsvps.data ?? []) {
    const email = normalizeEmail(row.email);
    const name = normalizeName(`${row.first_name} ${row.last_name}`);
    const key = email ? `email:${email}` : `rsvp:${row.id}`;
    const country = countryLabel(row.country);
    const existing = byKey.get(key);

    byKey.set(
      key,
      mergeVisitor(existing, {
        id: key,
        name,
        email,
        phone: row.phone,
        country,
        location: country,
        source: "rsvp",
        attendDinner: row.attend_dinner,
        joinCruise: row.join_cruise,
        bringingGuest: row.bringing_guest,
        guestName: row.guest_name,
        dietaryNotes: null,
        menuMain: null,
        menuDessert: null,
        guestbookMessage: null,
        firstSeenAt: row.created_at,
        lastSeenAt: row.created_at,
      }),
    );
  }

  for (const row of menus.data ?? []) {
    const email = normalizeEmail(row.email);
    const name = normalizeName(row.guest_name);
    const key = email ? `email:${email}` : `menu:${row.id}`;
    const selections =
      row.selections && typeof row.selections === "object"
        ? (row.selections as {
            courses?: Record<string, { name?: string }[]>;
          })
        : {};
    const existing = byKey.get(key);

    byKey.set(
      key,
      mergeVisitor(existing, {
        id: key,
        name,
        email,
        phone: null,
        country: null,
        location: null,
        source: "menu",
        attendDinner: null,
        joinCruise: null,
        bringingGuest: null,
        guestName: null,
        dietaryNotes: row.dietary_notes?.trim() || null,
        menuMain: selections.courses?.main?.[0]?.name ?? null,
        menuDessert: selections.courses?.dessert?.[0]?.name ?? null,
        guestbookMessage: null,
        firstSeenAt: row.created_at,
        lastSeenAt: row.created_at,
      }),
    );
  }

  for (const row of guestbook.data ?? []) {
    const name = normalizeName(row.author_name);
    const key = `guestbook:${row.id}`;
    byKey.set(
      key,
      mergeVisitor(undefined, {
        id: key,
        name,
        email: null,
        phone: null,
        country: null,
        location: row.location?.trim() || null,
        source: "guestbook",
        attendDinner: null,
        joinCruise: null,
        bringingGuest: null,
        guestName: null,
        dietaryNotes: null,
        menuMain: null,
        menuDessert: null,
        guestbookMessage: row.message,
        firstSeenAt: row.created_at,
        lastSeenAt: row.created_at,
      }),
    );
  }

  return [...byKey.values()].sort(
    (a, b) =>
      new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime(),
  );
}
