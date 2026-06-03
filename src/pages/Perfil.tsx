import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Gem, Crown, Save, LogOut, Pickaxe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import { SEOMeta } from "@/components/SEOMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ProfileRow { display_name: string | null; avatar_url: string | null; }
interface BalanceRow { puntos: number; total_mined: number; oro: number; plata: number; }

export default function Perfil() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileRow>({ display_name: "", avatar_url: "" });
  const [balance, setBalance] = useState<BalanceRow | null>(null);
  const [membership, setMembership] = useState<{ status: string; current_period_end: string | null } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [loading, user, navigate]);

  const loadAll = useCallback(async () => {
    if (!user) return;
    const [{ data: prof }, { data: bal }, { data: mem }] = await Promise.all([
      supabase.from("profiles").select("display_name,avatar_url").eq("user_id", user.id).maybeSingle(),
      supabase.from("mineral_balances").select("puntos,total_mined,oro,plata").eq("user_id", user.id).maybeSingle(),
      supabase.from("game_memberships").select("status,current_period_end").eq("user_id", user.id).maybeSingle(),
    ]);
    if (prof) setProfile({ display_name: prof.display_name ?? "", avatar_url: prof.avatar_url ?? "" });
    if (bal) setBalance(bal as BalanceRow);
    if (mem) setMembership(mem as { status: string; current_period_end: string | null });
  }, [user]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: profile.display_name?.trim() || null, avatar_url: profile.avatar_url?.trim() || null })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) return toast.error("No se pudo guardar el perfil");
    toast.success("Perfil actualizado");
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  const membershipActive = !!(membership?.status === "active" && membership.current_period_end && new Date(membership.current_period_end) > new Date());

  if (loading || !user) return null;

  return (
    <MainLayout>
      <SEOMeta title="Mi Perfil · RDM Digital" description="Gestiona tu perfil, membresía y progreso minero en Real del Monte." />
      <section className="pb-20 pt-8">
        <div className="container mx-auto max-w-4xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-primary">Plano I · Usuario</span>
            <h1 className="mb-2 text-4xl font-bold uppercase leading-[0.9] tracking-tighter md:text-5xl">
              Mi <span className="text-gradient-cyan">Perfil</span>
            </h1>
            <p className="max-w-xl text-muted-foreground">{user.email}</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="glass-surface-strong space-y-5 p-6 md:col-span-3"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-cyan-400/10 ring-1 ring-cyan-200/30">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-7 w-7 text-cyan-100/70" />
                  )}
                </div>
                <div>
                  <p className="font-display text-lg text-white/95">{profile.display_name || "Viajero RDM"}</p>
                  <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
                    {membershipActive ? "Miembro Minero" : "Cuenta Básica"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-body text-xs uppercase tracking-widest text-muted-foreground">Nombre para mostrar</label>
                <Input
                  value={profile.display_name ?? ""}
                  maxLength={60}
                  onChange={(e) => setProfile((p) => ({ ...p, display_name: e.target.value }))}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <label className="font-body text-xs uppercase tracking-widest text-muted-foreground">URL de avatar</label>
                <Input
                  value={profile.avatar_url ?? ""}
                  maxLength={500}
                  onChange={(e) => setProfile((p) => ({ ...p, avatar_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={save} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" /> {saving ? "Guardando..." : "Guardar"}
                </Button>
                <Button onClick={signOut} variant="outline" className="gap-2">
                  <LogOut className="h-4 w-4" /> Cerrar sesión
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="space-y-4 md:col-span-2"
            >
              <div className="glass-surface-strong space-y-3 p-6">
                <div className="flex items-center gap-2 text-amber-200">
                  <Crown className="h-4 w-4" />
                  <span className="font-body text-xs uppercase tracking-widest">Membresía</span>
                </div>
                <p className="font-display text-2xl text-white/95">{membershipActive ? "Activa" : "Inactiva"}</p>
                {membershipActive && membership?.current_period_end && (
                  <p className="text-xs text-muted-foreground">
                    Vigente hasta {new Date(membership.current_period_end).toLocaleDateString("es-MX")}
                  </p>
                )}
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/membresias")}>
                  Ver planes
                </Button>
              </div>

              <div className="glass-surface-strong space-y-3 p-6">
                <div className="flex items-center gap-2 text-cyan-200">
                  <Gem className="h-4 w-4" />
                  <span className="font-body text-xs uppercase tracking-widest">Progreso Minero</span>
                </div>
                <p className="font-display text-3xl text-gradient-cyan">{balance?.puntos ?? 0}</p>
                <p className="text-xs text-muted-foreground">puntos · {balance?.total_mined ?? 0} extracciones</p>
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => navigate("/mina")}>
                  <Pickaxe className="h-4 w-4" /> Ir a la Mina
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
