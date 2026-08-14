import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Problem from "@/components/sections/Problem";
import HowItWorks from "@/components/sections/HowItWorks";
import Membership from "@/components/sections/Membership";
import Ecosystem from "@/components/sections/Ecosystem";
import CostOfInaction from "@/components/sections/CostOfInaction";

export const metadata: Metadata = {
  title: "Como funciona",
};

export default function ComoFunciona() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Problem />
        <HowItWorks />
        <Membership />
        <Ecosystem />
        <CostOfInaction />
      </main>
      <Footer />
    </>
  );
}
