"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { submitMenuSelection } from "@/app/actions/submit-menu";
import { celebrationMenus, getMenuById } from "@/lib/menu-data";

function Chevron({ direction }: { direction: "left" | "right" | "down" }) {
  const path =
    direction === "left"
      ? "M15 6l-6 6 6 6"
      : direction === "right"
        ? "M9 6l6 6-6 6"
        : "M6 9l6 6 6-6";

  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export function MenuForm() {
  const detailsRef = useRef<HTMLElement>(null);
  const [activeMenuId, setActiveMenuId] = useState(celebrationMenus[0].id);
  const [activeCourseId, setActiveCourseId] = useState(
    celebrationMenus[0].courses[0].id,
  );
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [showScrollCue, setShowScrollCue] = useState(false);

  const firstName = guestName.trim().split(/\s+/)[0] ?? "";

  const activeMenu = getMenuById(activeMenuId);
  const activeCourseIndex = activeMenu.courses.findIndex(
    (course) => course.id === activeCourseId,
  );
  const activeCourse =
    activeMenu.courses[activeCourseIndex >= 0 ? activeCourseIndex : 0];
  const prevCourse = activeMenu.courses[activeCourseIndex - 1];
  const nextCourse = activeMenu.courses[activeCourseIndex + 1];
  const isLastCourse = activeCourseIndex === activeMenu.courses.length - 1;

  const goToCourse = (courseId: string) => {
    const nextIndex = activeMenu.courses.findIndex((course) => course.id === courseId);
    if (nextIndex < 0 || courseId === activeCourseId) return;

    setSlideDirection(nextIndex > activeCourseIndex ? "right" : "left");
    setActiveCourseId(courseId);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!showSuccess) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showSuccess]);

  const choiceSummary = useMemo(() => {
    return activeMenu.courses
      .filter((course) => course.selection === "single")
      .map((course) => {
        const selectedId = selections[course.id]?.[0];
        const item = course.items.find((entry) => entry.id === selectedId);
        return { course, item };
      });
  }, [activeMenu.courses, selections]);

  const choicesComplete = useMemo(
    () => choiceSummary.every(({ item }) => Boolean(item)),
    [choiceSummary],
  );

  const activeCourseHasChoice =
    activeCourse.selection === "included" ||
    (selections[activeCourse.id]?.length ?? 0) > 0;

  useEffect(() => {
    if (choicesComplete) {
      setShowScrollCue(true);
    }
  }, [choicesComplete]);

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setShowScrollCue(false);
  };

  const selectMenu = (menuId: string) => {
    const nextMenu = getMenuById(menuId);
    setSlideDirection("right");
    setActiveMenuId(nextMenu.id);
    setActiveCourseId(nextMenu.courses[0].id);
    setSelections({});
    setShowScrollCue(false);
    setError(null);
  };

  const handleSelectItem = (courseId: string, itemId: string) => {
    const nextSelections = { ...selections, [courseId]: [itemId] };
    setSelections(nextSelections);

    const complete = activeMenu.courses
      .filter((course) => course.selection === "single")
      .every((course) => (nextSelections[course.id]?.length ?? 0) > 0);

    if (complete) {
      setShowScrollCue(true);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await submitMenuSelection({
        menuId: activeMenuId,
        guestName,
        email,
        dietaryNotes,
        selections,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setShowSuccess(true);
      setSuccessName(guestName.trim().split(/\s+/)[0] || guestName.trim());
      setGuestName("");
      setEmail("");
      setDietaryNotes("");
      setSelections({});
      setShowScrollCue(false);
      setActiveCourseId(activeMenu.courses[0].id);
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
          <div className="relative mx-auto grid size-16 place-items-center rounded-full border border-[#d8ad61] bg-[#d8ad61]/15 text-[#d8ad61] animate-[checkPop_0.55s_ease-out]">
            <svg
              aria-hidden="true"
              className="size-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
            </svg>
          </div>
          <p className="relative mt-5 animate-[menuItemRise_0.5s_ease-out_0.08s_both] font-script text-3xl text-[#d8ad61]">
            Bon appétit
          </p>
          <h3 className="relative mt-2 animate-[menuItemRise_0.5s_ease-out_0.16s_both] font-logo text-2xl">
            Thank you, {successName || "friend"}
          </h3>
          <p className="relative mt-3 animate-[menuItemRise_0.5s_ease-out_0.24s_both] text-sm leading-relaxed text-white/75">
            Your {activeMenu.title.toLowerCase()} choices are saved
            {successName ? `, ${successName}` : ""}. We can’t wait to dine with you in Barcelona.
          </p>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className="group relative mt-7 inline-flex min-h-11 items-center justify-center overflow-hidden rounded-sm bg-[#d7ad62] px-8 text-[0.68rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-all duration-300 hover:scale-[1.03] hover:bg-[#edca87] animate-[softPulse_1.8s_ease-out_infinite]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative">Close</span>
          </button>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      {successModal}

      <form onSubmit={handleSubmit} className="space-y-8">
        {celebrationMenus.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2">
            {celebrationMenus.map((menu) => {
              const isActive = menu.id === activeMenuId;
              return (
                <button
                  key={menu.id}
                  type="button"
                  onClick={() => selectMenu(menu.id)}
                  className={`min-h-9 px-5 text-[0.68rem] font-bold tracking-[0.16em] uppercase transition-all duration-300 ${
                    isActive
                      ? "bg-[#061c2b] text-[#d8ad61]"
                      : "bg-white/70 text-[#4a5d6a] hover:bg-[#061c2b]/10 hover:text-[#061c2b]"
                  }`}
                >
                  {menu.label}
                </button>
              );
            })}
          </div>
        )}

        <article className="border border-[#d8cfbf] bg-[#fbf8f2] px-5 py-8 shadow-[0_16px_40px_rgba(11,38,56,0.07)] sm:px-10 sm:py-10">
          <header className="text-center">
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] font-medium tracking-[-0.02em] text-[#8a7348]">
              {activeMenu.title}
            </h2>
            <div className="mx-auto mt-4 h-px w-full max-w-md bg-[#c4b496]/70" />
          </header>

          <div
            role="tablist"
            aria-label="Menu courses"
            className="mt-7 flex flex-wrap justify-center gap-2"
          >
            {activeMenu.courses.map((course) => {
              const isActive = course.id === activeCourse.id;
              const hasChoice =
                course.selection === "single" && (selections[course.id]?.length ?? 0) > 0;

              return (
                <button
                  key={course.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => goToCourse(course.id)}
                  className={`relative min-h-9 px-4 text-[0.65rem] font-bold tracking-[0.14em] uppercase transition-all duration-300 ${
                    isActive
                      ? "bg-[#061c2b] text-[#d8ad61] scale-[1.03]"
                      : "border border-[#d8cfbf] bg-white/80 text-[#6a5a3d] hover:border-[#d8ad61]"
                  }`}
                >
                  {course.title}
                  {hasChoice && (
                    <span
                      aria-hidden="true"
                      className={`absolute -top-1 -right-1 size-2 rounded-full ${
                        isActive ? "bg-[#d8ad61]" : "bg-[#061c2b]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative mt-8 overflow-hidden">
            <div
              role="tabpanel"
              key={activeCourse.id}
              className={
                slideDirection === "right"
                  ? "animate-[menuSlideFromRight_0.4s_cubic-bezier(0.22,1,0.36,1)]"
                  : "animate-[menuSlideFromLeft_0.4s_cubic-bezier(0.22,1,0.36,1)]"
              }
            >
              <div className="mb-6 text-center">
                <h3 className="font-display text-2xl font-medium text-[#8a7348] sm:text-[1.75rem]">
                  {activeCourse.title}
                </h3>
                <p className="mt-1 text-sm italic text-[#8a7348]/75">
                  ({activeCourse.subtitle.toLowerCase()})
                </p>
              </div>

              {activeCourse.selection === "included" ? (
                <ul className="mx-auto max-w-xl space-y-5">
                  {activeCourse.items.map((item, index) => (
                    <li
                      key={item.id}
                      className="text-center animate-[menuItemRise_0.45s_ease-out_both]"
                      style={{ animationDelay: `${80 + index * 70}ms` }}
                    >
                      <p className="font-display text-lg font-medium text-[#8a7348] sm:text-xl">
                        {item.name}
                        {item.description ? ":" : ""}
                      </p>
                      {item.description && (
                        <p className="mt-1 text-sm leading-relaxed text-[#8a7348]/80 sm:text-[0.95rem]">
                          {item.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mx-auto grid max-w-xl gap-3">
                  {activeCourse.items.map((item, index) => {
                    const selected = selections[activeCourse.id]?.[0] === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectItem(activeCourse.id, item.id)}
                        style={{ animationDelay: `${90 + index * 80}ms` }}
                        className={`group w-full border px-5 py-4 text-left transition-all duration-300 animate-[menuItemRise_0.45s_ease-out_both] hover:scale-[1.01] ${
                          selected
                            ? "border-[#d8ad61] bg-[#061c2b] text-white shadow-[0_10px_24px_rgba(6,28,43,0.18)]"
                            : "border-[#e4ddd0] bg-white/70 text-[#8a7348] hover:border-[#d8ad61]/80"
                        }`}
                      >
                        <span className="flex items-start gap-3">
                          <span
                            className={`mt-1 grid size-4 shrink-0 place-items-center rounded-full border ${
                              selected
                                ? "border-[#d8ad61] bg-[#d8ad61]"
                                : "border-current/40"
                            }`}
                          >
                            {selected && (
                              <span className="size-1.5 rounded-full bg-[#061c2b]" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-lg font-medium sm:text-xl">
                              {item.name}
                            </span>
                            {item.description && (
                              <span
                                className={`mt-1 block text-sm leading-relaxed ${
                                  selected ? "text-white/75" : "text-[#8a7348]/80"
                                }`}
                              >
                                {item.description}
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
                {prevCourse ? (
                  <button
                    type="button"
                    onClick={() => goToCourse(prevCourse.id)}
                    className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 border-2 border-[#061c2b] bg-white px-5 text-[0.7rem] font-extrabold tracking-[0.14em] text-[#061c2b] uppercase transition-all duration-300 hover:scale-[1.02] hover:bg-[#061c2b] hover:text-[#d8ad61]"
                  >
                    <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
                      <Chevron direction="left" />
                    </span>
                    {prevCourse.title}
                  </button>
                ) : (
                  <div className="hidden flex-1 sm:block" />
                )}

                {nextCourse ? (
                  <button
                    type="button"
                    onClick={() => goToCourse(nextCourse.id)}
                    className={`group relative inline-flex min-h-12 flex-1 items-center justify-center gap-2 overflow-hidden bg-[#061c2b] px-5 text-[0.7rem] font-extrabold tracking-[0.14em] text-[#d8ad61] uppercase shadow-[0_10px_24px_rgba(6,28,43,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#0d3044] ${
                      activeCourseHasChoice ? "animate-[softPulse_1.8s_ease-out_infinite]" : ""
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <span
                      className={
                        activeCourseHasChoice
                          ? "relative inline-flex items-center gap-2 animate-[nextNudge_1.2s_ease-in-out_infinite]"
                          : "relative inline-flex items-center gap-2"
                      }
                    >
                      Next: {nextCourse.title}
                      <Chevron direction="right" />
                    </span>
                  </button>
                ) : null}
              </div>

              {isLastCourse && choicesComplete && (
                <div className="mx-auto mt-5 max-w-xl animate-[menuItemRise_0.45s_ease-out]">
                  <button
                    type="button"
                    onClick={scrollToDetails}
                    className="group relative flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden border border-[#d8ad61] bg-[#d7ad62] px-5 text-[0.7rem] font-extrabold tracking-[0.14em] text-[#102536] uppercase transition-all duration-300 hover:scale-[1.02] hover:bg-[#edca87] animate-[softPulse_1.8s_ease-out_infinite]"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <span className="relative inline-flex items-center gap-2">
                      {firstName
                        ? `${firstName}, continue to your details`
                        : "Continue to your details"}
                      <span className="animate-[bounceDown_1.1s_ease-in-out_infinite]">
                        <Chevron direction="down" />
                      </span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </article>

        {showScrollCue && choicesComplete && (
          <div className="flex justify-center animate-[menuItemRise_0.5s_ease-out]">
            <button
              type="button"
              onClick={scrollToDetails}
              className="group flex flex-col items-center gap-2 text-[#061c2b]"
            >
              <span className="border border-[#d8ad61]/60 bg-[#d7ad62]/20 px-4 py-2 text-[0.65rem] font-extrabold tracking-[0.16em] text-[#061c2b] uppercase transition-transform duration-300 group-hover:scale-[1.02]">
                {firstName
                  ? `${firstName}, selections complete — scroll to submit`
                  : "Selections complete — scroll to submit"}
              </span>
              <span className="grid size-10 place-items-center rounded-full border-2 border-[#d8ad61] bg-[#061c2b] text-[#d8ad61] animate-[bounceDown_1.1s_ease-in-out_infinite]">
                <Chevron direction="down" />
              </span>
            </button>
          </div>
        )}

        <section
          ref={detailsRef}
          id="menu-details"
          className="scroll-mt-28 border border-[#d8cfbf] bg-[#061c2b] px-5 py-7 text-white sm:px-7"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-logo text-2xl font-semibold sm:text-3xl">
                {firstName ? `${firstName}’s Details` : "Your Details"}
              </h2>
              <p className="mt-2 text-sm text-white/70">
                {firstName
                  ? `${firstName}, confirm your choices below, then submit.`
                  : "Choose your main and dessert, then submit."}
              </p>
            </div>
            <p className="text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
              {activeMenu.label} Menu
            </p>
          </div>

          <div className="mt-5 grid gap-2 border border-white/15 bg-white/5 px-4 py-3 text-sm">
            {choiceSummary.map(({ course, item }) => (
              <p key={course.id} className="flex flex-wrap gap-x-2">
                <span className="text-[#d8ad61]">{course.title}:</span>
                <span className={item ? "text-white" : "text-white/45"}>
                  {item?.name ?? "Not selected yet"}
                </span>
              </p>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
                Full Name
              </span>
              <input
                type="text"
                required
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Your name"
                className="min-h-12 w-full border border-white/25 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#d8ad61]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
                Email{" "}
                <span className="font-medium tracking-normal normal-case text-white/45">
                  (optional)
                </span>
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                className="min-h-12 w-full border border-white/25 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#d8ad61]"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
              Dietary Notes{" "}
              <span className="font-medium tracking-normal normal-case text-white/45">
                (optional)
              </span>
            </span>
            <textarea
              value={dietaryNotes}
              onChange={(event) => setDietaryNotes(event.target.value)}
              rows={3}
              placeholder="Allergies, preferences, or special requests"
              className="w-full border border-white/25 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-[#d8ad61]"
            />
          </label>

          {error && (
            <p className="mt-4 text-sm text-[#f0b4b4]" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={`group relative mt-6 inline-flex min-h-12 w-full items-center justify-center overflow-hidden rounded-sm bg-[#d7ad62] px-8 text-[0.7rem] font-extrabold tracking-[0.18em] text-[#102536] uppercase transition-all duration-300 hover:scale-[1.02] hover:bg-[#edca87] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit ${
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
                  Submitting...
                </>
              ) : (
                <>
                  Submit Menu Choice
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </>
              )}
            </span>
          </button>
        </section>
      </form>
    </>
  );
}
