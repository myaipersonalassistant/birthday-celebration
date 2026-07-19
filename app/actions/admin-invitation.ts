"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/app/actions/admin-auth";
import {
  INVITATION_BUCKET,
  INVITATION_ROW_ID,
  invitationStoragePathFromPublicUrl,
  type InvitationMedia,
} from "@/lib/invitation";
import { createSupabaseServerClient } from "@/lib/supabase";
import { createSupabaseAuthClient } from "@/lib/supabase/server";

export type InvitationActionResult =
  | { ok: true; media?: InvitationMedia | null }
  | { ok: false; error: string };

function mapRow(row: {
  video_url: string;
  poster_url: string | null;
  file_name: string | null;
  file_size: number | null;
  updated_at: string;
}): InvitationMedia {
  return {
    videoUrl: row.video_url,
    posterUrl: row.poster_url,
    fileName: row.file_name,
    fileSize: row.file_size,
    updatedAt: row.updated_at,
  };
}

function revalidateInvitation() {
  revalidatePath("/invitation");
  revalidatePath("/admin/studio");
  revalidatePath("/");
}

/** Public read — used by the invitation page. */
export async function getInvitationMedia(): Promise<InvitationMedia | null> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("invitation_media")
      .select("video_url, poster_url, file_name, file_size, updated_at")
      .eq("id", INVITATION_ROW_ID)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapRow(data);
  } catch {
    return null;
  }
}

export async function getAdminInvitationMedia(): Promise<InvitationMedia | null> {
  await requireAdminUser();
  return getInvitationMedia();
}

/** Persist URLs after a direct browser upload to the invitation bucket. */
export async function saveInvitationMedia(input: {
  videoUrl: string;
  posterUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
}): Promise<InvitationActionResult> {
  await requireAdminUser();

  const videoUrl = input.videoUrl.trim();
  if (!videoUrl) {
    return { ok: false, error: "Video URL is missing." };
  }

  try {
    const supabase = await createSupabaseAuthClient();
    const { data, error } = await supabase
      .from("invitation_media")
      .upsert(
        {
          id: INVITATION_ROW_ID,
          video_url: videoUrl,
          poster_url: input.posterUrl?.trim() || null,
          file_name: input.fileName?.trim() || null,
          file_size: input.fileSize ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )
      .select("video_url, poster_url, file_name, file_size, updated_at")
      .single();

    if (error || !data) {
      return {
        ok: false,
        error:
          error?.message.includes("invitation_media") ||
          error?.code === "42P01"
            ? "Invitation table is missing. Run supabase/invitation-schema.sql."
            : error?.message || "Could not save invitation video.",
      };
    }

    revalidateInvitation();
    return { ok: true, media: mapRow(data) };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not save invitation video.";
    return { ok: false, error: message };
  }
}

export async function clearInvitationMedia(): Promise<InvitationActionResult> {
  await requireAdminUser();

  try {
    const supabase = await createSupabaseAuthClient();
    const { data: existing } = await supabase
      .from("invitation_media")
      .select("video_url, poster_url")
      .eq("id", INVITATION_ROW_ID)
      .maybeSingle();

    const { error } = await supabase
      .from("invitation_media")
      .delete()
      .eq("id", INVITATION_ROW_ID);

    if (error) {
      return { ok: false, error: error.message || "Could not remove invitation." };
    }

    const paths = [
      existing?.video_url
        ? invitationStoragePathFromPublicUrl(existing.video_url)
        : null,
      existing?.poster_url
        ? invitationStoragePathFromPublicUrl(existing.poster_url)
        : null,
    ].filter((path): path is string => Boolean(path));

    if (paths.length) {
      await supabase.storage.from(INVITATION_BUCKET).remove(paths);
    }

    revalidateInvitation();
    return { ok: true, media: null };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not remove invitation.";
    return { ok: false, error: message };
  }
}
