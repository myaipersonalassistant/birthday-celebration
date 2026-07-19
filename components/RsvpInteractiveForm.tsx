"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { submitRsvp } from "@/app/actions/submit-rsvp";

const steps = [
  { id: 1, label: "You" },
  { id: 2, label: "Plans" },
  { id: 3, label: "Confirm" },
] as const;

const countries = [
  { value: "spain", label: "Spain" },
  { value: "nigeria", label: "Nigeria" },
  { value: "uk", label: "United Kingdom" },
  { value: "usa", label: "United States" },
  { value: "other", label: "Other" },
];

type RsvpInteractiveFormProps = {
  variant?: "light" | "dark";
  showHeading?: boolean;
  headingId?: string;
};

export function RsvpInteractiveForm({
  variant = "light",
  showHeading = true,
  headingId,
}: RsvpInteractiveFormProps) {
  const isDark = variant === "dark";
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [attendDinner, setAttendDinner] = useState(true);
  const [joinCruise, setJoinCruise] = useState(false);
  const [bringingGuest, setBringingGuest] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  const displayName = firstName.trim();

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

  const goNext = () => {
    setError(null);

    if (step === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Please enter your first and last name.");
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!country) {
        setError("Please select your country.");
        return;
      }
    }

    if (step === 2) {
      if (!attendDinner && !joinCruise) {
        setError("Please select at least one part of the celebration.");
        return;
      }
      if (bringingGuest && !guestName.trim()) {
        setError("Please enter your guest’s name.");
        return;
      }
    }

    setStep((current) => Math.min(3, current + 1));
  };

  const goBack = () => {
    setError(null);
    setStep((current) => Math.max(1, current - 1));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await submitRsvp({
        firstName,
        lastName,
        email,
        phone,
        country,
        attendDinner,
        joinCruise,
        bringingGuest,
        guestName,
        message,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setShowSuccess(true);
      setSuccessName(firstName.trim());
      setStep(1);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setAttendDinner(true);
      setJoinCruise(false);
      setBringingGuest(false);
      setGuestName("");
      setMessage("");
    });
  };

  const labelClass = isDark
    ? "mb-2 block text-[0.65rem] font-bold tracking-[0.14em] text-[#d8ad61] uppercase"
    : "mb-2 block text-[0.65rem] font-bold tracking-[0.14em] text-[#8a7348] uppercase";

  const inputClass = isDark
    ? "min-h-11 w-full border border-white/25 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/55 focus:border-[#d8ad61]"
    : "min-h-12 w-full border border-[#d8cfbf] bg-white px-4 text-sm text-[#0b2638] outline-none focus:border-[#d8ad61]";

  const hintClass = isDark ? "text-sm text-white/70" : "text-sm text-[#4a5d6a]";

  const planIdleClass = isDark
    ? "border-white/25 bg-white/5 text-white hover:border-[#d8ad61]/70"
    : "border-[#d8cfbf] bg-white text-[#0b2638] hover:border-[#d8ad61]/70";

  const planActiveClass = isDark
    ? "border-[#d8ad61] bg-[#d8ad61]/15 text-white"
    : "border-[#d8ad61] bg-[#061c2b] text-white";

  const summaryClass = isDark
    ? "border border-white/20 bg-white/5 px-4 py-4 text-sm text-white"
    : "border border-[#d8cfbf] bg-white px-5 py-5 text-sm text-[#0b2638]";

  const backBtnClass = isDark
    ? "group inline-flex min-h-12 items-center justify-center gap-1.5 border border-white/30 px-6 text-[0.68rem] font-extrabold tracking-[0.14em] text-white uppercase transition-all duration-300 hover:scale-[1.02] hover:border-[#d8ad61] hover:text-[#d8ad61]"
    : "group inline-flex min-h-12 items-center justify-center gap-1.5 border border-[#0b2638]/25 px-6 text-[0.68rem] font-extrabold tracking-[0.14em] text-[#0b2638] uppercase transition-all duration-300 hover:scale-[1.02] hover:border-[#d8ad61] hover:text-[#c99b4e]";

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
            You’re on the list
          </p>
          <h3 className="relative mt-2 animate-[menuItemRise_0.5s_ease-out_0.16s_both] font-logo text-2xl">
            Thank you, {successName || "friend"}
          </h3>
          <p className="relative mt-3 animate-[menuItemRise_0.5s_ease-out_0.24s_both] text-sm leading-relaxed text-white/75">
            {successName
              ? `${successName}, we can’t wait to celebrate Angela with you in Barcelona. Please arrive at Purobeach · Hilton Diagonal Mar by 6:30 PM if you’re joining dinner.`
              : "We can’t wait to celebrate Angela with you in Barcelona. Please arrive at Purobeach · Hilton Diagonal Mar by 6:30 PM if you’re joining dinner."}
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/menu"
              className="group relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-sm bg-[#d7ad62] px-6 text-[0.68rem] font-extrabold tracking-[0.14em] text-[#102536] uppercase transition-all duration-300 hover:scale-[1.03] hover:bg-[#edca87] animate-[softPulse_1.8s_ease-out_infinite]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative inline-flex items-center gap-1.5">
                Choose Menu
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="inline-flex min-h-11 items-center justify-center border border-white/30 px-6 text-[0.68rem] font-extrabold tracking-[0.14em] text-white uppercase transition-all duration-300 hover:scale-[1.02] hover:border-[#d8ad61] hover:text-[#d8ad61]"
            >
              Close
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      {successModal}

      <div className={isDark ? "" : "border border-[#d8cfbf] bg-[#fbf8f2] px-5 py-7 sm:px-8 sm:py-9"}>
        {showHeading && (
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              {!isDark && (
                <p className="font-script text-2xl text-[#c99b4e]">Save your place</p>
              )}
              <h2
                id={headingId}
                className={
                  isDark
                    ? "font-logo text-4xl font-medium tracking-[-0.02em] text-[#d8ad61] sm:text-5xl"
                    : "mt-1 font-logo text-3xl font-medium tracking-[-0.02em] text-[#0b2638] sm:text-4xl"
                }
              >
                RSVP
              </h2>
              {isDark && (
                <p className="mt-1 font-script text-xl text-white sm:text-2xl">
                  {displayName
                    ? `${displayName}, we’d love to celebrate with you!`
                    : "We'd love to celebrate with you!"}
                </p>
              )}
              {!isDark && displayName && (
                <p className="mt-2 text-sm text-[#4a5d6a]">
                  Welcome, <span className="font-semibold text-[#061c2b]">{displayName}</span>
                </p>
              )}
            </div>
            <p
              className={
                isDark
                  ? "text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61]/80 uppercase"
                  : "text-[0.65rem] font-bold tracking-[0.16em] text-[#8a7348] uppercase"
              }
            >
              Step {step} of 3
            </p>
          </div>
        )}

        {!showHeading && (
          <p
            className={
              isDark
                ? "text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61]/80 uppercase"
                : "text-[0.65rem] font-bold tracking-[0.16em] text-[#8a7348] uppercase"
            }
          >
            Step {step} of 3
          </p>
        )}

        <div className={`${showHeading ? "mt-6" : "mt-3"} flex gap-2`} aria-label="RSVP progress">
          {steps.map((entry) => {
            const isActive = entry.id === step;
            const isDone = entry.id < step;
            return (
              <div key={entry.id} className="min-w-0 flex-1">
                <div
                  className={`h-1 transition-colors duration-300 ${
                    isActive || isDone
                      ? "bg-[#d8ad61]"
                      : isDark
                        ? "bg-white/20"
                        : "bg-[#e4ddd0]"
                  }`}
                />
                <p
                  className={`mt-2 text-[0.62rem] font-bold tracking-[0.12em] uppercase ${
                    isActive
                      ? isDark
                        ? "text-white"
                        : "text-[#0b2638]"
                      : isDark
                        ? "text-white/45"
                        : "text-[#8a7348]/70"
                  }`}
                >
                  {entry.label}
                </p>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8">
          {step === 1 && (
            <div
              key="step-1"
              className="animate-[menuSlideFromRight_0.4s_cubic-bezier(0.22,1,0.36,1)] space-y-4"
            >
              <p className={hintClass}>
                {displayName
                  ? `${displayName}, tell us who you are so we can welcome you properly.`
                  : "Tell us who you are so we can welcome you properly."}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>First Name</span>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder={isDark ? "First Name" : undefined}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Last Name</span>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder={isDark ? "Last Name" : undefined}
                    className={inputClass}
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={isDark ? "Email Address" : undefined}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>
                    Phone{" "}
                    <span
                      className={`normal-case tracking-normal ${
                        isDark ? "text-white/45" : "text-[#8a7348]/60"
                      }`}
                    >
                      (optional)
                    </span>
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder={isDark ? "Phone Number" : undefined}
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Country</span>
                <select
                  required
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className={`${inputClass} appearance-none ${isDark ? "text-white/80" : ""}`}
                >
                  <option value="" disabled className={isDark ? "bg-[#061c2b] text-white" : ""}>
                    {isDark ? "Country" : "Select country"}
                  </option>
                  {countries.map((entry) => (
                    <option
                      key={entry.value}
                      value={entry.value}
                      className={isDark ? "bg-[#061c2b] text-white" : ""}
                    >
                      {entry.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {step === 2 && (
            <div
              key="step-2"
              className="animate-[menuSlideFromRight_0.4s_cubic-bezier(0.22,1,0.36,1)] space-y-4"
            >
              <p className={hintClass}>
                {displayName
                  ? `${displayName}, choose the moments you’ll join — evening dinner, afternoon cruise, or both.`
                  : "Choose the moments you’ll join — evening dinner, afternoon cruise, or both."}
              </p>

              <button
                type="button"
                onClick={() => setAttendDinner((value) => !value)}
                className={`w-full border px-5 py-4 text-left transition-all duration-300 hover:scale-[1.01] ${
                  attendDinner ? planActiveClass : planIdleClass
                }`}
              >
                <span className="block font-logo text-xl">Dinner Celebration</span>
                <span
                  className={`mt-1 block text-sm ${
                    attendDinner
                      ? "text-white/70"
                      : isDark
                        ? "text-white/55"
                        : "text-[#4a5d6a]"
                  }`}
                >
                  Arrive by 6:30 PM · Purobeach · Hilton Diagonal Mar
                </span>
                <span
                  className={`mt-1.5 block text-xs leading-relaxed ${
                    attendDinner
                      ? "text-white/55"
                      : isDark
                        ? "text-white/40"
                        : "text-[#6b7c88]"
                  }`}
                >
                  Birthday dinner, fellowship &amp; speeches · dress code elegant
                </span>
              </button>

              <button
                type="button"
                onClick={() => setJoinCruise((value) => !value)}
                className={`w-full border px-5 py-4 text-left transition-all duration-300 hover:scale-[1.01] ${
                  joinCruise ? planActiveClass : planIdleClass
                }`}
              >
                <span className="block font-logo text-xl">Catamaran Cruise</span>
                <span
                  className={`mt-1 block text-sm ${
                    joinCruise
                      ? "text-white/70"
                      : isDark
                        ? "text-white/55"
                        : "text-[#4a5d6a]"
                  }`}
                >
                  Marina by 1:00 PM · sail 2:00–3:00 PM
                </span>
                <span
                  className={`mt-1.5 block text-xs leading-relaxed ${
                    joinCruise
                      ? "text-white/55"
                      : isDark
                        ? "text-white/40"
                        : "text-[#6b7c88]"
                  }`}
                >
                  Port Olímpic · private sail with music, welcome drinks &amp; snacks
                </span>
              </button>

              {joinCruise && (
                <p
                  className={`animate-[menuItemRise_0.35s_ease-out] text-xs leading-relaxed ${
                    isDark ? "text-white/55" : "text-[#4a5d6a]"
                  }`}
                >
                  After the cruise (3:00–6:30 PM), return to your hotel, explore, or freshen up
                  before dinner.
                </p>
              )}

              <label
                className={`flex items-start gap-3 border px-4 py-4 ${
                  isDark ? "border-white/25 bg-white/5" : "border-[#d8cfbf] bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={bringingGuest}
                  onChange={(event) => {
                    setBringingGuest(event.target.checked);
                    if (!event.target.checked) setGuestName("");
                  }}
                  className="mt-1 size-4 accent-[#d8ad61]"
                />
                <span className={`text-sm ${isDark ? "text-white" : "text-[#0b2638]"}`}>
                  I will be bringing a guest
                </span>
              </label>

              {bringingGuest && (
                <label className="block animate-[menuItemRise_0.35s_ease-out]">
                  <span className={labelClass}>Guest Name</span>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    placeholder="Your guest’s full name"
                    className={inputClass}
                  />
                </label>
              )}
            </div>
          )}

          {step === 3 && (
            <div
              key="step-3"
              className="animate-[menuSlideFromRight_0.4s_cubic-bezier(0.22,1,0.36,1)] space-y-5"
            >
              <p className={hintClass}>
                {displayName
                  ? `${displayName}, review your details, leave a note if you’d like, then send your RSVP.`
                  : "Review your details, leave a note if you’d like, then send your RSVP."}
              </p>

              <div className={summaryClass}>
                <p className="font-logo text-xl">
                  {firstName} {lastName}
                </p>
                <p className={`mt-2 ${isDark ? "text-white/70" : "text-[#4a5d6a]"}`}>{email}</p>
                {phone && (
                  <p className={isDark ? "text-white/70" : "text-[#4a5d6a]"}>{phone}</p>
                )}
                <div
                  className={`mt-4 space-y-1 border-t pt-4 ${
                    isDark ? "border-white/15" : "border-[#e8e0d2]"
                  }`}
                >
                  <p>
                    <span className="text-[#d8ad61]">Dinner:</span>{" "}
                    {attendDinner
                      ? "Yes · Purobeach · Hilton from 6:30 PM"
                      : "No"}
                  </p>
                  <p>
                    <span className="text-[#d8ad61]">Cruise:</span>{" "}
                    {joinCruise
                      ? "Yes · marina 1:00 PM, sail 2:00–3:00 PM"
                      : "No"}
                  </p>
                  <p>
                    <span className="text-[#d8ad61]">Guest:</span>{" "}
                    {bringingGuest ? guestName || "Yes" : "No"}
                  </p>
                  {attendDinner && (
                    <p className={`pt-1 text-xs ${isDark ? "text-white/50" : "text-[#6b7c88]"}`}>
                      Dress code: elegant
                    </p>
                  )}
                </div>
              </div>

              <label className="block">
                <span className={labelClass}>
                  Message{" "}
                  <span
                    className={`normal-case tracking-normal ${
                      isDark ? "text-white/45" : "text-[#8a7348]/60"
                    }`}
                  >
                    (optional)
                  </span>
                </span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={3}
                  placeholder="A note for Angela, travel notes, or anything we should know"
                  className={`${inputClass} py-3`}
                />
              </label>
            </div>
          )}

          {error && (
            <p
              className={`mt-4 text-sm ${isDark ? "text-[#f0b4b4]" : "text-[#a33b3b]"}`}
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            {step > 1 && (
              <button type="button" onClick={goBack} className={backBtnClass}>
                <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
                  ←
                </span>
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="group relative inline-flex min-h-12 flex-1 items-center justify-center overflow-hidden rounded-sm bg-[#d7ad62] px-8 text-[0.7rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-all duration-300 hover:scale-[1.02] hover:bg-[#edca87] sm:flex-none animate-[softPulse_2s_ease-out_infinite]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <span className="relative inline-flex items-center gap-1.5">
                  {displayName && step === 1 ? `Continue, ${displayName}` : "Continue"}
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPending}
                className={`group relative inline-flex min-h-12 flex-1 items-center justify-center overflow-hidden rounded-sm bg-[#d7ad62] px-8 text-[0.7rem] font-extrabold tracking-[0.16em] text-[#102536] uppercase transition-all duration-300 hover:scale-[1.02] hover:bg-[#edca87] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none ${
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
                      Sending...
                    </>
                  ) : (
                    <>
                      Complete RSVP
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    </>
                  )}
                </span>
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
