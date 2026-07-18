import { getAdminAnalyticsData } from "@/app/actions/admin-analytics";
import { AdminAnalyticsPanel } from "@/components/admin/AdminAnalyticsPanel";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalyticsData();

  return (
    <AdminSectionShell
      eyebrow="Insights"
      title="Analytics"
      description="See how RSVPs, menu choices, guestbook notes, and gallery media are stacking up for the celebration."
    >
      <AdminAnalyticsPanel data={data} />
    </AdminSectionShell>
  );
}
