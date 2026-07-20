import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { VenuePageContent } from "@/components/VenuePageContent";

export const metadata: Metadata = {
  title: "Venue & Hotels | Angela Ifonlaja",
  description:
    "Port Olímpic marina for the catamaran, Purobeach at Hilton Diagonal Mar for dinner, nearby hotels, and an optional MSC Grandiosa continuation at sea.",
};

export default function VenuePage() {
  return (
    <main className="min-h-screen bg-[#f7f3eb]">
      <Header />
      <VenuePageContent />
      <Footer />
    </main>
  );
}
