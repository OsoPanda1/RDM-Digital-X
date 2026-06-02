import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Pickaxe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { SEOMeta } from "@/components/SEOMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate("/mina");
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/mina`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("¡Bienvenido minero!");
        navigate("/mina");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/mina`,
    });
    if (error) toast.error("No se pudo iniciar con Google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 aurora-bg grid-pattern">
      <SEOMeta title="Acceso minero · RDM Digital Nexus" description="Inicia sesión para minar el subsuelo digital de Real del Monte." />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md panel-futuristic rounded-3xl p-8"
      >
        <div className="flex flex-col items-center text-center mb-7">
          <div className="h-16 w-16 rounded-2xl grid place-items-center bg-gradient-gold pulse-gold mb-4">
            <Pickaxe className="h-8 w-8 text-[hsl(220,45%,8%)]" />
          </div>
          <h1 className="font-display text-3xl text-gradient-gold">Subsuelo Digital RDM</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">
            {mode === "login" ? "Entra a tu veta y sigue minando." : "Crea tu cuenta de minero."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre de minero</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" maxLength={60} />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" maxLength={255} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" disabled={busy} className="w-full btn-premium">
            {busy ? "Procesando…" : mode === "login" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="separator-gradient flex-1" /> o <span className="separator-gradient flex-1" />
        </div>

        <Button variant="outline" onClick={google} className="w-full">Continuar con Google</Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "login" ? "¿Sin cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-[hsl(var(--gold))] hover:underline">
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
