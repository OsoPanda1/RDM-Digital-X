import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import FooterSection from "@/components/FooterSection";
import RealitoOrb from "@/components/RealitoOrb";
import FloatingParticles from "@/components/FloatingParticles";
import AmbientAudio from "@/components/AmbientAudio";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="app-atmosphere pointer-events-none absolute inset-0 z-0" />
      <FloatingParticles />

      <div className="relative z-10">
        <NavBar />
        <main className="min-h-screen pt-24">{children}</main>
        <FooterSection />
        <RealitoOrb />
        <AmbientAudio />
      </div>
    </div>
  );
}
