import type { Metadata } from "next";
import { getGalleryMedia } from "@/app/actions/gallery";
import { Footer } from "@/components/Footer";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Gallery | Angela Ifonlaja",
  description:
    "Photos and videos from Angela Ifonlaja's birthday celebration in Barcelona — party moments, guests, and the evening together.",
};

export default async function GalleryPage() {
  const items = await getGalleryMedia();

  return (
    <main className="min-h-screen bg-[#f7f3eb]">
      <Header />

      <section className="relative overflow-hidden bg-[#061c2b] px-5 pt-28 pb-14 text-white sm:px-8 sm:pt-32 sm:pb-16 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(216,173,97,0.2),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(216,173,97,0.12),transparent_35%)]" />
        <div className="relative mx-auto max-w-[1100px] text-center">
          <p className="animate-[menuItemRise_0.7s_ease-out_both] text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
            Captured in light
          </p>
          <h1 className="mt-3 animate-[menuItemRise_0.75s_ease-out_0.06s_both] font-logo text-[clamp(2.6rem,7vw,4.8rem)] font-medium tracking-[-0.03em]">
            Gallery
          </h1>
          <p className="mx-auto mt-3 max-w-xl animate-[menuItemRise_0.75s_ease-out_0.12s_both] font-script text-3xl text-[#d8ad61] sm:text-4xl">
            moments to remember
          </p>
          <p className="mx-auto mt-4 max-w-2xl animate-[menuItemRise_0.75s_ease-out_0.18s_both] text-sm leading-relaxed text-white/75 sm:text-base">
            Photos and videos from the celebration — the venue, the party, and
            the people who made the evening shine.
          </p>
          <div className="mx-auto mt-5 h-px w-12 bg-[#d8ad61]" />
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <GalleryGrid items={items} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
