import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/HeroSection";
import NodoCeroBanner from "@/components/NodoCeroBanner";
import SitesSection from "@/components/SitesSection";
import QuickLinksSection from "@/components/QuickLinksSection";
import MapSection from "@/components/MapSection";
import MerchantCatalog from "@/components/MerchantCatalog";
import { SEOMeta, PAGE_SEO } from "@/components/SEOMeta";

const Index = () => {
  return (
    <MainLayout>
      <SEOMeta {...PAGE_SEO.home} />
      <HeroSection />
      <NodoCeroBanner />
      <SitesSection />
      <QuickLinksSection />
      <section id="mapa" aria-label="Mapa interactivo de Real del Monte">
        <MapSection />
      </section>
      <section id="catalogo" aria-label="Catálogo de comercios locales">
        <MerchantCatalog />
      </section>
    </MainLayout>
  );
};

export default Index;
