import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { VenuePageContent } from "@/components/VenuePageContent";

export const metadata: Metadata = {
  title: "Venue & Hotels | Angela Ifonlaja",
  description:
    "Purobeach Barcelona at Hilton Diagonal Mar — directions and nearby hotels for Angela's birthday celebration.",
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
