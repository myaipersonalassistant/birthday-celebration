import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
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
    <main className="relative min-h-dvh overflow-x-hidden bg-[#061c2b] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(216,173,97,0.2),transparent_42%),radial-gradient(ellipse_at_100%_100%,rgba(216,173,97,0.08),transparent_40%),linear-gradient(165deg,#061c2b_0%,#0a2436_50%,#061c2b_100%)] lg:bg-[radial-gradient(ellipse_at_15%_20%,rgba(216,173,97,0.22),transparent_45%),radial-gradient(ellipse_at_90%_80%,rgba(216,173,97,0.1),transparent_40%),linear-gradient(160deg,#061c2b_0%,#0a2436_55%,#061c2b_100%)]" />
        <div className="absolute inset-0 hidden opacity-[0.04] lg:block [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-6xl lg:grid-cols-2">
        {/* Brand panel — compact on mobile, full story on desktop */}
        <section className="flex flex-col px-5 pt-6 pb-2 sm:px-8 lg:justify-between lg:px-12 lg:py-14 xl:px-16">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-[0.65rem] tracking-[0.14em] text-white/45 uppercase transition hover:text-[#d8ad61] sm:text-xs"
          >
            ← Celebration site
          </Link>

          {/* Mobile brand: centered, compact */}
          <div className="mt-8 flex flex-col items-center text-center lg:hidden">
            <p className="text-[0.65rem] font-bold tracking-[0.2em] text-[#d8ad61] uppercase">
              Private desk
            </p>
            <Link
              href="/"
              aria-label="Celebrate Angela—home"
              className="mt-4 block"
            >
              <Image
                src="/logobg.png"
                alt="Celebrate Angela Ifonlaja"
                width={220}
                height={260}
                priority
                className="mx-auto h-28 w-auto object-contain mix-blend-screen sm:h-36"
              />
            </Link>
            <p className="mt-3 font-script text-2xl text-[#d8ad61] sm:text-3xl">
              celebration admin
            </p>
          </div>

          {/* Desktop brand: left-aligned, fuller */}
          <div className="my-auto hidden max-w-md lg:block">
            <p className="animate-[menuItemRise_0.7s_ease-out_both] text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
              Private desk
            </p>
            <Link
              href="/"
              aria-label="Celebrate Angela—home"
              className="mt-8 inline-block animate-[menuItemRise_0.75s_ease-out_0.05s_both]"
            >
              <Image
                src="/logobg.png"
                alt="Celebrate Angela Ifonlaja"
                width={340}
                height={400}
                priority
                className="h-56 w-auto object-contain object-left mix-blend-screen xl:h-64"
              />
            </Link>
            <p className="mt-6 animate-[menuItemRise_0.75s_ease-out_0.1s_both] font-script text-4xl text-[#d8ad61]">
              celebration admin
            </p>
            <p className="mt-5 max-w-sm animate-[menuItemRise_0.75s_ease-out_0.15s_both] text-base leading-relaxed text-white/60">
              Sign in to manage studio media, Purobeach · Hilton dinner &amp;
              catamaran RSVPs, evening menu choices, and guestbook messages.
            </p>
            <div className="mt-7 h-px w-12 bg-[#d8ad61] animate-[menuItemRise_0.75s_ease-out_0.2s_both]" />
          </div>

          <p className="mt-auto hidden pt-10 text-[0.65rem] tracking-[0.14em] text-white/30 uppercase lg:block">
            Authorised access only
          </p>
        </section>

        {/* Sign-in panel */}
        <section className="flex items-start justify-center px-5 pt-6 pb-10 sm:px-8 sm:pb-12 lg:items-center lg:px-12 lg:py-14 xl:px-16">
          <div className="w-full max-w-[400px] animate-[scaleIn_0.55s_cubic-bezier(0.22,1,0.36,1)]">
            <div className="border border-[#d8ad61]/25 bg-[#0a2436]/90 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8 lg:rounded-2xl lg:p-9 lg:shadow-[0_40px_100px_rgba(0,0,0,0.45)]">
              <div className="mb-6 sm:mb-7">
                <p className="text-[0.65rem] font-bold tracking-[0.18em] text-[#d8ad61] uppercase">
                  Sign in
                </p>
                <h1 className="mt-2 font-logo text-[1.85rem] tracking-[-0.02em] sm:text-3xl">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Use your admin email and password to continue.
                </p>
              </div>

              <Suspense fallback={<AdminLoginFormSkeleton />}>
                <AdminLoginForm />
              </Suspense>
            </div>

            <p className="mt-5 text-center text-[0.65rem] tracking-[0.12em] text-white/30 uppercase lg:hidden">
              Authorised access only
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
