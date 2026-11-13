# incux_workshop — Access & Contacts

> **Status:** 🟢 Live (assumed) | **Last Updated:** 2026-11-12

---

## Where the Code Lives

| Location | Path / URL |
|----------|------------|
| **Local (this laptop)** | `D:\code\incux_workshop\` |
| **GitHub** | https://github.com/incuxaiwork/incux_workshop (public) |
| **Production (Frontend + API)** | Vercel: `incuxai.work@gmail.com` |
| **Database** | Supabase: `supabase.com/dashboard` |

---

## How to Access

### 1. Local Development

```bash
# Clone
git clone https://github.com/incuxaiwork/incux_workshop.git D:\code\incux_workshop

# Configure
cd D:\code\incux_workshop
copy .env.example .env
# Fill: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Install
npm install
cd backend; npm install; cd ..
cd frontend; npm install; cd ..

# Run
npm run dev:backend    # Express API (own port)
npm run dev:frontend   # Vite dev server

# Note: Vercel's /api/* rewrite is production-only.
# Locally, set VITE_API_BASE to backend URL.
```

### 2. Production (Vercel)

```bash
# Vercel CLI
vercel login
vercel link  # ⚠️ Project not verified locally
vercel logs

# Or via dashboard
# https://vercel.com → project → deployments
```

### 3. Supabase

```bash
# Dashboard
# https://supabase.com/dashboard → project

# SQL Editor, Table Editor, Auth, Logs
```

### 4. GitHub

```bash
git clone https://github.com/incuxaiwork/incux_workshop.git
# Public repo - no auth needed for clone
git add -A
git commit -m "your message"
git push origin main  # Triggers Vercel auto-deploy
```

---

## Whom to Contact

| Area | Person | Email | Notes |
|------|--------|-------|-------|
| **Owner** | ❓ Unknown | — | Ask **Ashish** (avani890a@gmail.com) |
| **Vercel/Deployment** | — | `incuxai.work@gmail.com` | Vercel account |
| **Supabase** | ❓ Unknown | — | Dashboard: supabase.com/dashboard |
| **GitHub** | — | — | Public repo: `incuxaiwork/incux_workshop` |

> ⚠️ **Owner not documented in repo.** Vercel project name, domain, and production branch unknown.

---

## Credential Locations (Pointers Only)

| Credential | Where It Lives |
|------------|----------------|
| **Supabase URL** | Vercel env vars; local `.env` |
| **Supabase Anon Key** | Vercel env vars; local `.env` (public) |
| **Supabase Service Role Key** | **Vercel env (server-side only)**; never in frontend |
| **Vercel Account** | `incuxai.work@gmail.com` |
| **Supabase Dashboard** | supabase.com/dashboard |
| **GitHub** | Public repo; `gh auth login` for push |

> **Critical:** `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — **never** expose to frontend (no `VITE_` prefix).

---

## Quick Commands

| Task | Command |
|------|---------|
| Frontend dev | `npm run dev:frontend` |
| Backend dev | `npm run dev:backend` |
| Build | `npm run build` |
| Deploy | `vercel --prod` (or push to main) |
| View Vercel logs | Vercel dashboard → deployments |
| View Supabase logs | Supabase dashboard → logs |
| Run lint | `npm run lint` (frontend) |

---

## Related Documentation

| Doc | Path |
|-----|------|
| Architecture | `docs/ARCHITECTURE.md` |
| Tech Stack | `docs/TECH_STACK.md` |
| AGENTS.md | `docs/AGENTS.md` |
| README | `README.md` |
| Database notes | `backend/database/README.md` |

---

*Last verified: 2026-11-12*