import { getAdminVisitors } from "@/app/actions/admin-visitors";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";
import { AdminVisitorsPanel } from "@/components/admin/AdminVisitorsPanel";

export default async function AdminVisitorsPage() {
  const visitors = await getAdminVisitors();

  return (
    <AdminSectionShell
      eyebrow="People"
      title="Visitors"
      description="Everyone who RSVP’d, chose the Purobeach · Hilton dinner menu, or signed the guestbook — merged by email when possible."
    >
      <AdminVisitorsPanel initialVisitors={visitors} />
    </AdminSectionShell>
  );
}
