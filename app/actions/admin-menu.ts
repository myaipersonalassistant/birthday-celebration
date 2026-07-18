"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/app/actions/admin-auth";
import { createSupabaseAuthClient } from "@/lib/supabase/server";

export type MenuSubmissionCourseChoice = {
  id: string;
  name: string;
};

export type MenuSubmission = {
  id: string;
  guestName: string;
  email: string | null;
  dietaryNotes: string | null;
  menuTitle: string;
  menuId: string;
  courses: Record<string, MenuSubmissionCourseChoice[]>;
  createdAt: string;
};

export type AdminMenuResult = { ok: true } | { ok: false; error: string };

function mapRow(row: {
  id: string;
  guest_name: string;
  email: string | null;
  dietary_notes: string | null;
  selections: unknown;
  created_at: string;
}): MenuSubmission {
  const selections =
    row.selections && typeof row.selections === "object"
      ? (row.selections as {
          menu?: { id?: string; title?: string };
          courses?: Record<string, MenuSubmissionCourseChoice[]>;
        })
      : {};

  return {
    id: row.id,
    guestName: row.guest_name,
    email: row.email,
    dietaryNotes: row.dietary_notes,
    menuTitle: selections.menu?.title ?? "Premium Menu",
    menuId: selections.menu?.id ?? "premium",
    courses: selections.courses ?? {},
    createdAt: row.created_at,
  };
}

export async function getAdminMenuSubmissions(): Promise<MenuSubmission[]> {
  await requireAdminUser();

  try {
    const supabase = await createSupabaseAuthClient();
    const { data, error } = await supabase
      .from("menu_submissions")
      .select("id, guest_name, email, dietary_notes, selections, created_at")
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

export async function deleteMenuSubmission(
  id: string,
): Promise<AdminMenuResult> {
  await requireAdminUser();

  if (!id?.trim()) {
    return { ok: false, error: "Missing submission id." };
  }

  try {
    const supabase = await createSupabaseAuthClient();
    const { error } = await supabase
      .from("menu_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      return {
        ok: false,
        error: error.message || "Could not delete this submission.",
      };
    }

    revalidatePath("/admin/menu");
    revalidatePath("/admin");
    revalidatePath("/menu");

    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not delete this submission.";
    return { ok: false, error: message };
  }
}
