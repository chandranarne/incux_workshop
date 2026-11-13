# incux_workshop — Tech Stack

> **Status:** 🟢 Live (assumed) | **Last Updated:** 2026-11-12

---

## Frontend (React/Vite)

| Component | Technology | Version |
|-----------|------------|---------|
| **Runtime** | Node.js | 20.x |
| **Framework** | React | 19.3.1 |
| **Build Tool** | Vite | 8.3.4 |
| **Router** | (SPA, single page) | — |
| **Styling** | Tailwind CSS | 3.4.17 |
| **Animations** | GSAP | 3.15.0 |
| **Motion** | Framer Motion | 14.6.0 |
| **Icons** | Lucide React | 1.61.0 |
| **Linting** | oxlint | 1.88.0 |
| **PostCSS** | autoprefixer + postcss | 10.6.1 / 8.5.31 |

---

## Backend (Express/Supabase)

| Component | Technology | Version |
|-----------|------------|---------|
| **Runtime** | Node.js | 20.x |
| **Framework** | Express | 4.21.2 |
| **Database** | Supabase (PostgreSQL) | 2.119.0 |
| **Auth** | Supabase Auth | — |
| **Validation** | Manual (express) | — |
| **Logging** | Morgan | 1.10.0 |
| **CORS** | cors | 2.8.5 |

---

## Deployment & Infrastructure

| Component | Provider | Details |
|-----------|----------|---------|
| **Hosting (Frontend + API)** | Vercel | `vercel.json` config |
| **Serverless API** | Vercel Functions | `api/index.js` → `backend/server.js` |
| **Database** | Supabase | Managed PostgreSQL |
| **Auth** | Supabase Auth | RLS required on all tables |
| **Domain** | Vercel custom domain | ❓ Unknown (verify in Vercel dashboard) |
| **SSL** | Vercel / Let's Encrypt | Auto |
| **Build Command** | `node scripts/build.js` | Custom build |
| **Output** | `dist/` | Vite build output |
| **Rewrites** | `/api/*` → `api/index.js` | SPA fallback to `/index.html` |

---

## Key Config Files

| File | Purpose |
|------|---------|
| `frontend/package.json` | Frontend deps, scripts |
| `frontend/vite.config.js` | Vite config |
| `frontend/tailwind.config.js` | Tailwind config |
| `backend/package.json` | Backend deps, scripts |
| `backend/server.js` | Express server, endpoints, CORS, validation |
| `backend/supabaseClient.js` | Supabase client singleton |
| `backend/data/*.json` | Static data (workshops, companies, stats, expertise, config, inquiries) |
| `api/index.js` | Vercel serverless wrapper |
| `scripts/build.js` | Custom Vercel build script |
| `vercel.json` | Vercel config (build, output, rewrites) |
| `.env.example` | Env template (Supabase keys) |

---

## Environment Variables

### Root / Frontend (`.env`)

| Variable | Purpose | Exposed to Browser? |
|----------|---------|---------------------|
| `PORT` | Backend server port | No |
| `NODE_ENV` | Environment | No |
| `VITE_API_BASE` | API base URL for frontend | **Yes** (VITE_ prefix) |
| `SUPABASE_URL` | Supabase project URL | **Yes** (VITE_SUPABASE_URL) |
| `VITE_SUPABASE_URL` | Public Supabase URL | **Yes** |
| `SUPABASE_ANON_KEY` | Public anon key | **Yes** (VITE_SUPABASE_ANON_KEY) |
| `VITE_SUPABASE_ANON_KEY` | Public anon key for frontend | **Yes** |
| `SUPABASE_SERVICE_ROLE_KEY` | **Backend only** — bypasses RLS | **Never** |

> **Critical:** `SUPABASE_SERVICE_ROLE_KEY` must **never** be prefixed with `VITE_`. It bypasses RLS and is for backend-only operations.

---

## Supabase Database

| Aspect | Detail |
|--------|--------|
| **Provider** | Supabase |
| **RLS** | Required on every table; default deny; policies scoped to `auth.uid()` |
| **Tables** | `inquiries`, `workshops`, `companies`, `statistics`, `expertise`, `config` |
| **Notes** | See `backend/database/README.md` |

---

## Development Setup

```bash
# 1. Clone
git clone https://github.com/incuxaiwork/incux_workshop.git D:\code\incux_workshop

# 2. Configure
cd D:\code\incux_workshop
copy .env.example .env
# Fill: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# 3. Install
npm install
cd backend; npm install; cd ..
cd frontend; npm install; cd ..

# 4. Run
npm run dev:backend    # Express API (own port)
npm run dev:frontend   # Vite dev server

# Note: Vercel's /api/* rewrite is production-only.
# Locally, set VITE_API_BASE to point to backend directly.
```

---

## Build & Deploy

```bash
# Build (custom script for Vercel)
npm run build    # node scripts/build.js → dist/

# Deploy to Vercel
vercel --prod    # ⚠️ Project link unverified
# Or push to connected branch for auto-deploy
```

**Vercel Env Vars (Production scope):**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

---

## Version Constraints

### Frontend (package.json)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.119.0",
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
    "@supabase/supabase-js": "^2.119.0",
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "morgan": "^1.10.0"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
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

---

*Last verified: 2026-11-12 against actual package.json files.*