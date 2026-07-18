"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/app/actions/admin-auth";
import { createSupabaseAuthClient } from "@/lib/supabase/server";

export type RsvpSubmission = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string;
  attendDinner: boolean;
  joinCruise: boolean;
  bringingGuest: boolean;
  guestName: string | null;
  message: string | null;
  createdAt: string;
};

export type AdminRsvpResult = { ok: true } | { ok: false; error: string };

function mapRow(row: {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string;
  attend_dinner: boolean;
  join_cruise: boolean;
  bringing_guest: boolean;
  guest_name: string | null;
  message: string | null;
  created_at: string;
}): RsvpSubmission {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    attendDinner: row.attend_dinner,
    joinCruise: row.join_cruise,
    bringingGuest: row.bringing_guest,
    guestName: row.guest_name,
    message: row.message,
    createdAt: row.created_at,
  };
}

export async function getAdminRsvpSubmissions(): Promise<RsvpSubmission[]> {
  await requireAdminUser();

  try {
    const supabase = await createSupabaseAuthClient();
    const { data, error } = await supabase
      .from("rsvp_submissions")
      .select(
        "id, first_name, last_name, email, phone, country, attend_dinner, join_cruise, bringing_guest, guest_name, message, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (error || !data) {
      return [];
    }

    return data.map(mapRow);
  } catch {
    return [];
  }
}

export async function deleteRsvpSubmission(
  id: string,
): Promise<AdminRsvpResult> {
  await requireAdminUser();

  if (!id?.trim()) {
    return { ok: false, error: "Missing RSVP id." };
  }

  try {
    const supabase = await createSupabaseAuthClient();
    const { error } = await supabase
      .from("rsvp_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      return {
        ok: false,
        error: error.message || "Could not delete this RSVP.",
      };
    }

    revalidatePath("/admin/rsvp");
    revalidatePath("/admin");
    revalidatePath("/rsvp");

    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not delete this RSVP.";
    return { ok: false, error: message };
  }
}
