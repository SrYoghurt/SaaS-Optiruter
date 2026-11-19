# API Contract — OptiRuter

## 1. Objetivo

Este documento define los endpoints, métodos HTTP, request/response, códigos de error y reglas de autorización de la API de OptiRuter para el MVP.

La API será REST, versionada bajo `/api/v1` y consumida principalmente por el frontend React.

## 2. Convenciones generales

### Base URL

```text
[https://api.optiruter.com/api/v1](https://api.optiruter.com/api/v1)
```

En desarrollo:

```text
http://localhost:3000/api/v1
```

### Autenticación

La API usará JWT con dos tokens:

- Access token: corto, enviado en header `Authorization`.
- Refresh token: usado para renovar sesión.

Header:

```http
Authorization: Bearer <access_token>
```

### Content-Type

```http
Content-Type: application/json
```

Para upload de archivos:

```http
Content-Type: multipart/form-data
```

### Versioning

Se usará versioning por URL:

```text
/api/v1
```

Esto permite evolucionar la API sin romper clientes existentes. NestJS soporta versioning por URI, header o media type; para una API pública y fácil de testear, URI versioning es la opción más directa. [179][185][190]

### Paginación

Los listados usarán paginación offset-based:

```text
?page=1&limit=20
```

Respuesta estándar:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "totalPages": 6
  }
}
```

La paginación y el filtrado por query params reducen payload y mejoran performance en listados grandes. [178][182]

### Filtros

Los filtros se enviarán como query params:

```text
?status=PENDING
?priority=HIGH
?search=pedido
?vehicleId=veh_123
```

### Orden

```text
?sortBy=createdAt
&sortOrder=desc
```

## 3. Formato de respuesta

### Respuesta exitosa

```json
{
  "success": true,
  "data": {}
}
```

### Respuesta con paginación

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "totalPages": 6
  }
}
```

### Respuesta de error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos enviados no son válidos.",
    "details": [
      {
        "field": "email",
        "message": "El email no es válido."
      }
    ]
  }
}
```

Un formato de error consistente, con código legible por máquina y mensaje humano, facilita el manejo de errores en el cliente. [180][182][191]

## 4. Códigos HTTP

| Código | Uso |
|---|---|
| 200 | OK |
| 201 | Recurso creado |
| 202 | Aceptado para procesamiento asíncrono |
| 204 | Sin contenido |
| 400 | Request inválido |
| 401 | No autenticado |
| 403 | Sin permisos |
| 404 | Recurso no encontrado |
| 409 | Conflicto |
| 422 | Validación semántica |
| 429 | Rate limit |
| 500 | Error interno |

Los códigos HTTP deben usarse de forma consistente: 201 para creación, 202 para procesamiento asíncrono, 401 para falta de autenticación, 403 para falta de autorización y 404 para recursos inexistentes. [189][190]

## 5. Códigos de error

| Código | HTTP | Descripción |
|---|---|---|
| VALIDATION_ERROR | 400 | Datos inválidos |
| UNAUTHENTICATED | 401 | Token ausente o inválido |
| FORBIDDEN | 403 | Sin permisos |
| NOT_FOUND | 404 | Recurso inexistente |
| CONFLICT | 409 | Conflicto de estado |
| RATE_LIMITED | 429 | Demasiadas requests |
| INTERNAL_ERROR | 500 | Error interno |
| OPTIMIZATION_FAILED | 500 | Falló la optimización |
| CSV_IMPORT_FAILED | 422 | Falló la importación |

## 6. Auth

### POST /auth/register

**Descripción:** registra un usuario y crea su organización.

**Request:**

```json
{
  "name": "Martín Ferreyra",
  "email": "martin@example.com",
  "password": "StrongPassword123",
  "organizationName": "Distribuidora Andes"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123",
      "name": "Martín Ferreyra",
      "email": "martin@example.com",
      "role": "OWNER"
    },
    "organization": {
      "id": "org_123",
      "name": "Distribuidora Andes"
    },
    "accessToken": "jwt...",
    "refreshToken": "jwt..."
  }
}
```

**Errores:**

- 400 `VALIDATION_ERROR`
- 409 `CONFLICT`

### POST /auth/login

**Request:**

```json
{
  "email": "martin@example.com",
  "password": "StrongPassword123"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123",
      "email": "martin@example.com"
    },
    "accessToken": "jwt...",
    "refreshToken": "jwt..."
  }
}
```

**Errores:**

- 401 `UNAUTHENTICATED`

### POST /auth/refresh

**Request:**

```json
{
  "refreshToken": "jwt..."
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt...",
    "refreshToken": "jwt..."
  }
}
```

**Errores:**

- 401 `UNAUTHENTICATED`

### POST /auth/logout

**Request:**

```json
{
  "refreshToken": "jwt..."
}
```

**Response 204:**

```text
No Content
```

## 7. Organizations

### GET /organizations/me

**Descripción:** devuelve la organización del usuario autenticado.

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "org_123",
    "name": "Distribuidora Andes",
    "slug": "distribuidora-andes",
    "createdAt": "2026-11-13T00:00:00.000Z"
  }
}
```

### PATCH /organizations/me

**Request:**

```json
{
  "name": "Distribuidora Andes SA"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "org_123",
    "name": "Distribuidora Andes SA"
  }
}
```

**Errores:**

- 403 `FORBIDDEN`

## 8. Vehicles

### GET /vehicles

**Query params:**

```text
?page=1
&limit=20
&status=ACTIVE
&search=AB123
```

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "veh_123",
      "plate": "AB123CD",
      "type": "VAN",
      "capacityKg": 800,
      "capacityVolumeM3": 12,
      "status": "ACTIVE",
      "startLatitude": -34.6037,
      "startLongitude": -58.3816
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

### POST /vehicles

**Request:**

```json
{
  "plate": "AB123CD",
  "type": "VAN",
  "capacityKg": 800,
  "capacityVolumeM3": 12,
  "startLatitude": -34.6037,
  "startLongitude": -58.3816,
  "endLatitude": -34.6037,
  "endLongitude": -58.3816,
  "status": "ACTIVE"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "veh_123",
    "plate": "AB123CD",
    "status": "ACTIVE"
  }
}
```

**Errores:**

- 400 `VALIDATION_ERROR`
- 409 `CONFLICT`

### GET /vehicles/:id

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "veh_123",
    "plate": "AB123CD",
    "type": "VAN",
    "capacityKg": 800,
    "status": "ACTIVE"
  }
}
```

**Errores:**

- 404 `NOT_FOUND`
- 403 `FORBIDDEN`

### PATCH /vehicles/:id

**Request:**

```json
{
  "capacityKg": 900,
  "status": "INACTIVE"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "veh_123",
    "capacityKg": 900,
    "status": "INACTIVE"
  }
}
```

### DELETE /vehicles/:id

**Response 204:**

```text
No Content
```

**Errores:**

- 404 `NOT_FOUND`
- 409 `CONFLICT`

## 9. Drivers

### GET /drivers

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "drv_123",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+5491100000000",
      "shiftStart": "2026-11-13T08:00:00.000Z",
      "shiftEnd": "2026-11-13T18:00:00.000Z",
      "vehicleId": "veh_123",
      "status": "ACTIVE"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

### POST /drivers

**Request:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+5491100000000",
  "shiftStart": "2026-11-13T08:00:00.000Z",
  "shiftEnd": "2026-11-13T18:00:00.000Z",
  "vehicleId": "veh_123"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "drv_123",
    "name": "Juan Pérez",
    "vehicleId": "veh_123"
  }
}
```

**Errores:**

- 400 `VALIDATION_ERROR`
- 409 `CONFLICT`

### PATCH /drivers/:id

**Request:**

```json
{
  "vehicleId": "veh_456"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "drv_123",
    "vehicleId": "veh_456"
  }
}
```

### DELETE /drivers/:id

**Response 204:**

```text
No Content
```

## 10. Orders

### GET /orders

**Query params:**

```text
?page=1
&limit=20
&status=PENDING
&priority=HIGH
&search=Av. Siempre Viva
```

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "ord_123",
      "externalCode": "PED-001",
      "address": "Av. Siempre Viva 742",
      "latitude": -34.6037,
      "longitude": -58.3816,
      "weightKg": 12,
      "volumeM3": 0.5,
      "priority": "HIGH",
      "timeWindowStart": "2026-11-13T09:00:00.000Z",
      "timeWindowEnd": "2026-11-13T12:00:00.000Z",
      "serviceMinutes": 10,
      "status": "PENDING"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 180,
    "totalPages": 9
  }
}
```

### POST /orders

**Request:**

```json
{
  "externalCode": "PED-001",
  "address": "Av. Siempre Viva 742",
  "latitude": -34.6037,
  "longitude": -58.3816,
  "weightKg": 12,
  "volumeM3": 0.5,
  "priority": "HIGH",
  "timeWindowStart": "2026-11-13T09:00:00.000Z",
  "timeWindowEnd": "2026-11-13T12:00:00.000Z",
  "serviceMinutes": 10
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "ord_123",
    "status": "PENDING"
  }
}
```

**Errores:**

- 400 `VALIDATION_ERROR`

### PATCH /orders/:id

**Request:**

```json
{
  "priority": "URGENT",
  "weightKg": 15
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "ord_123",
    "priority": "URGENT",
    "weightKg": 15
  }
}
```

### DELETE /orders/:id

**Response 204:**

```text
No Content
```

### POST /orders/import

**Content-Type:**

```http
multipart/form-data
```

**Request:**

```text
file: pedidos.csv
```

**Response 202:**

```json
{
  "success": true,
  "data": {
    "id": "imp_123",
    "status": "QUEUED"
  }
}
```

**Errores:**

- 400 `VALIDATION_ERROR`
- 422 `CSV_IMPORT_FAILED`

### GET /orders/import/:id

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "imp_123",
    "status": "COMPLETED",
    "totalRows": 120,
    "importedRows": 118,
    "failedRows": 2,
    "errors": [
      {
        "row": 14,
        "message": "Coordenadas inválidas"
      }
    ]
  }
}
```

## 11. Plans

### POST /plans

**Descripción:** crea un plan y encola la optimización.

**Request:**

```json
{
  "name": "Plan 13/11",
  "operationDate": "2026-11-13",
  "vehicleIds": ["veh_123", "veh_456"],
  "orderIds": ["ord_123", "ord_456"],
  "constraints": {
    "respectTimeWindows": true,
    "balanceWorkload": true,
    "minimizeDistance": true
  }
}
```

**Response 202:**

```json
{
  "success": true,
  "data": {
    "id": "plan_123",
    "status": "QUEUED"
  }
}
```

**Errores:**

- 400 `VALIDATION_ERROR`
- 409 `CONFLICT`

### GET /plans

**Query params:**

```text
?page=1
&limit=20
&status=READY
&operationDate=2026-11-13
```

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "plan_123",
      "name": "Plan 13/11",
      "operationDate": "2026-11-13",
      "status": "READY",
      "totalDistanceKm": 112.6,
      "totalDurationMinutes": 420,
      "assignedOrdersCount": 180,
      "unassignedOrdersCount": 2
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

### GET /plans/:id

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "plan_123",
    "name": "Plan 13/11",
    "operationDate": "2026-11-13",
    "status": "READY",
    "totalDistanceKm": 112.6,
    "totalDurationMinutes": 420,
    "assignedOrdersCount": 180,
    "unassignedOrdersCount": 2,
    "routes": [
      {
        "id": "route_123",
        "vehicleId": "veh_123",
        "sequence": 1,
        "distanceKm": 38.4,
        "durationMinutes": 92,
        "loadKg": 320,
        "stops": [
          {
            "id": "stop_123",
            "orderId": "ord_123",
            "sequence": 1,
            "eta": "2026-11-13T09:35:00.000Z",
            "status": "PENDING"
          }
        ]
      }
    ]
  }
}
```

**Errores:**

- 404 `NOT_FOUND`
- 403 `FORBIDDEN`

### POST /plans/:id/reoptimize

**Request:**

```json
{
  "reason": "NEW_ORDERS",
  "orderIds": ["ord_789"]
}
```

**Response 202:**

```json
{
  "success": true,
  "data": {
    "id": "plan_456",
    "previousPlanId": "plan_123",
    "status": "QUEUED"
  }
}
```

**Errores:**

- 404 `NOT_FOUND`
- 409 `CONFLICT`

## 12. Dashboard

### GET /dashboard/kpis

**Response 200:**

```json
{
  "success": true,
  "data": {
    "activeVehicles": 18,
    "pendingOrders": 214,
    "plansToday": 3,
    "totalDistanceKm": 1126.4,
    "onTimeRate": 0.964,
    "unassignedOrders": 6
  }
}
```

## 13. WebSocket

### Conexión

```text
ws://localhost:3000/ws/plans/:planId
```

### Eventos

| Evento | Payload |
|---|---|
| `plan.status` | Estado del plan |
| `plan.progress` | Progreso de optimización |
| `plan.completed` | Resultado final |
| `plan.failed` | Error |

### Ejemplo

```json
{
  "event": "plan.status",
  "data": {
    "planId": "plan_123",
    "status": "OPTIMIZING"
  }
}
```

## 14. Reglas de autorización

- Todo endpoint protegido requiere access token.
- El `organizationId` se deriva del token, nunca del request.
- Un usuario solo puede acceder a recursos de su organización.
- Un usuario `OWNER` o `ADMIN` puede gestionar vehículos, conductores y organización.
- Un usuario `OPERATOR` puede gestionar pedidos y planes.
- Un usuario `VIEWER` solo puede consultar.

## 15. Reglas de seguridad

- Validar todos los inputs.
- Nunca confiar en IDs enviados por el cliente.
- Usar rate limiting.
- Usar Helmet.
- Restringir CORS.
- No exponer errores internos.
- No devolver `passwordHash`.
- No devolver tokens en logs.
- Usar refresh token rotativo.
- Usar HTTPS en producción.

## 16. OpenAPI

La API debe documentarse con Swagger/OpenAPI.

Cada endpoint debe documentar:

- Método.
- Path.
- Descripción.
- Auth.
- Request body.
- Response body.
- Errores.
- Ejemplos.

OpenAPI requiere documentar al menos una respuesta por operación, y recomienda documentar también los errores, no solo el happy path. [177][183][184]