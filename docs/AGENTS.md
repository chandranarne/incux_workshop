# incux_workshop — AGENTS.md

> **Operating manual for AI coding agents working in this repository.**
> Read this **first**, before touching any code.

---

## 1. What This Product Is

**IncuxAI Workshop Website Platform** — A modern, animation-rich marketing website for IncuXai workshops.

- **Frontend:** React 19 + Vite 8 + Tailwind 3 + GSAP 3 + Framer Motion 14
- **Backend:** Express 4 + Supabase (PostgreSQL + Auth)
- **Deployment:** Vercel (frontend + serverless API)
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
│   ├── package.json, tailwind.config.js, vite.config.js, vercel.json
├── backend/                           # Express + Supabase
│   ├── data/                          # JSON data (API source + fallback)
│   │   ├── workshops.json, companies.json, statistics.json
│   │   ├── expertise.json, config.json, inquiries.json
│   ├── server.js                      # Express, CORS, validation, endpoints
│   ├── supabaseClient.js              # Supabase singleton
│   ├── database/README.md
│   └── package.json
├── api/
│   └── index.js                       # Vercel serverless wrapper → backend/server.js
├── scripts/build.js                   # Custom Vercel build
├── vercel.json                        # Vercel config
├── package.json                       # Root orchestrator
└── .git
```

---

## 3. Critical Rules (Non-Negotiable)

### 3.1 Supabase & Secrets

- **RLS (Row Level Security) required on EVERY table** before deployment
- Default policy: **deny all**. Write explicit policies scoped to `auth.uid()`
- **NEVER** set RLS policy to `USING (true)` or `FOR ALL` without WHERE condition
- **Service role key bypasses RLS** — **NEVER** expose to frontend (no `VITE_` prefix)
- **Anon key is public** — safe in `VITE_SUPABASE_ANON_KEY`
- All secrets in Vercel Environment Variables (Production scope)

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

### 3.5 Vercel Serverless

- `/api/*` rewrite only exists in production (Vercel)
- **Locally:** run backend directly (`npm run dev:backend`) and set `VITE_API_BASE`
- `api/index.js` is a thin wrapper: `module.exports = require('../backend/server.js')`

---

## 4. Coding Conventions

| Aspect | Convention |
|--------|------------|
| **Frontend** | Functional components, hooks, Tailwind, GSAP/Framer Motion |
| **Components** | Co-locate styles, one component per file |
| **Data** | Static fallback in `frontend/src/data/`; API source in `backend/data/` |
| **Animations** | GSAP for complex sequences, Framer Motion for React transitions |
| **Accessibility** | WCAG 2.2 AA target; keyboard nav, reduced-motion, focus management |
| **Build** | Custom `scripts/build.js` for Vercel; outputs `dist/` |
| **Linting** | `oxlint` (frontend) |

---

## 5. Key Files — What NOT to Touch Without Understanding

| File | Why It's Critical |
|------|-------------------|
| `frontend/src/services/api.js` | API client with **fallback logic** — don't remove fallback |
| `backend/server.js` | All API endpoints, CORS, validation, Supabase queries |
| `backend/supabaseClient.js` | Supabase singleton — used by all server endpoints |
| `backend/data/*.json` | **Source of truth** for API responses + frontend fallback |
| `frontend/src/data/*.js` | Frontend fallback — must stay in sync with backend data |
| `vercel.json` | Build command, output dir, rewrites (`/api/*`, SPA fallback) |
| `scripts/build.js` | Custom Vercel build — don't change without testing deploy |
| `frontend/src/components/ContactCTA.jsx` | Inquiry form → `POST /api/inquiries` |

---

## 6. How to Run Locally

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

# 4. Run (two terminals)
npm run dev:backend    # Express API on its own port
npm run dev:frontend   # Vite dev server

# Note: Vercel's /api/* rewrite is PRODUCTION-ONLY.
# Locally, set VITE_API_BASE=http://localhost:<backend-port>
```

---

## 7. How to Test Changes

| Change | Test |
|--------|------|
| Animation | Check reduced-motion toggle; verify GSAP/Framer Motion |
| API endpoint | `curl http://localhost:<port>/api/workshops` |
| Inquiry form | Submit → check Supabase `inquiries` table |
| Fallback | Kill backend → frontend should show data from `src/data/` |
| Build | `npm run build` → verify `dist/` created |
| Deploy | `vercel --prod` → check live site |

---

## 8. Deployment (Vercel)

**Vercel Config (`vercel.json`):**
- Build: `node scripts/build.js`
- Output: `dist`
- `/api/(.*)` → `api/index.js`
- `/(.*)` → `/index.html` (SPA fallback)

**Deploy:**
```bash
npm run build
vercel --prod
# Or push to connected branch for auto-deploy
```

**Env Vars (Vercel → Project → Settings → Environment Variables → Production):**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only!)

---

## 9. Common Pitfalls

| Pitfall | Prevention |
|---------|------------|
| API 404 locally | Run backend directly; set `VITE_API_BASE` |
| Supabase 401/403 | Check anon key vs service role; RLS policies |
| Build fails on Vercel | `scripts/build.js` paths; env vars at build time |
| Animations broken | GSAP/Framer versions; reduced-motion settings |
| Changes to env ignored | Restart Vite; `VITE_*` requires rebuild on Vercel |

---

## 10. When in Doubt

1. **Read `README.md`** — structure, sections, data compliance
2. **Check `backend/data/*.json`** — source of truth for content
3. **Verify Supabase RLS** — every table must have policies
4. **Trace API client fallback** — `frontend/src/services/api.js`
5. **Don't break the fallback** — it's the offline experience

---

## 11. Contacts

| Role | Contact | Notes |
|------|---------|-------|
| Owner | ❓ Unknown | Ask **Ashish** (avani890a@gmail.com) |
| Vercel/Deployment | — | `incuxai.work@gmail.com` |
| Supabase | ❓ Unknown | Dashboard: supabase.com/dashboard |

---

*Maintained by IncuXai team. Update this file when architecture changes.*