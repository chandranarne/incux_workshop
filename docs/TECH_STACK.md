# incux_workshop — Tech Stack

> **Status:** 🟢 Live (assumed) | **Last Updated:** 2026-11-14

---

## Frontend (React/Vite)

| Component | Technology | Version |
|-----------|------------|---------|
| **Runtime** | Node.js | 20.x |
| **Framework** | React | 19.3.1 |
| **Module System** | ES Modules (`"type": "module"`) | — |
| **Build Tool** | Vite | 8.3.4 |
| **Router** | (SPA, single page) | — |
| **Styling** | Tailwind CSS | 3.4.17 |
| **Animations** | GSAP | 3.15.0 |
| **Motion** | Framer Motion | 14.6.0 |
| **Icons** | Lucide React | 1.61.0 |
| **Linting** | oxlint | 1.88.0 |
| **PostCSS** | autoprefixer + postcss | 10.6.1 / 8.5.31 |

---

## Backend (Express/Prisma)

| Component | Technology | Version |
|-----------|------------|---------|
| **Runtime** | Node.js | 20.x |
| **Framework** | Express | 4.21.2 |
| **Module System** | ES Modules (`"type": "module"`) | — |
| **ORM** | Prisma | 6.x |
| **Database** | PostgreSQL (Railway) | Managed |
| **Validation** | Manual (express) | — |
| **Logging** | Morgan | 1.10.0 |
| **CORS** | cors | 2.8.5 |

---

## Deployment & Infrastructure

| Component | Provider | Details |
|-----------|----------|---------|
| **Hosting (Backend)** | Railway | `backend/railway.json` |
| **Hosting (Frontend)** | Railway | `frontend/railway.json` |
| **Database** | Railway PostgreSQL | Managed PostgreSQL via `DATABASE_URL` |
| **Domain** | Railway custom domain | ❓ Unknown (verify in Railway dashboard) |
| **SSL** | Railway / Let's Encrypt | Auto |
| **Build Command** | `npm install && npm run build` | Frontend Vite build |
| **Output** | `dist/` | Vite build output |
| **Backend Start** | `npm run prisma:generate && npm run prisma:migrate && npm start` | Prisma generate + migrate + server |

---

## Key Config Files

| File | Purpose |
|------|---------|
| `frontend/package.json` | Frontend deps, scripts (ESM) |
| `frontend/vite.config.js` | Vite config |
| `frontend/tailwind.config.js` | Tailwind config |
| `frontend/.env` | Frontend env (`VITE_API_BASE`) |
| `frontend/railway.json` | Railway deploy config (frontend) |
| `backend/package.json` | Backend deps, scripts (ESM) |
| `backend/server.js` | Express server, endpoints, CORS, validation (ESM) |
| `backend/prisma/schema.prisma` | Prisma data model |
| `backend/.env` | Backend env (`DATABASE_URL`) |
| `backend/railway.json` | Railway deploy config (backend) |
| `backend/data/*.json` | Static data (fallback + API source) |
| `scripts/build.js` | Custom build script |
| `package.json` | Root orchestrator |
| `.env.example` | Env template |

---

## Environment Variables

### Backend (`.env`)

| Variable | Purpose | Exposed to Browser? |
|----------|---------|---------------------|
| `PORT` | Backend server port | No |
| `NODE_ENV` | Environment | No |
| `DATABASE_URL` | Railway PostgreSQL connection string | **Never** |
| `API_BASE` | API base URL reference | No |

### Frontend (`.env`)

| Variable | Purpose | Exposed to Browser? |
|----------|---------|---------------------|
| `VITE_API_BASE` | API base URL for frontend | **Yes** (VITE_ prefix) |

> **Critical:** `DATABASE_URL` must **never** be exposed to the frontend. It is backend-only.

---

## Database Schema (Prisma)

| Table | Description |
|-------|-------------|
| `users` | Admin & registered candidates |
| `custom_requests` | College / department collaboration requests |
| `upcoming_workshops` | Live published workshop sessions |
| `registrations` | Candidate enrollments in workshops |
| `inquiries` | Landing page contact & corporate/college inquiries |

Schema located at: `backend/prisma/schema.prisma`

---

## Development Setup

```bash
# 1. Clone
git clone https://github.com/incuxaiwork/incux_workshop.git D:\code\incux_workshop

# 2. Configure
cd D:\code\incux_workshop

# Backend: set DATABASE_URL in backend/.env (Railway PostgreSQL)
# If no DATABASE_URL, backend falls back to local JSON store

# Frontend: set VITE_API_BASE in frontend/.env (e.g. http://localhost:5000/api)

# 3. Install
npm install
cd backend; npm install; cd ..
cd frontend; npm install; cd ..

# 4. Generate Prisma client
cd backend; npx prisma generate; cd ..

# 5. Run (two terminals)
npm run dev:backend    # Express API (own port, ESM)
npm run dev:frontend   # Vite dev server
```

---

## Build & Deploy

**Backend (Railway):**
```bash
# Connect backend/ folder as a Railway service
# Add DATABASE_URL variable (from Railway PostgreSQL)
# Railway runs: npm run prisma:generate && npm run prisma:migrate && npm start
```

**Frontend (Railway):**
```bash
# Connect frontend/ folder as a separate Railway service
# Add VITE_API_BASE variable pointing to backend URL
# Railway runs: npm install && npm run build
```

---

## Version Constraints

### Frontend (package.json)

```json
{
  "dependencies": {
    "framer-motion": "^14.6.0",
    "gsap": "^3.15.0",
    "lucide-react": "^1.61.0",
    "react": "^19.3.1",
    "react-dom": "^19.3.1"
  },
  "devDependencies": {
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.2",
    "autoprefixer": "^10.6.1",
    "oxlint": "^1.88.0",
    "postcss": "^8.5.31",
    "tailwindcss": "^3.4.17",
    "vite": "^8.3.4"
  }
}
```

### Backend (package.json)

```json
{
  "dependencies": {
    "@prisma/client": "^6.0.0",
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "morgan": "^1.10.0",
    "prisma": "^6.0.0"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

---

## Scripts

| Context | Script | Command |
|---------|--------|---------|
| Root | `dev:frontend` | `cd frontend && npm run dev` |
| Root | `dev:backend` | `cd backend && npm run dev` |
| Root | `build` | `node scripts/build.js` |
| Root | `build:frontend` | `cd frontend && npm run build` |
| Root | `start:backend` | `cd backend && npm run start` |
| Frontend | `dev` | `vite` |
| Frontend | `build` | `vite build` |
| Frontend | `lint` | `oxlint` |
| Frontend | `preview` | `vite preview` |
| Backend | `start` | `node server.js` |
| Backend | `dev` | `node --watch server.js` |
| Backend | `prisma:generate` | `prisma generate` |
| Backend | `prisma:migrate` | `prisma migrate deploy` |

---

*Last verified: 2026-11-14 against actual package.json files.*
