"use client";

import { useEffect, useRef, useState } from "react";
import {
  clearInvitationMedia,
  saveInvitationMedia,
  type InvitationActionResult,
} from "@/app/actions/admin-invitation";
import {
  INVITATION_BUCKET,
  MAX_INVITATION_POSTER_BYTES,
  MAX_INVITATION_VIDEO_BYTES,
  formatInvitationBytes,
  invitationStoragePath,
  invitationStoragePathFromPublicUrl,
  type InvitationMedia,
} from "@/lib/invitation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { uploadToSupabaseStorage } from "@/lib/upload-with-progress";

type AdminInvitationPanelProps = {
  initialMedia: InvitationMedia | null;
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export function AdminInvitationPanel({
  initialMedia,
}: AdminInvitationPanelProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [media, setMedia] = useState(initialMedia);
  const [video, setVideo] = useState<File | null>(null);
  const [poster, setPoster] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingClear, setPendingClear] = useState(false);

  useEffect(() => {
    if (!video) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(video);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [video]);

  useEffect(() => {
    if (!poster) {
      setPosterPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(poster);
    setPosterPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [poster]);

  const assignVideo = (file: File | null) => {
    setError(null);
    setSuccess(null);
    if (!file) {
      setVideo(null);
      return;
    }
    if (!file.type.startsWith("video/")) {
      setError("Please choose a video file (MP4 or WebM).");
      return;
    }
    if (file.size > MAX_INVITATION_VIDEO_BYTES) {
      setError(
        `Video must be under ${formatInvitationBytes(MAX_INVITATION_VIDEO_BYTES)}.`,
      );
      return;
    }
    setVideo(file);
  };

  const assignPoster = (file: File | null) => {
    setError(null);
    setSuccess(null);
    if (!file) {
      setPoster(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Poster must be an image.");
      return;
    }
    if (file.size > MAX_INVITATION_POSTER_BYTES) {
      setError(
        `Poster must be under ${formatInvitationBytes(MAX_INVITATION_POSTER_BYTES)}.`,
      );
      return;
    }
    setPoster(file);
  };

  const handleUpload = async () => {
    if (!video) {
      setError("Choose an invitation video to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setProgressLabel("Uploading video…");
    setProgressPercent(0);

    try {
      const supabase = createSupabaseBrowserClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

      if (!supabaseUrl || !anonKey) {
        setError("Supabase env vars are missing.");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("Your admin session expired. Sign in again.");
        return;
      }

      // Remove previous objects if the extension changed (path differs)
      const stalePaths = [
        media?.videoUrl
          ? invitationStoragePathFromPublicUrl(
              media.videoUrl.split("?")[0] ?? media.videoUrl,
            )
          : null,
        media?.posterUrl && poster
          ? invitationStoragePathFromPublicUrl(
              media.posterUrl.split("?")[0] ?? media.posterUrl,
            )
          : null,
      ].filter((path): path is string => Boolean(path));

      const videoPath = invitationStoragePath("video", video);
      const pathsToRemove = stalePaths.filter((path) => path !== videoPath);

      if (pathsToRemove.length) {
        await supabase.storage.from(INVITATION_BUCKET).remove(pathsToRemove);
      }

      await uploadToSupabaseStorage({
        supabaseUrl,
        anonKey,
        accessToken: session.access_token,
        bucket: INVITATION_BUCKET,
        path: videoPath,
        file: video,
        upsert: true,
        onProgress: (percent) => {
          setProgressLabel("Uploading video…");
          setProgressPercent(percent);
        },
      });

      const {
        data: { publicUrl: videoUrl },
      } = supabase.storage.from(INVITATION_BUCKET).getPublicUrl(videoPath);

      // Bust CDN/browser cache after replace
      const videoUrlFresh = `${videoUrl}?v=${Date.now()}`;

      let posterUrl: string | null = media?.posterUrl ?? null;

      if (poster) {
        setProgressLabel("Uploading poster…");
        setProgressPercent(0);
        const posterPath = invitationStoragePath("poster", poster);

        await uploadToSupabaseStorage({
          supabaseUrl,
          anonKey,
          accessToken: session.access_token,
          bucket: INVITATION_BUCKET,
          path: posterPath,
          file: poster,
          upsert: true,
          onProgress: (percent) => {
            setProgressLabel("Uploading poster…");
            setProgressPercent(percent);
          },
        });

        posterUrl = `${supabase.storage.from(INVITATION_BUCKET).getPublicUrl(posterPath).data.publicUrl}?v=${Date.now()}`;
      }

      setProgressLabel("Saving…");
      setProgressPercent(100);
      const result: InvitationActionResult = await saveInvitationMedia({
        videoUrl: videoUrlFresh,
        posterUrl,
        fileName: video.name,
        fileSize: video.size,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setMedia(result.media ?? null);
      setVideo(null);
      setPoster(null);
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (posterInputRef.current) posterInputRef.current.value = "";
      setSuccess("Invitation video is live on /invitation.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
    } finally {
      setIsUploading(false);
      setProgressLabel(null);
      setProgressPercent(null);
    }
  };

  const handleClear = async () => {
    setIsUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await clearInvitationMedia();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMedia(null);
      setPendingClear(false);
      setSuccess("Invitation video removed.");
    } catch {
      setError("Could not remove the invitation video.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="relative border border-[#061c2b] bg-white">
      {isUploading && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#061c2b]/55 backdrop-blur-[1px]">
          <div className="w-full max-w-sm border border-[#d8ad61]/40 bg-[#061c2b] px-6 py-5 text-center text-white">
            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
              Uploading
            </p>
            <p className="mt-2 font-logo text-4xl tabular-nums text-white">
              {progressPercent ?? 0}%
            </p>
            <p className="mt-1 text-sm text-white/70">
              {progressLabel || "Please wait…"}
            </p>
            <div className="mt-4 h-1.5 overflow-hidden bg-white/10">
              <div
                className="h-full bg-[#d8ad61] transition-[width] duration-150 ease-out"
                style={{ width: `${progressPercent ?? 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-[#061c2b] bg-[#061c2b] px-5 py-5 text-white sm:px-6">
        <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
          Invitation
        </p>
        <h2 className="mt-1 font-logo text-2xl tracking-[-0.02em] sm:text-3xl">
          Chris&apos;s message
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/55">
          Upload the portrait invitation video for{" "}
          <span className="text-[#d8ad61]">/invitation</span>. Files go straight
          to Supabase (up to{" "}
          {formatInvitationBytes(MAX_INVITATION_VIDEO_BYTES)}).
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,220px)_1fr]">
        <div className="space-y-3">
          <div className="aspect-[9/16] overflow-hidden bg-[#061c2b]/90 ring-1 ring-[#d8ad61]/25">
            {previewUrl ? (
              <video
                src={previewUrl}
                controls
                playsInline
                className="h-full w-full object-contain"
              />
            ) : media?.videoUrl ? (
              <video
                src={media.videoUrl}
                poster={media.posterUrl ?? undefined}
                controls
                playsInline
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="grid h-full place-items-center px-4 text-center text-sm text-white/45">
                No invitation video yet
              </div>
            )}
          </div>
          {(posterPreviewUrl || media?.posterUrl) && (
            // Poster thumb — local blob or remote Supabase URL
            <img
              src={posterPreviewUrl || media?.posterUrl || ""}
              alt=""
              className="h-16 w-full object-cover ring-1 ring-[#d8cfbf]"
            />
          )}
          {media && !previewUrl && (
            <p className="text-[0.7rem] leading-relaxed text-[#061c2b]/55">
              {media.fileName || "Current video"}
              {media.fileSize
                ? ` · ${formatInvitationBytes(media.fileSize)}`
                : ""}
              {media.updatedAt ? ` · ${formatDate(media.updatedAt)}` : ""}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {error && (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}
          {success && (
            <p className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {success}
            </p>
          )}

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              const file = event.dataTransfer.files?.[0] ?? null;
              assignVideo(file);
            }}
            className={`border border-dashed px-5 py-8 text-center transition-colors ${
              isDragging
                ? "border-[#d8ad61] bg-[#fff8eb]"
                : "border-[#d8cfbf] bg-[#faf8f4]"
            }`}
          >
            <p className="text-sm text-[#061c2b]/70">
              Drop a portrait MP4 here, or{" "}
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="font-semibold text-[#8a6a2e] underline-offset-2 hover:underline"
              >
                browse
              </button>
            </p>
            <p className="mt-2 text-[0.7rem] text-[#061c2b]/45">
              MP4 / WebM · max {formatInvitationBytes(MAX_INVITATION_VIDEO_BYTES)}
            </p>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={(event) =>
                assignVideo(event.target.files?.[0] ?? null)
              }
            />
          </div>

          {video && (
            <p className="text-sm text-[#061c2b]/75">
              Ready:{" "}
              <span className="font-semibold">{video.name}</span> (
              {formatInvitationBytes(video.size)})
            </p>
          )}

          <div>
            <label className="text-[0.65rem] font-bold tracking-[0.14em] text-[#061c2b]/55 uppercase">
              Poster image (optional)
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => posterInputRef.current?.click()}
                className="border border-[#061c2b]/20 px-4 py-2 text-[0.7rem] font-bold tracking-[0.12em] text-[#061c2b] uppercase transition hover:border-[#d8ad61]"
              >
                Choose poster
              </button>
              {poster && (
                <span className="text-sm text-[#061c2b]/65">{poster.name}</span>
              )}
              <input
                ref={posterInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  assignPoster(event.target.files?.[0] ?? null)
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || !video}
              className="bg-[#061c2b] px-5 py-2.5 text-[0.7rem] font-bold tracking-[0.14em] text-white uppercase transition hover:bg-[#0a2a3f] disabled:opacity-40"
            >
              {media ? "Replace video" : "Publish video"}
            </button>
            {media && (
              <button
                type="button"
                onClick={() => setPendingClear(true)}
                disabled={isUploading}
                className="border border-red-300 px-5 py-2.5 text-[0.7rem] font-bold tracking-[0.14em] text-red-700 uppercase transition hover:bg-red-50 disabled:opacity-40"
              >
                Remove
              </button>
            )}
            <a
              href="/invitation"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-4 py-2.5 text-[0.7rem] font-bold tracking-[0.14em] text-[#8a6a2e] uppercase underline-offset-2 hover:underline"
            >
              View page
            </a>
          </div>
        </div>
      </div>

      {pendingClear && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#061c2b]/55 p-5">
          <div className="w-full max-w-md border border-[#061c2b] bg-white p-6">
            <h3 className="font-logo text-2xl text-[#061c2b]">
              Remove invitation video?
            </h3>
            <p className="mt-2 text-sm text-[#061c2b]/65">
              This deletes the file from Supabase and clears /invitation until
              you upload again.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="bg-red-700 px-4 py-2 text-[0.7rem] font-bold tracking-[0.12em] text-white uppercase"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => setPendingClear(false)}
                className="border border-[#061c2b]/20 px-4 py-2 text-[0.7rem] font-bold tracking-[0.12em] text-[#061c2b] uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
