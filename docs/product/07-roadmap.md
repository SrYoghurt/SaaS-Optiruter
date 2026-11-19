# Roadmap — OptiRuter

## 1. Objetivo del roadmap

Este documento define las fases, hitos, dependencias y criterios de cierre para construir el MVP de OptiRuter.

El roadmap no es una lista infinita de features. Es una secuencia que permite construir el producto por partes, validando que cada fase entregue valor real antes de avanzar.

Un roadmap debe mostrar iniciativas, hitos, dependencias y entregables; el plan detallado de ejecución vive en los issues y tareas. [207][209]

## 2. Resultado final esperado

Al finalizar el MVP, OptiRuter debe permitir:

1. Registrarse y crear una organización.
2. Cargar vehículos, conductores y pedidos.
3. Importar pedidos por CSV.
4. Crear un plan de rutas.
5. Generar rutas optimizadas.
6. Visualizar rutas en un mapa.
7. Consultar KPIs del plan.
8. Reoptimizar un plan.
9. Ver actualizaciones en tiempo real.
10. Acceder a una landing pública.

El MVP debe poder demostrarse de extremo a extremo sin intervención manual.

## 3. Principios de ejecución

- Construir por vertical slices.
- Cada fase debe entregar algo funcional.
- No avanzar si la fase anterior no cumple criterios de cierre.
- Documentar decisiones técnicas en ADRs.
- Escribir tests desde el primer módulo.
- Evitar features que no sostengan el flujo central.
- Mantener el MVP enfocado en planificación y optimización.

El objetivo de un MVP es incluir solo las features necesarias para entregar el valor central del producto. [210][212]

## 4. Fases del proyecto

| Fase | Nombre | Objetivo |
|---|---|---|
| 0 | Discovery y documentación | Definir producto, alcance y arquitectura. |
| 1 | Fundación técnica | Crear base del monorepo, infraestructura y CI. |
| 2 | Núcleo operativo | Auth, organizaciones, vehículos, conductores y pedidos. |
| 3 | Optimización | Planes, colas, worker y optimizador. |
| 4 | Experiencia de usuario | Dashboard, mapa, KPIs y tiempo real. |
| 5 | Preparación para demo | Deploy, documentación, datos demo y pulido. |

## 5. Fase 0 — Discovery y documentación

### Objetivo

Tener claridad total antes de escribir código.

### Entregables

- `01-product-brief.md`
- `02-mvp-scope.md`
- `03-user-stories.md`
- `04-data-model.md`
- `05-api-contract.md`
- `06-architecture.md`
- `07-roadmap.md`
- `08-ai-workflow.md`

### Criterios de cierre

- [ ] Problema y usuario definidos.
- [ ] MVP scope definido.
- [ ] User stories completas.
- [ ] Modelo de datos definido.
- [ ] API contract definido.
- [ ] Arquitectura definida.
- [ ] Roadmap definido.
- [ ] Reglas de uso de IA definidas.

### Dependencias

Ninguna.

## 6. Fase 1 — Fundación técnica

### Objetivo

Crear la base técnica del proyecto.

### Entregables

- Repositorio GitHub.
- Monorepo inicial.
- NestJS API.
- React Web.
- Worker NestJS.
- Optimizador Python.
- Prisma + PostgreSQL.
- Redis + BullMQ.
- Docker Compose.
- CI básico.
- ESLint + Prettier.
- TypeScript estricto.
- README inicial.

### Estructura inicial

```text
optiruter/
├── apps/
│   ├── web/
│   ├── api/
│   ├── worker/
│   └── optimizer/
├── packages/
│   ├── shared/
│   └── ui/
├── docs/
├── .github/
│   └── workflows/
├── docker-compose.yml
├── README.md
└── .gitignore
```

### Criterios de cierre

- [ ] Repositorio creado.
- [ ] Monorepo configurado.
- [ ] NestJS corre localmente.
- [ ] React corre localmente.
- [ ] Worker corre localmente.
- [ ] Optimizador corre localmente.
- [ ] PostgreSQL corre en Docker.
- [ ] Redis corre en Docker.
- [ ] Prisma conecta con PostgreSQL.
- [ ] CI ejecuta lint, typecheck y tests.
- [ ] README explica cómo levantar el proyecto.

### Dependencias

- Fase 0 completada.

## 7. Fase 2 — Núcleo operativo

### Objetivo

Construir la base operativa del producto.

### Entregables

- Auth.
- Organizaciones.
- Usuarios.
- Vehículos.
- Conductores.
- Pedidos.
- Importación CSV.
- Validaciones.
- Tests.
- Swagger.

### Historias incluidas

- US-001 Registrarse.
- US-002 Iniciar sesión.
- US-003 Refrescar sesión.
- US-004 Cerrar sesión.
- US-005 Ver organización.
- US-006 Editar organización.
- US-007 Crear vehículo.
- US-008 Editar vehículo.
- US-009 Eliminar vehículo.
- US-010 Listar vehículos.
- US-011 Crear conductor.
- US-012 Editar conductor.
- US-013 Eliminar conductor.
- US-014 Crear pedido.
- US-015 Editar pedido.
- US-016 Eliminar pedido.
- US-017 Importar pedidos por CSV.

### Criterios de cierre

- [ ] Un usuario puede registrarse.
- [ ] Un usuario puede iniciar sesión.
- [ ] Un usuario puede refrescar sesión.
- [ ] Un usuario puede cerrar sesión.
- [ ] Un usuario puede crear organización.
- [ ] Un usuario puede crear vehículos.
- [ ] Un usuario puede crear conductores.
- [ ] Un usuario puede crear pedidos.
- [ ] Un usuario puede importar pedidos por CSV.
- [ ] Los datos están aislados por organización.
- [ ] Los endpoints están documentados en Swagger.
- [ ] Los tests cubren servicios y endpoints.

### Dependencias

- Fase 1 completada.

## 8. Fase 3 — Optimización

### Objetivo

Implementar el núcleo diferencial del producto.

### Entregables

- Planes de rutas.
- Cola BullMQ.
- Worker de optimización.
- Optimizador Python OR-Tools.
- Rutas y paradas.
- KPIs.
- Reoptimización.
- Estado del plan.
- Manejo de errores.

### Historias incluidas

- US-018 Crear plan de rutas.
- US-019 Ver estado del plan.
- US-020 Ver rutas generadas.
- US-021 Ver KPIs del plan.
- US-022 Reoptimizar plan.
- US-023 Agregar pedidos a un plan.

### Criterios de cierre

- [ ] Un usuario puede crear un plan.
- [ ] El plan queda en estado `QUEUED`.
- [ ] El worker toma el job.
- [ ] El optimizador recibe datos.
- [ ] El optimizador devuelve rutas.
- [ ] El worker guarda rutas y paradas.
- [ ] El plan pasa a `READY`.
- [ ] El sistema calcula KPIs.
- [ ] El usuario puede reoptimizar.
- [ ] El sistema mantiene historial de planes.
- [ ] Los jobs son idempotentes.
- [ ] Los errores quedan registrados.

### Dependencias

- Fase 2 completada.

## 9. Fase 4 — Experiencia de usuario

### Objetivo

Convertir el backend en un producto usable.

### Entregables

- Dashboard.
- Listado de planes.
- Detalle de plan.
- Mapa de rutas.
- Detalle de paradas.
- KPIs visuales.
- Estado en tiempo real.
- Landing pública.
- Onboarding básico.
- Responsive design.

### Historias incluidas

- US-024 Ver mapa de rutas.
- US-025 Ver detalle de parada.
- US-026 Recibir actualizaciones del plan.
- US-027 Ver landing pública.
- US-028 Solicitar demo.

### Criterios de cierre

- [ ] El usuario ve dashboard con KPIs.
- [ ] El usuario ve listado de planes.
- [ ] El usuario ve detalle de plan.
- [ ] El usuario ve mapa con rutas.
- [ ] El usuario ve paradas en el mapa.
- [ ] El usuario puede seleccionar una ruta.
- [ ] El usuario ve estado en tiempo real.
- [ ] La landing explica el producto.
- [ ] La landing tiene CTA.
- [ ] La UI es responsive.
- [ ] La UI es accesible básicamente.

### Dependencias

- Fase 3 completada.

## 10. Fase 5 — Preparación para demo

### Objetivo

Dejar el proyecto listo para mostrar en portfolio.

### Entregables

- Deploy.
- Datos demo.
- Screenshots.
- README profesional.
- Documentación final.
- Tests E2E.
- Caso de uso completo.
- Video demo opcional.
- Landing pulida.

### Criterios de cierre

- [ ] El proyecto está deployado.
- [ ] El frontend funciona en producción.
- [ ] La API funciona en producción.
- [ ] El worker funciona en producción.
- [ ] El optimizador funciona en producción.
- [ ] PostgreSQL está configurado.
- [ ] Redis está configurado.
- [ ] Hay datos demo cargables.
- [ ] Hay screenshots del dashboard.
- [ ] Hay screenshots del mapa.
- [ ] El README explica arquitectura y setup.
- [ ] Hay tests E2E del flujo principal.
- [ ] El flujo completo puede demostrarse.

### Dependencias

- Fase 4 completada.

## 11. Hitos principales

| ID | Hito | Fase | Resultado esperado |
|---|---|---|---|
| M1 | Documentación completa | 0 | Base clara para construir. |
| M2 | Infraestructura local lista | 1 | Proyecto levanta con Docker. |
| M3 | Auth y organizaciones listas | 2 | Usuario puede registrarse y operar. |
| M4 | Datos operativos listos | 2 | Vehículos, conductores y pedidos cargables. |
| M5 | Optimización funcional | 3 | Plan genera rutas reales. |
| M6 | Mapa y KPIs listos | 4 | Usuario ve resultado visual. |
| M7 | MVP demo-ready | 5 | Proyecto deployado y demostrable. |

Los hitos deben representar resultados completados, no actividades genéricas como “desarrollo” o “testing”. [207][211][214]

## 12. Dependencias críticas

```text
Fase 0
  └──► Fase 1
          └──► Fase 2
                  └──► Fase 3
                          └──► Fase 4
                                  └──► Fase 5
```

### Dependencias internas

| Dependencia | Requiere |
|---|---|
| Vehículos | Auth y organizaciones |
| Conductores | Vehículos |
| Pedidos | Auth y organizaciones |
| Planes | Pedidos y vehículos |
| Optimización | Planes y worker |
| Mapa | Rutas generadas |
| KPIs | Optimización finalizada |
| Reoptimización | Plan base |
| Tiempo real | Worker y WebSocket |
| Landing | Producto mínimo visible |

### Dependencias externas

| Dependencia | Uso |
|---|---|
| PostgreSQL | Base de datos |
| Redis | Colas |
| Google OR-Tools | Optimización |
| MapLibre | Mapa |
| Docker | Entorno local |
| GitHub Actions | CI |

## 13. Orden de implementación

### Semana 1

- Fase 0.
- Documentación completa.
- Definición de MVP.
- Modelo de datos.
- API contract.
- Arquitectura.

### Semana 2

- Fase 1.
- Monorepo.
- Docker Compose.
- NestJS base.
- React base.
- Prisma.
- Redis.
- CI.

### Semana 3

- Fase 2.
- Auth.
- Organizaciones.
- Vehículos.
- Conductores.
- Pedidos.
- CSV import.

### Semana 4

- Fase 3.
- Planes.
- BullMQ.
- Worker.
- Optimizador.
- Rutas.
- KPIs.

### Semana 5

- Fase 4.
- Dashboard.
- Mapa.
- Tiempo real.
- Landing.

### Semana 6

- Fase 5.
- Deploy.
- Datos demo.
- Tests E2E.
- README final.
- Pulido.

## 14. Riesgos del roadmap

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Optimizador complejo | Retraso | Empezar con reglas básicas |
| Falta de claridad en modelo | Refactor costoso | Documentar antes de codificar |
| Scope creep | MVP nunca termina | Respetar MVP scope |
| Falta de tests | Bugs difíciles de detectar | Tests desde fase 2 |
| Problemas de deploy | Demo falla | Probar deploy temprano |
| Dependencia de IA | Código poco comprendido | Revisión y tests |
| Datos demo pobres | Demo poco creíble | Preparar dataset realista |

## 15. Reglas de cambio

- Si una feature no está en MVP scope, no entra.
- Si una feature es necesaria, debe entrar como cambio explícito.
- Si un hito se retrasa, se documenta el motivo.
- Si cambia la arquitectura, se crea un ADR.
- Si cambia el modelo de datos, se actualiza `04-data-model.md`.
- Si cambia la API, se actualiza `05-api-contract.md`.

## 16. Definition of Done global

El proyecto se considera terminado cuando:

- [ ] Todas las fases cumplen criterios de cierre.
- [ ] El flujo completo funciona.
- [ ] Los tests pasan.
- [ ] El deploy funciona.
- [ ] La documentación está actualizada.
- [ ] El README explica cómo correr el proyecto.
- [ ] El proyecto puede demostrarse de extremo a extremo.
- [ ] El código está limpio y modular.
- [ ] La seguridad básica está implementada.
- [ ] La experiencia es usable en desktop y mobile.