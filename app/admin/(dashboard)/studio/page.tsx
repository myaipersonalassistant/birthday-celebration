import { getAdminGalleryMedia } from "@/app/actions/admin-gallery";
import { getAdminInvitationMedia } from "@/app/actions/admin-invitation";
import { AdminStudioMedia } from "@/components/admin/AdminStudioMedia";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";

export default async function AdminStudioPage() {
  const [items, invitation] = await Promise.all([
    getAdminGalleryMedia(),
    getAdminInvitationMedia(),
  ]);

  return (
    <AdminSectionShell
      eyebrow="Media"
      title="Studio"
      description="Publish photos and videos for the gallery, or manage Chris’s invitation video for /invitation."
      publicHref="/gallery"
      publicLabel="Open public gallery"
    >
      <AdminStudioMedia galleryItems={items} invitation={invitation} />
    </AdminSectionShell>
  );
}
