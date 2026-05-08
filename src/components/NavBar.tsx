import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";

const navItems = [
  { label: "Historia", path: "/historia" },
  { label: "Gastronomía", path: "/gastronomia" },
  { label: "Cultura", path: "/cultura" },
  { label: "Rutas", path: "/rutas" },
  { label: "Comercios", path: "/catalogo" },
  { label: "Eventos", path: "/eventos" },
  { label: "TAMV", path: "/tamv" },
  { label: "Fusión", path: "/fusion" },
  { label: "Tenochtitlán", path: "/tenochtitlan" },
];

const chapters = [
  { id: "inicio", label: "Inicio", preview: "Portal", path: "/" },
  { id: "historia", label: "Historia Minera", preview: "Capítulo I", path: "/historia" },
  { id: "gastronomia", label: "Gastronomía", preview: "Sabores", path: "/gastronomia" },
  { id: "cultura", label: "Cultura y Leyendas", preview: "Identidad", path: "/cultura" },
  { id: "arte", label: "Arte", preview: "Creación", path: "/arte" },
  { id: "rutas", label: "Rutas Turísticas", preview: "Experiencias", path: "/rutas" },
  { id: "ecoturismo", label: "Ecoturismo", preview: "Naturaleza", path: "/ecoturismo" },
  { id: "relatos", label: "Mitos y Leyendas", preview: "Relatos", path: "/relatos" },
  { id: "dichos", label: "Dichos Mineros", preview: "Tradición", path: "/dichos" },
  { id: "comercios", label: "Catálogo Digital", preview: "Comercios", path: "/catalogo" },
  { id: "eventos", label: "Eventos", preview: "Agenda", path: "/eventos" },
  { id: "comunidad", label: "Muro Global", preview: "Comunidad", path: "/comunidad" },
  { id: "nosotros", label: "Quiénes Somos", preview: "Equipo", path: "/quienes-somos" },
  { id: "tamv", label: "TAMV Civilization Hub", preview: "Nodo Cero", path: "/tamv" },
  { id: "fusion", label: "Fusión RDM·X", preview: "4 repos", path: "/fusion" },
  { id: "tenochtitlan", label: "System Tenochtitlán", preview: "Kernel", path: "/tenochtitlan" },
  { id: "apoya", label: "Apoya RDM", preview: "Donaciones", path: "/donar" },
];

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 px-3 sm:px-6 pt-4"
      >
        <div
          className={`mx-auto max-w-[1320px] rounded-2xl border px-4 md:px-6 py-3 transition-all duration-500 ${
            scrolled
              ? "border-cyan-300/15 bg-[linear-gradient(135deg,hsla(220,26%,10%,0.85),hsla(220,18%,7%,0.92))] shadow-[0_10px_40px_-20px_hsla(195,100%,60%,0.45)] backdrop-blur-2xl"
              : "border-white/10 bg-black/30 backdrop-blur-xl"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-xl border border-cyan-200/20 bg-slate-950/90">
                <div className="absolute inset-[3px] rounded-lg bg-[radial-gradient(circle_at_30%_20%,hsl(193,100%,70%),hsl(220,72%,35%))]" />
                <Sparkles className="absolute inset-0 m-auto h-4 w-4 text-white/90" />
              </div>
              <div>
                <span className="block font-display text-lg leading-none text-white/95">RDM Digital Nexus</span>
                <span className="block font-body text-[10px] tracking-[0.28em] uppercase text-cyan-100/55">Real del Monte</span>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-2">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`rounded-full px-3.5 py-2 text-[11px] tracking-[0.16em] uppercase transition-all duration-300 ${
                      active
                        ? "bg-cyan-400/15 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(125,211,252,0.35)]"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/donar"
                className="ml-1 flex items-center gap-1.5 rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-[11px] tracking-[0.16em] uppercase text-amber-200 transition-all hover:bg-amber-300/20"
              >
                <Heart className="h-3.5 w-3.5" />
                Apoya
              </Link>
            </nav>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="xl:hidden rounded-xl border border-cyan-100/20 bg-black/30 px-3 py-2 text-[11px] tracking-[0.18em] uppercase text-cyan-100/80"
            >
              {menuOpen ? "Cerrar" : "Menú"}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[radial-gradient(circle_at_top,hsla(202,100%,45%,0.18),transparent_40%),linear-gradient(160deg,hsla(229,38%,8%,0.97),hsla(228,36%,4%,0.98))]"
          >
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <nav className="relative z-10 mx-auto mt-28 max-h-[72vh] w-[min(94vw,760px)] space-y-2 overflow-y-auto rounded-2xl border border-cyan-100/15 bg-slate-950/60 p-4 backdrop-blur-xl">
              {chapters.map((ch, index) => (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    to={ch.path}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                      location.pathname === ch.path
                        ? "border border-cyan-200/35 bg-cyan-400/10"
                        : "border border-white/5 hover:border-cyan-200/20 hover:bg-white/5"
                    }`}
                  >
                    <span className="font-display text-xl text-white/95">{ch.label}</span>
                    <span className="font-body text-[10px] tracking-[0.24em] uppercase text-cyan-100/55">{ch.preview}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
