"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  deleteMenuSubmission,
  getAdminMenuSubmissions,
  type MenuSubmission,
} from "@/app/actions/admin-menu";
import { getMenuById } from "@/lib/menu-data";

const PAGE_SIZE = 6;

type DishFilter = {
  courseId: string;
  itemId: string;
} | null;

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
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

type AdminMenuPanelProps = {
  initialSubmissions: MenuSubmission[];
};

export function AdminMenuPanel({ initialSubmissions }: AdminMenuPanelProps) {
  const menu = getMenuById("premium");
  const choiceCourses = menu.courses.filter(
    (course) => course.selection === "single",
  );

  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [query, setQuery] = useState("");
  const [dishFilter, setDishFilter] = useState<DishFilter>(null);
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<MenuSubmission | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, startRefresh] = useTransition();

  const dietaryCount = useMemo(
    () => submissions.filter((entry) => entry.dietaryNotes?.trim()).length,
    [submissions],
  );

  const tallies = useMemo(() => {
    return choiceCourses.map((course) => {
      const counts = new Map<string, number>();
      for (const item of course.items) {
        counts.set(item.id, 0);
      }

      for (const submission of submissions) {
        const chosen = submission.courses[course.id]?.[0];
        if (!chosen) continue;
        counts.set(chosen.id, (counts.get(chosen.id) ?? 0) + 1);
      }

      const rows = course.items.map((item) => ({
        id: item.id,
        name: item.name,
        count: counts.get(item.id) ?? 0,
      }));

      const max = Math.max(1, ...rows.map((row) => row.count));
      return { course, rows, max, total: submissions.length };
    });
  }, [choiceCourses, submissions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return submissions.filter((entry) => {
      if (dishFilter) {
        const chosen = entry.courses[dishFilter.courseId]?.[0]?.id;
        if (chosen !== dishFilter.itemId) return false;
      }

      if (!q) return true;

      const dishNames = Object.values(entry.courses)
        .flat()
        .map((item) => item.name)
        .join(" ");

      const haystack = [
        entry.guestName,
        entry.email ?? "",
        entry.dietaryNotes ?? "",
        dishNames,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [submissions, query, dishFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleRefresh = () => {
    setError(null);
    startRefresh(async () => {
      try {
        const next = await getAdminMenuSubmissions();
        setSubmissions(next);
      } catch {
        setError("Could not refresh menu choices. Please try again.");
      }
    });
  };

  const toggleDishFilter = (courseId: string, itemId: string) => {
    setDishFilter((current) => {
      if (current?.courseId === courseId && current.itemId === itemId) {
        return null;
      }
      return { courseId, itemId };
    });
    setPage(1);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteMenuSubmission(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSubmissions((current) => current.filter((entry) => entry.id !== id));
      setPendingDelete(null);
    });
  };

  const activeFilterLabel = useMemo(() => {
    if (!dishFilter) return null;
    const course = choiceCourses.find((c) => c.id === dishFilter.courseId);
    const item = course?.items.find((i) => i.id === dishFilter.itemId);
    if (!course || !item) return null;
    return `${course.title}: ${item.name}`;
  }, [dishFilter, choiceCourses]);

  return (
    <div className="space-y-8">
      {/* Kitchen board */}
      <section className="relative overflow-hidden border border-[#061c2b] bg-[#061c2b] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(216,173,97,0.22),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(216,173,97,0.08),transparent_35%)]" />
        <div className="relative px-5 py-6 sm:px-7 sm:py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
                Kitchen board
              </p>
              <h2 className="mt-1 font-logo text-3xl tracking-[-0.02em] sm:text-4xl">
                Tonight’s counts
              </h2>
              <p className="mt-2 text-sm text-white/55">
                Tap a dish to filter the guest list ·{" "}
                <span className="text-[#d8ad61]">
                  {submissions.length} response
                  {submissions.length === 1 ? "" : "s"}
                </span>
              </p>
            </div>
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

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {tallies.map(({ course, rows, max }) => (
              <div key={course.id}>
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-script text-2xl text-[#d8ad61]">
                      {course.title}
                    </p>
                    <p className="text-[0.65rem] tracking-[0.12em] text-white/40 uppercase">
                      Guest choice
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {rows.map((row) => {
                    const width = Math.round((row.count / max) * 100);
                    const active =
                      dishFilter?.courseId === course.id &&
                      dishFilter.itemId === row.id;

                    return (
                      <li key={row.id}>
                        <button
                          type="button"
                          onClick={() => toggleDishFilter(course.id, row.id)}
                          className={`group w-full text-left transition ${
                            active ? "opacity-100" : "opacity-90 hover:opacity-100"
                          }`}
                        >
                          <div className="mb-1.5 flex items-baseline justify-between gap-3">
                            <span
                              className={`text-sm transition ${
                                active
                                  ? "text-[#d8ad61]"
                                  : "text-white/85 group-hover:text-white"
                              }`}
                            >
                              {row.name}
                            </span>
                            <span className="font-logo text-xl tabular-nums text-[#d8ad61]">
                              {row.count}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden bg-white/10">
                            <div
                              className={`h-full transition-all duration-700 ease-out ${
                                active ? "bg-[#edca87]" : "bg-[#d8ad61]"
                              }`}
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {dietaryCount > 0 && (
        <section className="border border-[#d8ad61]/40 bg-[#fff8eb] px-5 py-4 sm:px-6">
          <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#8a6a2e] uppercase">
            Kitchen alert
          </p>
          <p className="mt-1 text-sm text-[#5c4a28]">
            <span className="font-semibold">{dietaryCount}</span> guest
            {dietaryCount === 1 ? "" : "s"} noted dietary needs — check the list
            below for details.
          </p>
        </section>
      )}

      {/* Guest roster */}
      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <div>
              <p className="font-script text-2xl text-[#c99b4e]">Guest roster</p>
              <p className="text-xs font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
                {filtered.length} shown
                {activeFilterLabel ? " · filtered" : ""}
              </p>
            </div>
            {activeFilterLabel && (
              <button
                type="button"
                onClick={() => {
                  setDishFilter(null);
                  setPage(1);
                }}
                className="inline-flex items-center gap-1.5 border border-[#d8ad61]/50 bg-[#fff8eb] px-2.5 py-1 text-[0.65rem] tracking-[0.06em] text-[#6b5428]"
              >
                {activeFilterLabel}
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>

          <label className="block w-full sm:max-w-xs">
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
              placeholder="Guest, dish, or dietary note…"
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
            <p className="font-logo text-2xl text-[#061c2b]">No choices yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#4a5d6a]">
              When guests submit the Premium Menu form, their mains and desserts
              will appear on this kitchen board.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-[#d8cfbf] bg-white px-6 py-14 text-center">
            <p className="font-logo text-2xl text-[#061c2b]">No matches</p>
            <p className="mt-2 text-sm text-[#4a5d6a]">
              Clear the dish filter or try a different search.
            </p>
          </div>
        ) : (
          <>
            <ul className="grid gap-4 sm:grid-cols-2">
              {pageRows.map((entry, index) => {
                const main = entry.courses.main?.[0];
                const dessert = entry.courses.dessert?.[0];

                return (
                  <li
                    key={entry.id}
                    className="group relative border border-[#d8cfbf] bg-white p-5 transition hover:border-[#d8ad61]/60 hover:shadow-[0_14px_36px_rgba(11,38,56,0.08)] animate-[menuItemRise_0.4s_ease-out_both]"
                    style={{ animationDelay: `${Math.min(index, 6) * 45}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-logo text-2xl text-[#061c2b]">
                          {entry.guestName}
                        </p>
                        <p className="mt-0.5 text-[0.65rem] tracking-[0.1em] text-[#8a7a5c] uppercase">
                          {formatDate(entry.createdAt)}
                          {entry.email ? ` · ${entry.email}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setError(null);
                          setPendingDelete(entry);
                        }}
                        className="shrink-0 border border-[#061c2b]/15 px-2.5 py-1.5 text-[0.6rem] font-bold tracking-[0.1em] text-[#061c2b]/70 uppercase transition hover:border-red-400 hover:bg-red-50 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <div className="border-l-2 border-[#d8ad61] pl-3">
                        <p className="text-[0.6rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
                          Main
                        </p>
                        <p className="mt-0.5 text-sm text-[#2f4452]">
                          {main?.name ?? "—"}
                        </p>
                      </div>
                      <div className="border-l-2 border-[#d8ad61]/50 pl-3">
                        <p className="text-[0.6rem] font-bold tracking-[0.14em] text-[#8a7a5c] uppercase">
                          Dessert
                        </p>
                        <p className="mt-0.5 text-sm text-[#2f4452]">
                          {dessert?.name ?? "—"}
                        </p>
                      </div>
                    </div>

                    {entry.dietaryNotes?.trim() && (
                      <div className="mt-4 bg-[#fff8eb] px-3 py-2.5">
                        <p className="text-[0.6rem] font-bold tracking-[0.12em] text-[#8a6a2e] uppercase">
                          Dietary
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-[#5c4a28]">
                          {entry.dietaryNotes}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
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
              Remove menu choice?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#4a5d6a]">
              This deletes{" "}
              <span className="font-semibold text-[#061c2b]">
                {pendingDelete.guestName}
              </span>
              ’s dinner selection from the kitchen board.
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
