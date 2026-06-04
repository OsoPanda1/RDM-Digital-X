import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Store, Crown, Gift, Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import MainLayout from "@/components/layout/MainLayout";
import { SEOMeta } from "@/components/SEOMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type MerchantRow = {
  id: string;
  name: string;
  category_id: string;
  status: string;
  description: string;
  address: string;
  created_at: string;
};
type MembershipRow = { id: string; user_id: string; status: string; price_mxn: number; current_period_end: string | null };
type RewardRow = { id: string; name: string; category: string; cost_points: number; stock: number; active: boolean };

const PAGE_SIZE = 10;

const statusColor: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  awaiting_payment: "bg-amber-400/15 text-amber-200",
  paid: "bg-cyan-400/15 text-cyan-200",
  published: "bg-emerald-400/15 text-emerald-200",
  rejected: "bg-red-400/15 text-red-200",
};

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  const [merchants, setMerchants] = useState<MerchantRow[]>([]);
  const [memberships, setMemberships] = useState<MembershipRow[]>([]);
  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  const loadAll = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    const [{ data: m }, { data: mem }, { data: rw }] = await Promise.all([
      supabase.from("merchant_registrations").select("id,name,category_id,status,description,address,created_at").order("created_at", { ascending: false }).limit(200),
      supabase.from("game_memberships").select("id,user_id,status,price_mxn,current_period_end").order("updated_at", { ascending: false }).limit(200),
      supabase.from("rewards_catalog").select("id,name,category,cost_points,stock,active").order("category").limit(200),
    ]);
    setMerchants((m as MerchantRow[]) ?? []);
    setMemberships((mem as MembershipRow[]) ?? []);
    setRewards((rw as RewardRow[]) ?? []);
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    if (!roleLoading) loadAll();
  }, [roleLoading, loadAll]);

  const setMerchantStatus = async (id: string, status: string) => {
    setBusyId(id);
    const patch: { status: string; published_at?: string } = { status };
    if (status === "published") patch.published_at = new Date().toISOString();
    const { error } = await supabase
      .from("merchant_registrations")
      .update(patch as never)
      .eq("id", id);
    setBusyId(null);
    if (error) return toast.error("No se pudo actualizar el negocio: " + error.message);
    toast.success(status === "published" ? "Negocio publicado" : "Negocio actualizado");
    setMerchants((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const updateReward = async (id: string, patch: Partial<RewardRow>) => {
    setBusyId(id);
    const { error } = await supabase.from("rewards_catalog").update(patch as never).eq("id", id);
    setBusyId(null);
    if (error) return toast.error("No se pudo actualizar la recompensa: " + error.message);
    setRewards((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    toast.success("Recompensa actualizada");
  };

  const filteredMerchants = useMemo(
    () => merchants.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.category_id.toLowerCase().includes(search.toLowerCase())),
    [merchants, search],
  );

  if (authLoading || roleLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <SEOMeta title="Panel de Administración · RDM Digital" description="Acceso restringido." />
        <div className="container mx-auto max-w-lg px-6 py-24 text-center">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-amber-300/70" />
          <h1 className="mb-2 text-2xl font-bold">Acceso restringido</h1>
          <p className="text-muted-foreground">Esta sección es exclusiva para administradores del ecosistema RDM Digital.</p>
        </div>
      </MainLayout>
    );
  }

  const pendingCount = merchants.filter((m) => m.status !== "published" && m.status !== "rejected").length;

  return (
    <MainLayout>
      <SEOMeta title="Panel de Administración · RDM Digital" description="Aprueba negocios, revisa membresías y gestiona el catálogo de recompensas." />
      <section className="pb-20 pt-8">
        <div className="container mx-auto max-w-5xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <span className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-300">
              <ShieldCheck className="h-3.5 w-3.5" /> Plano II · Gobernanza
            </span>
            <h1 className="mb-2 text-4xl font-bold uppercase leading-[0.9] tracking-tighter md:text-5xl">
              Panel de <span className="text-gradient-gold">Administración</span>
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Aprueba comercios, revisa precios de membresías y gestiona la disponibilidad del catálogo con auditoría server-side.
            </p>
          </motion.div>

          <Tabs defaultValue="merchants">
            <TabsList className="mb-6">
              <TabsTrigger value="merchants" className="gap-2">
                <Store className="h-3.5 w-3.5" /> Negocios {pendingCount > 0 && <Badge className="ml-1 bg-amber-400/20 text-amber-200">{pendingCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="memberships" className="gap-2"><Crown className="h-3.5 w-3.5" /> Membresías</TabsTrigger>
              <TabsTrigger value="rewards" className="gap-2"><Gift className="h-3.5 w-3.5" /> Catálogo</TabsTrigger>
            </TabsList>

            {/* MERCHANTS */}
            <TabsContent value="merchants" className="space-y-4">
              <div className="relative max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o categoría…" className="pl-9" />
              </div>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : filteredMerchants.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay comercios registrados.</p>
              ) : (
                <div className="space-y-3">
                  {filteredMerchants.map((m) => (
                    <div key={m.id} className="glass-surface flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold">{m.name}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider ${statusColor[m.status] ?? "bg-muted"}`}>{m.status}</span>
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{m.category_id} · {m.address}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button size="sm" variant="outline" disabled={busyId === m.id || m.status === "published"} onClick={() => setMerchantStatus(m.id, "published")}>
                          {busyId === m.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} Aprobar
                        </Button>
                        <Button size="sm" variant="ghost" disabled={busyId === m.id || m.status === "rejected"} onClick={() => setMerchantStatus(m.id, "rejected")}>
                          <XCircle className="h-3.5 w-3.5" /> Rechazar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* MEMBERSHIPS */}
            <TabsContent value="memberships" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Precio vigente de la membresía Minero RDM: <span className="font-semibold text-foreground">$129 MXN / mes</span>. Lista de suscripciones registradas (solo lectura).
              </p>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <div className="space-y-2">
                  {memberships.map((mem) => (
                    <div key={mem.id} className="glass-surface flex items-center justify-between p-3 text-sm">
                      <span className="font-mono text-xs text-muted-foreground">{mem.user_id.slice(0, 8)}…</span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider ${mem.status === "active" ? "bg-emerald-400/15 text-emerald-200" : "bg-muted text-muted-foreground"}`}>{mem.status}</span>
                      <span className="font-semibold">${mem.price_mxn} MXN</span>
                      <span className="text-xs text-muted-foreground">{mem.current_period_end ? new Date(mem.current_period_end).toLocaleDateString("es-MX") : "—"}</span>
                    </div>
                  ))}
                  {memberships.length === 0 && <p className="text-sm text-muted-foreground">No hay membresías registradas.</p>}
                </div>
              )}
            </TabsContent>

            {/* REWARDS CATALOG */}
            <TabsContent value="rewards" className="space-y-4">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <div className="space-y-3">
                  {rewards.map((rw) => (
                    <div key={rw.id} className="glass-surface flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold">{rw.name}</h3>
                        <p className="text-xs text-muted-foreground">{rw.category}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-1 text-xs text-muted-foreground">
                          Puntos
                          <Input
                            type="number"
                            defaultValue={rw.cost_points}
                            className="h-8 w-20"
                            onBlur={(e) => {
                              const v = parseInt(e.target.value, 10);
                              if (!Number.isNaN(v) && v !== rw.cost_points) updateReward(rw.id, { cost_points: v });
                            }}
                          />
                        </label>
                        <label className="flex items-center gap-1 text-xs text-muted-foreground">
                          Stock
                          <Input
                            type="number"
                            defaultValue={rw.stock}
                            className="h-8 w-20"
                            onBlur={(e) => {
                              const v = parseInt(e.target.value, 10);
                              if (!Number.isNaN(v) && v !== rw.stock) updateReward(rw.id, { stock: v });
                            }}
                          />
                        </label>
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          Activo
                          <Switch checked={rw.active} disabled={busyId === rw.id} onCheckedChange={(c) => updateReward(rw.id, { active: c })} />
                        </label>
                      </div>
                    </div>
                  ))}
                  {rewards.length === 0 && <p className="text-sm text-muted-foreground">No hay recompensas en el catálogo.</p>}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
}
