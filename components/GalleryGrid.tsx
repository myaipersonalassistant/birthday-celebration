"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryItem } from "@/lib/gallery-data";

type GalleryGridProps = {
  items: GalleryItem[];
};

function thumbnailSrc(item: GalleryItem) {
  if (item.mediaType === "video") {
    return item.posterUrl || item.mediaUrl;
  }
  return item.mediaUrl;
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 5.14v13.72L19 12 8 5.14z" />
    </svg>
  );
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? 0 : (current + 1) % items.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? 0 : (current - 1 + items.length) % items.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, items.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }, [activeIndex]);

  const lightbox =
    isMounted &&
    activeItem &&
    createPortal(
      <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8">
        <button
          type="button"
          aria-label="Close gallery"
          className="absolute inset-0 bg-[#061c2b]/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]"
          onClick={() => setActiveIndex(null)}
        />

        <div className="relative z-10 flex w-full max-w-4xl flex-col animate-[scaleIn_0.4s_cubic-bezier(0.22,1,0.36,1)]">
          <div className="relative aspect-[4/3] overflow-hidden border border-[#d8ad61]/35 bg-[#061c2b]">
            {activeItem.mediaType === "video" ? (
              <video
                key={activeItem.id}
                ref={videoRef}
                src={activeItem.mediaUrl}
                poster={activeItem.posterUrl || undefined}
                controls
                playsInline
                className="absolute inset-0 size-full object-contain bg-black"
              >
                Your browser does not support this video.
              </video>
            ) : (
              <Image
                src={activeItem.mediaUrl}
                alt={activeItem.altText}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-contain"
                priority
              />
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3 text-white">
            <div>
              <p className="font-logo text-2xl">{activeItem.title}</p>
              {activeItem.caption && (
                <p className="mt-1 text-sm text-white/70">{activeItem.caption}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === null
                      ? 0
                      : (current - 1 + items.length) % items.length,
                  )
                }
                className="grid size-10 place-items-center border border-white/25 text-white transition-colors hover:border-[#d8ad61] hover:text-[#d8ad61]"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() =>
                  setActiveIndex((current) =>
                    current === null ? 0 : (current + 1) % items.length,
                  )
                }
                className="grid size-10 place-items-center border border-white/25 text-white transition-colors hover:border-[#d8ad61] hover:text-[#d8ad61]"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );

  if (items.length === 0) {
    return (
      <div className="border border-[#d8cfbf] bg-white/60 px-6 py-20 text-center animate-[fadeIn_0.5s_ease-out]">
        <p className="font-logo text-3xl text-[#061c2b]">Moments on the way</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#4a5d6a]">
          Photos and videos from the celebration will appear here soon.
        </p>
      </div>
    );
  }

  return (
    <>
      {lightbox}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const thumb = thumbnailSrc(item);
          const isVideo = item.mediaType === "video";

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative overflow-hidden border border-[#d8cfbf] bg-white text-left shadow-[0_12px_30px_rgba(11,38,56,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-[#d8ad61]/70 hover:shadow-[0_18px_40px_rgba(11,38,56,0.12)] animate-[menuItemRise_0.5s_ease-out_both]"
              style={{ animationDelay: `${Math.min(index, 12) * 70}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={thumb}
                  alt={item.altText}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061c2b]/75 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                {isVideo && (
                  <span className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-[#061c2b]/55 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <PlayIcon className="ml-0.5 size-6" />
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="font-logo text-xl">{item.title}</p>
                  {item.caption && (
                    <p className="mt-1 line-clamp-2 text-sm text-white/75">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
