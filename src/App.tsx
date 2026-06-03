import { useState, useCallback, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";
import CinematicIntro from "@/components/CinematicIntro";

const Index = lazy(() => import("./pages/Index"));
const Historia = lazy(() => import("./pages/Historia"));
const Cultura = lazy(() => import("./pages/Cultura"));
const Arte = lazy(() => import("./pages/Arte"));
const Gastronomia = lazy(() => import("./pages/Gastronomia"));
const Relatos = lazy(() => import("./pages/Relatos"));
const Ecoturismo = lazy(() => import("./pages/Ecoturismo"));
const Rutas = lazy(() => import("./pages/Rutas"));
const Dichos = lazy(() => import("./pages/Dichos"));
const Eventos = lazy(() => import("./pages/Eventos"));
const Comunidad = lazy(() => import("./pages/Comunidad"));
const Catalogo = lazy(() => import("./pages/Catalogo"));
const QuienesSomos = lazy(() => import("./pages/QuienesSomos"));
const Donar = lazy(() => import("./pages/Donar"));
const GraciasDonativo = lazy(() => import("./pages/GraciasDonativo"));
const ComerciosPanel = lazy(() => import("./pages/ComerciosPanel"));
const ComerciosRegistro = lazy(() => import("./pages/ComerciosRegistro"));
const ComerciosCheckout = lazy(() => import("./pages/ComerciosCheckout"));
const TAMVHub = lazy(() => import("./pages/TAMVHub"));
const FusionEcosystem = lazy(() => import("./pages/FusionEcosystem"));
const TAMVStatus = lazy(() => import("./pages/TAMVStatus"));
const TAMVApiExplorer = lazy(() => import("./pages/TAMVApiExplorer"));
const TAMVThesis = lazy(() => import("./pages/TAMVThesis"));
const Tenochtitlan = lazy(() => import("./pages/Tenochtitlan"));
const Operativo = lazy(() => import("./pages/Operativo"));
const Evolucion = lazy(() => import("./pages/Evolucion"));
const Auth = lazy(() => import("./pages/Auth"));
const Mina = lazy(() => import("./pages/Mina"));
const Perfil = lazy(() => import("./pages/Perfil"));
const Membresias = lazy(() => import("./pages/Membresias"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Ajustes = lazy(() => import("./pages/Ajustes"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 rounded-full mx-auto mb-4 pulse-gold"
        style={{ background: "radial-gradient(circle, hsl(43, 80%, 55%), hsl(43, 60%, 35%))" }} />
      <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Cargando...</span>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />} key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/cultura" element={<Cultura />} />
          <Route path="/arte" element={<Arte />} />
          <Route path="/gastronomia" element={<Gastronomia />} />
          <Route path="/relatos" element={<Relatos />} />
          <Route path="/ecoturismo" element={<Ecoturismo />} />
          <Route path="/rutas" element={<Rutas />} />
          <Route path="/dichos" element={<Dichos />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/comunidad" element={<Comunidad />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/donar" element={<Donar />} />
          <Route path="/gracias-donativo" element={<GraciasDonativo />} />
          <Route path="/comercios/panel" element={<ComerciosPanel />} />
          <Route path="/comercios/registro" element={<ComerciosRegistro />} />
          <Route path="/comercios/checkout" element={<ComerciosCheckout />} />
          <Route path="/tamv" element={<TAMVHub />} />
          <Route path="/fusion" element={<FusionEcosystem />} />
          <Route path="/tamv/status" element={<TAMVStatus />} />
          <Route path="/tamv/api" element={<TAMVApiExplorer />} />
          <Route path="/tamv/thesis" element={<TAMVThesis />} />
          <Route path="/tenochtitlan" element={<Tenochtitlan />} />
          <Route path="/operativo" element={<Operativo />} />
          <Route path="/evolucion" element={<Evolucion />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/mina" element={<Mina />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/membresias" element={<Membresias />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const AppInner = () => {
  const [introComplete, setIntroComplete] = useState(() => {
    if (sessionStorage.getItem("rdm_intro")) return true;
    sessionStorage.setItem("rdm_intro", "1");
    return false;
  });
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <>
      {!introComplete && <CinematicIntro onComplete={handleIntroComplete} />}
      {introComplete && <AnimatedRoutes />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
