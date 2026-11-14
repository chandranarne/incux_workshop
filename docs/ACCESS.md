# incux_workshop — Access & Contacts

> **Status:** 🟢 Live (assumed) | **Last Updated:** 2026-11-14

---

## Where the Code Lives

| Location | Path / URL |
|----------|------------|
| **Local (this laptop)** | `D:\code\incux_workshop\` |
| **GitHub** | https://github.com/incuxaiwork/incux_workshop (public) |
| **Production (Backend)** | Railway: `incuxai.work@gmail.com` |
| **Production (Frontend)** | Railway: `incuxai.work@gmail.com` |
| **Database** | Railway PostgreSQL (managed) |

---

## How to Access

### 1. Local Development

```bash
# Clone
git clone https://github.com/incuxaiwork/incux_workshop.git D:\code\incux_workshop

# Configure
cd D:\code\incux_workshop

# Backend: set DATABASE_URL in backend/.env (Railway PostgreSQL)
# Frontend: set VITE_API_BASE in frontend/.env (e.g. http://localhost:5000/api)

# Install
npm install
cd backend; npm install; cd ..
cd frontend; npm install; cd ..

# Generate Prisma client
cd backend; npx prisma generate; cd ..

# Run
npm run dev:backend    # Express API (own port, ESM)
npm run dev:frontend   # Vite dev server

# Locally, set VITE_API_BASE=http://localhost:5000/api
```

### 2. Production (Railway)

```bash
# Railway CLI
railway login
railway link  # ⚠️ Project not verified locally

# Or via dashboard
# https://railway.app → project → deployments
```

### 3. Railway PostgreSQL

```bash
# Dashboard
# https://railway.app → project → database → copy DATABASE_URL

# Add DATABASE_URL to backend service variables
# Add VITE_API_BASE to frontend service variables
```

### 4. GitHub

```bash
git clone https://github.com/incuxaiwork/incux_workshop.git
# Public repo - no auth needed for clone
git add -A
git commit -m "your message"
git push origin main  # Triggers Railway auto-deploy
```

---

## Whom to Contact

| Area | Person | Email | Notes |
|------|--------|-------|-------|
| **Owner** | ❓ Unknown | — | Ask **Ashish** (avani890a@gmail.com) |
| **Railway/Deployment** | — | `incuxai.work@gmail.com` | Railway account |
| **Database** | — | — | Railway PostgreSQL Dashboard |
| **GitHub** | — | — | Public repo: `incuxaiwork/incux_workshop` |

> ⚠️ **Owner not documented in repo.** Railway project name, domain, and production branch unknown.

---

## Credential Locations (Pointers Only)

| Credential | Where It Lives |
|------------|----------------|
| **DATABASE_URL** | Railway env vars (backend); local `backend/.env` |
| **VITE_API_BASE** | Railway env vars (frontend); local `frontend/.env` |
| **Railway Account** | `incuxai.work@gmail.com` |
| **Railway Dashboard** | railway.app |
| **GitHub** | Public repo; `gh auth login` for push |

> **Critical:** `DATABASE_URL` is backend-only — **never** expose to frontend (no `VITE_` prefix).

---

## Quick Commands

| Task | Command |
|------|---------|
| Frontend dev | `npm run dev:frontend` |
| Backend dev | `npm run dev:backend` |
| Prisma generate | `cd backend && npx prisma generate` |
| Prisma migrate | `cd backend && npx prisma migrate deploy` |
| Build | `npm run build` |
| Deploy | Push to main (Railway auto-deploys) |
| View Railway logs | Railway dashboard → deployments |
| View DB logs | Railway dashboard → database → logs |
| Run lint | `npm run lint` (frontend) |

---

## Related Documentation

| Doc | Path |
|-----|------|
| Architecture | `docs/ARCHITECTURE.md` |
| Tech Stack | `docs/TECH_STACK.md` |
| AGENTS.md | `docs/AGENTS.md` |
| README | `README.md` |
| Prisma Schema | `backend/prisma/schema.prisma` |

---

*Last verified: 2026-11-14*
