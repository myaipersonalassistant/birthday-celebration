export const INVITATION_BUCKET = "invitation";
export const INVITATION_ROW_ID = "current";
export const INVITATION_VIDEO_PATH = "current-video";
export const INVITATION_POSTER_PATH = "current-poster";

/** Soft app cap — keep under the Supabase bucket limit (150MB). */
export const MAX_INVITATION_VIDEO_BYTES = 150 * 1024 * 1024;
export const MAX_INVITATION_POSTER_BYTES = 5 * 1024 * 1024;

export type InvitationMedia = {
  videoUrl: string;
  posterUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  updatedAt: string;
};

export function invitationStoragePath(kind: "video" | "poster", file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  const ext =
    fromName && /^[a-z0-9]+$/.test(fromName) && fromName.length <= 5
      ? fromName
      : kind === "video"
        ? "mp4"
        : "jpg";

  const base =
    kind === "video" ? INVITATION_VIDEO_PATH : INVITATION_POSTER_PATH;
  return `${base}.${ext}`;
}

export function invitationStoragePathFromPublicUrl(url: string) {
  const marker = `/object/public/${INVITATION_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

export function formatInvitationBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
