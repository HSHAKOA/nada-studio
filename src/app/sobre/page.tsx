import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhyNada from "@/components/sections/WhyNada";
import ForYouToo from "@/components/sections/ForYouToo";
import Portfolio from "@/components/sections/Portfolio";

export const metadata: Metadata = {
  title: "Sobre",
};

export default function Sobre() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <WhyNada />
        <ForYouToo />
        <Portfolio />
      </main>
      <Footer />
    </>
  );
}
