import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Volume2, Eye, LogOut, Shield, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import { SEOMeta } from "@/components/SEOMeta";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Ajustes() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sound, setSound] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [loading, user, navigate]);

  useEffect(() => {
    setSound(localStorage.getItem("rdm_sound") === "1");
    setReduceMotion(localStorage.getItem("rdm_reduce_motion") === "1");
  }, []);

  const toggleSound = (v: boolean) => {
    setSound(v);
    localStorage.setItem("rdm_sound", v ? "1" : "0");
    window.dispatchEvent(new CustomEvent("rdm:sound", { detail: v }));
    toast.success(v ? "Sonido ambiental activado" : "Sonido ambiental silenciado");
  };

  const toggleMotion = (v: boolean) => {
    setReduceMotion(v);
    localStorage.setItem("rdm_reduce_motion", v ? "1" : "0");
    document.documentElement.classList.toggle("reduce-motion", v);
    toast.success(v ? "Animaciones reducidas" : "Animaciones completas");
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  if (loading || !user) return null;

  return (
    <MainLayout>
      <SEOMeta title="Ajustes · RDM Digital" description="Configura tus preferencias de cuenta, sonido y accesibilidad en RDM Digital." />
      <section className="pb-20 pt-8">
        <div className="container mx-auto max-w-2xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-primary">Plano II · Cuenta</span>
            <h1 className="mb-2 text-4xl font-bold uppercase leading-[0.9] tracking-tighter md:text-5xl">
              <span className="text-gradient-cyan">Ajustes</span>
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
          </motion.div>

          <div className="space-y-4">
            <div className="glass-surface-strong flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-cyan-200" />
                <div>
                  <p className="font-body text-sm text-white/95">Sonido ambiental</p>
                  <p className="text-xs text-muted-foreground">Atmósfera sonora del destino</p>
                </div>
              </div>
              <Switch checked={sound} onCheckedChange={toggleSound} />
            </div>

            <div className="glass-surface-strong flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-cyan-200" />
                <div>
                  <p className="font-body text-sm text-white/95">Reducir animaciones</p>
                  <p className="text-xs text-muted-foreground">Mayor accesibilidad y rendimiento</p>
                </div>
              </div>
              <Switch checked={reduceMotion} onCheckedChange={toggleMotion} />
            </div>

            <div className="glass-surface-strong space-y-3 p-5">
              <div className="flex items-center gap-2 text-cyan-200">
                <Shield className="h-4 w-4" />
                <span className="font-body text-xs uppercase tracking-widest">Cuenta</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <Mail className="h-4 w-4 text-muted-foreground" /> {user.email}
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button variant="outline" onClick={() => navigate("/perfil")}>Editar perfil</Button>
                <Button variant="outline" className="gap-2" onClick={signOut}>
                  <LogOut className="h-4 w-4" /> Cerrar sesión
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
