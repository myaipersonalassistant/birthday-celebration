import { getAdminMenuSubmissions } from "@/app/actions/admin-menu";
import { AdminMenuPanel } from "@/components/admin/AdminMenuPanel";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";

export default async function AdminMenuPage() {
  const submissions = await getAdminMenuSubmissions();

  return (
    <AdminSectionShell
      eyebrow="Dining"
      title="Menu"
      description="Kitchen board for Premium Menu choices — mains, desserts, and dietary notes from your guests."
      publicHref="/menu"
    >
      <AdminMenuPanel initialSubmissions={submissions} />
    </AdminSectionShell>
  );
}
