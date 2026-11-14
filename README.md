# IncuxAI Workshop Website Platform

A modern, animation-rich website MVP for **IncuxAI** structured with separate **frontend** and **backend** layers, engineered in strict accordance with the **IncuxAI Workshop Website MVP Specification**.

**Database:** Railway PostgreSQL + Prisma ORM (Supabase removed)
**Deployment:** Railway (backend + frontend deployed individually)

---

## 🏗️ Architecture & Project Structure

The project is split into clean, modular frontend and backend codebases:

```
d:\Incux_workshop\
├── frontend\                         # React.js + Vite + Tailwind CSS + GSAP
│   ├── src\
│   │   ├── components\
│   │   │   ├── IntroAnimation.jsx    # Section 01: Character reveal (2-3s)
│   │   │   ├── Navbar.jsx            # Header with bright rounded menu button
│   │   │   ├── MenuOverlay.jsx       # Full-screen overlay menu (Escape/focus lock)
│   │   │   ├── Hero.jsx              # Section 02: 100svh hero, 2 CTAs, oversized WORKSHOPS
│   │   │   ├── OurWork.jsx           # Section 03: Pinned horizontal scroll on desktop
│   │   │   ├── WorkshopCard.jsx      # Individual workshop format cards
│   │   │   ├── CompanyGrid.jsx       # Section 04: 8 typographic wordmarks + disclaimer
│   │   │   ├── ImpactStats.jsx       # Section 05: Warm cream background, count-up stats
│   │   │   ├── FeaturedWorkshops.jsx # Section 06: 5 documented achievements (asymmetric layout)
│   │   │   ├── Expertise.jsx         # Section 07: 15 topics in 5 groups with category switcher
│   │   │   ├── HowWeWork.jsx         # Section 08: 4 delivery phases
│   │   │   ├── About.jsx             # Section 09: Official mission statement
│   │   │   ├── NewsSection.jsx       # Honest transparency placeholder
│   │   │   ├── ContactCTA.jsx        # Section 10: Backend inquiry form + config placeholders
│   │   │   └── Footer.jsx            # Section 11: Navigation, categories, and copyright
│   │   ├── data\                     # Local static datasets (offline fallback)
│   │   │   ├── config.js
│   │   │   ├── workshops.js
│   │   │   ├── companies.js
│   │   │   ├── statistics.js
│   │   │   └── expertise.js
│   │   ├── services\
│   │   │   └── api.js                # API client with automatic fallback
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend\                          # Node.js + Express REST API + Prisma ORM
│   ├── data\
│   │   ├── workshops.json            # Structured workshop cards & featured events
│   │   ├── companies.json            # 8 practitioner companies
│   │   ├── statistics.json           # Documented attendance metrics
│   │   ├── expertise.json            # 15 topics across 5 tracks
│   │   ├── config.json               # Central configuration placeholders
│   │   └── inquiries.json            # Persisted institutional inquiry submissions
│   ├── server.js                     # Express server, CORS, input validation, endpoints
│   ├── prisma\                       # Prisma schema & migrations
│   │   └── schema.prisma             # Prisma data model (Railway PostgreSQL)
│   ├── .env                          # Backend environment variables (DATABASE_URL)
│   ├── railway.json                  # Railway deployment config
│   └── package.json
│
├── frontend\                         # React.js + Vite + Tailwind CSS + GSAP
│   ├── src\
│   │   ├── components\
│   │   │   ├── IntroAnimation.jsx    # Section 01: Character reveal (2-3s)
│   │   │   ├── Navbar.jsx            # Header with bright rounded menu button
│   │   │   ├── MenuOverlay.jsx       # Full-screen overlay menu (Escape/focus lock)
│   │   │   ├── Hero.jsx              # Section 02: 100svh hero, 2 CTAs, oversized WORKSHOPS
│   │   │   ├── OurWork.jsx           # Section 03: Pinned horizontal scroll on desktop
│   │   │   ├── WorkshopCard.jsx      # Individual workshop format cards
│   │   │   ├── CompanyGrid.jsx       # Section 04: 8 typographic wordmarks + disclaimer
│   │   │   ├── ImpactStats.jsx       # Section 05: Warm cream background, count-up stats
│   │   │   ├── FeaturedWorkshops.jsx # Section 06: 5 documented achievements (asymmetric layout)
│   │   │   ├── Expertise.jsx         # Section 07: 15 topics in 5 groups with category switcher
│   │   │   ├── HowWeWork.jsx         # Section 08: 4 delivery phases
│   │   │   ├── About.jsx             # Section 09: Official mission statement
│   │   │   ├── NewsSection.jsx       # Honest transparency placeholder
│   │   │   ├── ContactCTA.jsx        # Section 10: Backend inquiry form + config placeholders
│   │   │   └── Footer.jsx            # Section 11: Navigation, categories, and copyright
│   │   ├── data\                     # Local static datasets (offline fallback)
│   │   │   ├── config.js
│   │   │   ├── workshops.js
│   │   │   ├── companies.js
│   │   │   ├── statistics.js
│   │   │   └── expertise.js
│   │   ├── services\
│   │   │   └── api.js                # API client with automatic fallback
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env                          # Frontend environment variables (VITE_API_BASE)
│   ├── package.json                  # build + start (vite preview) scripts
│   ├── tailwind.config.js
│   └── vite.config.js                # dev + preview server config (port, /api proxy)
│
└── package.json                      # Root workspace orchestrator
```

---

## 🚀 Quick Start Guide

### 1. Run the Backend API Server
```bash
cd backend
npm install
npx prisma generate
npm run dev
# Server listening at http://localhost:5000
```
> Make sure `backend/.env` has a valid `DATABASE_URL` pointing to your Railway PostgreSQL.  
> If no DATABASE_URL is set, the backend falls back to local JSON files.

### 2. Run the Frontend Client
```bash
cd frontend
npm install
npm run dev
# Vite client ready at http://localhost:5173
```
> Set `VITE_API_BASE=http://localhost:5000/api` in `frontend/.env`.

---

## 🚄 Deploy on Railway

Backend and frontend are deployed individually on Railway.

### Backend (Railway)
1. Create a PostgreSQL database on Railway → copy `DATABASE_URL`
2. Set `DATABASE_URL` in Railway Variables for the backend service
3. Connect the `backend/` folder as a Railway service
4. `backend/railway.json` runs: `npm run prisma:generate && (npx prisma migrate deploy || npx prisma db push --skip-generate) && npm start`
5. Healthcheck: `/api/health`

### Frontend (Railway)
1. Connect the `frontend/` folder as a separate Railway service
2. Node 22 is picked up from `.nvmrc` / `engines.node`
3. No deploy config file is needed. Railway builds with `npm run build` and starts with `npm start` (`vite preview`), which reads `PORT` from the environment
4. `/api/*` is proxied to the backend from `vite.config.js`. Set `API_PROXY_TARGET` in Railway Variables to the backend URL (the private URL `http://backend.railway.internal:5000` keeps traffic off the public edge). Nothing is hardcoded: if it is missing, `/api` answers `503` with a message naming the variable instead of falling back to `localhost`

Production behaviour of `vite preview`, configured in `vite.config.js`:

| Concern | Behaviour |
| :--- | :--- |
| Compression | gzip for text assets (Vite built-in) |
| HTML caching | `Cache-Control: no-cache` plus ETag, so updates appear immediately |
| Hashed assets | `Cache-Control: public, max-age=31536000, immutable` |
| SPA routes | Unknown extensionless paths fall back to `index.html` |
| Missing files | Real `404`, not an HTML fallback |
| API | `/api/*` same-origin proxy to the backend, no CORS needed |

### Admin console

The admin console lives at **`/admin`** (not a hidden button). It is a real
path, served by the SPA fallback on both `vite preview` and `vite dev`.

1. Set `ADMIN_PASSCODE` in Railway Variables on the **backend** service
2. Visit `https://workshops.incuxai.com/admin`
3. Enter the passphrase; the backend issues a signed session token valid for 8 hours
4. The token is stored in `sessionStorage` and sent as `Authorization: Bearer <token>`

Admin backend routes are all protected by that token: `POST /api/workshops`,
`DELETE /api/workshops/:id`, `POST /api/collaboration-requests/:id/approve`,
`GET /api/registrations`, `GET /api/inquiries`, and `GET /api/collaboration-requests`.
Without a token they answer `401`. Passphrase attempts are rate limited to
8 per 15 minutes per IP.

---

## 🔌 Backend REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check, server uptime, and timestamp |
| `GET` | `/api/workshops` | Returns the 5 overview cards and 5 documented workshop achievements |
| `GET` | `/api/companies` | Returns the 8 practitioner companies with compliance note |
| `GET` | `/api/stats` | Returns verified impact statistics and attendance footnote |
| `GET` | `/api/expertise` | Returns the 5 expertise tracks and 15 individual modules |
| `GET` | `/api/config` | Returns brand mission and central contact placeholders |
| `GET` | `/api/news` | Returns the honest news placeholder status |
| `POST` | `/api/inquiries` | Receives and validates institutional collaboration inquiries |
| `GET` | `/api/inquiries` | Inspects stored inquiries in `inquiries.json` |

---

## 🎨 Design & Data Accuracy Highlights

1. **Aesthetics Inspired by workshop.com**:
   - Deep graphite `#0e0f12` and charcoal `#14151a` canvases.
   - Vivid lime/chartreuse `#ccff00` accents for buttons and interactive details.
   - Contrasting warm cream `#f7f5f0` for Section 05 (Our Impact).
   - Space Grotesk headline typography with intentional line breaks and Inter for body text.
   - Oversized "WORKSHOPS" rising typography with zero horizontal overflow.
2. **Strict Data Compliance**:
   - 950+ counts cumulative verified workshop participations (200 + 150 + 500 + 100), never claiming 950 unique individuals.
   - GITAM bootcamp is not added into attendance total.
   - No fabricated dates or testimonials.
   - The 8 company names (Google, Walmart, Microsoft, Deloitte, TCS, Genpact, Johnson & Johnson, Tech Mahindra) are rendered as typographic wordmarks without logos, accurately describing practitioner experience without claiming false sponsorships.
3. **Accessibility**:
   - Keyboard accessible full-screen menu with Escape listener and scroll locking.
   - Dedicated `prefers-reduced-motion` toggle switch on navbar and OS detection.
