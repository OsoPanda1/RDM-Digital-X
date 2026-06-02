import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import FooterSection from "@/components/FooterSection";
import RealitoOrb from "@/components/RealitoOrb";
import FloatingParticles from "@/components/FloatingParticles";
import AmbientAudio from "@/components/AmbientAudio";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,hsla(197,100%,45%,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,hsla(43,100%,60%,0.08),transparent_28%),linear-gradient(180deg,hsla(226,35%,8%,0.95),hsla(220,35%,5%,1))]" />
      <FloatingParticles />

      <div className="relative z-10">
        <NavBar />
        <main className="min-h-screen pt-24">{children}</main>
        <FooterSection />
        <RealitoOrb />
      </div>
    </div>
  );
}
