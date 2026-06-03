// ================================================================
// RDM Digital OS v1.1 — Realito AI Controller
// Orquestador Territorial Conversacional Federado (Isabella Villaseñor AI)
// ================================================================

import type { Request, Response } from "express";
import crypto from "crypto";
import { optimizeRoute } from "./geneticOptimizer.js";
import {
  computeTwinOperationalScore,
  ensureBusinessTwin,
} from "../services/digital-twins.service.js";
import { buildTwinsContext } from "./twinContextBuilder.js";
import { db } from "../lib/store.js";
import type {
  ChatMessageDTO,
  UserPreferences,
  TwinContext,
  RealitoIntent,
  SuggestedAction,
  RealitoChatResponse,
  PlannedRoute,
} from "./types.js";

// ================================================================
// CONFIGURACIÓN DE NÚCLEO Y CONSTANTES
// ================================================================

const KERNEL_VERSION = "EOCT-RDM-X-3.6";
const VISUAL_STYLE = "CRYSTAL_GLOW";

const INTENT_MAP: Record<RealitoIntent, RegExp> = {
  ROUTES: /ruta|tour|recorrido|itinerario|micheladas|caminar|visitar|paseo/i,
  GASTRONOMY:
    /comer|restaurante|bares|paste|comida|barbacoa|gastronomía|hambre|café|bebida/i,
  HISTORY:
    /historia|mina|museo|patrimonio|antiguo|minería|1766|siglo/i,
  ADVENTURE:
    /aventura|sendero|naturaleza|ecoturismo|bosque|rappel|cuatrimoto/i,
  EVENTS: /evento|festival|fiesta|feria|celebraci/i,
  CULTURE:
    /cultura|arte|artesanía|platería|recorridos|leyenda|tradicion/i,
  COMMUNITY:
    /comunidad|foto|experiencia|compartir|reseña/i,
  HELP: /ayuda|instrucciones|como funcionas|que haces|quien eres/i,
};

// ================================================================
// DETECCIÓN DE INTENCIÓN
// ================================================================

function detectIntent(message: string): RealitoIntent {
  const normalized = message.trim().toLowerCase();
  for (const [intent, regex] of Object.entries(INTENT_MAP)) {
    if (regex.test(normalized)) return intent as RealitoIntent;
  }
  return "HELP";
}

// ================================================================
// HANDLERS DE INTENCIÓN
// ================================================================

async function handleRoutesIntent(
  message: string,
  twinsContext: TwinContext[],
  prefs: UserPreferences,
): Promise<{
  reply: string;
  suggestedActions: SuggestedAction[];
  gaSuggestion: PlannedRoute | null;
}> {
  const route = await optimizeRoute(prefs, twinsContext);

  if (!route || route.stops.length === 0) {
    return {
      reply:
        "En este momento la telemetría de algunos nodos está inestable y no puedo garantizar una ruta confiable en tiempo casi real.\n\n" +
        "Puedes decirme un punto de interés específico (por ejemplo: Mina de Acosta, Panteón Inglés, plaza) o intentar de nuevo en unos minutos.",
      suggestedActions: [
        {
          label: "🔁 Reintentar más tarde",
          action: "RETRY_ROUTE",
        },
      ],
      gaSuggestion: null,
    };
  }

  const stopNames = route.stops.map((s) => s.name).join(" → ");
  const confidence = Math.round(route.confidenceScore * 100);
  const diversity = Math.round(route.objectives.diversityScore * 100);

  const reply =
    `He analizado ${twinsContext.length} sensores digitales del territorio y generé una ruta optimizada ` +
    `con una confianza del ${confidence}%. Tomé en cuenta afluencia, diversidad temática y balance comercio/cultura.\n\n` +
    `Ruta sugerida: ${stopNames}\n` +
    `Duración aproximada: ${route.objectives.totalDurationMinutes} min · ` +
    `Distancia estimada: ${route.objectives.distanceKm} km\n\n` +
    `Ajustes aplicados por saturación: ${route.objectives.crowdPenalty} · ` +
    `Índice de diversidad temática: ${diversity}%.\n\n` +
    `¿Quieres ajustar esta ruta eliminando algún punto, hacerla más corta o pedir una versión más gastronómica?`;

  return {
    reply,
    suggestedActions: [
      {
        label: "🗺️ Desplegar en mapa",
        action: "OPEN_ROUTE",
        payload: { routeId: route.id },
      },
      {
        label: "⏱️ Minimizar tiempo",
        action: "REQUEST_SHORTER_ROUTE",
      },
      {
        label: "🍽️ Priorizar gastronomía",
        action: "ADJUST_INTERESTS",
        payload: { add: "GASTRONOMIA" },
      },
    ],
    gaSuggestion: route,
  };
}

async function handleGastronomyIntent(
  twinsContext: TwinContext[],
): Promise<{ reply: string; suggestedActions: SuggestedAction[] }> {
  const foodTwins = twinsContext
    .filter(
      (t) =>
        t.modelType === "MERCHANT_TWIN" &&
        ((t.properties.type as string) ?? "").toUpperCase() === "FOOD",
    )
    .map((t) => ({
      ...t,
      opScore: computeTwinOperationalScore(ensureBusinessTwin(t as any)),
    }))
    .sort((a, b) => b.opScore - a.opScore);

  if (foodTwins.length === 0) {
    const reply =
      "El paste es uno de los pilares gastronómicos de Real del Monte heredado por la comunidad inglesa, " +
      "y las enchiladas mineras son el platillo regional por excelencia.\n\n" +
      "Te sugiero iniciar en la plaza principal y caminar hacia las pasterías típicas. " +
      "Dime si buscas barbacoa, mariscos, pastes tradicionales o algo ligero con café y pan dulce.";

    return {
      reply,
      suggestedActions: [
        {
          label: "🥟 Ruta gastronómica",
          action: "REQUEST_FOOD_ROUTE",
        },
      ],
    };
  }

  const names = foodTwins
    .slice(0, 3)
    .map((t) => {
      const crowd = t.telemetry.crowdLevel ?? 0;
      const status =
        crowd > 0.7
          ? "🔴 Saturado"
          : crowd > 0.4
          ? "🟡 Moderado"
          : "🟢 Fluido";
      return `${t.name} (${status})`;
    })
    .join(", ");

  const reply =
    `Según la telemetría actual y la experiencia de otros visitantes, te sugiero: ${names}.\n\n` +
    `Real del Monte es reconocido como cuna del paste en México, herencia córnica del siglo XIX que sigue viva en sus comercios.\n\n` +
    `¿Quieres que trace una ruta que conecte estos puntos optimizando caminata y tiempos de espera?`;

  return {
    reply,
    suggestedActions: [
      {
        label: "🥟 Ruta de los pastes",
        action: "REQUEST_FOOD_ROUTE",
      },
      {
        label: "🗺️ Ver mapa gastronómico",
        action: "OPEN_CATEGORY",
        payload: { category: "FOOD" },
      },
      {
        label: "📋 Ver catálogo de comercios",
        action: "OPEN_CATALOG",
      },
    ],
  };
}

function handleHistoryIntent(
  twinsContext: TwinContext[],
): { reply: string; suggestedActions: SuggestedAction[] } {
  const historyTwins = twinsContext.filter((t) => {
    const type = ((t.properties.type as string) ?? "").toUpperCase();
    return ["HISTORIC", "MUSEUM", "MINE"].includes(type);
  });

  const placesInfo =
    historyTwins
      .slice(0, 3)
      .map((t) => `• ${t.name}`)
      .join("\n") ||
    "• Mina de Acosta\n• Panteón Inglés\n• Museo de Medicina Laboral\n• Museo del Paste";

  const reply =
    `Real del Monte concentra siglos de narrativa minera.\n` +
    `En 1766 se documenta una de las primeras huelgas obreras del continente, ` +
    `un episodio poco difundido pero clave para entender la relación entre minería y derechos laborales.\n\n` +
    `Algunos nodos históricos relevantes:\n${placesInfo}\n\n` +
    `La Mina de Acosta permite descender al subsuelo y sentir la tradición minera; ` +
    `el Panteón Inglés conserva tumbas orientadas hacia Inglaterra y simbolismos singulares.\n\n` +
    `¿Te gustaría una ruta centrada en patrimonio minero o prefieres un relato guiado con leyendas cortas?`;

  return {
    reply,
    suggestedActions: [
      {
        label: "⛏️ Ruta del patrimonio",
        action: "REQUEST_HERITAGE_ROUTE",
      },
      {
        label: "🗺️ Ver sitios históricos",
        action: "OPEN_CATEGORY",
        payload: { category: "HISTORIC" },
      },
      {
        label: "📜 Escuchar leyendas",
        action: "NAVIGATE",
        payload: { path: "/relatos" },
      },
    ],
  };
}

function handleAdventureIntent(): {
  reply: string;
  suggestedActions: SuggestedAction[];
} {
  const reply =
    `A más de 2,700 metros sobre el nivel del mar, el entorno de oyamel que rodea ` +
    `Real del Monte ofrece condiciones ideales para turismo de aventura.\n\n` +
    `La Peña del Zumate y el bosque del Hiloche son puntos clave para senderismo, rappel y rutas de alta intensidad.\n\n` +
    `Cuéntame tu nivel de experiencia (principiante, intermedio, avanzado) y el tiempo que tienes hoy para ajustar la dificultad.`;

  return {
    reply,
    suggestedActions: [
      {
        label: "🏔️ Ruta de aventura",
        action: "REQUEST_ADVENTURE_ROUTE",
      },
      {
        label: "🌲 Explorar ecoturismo",
        action: "NAVIGATE",
        payload: { path: "/ecoturismo" },
      },
      {
        label: "🗺️ Miradores 360°",
        action: "OPEN_CATEGORY",
        payload: { category: "VIEWPOINT" },
      },
    ],
  };
}

function handleEventsIntent(): {
  reply: string;
  suggestedActions: SuggestedAction[];
} {
  const reply =
    `El calendario cultural de Real del Monte suele incluir:\n\n` +
    `🎉 Festival del Paste (octubre)\n` +
    `🎭 Festival de las Ánimas (noviembre)\n` +
    `🎡 Fiestas patronales locales en distintos barrios\n\n` +
    `¿Quieres que te muestre la agenda actualizada o que planifiquemos tu visita alrededor de una fecha específica?`;

  return {
    reply,
    suggestedActions: [
      {
        label: "📅 Abrir calendario",
        action: "NAVIGATE",
        payload: { path: "/eventos" },
      },
      {
        label: "🗺️ Planear según eventos",
        action: "REQUEST_EVENT_ROUTE",
      },
    ],
  };
}

function handleCultureIntent(): {
  reply: string;
  suggestedActions: SuggestedAction[];
} {
  const reply =
    `La identidad de este territorio mezcla herencia minera, británica y serrana:\n\n` +
    `💎 Platería de autor y artesanías\n` +
    `🎨 Galerías y talleres de arte local\n` +
    `👻 Relatos del subsuelo y leyendas de aparecidos\n\n` +
    `¿Prefieres explorar artesanías, arte o leyendas primero?`;

  return {
    reply,
    suggestedActions: [
      {
        label: "💎 Ver artesanías",
        action: "NAVIGATE",
        payload: { path: "/arte" },
      },
      {
        label: "👻 Leer leyendas",
        action: "NAVIGATE",
        payload: { path: "/relatos" },
      },
    ],
  };
}

function handleHelpIntent(): {
  reply: string;
  suggestedActions: SuggestedAction[];
} {
  const reply =
    `Soy Realito, una instancia del núcleo cognitivo territorial diseñado por Isabella Villaseñor AI para RDM Digital.\n\n` +
    `Uso el gemelo digital del pueblo, telemetría de afluencia y modelos de optimización para ayudarte a decidir qué hacer.\n\n` +
    `Puedo:\n` +
    `🗺️ Proponer rutas optimizadas (con algoritmo genético y datos en tiempo casi real)\n` +
    `🥟 Recomendar lugares para comer según tu estilo\n` +
    `⛏️ Contarte la historia minera y cultural de Real del Monte\n\n` +
    `Dime, por ejemplo: "arma una ruta corta para caminar", "dónde comer pastes" o "cuéntame la historia de la mina".`;

  return {
    reply,
    suggestedActions: [
      {
        label: "🗺️ Sugerir ruta",
        action: "SUGGEST_ROUTE",
      },
      {
        label: "🥟 Dónde comer",
        action: "FIND_FOOD",
      },
      {
        label: "⛏️ Historia local",
        action: "TELL_HISTORY",
      },
    ],
  };
}

// ================================================================
// ORQUESTADOR PRINCIPAL (HANDLER EXPRESS)
// ================================================================

export const handleRealitoChat = async (req: Request, res: Response) => {
  const body = req.body as {
    message?: string;
    contextHistory?: ChatMessageDTO[];
    userPreferences?: UserPreferences;
    geo?: { lat: number; lng: number } | null;
    userId?: string;
  };

  const rawMessage = body.message?.trim();
  if (!rawMessage) {
    return res
      .status(400)
      .json({ error: "Mensaje vacío: requerido por el Kernel." });
  }

  try {
    const userPreferences = body.userPreferences ?? {};
    const twinsContext = buildTwinsContext();
    const intent = detectIntent(rawMessage);

    let reply = "";
    let suggestedActions: SuggestedAction[] = [];
    let gaSuggestion: PlannedRoute | null = null;

    switch (intent) {
      case "ROUTES": {
        const result = await handleRoutesIntent(
          rawMessage,
          twinsContext,
          userPreferences,
        );
        reply = result.reply;
        suggestedActions = result.suggestedActions;
        gaSuggestion = result.gaSuggestion;
        break;
      }
      case "GASTRONOMY": {
        const result = await handleGastronomyIntent(twinsContext);
        reply = result.reply;
        suggestedActions = result.suggestedActions;
        break;
      }
      case "HISTORY": {
        const result = handleHistoryIntent(twinsContext);
        reply = result.reply;
        suggestedActions = result.suggestedActions;
        break;
      }
      case "ADVENTURE": {
        const result = handleAdventureIntent();
        reply = result.reply;
        suggestedActions = result.suggestedActions;
        break;
      }
      case "EVENTS": {
        const result = handleEventsIntent();
        reply = result.reply;
        suggestedActions = result.suggestedActions;
        break;
      }
      case "CULTURE": {
        const result = handleCultureIntent();
        reply = result.reply;
        suggestedActions = result.suggestedActions;
        break;
      }
      default: {
        const result = handleHelpIntent();
        reply = result.reply;
        suggestedActions = result.suggestedActions;
        break;
      }
    }

    const interactionId = crypto.randomUUID();
    db.interactions.set(interactionId, {
      id: interactionId,
      kind: `realito_v3_${intent.toLowerCase()}`,
      context: rawMessage.substring(0, 200),
      createdAt: new Date().toISOString(),
    });

    const response: RealitoChatResponse & {
      persona?: { name: string; role: string };
    } = {
      reply,
      intent,
      suggestedActions,
      gaSuggestion,
      engine: KERNEL_VERSION,
      visualStyle: VISUAL_STYLE,
      twinNodesQueried: twinsContext.length,
      interactionId,
      persona: {
        name: "Realito · Isabella Villaseñor AI",
        role: "Orquestador territorial de experiencias en Real del Monte",
      },
    };

    return res.json(response);
  } catch (error) {
    console.error("KERNEL ERROR:", error);
    return res
      .status(500)
      .json({ error: "Fallo en el núcleo de Realito AI." });
  }
};
