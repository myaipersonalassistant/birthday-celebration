import type { Metadata } from "next";
import { requireAdminUser } from "@/app/actions/admin-auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminUser();

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f3eb] lg:flex-row">
      <AdminSidebar email={user.email ?? "Admin"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
