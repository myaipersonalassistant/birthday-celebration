import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MenuForm } from "@/components/MenuForm";

export const metadata: Metadata = {
  title: "Celebration Menu | Angela Ifonlaja",
  description: "Select your dinner menu for Angela Ifonlaja's birthday celebration in Barcelona.",
};

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#f7f3eb]">
      <Header />

      <section className="relative overflow-hidden bg-[#061c2b] px-5 pt-28 pb-14 text-white sm:px-8 sm:pt-32 sm:pb-16 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(216,173,97,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(216,173,97,0.12),transparent_35%)]" />
        <div className="relative mx-auto max-w-[900px] text-center">
          <p className="text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
            Dinner Under the Stars
          </p>
          <h1 className="mt-3 font-logo text-[clamp(2.4rem,6vw,4.2rem)] font-medium tracking-[-0.03em]">
            Celebration Menu
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Browse the Premium Menu, choose your main and dessert, then submit — sharing plates
            are served for the table.
          </p>
          <div className="mx-auto mt-5 h-px w-12 bg-[#d8ad61]" />
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[900px]">
          <MenuForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
