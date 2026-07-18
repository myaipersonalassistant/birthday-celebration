"use client";

import Image from "next/image";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  deleteGalleryMedia,
  getAdminGalleryMedia,
  toggleGalleryPublished,
  updateGalleryMedia,
  uploadGalleryMedia,
  type AdminGalleryItem,
} from "@/app/actions/admin-gallery";

type LibraryFilter = "all" | "published" | "draft" | "image" | "video";

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function RefreshIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-3.5 ${spinning ? "animate-spin" : ""}`}
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-2.6-6.3" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 size-5" aria-hidden="true">
      <path d="M8 5.14v13.72L19 12 8 5.14z" />
    </svg>
  );
}

function thumbSrc(item: AdminGalleryItem) {
  if (item.mediaType === "video") {
    return item.posterUrl || item.mediaUrl;
  }
  return item.mediaUrl;
}

function titleFromFilename(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

type AdminGalleryPanelProps = {
  initialItems: AdminGalleryItem[];
};

export function AdminGalleryPanel({ initialItems }: AdminGalleryPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [poster, setPoster] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [publishOnUpload, setPublishOnUpload] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const [editing, setEditing] = useState<AdminGalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [editSort, setEditSort] = useState("0");
  const [editPublished, setEditPublished] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<AdminGalleryItem | null>(
    null,
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isBusy, startBusy] = useTransition();
  const [isRefreshing, startRefresh] = useTransition();

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!poster) {
      setPosterPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(poster);
    setPosterPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [poster]);

  const stats = useMemo(() => {
    const published = items.filter((item) => item.isPublished).length;
    const photos = items.filter((item) => item.mediaType === "image").length;
    const videos = items.filter((item) => item.mediaType === "video").length;
    return {
      total: items.length,
      published,
      drafts: items.length - published,
      photos,
      videos,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter === "published" && !item.isPublished) return false;
      if (filter === "draft" && item.isPublished) return false;
      if (filter === "image" && item.mediaType !== "image") return false;
      if (filter === "video" && item.mediaType !== "video") return false;
      if (!q) return true;
      return [item.title, item.caption ?? "", item.altText]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, filter, query]);

  const pickFile = (next: File | null) => {
    if (!next) return;
    if (!next.type.startsWith("image/") && !next.type.startsWith("video/")) {
      setError("Only photos and videos can be uploaded.");
      return;
    }
    setError(null);
    setSuccess(null);
    setFile(next);
    setPoster(null);
    const suggested = titleFromFilename(next.name);
    setTitle(suggested);
    setAltText(suggested);
  };

  const clearComposer = () => {
    setFile(null);
    setPoster(null);
    setTitle("");
    setCaption("");
    setAltText("");
    setSortOrder("0");
    setPublishOnUpload(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (posterInputRef.current) posterInputRef.current.value = "";
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || isUploading) {
      if (!file) setError("Choose a photo or video first.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.set("file", file);
    if (poster) formData.set("poster", poster);
    formData.set("title", title);
    formData.set("caption", caption);
    formData.set("altText", altText || title);
    formData.set("sortOrder", sortOrder || "0");
    formData.set("isPublished", publishOnUpload ? "true" : "false");

    try {
      const result = await uploadGalleryMedia(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.item) {
        setItems((current) => [result.item!, ...current]);
      }
      setSuccess(
        publishOnUpload
          ? "Published to the public gallery."
          : "Saved as a draft.",
      );
      clearComposer();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRefresh = () => {
    setError(null);
    startRefresh(async () => {
      try {
        const next = await getAdminGalleryMedia();
        setItems(next);
      } catch {
        setError("Could not refresh the library.");
      }
    });
  };

  const openEdit = (item: AdminGalleryItem) => {
    setEditing(item);
    setEditTitle(item.title);
    setEditCaption(item.caption ?? "");
    setEditAlt(item.altText);
    setEditSort(String(item.sortOrder));
    setEditPublished(item.isPublished);
    setError(null);
  };

  const saveEdit = () => {
    if (!editing) return;
    startBusy(async () => {
      const result = await updateGalleryMedia({
        id: editing.id,
        title: editTitle,
        caption: editCaption,
        altText: editAlt,
        sortOrder: Number(editSort) || 0,
        isPublished: editPublished,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.item) {
        setItems((current) =>
          current.map((entry) =>
            entry.id === result.item!.id ? result.item! : entry,
          ),
        );
      }
      setEditing(null);
    });
  };

  const handleTogglePublish = (item: AdminGalleryItem) => {
    startBusy(async () => {
      const result = await toggleGalleryPublished(item.id, !item.isPublished);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.item) {
        setItems((current) =>
          current.map((entry) =>
            entry.id === result.item!.id ? result.item! : entry,
          ),
        );
      }
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    startBusy(async () => {
      const result = await deleteGalleryMedia(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setItems((current) => current.filter((entry) => entry.id !== id));
      setPendingDelete(null);
      if (editing?.id === id) setEditing(null);
    });
  };

  const filters: { id: LibraryFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "published", label: "Live" },
    { id: "draft", label: "Drafts" },
    { id: "image", label: "Photos" },
    { id: "video", label: "Videos" },
  ];

  const isVideoFile = file?.type.startsWith("video/") ?? false;

  return (
    <div className="space-y-8">
      {/* Studio header */}
      <section className="relative overflow-hidden border border-[#061c2b] bg-[#061c2b] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(216,173,97,0.24),transparent_42%),radial-gradient(circle_at_90%_90%,rgba(216,173,97,0.1),transparent_40%)]" />
        <div className="relative px-5 py-6 sm:px-7 sm:py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
                Media studio
              </p>
              <h2 className="mt-1 font-logo text-3xl tracking-[-0.02em] sm:text-4xl">
                Celebration studio
              </h2>
              <p className="mt-2 max-w-lg text-sm text-white/55">
                Upload photos and videos, polish captions, then publish for
                guests to explore.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing || isBusy || isUploading}
              aria-label="Refresh library"
              title="Refresh"
              className="grid size-9 place-items-center border border-white/20 text-white/70 transition hover:border-[#d8ad61] hover:text-[#d8ad61] disabled:opacity-50"
            >
              <RefreshIcon spinning={isRefreshing} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: "In library", value: stats.total },
              { label: "Live", value: stats.published },
              { label: "Drafts", value: stats.drafts },
              { label: "Photos", value: stats.photos },
              { label: "Videos", value: stats.videos },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-white/10 bg-white/[0.04] px-3 py-3 sm:px-4"
              >
                <p className="text-[0.58rem] font-bold tracking-[0.14em] text-white/40 uppercase">
                  {stat.label}
                </p>
                <p className="mt-1 font-logo text-2xl tabular-nums text-[#d8ad61] sm:text-3xl">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside
        role="note"
        className="border border-[#d8ad61]/45 bg-[#fff8eb] px-5 py-4 sm:px-6"
      >
        <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#8a6a2e] uppercase">
          Limits are per upload
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#5c4a28]">
          Each file you upload must stay within these size caps — this is{" "}
          <span className="font-semibold">not</span> a limit on total gallery
          storage. Per upload: photos{" "}
          <span className="font-semibold">8MB</span>, videos{" "}
          <span className="font-semibold">40MB</span>, video posters{" "}
          <span className="font-semibold">5MB</span>. Upload as many files as
          you need.
        </p>
      </aside>

      {/* Composer */}
      <section className="relative border border-[#d8cfbf] bg-white">
        {isUploading && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/85 backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out]"
            role="status"
            aria-live="polite"
          >
            <span className="size-10 animate-spin rounded-full border-[3px] border-[#061c2b]/15 border-t-[#d8ad61]" />
            <p className="text-xs font-bold tracking-[0.16em] text-[#061c2b] uppercase">
              Uploading to studio…
            </p>
            <p className="text-sm text-[#4a5d6a]">Please keep this tab open</p>
          </div>
        )}

        <div className="border-b border-[#ebe4d8] px-5 py-4 sm:px-6">
          <p className="font-script text-2xl text-[#c99b4e]">New upload</p>
          <p className="text-xs tracking-[0.08em] text-[#8a7a5c] uppercase">
            Per upload · Photos 8MB · Videos 40MB
          </p>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              pickFile(event.dataTransfer.files?.[0] ?? null);
            }}
            className={`relative flex min-h-[260px] flex-col items-center justify-center border-b border-[#ebe4d8] px-6 py-10 text-center transition lg:border-r lg:border-b-0 ${
              isDragging
                ? "bg-[#fff8eb]"
                : "bg-[#fbf8f2]"
            }`}
          >
            {previewUrl && file ? (
              <div className="relative w-full max-w-sm">
                <div className="relative aspect-[4/3] overflow-hidden border border-[#d8cfbf] bg-[#061c2b]">
                  {isVideoFile ? (
                    <video
                      src={previewUrl}
                      className="absolute inset-0 size-full object-contain"
                      controls
                      playsInline
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="absolute inset-0 size-full object-contain"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={clearComposer}
                  className="mt-3 text-[0.65rem] font-bold tracking-[0.12em] text-[#8a7a5c] uppercase transition hover:text-[#d8ad61]"
                >
                  Clear selection
                </button>
              </div>
            ) : (
              <>
                <p className="font-logo text-2xl text-[#061c2b]">
                  Drop a moment here
                </p>
                <p className="mt-2 max-w-xs text-sm text-[#4a5d6a]">
                  Drag a photo or video onto this board, or browse from your
                  device.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 bg-[#061c2b] px-5 py-3 text-[0.7rem] font-bold tracking-[0.14em] text-[#d8ad61] uppercase transition hover:brightness-110"
                >
                  Browse files
                </button>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(event) => pickFile(event.target.files?.[0] ?? null)}
            />
          </div>

          <form onSubmit={handleUpload} className="space-y-4 px-5 py-6 sm:px-6">
            <label className="block">
              <span className="mb-1.5 block text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
                Title
              </span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={!file || isUploading}
                placeholder="Golden hour terrace"
                className="min-h-11 w-full border border-[#d8cfbf] bg-white px-3 text-sm text-[#061c2b] outline-none transition placeholder:text-[#8a7a5c]/70 focus:border-[#d8ad61] disabled:bg-[#f7f3eb]/60"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
                Caption
              </span>
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                disabled={!file || isUploading}
                rows={3}
                placeholder="A short line guests will see…"
                className="w-full border border-[#d8cfbf] bg-white px-3 py-2.5 text-sm text-[#061c2b] outline-none transition placeholder:text-[#8a7a5c]/70 focus:border-[#d8ad61] disabled:bg-[#f7f3eb]/60"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
                  Alt text
                </span>
                <input
                  value={altText}
                  onChange={(event) => setAltText(event.target.value)}
                  disabled={!file || isUploading}
                  className="min-h-11 w-full border border-[#d8cfbf] bg-white px-3 text-sm text-[#061c2b] outline-none transition placeholder:text-[#8a7a5c]/70 focus:border-[#d8ad61] disabled:bg-[#f7f3eb]/60"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
                  Sort order
                </span>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  disabled={!file || isUploading}
                  className="min-h-11 w-full border border-[#d8cfbf] bg-white px-3 text-sm text-[#061c2b] outline-none transition placeholder:text-[#8a7a5c]/70 focus:border-[#d8ad61] disabled:bg-[#f7f3eb]/60"
                />
              </label>
            </div>

            {isVideoFile && (
              <div>
                <span className="mb-1.5 block text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
                  Video poster{" "}
                  <span className="font-medium normal-case tracking-normal text-[#8a7a5c]/70">
                    (optional)
                  </span>
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => posterInputRef.current?.click()}
                    className="border border-[#061c2b]/20 px-3 py-2 text-[0.65rem] font-bold tracking-[0.12em] text-[#061c2b] uppercase transition hover:border-[#d8ad61] hover:text-[#d8ad61]"
                  >
                    {poster ? "Change poster" : "Add poster"}
                  </button>
                  {posterPreviewUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={posterPreviewUrl}
                      alt="Poster preview"
                      className="size-12 object-cover border border-[#d8cfbf]"
                    />
                  )}
                </div>
                <input
                  ref={posterInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    setPoster(event.target.files?.[0] ?? null)
                  }
                />
              </div>
            )}

            <label className="flex items-center gap-2.5 text-sm text-[#2f4452]">
              <input
                type="checkbox"
                checked={publishOnUpload}
                onChange={(event) => setPublishOnUpload(event.target.checked)}
                disabled={!file || isUploading}
                className="size-4 accent-[#061c2b]"
              />
              Publish to public gallery immediately
            </label>

            <button
              type="submit"
              disabled={!file || isUploading}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#d8ad61] px-5 text-[0.7rem] font-bold tracking-[0.14em] text-[#102536] uppercase transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isUploading ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-[#102536]/25 border-t-[#102536]" />
                  Uploading…
                </>
              ) : (
                "Add to studio"
              )}
            </button>
          </form>
        </div>
      </section>

      {(error || success) && (
        <p
          role="status"
          className={`px-4 py-3 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-[#d8ad61]/40 bg-[#fff8eb] text-[#5c4a28]"
          }`}
        >
          {error || success}
        </p>
      )}

      {/* Library */}
      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-script text-2xl text-[#c99b4e]">Library</p>
            <p className="text-xs font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
              {filtered.length} item{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.map((entry) => {
                const active = filter === entry.id;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setFilter(entry.id)}
                    className={`px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.12em] uppercase transition ${
                      active
                        ? "bg-[#061c2b] text-[#d8ad61]"
                        : "border border-[#d8cfbf] text-[#4a5d6a] hover:border-[#d8ad61]"
                    }`}
                  >
                    {entry.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block w-full lg:max-w-xs">
            <span className="mb-1.5 block text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
              Search
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Title or caption…"
              className="min-h-11 w-full border border-[#d8cfbf] bg-white px-3 text-sm text-[#061c2b] outline-none transition placeholder:text-[#8a7a5c]/70 focus:border-[#d8ad61]"
            />
          </label>
        </div>

        {items.length === 0 ? (
          <div className="border border-[#d8cfbf] bg-white px-6 py-16 text-center">
            <p className="font-logo text-2xl text-[#061c2b]">Library is empty</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#4a5d6a]">
              Upload the first celebration photo or video above to start the
              public gallery.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-[#d8cfbf] bg-white px-6 py-14 text-center">
            <p className="font-logo text-2xl text-[#061c2b]">No matches</p>
            <p className="mt-2 text-sm text-[#4a5d6a]">
              Try another filter or search.
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item, index) => (
              <li
                key={item.id}
                className="overflow-hidden border border-[#d8cfbf] bg-white transition hover:border-[#d8ad61]/60 hover:shadow-[0_14px_36px_rgba(11,38,56,0.08)] animate-[menuItemRise_0.4s_ease-out_both]"
                style={{ animationDelay: `${Math.min(index, 9) * 40}ms` }}
              >
                <div className="relative aspect-[4/5] bg-[#061c2b]">
                  {item.mediaType === "video" && !item.posterUrl ? (
                    <video
                      src={item.mediaUrl}
                      className="absolute inset-0 size-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <Image
                      src={thumbSrc(item)}
                      alt={item.altText}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
                    <span
                      className={`px-2 py-1 text-[0.58rem] font-bold tracking-[0.12em] uppercase ${
                        item.isPublished
                          ? "bg-[#d8ad61] text-[#102536]"
                          : "bg-white/90 text-[#061c2b]"
                      }`}
                    >
                      {item.isPublished ? "Live" : "Draft"}
                    </span>
                    {item.mediaType === "video" && (
                      <span className="grid size-8 place-items-center rounded-full bg-[#061c2b]/55 text-white backdrop-blur-sm">
                        <PlayIcon />
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="font-logo text-xl text-[#061c2b]">{item.title}</p>
                  <p className="mt-0.5 text-[0.65rem] tracking-[0.1em] text-[#8a7a5c] uppercase">
                    {formatDate(item.createdAt)} · sort {item.sortOrder}
                  </p>
                  {item.caption && (
                    <p className="mt-2 line-clamp-2 text-sm text-[#4a5d6a]">
                      {item.caption}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="border border-[#061c2b]/20 px-2.5 py-1.5 text-[0.6rem] font-bold tracking-[0.1em] text-[#061c2b] uppercase transition hover:border-[#d8ad61] hover:text-[#d8ad61]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleTogglePublish(item)}
                      className="border border-[#061c2b]/20 px-2.5 py-1.5 text-[0.6rem] font-bold tracking-[0.1em] text-[#061c2b] uppercase transition hover:border-[#d8ad61] hover:text-[#d8ad61] disabled:opacity-50"
                    >
                      {item.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(item)}
                      className="border border-[#061c2b]/15 px-2.5 py-1.5 text-[0.6rem] font-bold tracking-[0.1em] text-[#061c2b]/70 uppercase transition hover:border-red-400 hover:bg-red-50 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-5">
          <button
            type="button"
            aria-label="Close editor"
            className="absolute inset-0 bg-[#061c2b]/65 backdrop-blur-sm"
            disabled={isBusy}
            onClick={() => !isBusy && setEditing(null)}
          />
          <div className="relative w-full max-w-lg border border-[#d8ad61]/35 bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.25)] animate-[scaleIn_0.35s_cubic-bezier(0.22,1,0.36,1)]">
            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
              Edit media
            </p>
            <h3 className="mt-2 font-logo text-2xl text-[#061c2b]">
              {editing.title}
            </h3>
            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1 block text-[0.65rem] font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
                  Title
                </span>
                <input
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="min-h-11 w-full border border-[#d8cfbf] bg-white px-3 text-sm text-[#061c2b] outline-none placeholder:text-[#8a7a5c]/70 focus:border-[#d8ad61]"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[0.65rem] font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
                  Caption
                </span>
                <textarea
                  value={editCaption}
                  onChange={(event) => setEditCaption(event.target.value)}
                  rows={3}
                  className="w-full border border-[#d8cfbf] bg-white px-3 py-2 text-sm text-[#061c2b] outline-none placeholder:text-[#8a7a5c]/70 focus:border-[#d8ad61]"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[0.65rem] font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
                    Alt text
                  </span>
                  <input
                    value={editAlt}
                    onChange={(event) => setEditAlt(event.target.value)}
                    className="min-h-11 w-full border border-[#d8cfbf] bg-white px-3 text-sm text-[#061c2b] outline-none placeholder:text-[#8a7a5c]/70 focus:border-[#d8ad61]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[0.65rem] font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
                    Sort
                  </span>
                  <input
                    type="number"
                    value={editSort}
                    onChange={(event) => setEditSort(event.target.value)}
                    className="min-h-11 w-full border border-[#d8cfbf] bg-white px-3 text-sm text-[#061c2b] outline-none placeholder:text-[#8a7a5c]/70 focus:border-[#d8ad61]"
                  />
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm text-[#2f4452]">
                <input
                  type="checkbox"
                  checked={editPublished}
                  onChange={(event) => setEditPublished(event.target.checked)}
                  className="size-4 accent-[#061c2b]"
                />
                Published on public gallery
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={isBusy}
                onClick={saveEdit}
                className="inline-flex min-h-11 items-center gap-2 bg-[#061c2b] px-5 text-[0.7rem] font-bold tracking-[0.12em] text-[#d8ad61] uppercase disabled:opacity-70"
              >
                {isBusy ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => setEditing(null)}
                className="min-h-11 border border-[#061c2b]/25 px-5 text-[0.7rem] font-bold tracking-[0.12em] text-[#061c2b] uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-5">
          <button
            type="button"
            aria-label="Cancel delete"
            className="absolute inset-0 bg-[#061c2b]/65 backdrop-blur-sm"
            disabled={isBusy}
            onClick={() => !isBusy && setPendingDelete(null)}
          />
          <div className="relative w-full max-w-md border border-[#d8ad61]/35 bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.25)] animate-[scaleIn_0.35s_cubic-bezier(0.22,1,0.36,1)]">
            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
              Confirm
            </p>
            <h3 className="mt-2 font-logo text-2xl text-[#061c2b]">
              Delete this media?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4a5d6a]">
              Removes{" "}
              <span className="font-semibold text-[#061c2b]">
                {pendingDelete.title}
              </span>{" "}
              from the library and storage. This cannot be undone.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={isBusy}
                onClick={confirmDelete}
                className="inline-flex min-h-11 items-center gap-2 bg-red-700 px-5 text-[0.7rem] font-bold tracking-[0.12em] text-white uppercase disabled:opacity-70"
              >
                {isBusy ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => setPendingDelete(null)}
                className="min-h-11 border border-[#061c2b]/25 px-5 text-[0.7rem] font-bold tracking-[0.12em] text-[#061c2b] uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
