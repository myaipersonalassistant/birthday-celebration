"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/app/actions/admin-auth";
import type { GalleryMediaType } from "@/lib/gallery-data";
import { createSupabaseAuthClient } from "@/lib/supabase/server";

export type AdminGalleryItem = {
  id: string;
  title: string;
  caption: string | null;
  mediaType: GalleryMediaType;
  mediaUrl: string;
  posterUrl: string | null;
  altText: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
};

export type AdminGalleryResult =
  | { ok: true; item?: AdminGalleryItem }
  | { ok: false; error: string };

const BUCKET = "gallery";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 40 * 1024 * 1024;
const MAX_POSTER_BYTES = 5 * 1024 * 1024;

function mapRow(row: {
  id: string;
  title: string;
  caption: string | null;
  media_type: string;
  media_url: string;
  poster_url: string | null;
  alt_text: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}): AdminGalleryItem {
  return {
    id: row.id,
    title: row.title,
    caption: row.caption,
    mediaType: row.media_type === "video" ? "video" : "image",
    mediaUrl: row.media_url,
    posterUrl: row.poster_url,
    altText: row.alt_text || row.title,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    createdAt: row.created_at,
  };
}

function extensionFromFile(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName) && fromName.length <= 5) {
    return fromName;
  }
  if (file.type.includes("png")) return "png";
  if (file.type.includes("webp")) return "webp";
  if (file.type.includes("gif")) return "gif";
  if (file.type.includes("mp4")) return "mp4";
  if (file.type.includes("webm")) return "webm";
  if (file.type.includes("quicktime")) return "mov";
  return "jpg";
}

function storagePathFromPublicUrl(url: string) {
  const marker = `/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

function revalidateGallery() {
  revalidatePath("/admin/studio");
  revalidatePath("/admin");
  revalidatePath("/gallery");
}

export async function getAdminGalleryMedia(): Promise<AdminGalleryItem[]> {
  await requireAdminUser();

  try {
    const supabase = await createSupabaseAuthClient();
    const { data, error } = await supabase
      .from("gallery_media")
      .select(
        "id, title, caption, media_type, media_url, poster_url, alt_text, sort_order, is_published, created_at",
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(200);

    if (error || !data) {
      return [];
    }

    return data.map(mapRow);
  } catch {
    return [];
  }
}

export async function uploadGalleryMedia(
  formData: FormData,
): Promise<AdminGalleryResult> {
  await requireAdminUser();

  const file = formData.get("file");
  const poster = formData.get("poster");
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const altText = String(formData.get("altText") ?? "").trim() || title;
  const isPublished = String(formData.get("isPublished") ?? "true") === "true";
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a photo or video to upload." };
  }

  if (!title) {
    return { ok: false, error: "Please add a title." };
  }

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");

  if (!isVideo && !isImage) {
    return { ok: false, error: "Only image or video files are supported." };
  }

  if (isImage && file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Images must be under 8MB." };
  }

  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return { ok: false, error: "Videos must be under 40MB." };
  }

  if (poster instanceof File && poster.size > 0) {
    if (!poster.type.startsWith("image/")) {
      return { ok: false, error: "Video poster must be an image." };
    }
    if (poster.size > MAX_POSTER_BYTES) {
      return { ok: false, error: "Poster images must be under 5MB." };
    }
  }

  const supabase = await createSupabaseAuthClient();
  const mediaType: GalleryMediaType = isVideo ? "video" : "image";
  const mediaPath = `${crypto.randomUUID()}.${extensionFromFile(file)}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(mediaPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    return {
      ok: false,
      error:
        uploadError.message.includes("Bucket not found")
          ? "Gallery storage bucket is missing. Run supabase/gallery-schema.sql."
          : uploadError.message || "Upload failed.",
    };
  }

  const {
    data: { publicUrl: mediaUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(mediaPath);

  let posterUrl: string | null = null;

  if (isVideo && poster instanceof File && poster.size > 0) {
    const posterPath = `${crypto.randomUUID()}.${extensionFromFile(poster)}`;
    const { error: posterError } = await supabase.storage
      .from(BUCKET)
      .upload(posterPath, poster, {
        cacheControl: "3600",
        upsert: false,
        contentType: poster.type || undefined,
      });

    if (posterError) {
      await supabase.storage.from(BUCKET).remove([mediaPath]);
      return {
        ok: false,
        error: posterError.message || "Poster upload failed.",
      };
    }

    posterUrl = supabase.storage.from(BUCKET).getPublicUrl(posterPath).data
      .publicUrl;
  }

  const { data, error } = await supabase
    .from("gallery_media")
    .insert({
      title,
      caption,
      media_type: mediaType,
      media_url: mediaUrl,
      poster_url: posterUrl,
      alt_text: altText,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
      is_published: isPublished,
    })
    .select(
      "id, title, caption, media_type, media_url, poster_url, alt_text, sort_order, is_published, created_at",
    )
    .single();

  if (error || !data) {
    await supabase.storage.from(BUCKET).remove([mediaPath]);
    if (posterUrl) {
      const posterPath = storagePathFromPublicUrl(posterUrl);
      if (posterPath) await supabase.storage.from(BUCKET).remove([posterPath]);
    }
    return {
      ok: false,
      error: error?.message || "Could not save gallery item.",
    };
  }

  revalidateGallery();
  return { ok: true, item: mapRow(data) };
}

export async function updateGalleryMedia(input: {
  id: string;
  title: string;
  caption?: string;
  altText?: string;
  sortOrder?: number;
  isPublished?: boolean;
}): Promise<AdminGalleryResult> {
  await requireAdminUser();

  const title = input.title.trim();
  if (!title) {
    return { ok: false, error: "Title is required." };
  }

  try {
    const supabase = await createSupabaseAuthClient();
    const { data, error } = await supabase
      .from("gallery_media")
      .update({
        title,
        caption: input.caption?.trim() || null,
        alt_text: input.altText?.trim() || title,
        sort_order: input.sortOrder ?? 0,
        ...(typeof input.isPublished === "boolean"
          ? { is_published: input.isPublished }
          : {}),
      })
      .eq("id", input.id)
      .select(
        "id, title, caption, media_type, media_url, poster_url, alt_text, sort_order, is_published, created_at",
      )
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message || "Could not update item." };
    }

    revalidateGallery();
    return { ok: true, item: mapRow(data) };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update item.";
    return { ok: false, error: message };
  }
}

export async function toggleGalleryPublished(
  id: string,
  isPublished: boolean,
): Promise<AdminGalleryResult> {
  await requireAdminUser();

  try {
    const supabase = await createSupabaseAuthClient();
    const { data, error } = await supabase
      .from("gallery_media")
      .update({ is_published: isPublished })
      .eq("id", id)
      .select(
        "id, title, caption, media_type, media_url, poster_url, alt_text, sort_order, is_published, created_at",
      )
      .single();

    if (error || !data) {
      return {
        ok: false,
        error: error?.message || "Could not update publish state.",
      };
    }

    revalidateGallery();
    return { ok: true, item: mapRow(data) };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not update publish state.";
    return { ok: false, error: message };
  }
}

export async function deleteGalleryMedia(
  id: string,
): Promise<AdminGalleryResult> {
  await requireAdminUser();

  try {
    const supabase = await createSupabaseAuthClient();
    const { data: existing, error: fetchError } = await supabase
      .from("gallery_media")
      .select("media_url, poster_url")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      return { ok: false, error: fetchError.message };
    }

    const { error } = await supabase.from("gallery_media").delete().eq("id", id);

    if (error) {
      return { ok: false, error: error.message || "Could not delete item." };
    }

    const paths = [
      existing?.media_url ? storagePathFromPublicUrl(existing.media_url) : null,
      existing?.poster_url
        ? storagePathFromPublicUrl(existing.poster_url)
        : null,
    ].filter((path): path is string => Boolean(path));

    if (paths.length) {
      await supabase.storage.from(BUCKET).remove(paths);
    }

    revalidateGallery();
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not delete item.";
    return { ok: false, error: message };
  }
}
