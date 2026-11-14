# incux_workshop — Architecture & Design

> **Status:** 🟢 Live (assumed) | **Last Updated:** 2026-11-14 | **Audience:** Developers, AI agents, operators

---

## 1. System Overview

**IncuxAI Workshop Website Platform** — A modern, animation-rich marketing website for IncuXai workshops, structured with separate **frontend** and **backend** layers.

- **Frontend:** React.js + Vite + Tailwind CSS + GSAP (animation)
- **Backend:** Node.js + Express REST API + Prisma ORM (Railway PostgreSQL)
- **Deployment:** Railway (backend + frontend deployed individually)
- **Purpose:** Public workshop marketing site — **NOT** the paid registration path (that's incuxai.com + Education Trust)

---

## 2. Repository Structure

```
D:\code\incux_workshop\                        ← Local path
├── frontend/                                 ← React + Vite + Tailwind + GSAP
│   ├── src/
│   │   ├── components/                       ← Page sections (11 sections)
│   │   │   ├── IntroAnimation.jsx            # Section 01: Character reveal (2-3s)
│   │   │   ├── Navbar.jsx                    # Header with bright rounded menu button
│   │   │   ├── MenuOverlay.jsx               # Full-screen overlay menu (Escape/focus lock)
│   │   │   ├── Hero.jsx                      # Section 02: 100svh hero, 2 CTAs
│   │   │   ├── OurWork.jsx                   # Section 03: Pinned horizontal scroll
│   │   │   ├── WorkshopCard.jsx              # Individual workshop format cards
│   │   │   ├── CompanyGrid.jsx               # Section 04: 8 typographic wordmarks
│   │   │   ├── ImpactStats.jsx               # Section 05: Warm cream, count-up stats
│   │   │   ├── FeaturedWorkshops.jsx         # Section 06: 5 documented achievements
│   │   │   ├── Expertise.jsx                 # Section 07: 15 topics in 5 groups
│   │   │   ├── HowWeWork.jsx                 # Section 08: 4 delivery phases
│   │   │   ├── About.jsx                     # Section 09: Official mission statement
│   │   │   ├── NewsSection.jsx               # Honest transparency placeholder
│   │   │   ├── ContactCTA.jsx                # Section 10: Backend inquiry form
│   │   │   └── Footer.jsx                    # Section 11: Navigation, copyright
│   │   ├── data/                             ← Local static datasets (offline fallback)
│   │   │   ├── config.js                     # Brand mission, contact placeholders
│   │   │   ├── workshops.js                  # 5 overview cards + 5 featured events
│   │   │   ├── companies.js                  # 8 practitioner companies
│   │   │   ├── statistics.js                 # Verified impact statistics
│   │   │   └── expertise.js                  # 15 topics across 5 tracks
│   │   ├── services/
│   │   │   └── api.js                        # API client with automatic fallback
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env                                  ← Frontend env (VITE_API_BASE)
│   ├── railway.json                          # Railway deploy config
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/                                  ← Express + Prisma (Railway PostgreSQL)
│   ├── data/                                 ← JSON data files (same as frontend fallback)
│   │   ├── workshops.json
│   │   ├── companies.json
│   │   ├── statistics.json
│   │   ├── expertise.json
│   │   ├── config.json
│   │   └── inquiries.json                    # Persisted inquiry submissions
│   ├── server.js                             ← Express server, CORS, validation
│   ├── prisma/                               ← Prisma schema & migrations
│   │   └── schema.prisma                     # Prisma data model
│   ├── .env                                  ← Backend env (DATABASE_URL)
│   ├── railway.json                          # Railway deploy config
│   └── package.json
├── scripts/
│   └── build.js                              ← Custom build script
├── package.json                              ← Root workspace orchestrator
└── .git
```

---

## 3. Architecture Design

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INCUX WORKSHOP PLATFORM                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         RAILWAY (Frontend)                          │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                    FRONTEND (React + Vite)                   │  │   │
│  │  │  • 11 animated sections (GSAP, Framer Motion)               │  │   │
│  │  │  • Static data fallback (frontend/src/data/)                │  │   │
│  │  │  • API client with auto-fallback (services/api.js)          │  │   │
│  │  │  • Reduced-motion support, keyboard accessible              │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼ HTTPS /api/*                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         RAILWAY (Backend)                           │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                    BACKEND (Express + Prisma)                │  │   │
│  │  │  • Express server, CORS, input validation                    │  │   │
│  │  │  • Prisma ORM → Railway PostgreSQL                           │  │   │
│  │  │  • JSON fallback when DATABASE_URL not set                   │  │   │
│  │  │  • Endpoints: workshops, companies, stats, expertise,        │  │   │
│  │  │    config, news, inquiries (GET/POST)                        │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      RAILWAY POSTGRESQL                              │   │
│  │  • Managed PostgreSQL database                                      │   │
│  │  • Tables: users, inquiries, upcoming_workshops, registrations,    │   │
│  │    custom_requests                                                  │   │
│  │  • Accessed via Prisma Client                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow

1. **Frontend loads** → Tries API first → Falls back to local `src/data/*.js` if API fails
2. **Inquiry form submit** → `POST /api/inquiries` → Validation → Prisma insert → Response (mirrored to JSON)
3. **All read endpoints** → `GET /api/*` → Prisma query → JSON response (falls back to JSON files)
4. **Build time** → `VITE_*` env vars inlined → Frontend built with `vite build`

---

## 4. Frontend Sections (11 Sections)

| Section | Component | Description |
|---------|-----------|-------------|
| 01 | `IntroAnimation.jsx` | Character reveal (2-3s) |
| 02 | `Navbar.jsx` + `MenuOverlay.jsx` | Header, bright menu button, full-screen overlay (Escape/focus lock) |
| 03 | `Hero.jsx` | 100svh hero, 2 CTAs, oversized "WORKSHOPS" |
| 04 | `OurWork.jsx` | Pinned horizontal scroll (desktop) |
| 05 | `WorkshopCard.jsx` | Individual workshop format cards |
| 06 | `CompanyGrid.jsx` | 8 typographic wordmarks + disclaimer |
| 07 | `ImpactStats.jsx` | Warm cream `#f7f5f0`, count-up stats |
| 08 | `FeaturedWorkshops.jsx` | 5 documented achievements (asymmetric layout) |
| 09 | `Expertise.jsx` | 15 topics in 5 groups, category switcher |
| 10 | `HowWeWork.jsx` | 4 delivery phases |
| 11 | `About.jsx` | Official mission statement |
| 12 | `NewsSection.jsx` | Honest transparency placeholder |
| 13 | `ContactCTA.jsx` | Backend inquiry form + config placeholders |
| 14 | `Footer.jsx` | Navigation, categories, copyright |

---

## 5. Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check, uptime, timestamp, DB status |
| `GET` | `/api/workshops` | 5 overview cards + 5 featured achievements |
| `GET` | `/api/companies` | 8 practitioner companies + compliance note |
| `GET` | `/api/stats` | Verified impact statistics + attendance footnote |
| `GET` | `/api/expertise` | 5 expertise tracks + 15 modules |
| `GET` | `/api/config` | Brand mission + contact placeholders |
| `GET` | `/api/news` | Honest news placeholder status |
| `POST` | `/api/inquiries` | Receive & validate institutional inquiries |
| `GET` | `/api/inquiries` | Inspect stored inquiries |
| `POST` | `/api/auth/login` | Admin & candidate login |
| `POST` | `/api/auth/register` | Candidate registration |
| `GET` | `/api/workshops/upcoming` | List upcoming workshops |
| `POST` | `/api/workshops` | Post a new workshop |
| `DELETE` | `/api/workshops/:id` | Delete a workshop |
| `POST` | `/api/workshops/:id/register` | Register candidate for workshop |
| `GET` | `/api/candidates/:email/registrations` | Get candidate registrations |
| `POST` | `/api/collaboration-requests` | Submit collaboration request |
| `GET` | `/api/collaboration-requests` | List collaboration requests |
| `POST` | `/api/collaboration-requests/:id/approve` & workshop |
| `GET` | `/api/registrations` | List all registrations |

---

## 6. Design & Data Compliance

1. **Aesthetics:** Deep graphite `#0e0f12`, charcoal `#14151a`, vivid lime `#ccff00`, warm cream `#f7f5f0`
2. **Typography:** Space Grotesk headlines, Inter body, intentional line breaks
3. **Data Accuracy:**
   - 950+ cumulative verified participations (200+150+500+100), **not** 950 unique individuals
   - GITAM bootcamp **excluded** from attendance total
   - No fabricated dates or testimonials
   - 8 companies (Google, Walmart, Microsoft, Deloitte, TCS, Genpact, J&J, Tech Mahindra) as **typographic wordmarks** — no logos, no false sponsorship claims
4. **Accessibility:** Keyboard accessible menu, Escape listener, scroll lock, `prefers-reduced-motion` toggle + OS detection

---

## 7. Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend Runtime** | Node.js | 20.x |
| **Frontend Framework** | React | 19.3.1 |
| **Build Tool** | Vite | 8.3.4 |
| **Styling** | Tailwind CSS | 3.4.17 |
| **Animations** | GSAP | 3.15.0 |
| **Motion** | Framer Motion | 14.6.0 |
| **Icons** | Lucide React | 1.61.0 |
| **Linting** | oxlint | 1.88.0 |
| **Backend Runtime** | Node.js | 20.x |
| **Backend Framework** | Express | 4.21.2 |
| **ORM** | Prisma | 6.x |
| **Database** | PostgreSQL (Railway) | Managed |
| **Validation** | Manual (express) | — |
| **Logging** | Morgan | 1.10.0 |
| **Deploy (Frontend)** | Railway | `railway.json` config |
| **Deploy (Backend)** | Railway | `railway.json` config |
| **Database Host** | Railway | Managed PostgreSQL |

---

## 8. Key Config Files

| File | Purpose |
|------|---------|
| `frontend/package.json` | Frontend deps, scripts |
| `frontend/vite.config.js` | Vite config |
| `frontend/tailwind.config.js` | Tailwind config |
| `frontend/.env` | Frontend env (`VITE_API_BASE`) |
| `frontend/railway.json` | Railway deploy config (frontend) |
| `backend/package.json` | Backend deps, scripts |
| `backend/server.js` | Express server, endpoints |
| `backend/prisma/schema.prisma` | Prisma data model |
| `backend/.env` | Backend env (`DATABASE_URL`) |
| `backend/railway.json` | Railway deploy config (backend) |
| `backend/data/*.json` | Static data (fallback + API source) |
| `scripts/build.js` | Custom build script |
| `package.json` | Root orchestrator |
| `.env.example` | Env template |

---

## 9. Deployment (Railway)

**Backend (`backend/railway.json`):**
- Start command: `npm run prisma:generate && npm run prisma:migrate && npm start`
- Healthcheck: `/api/health`

**Frontend (`frontend/railway.json`):**
- Start command: `npm install && npm run build`
- Healthcheck: `/`

**Deploy:**
1. Create a PostgreSQL database on Railway → copy `DATABASE_URL`
2. Connect `backend/` as a Railway service → add `DATABASE_URL` variable
3. Connect `frontend/` as a separate Railway service → add `VITE_API_BASE` variable pointing to backend URL
4. Railway auto-deploys on push to connected branch

**Env Vars (Railway → Service → Variables):**
- Backend: `DATABASE_URL` (from Railway PostgreSQL), `PORT`, `NODE_ENV`
- Frontend: `VITE_API_BASE` (e.g. `https://incuxai-backend.up.railway.app/api`)

---

## 10. Where to Find Things (Local)

| What | Local Path |
|------|------------|
| Project root | `D:\code\incux_workshop\` |
| Frontend components | `frontend/src/components/` |
| Frontend data (fallback) | `frontend/src/data/` |
| API client | `frontend/src/services/api.js` |
| Backend server | `backend/server.js` |
| Prisma schema | `backend/prisma/schema.prisma` |
| Backend data (API source) | `backend/data/*.json` |
| Build script | `scripts/build.js` |
| Env template | `.env.example` |

---

## 11. Access & Contacts

| Role | Contact | Notes |
|------|---------|-------|
| **Owner** | ❓ Unknown | Ask **Ashish** (avani890a@gmail.com) |
| **Railway** | `incuxai.work@gmail.com` | Railway account |
| **Database** | — | Railway PostgreSQL Dashboard |
| **GitHub** | `incuxaiwork/incux_workshop` (public) | |

> ⚠️ **Owner not documented.** Railway project name/domain unknown (gap in all_incuxai hub).

---

## 12. Relationship to Other Systems

| System | Relationship |
|--------|--------------|
| **incuxai.com** | Separate paid registration system — this is marketing only |
| **Education Trust** | Payment gateway — not used by this site |
| **JobRecipe** | Separate platform — no shared data |

---

*Generated from README.md, package.json files, and code inspection. Last verified: 2026-11-14.*
