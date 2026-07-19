"use client";

import { useEffect, useRef, useState } from "react";

type InvitationPlayerProps = {
  videoUrl: string | null;
  posterUrl?: string | null;
};

export function InvitationPlayer({
  videoUrl,
  posterUrl,
}: InvitationPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showUnmute, setShowUnmute] = useState(false);

  useEffect(() => {
    if (!videoUrl) return;

    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let cancelled = false;

    const tryPlay = async () => {
      if (cancelled) return;
      try {
        video.muted = false;
        await video.play();
        if (!cancelled) setShowUnmute(false);
      } catch {
        // Browsers block unmuted autoplay — start muted, offer sound.
        try {
          video.muted = true;
          await video.play();
          if (!cancelled) setShowUnmute(true);
        } catch {
          // Still blocked until the user taps play in controls.
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          void tryPlay();
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.45, 0.7] },
    );

    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [videoUrl]);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setShowUnmute(false);
    void video.play();
  };

  if (!videoUrl) {
    return (
      <div className="mx-auto w-full max-w-[320px] sm:max-w-[360px]">
        <div className="relative flex aspect-[9/16] items-center justify-center overflow-hidden bg-black/40 px-6 text-center ring-1 ring-[#d8ad61]/25">
          <p className="text-sm leading-relaxed text-white/55">
            The invitation video will appear here soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[320px] sm:max-w-[360px]"
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-black/40 ring-1 ring-[#d8ad61]/25">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl ?? undefined}
          controls
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-contain"
          title="Invitation from Chris — Angela Ifonlaja celebration"
        >
          Your browser does not support the video tag.
        </video>

        {showUnmute ? (
          <button
            type="button"
            onClick={handleUnmute}
            className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 border border-[#d8ad61]/50 bg-[#061c2b]/90 px-4 py-2 text-[0.65rem] font-bold tracking-[0.14em] text-[#d8ad61] uppercase backdrop-blur-sm transition hover:bg-[#061c2b]"
          >
            Tap for sound
          </button>
        ) : null}
      </div>
    </div>
  );
}
