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
    id: "WS-GENAI-IIT-HYD-NOV28",
    title: "Generative AI Workshop",
    category: "Generative AI, Campus Immersion",
    dates: "November 28-29, 2026",
    duration: "2-Day Offline Workshop",
    location: "IIT Hyderabad",
    seats: 120,
    registered: 0,
    mode: "Offline Campus Immersion",
    fee: 6000,
    isPaid: true,
    speaker: "Elan & nVision with IncuxAI mentors and IIT Hyderabad faculty",
    description: "A two-day beginner-friendly campus immersion at IIT Hyderabad. Learn, explore, build and present with hands-on generative AI tracks, mentor guidance and a mini-project showcase.",
    status: "Active",
    isPrimary: true,
    postedAt: "2026-11-18T00:00:00Z"
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
// GOOGLE SHEETS LIVE SYNC & PAYMENTS API
// ==========================================
export const fetchGoogleSheetsConfig = async () => {
  try {
    const res = await fetch(`${API_BASE}/admin/google-sheets`, { headers: adminHeaders() });
    if (!res.ok) return { webhookUrl: '', sheetUrl: '', lastSyncedAt: null };
    return await res.json();
  } catch (err) {
    return { webhookUrl: '', sheetUrl: '', lastSyncedAt: null };
  }
};

export const saveGoogleSheetsConfig = async (config) => {
  const res = await fetch(`${API_BASE}/admin/google-sheets/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify(config)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save Google Sheets settings');
  return data;
};

export const syncAllToGoogleSheets = async () => {
  const res = await fetch(`${API_BASE}/admin/google-sheets/sync`, {
    method: 'POST',
    headers: adminHeaders()
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || data.data?.error || 'Failed to sync to Google Sheets');
  }
  return data;
};

export const updateRegistrationPayment = async (id, paymentData) => {
  const res = await fetch(`${API_BASE}/registrations/${id}/payment`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify(paymentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update payment status');
  return data;
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

// ==========================================
// GEN AI WORKSHOP (NOVEMBER 28-29) STEP FLOW
// ==========================================
const jsonRequest = async (url, options = {}) => {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed. Please try again.');
  return data;
};

export const fetchGenAiConfig = async () =>
  jsonRequest(`${API_BASE}/genai/config`);

export const validateGenAiReferral = async (code) =>
  jsonRequest(`${API_BASE}/genai/referrals/${encodeURIComponent(code)}/validate`);

export const submitGenAiStep1 = async (details) =>
  jsonRequest(`${API_BASE}/genai/registrations/step1`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details)
  });

export const resumeGenAiRegistration = async (email) => {
  const data = await jsonRequest(
    `${API_BASE}/genai/registrations/resume?email=${encodeURIComponent(email)}`
  );
  return data.registration;
};

export const fetchGenAiRegistration = async (registrationId) => {
  const data = await jsonRequest(`${API_BASE}/genai/registrations/${encodeURIComponent(registrationId)}`);
  return data.registration;
};

export const submitGenAiStep2 = async (registrationId) =>
  jsonRequest(`${API_BASE}/genai/registrations/${encodeURIComponent(registrationId)}/step2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

export const submitGenAiStep3 = async (registrationId, details) =>
  jsonRequest(`${API_BASE}/genai/registrations/${encodeURIComponent(registrationId)}/step3`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details)
  });

export const initiateGenAiPayment = async (registrationId) =>
  jsonRequest(`${API_BASE}/genai/registrations/${encodeURIComponent(registrationId)}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

// ==========================================
// ADMIN REFERRAL CODES
// ==========================================
export const fetchReferralCodes = async () => {
  const data = await jsonRequest(`${API_BASE}/referrals`, { headers: adminHeaders() });
  return data.referrals || [];
};

export const createReferralCode = async (details) =>
  jsonRequest(`${API_BASE}/referrals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify(details)
  });

export const deleteReferralCode = async (code) =>
  jsonRequest(`${API_BASE}/referrals/${encodeURIComponent(code)}`, {
    method: 'DELETE',
    headers: adminHeaders()
  });

// ==========================================
// CONFIG-DRIVEN WORKSHOP FORMS
// ==========================================
export const fetchWorkshopForms = async () => {
  const data = await jsonRequest(`${API_BASE}/forms`, { headers: adminHeaders() });
  return data.forms || [];
};

export const fetchWorkshopFormById = async (id) => {
  const data = await jsonRequest(`${API_BASE}/forms/${encodeURIComponent(id)}`, {
    headers: adminHeaders()
  });
  return data.form;
};

export const createWorkshopForm = async (payload) =>
  jsonRequest(`${API_BASE}/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify(payload)
  });

export const updateWorkshopForm = async (id, payload) =>
  jsonRequest(`${API_BASE}/forms/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...adminHeaders() },
    body: JSON.stringify(payload)
  });

export const deleteWorkshopForm = async (id) =>
  jsonRequest(`${API_BASE}/forms/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders()
  });

export const fetchPublishedWorkshopForm = async (slug) => {
  const data = await jsonRequest(`${API_BASE}/forms/by-slug/${encodeURIComponent(slug)}`);
  return data.form;
};

export const submitFormStep = async (slug, payload) =>
  jsonRequest(`${API_BASE}/forms/${encodeURIComponent(slug)}/steps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

export const resumeFormRegistration = async (slug, email) => {
  const data = await jsonRequest(
    `${API_BASE}/forms/${encodeURIComponent(slug)}/registrations/resume?email=${encodeURIComponent(email)}`
  );
  return data.registration;
};

export const fetchFormRegistration = async (id) => {
  const data = await jsonRequest(`${API_BASE}/forms/registrations/${encodeURIComponent(id)}`);
  return data;
};

export const initiateFormPayment = async (registrationId) =>
  jsonRequest(`${API_BASE}/forms/registrations/${encodeURIComponent(registrationId)}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
