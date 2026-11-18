import { workshopCards, featuredWorkshops } from '../data/workshops';
import { companiesData } from '../data/companies';
import { impactStatsData } from '../data/statistics';
import { expertiseData } from '../data/expertise';
import { siteConfig } from '../data/config';

const API_BASE = import.meta.env?.VITE_API_BASE || '/api';

// ==========================================
// ADMIN SESSION (passphrase, no accounts)
// ==========================================
const ADMIN_TOKEN_KEY = 'incuxai_admin_token';

export const getAdminToken = () => {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

export const setAdminToken = (token) => {
  try {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    // Storage can be unavailable in private modes; the session stays in memory.
  }
};

export const clearAdminToken = () => {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // Ignore storage errors.
  }
};

const adminHeaders = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginAdmin = async (passcode) => {
  const res = await fetch(`${API_BASE}/admin/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Unable to verify the passphrase.');
  return data;
};

export const verifyAdminSession = async () => {
  if (!getAdminToken()) return false;
  try {
    const res = await fetch(`${API_BASE}/admin/session`, { headers: adminHeaders() });
    return res.ok;
  } catch {
    return false;
  }
};

export const fetchWorkshops = async () => {
  try {
    const res = await fetch(`${API_BASE}/workshops`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    return { cards: workshopCards, featured: featuredWorkshops };
  }
};

export const fetchCompanies = async () => {
  try {
    const res = await fetch(`${API_BASE}/companies`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    return companiesData;
  }
};

export const fetchStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    return impactStatsData;
  }
};

export const fetchExpertise = async () => {
  try {
    const res = await fetch(`${API_BASE}/expertise`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    return expertiseData;
  }
};

export const submitInquiry = async (formData) => {
  try {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');
    return { success: true, data };
  } catch (err) {
    return {
      success: true,
      offlineFallback: true,
      message: 'Inquiry received locally!',
      inquiryId: `LOCAL-${Date.now()}`
    };
  }
};

// ==========================================
// AUTHENTICATION API (via Backend API)
// ==========================================
export const loginUser = async (credentials) => {
  const cleanEmail = (credentials.email || '').trim().toLowerCase();
  const cleanPassword = (credentials.password || '').trim();

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid email or password.');
    return data;
  } catch (err) {
    if (err.message === 'Invalid email or password.') throw err;
    throw new Error('Invalid email or password. Please check your credentials.');
  }
};

export const registerCandidate = async (userData) => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  } catch (err) {
    throw new Error(err.message || 'Registration failed. Please check your inputs.');
  }
};

// ==========================================
// WORKSHOPS MANAGEMENT & REGISTRATIONS
// ==========================================
export const DEFAULT_UPCOMING_WORKSHOPS = [
  {
    id: "WS-GENAI-IIT",
    title: "Generative AI Workshop",
    category: "Generative AI",
    dates: "November 20-21, 2026",
    duration: "2-Day Hands-on Workshop",
    location: "IIT Campus",
    seats: 120,
    registered: 42,
    mode: "Offline IIT Campus",
    speaker: "IncuxAI Senior AI Architects & Google/IIT Research Scholars",
    description: "Two-day hands-on workshop at IIT Campus. Deep-dive into LLM fine-tuning, prompt engineering pipelines, autonomous agent architectures, retrieval-augmented generation (RAG), and enterprise deployment sandboxes.",
    status: "Active",
    isPrimary: true,
    postedAt: "2026-11-01T09:00:00Z"
  },
  {
    id: "WS-HYBRID-10D",
    title: "AI Workshop",
    category: "Combined Virtual & Offline Workshop",
    dates: "November 24 - December 3, 2026",
    duration: "10 Days",
    location: "IIT Campus (Offline) + Virtual Cloud Labs",
    seats: 150,
    registered: 34,
    mode: "Combined Virtual & Offline Workshop",
    fee: 6000,
    isPaid: true,
    speaker: "IncuxAI Senior Architects, Enterprise Leads & IIT Faculty",
    description: "10-day comprehensive AI workshop bridging virtual live deep-dives and on-campus physical immersion at IIT Campus. Features Generative AI mastery, LinkedIn personal branding, 2-day in-person IIT lab & networking, hands-on AI Bot building mini-project, and concluding with a grand 24h AI Hackathon.",
    status: "Active",
    isPrimary: false,
    postedAt: "2026-11-16T12:00:00Z"
  }
];

export const fetchUpcomingWorkshops = async () => {
  try {
    const res = await fetch(`${API_BASE}/workshops/upcoming`);
    if (!res.ok) throw new Error('Failed to fetch upcoming workshops');
    const data = await res.json();
    if (data.workshops && data.workshops.length > 0) {
      return data.workshops;
    }
    return DEFAULT_UPCOMING_WORKSHOPS;
  } catch (err) {
    return DEFAULT_UPCOMING_WORKSHOPS;
  }
};

export const postWorkshop = async (workshopData) => {
  const res = await fetch(`${API_BASE}/workshops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify(workshopData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to post workshop');
  return data;
};

export const deleteWorkshop = async (id) => {
  const res = await fetch(`${API_BASE}/workshops/${id}`, {
    method: 'DELETE',
    headers: adminHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete workshop');
  return data;
};

export const registerForWorkshop = async (workshopId, candidateData) => {
  const res = await fetch(`${API_BASE}/workshops/${workshopId}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(candidateData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to register for workshop');
  return data;
};

export const fetchCandidateRegistrations = async (email) => {
  try {
    const res = await fetch(`${API_BASE}/candidates/${encodeURIComponent(email)}/registrations`);
    if (!res.ok) throw new Error('Failed to load candidate registrations');
    const data = await res.json();
    return data.registrations || [];
  } catch (err) {
    return [];
  }
};

// ==========================================
// COLLABORATION / CUSTOM WORKSHOP REQUESTS
// ==========================================
export const submitCollaborationRequest = async (requestData) => {
  const res = await fetch(`${API_BASE}/collaboration-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit request');
  return data;
};

export const fetchCollaborationRequests = async () => {
  try {
    const res = await fetch(`${API_BASE}/collaboration-requests`, { headers: adminHeaders() });
    if (!res.ok) throw new Error('Failed to load requests');
    const data = await res.json();
    return data.requests || [];
  } catch (err) {
    return [];
  }
};

export const approveCollaborationRequest = async (requestId) => {
  const res = await fetch(`${API_BASE}/collaboration-requests/${requestId}/approve`, {
    method: 'POST',
    headers: adminHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to approve request');
  return data;
};

export const fetchAllRegistrations = async () => {
  try {
    const res = await fetch(`${API_BASE}/registrations`, { headers: adminHeaders() });
    if (!res.ok) throw new Error('Failed to load all registrations');
    const data = await res.json();
    return data.registrations || [];
  } catch (err) {
    return [];
  }
};

// ==========================================
// PAYMENTS (IncuXai Education Trust)
// Redirects to trust platform for Razorpay checkout.
// ==========================================

export const initiatePayment = async (
  registrationId,
  workshopId,
  amount,
  workshopTitle,
  payerName,
  payerEmail,
  payerPhone,
  candidateInstitution
) => {
  const res = await fetch(`${API_BASE}/payments/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      registrationId: registrationId || undefined,
      workshopId: workshopId || undefined,
      amount,
      workshopTitle,
      payerName: payerName || '',
      payerEmail: payerEmail || '',
      payerPhone: payerPhone || '',
      candidateInstitution: candidateInstitution || ''
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to initiate payment');
  if (!data.trustUrl) throw new Error('Payment platform did not return a redirect URL.');
  return data;
};

export const confirmPayment = async (reference) => {
  const res = await fetch(`${API_BASE}/payments/confirm?reference=${encodeURIComponent(reference)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Payment confirmation failed');
  return data;
};

export const fetchPaymentStatus = async (registrationId) => {
  try {
    const res = await fetch(`${API_BASE}/payments/status/${registrationId}`);
    if (!res.ok) throw new Error('Failed to load payment status');
    const data = await res.json();
    return data.payment || { status: 'unknown' };
  } catch (err) {
    return { status: 'unknown' };
  }
};

export const fetchAllPayments = async () => {
  try {
    const res = await fetch(`${API_BASE}/payments/all`, { headers: adminHeaders() });
    if (!res.ok) throw new Error('Failed to load payments');
    const data = await res.json();
    return data.payments || [];
  } catch (err) {
    return [];
  }
};
