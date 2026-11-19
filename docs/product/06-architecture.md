# Architecture — OptiRuter

## 1. Objetivo

Este documento define la arquitectura técnica de OptiRuter para el MVP.

El objetivo es tener un sistema:

- Modular.
- Escalable.
- Testeable.
- Seguro.
- Fácil de desplegar.
- Capaz de ejecutar optimizaciones pesadas sin bloquear la API.

La arquitectura separa la API, el procesamiento asíncrono y el motor de optimización, porque calcular rutas es una tarea intensiva que no debería bloquear el request HTTP.

## 2. Visión general

OptiRuter estará compuesto por:

- Frontend React.
- API NestJS.
- Worker NestJS.
- Optimizador Python con OR-Tools.
- PostgreSQL.
- Redis.
- WebSocket para tiempo real.

```text
┌──────────────┐
│   React Web  │
└──────┬───────┘
       │ HTTPS / WebSocket
       ▼
┌──────────────┐
│  NestJS API  │
└──────┬───────┘
       │
       ├──► PostgreSQL
       │
       └──► Redis / BullMQ
                │
                ▼
        ┌──────────────┐
        │ NestJS Worker│
        └──────┬───────┘
               │ HTTP
               ▼
        ┌──────────────┐
        │  Optimizer   │
        │ Python + OR  │
        │    Tools     │
        └──────────────┘
```

## 3. Servicios

| Servicio | Tecnología | Responsabilidad |
|---|---|---|
| Web | React + TypeScript + Vite | Landing, dashboard, planificador y mapa. |
| API | NestJS + Express + Prisma | Auth, CRUD, planes, validación y autorización. |
| Worker | NestJS + BullMQ | Procesar optimizaciones e importaciones. |
| Optimizer | Python + FastAPI + OR-Tools | Resolver el problema de ruteo. |
| Database | PostgreSQL | Persistencia principal. |
| Queue | Redis + BullMQ | Colas y jobs asíncronos. |
| Realtime | WebSocket | Actualizaciones de estado. |

NestJS integra BullMQ mediante `@nestjs/bullmq`, permitiendo registrar colas, producers y processors como providers dentro del sistema de dependency injection. [193][199]

## 4. Monorepo

El proyecto usará un monorepo para mantener frontend, backend, worker, optimizador y tipos compartidos en un solo lugar.

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
├── LICENSE
└── .gitignore
```

### apps/web

Frontend React.

### apps/api

API NestJS.

### apps/worker

Worker NestJS con BullMQ.

### apps/optimizer

Microservicio Python con FastAPI y OR-Tools.

### packages/shared

Tipos TypeScript, schemas Zod y contratos compartidos.

### packages/ui

Componentes UI reutilizables.

## 5. Flujo principal

### Crear plan

```text
1. Usuario crea plan desde React.
2. React envía POST /api/v1/plans.
3. NestJS valida datos.
4. NestJS crea RoutePlan con status QUEUED.
5. NestJS encola job en BullMQ.
6. NestJS responde 202 Accepted.
7. Worker toma el job.
8. Worker llama al Optimizer.
9. Optimizer devuelve rutas.
10. Worker guarda rutas y paradas.
11. Worker actualiza KPIs.
12. Worker emite evento WebSocket.
13. React actualiza la UI.
```

### Importar pedidos

```text
1. Usuario sube CSV.
2. React envía POST /api/v1/orders/import.
3. NestJS valida archivo.
4. NestJS crea ImportJob.
5. NestJS encola job.
6. Worker procesa filas.
7. Worker guarda pedidos válidos.
8. Worker registra errores por fila.
9. Worker emite evento WebSocket.
10. React muestra resultado.
```

## 6. Arquitectura de la API

La API NestJS seguirá una arquitectura modular por dominio.

```text
apps/api/src/
├── main.ts
├── app.module.ts
├── config/
├── common/
├── modules/
│   ├── auth/
│   ├── organizations/
│   ├── users/
│   ├── vehicles/
│   ├── drivers/
│   ├── orders/
│   ├── plans/
│   ├── routes/
│   ├── dashboard/
│   └── websocket/
└── prisma/
```

Cada módulo tendrá:

```text
modules/orders/
├── orders.module.ts
├── orders.controller.ts
├── orders.service.ts
├── orders.repository.ts
├── dto/
├── entities/
└── tests/
```

### Responsabilidades

| Capa | Responsabilidad |
|---|---|
| Controller | Recibir HTTP, validar y delegar. |
| Service | Lógica de negocio. |
| Repository | Acceso a Prisma. |
| DTO | Contratos de entrada y salida. |
| Guard | Autenticación y autorización. |
| Pipe | Validación y transformación. |
| Interceptor | Logging y transformación. |
| Filter | Manejo global de errores. |

## 7. Arquitectura del Worker

El worker será un proceso NestJS separado.

```text
apps/worker/src/
├── main.ts
├── app.module.ts
├── queues/
│   ├── optimization/
│   └── import/
├── processors/
│   ├── optimization.processor.ts
│   └── import.processor.ts
└── services/
```

### Colas

| Cola | Job | Responsabilidad |
|---|---|---|
| `optimization` | `optimize-plan` | Optimizar rutas. |
| `optimization` | `reoptimize-plan` | Reoptimizar rutas. |
| `import` | `import-orders` | Procesar CSV. |

### Reglas

- Cada tipo de job tendrá un nombre claro.
- El payload debe ser pequeño: IDs, no objetos completos.
- El worker debe recargar datos desde PostgreSQL.
- Los jobs deben ser idempotentes.
- Debe haber reintentos con backoff.
- Debe haber límite de concurrencia.
- Debe haber manejo de dead-letter.

BullMQ usa Redis para persistir jobs y soporta retries, delays, concurrencia y workers distribuidos. [192][198][199]

## 8. Optimizador

El optimizador será un microservicio Python.

```text
apps/optimizer/
├── app/
│   ├── main.py
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── services/
│   └── solvers/
├── tests/
├── Dockerfile
└── pyproject.toml
```

### Stack

- Python 3.12.
- FastAPI.
- Pydantic.
- Google OR-Tools.
- Uvicorn.
- Docker.

### Responsabilidad

El optimizador recibe:

- Vehículos.
- Pedidos.
- Restricciones.
- Objetivos.

Y devuelve:

- Rutas por vehículo.
- Secuencia de paradas.
- Distancia.
- Duración.
- Carga.
- Pedidos no asignados.
- Métricas.

### Contrato interno

```http
POST /optimize
```

```json
{
  "vehicles": [
    {
      "id": "veh_123",
      "capacityKg": 800,
      "startLocation": {
        "latitude": -34.6037,
        "longitude": -58.3816
      }
    }
  ],
  "orders": [
    {
      "id": "ord_123",
      "location": {
        "latitude": -34.6118,
        "longitude": -58.3960
      },
      "demandKg": 12,
      "priority": "HIGH",
      "timeWindow": {
        "start": "09:00",
        "end": "12:00"
      },
      "serviceMinutes": 10
    }
  ],
  "objectives": {
    "minimizeDistance": true,
    "balanceWorkload": true,
    "respectTimeWindows": true
  }
}
```

### Respuesta

```json
{
  "routes": [
    {
      "vehicleId": "veh_123",
      "stops": ["ord_123", "ord_456"],
      "distanceKm": 38.4,
      "durationMinutes": 92,
      "loadKg": 320
    }
  ],
  "summary": {
    "totalDistanceKm": 112.6,
    "unassignedOrders": 2,
    "onTimeRate": 0.964
  }
}
```

FastAPI permite separar API, lógica de negocio y acceso a datos en capas, y es adecuado para microservicios independientes con documentación automática. [194][202][205]

## 9. Base de datos

PostgreSQL será la base principal.

### Responsabilidades

- Usuarios y organizaciones.
- Vehículos y conductores.
- Pedidos.
- Planes, rutas y paradas.
- Jobs de optimización.
- Jobs de importación.

### Reglas

- Multi-tenancy por `organizationId`.
- Índices por organización.
- Transacciones para operaciones compuestas.
- Soft delete en recursos operativos.
- Historial de planes mediante `previousPlanId`.

## 10. Redis y BullMQ

Redis tendrá dos roles:

1. Cola de jobs.
2. Cache ligero si es necesario.

### Colas

- `optimization`
- `import`

### Configuración

- Concurrencia limitada.
- Reintentos con backoff.
- Timeout por job.
- Dead-letter queue.
- Limpieza de jobs completados.

## 11. Tiempo real

WebSocket se usará para actualizar:

- Estado del plan.
- Progreso de optimización.
- Resultado final.
- Errores.
- Estado de importación.

### Eventos

| Evento | Payload |
|---|---|
| `plan.status` | Estado del plan |
| `plan.progress` | Progreso |
| `plan.completed` | Resultado |
| `plan.failed` | Error |
| `import.status` | Estado de importación |

## 12. Seguridad

### Autenticación

- JWT access token corto.
- Refresh token rotativo.
- Hash de password con bcrypt o argon2.
- Rate limiting.
- Helmet.
- CORS restringido.

### Autorización

- Roles: OWNER, ADMIN, OPERATOR, VIEWER.
- Guards por endpoint.
- Aislamiento por organización.
- Validación estricta de inputs.

### Multi-tenancy

- `organizationId` derivado del token.
- Nunca aceptado desde el cliente.
- Índices que comienzan por `organizationId`.
- Tests negativos para prevenir fugas.

## 13. Observabilidad

### Logging

- Pino.
- Logs estructurados.
- Request ID.
- User ID.
- Organization ID.
- Plan ID.

### Métricas

- Latencia de API.
- Errores por endpoint.
- Duración de optimización.
- Jobs en cola.
- Jobs fallidos.
- Pedidos no asignados.

### Tracing

- OpenTelemetry opcional en fase posterior.

## 14. Testing

| Tipo | Herramienta | Alcance |
|---|---|---|
| Unit | Vitest / Jest | Servicios y lógica |
| Integration | Supertest | Endpoints |
| E2E | Playwright | Flujos completos |
| Contract | OpenAPI | Contratos de API |
| Load | k6 | Optimización y colas |

## 15. CI/CD

### CI

- Lint.
- Typecheck.
- Unit tests.
- Integration tests.
- Build.
- Docker build.

### CD

- Deploy automático a staging.
- Deploy manual a producción.
- Migraciones Prisma antes de deploy.
- Health checks.

## 16. Deploy

### Local

```bash
docker compose up
```

Servicios:

- web
- api
- worker
- optimizer
- postgres
- redis

### Producción

| Servicio | Plataforma sugerida |
|---|---|
| Web | Vercel |
| API | Railway / Fly.io |
| Worker | Railway / Fly.io |
| Optimizer | Railway / Fly.io |
| PostgreSQL | Neon / Supabase |
| Redis | Upstash / Railway |

## 17. Escalabilidad

### Fase inicial

- Un solo instance de API.
- Un solo worker.
- Un solo optimizador.
- PostgreSQL managed.
- Redis managed.

### Fase posterior

- Múltiples instancias de API.
- Múltiples workers.
- Auto-scaling del optimizador.
- Read replicas.
- Cache Redis.
- Particionamiento por fecha si hace falta.

## 18. Decisiones arquitectónicas

### ADR-001 — Usar NestJS

**Decisión:** usar NestJS como framework backend.

**Motivo:** arquitectura modular, TypeScript, DI, testing y ecosistema maduro.

### ADR-002 — Usar Prisma + PostgreSQL

**Decisión:** usar Prisma como ORM y PostgreSQL como base principal.

**Motivo:** tipado fuerte, migraciones y modelado relacional.

### ADR-003 — Usar OR-Tools

**Decisión:** usar Google OR-Tools para optimización.

**Motivo:** soporte robusto para VRP, capacidades, ventanas horarias y restricciones.

### ADR-004 — Usar BullMQ

**Decisión:** usar BullMQ + Redis para jobs asíncronos.

**Motivo:** colas persistentes, reintentos y workers distribuidos.

### ADR-005 — Separar optimizador

**Decisión:** separar el optimizador en un microservicio Python.

**Motivo:** evitar bloquear Node.js y aprovechar OR-Tools.

## 19. Riesgos técnicos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Optimización lenta | Mala UX | Colas y async |
| Jobs duplicados | Datos inconsistentes | Idempotencia |
| Falta de aislamiento | Fuga de datos | Multi-tenancy estricto |
| Complejidad del optimizador | Mantenimiento difícil | Empezar con reglas básicas |
| Falta de observabilidad | Difícil debuggear | Logs y métricas desde el inicio |