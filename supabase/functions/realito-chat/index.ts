import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Eres Realito AI, guía territorial de Real del Monte, Hidalgo.
Responde siempre en español.
Da respuestas prácticas, breves y útiles para visitantes.
Cuando recomiendes lugares, prioriza historia minera, pastes, miradores, cultura y comercios locales.
Devuelve JSON válido con las llaves: reply, intent, suggestedActions.
intent debe ser uno de: ROUTES, GASTRONOMY, HISTORY, ADVENTURE, EVENTS, CULTURE, COMMUNITY, HELP.
suggestedActions debe ser un arreglo de objetos con { label, action } y opcional payload.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, contextHistory = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY missing");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...contextHistory.slice(-6).map((entry: { from: string; text: string }) => ({
            role: entry.from === "user" ? "user" : "assistant",
            content: entry.text,
          })),
          { role: "user", content: message },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      const body = await aiResponse.text();
      return new Response(JSON.stringify({ error: body || "AI gateway error" }), {
        status: aiResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await aiResponse.json();
    const raw = payload.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    return new Response(
      JSON.stringify({
        reply: parsed.reply ?? "Puedo ayudarte a planear rutas, descubrir gastronomía y explorar Real del Monte.",
        intent: parsed.intent ?? "HELP",
        suggestedActions: Array.isArray(parsed.suggestedActions) ? parsed.suggestedActions : [],
        engine: "realito-cloud-gemini",
        twinNodesQueried: 0,
        trace: {
          interactionId: crypto.randomUUID(),
          source: "lovable-cloud",
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unexpected error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});