"use client";

import { useTransition } from "react";
import { signOutAdmin } from "@/app/actions/admin-auth";

export function AdminSignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => signOutAdmin())}
      className="w-full border border-white/15 px-3 py-2.5 text-left text-sm text-white/70 transition hover:border-[#d8ad61]/50 hover:text-[#d8ad61] disabled:opacity-60"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
