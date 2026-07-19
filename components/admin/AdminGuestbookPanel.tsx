"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  deleteGuestbookMessage,
  getAdminGuestbookMessages,
} from "@/app/actions/admin-guestbook";
import type { GuestbookMessage } from "@/app/actions/guestbook";

const PAGE_SIZE = 8;

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

type AdminGuestbookPanelProps = {
  initialMessages: GuestbookMessage[];
};

export function AdminGuestbookPanel({
  initialMessages,
}: AdminGuestbookPanelProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<GuestbookMessage | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, startRefresh] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;

    return messages.filter((entry) => {
      const haystack = [
        entry.authorName,
        entry.location ?? "",
        entry.message,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [messages, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageMessages = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleRefresh = () => {
    setError(null);
    startRefresh(async () => {
      try {
        const next = await getAdminGuestbookMessages();
        setMessages(next);
      } catch {
        setError("Could not refresh messages. Please try again.");
      }
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteGuestbookMessage(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setMessages((current) => current.filter((entry) => entry.id !== id));
      setPendingDelete(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-xs font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
            {filtered.length} message{filtered.length === 1 ? "" : "s"}
            {query.trim() ? " matching" : " total"}
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isPending}
            aria-label={isRefreshing ? "Refreshing messages" : "Refresh messages"}
            title="Refresh"
            className="grid size-8 place-items-center border border-[#061c2b]/15 text-[#061c2b]/70 transition hover:border-[#d8ad61] hover:text-[#d8ad61] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-2.6-6.3" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
        </div>
        <label className="block w-full sm:max-w-xs">
          <span className="mb-1.5 block text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
            Search
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Name, place, or message…"
            className="min-h-11 w-full border border-[#d8cfbf] bg-white px-3 text-sm text-[#061c2b] outline-none transition placeholder:text-[#8a7a5c]/70 focus:border-[#d8ad61]"
          />
        </label>
      </div>

      {error && (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {messages.length === 0 ? (
        <div className="border border-[#d8cfbf] bg-white px-6 py-16 text-center">
          <p className="font-logo text-2xl text-[#061c2b]">No messages yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#4a5d6a]">
            When guests sign the public guestbook, their notes will appear here
            for you to review.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#d8cfbf] bg-white px-6 py-14 text-center">
          <p className="font-logo text-2xl text-[#061c2b]">No matches</p>
          <p className="mt-2 text-sm text-[#4a5d6a]">
            Try a different search for name, place, or message text.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden border border-[#d8cfbf] bg-white">
            <ul className="divide-y divide-[#ebe4d8]">
              {pageMessages.map((entry, index) => (
                <li
                  key={entry.id}
                  className="flex flex-col gap-4 px-5 py-5 transition hover:bg-[#fbf8f2] sm:flex-row sm:items-start sm:justify-between animate-[menuItemRise_0.4s_ease-out_both]"
                  style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="font-logo text-xl text-[#061c2b]">
                        {entry.authorName}
                      </p>
                      {entry.location && (
                        <p className="text-xs tracking-[0.08em] text-[#8a7a5c] uppercase">
                          {entry.location}
                        </p>
                      )}
                    </div>
                    <p className="mt-1 text-[0.7rem] tracking-[0.08em] text-[#8a7a5c]/80 uppercase">
                      {formatDate(entry.createdAt)}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[#2f4452]">
                      {entry.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setPendingDelete(entry);
                    }}
                    className="shrink-0 self-start border border-[#061c2b]/20 px-3 py-2 text-[0.65rem] font-bold tracking-[0.12em] text-[#061c2b] uppercase transition hover:border-red-400 hover:bg-red-50 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="border border-[#061c2b] px-4 py-2 text-[0.65rem] font-bold tracking-[0.12em] text-[#061c2b] uppercase transition hover:bg-[#061c2b] hover:text-[#d8ad61] disabled:cursor-not-allowed disabled:opacity-35"
              >
                ← Previous
              </button>
              <p className="text-xs tracking-[0.1em] text-[#8a7a5c] uppercase">
                Page {page} / {totalPages}
              </p>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="bg-[#061c2b] px-4 py-2 text-[0.65rem] font-bold tracking-[0.12em] text-[#d8ad61] uppercase transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-5">
          <button
            type="button"
            aria-label="Cancel delete"
            className="absolute inset-0 bg-[#061c2b]/65 backdrop-blur-sm animate-[fadeIn_0.25s_ease-out]"
            disabled={isPending}
            onClick={() => !isPending && setPendingDelete(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-guestbook-title"
            className="relative w-full max-w-md border border-[#d8ad61]/35 bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.25)] animate-[scaleIn_0.35s_cubic-bezier(0.22,1,0.36,1)]"
          >
            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
              Confirm
            </p>
            <h3
              id="delete-guestbook-title"
              className="mt-2 font-logo text-2xl text-[#061c2b]"
            >
              Delete this message?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4a5d6a]">
              This removes{" "}
              <span className="font-semibold text-[#061c2b]">
                {pendingDelete.authorName}
              </span>
              ’s note from the public guestbook. This cannot be undone.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={confirmDelete}
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-red-700 px-5 text-[0.7rem] font-bold tracking-[0.12em] text-white uppercase transition hover:bg-red-800 disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deleting…
                  </>
                ) : (
                  "Delete message"
                )}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setPendingDelete(null)}
                className="min-h-11 border border-[#061c2b]/25 px-5 text-[0.7rem] font-bold tracking-[0.12em] text-[#061c2b] uppercase transition hover:border-[#d8ad61] hover:text-[#d8ad61] disabled:opacity-50"
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
