import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/sections/FAQ";
import Trust from "@/components/sections/Trust";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <FAQ />
        <Trust />
      </main>
      <Footer />
    </>
  );
}
