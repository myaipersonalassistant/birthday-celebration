"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import {
  GuestbookMessage,
  submitGuestbookMessage,
} from "@/app/actions/guestbook";

const PAGE_SIZE = 6;
const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-0", "rotate-2", "-rotate-1"];

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

type GuestbookExperienceProps = {
  initialMessages: GuestbookMessage[];
};

export function GuestbookExperience({ initialMessages }: GuestbookExperienceProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [page, setPage] = useState(1);
  const [authorName, setAuthorName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  const totalPages = Math.max(1, Math.ceil(messages.length / PAGE_SIZE));

  const pageMessages = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return messages.slice(start, start + PAGE_SIZE);
  }, [messages, page]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!showSuccess) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showSuccess]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await submitGuestbookMessage({
        authorName,
        location,
        message,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setMessages((current) => [result.entry, ...current]);
      setPage(1);
      setSuccessName(result.entry.authorName);
      setAuthorName("");
      setLocation("");
      setMessage("");
      setShowSuccess(true);
    });
  };

  const successModal =
    isMounted &&
    showSuccess &&
    createPortal(
      <div className="fixed inset-0 z-[80] flex items-center justify-center px-5">
        <button
          type="button"
          aria-label="Close success dialog"
          className="absolute inset-0 bg-[#061c2b]/70 backdrop-blur-sm animate-[fadeIn_0.35s_ease-out]"
          onClick={() => setShowSuccess(false)}
        />
        <div className="relative w-full max-w-md overflow-hidden border border-[#d8ad61]/40 bg-[#0b2638] px-8 py-10 text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] animate-[scaleIn_0.45s_cubic-bezier(0.22,1,0.36,1)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 size-40 -translate-x-1/2 rounded-full bg-[#d8ad61]/20 blur-3xl animate-[softPulse_2s_ease-out_infinite]"
          />
          <div className="relative mx-auto grid size-14 place-items-center rounded-full border border-[#d8ad61] bg-[#d8ad61]/15 text-[#d8ad61] animate-[heartBeat_1.2s_ease-in-out_infinite]">
            <span className="font-script text-3xl leading-none">♥</span>
          </div>
          <p className="relative mt-5 animate-[menuItemRise_0.5s_ease-out_0.1s_both] font-script text-4xl text-[#d8ad61]">
            With love
          </p>
          <h3 className="relative mt-2 animate-[menuItemRise_0.5s_ease-out_0.18s_both] font-logo text-2xl">
            Thank you, {successName || "friend"}
          </h3>
          <p className="relative mt-3 animate-[menuItemRise_0.5s_ease-out_0.26s_both] text-sm leading-relaxed text-white/75">
            Your note is in the guestbook — Angela will treasure every word left for this
            celebration.
          </p>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className="relative mt-7 inline-flex min-h-11 items-center justify-center rounded-sm bg-[#d7ad62] px-8 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-all duration-300 hover:scale-[1.03] hover:bg-[#edca87] animate-[softPulse_1.8s_ease-out_infinite]"
          >
            Keep reading
          </button>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      {successModal}

      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        <section className="relative overflow-hidden border border-[#d8cfbf] bg-[#061c2b] px-5 py-8 text-white sm:px-8 sm:py-10">
          <div className="pointer-events-none absolute -top-10 right-0 size-40 rounded-full bg-[#d8ad61]/15 blur-3xl" />
          <p className="font-script text-2xl text-[#d8ad61]">Leave a note</p>
          <h2 className="mt-2 font-logo text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
            Write in the guestbook
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Share a blessing, a memory, or a birthday wish — your words become part of Angela’s
            celebration story.
          </p>

          <form onSubmit={handleSubmit} className="relative mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-[0.65rem] font-bold tracking-[0.14em] text-[#d8ad61] uppercase">
                Your Name
              </span>
              <input
                type="text"
                required
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                placeholder="How should we sign your note?"
                className="min-h-12 w-full border border-white/25 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#d8ad61]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[0.65rem] font-bold tracking-[0.14em] text-[#d8ad61] uppercase">
                From{" "}
                <span className="font-medium tracking-normal normal-case text-white/45">
                  (optional)
                </span>
              </span>
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City, country, or your connection"
                className="min-h-12 w-full border border-white/25 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#d8ad61]"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center justify-between text-[0.65rem] font-bold tracking-[0.14em] text-[#d8ad61] uppercase">
                <span>Your Message</span>
                <span className="font-medium tracking-normal normal-case text-white/45">
                  {message.length}/600
                </span>
              </span>
              <textarea
                required
                value={message}
                onChange={(event) => setMessage(event.target.value.slice(0, 600))}
                rows={6}
                placeholder="Dear Angela…"
                className="w-full border border-white/25 bg-transparent px-4 py-3 font-display text-base leading-relaxed text-white outline-none placeholder:text-white/45 focus:border-[#d8ad61]"
              />
            </label>

            {error && (
              <p className="text-sm text-[#f0b4b4]" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={`group relative inline-flex min-h-12 w-full items-center justify-center overflow-hidden rounded-sm bg-[#d7ad62] px-8 text-[0.7rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-all duration-300 hover:scale-[1.02] hover:bg-[#edca87] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit ${
                isPending ? "" : "animate-[softPulse_2s_ease-out_infinite]"
              }`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative inline-flex items-center gap-2">
                {isPending ? (
                  <>
                    <span className="size-3 animate-spin rounded-full border-2 border-[#102536]/30 border-t-[#102536]" />
                    Signing...
                  </>
                ) : (
                  <>
                    Sign the Guestbook
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </>
                )}
              </span>
            </button>
          </form>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-script text-2xl text-[#c99b4e]">Open pages</p>
              <h2 className="mt-1 font-logo text-3xl font-medium tracking-[-0.02em] text-[#0b2638] sm:text-4xl">
                Messages for Angela
              </h2>
            </div>
            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#8a7348] uppercase">
              {messages.length} note{messages.length === 1 ? "" : "s"}
              {messages.length > PAGE_SIZE ? ` · Page ${page}/${totalPages}` : ""}
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="mt-8 border border-dashed border-[#d8cfbf] bg-white/60 px-6 py-16 text-center">
              <p className="font-script text-3xl text-[#c99b4e]">Be the first</p>
              <p className="mt-3 text-sm text-[#4a5d6a]">
                The guestbook is waiting for its opening words.
              </p>
            </div>
          ) : (
            <>
              <div
                key={page}
                className="mt-8 columns-1 gap-4 animate-[menuItemRise_0.4s_ease-out] sm:columns-2"
              >
                {pageMessages.map((entry, index) => (
                  <article
                    key={entry.id}
                    className={`mb-4 break-inside-avoid border border-[#d8cfbf] bg-[#fbf8f2] p-5 shadow-[0_12px_30px_rgba(11,38,56,0.06)] transition-transform duration-300 hover:-translate-y-1 ${
                      rotations[index % rotations.length]
                    }`}
                    style={{ animationDelay: `${index * 45}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-script text-3xl leading-none text-[#d8ad61]">“</span>
                      <p className="text-[0.6rem] tracking-[0.12em] text-[#8a7348]/70 uppercase">
                        {formatDate(entry.createdAt)}
                      </p>
                    </div>
                    <p className="mt-2 font-display text-[1.05rem] leading-relaxed text-[#0b2638]">
                      {entry.message}
                    </p>
                    <div className="mt-5 border-t border-[#e8e0d2] pt-4">
                      <p className="font-logo text-lg font-semibold text-[#061c2b]">
                        {entry.authorName}
                      </p>
                      {entry.location && (
                        <p className="mt-0.5 text-xs tracking-[0.08em] text-[#8a7348] uppercase">
                          {entry.location}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#d8cfbf] pt-5">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    className="inline-flex min-h-10 items-center gap-2 border border-[#061c2b] px-4 text-[0.65rem] font-extrabold tracking-[0.14em] text-[#061c2b] uppercase transition-all hover:bg-[#061c2b] hover:text-[#d8ad61] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      const isActive = pageNumber === page;
                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          aria-label={`Go to page ${pageNumber}`}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setPage(pageNumber)}
                          className={`grid size-9 place-items-center text-[0.7rem] font-bold transition-all duration-300 ${
                            isActive
                              ? "bg-[#061c2b] text-[#d8ad61] scale-105"
                              : "border border-[#d8cfbf] text-[#4a5d6a] hover:border-[#d8ad61]"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page === totalPages}
                    className="inline-flex min-h-10 items-center gap-2 bg-[#061c2b] px-4 text-[0.65rem] font-extrabold tracking-[0.14em] text-[#d8ad61] uppercase transition-all hover:bg-[#0d3044] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
