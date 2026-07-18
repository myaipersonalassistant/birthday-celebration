"use server";

import { createSupabaseServerClient } from "@/lib/supabase";

export type RsvpSubmissionPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
  attendDinner: boolean;
  joinCruise: boolean;
  bringingGuest: boolean;
  guestName?: string;
  message?: string;
};

export type RsvpSubmissionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitRsvp(
  payload: RsvpSubmissionPayload,
): Promise<RsvpSubmissionResult> {
  const firstName = payload.firstName.trim();
  const lastName = payload.lastName.trim();
  const email = payload.email.trim();
  const phone = payload.phone?.trim() || null;
  const country = payload.country.trim();
  const guestName = payload.guestName?.trim() || null;
  const message = payload.message?.trim() || null;

  if (!firstName || !lastName) {
    return { ok: false, error: "Please enter your first and last name." };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (!country) {
    return { ok: false, error: "Please select your country." };
  }

  if (!payload.attendDinner && !payload.joinCruise) {
    return {
      ok: false,
      error: "Please select at least one part of the celebration to attend.",
    };
  }

  if (payload.bringingGuest && !guestName) {
    return { ok: false, error: "Please enter your guest’s name." };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("rsvp_submissions").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      country,
      attend_dinner: payload.attendDinner,
      join_cruise: payload.joinCruise,
      bringing_guest: payload.bringingGuest,
      guest_name: payload.bringingGuest ? guestName : null,
      message,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    const messageText =
      error instanceof Error ? error.message : "Unable to submit your RSVP right now.";
    return { ok: false, error: messageText };
  }
}
