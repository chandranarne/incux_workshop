# incux_workshop — Architecture & Design

> **Status:** 🟢 Live (assumed) | **Last Updated:** 2026-11-12 | **Audience:** Developers, AI agents, operators

---

## 1. System Overview

**IncuxAI Workshop Website Platform** — A modern, animation-rich marketing website for IncuXai workshops, structured with separate **frontend** and **backend** layers.

- **Frontend:** React.js + Vite + Tailwind CSS + GSAP (animation)
- **Backend:** Node.js + Express REST API + Supabase (PostgreSQL + Auth)
- **Deployment:** Vercel (frontend + serverless API), Supabase (database)
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
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json                           # Vercel config (rewrites, build)
├── backend/                                  ← Express + Supabase
│   ├── data/                                 ← JSON data files (same as frontend fallback)
│   │   ├── workshops.json
│   │   ├── companies.json
│   │   ├── statistics.json
│   │   ├── expertise.json
│   │   ├── config.json
│   │   └── inquiries.json                    # Persisted inquiry submissions
│   ├── server.js                             ← Express server, CORS, validation
│   ├── supabaseClient.js                     ← Supabase client setup
│   ├── database/README.md                    ← Database notes
│   └── package.json
├── api/
│   └── index.js                              ← Vercel serverless wrapper → backend/server.js
├── scripts/
│   └── build.js                              ← Custom build (Vercel buildCommand)
├── package.json                              ← Root workspace orchestrator
├── vercel.json                               ← Vercel config
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
│  │                         VERCEL (Frontend + API)                     │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                    FRONTEND (React + Vite)                   │  │   │
│  │  │  • 11 animated sections (GSAP, Framer Motion)               │  │   │
│  │  │  • Static data fallback (frontend/src/data/)                │  │   │
│  │  │  • API client with auto-fallback (services/api.js)          │  │   │
│  │  │  • Reduced-motion support, keyboard accessible              │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │                    SERVERLESS API (/api/*)                   │  │   │
│  │  │  • api/index.js → backend/server.js (Express)               │  │   │
│  │  │  • Supabase client for DB operations                        │  │   │
│  │  │  • Endpoints: workshops, companies, stats, expertise,       │  │   │
│  │  │    config, news, inquiries (GET/POST)                       │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         SUPABASE                                     │   │
│  │  • PostgreSQL database                                               │   │
│  │  • Auth (if needed)                                                  │   │
│  │  • Row Level Security (RLS) required on every table                 │   │
│  │  • Tables: inquiries, workshops, companies, stats, expertise        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow

1. **Frontend loads** → Tries API first → Falls back to local `src/data/*.js` if API fails
2. **Inquiry form submit** → `POST /api/inquiries` → Validation → Supabase insert → Response
3. **All read endpoints** → `GET /api/*` → Supabase query → JSON response
4. **Build time** → `VITE_*` env vars inlined → `vercel.json` rewrites `/api/*` to `api/index.js`

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
| `GET` | `/api/health` | Health check, uptime, timestamp |
| `GET` | `/api/workshops` | 5 overview cards + 5 featured achievements |
| `GET` | `/api/companies` | 8 practitioner companies + compliance note |
| `GET` | `/api/stats` | Verified impact statistics + attendance footnote |
| `GET` | `/api/expertise` | 5 expertise tracks + 15 modules |
| `GET` | `/api/config` | Brand mission + contact placeholders |
| `GET` | `/api/news` | Honest news placeholder status |
| `POST` | `/api/inquiries` | Receive & validate institutional inquiries |
| `GET` | `/api/inquiries` | Inspect stored inquiries |

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
| **Database** | Supabase (PostgreSQL) | 2.119.0 |
| **Auth** | Supabase Auth | — |
| **Validation** | Manual (express) | — |
| **Logging** | Morgan | 1.10.0 |
| **Deploy (Frontend)** | Vercel | `vercel.json` config |
| **Deploy (Backend)** | Vercel Serverless | `api/index.js` wrapper |
| **Database Host** | Supabase | Managed PostgreSQL |

---

## 8. Key Config Files

| File | Purpose |
|------|---------|
| `frontend/package.json` | Frontend deps, scripts |
| `frontend/vite.config.js` | Vite config |
| `frontend/tailwind.config.js` | Tailwind config |
| `backend/package.json` | Backend deps, scripts |
| `backend/server.js` | Express server, endpoints |
| `backend/supabaseClient.js` | Supabase client singleton |
| `backend/data/*.json` | Static data (fallback + API source) |
| `api/index.js` | Vercel serverless wrapper |
| `scripts/build.js` | Custom Vercel build |
| `vercel.json` | Vercel config (rewrites, build, output) |
| `.env.example` | Env template (Supabase keys) |

---

## 9. Deployment (Vercel)

**Vercel Config (`vercel.json`):**
```json
{
  "buildCommand": "node scripts/build.js",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- **Build:** `node scripts/build.js` → outputs `dist/`
- **API:** `/api/*` → `api/index.js` (serverless wrapper around `backend/server.js`)
- **SPA Fallback:** `/(.*)` → `/index.html`
- **Env Vars (Vercel Dashboard):** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

---

## 10. Where to Find Things (Local)

| What | Local Path |
|------|------------|
| Project root | `D:\code\incux_workshop\` |
| Frontend components | `frontend/src/components/` |
| Frontend data (fallback) | `frontend/src/data/` |
| API client | `frontend/src/services/api.js` |
| Backend server | `backend/server.js` |
| Supabase client | `backend/supabaseClient.js` |
| Backend data (API source) | `backend/data/*.json` |
| Vercel config | `vercel.json` |
| Build script | `scripts/build.js` |
| Database notes | `backend/database/README.md` |
| Env template | `.env.example` |

---

## 11. Access & Contacts

| Role | Contact | Notes |
|------|---------|-------|
| **Owner** | ❓ Unknown | Ask **Ashish** (avani890a@gmail.com) |
| **Vercel** | `incuxai.work@gmail.com` | Vercel account |
| **Supabase** | ❓ Unknown | Dashboard: supabase.com/dashboard |
| **GitHub** | `incuxaiwork/incux_workshop` (public) | |

> ⚠️ **Owner not documented.** Vercel project name/domain/branch unknown (gap in all_incuxai hub).

---

## 12. Relationship to Other Systems

| System | Relationship |
|--------|--------------|
| **incuxai.com** | Separate paid registration system — this is marketing only |
| **Education Trust** | Payment gateway — not used by this site |
| **JobRecipe** | Separate platform — no shared data |

---

*Generated from README.md, package.json files, and code inspection. Last verified: 2026-11-12.*