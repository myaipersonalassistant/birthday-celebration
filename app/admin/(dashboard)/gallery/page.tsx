import { AdminSectionShell } from "@/components/admin/AdminSectionShell";

export default function AdminGalleryPage() {
  return (
    <AdminSectionShell
      eyebrow="Media"
      title="Gallery"
      description="Upload celebration photos and videos for guests to browse on the public gallery."
      publicHref="/gallery"
    >
      <div className="border border-dashed border-[#d8cfbf] bg-white/70 px-6 py-14 text-center">
        <p className="font-logo text-2xl text-[#061c2b]">Uploads coming next</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#4a5d6a]">
          This section will connect to Supabase Storage and the gallery_media
          table so you can publish photos and videos from here.
        </p>
      </div>
    </AdminSectionShell>
  );
}
