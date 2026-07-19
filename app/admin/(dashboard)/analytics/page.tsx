import { getAdminAnalyticsData } from "@/app/actions/admin-analytics";
import { AdminAnalyticsPanel } from "@/components/admin/AdminAnalyticsPanel";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";

export default async function AdminAnalyticsPage() {
  const data = await getAdminAnalyticsData();

  return (
    <AdminSectionShell
      eyebrow="Insights"
      title="Analytics"
      description="RSVPs for Purobeach · Hilton dinner & the catamaran, menu counts, guestbook notes, and studio media for the celebration."
    >
      <AdminAnalyticsPanel data={data} />
    </AdminSectionShell>
  );
}
