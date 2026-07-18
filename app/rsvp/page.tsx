import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RsvpForm } from "@/components/RsvpForm";

export const metadata: Metadata = {
  title: "RSVP | Angela Ifonlaja",
  description:
    "RSVP for Angela Ifonlaja's birthday celebration in Barcelona — dinner at Purobeach and optional catamaran cruise.",
};

export default function RsvpPage() {
  return (
    <main className="min-h-screen bg-[#f7f3eb]">
      <Header />

      <section className="relative overflow-hidden bg-[#061c2b] px-5 pt-28 pb-14 text-white sm:px-8 sm:pt-32 sm:pb-16 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(216,173,97,0.2),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(216,173,97,0.12),transparent_35%)]" />
        <div className="relative mx-auto max-w-[1100px] text-center">
          <p className="animate-[menuItemRise_0.7s_ease-out_both] text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
            Friday · 7 August 2026
          </p>
          <h1 className="mt-3 animate-[menuItemRise_0.75s_ease-out_0.06s_both] font-logo text-[clamp(2.6rem,7vw,4.6rem)] font-medium tracking-[-0.03em]">
            Join the Celebration
          </h1>
          <p className="mx-auto mt-3 max-w-xl animate-[menuItemRise_0.75s_ease-out_0.12s_both] font-script text-3xl text-[#d8ad61] sm:text-4xl">
            We’d love to celebrate with you
          </p>
          <p className="mx-auto mt-4 max-w-2xl animate-[menuItemRise_0.75s_ease-out_0.18s_both] text-sm leading-relaxed text-white/75 sm:text-base">
            Confirm your place for Angela’s birthday in Barcelona — dinner under the stars, and
            an optional afternoon on the water.
          </p>
          <div className="mx-auto mt-5 h-px w-12 bg-[#d8ad61]" />
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <RsvpForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
