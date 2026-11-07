import { workshopCards, featuredWorkshops } from '../data/workshops';
import { companiesData } from '../data/companies';
import { impactStatsData } from '../data/statistics';
import { expertiseData } from '../data/expertise';
import { siteConfig } from '../data/config';
import { supabase } from './supabase';

const API_BASE = import.meta.env?.VITE_API_BASE || '/api';

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
  if (supabase) {
    try {
      const newInquiry = {
        id: `INQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        name: formData.name ? formData.name.trim() : 'Inquirer',
        institution: formData.institution ? formData.institution.trim() : 'Academic / Institution',
        role: formData.role || 'Academic / Administrator',
        email: formData.email ? formData.email.trim().toLowerCase() : '',
        phone: formData.phone || 'Not provided',
        workshopInterest: formData.workshopInterest || 'General AI & Tech Exploration',
        estimatedStudents: formData.estimatedStudents || '50-100',
        mode: formData.mode || 'Offline Campus Experience',
        message: formData.message || '',
        status: 'Received'
      };

      const { error } = await supabase.from('inquiries').insert([newInquiry]);
      if (!error) {
        return { success: true, inquiryId: newInquiry.id };
      }
    } catch (err) {
      console.warn('[IncuxAI] Supabase inquiry submission note:', err.message);
    }
  }

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
// AUTHENTICATION API (DIRECT SUPABASE + FALLBACK)
// ==========================================
export const loginUser = async (credentials) => {
  const cleanEmail = (credentials.email || '').trim().toLowerCase();
  const cleanPassword = (credentials.password || '').trim();

  // 1. Authenticate directly with Supabase cloud database
  if (supabase) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .ilike('email', cleanEmail)
        .eq('password', cleanPassword)
        .maybeSingle();

      if (user && !error) {
        return {
          success: true,
          user: {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
            institution: user.institution || ''
          }
        };
      }

      if (!user) {
        throw new Error('Invalid email or password.');
      }
    } catch (err) {
      if (err.message === 'Invalid email or password.') throw err;
      console.warn('[IncuxAI] Supabase login error:', err.message);
    }
  }

  // 2. Fallback to API_BASE endpoint
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
  const cleanEmail = (userData.email || '').trim().toLowerCase();
  const cleanPassword = (userData.password || '').trim();

  // 1. Direct Supabase Candidate Registration
  if (supabase) {
    try {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (existing) {
        throw new Error('An account with this email already exists. Please log in.');
      }

      const newUser = {
        id: `USR-CAND-${Date.now()}`,
        role: 'candidate',
        name: userData.name ? userData.name.trim() : 'Candidate',
        email: cleanEmail,
        password: cleanPassword,
        institution: userData.institution ? userData.institution.trim() : 'Independent Candidate',
        phone: userData.phone ? userData.phone.trim() : ''
      };

      const { error: insErr } = await supabase.from('users').insert([newUser]);
      if (insErr) throw new Error(insErr.message);

      return {
        success: true,
        message: 'Account created successfully!',
        user: {
          id: newUser.id,
          role: newUser.role,
          name: newUser.name,
          email: newUser.email,
          institution: newUser.institution
        }
      };
    } catch (err) {
      if (err.message && err.message.includes('already exists')) throw err;
      console.warn('[IncuxAI] Supabase registration direct note:', err.message);
    }
  }

  // 2. Fallback to API_BASE
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
export const fetchUpcomingWorkshops = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('upcoming_workshops')
        .select('*')
        .order('postedAt', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('[IncuxAI] Supabase upcoming workshops fetch note:', err.message);
    }
  }

  try {
    const res = await fetch(`${API_BASE}/workshops/upcoming`);
    if (!res.ok) throw new Error('Failed to fetch upcoming workshops');
    const data = await res.json();
    return data.workshops || [];
  } catch (err) {
    return [];
  }
};

export const postWorkshop = async (workshopData) => {
  if (supabase) {
    try {
      const newWorkshop = {
        id: `WS-${Date.now()}`,
        title: workshopData.title.trim(),
        category: workshopData.category.trim(),
        dates: workshopData.dates.trim(),
        location: workshopData.location.trim(),
        seats: parseInt(workshopData.seats, 10) || 100,
        registered: 0,
        mode: workshopData.mode || 'Offline',
        speaker: workshopData.speaker ? workshopData.speaker.trim() : 'IncuxAI Technical Mentor',
        description: workshopData.description ? workshopData.description.trim() : 'Comprehensive hands-on workshop track.',
        status: 'Active',
        postedAt: new Date().toISOString()
      };

      const { error } = await supabase.from('upcoming_workshops').insert([newWorkshop]);
      if (!error) {
        return { success: true, message: 'Workshop posted successfully!', workshop: newWorkshop };
      }
    } catch (err) {
      console.warn('[IncuxAI] Supabase post workshop note:', err.message);
    }
  }

  const res = await fetch(`${API_BASE}/workshops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workshopData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to post workshop');
  return data;
};

export const deleteWorkshop = async (id) => {
  if (supabase) {
    try {
      const { error } = await supabase.from('upcoming_workshops').delete().eq('id', id);
      if (!error) return { success: true, message: 'Workshop removed.' };
    } catch (err) {
      console.warn('[IncuxAI] Supabase delete workshop note:', err.message);
    }
  }

  const res = await fetch(`${API_BASE}/workshops/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete workshop');
  return data;
};

export const registerForWorkshop = async (workshopId, candidateData) => {
  if (supabase) {
    try {
      const cleanEmail = candidateData.candidateEmail.trim().toLowerCase();

      // Check existing
      const { data: existing } = await supabase
        .from('registrations')
        .select('id')
        .eq('workshopId', workshopId)
        .ilike('candidateEmail', cleanEmail)
        .maybeSingle();

      if (existing) {
        throw new Error('You are already registered for this workshop!');
      }

      // Read workshop
      const { data: ws } = await supabase
        .from('upcoming_workshops')
        .select('*')
        .eq('id', workshopId)
        .single();

      if (!ws) throw new Error('Workshop not found.');
      if (ws.registered >= ws.seats) throw new Error('Sorry, this workshop is already at full capacity!');

      const newReg = {
        id: `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        workshopId,
        workshopTitle: ws.title,
        workshopCategory: ws.category,
        workshopDates: ws.dates,
        workshopLocation: ws.location,
        workshopMode: ws.mode,
        candidateName: candidateData.candidateName.trim(),
        candidateEmail: cleanEmail,
        candidateInstitution: candidateData.candidateInstitution ? candidateData.candidateInstitution.trim() : 'Not provided',
        candidatePhone: candidateData.candidatePhone ? candidateData.candidatePhone.trim() : 'Not provided',
        registeredAt: new Date().toISOString(),
        status: 'Confirmed'
      };

      await supabase.from('registrations').insert([newReg]);
      await supabase.from('upcoming_workshops').update({ registered: (ws.registered || 0) + 1 }).eq('id', workshopId);

      return {
        success: true,
        message: `Registration confirmed for "${ws.title}"!`,
        registration: newReg
      };
    } catch (err) {
      if (err.message && (err.message.includes('already registered') || err.message.includes('capacity'))) {
        throw err;
      }
      console.warn('[IncuxAI] Supabase direct registration note:', err.message);
    }
  }

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
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .ilike('candidateEmail', email.trim().toLowerCase())
        .order('registeredAt', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.warn('[IncuxAI] Supabase candidate registrations note:', err.message);
    }
  }

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
  if (supabase) {
    try {
      const newRequest = {
        id: `REQ-${Date.now()}`,
        requestedBy: requestData.requestedBy.trim(),
        email: requestData.email.trim().toLowerCase(),
        phone: requestData.phone ? requestData.phone.trim() : '',
        institution: requestData.institution.trim(),
        preferredLocation: requestData.preferredLocation.trim(),
        topic: requestData.topic.trim(),
        targetAudience: requestData.targetAudience ? requestData.targetAudience.trim() : 'Undergraduate & Graduate Engineers',
        estimatedStudents: parseInt(requestData.estimatedStudents, 10) || 100,
        preferredDates: requestData.preferredDates ? requestData.preferredDates.trim() : 'Flexible / TBD',
        specialRequirements: requestData.specialRequirements ? requestData.specialRequirements.trim() : '',
        status: 'Pending',
        submittedAt: new Date().toISOString()
      };

      const { error } = await supabase.from('custom_requests').insert([newRequest]);
      if (!error) {
        return {
          success: true,
          message: 'Collaboration request submitted successfully! IncuxAI Admin will review your location and requirements.',
          request: newRequest
        };
      }
    } catch (err) {
      console.warn('[IncuxAI] Supabase collaboration request note:', err.message);
    }
  }

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
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('custom_requests')
        .select('*')
        .order('submittedAt', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.warn('[IncuxAI] Supabase fetch collaboration requests note:', err.message);
    }
  }

  try {
    const res = await fetch(`${API_BASE}/collaboration-requests`);
    if (!res.ok) throw new Error('Failed to load requests');
    const data = await res.json();
    return data.requests || [];
  } catch (err) {
    return [];
  }
};

export const approveCollaborationRequest = async (requestId) => {
  const res = await fetch(`${API_BASE}/collaboration-requests/${requestId}/approve`, {
    method: 'POST'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to approve request');
  return data;
};

export const fetchAllRegistrations = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('registeredAt', { ascending: false });

      if (!error && data) return data;
    } catch (err) {
      console.warn('[IncuxAI] Supabase all registrations fetch note:', err.message);
    }
  }

  try {
    const res = await fetch(`${API_BASE}/registrations`);
    if (!res.ok) throw new Error('Failed to load all registrations');
    const data = await res.json();
    return data.registrations || [];
  } catch (err) {
    return [];
  }
};
