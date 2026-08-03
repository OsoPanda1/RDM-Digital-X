# RDM Digital OS · Realito AI

RDM Digital OS es un **kernel territorial** para Real del Monte, Hidalgo: un backend en Node.js + TypeScript que orquesta gemelos digitales, rutas inteligentes, protocolos éticos y experiencias XR en tiempo casi real.

El núcleo conversacional se expone como **Realito AI**, un asistente local que usa datos del territorio (gemelos, telemetría y catálogos) para responder preguntas, sugerir rutas y conectar a visitantes y comercios.

---

## Arquitectura en breve

- **Runtime:** Node.js + Express + TypeScript.
- **Dominio principal:** turismo inteligente y economía local en Real del Monte.
- **Capas clave:**
  - `digital-twins`: gemelos de lugares, comercios y nodos XR.
  - `geolocation`: registro de lugares, telemetría de usuarios y verificación básica.
  - `realito`: controlador conversacional + optimizador genético de rutas.
  - `protocols`: motor de protocolos con guardias constitucionales y auditoría (MSR/Bookpi).
  - `audit`: eventos estructurados para trazabilidad (MSR, Bookpi, guardian).

---

## Features principales

- **Realito AI (Conversacional):**
  - Detección de intención (rutas, gastronomía, historia, aventura, cultura, eventos, ayuda).
  - Respuestas guiadas con `suggestedActions` para UI (botones, navegación, rutas).
  - Personalización por preferencias de usuario (`UserPreferences`).

- **Optimizer de rutas (Genetic Algorithm):**
  - `optimizeRoute()` construye itinerarios a partir de `TwinContext`.
  - Maximiza diversidad temática, minimiza saturación, balancea comercios/cultura.
  - Estima tiempos a partir de distancia (Haversine) y tiempos de estancia por nodo.

- **Digital Twins:**
  - `TwinContext` unifica datos de lugar, comercio y telemetría.
  - `computeTwinOperationalScore()` pondera calidad/operación de comercios.
  - Integración con geolocalización y XR para mapas y overlays.

- **Geolocalización en tiempo casi real:**
  - Registro de lugares (`registerPlace`) con validación WGS84.
  - Telemetría de usuarios (`addTelemetry`, `getRecentTelemetry`) con listeners para XR.
  - Cálculo de distancias por Haversine (en metros/km).

- **Protocolos y guardias constitucionales:**
  - `constitutionalGuard` protege mutaciones HTTP por dominio (Zero Trust).
  - `runProtocolOrchestration()` ejecuta comandos de protocolo, persiste runs y señales del “guardian”.
  - Adaptadores a MSR y Bookpi (`publishProtocolToMsr`, `publishProtocolToBookpi`) para auditoría.

---

## Estructura del proyecto (simplificada)

```txt
src/
  lib/
    store.ts                # In-memory store (protocolRuns, guardianAlerts, interactions, etc.)
  services/
    digital-twins.service.ts  # Gemelos digitales, op scores
    geolocation.service.ts    # Lugares, telemetría, verificación
    audit.service.ts          # Eventos MSR + narrativas Bookpi
  realito/
    controller.ts             # handleRealitoChat (Realito AI controller)
    geneticOptimizer.ts       # GA de rutas antifrágiles
    twinContextBuilder.ts     # Construye TwinContext desde store/datos
    types.ts                  # DTOs comunes (TwinContext, UserPreferences, etc.)
  protocols/
    protocol.command.ts       # Schema Zod para comandos
    protocol.engine.ts        # Lógica de ejecución de protocolos
    protocol.lifecycle.ts     # Maquina de estados / transición
    protocol.msr.adapter.ts   # Eventos hacia MSR
    protocol.bookpi.adapter.ts# Narrativas hacia Bookpi
    protocol.orchestration.ts # runProtocolOrchestration
  geolocation/
    geolocation.service.ts    # Servicio de lugares + telemetría
    rdm-data.ts               # Catálogo base de lugares (Real del Monte)
  middleware/
    constitutional.guard.ts   # Middleware de protección por dominio
  tests/
    fixture.ts                # Reexport de `test` y `expect` (Playwright/agent)
```

---

## Requisitos

- Node.js 20+
- pnpm o npm
- (Opcional) Servicios externos para MSR / Bookpi / XR Gateway si se integran en producción.

---

## Instalación y ejecución

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd rdm-digital-os

# Instalar dependencias
pnpm install
# o
npm install

# Variables de entorno (ejemplo)
cp .env.example .env
# Editar .env con claves para MSR, Bookpi, etc.

# Compilar TypeScript (si aplica)
pnpm build
# o
npm run build

# Ejecutar en desarrollo
pnpm dev
# o
npm run dev

# Ejecutar en producción (ejemplo)
node dist/index.js
```

---

## Endpoints principales

> Nota: las rutas exactas pueden variar según la configuración del router HTTP.  
> Ejemplos típicos:

- `POST /api/realito/chat`
  - Entrada:
    - `message: string` (obligatorio).
    - `userPreferences?: UserPreferences`.
    - `geo?: { lat: number; lng: number }`.
  - Respuesta (`RealitoChatResponse`):
    - `reply: string`.
    - `intent: "ROUTES" | "GASTRONOMY" | ...`.
    - `suggestedActions: { label, action, payload? }[]`.
    - `gaSuggestion?: PlannedRoute`.
    - `engine`, `visualStyle`, `interactionId`, `twinNodesQueried`.

- `POST /api/protocols/run`
  - Cuerpo validado por `protocolCommandSchema` (`START | TRANSITION | HALT`).
  - Orquesta `executeProtocolCommand`, guarda estado y emite eventos de auditoría.

- `POST /api/geolocation/places`
  - Registra un lugar (`PlaceDraft`) con coordenadas WGS84.
  - Emite evento MSR y Bookpi, y notifica por XR gateway.

- `POST /api/geolocation/telemetry`
  - Agrega eventos de telemetría de usuario (`TelemetryEvent`).
  - Mantiene historial limitado por usuario y emite eventos de posición.

---

## Realito AI · Intentos y comportamientos

Realito detecta la intención a partir del mensaje de texto y activa un handler especializado:

- `ROUTES`: llama a `optimizeRoute` y devuelve rutas con métricas y acciones para mapa.
- `GASTRONOMY`: prioriza gemelos de tipo `FOOD`, ordenados por `opScore` y afluencia.
- `HISTORY`: sugiere nodos históricos y rutas patrimoniales.
- `ADVENTURE`: referencia nodos de naturaleza y aventura.
- `EVENTS`: contextualiza festivales y agenda cultural.
- `CULTURE`: guía hacia arte, artesanías y leyendas.
- `HELP`: explica capacidades de Realito y ejemplos de uso.

---

## Seguridad y auditoría

- **Constitutional Guard**:
  - Permite solo mutaciones (POST/PUT/PATCH/DELETE) en dominios explicitamente permitidos.
  - Registra toda decisión (permitida/denegada) en MSR.

- **Protocol Orchestration**:
  - Valida comandos con Zod (`protocolCommandSchema`).
  - Persiste `protocolRuns` y `guardianAlerts` en `db.store`.
  - Publica resultados y contexto en MSR y Bookpi para trazabilidad.

- **Geolocalización**:
  - Valida coordenadas contra rangos WGS84.
  - Usa Haversine para distancias y no expone datos fuera de rango.

---

## Tests

- Infra base con Playwright + fixture:

```ts
// tests/fixture.ts
export { test, expect } from "lovable-agent-playwright-config/fixture";
```

Los tests pueden:
- Simular conversaciones con Realito.
- Validar que las rutas devueltas cumplen con ciertas restricciones (tiempo, distancia).
- Verificar que los protocolos generan eventos de auditoría esperados.

---

## Roadmap

- Integración completa con base de datos persistente (reemplazar store en memoria).
- Mejora de explicación de decisiones (XAI) para rutas y protocolos.
- Panel de observabilidad para Realito (telemetría y auditoría en tiempo real).
- Más capas de seguridad (rate limiting, autenticación, roles) para exposición pública.

---

## Autoría

Diseñado y ensamblado como parte de **RDM Digital OS**.  
El núcleo conversacional está representado por **Realito · Isabella Villaseñor AI**, orientado a experiencias territoriales en Real del Monte.
