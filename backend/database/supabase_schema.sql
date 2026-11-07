-- ==============================================================================
-- INCUX AI PLATFORM - SUPABASE POSTGRESQL SCHEMA MIGRATION
-- Run this script inside Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. USERS TABLE (Admin & Registered Candidates)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'candidate' CHECK (role IN ('admin', 'candidate')),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  institution TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CUSTOM WORKSHOP REQUESTS (College / Department requests)
CREATE TABLE IF NOT EXISTS public.custom_requests (
  id TEXT PRIMARY KEY,
  "requestedBy" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  institution TEXT NOT NULL,
  "preferredLocation" TEXT NOT NULL,
  topic TEXT NOT NULL,
  "targetAudience" TEXT DEFAULT 'Undergraduate & Graduate Engineers',
  "estimatedStudents" INTEGER DEFAULT 100,
  "preferredDates" TEXT DEFAULT 'Flexible / TBD',
  "specialRequirements" TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending',
  "submittedAt" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  "approvedAt" TIMESTAMPTZ
);

-- 3. UPCOMING WORKSHOPS (Live published sessions)
CREATE TABLE IF NOT EXISTS public.upcoming_workshops (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  dates TEXT NOT NULL,
  location TEXT NOT NULL,
  seats INTEGER NOT NULL DEFAULT 100,
  registered INTEGER NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'Offline',
  speaker TEXT DEFAULT 'IncuxAI Technical Mentor',
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Active',
  "postedAt" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  "convertedFromRequestId" TEXT REFERENCES public.custom_requests(id) ON DELETE SET NULL
);

-- 4. REGISTRATIONS TABLE (Candidate enrollments in workshops)
CREATE TABLE IF NOT EXISTS public.registrations (
  id TEXT PRIMARY KEY,
  "workshopId" TEXT NOT NULL REFERENCES public.upcoming_workshops(id) ON DELETE CASCADE,
  "workshopTitle" TEXT NOT NULL,
  "workshopCategory" TEXT,
  "workshopDates" TEXT,
  "workshopLocation" TEXT,
  "workshopMode" TEXT,
  "candidateName" TEXT NOT NULL,
  "candidateEmail" TEXT NOT NULL,
  "candidateInstitution" TEXT,
  "candidatePhone" TEXT,
  "registeredAt" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed'
);

-- 5. INQUIRIES TABLE (Landing page contact & custom corporate/college inquiries)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  "createdAt" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  role TEXT DEFAULT 'Academic / Administrator',
  email TEXT NOT NULL,
  phone TEXT DEFAULT 'Not provided',
  "workshopInterest" TEXT DEFAULT 'General AI & Tech Exploration',
  "estimatedStudents" TEXT DEFAULT '50-100',
  mode TEXT DEFAULT 'Offline Campus Experience',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'Received'
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR FAST SEARCH & FILTERING
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_registrations_candidateEmail ON public.registrations("candidateEmail");
CREATE INDEX IF NOT EXISTS idx_registrations_workshopId ON public.registrations("workshopId");
CREATE INDEX IF NOT EXISTS idx_upcoming_workshops_status ON public.upcoming_workshops(status);
CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON public.custom_requests(status);

-- ------------------------------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC READ/WRITE POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anon & authenticated roles full access (adjust per production security needs)
CREATE POLICY "Public read and write for users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read and write for custom_requests" ON public.custom_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read and write for upcoming_workshops" ON public.upcoming_workshops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read and write for registrations" ON public.registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read and write for inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);
