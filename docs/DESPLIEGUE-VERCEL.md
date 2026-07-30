# Nodo Cero / RDM Digital Hub — Blueprint de despliegue en Vercel

> Documento canónico y operable. Refleja **el estado real del repositorio** (Vite 5 + React 18 + TypeScript + Tailwind + Lovable Cloud/Supabase) y el camino de evolución hacia la arquitectura federada objetivo (Turborepo + Next.js App Router).

---

## 0. Nota de realidad arquitectónica

El blueprint de referencia describe un monorepo **Turborepo + Next.js 15 (App Router) + Edge Middleware**. Este repositorio hoy es una **SPA Vite + React Router** con backend en **Lovable Cloud (Supabase: Postgres, Auth, Storage, Edge Functions)** y un backend Express auxiliar en `server/` (no desplegado en Vercel).

Migrar de golpe a Next.js implicaría reescribir 30+ páginas, el router, el sistema de intro cinemática y todos los contratos vivos de pagos/auth. **Decisión operativa:** desplegamos ya en Vercel la SPA con configuración edge-grade (headers, CSP, caché, SPA fallback, cron opcional), y dejamos mapeada la ruta de migración por federación.

Equivalencias aplicadas:

| Blueprint objetivo | Implementación actual desplegable |
| --- | --- |
| Next.js App Router | Vite SPA + React Router (`src/App.tsx`, rutas lazy) |
| Edge Middleware | Headers + rewrites en `vercel.json` + `constitutionalGuard` (Express) |
| Route Handlers `/api/v1/*` | Supabase Edge Functions (`supabase/functions/*`) + `server/src/routes/*` |
| ISR público | Caché inmutable de assets + `must-revalidate` en HTML |
| PWA / modo isla | `public/manifest.webmanifest` (instalable). Offline shell = fase 2 |
| Turborepo `domains/*` | `server/src/services|routes` por dominio + `src/lib/types/*` |

---

## 1. Capas funcionales (L0–L7) mapeadas al repo

| Capa | Responsabilidad | Dónde vive hoy |
| --- | --- | --- |
| L0 Infraestructura | Deploy, edge, DNS, secrets, CI | `vercel.json`, `.github/workflows/ci.yml`, `.vercelignore` |
| L1 Datos | Persistencia territorio/economía/auditoría | Lovable Cloud (Postgres + RLS), `server/prisma/schema.prisma` |
| L2 Identidad | Auth, perfiles, roles, consentimiento | `src/hooks/useAuth.tsx`, `useUserRole.tsx`, tabla `user_roles` |
| L3 Servicios | APIs de dominio | `server/src/routes/*`, `supabase/functions/*` |
| L4 Economía | Membresías, minería, puntos, canje | `rdm-mine`, `rdm-redeem`, `rdm-membership-activate`, `/mina` |
| L5 Inteligencia | Isabella / Realito, decisión auditable | `supabase/functions/realito-chat`, `server/src/services/decision.engine.ts` |
| L6 Interfaz | Planos I/II/III | `src/pages/*`, `src/components/NavBar.tsx` (mega-menú por planos) |
| L7 Gobernanza | Políticas, auditoría, allowlist | `constitutionalGuard.ts`, `audit.service.ts`, `/admin` |

---

## 2. Configuración de Vercel aplicada

`vercel.json` en la raíz define:

- **Framework** `vite`, salida `dist`, `installCommand: npm ci`.
- **Build**: `npm run roadmap:sync && npm run build` (el roadmap-as-code se regenera en cada deploy).
- **SPA fallback**: rewrite de todo lo que no empiece por `/api/` hacia `/index.html` — deep links y refresh funcionan.
- **Headers duros**: HSTS preload, CSP estricta (con allowlist de Supabase, tiles OSM y fuentes Google), `X-Frame-Options: DENY`, `Permissions-Policy` con `geolocation=(self)` (requerido por el mapa), COOP.
- **Caché**: assets con hash → `immutable` 1 año; `index.html` y `manifest.webmanifest` → `must-revalidate`; `roadmap-rdmx.json` → `s-maxage=3600`.
- **Redirects** canónicos: `/home → /`, `/tesis → /tamv/thesis`, `/comercios → /comercios/panel`.
- **Región** `iad1` (cambiar a la más cercana al mercado; para México central `iad1` o `sfo1`).

`.vercelignore` excluye `server/`, `packages/`, `e2e/`, `docs/` y binarios de nodo local del bundle de build.

---

## 3. Variables de entorno en Vercel

Configurar en **Project Settings → Environment Variables** (Production + Preview).

### Bloque público (expuesto al bundle, obligatorio)

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
```

> Sin estas tres la app compila pero el cliente Supabase se inicializa con `undefined` y el sitio publicado falla en silencio. Son claves publicables: la protección real es RLS.

### Bloque de identidad nodal (opcional, para telemetría/branding)

```
VITE_NODE_ID=nodo-cero-rdm
VITE_NODE_NAME=Real del Monte · Nodo Cero
VITE_PRIMARY_DOMAIN=rdmdigital.mx
VITE_FEDERATION_COUNT=7
VITE_CONSTITUTION_VERSION=v1
```

### Bloque servidor (NO en Vercel — viven en Lovable Cloud como secrets)

`SUPABASE_SERVICE_ROLE_KEY`, `LOVABLE_API_KEY`, `GITHUB_TOKEN`, claves de pagos. Las Edge Functions las leen en runtime; nunca deben aparecer en el bundle del frontend.

---

## 4. Rutas

### Públicas (cacheables)
`/`, `/historia`, `/cultura`, `/arte`, `/gastronomia`, `/relatos`, `/ecoturismo`, `/rutas`, `/dichos`, `/eventos`, `/comunidad`, `/catalogo`, `/quienes-somos`, `/archivo-sonoro`, `/faq`

### Privadas / con sesión (sin caché de datos)
`/perfil`, `/ajustes`, `/mina`, `/membresias`, `/comercios/panel`, `/comercios/registro`, `/comercios/checkout`, `/admin`

### Documentales (Plano III)
`/tamv`, `/tamv/status`, `/tamv/api`, `/tamv/thesis`, `/tenochtitlan`, `/fusion`, `/operativo`, `/evolucion`

### API (fuera de Vercel)
Supabase Edge Functions: `create-merchant-payment`, `merchant-payment-webhook`, `realito-chat`, `rdm-mine`, `rdm-redeem`, `rdm-membership-activate`.

---

## 5. Flujo de despliegue

1. `vercel link` (o importar el repo desde el dashboard de Vercel).
2. Framework preset: **Vite**. Root Directory: raíz del repo.
3. Cargar variables de entorno del bloque público.
4. Deploy a Preview → validar `/`, `/mapa` (geolocalización), `/catalogo`, `/comercios/checkout`.
5. Promover a Production.
6. DNS: A record en raíz → Vercel, CNAME `www` → `cname.vercel-dns.com`, TXT de identidad nodal. HTTPS forzado + HSTS ya activo por header.

### Comandos locales de verificación

```bash
npm ci
npm run lint
npm run test
npm run roadmap:sync
npm run build
npx vercel build   # simula el build de Vercel con vercel.json
```

---

## 6. CI/CD

`.github/workflows/ci.yml` ya ejecuta: install → roadmap:sync → lint → tests → build → Playwright E2E (headless) → build backend. Vercel se engancha después del CI vía integración GitHub (`github.silent: true` para no ensuciar los PR con comentarios).

Reglas de release: sin tests no hay deploy; sin migración no hay cambio de esquema; sin policy gate no hay tool de IA nueva.

---

## 7. Roadmap de evolución hacia el blueprint completo

| Fase | Entrega | Riesgo |
| --- | --- | --- |
| F1 (hecho) | SPA en Vercel con headers/CSP/caché/SPA fallback | bajo |
| F2 | Offline shell / modo isla (service worker guardado, cola cifrada de acciones) | medio |
| F3 | Extracción de `domains/*` (identity, economy, tourism, ai) a paquetes con contratos Zod | medio |
| F4 | Migración progresiva a Next.js App Router con Edge Middleware (node id, nonce, trust context, audit trace id) | alto |
| F5 | PQC híbrido: firmas verificables por federación y rotación de trust anchors | alto |

---

## 8. Checklist pre-producción

- [x] `vercel.json` con SPA fallback y headers de seguridad
- [x] `.vercelignore` sin backend ni docs en el bundle
- [x] Build reproducible (`npm ci` + `roadmap:sync` + `vite build`)
- [x] RLS activa en todas las tablas Cloud
- [x] SEO por ruta (`SEOMeta` con Helmet + JSON-LD)
- [x] Geolocalización permitida por `Permissions-Policy`
- [ ] Proveedor de pagos real conectado (Stripe/Paddle) — pendiente de decisión
- [ ] Offline shell / modo isla (F2)
