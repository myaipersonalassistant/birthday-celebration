import type { Metadata } from "next";
import Link from "next/link";
import { getInvitationMedia } from "@/app/actions/admin-invitation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InvitationPlayer } from "@/components/InvitationPlayer";

export const metadata: Metadata = {
  title: "The Invitation | Angela Ifonlaja",
  description:
    "A personal invitation from Chris — join us for Angela Ifonlaja's appreciation and birthday celebration in Barcelona.",
};

export default async function InvitationPage() {
  const media = await getInvitationMedia();

  return (
    <main className="min-h-screen bg-[#061c2b] text-white">
      <Header />

      <section className="relative px-5 pt-28 pb-16 sm:px-8 sm:pt-32 sm:pb-20 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(216,173,97,0.14),transparent_45%)]"
        />

        <div className="relative mx-auto flex max-w-[720px] flex-col items-center text-center">
          <p className="animate-[menuItemRise_0.7s_ease-out_both] text-xs font-bold tracking-[0.22em] text-[#d8ad61] uppercase">
            From the heart
          </p>
          <h1 className="mt-3 animate-[menuItemRise_0.75s_ease-out_0.06s_both] font-logo text-[clamp(2.8rem,8vw,4.6rem)] font-medium tracking-[-0.03em]">
            The Invitation
          </h1>
          <p className="mt-3 animate-[menuItemRise_0.75s_ease-out_0.12s_both] font-script text-3xl text-[#d8ad61]/85 sm:text-4xl">
            a word from{" "}
            <span className="ml-1 inline-block font-logo text-[0.85em] font-semibold tracking-[0.04em] text-[#f0d9a0]">
              Chris
            </span>
          </p>
          <p className="mx-auto mt-5 max-w-md animate-[menuItemRise_0.75s_ease-out_0.18s_both] text-sm leading-relaxed text-white/70 sm:text-base">
            Before the boats, the dinner, and the celebration — hear a personal
            invitation from Angela&apos;s husband.
          </p>
          <div className="mx-auto mt-6 h-px w-12 bg-[#d8ad61]/70" />

          <div className="mt-10 w-full animate-[scaleIn_0.85s_ease-out_0.2s_both]">
            <InvitationPlayer
              videoUrl={media?.videoUrl ?? null}
              posterUrl={media?.posterUrl}
            />
          </div>

          <div className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 animate-[menuItemRise_0.8s_ease-out_0.3s_both] sm:flex-row sm:justify-center">
            <Link
              href="/rsvp"
              className="inline-flex min-h-12 items-center justify-center rounded-sm bg-[#d7ad62] px-7 text-[0.67rem] font-extrabold tracking-[0.18em] text-[#102536] transition-colors hover:bg-[#edca87]"
            >
              RESERVE YOUR PLACE
            </Link>
            <Link
              href="/guestbook"
              className="inline-flex min-h-12 items-center justify-center px-4 text-[0.67rem] font-extrabold tracking-[0.14em] text-white/85 transition-colors hover:text-[#e4be77]"
            >
              LEAVE A MESSAGE
            </Link>
          </div>

          <p className="mt-10 text-[0.68rem] font-semibold tracking-[0.14em] text-white/50 uppercase">
            7 August 2026 · Barcelona · 1:00 PM
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
