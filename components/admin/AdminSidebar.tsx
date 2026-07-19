"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";

const navItems = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/visitors", label: "Visitors" },
  { href: "/admin/studio", label: "Studio" },
  { href: "/admin/rsvp", label: "RSVPs" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/guestbook", label: "Guestbook" },
] as const;

type AdminSidebarProps = {
  email: string;
};

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href, "exact" in item && item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`px-3 py-2.5 text-sm transition ${
              active
                ? "border-l-2 border-[#d8ad61] bg-white/5 text-[#d8ad61]"
                : "border-l-2 border-transparent text-white/70 hover:bg-white/[0.03] hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/10 bg-[#061c2b] px-4 py-3 lg:hidden">
        <div>
          <p className="font-logo text-xl text-white">Admin</p>
          <p className="text-[0.65rem] tracking-[0.12em] text-[#d8ad61] uppercase">
            Celebration desk
          </p>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle admin menu"
          onClick={() => setOpen((value) => !value)}
          className="border border-white/20 px-3 py-2 text-xs tracking-[0.1em] text-white uppercase"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-b border-white/10 bg-[#0a2436] px-3 py-4 lg:hidden">
          {nav}
          <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
            <p className="truncate px-1 text-xs text-white/45">{email}</p>
            <Link
              href="/"
              className="block px-3 py-2 text-sm text-white/70 transition hover:text-[#d8ad61]"
              onClick={() => setOpen(false)}
            >
              View site
            </Link>
            <AdminSignOutButton />
          </div>
        </div>
      )}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#061c2b] text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-6">
          <p className="font-logo text-2xl">Admin</p>
          <p className="mt-1 text-[0.65rem] tracking-[0.16em] text-[#d8ad61] uppercase">
            Celebration desk
          </p>
        </div>

        <div className="flex flex-1 flex-col px-3 py-5">{nav}</div>

        <div className="space-y-2 border-t border-white/10 px-3 py-4">
          <p className="truncate px-1 text-xs text-white/45">{email}</p>
          <Link
            href="/"
            className="block px-3 py-2 text-sm text-white/70 transition hover:text-[#d8ad61]"
          >
            View site
          </Link>
          <AdminSignOutButton />
        </div>
      </aside>
    </>
  );
}
