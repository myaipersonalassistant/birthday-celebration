"use client";

import { useState } from "react";
import { AdminGalleryPanel } from "@/components/admin/AdminGalleryPanel";
import { AdminInvitationPanel } from "@/components/admin/AdminInvitationPanel";
import type { AdminGalleryItem } from "@/app/actions/admin-gallery";
import type { InvitationMedia } from "@/lib/invitation";

type StudioTab = "gallery" | "invitation";

type AdminStudioMediaProps = {
  galleryItems: AdminGalleryItem[];
  invitation: InvitationMedia | null;
};

export function AdminStudioMedia({
  galleryItems,
  invitation,
}: AdminStudioMediaProps) {
  const [tab, setTab] = useState<StudioTab>("gallery");

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <div
          role="tablist"
          aria-label="Studio sections"
          className="flex border border-[#061c2b]/20"
          style={{ width: "fit-content" }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "gallery"}
            onClick={() => setTab("gallery")}
            className={`shrink-0 px-5 py-3 text-[0.7rem] font-bold tracking-[0.14em] uppercase transition-colors ${
              tab === "gallery"
                ? "bg-[#061c2b] text-white"
                : "bg-white text-[#061c2b]/55 hover:bg-[#faf8f4] hover:text-[#061c2b]"
            }`}
          >
            Gallery
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "invitation"}
            onClick={() => setTab("invitation")}
            className={`shrink-0 px-5 py-3 text-[0.7rem] font-bold tracking-[0.14em] uppercase transition-colors ${
              tab === "invitation"
                ? "bg-[#061c2b] text-white"
                : "bg-white text-[#061c2b]/55 hover:bg-[#faf8f4] hover:text-[#061c2b]"
            }`}
          >
            Invitation
            {invitation ? (
              <span
                className={`ml-2 inline-block size-1.5 rounded-full align-middle ${
                  tab === "invitation" ? "bg-[#d8ad61]" : "bg-emerald-500"
                }`}
                title="Invitation video is live"
              />
            ) : null}
          </button>
        </div>
      </div>

      {tab === "gallery" ? (
        <div role="tabpanel">
          <AdminGalleryPanel initialItems={galleryItems} />
        </div>
      ) : (
        <div role="tabpanel">
          <AdminInvitationPanel initialMedia={invitation} />
        </div>
      )}
    </div>
  );
}
