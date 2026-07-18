"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/app/actions/admin-auth";
import type { GuestbookMessage } from "@/app/actions/guestbook";
import { createSupabaseAuthClient } from "@/lib/supabase/server";

function mapRow(row: {
  id: string;
  author_name: string;
  location: string | null;
  message: string;
  created_at: string;
}): GuestbookMessage {
  return {
    id: row.id,
    authorName: row.author_name,
    location: row.location,
    message: row.message,
    createdAt: row.created_at,
  };
}

export type AdminGuestbookResult =
  | { ok: true }
  | { ok: false; error: string };

export async function getAdminGuestbookMessages(): Promise<GuestbookMessage[]> {
  await requireAdminUser();

  try {
    const supabase = await createSupabaseAuthClient();
    const { data, error } = await supabase
      .from("guestbook_messages")
      .select("id, author_name, location, message, created_at")
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

export async function deleteGuestbookMessage(
  id: string,
): Promise<AdminGuestbookResult> {
  await requireAdminUser();

  if (!id?.trim()) {
    return { ok: false, error: "Missing message id." };
  }

  try {
    const supabase = await createSupabaseAuthClient();
    const { error } = await supabase
      .from("guestbook_messages")
      .delete()
      .eq("id", id);

    if (error) {
      return { ok: false, error: error.message || "Could not delete this message." };
    }

    revalidatePath("/guestbook");
    revalidatePath("/admin/guestbook");
    revalidatePath("/admin");

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not delete this message.";
    return { ok: false, error: message };
  }
}
