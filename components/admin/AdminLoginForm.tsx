"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInAdmin } from "@/app/actions/admin-auth";

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AdminLoginFormSkeleton() {
  return (
    <div className="space-y-5" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-3 w-14 animate-pulse bg-white/10" />
        <div className="h-12 animate-pulse bg-white/[0.06]" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-20 animate-pulse bg-white/10" />
        <div className="h-12 animate-pulse bg-white/[0.06]" />
      </div>
      <div className="h-12 animate-pulse bg-[#d8ad61]/35" />
    </div>
  );
}

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isBusy = isPending || isRedirecting;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await signInAdmin(email, password);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setIsRedirecting(true);

      const next = searchParams.get("next");
      const destination =
        next && next.startsWith("/admin") && !next.startsWith("/admin/login")
          ? next
          : "/admin";
      router.replace(destination);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5" noValidate>
      {isRedirecting && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0a2436]/85 backdrop-blur-[2px] animate-[fadeIn_0.25s_ease-out]"
          role="status"
          aria-live="polite"
        >
          <Spinner className="size-8 text-[#d8ad61]" />
          <p className="text-xs font-bold tracking-[0.16em] text-[#d8ad61] uppercase">
            Opening dashboard
          </p>
        </div>
      )}

      <div className="animate-[menuItemRise_0.5s_ease-out_both]">
        <label
          htmlFor="admin-email"
          className="mb-2 block text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase"
        >
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          disabled={isBusy}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 w-full border border-white/12 bg-[#061c2b]/55 px-4 py-3.5 text-base text-white outline-none transition placeholder:text-white/30 focus:border-[#d8ad61] focus:bg-[#061c2b]/75 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          placeholder="you@example.com"
        />
      </div>

      <div className="animate-[menuItemRise_0.5s_ease-out_0.06s_both]">
        <label
          htmlFor="admin-password"
          className="mb-2 block text-[0.65rem] font-bold tracking-[0.16em] text-[#d8ad61] uppercase"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            disabled={isBusy}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-12 w-full border border-white/12 bg-[#061c2b]/55 px-4 py-3.5 pr-16 text-base text-white outline-none transition placeholder:text-white/30 focus:border-[#d8ad61] focus:bg-[#061c2b]/75 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            placeholder="Enter your password"
          />
          <button
            type="button"
            tabIndex={-1}
            disabled={isBusy}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[0.65rem] font-bold tracking-[0.12em] text-white/45 uppercase transition hover:text-[#d8ad61] disabled:opacity-40"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="animate-[scaleIn_0.35s_ease-out] border border-[#d8ad61]/25 bg-[#d8ad61]/10 px-3.5 py-3 text-sm text-[#f3e6c8]"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isBusy}
        className="group relative flex min-h-12 w-full items-center justify-center gap-2.5 overflow-hidden bg-[#d8ad61] px-4 py-4 text-sm font-bold tracking-[0.14em] text-[#102536] uppercase transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-80 animate-[menuItemRise_0.5s_ease-out_0.12s_both]"
      >
        {isPending && !isRedirecting ? (
          <>
            <Spinner className="size-4" />
            Signing in…
          </>
        ) : isRedirecting ? (
          <>
            <Spinner className="size-4" />
            Redirecting…
          </>
        ) : (
          <>
            Sign in
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </>
        )}
      </button>
    </form>
  );
}
