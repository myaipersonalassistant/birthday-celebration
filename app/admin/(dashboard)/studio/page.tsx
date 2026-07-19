import { getAdminGalleryMedia } from "@/app/actions/admin-gallery";
import { AdminGalleryPanel } from "@/components/admin/AdminGalleryPanel";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";

export default async function AdminStudioPage() {
  const items = await getAdminGalleryMedia();

  return (
    <AdminSectionShell
      eyebrow="Media"
      title="Studio"
      description="Upload and publish photos or videos for the public gallery — Angela’s celebration day in Barcelona."
      publicHref="/gallery"
      publicLabel="Open public gallery"
    >
      <AdminGalleryPanel initialItems={items} />
    </AdminSectionShell>
  );
}
