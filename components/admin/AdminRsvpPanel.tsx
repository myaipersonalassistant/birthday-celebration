"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  deleteRsvpSubmission,
  getAdminRsvpSubmissions,
  type RsvpSubmission,
} from "@/app/actions/admin-rsvp";
import { downloadRsvpCsv } from "@/lib/rsvp-csv";

const PAGE_SIZE = 6;

const countryLabels: Record<string, string> = {
  spain: "Spain",
  nigeria: "Nigeria",
  uk: "United Kingdom",
  usa: "United States",
  other: "Other",
};

type PlanFilter = "all" | "dinner" | "cruise" | "plus-one";

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

function countryLabel(value: string) {
  return countryLabels[value] ?? value;
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

type AdminRsvpPanelProps = {
  initialSubmissions: RsvpSubmission[];
};

export function AdminRsvpPanel({ initialSubmissions }: AdminRsvpPanelProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("all");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<RsvpSubmission | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, startRefresh] = useTransition();

  const stats = useMemo(() => {
    let dinner = 0;
    let cruise = 0;
    let plusOnes = 0;
    let headcount = 0;
    const byCountry = new Map<string, number>();

    for (const entry of submissions) {
      headcount += 1 + (entry.bringingGuest ? 1 : 0);
      if (entry.attendDinner) dinner += 1;
      if (entry.joinCruise) cruise += 1;
      if (entry.bringingGuest) plusOnes += 1;
      byCountry.set(
        entry.country,
        (byCountry.get(entry.country) ?? 0) + 1,
      );
    }

    const countries = [...byCountry.entries()]
      .map(([code, count]) => ({ code, count, label: countryLabel(code) }))
      .sort((a, b) => b.count - a.count);

    return {
      responses: submissions.length,
      dinner,
      cruise,
      plusOnes,
      headcount,
      countries,
    };
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return submissions.filter((entry) => {
      if (planFilter === "dinner" && !entry.attendDinner) return false;
      if (planFilter === "cruise" && !entry.joinCruise) return false;
      if (planFilter === "plus-one" && !entry.bringingGuest) return false;

      if (!q) return true;

      const haystack = [
        entry.firstName,
        entry.lastName,
        entry.email,
        entry.phone ?? "",
        countryLabel(entry.country),
        entry.guestName ?? "",
        entry.message ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [submissions, query, planFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleRefresh = () => {
    setError(null);
    startRefresh(async () => {
      try {
        const next = await getAdminRsvpSubmissions();
        setSubmissions(next);
      } catch {
        setError("Could not refresh RSVPs. Please try again.");
      }
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteRsvpSubmission(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSubmissions((current) => current.filter((entry) => entry.id !== id));
      setPendingDelete(null);
    });
  };

  const filters: { id: PlanFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "dinner", label: "Dinner" },
    { id: "cruise", label: "Cruise" },
    { id: "plus-one", label: "+1" },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden border border-[#061c2b] bg-[#061c2b] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(216,173,97,0.22),transparent_42%),radial-gradient(circle_at_90%_85%,rgba(216,173,97,0.08),transparent_35%)]" />
        <div className="relative px-5 py-6 sm:px-7 sm:py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
                Guest list
              </p>
              <h2 className="mt-1 font-logo text-3xl tracking-[-0.02em] sm:text-4xl">
                Celebration RSVPs
              </h2>
              <p className="mt-2 text-sm text-white/55">
                Dinner, cruise, and plus-ones at a glance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => downloadRsvpCsv(filtered)}
                disabled={filtered.length === 0}
                className="border border-white/20 px-3 py-2 text-[0.65rem] font-bold tracking-[0.12em] text-white/80 uppercase transition hover:border-[#d8ad61] hover:text-[#d8ad61] disabled:cursor-not-allowed disabled:opacity-40"
                title={
                  filtered.length === submissions.length
                    ? "Export all RSVPs as CSV"
                    : "Export the currently filtered RSVPs as CSV"
                }
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing || isPending}
                aria-label={isRefreshing ? "Refreshing" : "Refresh"}
                title="Refresh"
                className="grid size-9 place-items-center border border-white/20 text-white/70 transition hover:border-[#d8ad61] hover:text-[#d8ad61] disabled:opacity-50"
              >
                <RefreshIcon spinning={isRefreshing} />
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Responses", value: stats.responses },
              { label: "Headcount", value: stats.headcount },
              { label: "Dinner", value: stats.dinner },
              { label: "Cruise", value: stats.cruise },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-white/10 bg-white/[0.04] px-4 py-4"
              >
                <p className="text-[0.6rem] font-bold tracking-[0.14em] text-white/40 uppercase">
                  {stat.label}
                </p>
                <p className="mt-1 font-logo text-3xl tabular-nums text-[#d8ad61]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {stats.countries.length > 0 && (
            <div className="mt-6">
              <p className="text-[0.6rem] font-bold tracking-[0.14em] text-white/40 uppercase">
                By country
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {stats.countries.map((entry) => (
                  <span
                    key={entry.code}
                    className="border border-white/15 px-3 py-1.5 text-xs text-white/75"
                  >
                    {entry.label}
                    <span className="ml-2 font-semibold text-[#d8ad61]">
                      {entry.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-script text-2xl text-[#c99b4e]">Responses</p>
            <p className="text-xs font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
              {filtered.length} shown
              {stats.plusOnes > 0 ? ` · ${stats.plusOnes} plus-one` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.map((filter) => {
                const active = planFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => {
                      setPlanFilter(filter.id);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.12em] uppercase transition ${
                      active
                        ? "bg-[#061c2b] text-[#d8ad61]"
                        : "border border-[#d8cfbf] text-[#4a5d6a] hover:border-[#d8ad61]"
                    }`}
                  >
                    {filter.label}
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
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Name, email, guest, message…"
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

        {submissions.length === 0 ? (
          <div className="border border-[#d8cfbf] bg-white px-6 py-16 text-center">
            <p className="font-logo text-2xl text-[#061c2b]">No RSVPs yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#4a5d6a]">
              When guests complete the RSVP form, their plans will appear here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-[#d8cfbf] bg-white px-6 py-14 text-center">
            <p className="font-logo text-2xl text-[#061c2b]">No matches</p>
            <p className="mt-2 text-sm text-[#4a5d6a]">
              Try another filter or search term.
            </p>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {pageRows.map((entry, index) => (
                <li
                  key={entry.id}
                  className="border border-[#d8cfbf] bg-white p-5 transition hover:border-[#d8ad61]/55 hover:shadow-[0_12px_30px_rgba(11,38,56,0.07)] animate-[menuItemRise_0.4s_ease-out_both]"
                  style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="font-logo text-2xl text-[#061c2b]">
                          {entry.firstName} {entry.lastName}
                        </p>
                        <p className="text-xs tracking-[0.08em] text-[#8a7a5c] uppercase">
                          {countryLabel(entry.country)}
                        </p>
                      </div>
                      <p className="mt-1 text-[0.7rem] tracking-[0.08em] text-[#8a7a5c]/80 uppercase">
                        {formatDate(entry.createdAt)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {entry.attendDinner && (
                          <span className="bg-[#061c2b] px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.1em] text-[#d8ad61] uppercase">
                            Dinner
                          </span>
                        )}
                        {entry.joinCruise && (
                          <span className="border border-[#061c2b] px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.1em] text-[#061c2b] uppercase">
                            Cruise
                          </span>
                        )}
                        {entry.bringingGuest && (
                          <span className="border border-[#d8ad61] bg-[#fff8eb] px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.1em] text-[#6b5428] uppercase">
                            +1 {entry.guestName ? `· ${entry.guestName}` : ""}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 grid gap-1 text-sm text-[#2f4452] sm:grid-cols-2">
                        <p>
                          <span className="text-[#8a7a5c]">Email · </span>
                          <a
                            href={`mailto:${entry.email}`}
                            className="underline decoration-[#d8cfbf] underline-offset-2 transition hover:text-[#d8ad61]"
                          >
                            {entry.email}
                          </a>
                        </p>
                        {entry.phone && (
                          <p>
                            <span className="text-[#8a7a5c]">Phone · </span>
                            {entry.phone}
                          </p>
                        )}
                      </div>

                      {entry.message?.trim() && (
                        <div className="mt-4 border-l-2 border-[#d8ad61] pl-3">
                          <p className="text-[0.6rem] font-bold tracking-[0.12em] text-[#8a7a5c] uppercase">
                            Message
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-[#2f4452]">
                            {entry.message}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setPendingDelete(entry);
                      }}
                      className="shrink-0 self-start border border-[#061c2b]/15 px-2.5 py-1.5 text-[0.6rem] font-bold tracking-[0.1em] text-[#061c2b]/70 uppercase transition hover:border-red-400 hover:bg-red-50 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((c) => Math.max(1, c - 1))}
                  className="border border-[#061c2b] px-4 py-2 text-[0.65rem] font-bold tracking-[0.12em] text-[#061c2b] uppercase transition hover:bg-[#061c2b] hover:text-[#d8ad61] disabled:opacity-35"
                >
                  ← Previous
                </button>
                <p className="text-xs tracking-[0.1em] text-[#8a7a5c] uppercase">
                  Page {page} / {totalPages}
                </p>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((c) => Math.min(totalPages, c + 1))}
                  className="bg-[#061c2b] px-4 py-2 text-[0.65rem] font-bold tracking-[0.12em] text-[#d8ad61] uppercase transition hover:brightness-110 disabled:opacity-35"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>

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
            className="relative w-full max-w-md border border-[#d8ad61]/35 bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.25)] animate-[scaleIn_0.35s_cubic-bezier(0.22,1,0.36,1)]"
          >
            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
              Confirm
            </p>
            <h3 className="mt-2 font-logo text-2xl text-[#061c2b]">
              Delete this RSVP?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4a5d6a]">
              This removes{" "}
              <span className="font-semibold text-[#061c2b]">
                {pendingDelete.firstName} {pendingDelete.lastName}
              </span>
              ’s response from the guest list.
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
                  "Delete"
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
