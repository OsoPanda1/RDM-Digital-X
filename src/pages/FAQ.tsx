import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { SEOMeta } from "@/components/SEOMeta";

const FAQ_GROUPS = [
  {
    group: "Turismo y experiencia",
    items: [
      { q: "¿Qué es Real del Monte?", a: "Real del Monte (Mineral del Monte) es un Pueblo Mágico de Hidalgo, México, célebre por su herencia minera, la influencia inglesa de Cornualles, los pastes, el Panteón Inglés y su clima de montaña a 2,700 m de altitud." },
      { q: "¿Cómo uso el mapa interactivo?", a: "En la página de inicio, sección Mapa, puedes ver sitios, museos, ecoturismo y comercios. Usa el botón “Centrar en mí” para activar tu geolocalización y ubicarte respecto a los puntos de interés." },
      { q: "¿Qué son las rutas turísticas?", a: "Son recorridos temáticos (patrimonio, gastronomía, miradores, nocturna, romántica, platera y más) que conectan historias, lugares y comercios locales en una sola experiencia guiada." },
    ],
  },
  {
    group: "Cuenta, perfil y comunidad",
    items: [
      { q: "¿Necesito registrarme?", a: "Puedes explorar gran parte del contenido sin cuenta. Para participar en la comunidad, gestionar tu perfil, activar membresías o usar la Mina necesitas iniciar sesión." },
      { q: "¿Cómo edito mi perfil?", a: "Entra a Mi Perfil desde el menú o el botón Cuenta. Ahí puedes actualizar tu nombre para mostrar y tu avatar, y revisar tu membresía y progreso minero." },
      { q: "¿Mis datos están protegidos?", a: "Sí. La plataforma usa autenticación segura y políticas de acceso por fila: cada usuario solo puede ver y editar su propia información." },
    ],
  },
  {
    group: "Membresías y gamificación",
    items: [
      { q: "¿Qué incluye la membresía Minero RDM?", a: "Por $129 MXN al mes obtienes acceso completo a la Mina, donde acumulas minerales y puntos que puedes canjear por productos reales: pastes, refrescos, joyería de plata, hospedaje, cenas y paseos." },
      { q: "¿Cómo funciona la Mina?", a: "Cada extracción consume energía (que se regenera con el tiempo) y otorga minerales con distinta probabilidad. Los minerales se convierten en puntos canjeables en el catálogo de recompensas." },
      { q: "¿Cómo canjeo mis puntos?", a: "Desde la sección de recompensas de la Mina selecciona el producto disponible; si tienes puntos suficientes y hay stock, se genera tu canje." },
    ],
  },
  {
    group: "Comercios y pagos",
    items: [
      { q: "Tengo un negocio, ¿cómo aparezco en el catálogo?", a: "Usa Registrar Comercio para dar de alta tu negocio, elegir categoría y completar el pago de activación. Una vez confirmado, tu ficha se publica en el catálogo." },
      { q: "¿Cómo se manejan los pagos?", a: "Los pagos se procesan de forma segura mediante nuestra pasarela en línea. Al confirmarse el pago, la publicación de tu comercio se activa automáticamente." },
      { q: "¿Qué son las donaciones?", a: "Las donaciones apoyan la digitalización del pueblo y la visibilidad de los negocios locales. Puedes contribuir desde la sección Apoya RDM." },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-surface-strong overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-body text-sm text-white/95 md:text-base">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-cyan-200 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <MainLayout>
      <SEOMeta title="Preguntas Frecuentes · RDM Digital" description="Resuelve tus dudas sobre turismo, cuentas, membresías, gamificación, comercios y pagos en Real del Monte." />
      <section className="pb-20 pt-8">
        <div className="container mx-auto max-w-3xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <span className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
              <HelpCircle className="h-3.5 w-3.5" /> Plano II · Ayuda
            </span>
            <h1 className="mb-3 text-4xl font-bold uppercase leading-[0.9] tracking-tighter md:text-5xl">
              Preguntas <span className="text-gradient-cyan">Frecuentes</span>
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Todo lo que necesitas saber para vivir Real del Monte de principio a fin.
            </p>
          </motion.div>

          <div className="space-y-8">
            {FAQ_GROUPS.map((g, gi) => (
              <motion.div
                key={g.group}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.05 }}
              >
                <h2 className="mb-3 font-body text-xs uppercase tracking-[0.24em] text-cyan-100/60">{g.group}</h2>
                <div className="space-y-3">
                  {g.items.map((it) => (
                    <FaqItem key={it.q} q={it.q} a={it.a} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
