# Monorepo Setup — OptiRuter

## 1. Objetivo

Este documento define la estructura inicial del monorepo de OptiRuter.

El objetivo es tener una base:

- Modular.
- Escalable.
- Testeable.
- Fácil de mantener.
- Lista para Docker.
- Lista para CI/CD.
- Lista para crecer sin romperse.

NestJS soporta modo monorepo mediante workspaces definidos en `nest-cli.json`, permitiendo coordinar múltiples apps y librerías dentro del mismo repositorio. [237][247]

## 2. Estructura inicial

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
│   ├── product/
│   ├── architecture/
│   ├── api/
│   ├── decisions/
│   └── setup/
├── .github/
│   └── workflows/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── LICENSE
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

## 3. Apps

| App | Tecnología | Responsabilidad |
|---|---|---|
| `apps/web` | React + TypeScript + Vite | Landing, dashboard, planificador y mapa. |
| `apps/api` | NestJS + Express + Prisma | Auth, CRUD, planes y validación. |
| `apps/worker` | NestJS + BullMQ | Procesar optimizaciones e importaciones. |
| `apps/optimizer` | Python + FastAPI + OR-Tools | Resolver rutas optimizadas. |

## 4. Packages

| Package | Responsabilidad |
|---|---|
| `packages/shared` | Tipos, schemas Zod y contratos compartidos. |
| `packages/ui` | Componentes UI reutilizables. |

## 5. Estructura interna

### apps/api

```text
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   ├── common/
│   ├── modules/
│   └── prisma/
├── test/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── Dockerfile
├── package.json
├── tsconfig.json
└── nest-cli.json
```

### apps/web

```text
apps/web/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   ├── modules/
│   ├── components/
│   ├── lib/
│   └── styles/
├── public/
├── Dockerfile
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### apps/worker

```text
apps/worker/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── queues/
│   ├── processors/
│   └── services/
├── test/
├── Dockerfile
├── package.json
└── tsconfig.json
```

### apps/optimizer

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
├── pyproject.toml
└── requirements.txt
```

## 6. package.json raíz

```json
{
  "name": "optiruter",
  "private": true,
  "version": "0.1.0",
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "db:migrate": "pnpm --filter @optiruter/api db:migrate",
    "db:studio": "pnpm --filter @optiruter/api db:studio",
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.6.0",
    "prettier": "^3.3.0",
    "eslint": "^9.0.0"
  }
}
```

## 7. pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

## 8. turbo.json

```json
{
  "$schema": "[https://turbo.build/schema.json](https://turbo.build/schema.json)",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

## 9. tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 10. docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: optiruter_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: optiruter_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: optiruter_api
    restart: unless-stopped
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./apps/api:/app/apps/api
      - /app/apps/api/node_modules

  worker:
    build:
      context: .
      dockerfile: apps/worker/Dockerfile
    container_name: optiruter_worker
    restart: unless-stopped
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://redis:6379
      OPTIMIZER_URL: http://optimizer:8000
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      optimizer:
        condition: service_started
    volumes:
      - ./apps/worker:/app/apps/worker
      - /app/apps/worker/node_modules

  optimizer:
    build:
      context: ./apps/optimizer
      dockerfile: Dockerfile
    container_name: optiruter_optimizer
    restart: unless-stopped
    environment:
      ENV: development
    ports:
      - "8000:8000"

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: optiruter_web
    restart: unless-stopped
    environment:
      VITE_API_URL: http://localhost:3001/api/v1
      VITE_WS_URL: ws://localhost:3001
    ports:
      - "5173:5173"
    depends_on:
      - api
    volumes:
      - ./apps/web:/app/apps/web
      - /app/apps/web/node_modules

volumes:
  postgres_data:
  redis_data:
```

Docker Compose permite levantar PostgreSQL, Redis, API, worker, optimizador y frontend en un entorno local consistente; los servicios deben comunicarse por nombres de contenedor, no por `localhost`. [241][242][245]

## 11. .env.example

```env
# App
NODE_ENV=development
PORT=3001

# Database
POSTGRES_USER=optiruter
POSTGRES_PASSWORD=optiruter_dev_password
POSTGRES_DB=optiruter
DATABASE_URL=postgresql://optiruter:optiruter_dev_password@localhost:5432/optiruter

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=change_me_in_development
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Optimizer
OPTIMIZER_URL=http://localhost:8000

# Frontend
VITE_API_URL=http://localhost:3001/api/v1
VITE_WS_URL=ws://localhost:3001
```

Nunca subas `.env` real al repositorio. Usá `.env.example` como plantilla y mantené secretos fuera de Git. [246][249]

## 12. .gitignore

```gitignore
node_modules/
dist/
build/
coverage/
.env
.env.local
.env.*.local
*.log
.DS_Store
.idea/
.vscode/
```

## 13. README inicial

```md
# OptiRuter

OptiRuter es un SaaS de optimización de rutas para flotas de última milla.

## Stack

- React + TypeScript + Vite
- NestJS + Express
- Prisma + PostgreSQL
- Redis + BullMQ
- Python + FastAPI + OR-Tools
- Docker Compose
- Turborepo

## Requisitos

- Node.js 20+
- pnpm 9+
- Docker
- Docker Compose

## Instalación

```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm db:migrate
pnpm dev
```

## Servicios

| Servicio | URL |
|---|---|
| Web | http://localhost:5173 |
| API | http://localhost:3001 |
| Optimizer | http://localhost:8000 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm typecheck
pnpm db:migrate
pnpm db:studio
```

## Estructura

```text
apps/
  web/
  api/
  worker/
  optimizer/
packages/
  shared/
  ui/
docs/
```

## Documentación

- `docs/product/`
- `docs/architecture/`
- `docs/api/`
- `docs/decisions/`
- `docs/setup/`
```

## 14. Comandos iniciales

```bash
mkdir optiruter
cd optiruter

git init
pnpm init

pnpm add -D turbo typescript prettier eslint

mkdir -p apps/web apps/api apps/worker apps/optimizer
mkdir -p packages/shared packages/ui
mkdir -p docs/product docs/architecture docs/api docs/decisions docs/setup
mkdir -p .github/workflows
```

## 15. Primer commit recomendado

```bash
git add .
git commit -m "chore: initialize monorepo and project documentation"
```

## 16. Reglas de trabajo

- Un commit por cambio lógico.
- Un PR por feature o fix.
- No mezclar refactor con feature.
- No subir secretos.
- No subir `.env`.
- No subir `node_modules`.
- No subir `dist`.
- Documentar decisiones importantes.