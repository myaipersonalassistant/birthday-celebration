"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type InvitationPlayerProps = {
  videoUrl: string | null;
  posterUrl?: string | null;
};

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M8.4 6.2a1 1 0 0 1 1.52-.86l9.1 5.3a1 1 0 0 1 0 1.72l-9.1 5.3A1 1 0 0 1 8 16.8V7.2a1 1 0 0 1 .4-1Z" />
    </svg>
  );
}

export function InvitationPlayer({
  videoUrl,
  posterUrl,
}: InvitationPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [showUnmute, setShowUnmute] = useState(false);

  const showLogoOverlay = !videoUrl || !inView || !isPlaying || hasEnded;

  const clearPlayDelay = useCallback(() => {
    if (playDelayTimerRef.current) {
      clearTimeout(playDelayTimerRef.current);
      playDelayTimerRef.current = null;
    }
  }, []);

  const tryPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    clearPlayDelay();
    setHasEnded(false);
    try {
      video.muted = false;
      await video.play();
      setShowUnmute(false);
    } catch {
      try {
        video.muted = true;
        await video.play();
        setShowUnmute(true);
      } catch {
        // User must tap play.
      }
    }
  }, [clearPlayDelay]);

  useEffect(() => {
    if (!videoUrl) return;

    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let cancelled = false;

    const onPlay = () => {
      if (!cancelled) {
        setIsPlaying(true);
        setHasEnded(false);
      }
    };
    const onPause = () => {
      if (!cancelled) setIsPlaying(false);
    };
    const onEnded = () => {
      if (!cancelled) {
        setIsPlaying(false);
        setHasEnded(true);
        setShowUnmute(false);
      }
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || cancelled) return;

        const visible =
          entry.isIntersecting && entry.intersectionRatio >= 0.45;
        setInView(visible);

        clearPlayDelay();

        if (visible && !video.ended && video.paused) {
          // Hold the logo overlay briefly so visitors can see it before autoplay.
          playDelayTimerRef.current = setTimeout(() => {
            if (cancelled) return;
            if (!video.ended && video.paused) {
              void tryPlay();
            }
          }, 1000);
        } else if (!visible) {
          video.pause();
        }
      },
      { threshold: [0, 0.45, 0.7] },
    );

    observer.observe(container);

    return () => {
      cancelled = true;
      clearPlayDelay();
      observer.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [videoUrl, tryPlay, clearPlayDelay]);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setShowUnmute(false);
    void video.play();
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setHasEnded(false);
    void tryPlay();
  };

  const handleOverlayPlay = () => {
    if (hasEnded) {
      handleReplay();
      return;
    }
    void tryPlay();
  };

  if (!videoUrl) {
    return (
      <div className="mx-auto w-full max-w-[320px] sm:max-w-[360px]">
        <div className="relative flex aspect-[9/16] flex-col items-center justify-center overflow-hidden bg-[#020b12] px-6 text-center ring-1 ring-[#d8ad61]/25">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(216,173,97,0.22),transparent_55%)]"
          />
          <Image
            src="/logobg.png"
            alt="Celebrate Angela Ifonlaja"
            width={280}
            height={340}
            className="relative h-44 w-auto object-contain mix-blend-screen sm:h-52"
          />
          <p className="relative mt-6 text-sm leading-relaxed text-white/55">
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
      <div className="relative aspect-[9/16] overflow-hidden bg-[#020b12] ring-1 ring-[#d8ad61]/25">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl ?? undefined}
          controls={!showLogoOverlay}
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
            showLogoOverlay && !hasEnded ? "opacity-40" : "opacity-100"
          }`}
          title="Invitation from Chris — Angela Ifonlaja celebration"
        >
          Your browser does not support the video tag.
        </video>

        {/* Soft veil when idle / out of view */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(6,28,43,0.35),rgba(2,11,18,0.88))] transition-opacity duration-500 ${
            showLogoOverlay ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Logo + end CTAs overlay */}
        <div
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-5 transition-all duration-500 ${
            showLogoOverlay
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          }`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(216,173,97,0.28),transparent_52%)]"
          />

          <button
            type="button"
            onClick={handleOverlayPlay}
            aria-label={hasEnded ? "Watch invitation again" : "Play invitation"}
            className="group relative flex flex-col items-center"
          >
            <Image
              src="/logobg.png"
              alt=""
              width={280}
              height={340}
              priority
              className={`w-auto object-contain mix-blend-screen transition-transform duration-500 group-hover:scale-[1.03] ${
                hasEnded ? "h-36 sm:h-40" : "h-44 sm:h-52"
              }`}
            />
            {!hasEnded ? (
              <span className="mt-5 inline-flex items-center gap-2 border border-[#d8ad61]/45 bg-[#061c2b]/70 px-4 py-2 text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase backdrop-blur-sm transition group-hover:border-[#d8ad61] group-hover:bg-[#061c2b]">
                <PlayGlyph className="size-3 translate-x-px" />
                {inView ? "Play invitation" : "Watch invitation"}
              </span>
            ) : null}
          </button>

          {hasEnded ? (
            <div className="relative mt-5 flex w-full max-w-[240px] flex-col items-stretch gap-3 animate-[scaleIn_0.55s_ease-out_both]">
              <p className="font-script text-2xl text-[#d8ad61]">
                you&apos;re invited
              </p>
              <div className="mx-auto h-px w-10 bg-[#d8ad61]/60" />
              <Link
                href="/rsvp"
                className="inline-flex min-h-11 items-center justify-center rounded-sm bg-[#d7ad62] px-5 text-[0.62rem] font-extrabold tracking-[0.16em] text-[#102536] shadow-[0_10px_28px_rgba(215,173,98,0.35)] transition hover:bg-[#edca87]"
              >
                RESERVE YOUR PLACE
              </Link>
              <Link
                href="/guestbook"
                className="inline-flex min-h-11 items-center justify-center border border-white/25 px-5 text-[0.62rem] font-extrabold tracking-[0.14em] text-white/90 transition hover:border-[#d8ad61] hover:text-[#e4be77]"
              >
                LEAVE A MESSAGE
              </Link>
              <button
                type="button"
                onClick={handleReplay}
                className="mt-1 text-[0.65rem] font-semibold tracking-[0.14em] text-white/45 uppercase transition hover:text-[#d8ad61]"
              >
                Watch again
              </button>
            </div>
          ) : null}
        </div>

        {showUnmute && isPlaying && !hasEnded ? (
          <button
            type="button"
            onClick={handleUnmute}
            className="absolute bottom-14 left-1/2 z-20 -translate-x-1/2 border border-[#d8ad61]/50 bg-[#061c2b]/90 px-4 py-2 text-[0.65rem] font-bold tracking-[0.14em] text-[#d8ad61] uppercase backdrop-blur-sm transition hover:bg-[#061c2b]"
          >
            Tap for sound
          </button>
        ) : null}
      </div>
    </div>
  );
}
