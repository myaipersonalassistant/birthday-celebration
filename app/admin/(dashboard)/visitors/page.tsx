import { getAdminVisitors } from "@/app/actions/admin-visitors";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";
import { AdminVisitorsPanel } from "@/components/admin/AdminVisitorsPanel";

export default async function AdminVisitorsPage() {
  const visitors = await getAdminVisitors();

  return (
    <AdminSectionShell eyebrow="People" title="Visitors">
      <AdminVisitorsPanel initialVisitors={visitors} />
    </AdminSectionShell>
  );
}
