import { getAdminRsvpSubmissions } from "@/app/actions/admin-rsvp";
import { AdminRsvpPanel } from "@/components/admin/AdminRsvpPanel";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";

export default async function AdminRsvpPage() {
  const submissions = await getAdminRsvpSubmissions();

  return (
    <AdminSectionShell
      eyebrow="Guests"
      title="RSVPs"
      description="Who’s joining dinner at Purobeach · Hilton (from 6:30 PM), the Port Olímpic catamaran (marina by 1:00 PM), plus-ones, and messages."
      publicHref="/rsvp"
    >
      <AdminRsvpPanel initialSubmissions={submissions} />
    </AdminSectionShell>
  );
}
