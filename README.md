# OptiRuter 🚚📍

> **SaaS B2B de optimización y planificación inteligente de rutas para flotas de última milla.**  
> *"Menos kilómetros. Más entregas a tiempo."*

---

## 📌 Resumen Ejecutivo

**OptiRuter** es una plataforma SaaS diseñada para empresas de delivery urbano, distribuidoras mayoristas, empresas de servicios técnicos y e-commerce con logística propia. 

Permite transformar listas de pedidos dispersos en planes de rutas operativos y eficientes, asignados de forma óptima a vehículos y conductores en cuestión de segundos, respetando restricciones operativas como:
- Ventanas horarias de entrega.
- Capacidad máxima de carga por vehículo (peso y volumen).
- Prioridad de cada pedido.
- Tiempos de servicio por parada.
- Turnos y disponibilidad de conductores.
- Puntos de salida y retorno de cada vehículo.

---

## 🎯 El Problema que Resolvemos

Las flotas de última milla suelen coordinar su logística mediante planillas de cálculo, grupos de mensajería y mapas estáticos, lo cual genera:
- **Tiempos excesivos de planificación manual:** horas invertidas por el operador logístico armando secuencias a ojo.
- **Rutas ineficientes y sobrecostos:** mayor kilometraje recorrido y mayor gasto de combustible.
- **Incumplimientos de entrega:** pedidos fuera de ventana horaria y clientes insatisfechos.
- **Rigidez operativa:** imposibilidad de reaccionar rápidamente ante imprevistos (cambios de pedidos, fallas mecánicas).
- **Falta de métricas y visibilidad:** sin conocimiento claro de distancias totales, capacidades o pedidos no asignados.

**OptiRuter** automatiza y optimiza esta toma de decisiones con un motor de resolución matemática robusto, ofreciendo visibilidad operativa de extremo a extremo.

---

## ✨ Características Principales (MVP Scope)

- 🏢 **Multi-tenancy y Seguridad:** Aislamiento estricto de datos por organización (`organizationId`), autenticación segura mediante JWT y refresh tokens con control de acceso basado en roles (RBAC).
- 🚚 **Gestión Integral de Flota:** Administración de vehículos (capacidades de peso/volumen, depósitos de salida y llegada) y conductores (turnos de disponibilidad y asignaciones).
- 📦 **Gestión y Carga Masiva de Pedidos:** Alta manual o importación masiva vía archivos **CSV** con validación y reporte de errores fila por fila.
- ⚡ **Motor de Optimización Asíncrono:** Integración con **Google OR-Tools** (FastAPI) para resolver problemas complejos de ruteo de vehículos (VRP/VRPTW). La optimización se encola en segundo plano mediante **Redis + BullMQ**, evitando bloqueos en la API.
- 🗺️ **Visualización Interactiva en Mapa:** Trazado de recorridos por vehículo, orden secuencial de paradas y panel lateral con información detallada de cada punto.
- 📊 **KPIs y Métricas de Rendimiento:** Resumen inmediato de kilómetros totales, duración estimada, tasa de pedidos asignados vs. no asignados y porcentaje de utilización de flota.
- 🔄 **Reoptimización Dinámica:** Capacidad de reajustar planes ante cambios de último momento (ingreso de pedidos prioritarios, bajas de vehículos) manteniendo el historial de versiones.
- ⏱️ **Actualizaciones en Tiempo Real:** Comunicación bidireccional vía **WebSockets** para reflejar el progreso del plan (`QUEUED` → `OPTIMIZING` → `READY` / `FAILED`) sin recargar la página.

---

## 🏗️ Arquitectura del Sistema

La solución está estructurada como un **monorepo modular** que desacopla la API transaccional, el procesamiento asíncrono y el cálculo matemático intensivo:

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (React Web)                 │
│         Vite + TypeScript + Tailwind CSS / UI          │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / WebSocket
                            ▼
┌────────────────────────────────────────────────────────┐
│                    API Gateway (NestJS)                │
│    Auth, CRUD, Validación, Multi-tenancy, Guards       │
└─────────────┬──────────────────────────┬───────────────┘
              │                          │ Encola jobs
              ▼                          ▼
     ┌─────────────────┐       ┌─────────────────┐
     │   PostgreSQL    │       │  Redis / BullMQ │
     │  (Prisma ORM)   │       └────────┬────────┘
     └─────────────────┘                │
                                        ▼
                               ┌─────────────────┐
                               │  Worker (NestJS)│
                               └────────┬────────┘
                                        │ HTTP (POST /optimize)
                                        ▼
                               ┌─────────────────┐
                               │ Optimizer Engine│
                               │ Python+OR-Tools │
                               └─────────────────┘
```

### Componentes del Monorepo

| Aplicación / Paquete | Directorio | Stack Tecnológico | Responsabilidad |
|---|---|---|---|
| **Web** | `apps/web` | React 19, TypeScript, Vite | Dashboard de operador, visualización de mapas y landing pública. |
| **API** | `apps/api` | NestJS 11, Express, Prisma | Autenticación, multi-tenancy, gestión operativa y webhooks/sockets. |
| **Worker** | `apps/worker` | NestJS 11, BullMQ | Consumidor de colas para importación de CSVs y despacho de optimizaciones. |
| **Optimizer** | `apps/optimizer` | Python 3.12, FastAPI, Google OR-Tools | Microservicio matemático dedicado a resolver los modelos VRP. |

---

## 📂 Estructura del Repositorio

```text
SaaS-Optiruter/
├── apps/
│   ├── api/            # Backend REST API en NestJS
│   ├── optimizer/      # Microservicio de optimización en Python FastAPI
│   ├── web/            # Frontend SPA en React + Vite
│   └── worker/         # Procesador en segundo plano con BullMQ
├── docs/
│   └── product/        # Documentación funcional, técnica y de arquitectura
├── docker-compose.yml  # Servicios de soporte local (PostgreSQL 16, Redis 7)
├── package.json        # Configuración raíz de scripts y workspaces
├── pnpm-workspace.yaml # Definición de workspaces PNPM
├── turbo.json          # Orquestación de pipelines con Turborepo
└── .env.example        # Variables de entorno requeridas
```

---

## 🚀 Puesta en Marcha Local

### Prerrequisitos

- **Node.js** >= 20.x
- **pnpm** >= 9.x (o compatible con v12+)
- **Python** >= 3.12 (para el microservicio optimizer)
- **Docker** y **Docker Compose**

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <url-del-repositorio>
cd SaaS-Optiruter
pnpm install
```

### 2. Configurar variables de entorno

Copia la plantilla de entorno:

```bash
cp .env.example .env
```

### 3. Levantar servicios de infraestructura (PostgreSQL y Redis)

```bash
pnpm docker:up
# o bien: docker compose up -d
```

### 4. Ejecutar el entorno de desarrollo

Inicia todas las aplicaciones simultáneamente con Turborepo:

```bash
pnpm dev
```

---

## 🌐 URLs y Servicios en Desarrollo

| Servicio | URL Local | Descripción |
|---|---|---|
| **Web App** | [http://localhost:5173](http://localhost:5173) | Frontend React (Vite) |
| **API REST** | [http://localhost:3001/api/v1](http://localhost:3001/api/v1) | Backend principal NestJS |
| **Optimizer API** | [http://localhost:8000](http://localhost:8000) | Microservicio Python (Docs en `/docs`) |
| **PostgreSQL** | `localhost:5432` | Base de datos relacional (`optiruter`) |
| **Redis** | `localhost:6379` | Gestor de colas y mensajería en memoria |

---

## 🛠️ Scripts Disponibles

En la raíz del proyecto puedes ejecutar:

- `pnpm dev`: Inicia todos los servicios en modo desarrollo y recarga en caliente.
- `pnpm build`: Compila todas las aplicaciones y paquetes.
- `pnpm test`: Ejecuta los tests unitarios e integrados.
- `pnpm typecheck`: Verifica tipado estático con TypeScript en todo el monorepo.
- `pnpm lint`: Corre linters estáticos.
- `pnpm docker:up`: Inicia los contenedores de Docker en segundo plano.
- `pnpm docker:down`: Detiene los contenedores de Docker.
- `pnpm db:migrate`: Aplica las migraciones de base de datos vía Prisma.
- `pnpm db:studio`: Abre la interfaz interactiva de Prisma Studio.

---

## 📖 Documentación de Producto y Arquitectura

Para profundizar en las decisiones de diseño, contratos y requerimientos, consulta la carpeta `docs/product/`:

1. [01 - Product Brief](file:///C:/Users/milto/OneDrive/Documentos/Milton/trabajo/SaaS-Optiruter/docs/product/01-product-brief.md): Visión general, propuesta de valor y objetivos de negocio.
2. [02 - MVP Scope](file:///C:/Users/milto/OneDrive/Documentos/Milton/trabajo/SaaS-Optiruter/docs/product/02-mvp-scope.md): Alcance detallado del MVP, criterios de aceptación y priorización MoSCoW.
3. [03 - User Stories](file:///C:/Users/milto/OneDrive/Documentos/Milton/trabajo/SaaS-Optiruter/docs/product/03-user-stories.md): Historias de usuario organizadas por épicas funcionales.
4. [04 - Data Model](file:///C:/Users/milto/OneDrive/Documentos/Milton/trabajo/SaaS-Optiruter/docs/product/04-data-model.md): Entidades del dominio, esquemas relacionales y multi-tenancy.
5. [05 - API Contract](file:///C:/Users/milto/OneDrive/Documentos/Milton/trabajo/SaaS-Optiruter/docs/product/05-api-contract.md): Especificación REST de endpoints, DTOs y códigos de respuesta.
6. [06 - Architecture](file:///C:/Users/milto/OneDrive/Documentos/Milton/trabajo/SaaS-Optiruter/docs/product/06-architecture.md): Arquitectura de microservicios, patrón productor-consumidor y ADRs técnicos.
7. [07 - Roadmap](file:///C:/Users/milto/OneDrive/Documentos/Milton/trabajo/SaaS-Optiruter/docs/product/07-roadmap.md): Fases de desarrollo desde la fundación técnica hasta el lanzamiento del MVP.
8. [08 - AI Workflow](file:///C:/Users/milto/OneDrive/Documentos/Milton/trabajo/SaaS-Optiruter/docs/product/08-ai-workflow.md): Convenciones y flujo de desarrollo asistido por IA.
9. [09 - Monorepo Setup](file:///C:/Users/milto/OneDrive/Documentos/Milton/trabajo/SaaS-Optiruter/docs/product/09-monorepo-setup.md): Configuración de Turborepo, pnpm workspaces y Docker Compose.

---

## 🗺️ Roadmap de Implementación

- [x] **Fase 0: Discovery y Documentación:** Especificación funcional, técnica y contratos cerrada.
- [ ] **Fase 1: Fundación Técnica:** Monorepo, pipelines de CI, infraestructura base con Docker.
- [ ] **Fase 2: Núcleo Operativo:** Autenticación JWT, multi-tenancy, CRUD de flota y carga CSV de pedidos.
- [ ] **Fase 3: Motor de Optimización:** Conexión BullMQ, worker y resolución VRP con OR-Tools.
- [ ] **Fase 4: Experiencia de Usuario:** Interfaz interactiva de mapa, KPIs y notificaciones WebSocket.
- [ ] **Fase 5: Demo y Lanzamiento:** Datos de prueba, métricas operativas y despliegue a producción.

---

## 📄 Licencia

Distribuido bajo licencia [ISC](file:///C:/Users/milto/OneDrive/Documentos/Milton/trabajo/SaaS-Optiruter/package.json).
