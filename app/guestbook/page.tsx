import type { Metadata } from "next";
import Image from "next/image";
import { getGuestbookMessages } from "@/app/actions/guestbook";
import { Footer } from "@/components/Footer";
import { GuestbookExperience } from "@/components/GuestbookExperience";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Guestbook | Angela Ifonlaja",
  description:
    "Leave a birthday message for Angela Ifonlaja — a digital guestbook for the Barcelona celebration.",
};

export default async function GuestbookPage() {
  const messages = await getGuestbookMessages();

  return (
    <main className="min-h-screen bg-[#f7f3eb]">
      <Header />

      <section className="relative overflow-hidden bg-[#061c2b] px-5 pt-28 pb-14 text-white sm:px-8 sm:pt-32 sm:pb-16 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(216,173,97,0.2),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(216,173,97,0.12),transparent_35%)]" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid grid-cols-3"
        >
          <div className="relative overflow-hidden">
            <Image
              src="/left.png"
              alt=""
              width={707}
              height={345}
              className="absolute top-1/2 left-0 h-[92%] w-auto max-w-full -translate-y-1/2 object-contain object-left opacity-[0.16]"
            />
          </div>
          <div />
          <div className="relative overflow-hidden">
            <Image
              src="/right.png"
              alt=""
              width={722}
              height={346}
              className="absolute top-1/2 right-0 h-[92%] w-auto max-w-full -translate-y-1/2 object-contain object-right opacity-[0.16]"
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1100px] text-center">
          <p className="animate-[menuItemRise_0.7s_ease-out_both] text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
            Words that linger
          </p>
          <h1 className="mt-3 animate-[menuItemRise_0.75s_ease-out_0.06s_both] font-logo text-[clamp(2.6rem,7vw,4.8rem)] font-medium tracking-[-0.03em]">
            Guestbook
          </h1>
          <p className="mx-auto mt-3 max-w-xl animate-[menuItemRise_0.75s_ease-out_0.12s_both] font-script text-3xl text-[#d8ad61] sm:text-4xl">
            letters for Angela
          </p>
          <p className="mx-auto mt-4 max-w-2xl animate-[menuItemRise_0.75s_ease-out_0.18s_both] text-sm leading-relaxed text-white/75 sm:text-base">
            Sign the book with a wish, a prayer, or a memory — every note becomes part of this
            Barcelona celebration.
          </p>
          <div className="mx-auto mt-5 h-px w-12 bg-[#d8ad61]" />
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <GuestbookExperience initialMessages={messages} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
