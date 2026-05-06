import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import FooterSection from "@/components/FooterSection";
import RealitoOrb from "@/components/RealitoOrb";
import { Button } from "@/components/ui/button";

interface Merchant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string | null;
  website: string | null;
  main_image: string | null;
  category_id: string;
  latitude: number;
  longitude: number;
}

interface Category { id: string; name: string; }

const PAGE_SIZE = 12;

export default function Catalogo() {
  const [filter, setFilter] = useState<string>("Todos");
  const [page, setPage] = useState(1);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("merchant_categories").select("id,name").eq("active", true).order("name")
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let q = supabase.from("merchant_registrations")
      .select("id,name,description,address,phone,website,main_image,category_id,latitude,longitude", { count: "exact" })
      .eq("status", "published").order("published_at", { ascending: false }).range(from, to);
    if (filter !== "Todos") q = q.eq("category_id", filter);
    q.then(({ data, count }) => {
      if (cancel) return;
      setMerchants((data ?? []) as Merchant[]);
      setTotal(count ?? 0);
      setLoading(false);
    });
    return () => { cancel = true; };
  }, [filter, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-6 flex justify-between items-end gap-4 flex-wrap">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-mono text-xs uppercase tracking-widest text-secondary mb-3 block">Directorio Verificado</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.9] mb-4">
              Catálogo <span className="text-gradient-gold">Digital</span>
            </h1>
            <p className="max-w-xl text-muted-foreground text-lg">
              Comercios, restaurantes, hoteles y servicios verificados de Real del Monte.
            </p>
          </motion.div>
          <Link to="/comercios/registro"><Button>Registra tu negocio</Button></Link>
        </div>
      </section>

      <section className="py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setFilter("Todos"); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all ${
                filter === "Todos" ? "bg-primary text-primary-foreground" : "bg-card/40 text-muted-foreground hover:text-foreground"}`}>
              Todos
            </button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => { setFilter(c.id); setPage(1); }}
                className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all ${
                  filter === c.id ? "bg-primary text-primary-foreground" : "bg-card/40 text-muted-foreground hover:text-foreground"}`}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 pb-12">
        <div className="container mx-auto px-6">
          {loading ? (
            <p className="text-muted-foreground text-center py-16">Cargando…</p>
          ) : merchants.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">Aún no hay comercios publicados en esta categoría.</p>
              <Link to="/comercios/registro"><Button>Sé el primero en registrarte</Button></Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchants.map((biz, i) => (
                <motion.div key={biz.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="glass-surface p-6 hover:glow-cyan transition-all duration-500">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary block mb-1">{catName(biz.category_id)}</span>
                  <h3 className="text-xl font-semibold tracking-tight mb-2">{biz.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{biz.description}</p>
                  <div className="space-y-1 font-mono text-[10px] text-muted-foreground">
                    <p>📍 {biz.address}</p>
                    {biz.phone && <p>📞 {biz.phone}</p>}
                    {biz.website && <p>🌐 <a href={biz.website} target="_blank" rel="noreferrer" className="underline">{biz.website}</a></p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
              <span className="font-mono text-xs">Página {page} de {totalPages} · {total} comercios</span>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
            </div>
          )}
        </div>
      </section>
      <FooterSection />
      <RealitoOrb />
    </div>
  );
}
