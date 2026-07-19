"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  getAdminVisitors,
  type AdminVisitor,
} from "@/app/actions/admin-visitors";
import { downloadVisitorsCsv } from "@/lib/visitors-csv";

const PAGE_SIZE = 10;

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

function displayLocation(visitor: AdminVisitor) {
  return visitor.location || visitor.country || "—";
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

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (value == null || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <p className="shrink-0 text-[0.62rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
        {label}
      </p>
      <div className="text-sm leading-relaxed text-[#061c2b] sm:text-right">
        {value}
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section
      className={`rounded-sm border px-4 py-4 ${
        accent
          ? "border-[#d8ad61]/40 bg-[#fff8eb]"
          : "border-[#ebe4d8] bg-[#fbf8f2]/80"
      }`}
    >
      <p
        className={`font-script text-xl ${
          accent ? "text-[#c99b4e]" : "text-[#8a7a5c]"
        }`}
      >
        {title}
      </p>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function PlanChip({
  active,
  label,
}: {
  active: boolean | null;
  label: string;
}) {
  if (active == null) return null;
  return (
    <span
      className={`px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.1em] uppercase ${
        active
          ? "bg-[#061c2b] text-[#d8ad61]"
          : "border border-[#061c2b]/15 text-[#8a7a5c]"
      }`}
    >
      {label}
      {active ? "" : " · no"}
    </span>
  );
}

type AdminVisitorsPanelProps = {
  initialVisitors: AdminVisitor[];
};

export function AdminVisitorsPanel({
  initialVisitors,
}: AdminVisitorsPanelProps) {
  const [visitors, setVisitors] = useState(initialVisitors);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminVisitor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, startRefresh] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return visitors;

    return visitors.filter((visitor) => {
      const haystack = [
        visitor.name,
        visitor.email ?? "",
        visitor.location ?? "",
        visitor.country ?? "",
        visitor.phone ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [visitors, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  const handleRefresh = () => {
    setError(null);
    startRefresh(async () => {
      try {
        const next = await getAdminVisitors();
        setVisitors(next);
        if (selected) {
          setSelected(next.find((entry) => entry.id === selected.id) ?? null);
        }
      } catch {
        setError("Could not refresh visitors.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="text-xs font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
            {filtered.length} visitor{filtered.length === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh"
            title="Refresh"
            className="grid size-8 place-items-center border border-[#061c2b]/15 text-[#061c2b]/70 transition hover:border-[#d8ad61] hover:text-[#d8ad61] disabled:opacity-50"
          >
            <RefreshIcon spinning={isRefreshing} />
          </button>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
          <label className="block w-full sm:w-64">
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
              placeholder="Name, email, location…"
              className="min-h-11 w-full border border-[#d8cfbf] bg-white px-3 text-sm text-[#061c2b] outline-none transition placeholder:text-[#8a7a5c]/70 focus:border-[#d8ad61]"
            />
          </label>
          <button
            type="button"
            onClick={() => downloadVisitorsCsv(filtered)}
            disabled={filtered.length === 0}
            className="min-h-11 bg-[#061c2b] px-4 text-[0.65rem] font-bold tracking-[0.12em] text-[#d8ad61] uppercase transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {visitors.length === 0 ? (
        <div className="border border-[#d8cfbf] bg-white px-6 py-16 text-center">
          <p className="font-logo text-2xl text-[#061c2b]">No visitors yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#4a5d6a]">
            People appear here when they RSVP, choose a menu, or sign the
            guestbook.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-[#d8cfbf] bg-white px-6 py-14 text-center">
          <p className="font-logo text-2xl text-[#061c2b]">No matches</p>
          <p className="mt-2 text-sm text-[#4a5d6a]">Try a different search.</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden border border-[#d8cfbf] bg-white shadow-[0_12px_40px_rgba(11,38,56,0.04)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#061c2b] text-white">
                  <tr>
                    <th className="px-4 py-3.5 text-[0.65rem] font-bold tracking-[0.14em] uppercase sm:px-5">
                      Name
                    </th>
                    <th className="px-4 py-3.5 text-[0.65rem] font-bold tracking-[0.14em] uppercase sm:px-5">
                      Email
                    </th>
                    <th className="px-4 py-3.5 text-[0.65rem] font-bold tracking-[0.14em] uppercase sm:px-5">
                      Location
                    </th>
                    <th className="px-4 py-3.5 text-right text-[0.65rem] font-bold tracking-[0.14em] uppercase sm:px-5">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((visitor, index) => (
                    <tr
                      key={visitor.id}
                      className={`border-t border-[#ebe4d8] transition hover:bg-[#fbf8f2] animate-[menuItemRise_0.35s_ease-out_both] ${
                        index % 2 === 1 ? "bg-[#faf7f1]/60" : "bg-white"
                      }`}
                      style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
                    >
                      <td className="px-4 py-4 font-medium text-[#061c2b] sm:px-5">
                        <span className="font-logo text-lg">{visitor.name}</span>
                      </td>
                      <td className="px-4 py-4 text-[#2f4452] sm:px-5">
                        {visitor.email ? (
                          <a
                            href={`mailto:${visitor.email}`}
                            className="underline decoration-[#d8cfbf] underline-offset-2 transition hover:text-[#d8ad61]"
                          >
                            {visitor.email}
                          </a>
                        ) : (
                          <span className="text-[#8a7a5c]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-[#2f4452] sm:px-5">
                        {displayLocation(visitor)}
                      </td>
                      <td className="px-4 py-4 text-right sm:px-5">
                        <button
                          type="button"
                          onClick={() => setSelected(visitor)}
                          className="border border-[#061c2b]/20 px-3 py-2 text-[0.65rem] font-bold tracking-[0.12em] text-[#061c2b] uppercase transition hover:border-[#d8ad61] hover:text-[#d8ad61]"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6 sm:py-10">
          <button
            type="button"
            aria-label="Close details"
            className="absolute inset-0 bg-[#061c2b]/75 backdrop-blur-[3px] animate-[fadeIn_0.3s_ease-out]"
            onClick={() => setSelected(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="visitor-details-title"
            className="relative flex max-h-[min(92vh,780px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#d8ad61]/30 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.4)] animate-[scaleIn_0.4s_cubic-bezier(0.22,1,0.36,1)]"
          >
            <div className="relative shrink-0 overflow-hidden bg-[#061c2b] px-6 pt-6 pb-7 text-white sm:px-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(216,173,97,0.28),transparent_45%),radial-gradient(circle_at_0%_100%,rgba(216,173,97,0.1),transparent_40%)]" />
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 grid size-9 place-items-center border border-white/20 text-white/70 transition hover:border-[#d8ad61] hover:text-[#d8ad61]"
              >
                ×
              </button>

              <div className="relative flex items-start gap-4 pr-10">
                <div
                  aria-hidden="true"
                  className="grid size-16 shrink-0 place-items-center border border-[#d8ad61]/50 bg-[#0a2436] font-logo text-2xl text-[#d8ad61] sm:size-[4.5rem] sm:text-3xl"
                >
                  {initials(selected.name)}
                </div>
                <div className="min-w-0 pt-1">
                  <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
                    Guest profile
                  </p>
                  <h3
                    id="visitor-details-title"
                    className="mt-1 font-logo text-[clamp(1.75rem,4vw,2.35rem)] leading-tight tracking-[-0.02em]"
                  >
                    {selected.name}
                  </h3>
                  {displayLocation(selected) !== "—" && (
                    <p className="mt-1.5 text-sm text-white/55">
                      {displayLocation(selected)}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selected.sources.map((source) => (
                      <span
                        key={source}
                        className="bg-[#d8ad61]/15 px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.12em] text-[#d8ad61] uppercase"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              {(selected.email ||
                selected.phone ||
                displayLocation(selected) !== "—") && (
                <DetailSection title="Contact">
                  <DetailRow
                    label="Email"
                    value={
                      selected.email ? (
                        <a
                          href={`mailto:${selected.email}`}
                          className="underline decoration-[#d8cfbf] underline-offset-2 transition hover:text-[#d8ad61]"
                        >
                          {selected.email}
                        </a>
                      ) : null
                    }
                  />
                  <DetailRow label="Phone" value={selected.phone} />
                  <DetailRow
                    label="Location"
                    value={
                      displayLocation(selected) === "—"
                        ? null
                        : displayLocation(selected)
                    }
                  />
                </DetailSection>
              )}

              {(selected.attendDinner != null ||
                selected.joinCruise != null ||
                selected.bringingGuest != null) && (
                <DetailSection title="Celebration plans">
                  <div className="flex flex-wrap gap-2">
                    <PlanChip active={selected.attendDinner} label="Dinner · Purobeach" />
                    <PlanChip active={selected.joinCruise} label="Cruise · Marina" />
                    {selected.bringingGuest != null && (
                      <span
                        className={`px-2.5 py-1 text-[0.58rem] font-bold tracking-[0.1em] uppercase ${
                          selected.bringingGuest
                            ? "border border-[#d8ad61] bg-[#fff8eb] text-[#6b5428]"
                            : "border border-[#061c2b]/15 text-[#8a7a5c]"
                        }`}
                      >
                        {selected.bringingGuest
                          ? `+1${selected.guestName ? ` · ${selected.guestName}` : ""}`
                          : "+1 · no"}
                      </span>
                    )}
                  </div>
                </DetailSection>
              )}

              {(selected.menuMain ||
                selected.menuDessert ||
                selected.dietaryNotes) && (
                <DetailSection title="Dining" accent={Boolean(selected.dietaryNotes)}>
                  <DetailRow label="Main" value={selected.menuMain} />
                  <DetailRow label="Dessert" value={selected.menuDessert} />
                  <DetailRow
                    label="Dietary notes"
                    value={selected.dietaryNotes}
                  />
                </DetailSection>
              )}

              {selected.guestbookMessage && (
                <DetailSection title="Guestbook" accent>
                  <p className="font-display text-[1.05rem] leading-relaxed text-[#061c2b]">
                    “{selected.guestbookMessage}”
                  </p>
                </DetailSection>
              )}

              <DetailSection title="Activity">
                <DetailRow
                  label="First seen"
                  value={formatDate(selected.firstSeenAt)}
                />
                <DetailRow
                  label="Last seen"
                  value={formatDate(selected.lastSeenAt)}
                />
              </DetailSection>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-[#ebe4d8] bg-[#f7f3eb] px-5 py-4 sm:px-7">
              <button
                type="button"
                onClick={() =>
                  downloadVisitorsCsv(
                    [selected],
                    `visitor-${selected.name.toLowerCase().replace(/\s+/g, "-")}.csv`,
                  )
                }
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 bg-[#d8ad61] px-5 text-[0.7rem] font-bold tracking-[0.12em] text-[#102536] uppercase transition hover:brightness-105 sm:flex-none"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="min-h-11 flex-1 border border-[#061c2b]/20 px-5 text-[0.7rem] font-bold tracking-[0.12em] text-[#061c2b] uppercase transition hover:border-[#d8ad61] hover:text-[#d8ad61] sm:flex-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
