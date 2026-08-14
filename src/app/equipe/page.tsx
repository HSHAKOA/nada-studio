import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Founders from "@/components/sections/Founders";

export const metadata: Metadata = {
  title: "Equipe",
};

export default function Equipe() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Founders />
      </main>
      <Footer />
    </>
  );
}
