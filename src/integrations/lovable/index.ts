import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { supabase } from "../supabase/client";
const lovableAuth = createLovableAuth();

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

async function fallbackSupabaseOAuth(provider: "google" | "apple" | "microsoft" | "lovable", opts?: SignInOptions) {
  const supabaseProvider = provider === "lovable" ? "google" : provider === "microsoft" ? "azure" : provider;

  return supabase.auth.signInWithOAuth({
    provider: supabaseProvider,
    options: {
      redirectTo: opts?.redirect_uri,
      queryParams: opts?.extraParams,
    },
  });
}

export const lovable = {
  auth: {
    signInWithOAuth: async (provider: "google" | "apple" | "microsoft" | "lovable", opts?: SignInOptions) => {
      try {
        const result = await lovableAuth.signInWithOAuth(provider, {
          redirect_uri: opts?.redirect_uri,
          extraParams: {
            ...opts?.extraParams,
          },
        });

        if (result.redirected || result.error) {
          if (result.error) return fallbackSupabaseOAuth(provider, opts);
          return result;
        }

        await supabase.auth.setSession(result.tokens);
        return result;
      } catch (e) {
        const fallback = await fallbackSupabaseOAuth(provider, opts);
        if (fallback.error) return { error: e instanceof Error ? e : new Error(String(e)) };
        return fallback;
      }
    },
  },
};
