import { getAdminMenuSubmissions } from "@/app/actions/admin-menu";
import { AdminMenuPanel } from "@/components/admin/AdminMenuPanel";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";

export default async function AdminMenuPage() {
  const submissions = await getAdminMenuSubmissions();

  return (
    <AdminSectionShell
      eyebrow="Dining"
      title="Menu"
      description="Kitchen board for the evening dinner at Purobeach · Hilton Diagonal Mar — mains, desserts, and dietary notes."
      publicHref="/menu"
    >
      <AdminMenuPanel initialSubmissions={submissions} />
    </AdminSectionShell>
  );
}
