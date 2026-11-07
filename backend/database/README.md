# IncuxAI - Supabase Database Setup & Integration Guide

This guide walks you through setting up a production-ready PostgreSQL cloud database on **Supabase** for the IncuxAI platform.

---

## 1. Why Supabase?

The IncuxAI platform currently uses local JSON files in `backend/data/` as a local MVP datastore.
Supabase replaces these flat files with a real PostgreSQL database with:
- **Persistent Cloud Storage**: Data is safely stored and backed up in the cloud.
- **Concurrent Access**: Multiple candidates and admins can register and submit requests simultaneously without file lock issues.
- **Row Level Security (RLS)**: Enforces access controls at the database level.
- **Instant REST & Realtime APIs**: Out of the box.

---

## 2. Step-by-Step Setup on Supabase

### Step 1: Create a Free Project
1. Go to [supabase.com](https://supabase.com) and click **"Start your project"**.
2. Sign in with GitHub or your email.
3. Click **"New Project"**.
4. Configure your project:
   - **Name**: `incux-workshop`
   - **Database Password**: Choose a strong password (save it safely).
   - **Region**: Choose the closest region (e.g. `South Asia (Mumbai)` for India).
   - **Pricing Plan**: Free tier ($0).
5. Click **"Create new project"** (Supabase will take ~1-2 minutes to provision the database).

---

### Step 2: Get Your API Keys
1. In the Supabase left sidebar, click the **Settings icon (⚙️)** -> **API**.
2. Copy the following values:
   - **Project URL**: e.g., `https://xyzabcdefghijklm.supabase.co`
   - **`anon` `public` key**: Safe for browser / frontend usage.
   - **`service_role` `secret` key**: Backend-only key (bypasses RLS).
3. Open the single root `.env` file at the root of this project (`d:\incux_workshop\.env`) and paste your keys:
   ```env
   # --- SUPABASE CONFIGURATION ---
   SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_URL=https://your-project-id.supabase.co

   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

### Step 3: Run the SQL Schema & Seed Migration
1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar.
2. Click **"New query"**.
3. Open [`backend/database/supabase_schema.sql`](./supabase_schema.sql) in this repo, copy all of its content, paste it into the SQL Editor, and click **"Run"** (or press `Ctrl + Enter`).
   > This creates the 5 tables: `users`, `custom_requests`, `upcoming_workshops`, `registrations`, and `inquiries`, along with indexes and Row Level Security policies.
4. Click **"New query"** again.
5. Open [`backend/database/supabase_seed.sql`](./supabase_seed.sql), copy all of its content, paste it into the SQL Editor, and click **"Run"**.
   > This imports all existing workshops, initial users (including Admin), registrations, and college requests.
6. Click **"Table Editor"** in the left sidebar: you will now see all 5 tables populated with real data!

---

## 3. How to Connect in Backend (Node / Express)

### Install the Supabase Client
In `backend/`:
```bash
cd backend
npm install @supabase/supabase-js
```

### Initialize the Supabase Client
Create `backend/supabaseClient.js`:
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] SUPABASE_URL or keys not found in root .env. Falling back to local data.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
```

---

## 4. Single `.env` File Architecture

Vite (frontend) and Node (backend) now share **one single root `.env`**:
- **Root `.env` location**: `d:\incux_workshop\.env`
- **Frontend access**: In `frontend/vite.config.js`, `envDir: '../'` instructs Vite to load `.env` from the project root. Any variable prefixed with `VITE_` (such as `VITE_API_BASE`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) is automatically accessible via `import.meta.env.*`.
- **Backend access**: `backend/server.js` checks `path.join(__dirname, '..', '.env')` first, giving access to `process.env.*`.
