import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminLoginForm,
  AdminLoginFormSkeleton,
} from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#061c2b] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(216,173,97,0.22),transparent_45%),radial-gradient(ellipse_at_90%_80%,rgba(216,173,97,0.1),transparent_40%),linear-gradient(160deg,#061c2b_0%,#0a2436_55%,#061c2b_100%)]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col lg:flex-row">
        <section className="flex flex-1 flex-col justify-between px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-xs tracking-[0.14em] text-white/50 uppercase transition hover:text-[#d8ad61]"
          >
            ← Celebration site
          </Link>

          <div className="my-16 max-w-md lg:my-0">
            <p className="animate-[menuItemRise_0.7s_ease-out_both] text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
              Private desk
            </p>
            <h1 className="mt-4 animate-[menuItemRise_0.75s_ease-out_0.05s_both] font-logo text-[clamp(3rem,8vw,4.75rem)] leading-[0.95] tracking-[-0.03em]">
              Angela
              <span className="block text-[#d8ad61]">Ifonlaja</span>
            </h1>
            <p className="mt-4 animate-[menuItemRise_0.75s_ease-out_0.1s_both] font-script text-3xl text-[#d8ad61] sm:text-4xl">
              celebration admin
            </p>
            <p className="mt-5 max-w-sm animate-[menuItemRise_0.75s_ease-out_0.15s_both] text-sm leading-relaxed text-white/60 sm:text-base">
              Sign in to manage studio media, Purobeach · Hilton dinner &amp;
              catamaran RSVPs, evening menu choices, and guestbook messages.
            </p>
            <div className="mt-6 h-px w-12 bg-[#d8ad61] animate-[menuItemRise_0.75s_ease-out_0.2s_both]" />
          </div>

          <p className="hidden text-[0.65rem] tracking-[0.14em] text-white/30 uppercase lg:block">
            Authorised access only
          </p>
        </section>

        <section className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8 lg:px-12 lg:py-16">
          <div className="w-full max-w-md animate-[scaleIn_0.55s_cubic-bezier(0.22,1,0.36,1)]">
            <div className="rounded-2xl border border-[#d8ad61]/25 bg-[#0a2436]/80 p-7 shadow-[0_40px_100px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-9">
              <div className="mb-7">
                <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
                  Sign in
                </p>
                <h2 className="mt-2 font-logo text-3xl tracking-[-0.02em]">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-white/50">
                  Use your admin email and password to continue.
                </p>
              </div>

              <Suspense fallback={<AdminLoginFormSkeleton />}>
                <AdminLoginForm />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
