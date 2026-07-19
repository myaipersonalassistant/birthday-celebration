"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import {
  GalleryItem,
  GalleryMediaType,
} from "@/lib/gallery-data";

function mapRow(row: {
  id: string;
  title: string;
  caption: string | null;
  media_type: string;
  media_url: string;
  poster_url: string | null;
  alt_text: string | null;
  sort_order: number;
}): GalleryItem {
  const mediaType: GalleryMediaType =
    row.media_type === "video" ? "video" : "image";

  return {
    id: row.id,
    title: row.title,
    caption: row.caption,
    mediaType,
    mediaUrl: row.media_url,
    posterUrl: row.poster_url,
    altText: row.alt_text || row.title,
    sortOrder: row.sort_order,
  };
}

/** Loads published celebration media from Supabase. */
export async function getGalleryMedia(): Promise<GalleryItem[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("gallery_media")
      .select(
        "id, title, caption, media_type, media_url, poster_url, alt_text, sort_order",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map(mapRow);
  } catch {
    return [];
  }
}
