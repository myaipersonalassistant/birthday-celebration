import { getAdminRsvpSubmissions } from "@/app/actions/admin-rsvp";
import { AdminRsvpPanel } from "@/components/admin/AdminRsvpPanel";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";

export default async function AdminRsvpPage() {
  const submissions = await getAdminRsvpSubmissions();

  return (
    <AdminSectionShell
      eyebrow="Guests"
      title="RSVPs"
      description="See who’s coming — dinner, cruise, plus-ones, and messages from the invitation."
      publicHref="/rsvp"
    >
      <AdminRsvpPanel initialSubmissions={submissions} />
    </AdminSectionShell>
  );
}
