-- ==============================================================================
-- INCUX AI PLATFORM - SUPABASE SEED DATA (MOCK / INITIAL DATA)
-- Run this AFTER executing supabase_schema.sql
-- ==============================================================================

-- 1. Seed Users
INSERT INTO public.users (id, role, name, email, password, institution)
VALUES
  ('USR-ADMIN', 'admin', 'IncuxAI Administrator', 'admin@incuxai.com', 'admin123', 'IncuxAI Leadership Team'),
  ('USR-CAND-1', 'candidate', 'Rahul Varma', 'rahul@student.edu', 'password123', 'IIT Hyderabad'),
  ('USR-CAND-2', 'candidate', 'Pooja Reddy', 'pooja@college.ac.in', 'password123', 'Chalapathi Institute of Technology')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Custom Requests (Needed before workshops because of foreign key)
INSERT INTO public.custom_requests (id, "requestedBy", email, phone, institution, "preferredLocation", topic, "targetAudience", "estimatedStudents", "preferredDates", "specialRequirements", status, "submittedAt", "approvedAt")
VALUES
  ('REQ-1793011996139', 'Rahul Varma', 'rahul@student.edu', '7665061289', 'National Institute of Technology, Trichy', 'Trichy, Tamil Nadu (ECE Seminar Hall)', 'Enterprise Agentic AI & Autonomous Workflows', '3rd & 4th Year B.Tech CSE', 150, 'Next Month (Mid November)', 'Hands-on GPU lab sessions, multi-agent frameworks, live project deployment', 'Approved & Published', '2026-10-26T10:53:16.139Z', '2026-10-26T10:57:43.167Z'),
  ('REQ-501', 'Dr. K. Srinivas', 'srinivas@griet.ac.in', '9848012345', 'GRIET Hyderabad', 'GRIET Campus, Bachupally, Hyderabad', 'Agentic AI with Multi-Agent Workflows', '3rd & 4th Year B.Tech CSE Students', 180, 'December 22–23, 2026', 'Need GPU lab setup guidance, hands-on repository access, and live debugging sessions.', 'Pending', '2026-10-26T10:15:00Z', NULL),
  ('REQ-502', 'Prof. Ananya Roy', 'ananya@vignan.edu', '9876543210', 'Vignan University, Guntur', 'Vignan University Main Auditorium, Vadlamudi, AP', 'Generative AI & LLM Deployment', 'M.Tech & Final Year Engineering', 250, 'January 8–9, 2027', 'Focus on real-world industry case studies from top enterprise companies.', 'Pending', '2026-10-26T11:45:00Z', NULL)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Upcoming Workshops
INSERT INTO public.upcoming_workshops (id, title, category, dates, location, seats, registered, mode, speaker, description, status, "postedAt", "convertedFromRequestId")
VALUES
  ('WS-1793012263168', 'Enterprise Agentic AI & Autonomous Workflows @ National Institute of Technology, Trichy', 'Agentic & Generative AI', 'Next Month (Mid November)', 'Trichy, Tamil Nadu (ECE Seminar Hall)', 150, 1, 'Offline', 'IncuxAI Senior Practitioner Lead', 'Hands-on GPU lab sessions, multi-agent frameworks, live project deployment', 'Active', '2026-10-26T10:57:43.168Z', 'REQ-1793011996139'),
  ('WS-101', 'Autonomous AI Agents & LangGraph Deep Dive', 'Agentic AI', 'November 14–15, 2026', 'IIT Hyderabad Campus', 120, 42, 'Offline', 'Anvesh G (PhD Scholar, IIT Hyderabad)', 'Two-day intensive lab building multi-agent autonomous decision pipelines, human-in-the-loop triggers, and memory storage.', 'Active', '2026-10-26T09:00:00Z', NULL),
  ('WS-102', 'Enterprise Generative AI & LLMOps Pipeline', 'Generative AI', 'November 21–22, 2026', 'Online Live Cohort', 250, 99, 'Online', 'Mohan Sir (Senior Lead at Google)', 'Building fine-tuned SLMs, vector database retrieval architectures, and real-time inference monitoring for production.', 'Active', '2026-10-26T09:30:00Z', NULL),
  ('WS-103', 'Defensive Cloud Security & Zero-Trust Engineering', 'Cloud & Cybersecurity', 'December 5–6, 2026', 'Vijayawada Regional Tech Auditorium', 150, 64, 'Offline', 'Dilip Sir (Cybersecurity Lead, Walmart)', 'Practical containment labs, cloud credential auditing, Kubernetes network policies, and identity federation architectures.', 'Active', '2026-10-26T10:00:00Z', NULL),
  ('WS-104', '5-Day Full-Stack AI System Bootcamp', 'AI Bootcamps', 'December 14–18, 2026', 'Geethanjali College Campus, Hyderabad', 300, 115, 'Offline', 'Rakesh Sir, Rohith Sir, Saibaba Sir, Yaswanth Sir', 'End-to-end full stack architecture integrating fast AI backends, streaming UI components, and containerized deployment.', 'Active', '2026-10-26T10:30:00Z', NULL)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Registrations
INSERT INTO public.registrations (id, "workshopId", "workshopTitle", "workshopCategory", "workshopDates", "workshopLocation", "workshopMode", "candidateName", "candidateEmail", "candidateInstitution", "candidatePhone", "registeredAt", status)
VALUES
  ('REG-1793017313070-342', 'WS-1793012263168', 'Enterprise Agentic AI & Autonomous Workflows @ National Institute of Technology, Trichy', 'Agentic & Generative AI', 'Next Month (Mid November)', 'Trichy, Tamil Nadu (ECE Seminar Hall)', 'Offline', 'Rahul Varma', 'rahul@student.edu', 'IIT Hyderabad', '7665061289', '2026-10-26T12:21:53.070Z', 'Confirmed'),
  ('REG-1793011786043-224', 'WS-102', 'Enterprise Generative AI & LLMOps Pipeline', 'Generative AI', 'November 21–22, 2026', 'Online Live Cohort', 'Online', 'Rahul Varma', 'rahul@student.edu', 'IIT Hyderabad', '7665061289', '2026-10-26T10:49:46.043Z', 'Confirmed'),
  ('REG-801', 'WS-101', 'Autonomous AI Agents & LangGraph Deep Dive', NULL, NULL, NULL, NULL, 'Rahul Varma', 'rahul@student.edu', 'IIT Hyderabad', '9848011223', '2026-10-26T12:00:00Z', 'Confirmed')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Inquiries
INSERT INTO public.inquiries (id, "createdAt", name, institution, role, email, phone, "workshopInterest", "estimatedStudents", mode, message, status)
VALUES
  ('INQ-1793003154296-446', '2026-10-26T08:25:54.296Z', 'Dr. Test Raman', 'IIT Test Campus', 'Faculty Coordinator / Dean', 'raman@college.edu.in', 'Not provided', 'Generative AI & Agentic Systems', '100-250 Students', 'Offline Campus Experience', 'Looking forward to AI workshop in March.', 'Received')
ON CONFLICT (id) DO NOTHING;
