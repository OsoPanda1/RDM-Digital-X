# Fusión funcional RDM·X

Esta integración convierte cuatro repositorios de OsoPanda1 en un solo plano operativo dentro del portal Vite/React actual:

- `rdm-digital-nodo-cero`: shell soberano, identidad, protocolos, economía e IA contextual.
- `rdm-turismodigital`: rutas, sitios, eventos, catálogo comercial y experiencia de visitante.
- `real-del-monte-twin`: gemelo digital, lugares, telemetría y mapa vivo.
- `citemesh-roots`: raíz autopoiética, malla federada, Isabella AI auditada y principios de gobernanza.

## Decisión de implementación

La fusión no copia aplicaciones completas de Next/Vite externas dentro del bundle. En su lugar, crea una capa funcional de absorción con:

1. Un manifiesto typed en `src/data/fusion-repos.ts`.
2. Un panel navegable en `/fusion`.
3. Enlaces operativos a rutas ya existentes: `/tamv`, `/tamv/api`, `/tamv/status`, `/tamv/thesis`, `/rutas`, `/catalogo`, `/comercios/registro`, `/#mapa` y `/tenochtitlan`.
4. Contratos explícitos por repositorio para preparar sincronización posterior con GitHub/API/backends.

## Estado

- Integrado: `rdm-digital-nodo-cero`, `real-del-monte-twin`, `citemesh-roots`.
- Orquestado: `rdm-turismodigital` como dominio turístico absorbido por las páginas actuales de turismo, rutas, eventos y catálogo.

## Próximos pasos recomendados

1. Reemplazar fixtures comerciales/turísticos por un endpoint versionado.
2. Conectar `/tamv/status` con telemetría real SSE cuando el backend remoto esté disponible.
3. Añadir verificación de hashes/commits remotos al manifiesto de fusión.
4. Convertir contratos `EOCT`, `MSR`, `BookPI` y `CRDT Sync` en adaptadores ejecutables.
