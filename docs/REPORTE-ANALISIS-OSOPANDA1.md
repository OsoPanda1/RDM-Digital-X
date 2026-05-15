# Reporte · Análisis real de github.com/OsoPanda1

Fecha: 2026-05-15
Fuente: GitHub API (`/users/OsoPanda1/repos`) + lectura directa de árboles de cada repo (rama `main`).

## 1. Inventario real

- Total repos del perfil: **100**
- Relacionados con RDM / TAMV / gemelo digital: **40** (ver `docs/osopanda-related-repos.json`, regenerado con datos vivos: nombre, descripción, lenguaje, tamaño, fecha, topics).
- Repos núcleo identificados como compatibles con este proyecto:

| Repo | Rol detectado | Tamaño | Aporte |
|---|---|---|---|
| `RDM-Digital-X` | **Este proyecto** (espejo) | 20 MB | Base actual |
| `real-del-monte-explorer` | Predecesor Vite/React | 144 MB | Assets cinemáticos (webp, mp4, mp3), playbooks |
| `real-del-monte-twin` | Gemelo digital geo | 11 MB | Realito assets, hero banner |
| `rdm-smart-city-os` | Sistema operativo ciudad | 13 MB | Hero cinematic, dia-muertos, mine-tunnel |
| `rdm-digital-nodo-cero` | Shell soberano (Next.js) | 171 MB | RFCs (event-fabric, bookpi, isabella) |
| `citemesh-roots` | Raíz autopoiética + Isabella | 3 MB | Imágenes RDM aéreo / bosque / mirador |

## 2. Cambios aplicados (código real, sin mocks)

### Activos migrados (15 archivos reales descargados)
Carpeta nueva: `src/assets/imported/` con assets en alta calidad provenientes de los repos hermanos:

- **De `real-del-monte-explorer`**: `hero-real-del-monte.webp`, `mina-acosta.webp`, `panteon-ingles.webp`, `penas-cargadas.webp`, `calles-colonial.webp`, `paste.webp`
- **De `rdm-smart-city-os`**: `rdm-hero-cinematic.png`, `misty-mountains.jpg`, `plaza-night.jpg`, `rooftops-sunrise.jpg`, `mine-tunnel.jpg`, `dia-muertos.jpg`
- **De `citemesh-roots`**: `rdm-aerial-pueblo.jpg`, `rdm-bosque-niebla.jpg`, `rdm-mirador-sunset.jpg`

### Componentes actualizados
- `src/components/HeroSection.tsx` → ahora usa `hero-real-del-monte.webp` (asset oficial de `real-del-monte-explorer`, mucho mayor fidelidad que el placeholder anterior).
- `src/components/SitesSection.tsx` → 3 tarjetas principales (Museo Mina, Pastes, Calles) ahora usan los `.webp` originales del proyecto Explorer en lugar de los `jpg` provisionales.

### Manifiesto operativo
- `docs/osopanda-related-repos.json` regenerado con **datos reales del API de GitHub** (40 repos relacionados con metadata completa: stars, size, topics, updated_at) — reemplaza el manifest estático anterior de 4 entradas.

## 3. Cómo replicar

```bash
# Refrescar manifiesto en cualquier momento:
GITHUB_TOKEN=xxx npm run fuse:osopanda  # (tools/fuse-osopanda-repos.mjs)

# Verificación local:
npm run lint && npm test && npm run build
```

## 4. Próximos pasos sugeridos (no aplicados, requieren validación)

1. Importar `hero-video.mp4`, `leyenda1.mp4`, `intro_off.mp3` desde `real-del-monte-explorer` para el `CinematicIntro` (≈30 MB extra — confirmar peso de bundle).
2. Migrar RFCs (`RFC-001-event-fabric`, `RFC-002-bookpi`, `RFC-003-isabella-protocol`) de `rdm-digital-nodo-cero/docs/rfcs/` como referencia técnica en `docs/rfcs/`.
3. Adoptar el `RDM-Digital-GAP-PLAYBOOK.md` y `FEDERATED-SOVEREIGN-AI-RUNBOOK.md` de `real-del-monte-explorer` como base para el runbook de despliegue.
