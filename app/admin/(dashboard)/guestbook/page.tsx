import { getAdminGuestbookMessages } from "@/app/actions/admin-guestbook";
import { AdminGuestbookPanel } from "@/components/admin/AdminGuestbookPanel";
import { AdminSectionShell } from "@/components/admin/AdminSectionShell";

export default async function AdminGuestbookPage() {
  const messages = await getAdminGuestbookMessages();

  return (
    <AdminSectionShell
      eyebrow="Messages"
      title="Guestbook"
      description="Review notes left for Angela and remove anything that shouldn’t stay on the public wall."
      publicHref="/guestbook"
    >
      <AdminGuestbookPanel initialMessages={messages} />
    </AdminSectionShell>
  );
}
