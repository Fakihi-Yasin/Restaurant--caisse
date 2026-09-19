# Restaurant POS — Moroccan Restaurants

Multi-tenant SaaS Point of Sale for Moroccan restaurants.

## Stack

| Layer     | Tech                                                              |
|-----------|-------------------------------------------------------------------|
| Backend   | NestJS 11, TypeScript, Prisma 5, PostgreSQL, JWT, Socket.IO       |
| Frontend  | React 19, Vite, TypeScript, Tailwind CSS v4, TanStack Query, Zustand, i18next, PWA |

## Project structure

```
restaurant-pos/
├── backend/                  # NestJS API
│   ├── prisma/
│   │   └── schema.prisma     # ← paste your schema here
│   └── src/
│       ├── app.module.ts
│       ├── main.ts
│       ├── prisma/           # PrismaModule (global) + PrismaService
│       ├── common/           # guards, decorators, filters, interceptors, utils
│       └── modules/
│           ├── auth/
│           ├── tenants/
│           ├── users/
│           ├── menu/
│           ├── tables/
│           ├── orders/
│           ├── kitchen/      # includes Socket.IO gateway
│           ├── payments/
│           ├── shifts/
│           └── reports/
└── frontend/                 # Vite + React
    └── src/
        ├── app/              # App, router, providers
        ├── features/         # auth, pos, kitchen, menu-admin, orders, payments, shifts, reports
        ├── components/ui/    # Button, Modal (shared)
        ├── lib/              # api.ts, socket.ts, money.ts, i18n.ts
        ├── store/            # Zustand auth store
        └── locales/          # fr.json, ar.json
```

## Prerequisites

- Node 24 (or 22 LTS) — use `nvm use` at the root
- PostgreSQL running locally

## First-time setup

### 1. Create the database

```bash
psql -U postgres -c "CREATE DATABASE restaurant_pos;"
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # edit DATABASE_URL / JWT_SECRET if needed
npm install
npx prisma migrate dev --name init   # runs first migration
npm run start:dev             # http://localhost:3000/api
                              # Swagger: http://localhost:3000/api/docs
```

> ⚠️ Before running the migration, paste your `schema.prisma` into `backend/prisma/schema.prisma`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

## Health check

```
GET http://localhost:3000/api/health
```

## Environment variables (backend)

| Variable        | Description                        | Default                  |
|-----------------|------------------------------------|--------------------------|
| DATABASE_URL    | PostgreSQL connection string       | see .env.example         |
| JWT_SECRET      | Secret for signing JWTs            | change_me_in_production  |
| JWT_EXPIRES_IN  | JWT expiry                         | 7d                       |
| PORT            | Backend port                       | 3000                     |

## i18n

The UI supports French (default) and Arabic (RTL). The `<html dir>` attribute switches automatically when the language changes. Locale files are in `frontend/src/locales/`.

## Money rules

All monetary values are stored as **integer centimes** (1 MAD = 100 centimes). Never use floats. Use `formatMAD(centimes)` from `lib/money.ts` (frontend) or `money.util.ts` (backend) to display amounts.
