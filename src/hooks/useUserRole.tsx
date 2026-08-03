import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type AppRole = "admin" | "moderator" | "merchant" | "visitor";

/**
 * Reads the authenticated user's roles from the server-side `user_roles` table.
 * Roles are NEVER trusted from client storage — always validated against RLS.
 */
export function useUserRole() {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (authLoading) return;
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!active) return;
        setRoles(((data ?? []).map((r) => r.role) as AppRole[]) ?? []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  return {
    roles,
    isAdmin: roles.includes("admin"),
    isModerator: roles.includes("admin") || roles.includes("moderator"),
    loading: loading || authLoading,
  };
}
