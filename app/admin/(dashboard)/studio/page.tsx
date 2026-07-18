import { getAdminGalleryMedia } from "@/app/actions/admin-gallery";
import { AdminGalleryPanel } from "@/components/admin/AdminGalleryPanel";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";

export default async function AdminStudioPage() {
  const items = await getAdminGalleryMedia();

  return (
    <AdminSectionShell
      eyebrow="Media"
      title="Studio"
      publicHref="/gallery"
      publicLabel="Open public gallery"
    >
      <AdminGalleryPanel initialItems={items} />
    </AdminSectionShell>
  );
}
