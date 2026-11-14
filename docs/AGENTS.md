# incux_workshop — AGENTS.md

> **Operating manual for AI coding agents working in this repository.**
> Read this **first**, before touching any code.

---

## 1. What This Product Is

**IncuxAI Workshop Website Platform** — A modern, animation-rich marketing website for IncuXai workshops.

- **Frontend:** React 19 + Vite 8 + Tailwind 3 + GSAP 3 + Framer Motion 14
- **Backend:** Express 4 + Prisma ORM (Railway PostgreSQL)
- **Deployment:** Railway (backend + frontend deployed individually)
- **Purpose:** Public workshop marketing site — **NOT** the paid registration path (that's incuxai.com + Education Trust)
- **Data Compliance:** Strict — no fabricated counts, testimonials, or false sponsorship claims

---

## 2. Repo Layout

```
incux_workshop/
├── frontend/                          # React + Vite + Tailwind + GSAP
│   ├── src/
│   │   ├── components/                # 11 page sections
│   │   │   ├── IntroAnimation.jsx     # Section 01: Character reveal
│   │   │   ├── Navbar.jsx             # Header + menu button
│   │   │   ├── MenuOverlay.jsx        # Full-screen overlay (Escape/focus lock)
│   │   │   ├── Hero.jsx               # Section 02: 100svh hero
│   │   │   ├── OurWork.jsx            # Section 03: Pinned horizontal scroll
│   │   │   ├── WorkshopCard.jsx       # Individual format cards
│   │   │   ├── CompanyGrid.jsx        # Section 04: 8 wordmarks
│   │   │   ├── ImpactStats.jsx        # Section 05: Cream bg, count-up
│   │   │   ├── FeaturedWorkshops.jsx  # Section 06: 5 achievements
│   │   │   ├── Expertise.jsx          # Section 07: 15 topics, 5 groups
│   │   │   ├── HowWeWork.jsx          # Section 08: 4 phases
│   │   │   ├── About.jsx              # Section 09: Mission statement
│   │   │   ├── NewsSection.jsx        # Transparency placeholder
│   │   │   ├── ContactCTA.jsx         # Section 10: Inquiry form
│   │   │   └── Footer.jsx             # Section 11: Nav, copyright
│   │   ├── data/                      # Static fallback datasets
│   │   │   ├── config.js, workshops.js, companies.js
│   │   │   ├── statistics.js, expertise.js
│   │   ├── services/api.js            # API client with fallback
│   │   ├── App.jsx, index.css, main.jsx
│   ├── .env                           # Frontend env (VITE_API_BASE)
│   ├── railway.json                   # Railway deployment config
│   ├── package.json, tailwind.config.js, vite.config.js
├── backend/                           # Express + Prisma (Railway PostgreSQL)
│   ├── data/                          # JSON data (API source + fallback)
│   │   ├── workshops.json, companies.json, statistics.json
│   │   ├── expertise.json, config.json, inquiries.json
│   ├── server.js                      # Express, CORS, validation, endpoints
│   ├── prisma/                        # Prisma schema & migrations
│   │   └── schema.prisma              # Prisma data model
│   ├── .env                           # Backend env (DATABASE_URL)
│   ├── railway.json                   # Railway deployment config
│   └── package.json
├── scripts/build.js                   # Custom build script
├── package.json                       # Root orchestrator
└── .git
```

---

## 3. Critical Rules (Non-Negotiable)

### 3.1 Database & Secrets (Prisma + Railway)

- **DATABASE_URL** is the only secret needed — Railway PostgreSQL connection string
- **NEVER** expose `DATABASE_URL` to the frontend (no `VITE_` prefix)
- **Anon/API keys are not used** — the backend talks directly to PostgreSQL via Prisma
- All secrets in Railway Environment Variables (Production scope)
- Prisma client is initialized only when `DATABASE_URL` is set; otherwise falls back to local JSON

### 3.2 Data Accuracy (Strict)

- **950+ participations** = cumulative verified (200+150+500+100), **NOT** 950 unique individuals
- **GITAM bootcamp excluded** from attendance total
- **No fabricated dates, testimonials, or sponsorship claims**
- 8 companies (Google, Walmart, Microsoft, Deloitte, TCS, Genpact, J&J, Tech Mahindra) as **typographic wordmarks only** — no logos

### 3.3 Animations & Accessibility

- `prefers-reduced-motion` toggle on navbar + OS detection
- Keyboard accessible menu (Escape listener, focus lock, scroll lock)
- GSAP/Framer Motion animations respect reduced-motion

### 3.4 API Client Fallback

- `frontend/src/services/api.js` tries API first, falls back to local `src/data/*.js`
- **Never remove the fallback** — it's the offline/first-load experience

### 3.5 Railway Deployment

- Backend and frontend are deployed **individually** on Railway
- Each has its own `railway.json`
- **Locally:** run backend directly (`npm run dev:backend`) and set `VITE_API_BASE`
- No Vercel serverless wrapper — `api/index.js` and `vercel.json` removed

---

## 4. Coding Conventions

| Aspect | Convention |
|--------|------------|
| **Frontend** | Functional components, hooks, Tailwind, GSAP/Framer Motion |
| **Components** | Co-locate styles, one component per file |
| **Data** | Static fallback in `frontend/src/data/`; API source in `backend/data/` |
| **Animations** | GSAP for complex sequences, Framer Motion for React transitions |
| **Accessibility** | WCAG 2.2 AA target; keyboard nav, reduced-motion, focus management |
| **Build** | Custom `scripts/build.js`; outputs `dist/` |
| **Database** | Prisma schema in `backend/prisma/schema.prisma` |
| **Linting** | `oxlint` (frontend) |

---

## 5. Key Files — What NOT to Touch Without Understanding

| File | Why It's Critical |
|------|-------------------|
| `frontend/src/services/api.js` | API client with **fallback logic** — don't remove fallback |
| `backend/server.js` | All API endpoints, CORS, validation, Prisma queries |
| `backend/prisma/schema.prisma` | Prisma data model — changing tables requires migration |
| `backend/data/*.json` | **Source of truth** for API responses + frontend fallback |
| `frontend/src/data/*.js` | Frontend fallback — must stay in sync with backend data |
| `backend/.env` | Backend env vars — `DATABASE_URL` for Railway PostgreSQL |
| `frontend/.env` | Frontend env vars — `VITE_API_BASE` for backend URL |
| `backend/railway.json` | Railway deploy config for backend service |
| `frontend/railway.json` | Railway deploy config for frontend service |
| `frontend/src/components/ContactCTA.jsx` | Inquiry form → `POST /api/inquiries` |

---

## 6. How to Run Locally

```bash
# 1. Clone
git clone https://github.com/incuxaiwork/incux_workshop.git D:\code\incux_workshop

# 2. Configure
cd D:\code\incux_workshop

# Backend: copy .env and set DATABASE_URL (Railway PostgreSQL)
# If no DATABASE_URL, backend falls back to local JSON store

# 3. Install
npm install
cd backend; npm install; cd ..
cd frontend; npm install; cd ..

# 4. Generate Prisma client
cd backend; npx prisma generate; cd ..

# 5. Run (two terminals)
npm run dev:backend    # Express API on its own port
npm run dev:frontend   # Vite dev server

# Locally, set VITE_API_BASE=http://localhost:5000/api
```

---

## 7. How to Test Changes

| Change | Test |
|--------|------|
| Animation | Check reduced-motion toggle; verify GSAP/Framer Motion |
| API endpoint | `curl http://localhost:<port>/api/workshops` |
| Inquiry form | Submit → check Railway PostgreSQL `inquiries` table (or JSON fallback) |
| Fallback | Kill backend → frontend should show data from `src/data/` |
| Build | `npm run build` → verify `dist/` created |
| Deploy | Push to Railway-connected repo → auto-deploy |

---

## 8. Deployment (Railway)

**Backend (`backend/railway.json`):**
- Start: `npm run prisma:generate && npm run prisma:migrate && npm start`
- Healthcheck: `/api/health`

**Frontend (`frontend/railway.json`):**
- Start: `npm install && npm run build`
- Healthcheck: `/`

**Deploy:**
1. Connect `backend/` folder as a Railway service → add `DATABASE_URL` variable
2. Connect `frontend/` folder as a separate Railway service → add `VITE_API_BASE` variable pointing to backend URL
3. Railway auto-deploys on push to connected branch

**Env Vars (Railway → Service → Variables):**
- Backend: `DATABASE_URL` (from Railway PostgreSQL), `PORT`, `NODE_ENV`
- Frontend: `VITE_API_BASE` (e.g. `https://incuxai-backend.up.railway.app/api`)

---

## 9. Common Pitfalls

| Pitfall | Prevention |
|---------|------------|
| API 404 locally | Run backend directly; set `VITE_API_BASE` |
| Prisma connection error | Check `DATABASE_URL` in `backend/.env`; PostgreSQL must be reachable |
| Prisma client not generated | Run `npx prisma generate` after `npm install` |
| Build fails on Railway | `railway.json` paths; env vars at build time |
| Animations broken | GSAP/Framer versions; reduced-motion settings |
| Changes to env ignored | Restart Vite; `VITE_*` requires rebuild on Railway |

---

## 10. When in Doubt

1. **Read `README.md`** — structure, sections, data compliance
2. **Check `backend/data/*.json`** — source of truth for content
3. **Check `backend/prisma/schema.prisma`** — Prisma data model
4. **Trace API client fallback** — `frontend/src/services/api.js`
5. **Don't break the fallback** — it's the offline experience

---

## 11. Contacts

| Role | Contact | Notes |
|------|---------|-------|
| Owner | ❓ Unknown | Ask **Ashish** (avani890a@gmail.com) |
| Railway/Deployment | — | `incuxai.work@gmail.com` |
| Database | — | Railway PostgreSQL Dashboard |

---

*Maintained by IncuXai team. Update this file when architecture changes.*
