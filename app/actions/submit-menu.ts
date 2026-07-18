"use server";

import { getMenuById } from "@/lib/menu-data";
import { createSupabaseServerClient } from "@/lib/supabase";

export type MenuSubmissionPayload = {
  menuId: string;
  guestName: string;
  email: string;
  dietaryNotes?: string;
  selections: Record<string, string[]>;
};

export type MenuSubmissionResult =
  | { ok: true }
  | { ok: false; error: string };

function resolveSelections(menuId: string, selections: Record<string, string[]>) {
  const menu = getMenuById(menuId);
  const resolved: Record<string, { id: string; name: string }[]> = {};

  for (const course of menu.courses) {
    if (course.selection === "included") {
      resolved[course.id] = course.items.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      continue;
    }

    const chosen = selections[course.id] ?? [];
    if (chosen.length === 0) continue;

    resolved[course.id] = chosen
      .map((itemId) => {
        const item = course.items.find((entry) => entry.id === itemId);
        return item ? { id: item.id, name: item.name } : null;
      })
      .filter((entry): entry is { id: string; name: string } => entry !== null);
  }

  return resolved;
}

export async function submitMenuSelection(
  payload: MenuSubmissionPayload,
): Promise<MenuSubmissionResult> {
  const guestName = payload.guestName.trim();
  const email = payload.email.trim();
  const dietaryNotes = payload.dietaryNotes?.trim() || null;
  const menu = getMenuById(payload.menuId);
  const selections = resolveSelections(menu.id, payload.selections);

  if (!guestName) {
    return { ok: false, error: "Please enter your name." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const missingChoice = menu.courses.find(
    (course) =>
      course.selection === "single" &&
      (!selections[course.id] || selections[course.id].length === 0),
  );

  if (missingChoice) {
    return {
      ok: false,
      error: `Please choose your ${missingChoice.title.toLowerCase()}.`,
    };
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("menu_submissions").insert({
      guest_name: guestName,
      email: email || null,
      dietary_notes: dietaryNotes,
      selections: {
        menu: { id: menu.id, title: menu.title },
        courses: selections,
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to submit your menu right now.";
    return { ok: false, error: message };
  }
}
