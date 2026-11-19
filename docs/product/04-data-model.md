# Data Model — OptiRuter

## 1. Objetivo

Este documento define las entidades, relaciones, enums, índices y reglas de integridad del MVP de OptiRuter.

El modelo debe permitir:

- Aislar datos por organización.
- Gestionar vehículos, conductores y pedidos.
- Crear planes de rutas.
- Guardar rutas y paradas generadas por el optimizador.
- Mantener historial de planes y reoptimizaciones.
- Consultar KPIs operativos.

## 2. Principios de diseño

- Cada recurso operativo pertenece a una organización.
- Toda tabla de negocio incluye `organizationId`.
- Las relaciones usan claves foráneas explícitas.
- Los estados se modelan con enums.
- Los índices priorizan consultas por organización.
- No se eliminan físicamente registros críticos; se usa soft delete cuando corresponda.
- El modelo evita dependencias circulares innecesarias.
- Los IDs son strings tipo CUID generados por la aplicación.

## 3. Entidades principales

| Entidad | Descripción |
|---|---|
| Organization | Empresa u operación que usa OptiRuter. |
| User | Persona que accede a la plataforma. |
| Vehicle | Vehículo disponible para rutas. |
| Driver | Persona que conduce un vehículo. |
| Order | Entrega, visita o tarea a realizar. |
| RoutePlan | Plan de rutas generado para una fecha. |
| Route | Ruta asignada a un vehículo dentro de un plan. |
| Stop | Parada dentro de una ruta. |
| OptimizationJob | Trabajo asíncrono de optimización. |
| ImportJob | Importación de pedidos por CSV. |

## 4. Relaciones

```text
Organization 1 ── N User
Organization 1 ── N Vehicle
Organization 1 ── N Driver
Organization 1 ── N Order
Organization 1 ── N RoutePlan
Organization 1 ── N OptimizationJob
Organization 1 ── N ImportJob

Vehicle 1 ── 0..1 Driver
Vehicle 1 ── N Route
Driver 1 ── N Route
Order 1 ── N Stop
RoutePlan 1 ── N Route
RoutePlan 1 ── N OptimizationJob
Route 1 ── N Stop
```


## 5. Enums

### UserRole

```text
OWNER
ADMIN
OPERATOR
VIEWER
```

### VehicleStatus

```text
ACTIVE
INACTIVE
MAINTENANCE
```

### VehicleType

```text
MOTORCYCLE
CAR
VAN
TRUCK
```

### OrderPriority

```text
LOW
NORMAL
HIGH
URGENT
```

### OrderStatus

```text
PENDING
ASSIGNED
IN_PROGRESS
COMPLETED
FAILED
CANCELLED
```

### PlanStatus

```text
QUEUED
OPTIMIZING
READY
FAILED
CANCELLED
```

### StopStatus

```text
PENDING
ARRIVED
COMPLETED
FAILED
SKIPPED
```

### JobStatus

```text
QUEUED
PROCESSING
COMPLETED
FAILED
```


## 6. Modelo de datos

### Organization

| Campo | Tipo | Reglas |
|---|---|---|
| id | String | PK, CUID |
| name | String | Requerido |
| slug | String | Único, generado |
| createdAt | DateTime | Automático |
| updatedAt | DateTime | Automático |

**Reglas:**
- Una organización puede tener muchos usuarios.
- Una organización puede tener muchos vehículos, conductores y pedidos.
- No se permite eliminar una organización con datos activos sin confirmación explícita.

### User

| Campo | Tipo | Reglas |
|---|---|---|
| id | String | PK |
| email | String | Único global |
| passwordHash | String | Nunca se expone |
| name | String | Requerido |
| role | UserRole | Default `OPERATOR` |
| organizationId | String | FK |
| createdAt | DateTime | Automático |
| updatedAt | DateTime | Automático |

**Relaciones:**
- Pertenece a una organización.
- Puede tener muchos tokens de sesión.

**Reglas:**
- El email es único a nivel global.
- La contraseña se almacena hasheada.
- El rol define permisos dentro de la organización.

### Vehicle

| Campo | Tipo | Reglas |
|---|---|---|
| id | String | PK |
| organizationId | String | FK |
| plate | String | Requerido |
| type | VehicleType | Requerido |
| capacityKg | Float | Mayor o igual a 0 |
| capacityVolumeM3 | Float? | Opcional |
| startLatitude | Float | Requerido |
| startLongitude | Float | Requerido |
| endLatitude | Float? | Opcional |
| endLongitude | Float? | Opcional |
| status | VehicleStatus | Default `ACTIVE` |
| createdAt | DateTime | Automático |
| updatedAt | DateTime | Automático |

**Relaciones:**
- Pertenece a una organización.
- Puede tener un conductor asignado.
- Puede tener muchas rutas.

**Índices:**
- `organizationId`
- `organizationId + status`
- `organizationId + plate`

### Driver

| Campo | Tipo | Reglas |
|---|---|---|
| id | String | PK |
| organizationId | String | FK |
| name | String | Requerido |
| email | String? | Opcional |
| phone | String? | Opcional |
| shiftStart | DateTime | Requerido |
| shiftEnd | DateTime | Requerido |
| vehicleId | String? | FK única |
| status | DriverStatus | Default `ACTIVE` |
| createdAt | DateTime | Automático |
| updatedAt | DateTime | Automático |

**Relaciones:**
- Pertenece a una organización.
- Puede tener un vehículo asignado.
- Puede tener muchas rutas.

**Reglas:**
- Un conductor puede tener solo un vehículo asignado.
- El turno final debe ser posterior al turno inicial.

### Order

| Campo | Tipo | Reglas |
|---|---|---|
| id | String | PK |
| organizationId | String | FK |
| externalCode | String? | Opcional |
| address | String | Requerido |
| latitude | Float | Requerido |
| longitude | Float | Requerido |
| weightKg | Float | Mayor o igual a 0 |
| volumeM3 | Float? | Opcional |
| priority | OrderPriority | Default `NORMAL` |
| timeWindowStart | DateTime? | Opcional |
| timeWindowEnd | DateTime? | Opcional |
| serviceMinutes | Int | Default 5 |
| status | OrderStatus | Default `PENDING` |
| createdAt | DateTime | Automático |
| updatedAt | DateTime | Automático |

**Relaciones:**
- Pertenece a una organización.
- Puede tener muchas paradas.

**Índices:**
- `organizationId`
- `organizationId + status`
- `organizationId + priority`
- `organizationId + createdAt`

**Reglas:**
- Si existe ventana horaria, `timeWindowEnd` debe ser posterior a `timeWindowStart`.
- Un pedido solo puede estar asignado a una parada activa.
- Un pedido no puede pertenecer a otra organización.

### RoutePlan

| Campo | Tipo | Reglas |
|---|---|---|
| id | String | PK |
| organizationId | String | FK |
| name | String? | Opcional |
| operationDate | DateTime | Requerido |
| status | PlanStatus | Default `QUEUED` |
| previousPlanId | String? | FK opcional |
| totalDistanceKm | Float? | Calculado |
| totalDurationMinutes | Int? | Calculado |
| assignedOrdersCount | Int? | Calculado |
| unassignedOrdersCount | Int? | Calculado |
| createdAt | DateTime | Automático |
| updatedAt | DateTime | Automático |

**Relaciones:**
- Pertenece a una organización.
- Puede tener muchas rutas.
- Puede tener muchos jobs de optimización.
- Puede referenciar un plan anterior.

**Índices:**
- `organizationId`
- `organizationId + status`
- `organizationId + operationDate`
- `organizationId + createdAt`

**Reglas:**
- Un plan pertenece a una sola organización.
- Una reoptimización crea un nuevo plan.
- El plan anterior queda como historial.
- Las métricas se calculan después de la optimización.

### Route

| Campo | Tipo | Reglas |
|---|---|---|
| id | String | PK |
| organizationId | String | FK |
| planId | String | FK |
| vehicleId | String | FK |
| driverId | String? | FK opcional |
| sequence | Int | Requerido |
| distanceKm | Float | Mayor o igual a 0 |
| durationMinutes | Int | Mayor o igual a 0 |
| loadKg | Float | Mayor o igual a 0 |
| loadVolumeM3 | Float? | Opcional |
| createdAt | DateTime | Automático |
| updatedAt | DateTime | Automático |

**Relaciones:**
- Pertenece a un plan.
- Pertenece a un vehículo.
- Puede tener muchas paradas.

**Índices:**
- `planId`
- `vehicleId`
- `organizationId + planId`
- `planId + sequence`

**Reglas:**
- Una ruta pertenece a un solo plan.
- Una ruta pertenece a un solo vehículo.
- La secuencia debe ser única dentro del plan.

### Stop

| Campo | Tipo | Reglas |
|---|---|---|
| id | String | PK |
| organizationId | String | FK |
| routeId | String | FK |
| orderId | String | FK |
| sequence | Int | Requerido |
| eta | DateTime? | Calculado |
| status | StopStatus | Default `PENDING` |
| createdAt | DateTime | Automático |
| updatedAt | DateTime | Automático |

**Relaciones:**
- Pertenece a una ruta.
- Referencia un pedido.

**Índices:**
- `routeId`
- `orderId`
- `routeId + sequence`
- `organizationId + routeId`

**Reglas:**
- Una parada pertenece a una sola ruta.
- Un pedido puede aparecer una sola vez por plan.
- La secuencia debe ser única dentro de la ruta.

### OptimizationJob

| Campo | Tipo | Reglas |
|---|---|---|
| id | String | PK |
| organizationId | String | FK |
| planId | String | FK |
| status | JobStatus | Default `QUEUED` |
| startedAt | DateTime? | Opcional |
| finishedAt | DateTime? | Opcional |
| error | String? | Opcional |
| result | Json? | Resultado del optimizador |
| createdAt | DateTime | Automático |
| updatedAt | DateTime | Automático |

**Relaciones:**
- Pertenece a un plan.
- Pertenece a una organización.

**Índices:**
- `planId`
- `status`
- `organizationId + planId`

**Reglas:**
- Un plan puede tener varios jobs por reoptimizaciones.
- El resultado se guarda en JSON.
- Si falla, se guarda el motivo.

### ImportJob

| Campo | Tipo | Reglas |
|---|---|---|
| id | String | PK |
| organizationId | String | FK |
| fileName | String | Requerido |
| status | JobStatus | Default `QUEUED` |
| totalRows | Int | Default 0 |
| importedRows | Int | Default 0 |
| failedRows | Int | Default 0 |
| errors | Json? | Detalle de errores |
| createdAt | DateTime | Automático |
| updatedAt | DateTime | Automático |

**Relaciones:**
- Pertenece a una organización.

**Índices:**
- `organizationId`
- `status`
- `organizationId + createdAt`

## 7. Reglas de integridad

### Integridad referencial

- Un usuario debe pertenecer a una organización válida.
- Un vehículo debe pertenecer a una organización válida.
- Un conductor debe pertenecer a una organización válida.
- Un pedido debe pertenecer a una organización válida.
- Un plan debe pertenecer a una organización válida.
- Una ruta debe pertenecer a un plan válido.
- Una parada debe pertenecer a una ruta válida.
- Una parada debe referenciar un pedido válido.

### Integridad de negocio

- Un pedido no puede estar asignado a dos rutas activas.
- Un vehículo no puede tener dos conductores activos.
- Un conductor no puede estar asignado a dos vehículos activos.
- Una ruta no puede tener dos paradas con la misma secuencia.
- Un plan no puede tener dos rutas con la misma secuencia.
- La capacidad utilizada no puede superar la capacidad del vehículo.
- Un pedido con ventana horaria debe tener inicio y fin válidos.

### Integridad multi-tenant

- Toda consulta debe filtrar por `organizationId`.
- Ningún endpoint debe aceptar `organizationId` desde el cliente.
- El `organizationId` debe derivarse del token JWT.
- Los índices deben comenzar por `organizationId`.
- Se deben escribir tests negativos para prevenir fugas entre organizaciones.

## 8. Índices recomendados

| Tabla | Índice | Motivo |
|---|---|---|
| User | `email` | Login y unicidad |
| Vehicle | `organizationId, status` | Listar vehículos disponibles |
| Vehicle | `organizationId, plate` | Búsqueda por patente |
| Driver | `organizationId, status` | Listar conductores activos |
| Order | `organizationId, status` | Listar pedidos pendientes |
| Order | `organizationId, priority` | Filtrar por prioridad |
| RoutePlan | `organizationId, status` | Listar planes activos |
| RoutePlan | `organizationId, operationDate` | Planes por fecha |
| Route | `planId` | Rutas de un plan |
| Route | `planId, sequence` | Orden de rutas |
| Stop | `routeId, sequence` | Orden de paradas |
| Stop | `orderId` | Historial de un pedido |
| OptimizationJob | `planId, status` | Estado de optimización |


## 9. Soft delete

Para el MVP:

- `User`: soft delete.
- `Vehicle`: soft delete.
- `Driver`: soft delete.
- `Order`: soft delete.
- `RoutePlan`: no se elimina; se cancela.
- `Route`: no se elimina; pertenece al historial del plan.
- `Stop`: no se elimina; pertenece al historial del plan.

Campos adicionales:

```text
deletedAt DateTime?
```

## 10. Consideraciones de performance

- Usar paginación en todos los listados.
- Evitar consultas N+1.
- Usar `select` para traer solo campos necesarios.
- Usar transacciones para operaciones compuestas.
- Guardar resultados de optimización en JSON.
- No calcular rutas dentro del request HTTP.
- Usar colas para trabajos pesados.
- Indexar consultas frecuentes.
- Limitar tamaño de importaciones CSV en el MVP.

## 11. Prisma schema inicial

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users           User[]
  vehicles        Vehicle[]
  drivers         Driver[]
  orders          Order[]
  routePlans      RoutePlan[]
  optimizationJobs OptimizationJob[]
  importJobs      ImportJob[]
}

model User {
  id             String   @id @default(cuid())
  email          String   @unique
  passwordHash   String
  name           String
  role           UserRole @default(OPERATOR)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId])
}

model Vehicle {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  plate          String
  type           VehicleType
  capacityKg     Float
  capacityVolumeM3 Float?
  startLatitude  Float
  startLongitude Float
  endLatitude    Float?
  endLongitude   Float?
  status         VehicleStatus @default(ACTIVE)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  driver Driver?
  routes Route[]

  @@unique([organizationId, plate])
  @@index([organizationId, status])
}

model Driver {
  id             String   @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  name           String
  email          String?
  phone          String?
  shiftStart     DateTime
  shiftEnd       DateTime
  vehicleId      String?  @unique
  vehicle        Vehicle? @relation(fields: [vehicleId], references: [id])
  status         DriverStatus @default(ACTIVE)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  routes Route[]

  @@index([organizationId, status])
}

model Order {
  id             String   @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  externalCode   String?
  address        String
  latitude       Float
  longitude      Float
  weightKg       Float
  volumeM3       Float?
  priority       OrderPriority @default(NORMAL)
  timeWindowStart DateTime?
  timeWindowEnd   DateTime?
  serviceMinutes Int @default(5)
  status         OrderStatus @default(PENDING)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  stops Stop[]

  @@index([organizationId, status])
  @@index([organizationId, priority])
}

model RoutePlan {
  id             String   @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  name           String?
  operationDate  DateTime
  status         PlanStatus @default(QUEUED)
  previousPlanId String? @unique
  previousPlan   RoutePlan? @relation("PlanHistory", fields: [previousPlanId], references: [id])
  nextPlans      RoutePlan[] @relation("PlanHistory")
  totalDistanceKm Float?
  totalDurationMinutes Int?
  assignedOrdersCount Int?
  unassignedOrdersCount Int?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  routes Route[]
  optimizationJobs OptimizationJob[]

  @@index([organizationId, status])
  @@index([organizationId, operationDate])
}

model Route {
  id             String @id @default(cuid())
  organizationId String
  planId         String
  plan           RoutePlan @relation(fields: [planId], references: [id])
  vehicleId      String
  vehicle        Vehicle @relation(fields: [vehicleId], references: [id])
  driverId       String?
  driver         Driver? @relation(fields: [driverId], references: [id])
  sequence       Int
  distanceKm     Float
  durationMinutes Int
  loadKg         Float
  loadVolumeM3   Float?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  stops Stop[]

  @@unique([planId, sequence])
  @@index([planId])
  @@index([vehicleId])
}

model Stop {
  id             String @id @default(cuid())
  organizationId String
  routeId        String
  route          Route @relation(fields: [routeId], references: [id])
  orderId        String
  order          Order @relation(fields: [orderId], references: [id])
  sequence       Int
  eta            DateTime?
  status         StopStatus @default(PENDING)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([routeId, sequence])
  @@index([routeId])
  @@index([orderId])
}

model OptimizationJob {
  id             String @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  planId         String
  plan           RoutePlan @relation(fields: [planId], references: [id])
  status         JobStatus @default(QUEUED)
  startedAt      DateTime?
  finishedAt     DateTime?
  error          String?
  result         Json?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([planId, status])
}

model ImportJob {
  id             String @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  fileName       String
  status         JobStatus @default(QUEUED)
  totalRows      Int @default(0)
  importedRows   Int @default(0)
  failedRows     Int @default(0)
  errors         Json?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([organizationId, status])
}

enum UserRole {
  OWNER
  ADMIN
  OPERATOR
  VIEWER
}

enum VehicleStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
}

enum VehicleType {
  MOTORCYCLE
  CAR
  VAN
  TRUCK
}

enum DriverStatus {
  ACTIVE
  INACTIVE
}

enum OrderPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum OrderStatus {
  PENDING
  ASSIGNED
  IN_PROGRESS
  COMPLETED
  FAILED
  CANCELLED
}

enum PlanStatus {
  QUEUED
  OPTIMIZING
  READY
  FAILED
  CANCELLED
}

enum StopStatus {
  PENDING
  ARRIVED
  COMPLETED
  FAILED
  SKIPPED
}

enum JobStatus {
  QUEUED
  PROCESSING
  COMPLETED
  FAILED
}
```

## 12. Notas importantes

- Este esquema es una base, no una versión final cerrada.
- Puede evolucionar cuando agreguemos integraciones, tracking o facturación.
- La optimización no debe modificar pedidos directamente; debe crear rutas y paradas.
- Los KPIs deben calcularse al finalizar la optimización.
- El historial de reoptimizaciones se mantiene mediante `previousPlanId`.
- La seguridad multi-tenant debe probarse con tests negativos.