const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// Load environment variables from root .env or backend/.env
const rootEnvPath = path.join(__dirname, '..', '.env');
const backendEnvPath = path.join(__dirname, '.env');
const envPath = fs.existsSync(rootEnvPath) ? rootEnvPath : backendEnvPath;
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  });
}

// Supabase client initialization
const { supabase, isSupabaseConfigured, supabaseUrl } = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Data paths for local JSON fallback
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const UPCOMING_WORKSHOPS_FILE = path.join(DATA_DIR, 'upcoming_workshops.json');
const CUSTOM_REQUESTS_FILE = path.join(DATA_DIR, 'custom_requests.json');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure required files exist
const initFiles = [
  { path: USERS_FILE, default: [] },
  { path: UPCOMING_WORKSHOPS_FILE, default: [] },
  { path: CUSTOM_REQUESTS_FILE, default: [] },
  { path: REGISTRATIONS_FILE, default: [] },
  { path: INQUIRIES_FILE, default: [] }
];

initFiles.forEach(f => {
  if (!fs.existsSync(f.path)) {
    fs.writeFileSync(f.path, JSON.stringify(f.default, null, 2), 'utf-8');
  }
});

// Helper to safely read JSON
const readJson = (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Helper to write JSON
const writeJson = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// ==========================================
// 1. HEALTH & METRICS ROUTES
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'IncuxAI Workshop Backend API',
    database: isSupabaseConfigured ? 'Supabase PostgreSQL' : 'Local JSON Store (fallback)',
    supabaseUrl: supabaseUrl || null,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/workshops', (req, res) => {
  try {
    const data = readJson('workshops.json');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load workshops data' });
  }
});

app.get('/api/companies', (req, res) => {
  try {
    const data = readJson('companies.json');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load companies data' });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const data = readJson('statistics.json');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load statistics data' });
  }
});

app.get('/api/expertise', (req, res) => {
  try {
    const data = readJson('expertise.json');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load expertise data' });
  }
});

app.get('/api/config', (req, res) => {
  try {
    const data = readJson('config.json');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load configuration data' });
  }
});

app.get('/api/news', (req, res) => {
  try {
    const data = readJson('config.json');
    res.json(data.newsPlaceholder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load news placeholder' });
  }
});

// ==========================================
// 2. INQUIRIES ROUTE
// ==========================================
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, institution, role, email, phone, workshopInterest, estimatedStudents, mode, message } = req.body;
    if (!name || !institution || !email) {
      return res.status(400).json({ error: 'Please provide name, institution, and email.' });
    }

    const newInquiry = {
      id: `INQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      name: name.trim(),
      institution: institution.trim(),
      role: role ? role.trim() : 'Academic / Administrator',
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : 'Not provided',
      workshopInterest: workshopInterest || 'General AI & Tech Exploration',
      estimatedStudents: estimatedStudents || '50-100',
      mode: mode || 'Offline Campus Experience',
      message: message ? message.trim() : '',
      status: 'Received'
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('inquiries').insert([newInquiry]);
        if (error) console.warn('[Supabase inquiries error, falling back to JSON]:', error.message);
      } catch (e) {
        console.warn('[Supabase inquiries exception]:', e.message);
      }
    }

    // Always mirror to local JSON for persistence & fallback
    const inquiries = readJson('inquiries.json');
    inquiries.unshift(newInquiry);
    writeJson('inquiries.json', inquiries);

    res.status(201).json({ success: true, message: 'Inquiry received.', inquiryId: newInquiry.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process inquiry' });
  }
});

app.get('/api/inquiries', async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('createdAt', { ascending: false });
      if (!error && data) {
        return res.json({ count: data.length, inquiries: data });
      }
    }
    const inquiries = readJson('inquiries.json');
    res.json({ count: inquiries.length, inquiries });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read inquiries' });
  }
});

// ==========================================
// 3. AUTHENTICATION (ADMIN & CANDIDATE)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (isSupabaseConfigured) {
      try {
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .ilike('email', cleanEmail)
          .eq('password', cleanPassword)
          .single();

        if (!error && user) {
          return res.json({
            success: true,
            user: {
              id: user.id,
              role: user.role,
              name: user.name,
              email: user.email,
              institution: user.institution || ''
            }
          });
        }
      } catch (e) {
        // Fallback to local store
      }
    }

    // Fallback to local users.json
    const users = readJson('users.json');
    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        institution: user.institution || ''
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Authentication error.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, institution, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const newUser = {
      id: `USR-CAND-${Date.now()}`,
      role: 'candidate',
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      institution: institution ? institution.trim() : 'Independent Candidate',
      phone: phone ? phone.trim() : ''
    };

    if (isSupabaseConfigured) {
      try {
        // Check if user already exists in Supabase
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .ilike('email', cleanEmail)
          .single();

        if (existingUser) {
          return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
        }

        const { error: insertError } = await supabase.from('users').insert([newUser]);
        if (insertError) console.warn('[Supabase user insert error]:', insertError.message);
      } catch (e) {
        // Fallback continues
      }
    }

    const users = readJson('users.json');
    const exists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists && !isSupabaseConfigured) {
      return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
    }

    if (!exists) {
      users.push(newUser);
      writeJson('users.json', users);
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: newUser.id,
        role: newUser.role,
        name: newUser.name,
        email: newUser.email,
        institution: newUser.institution
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration error.' });
  }
});

// ==========================================
// 4. WORKSHOPS MANAGEMENT (UPCOMING & POSTING)
// ==========================================
app.get('/api/workshops/upcoming', async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('upcoming_workshops')
        .select('*')
        .order('postedAt', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, workshops: data });
      }
    }

    const workshops = readJson('upcoming_workshops.json');
    res.json({ success: true, count: workshops.length, workshops });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read upcoming workshops.' });
  }
});

app.post('/api/workshops', async (req, res) => {
  try {
    const { title, category, dates, location, seats, mode, speaker, description } = req.body;
    if (!title || !category || !dates || !location) {
      return res.status(400).json({ error: 'Title, category, dates, and location are required.' });
    }

    const newWorkshop = {
      id: `WS-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      dates: dates.trim(),
      location: location.trim(),
      seats: parseInt(seats, 10) || 100,
      registered: 0,
      mode: mode || 'Offline',
      speaker: speaker ? speaker.trim() : 'IncuxAI Technical Mentor',
      description: description ? description.trim() : 'Comprehensive hands-on workshop track.',
      status: 'Active',
      postedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('upcoming_workshops').insert([newWorkshop]);
        if (error) console.warn('[Supabase workshop insert error]:', error.message);
      } catch (e) {
        console.warn('[Supabase workshop insert exception]:', e.message);
      }
    }

    const workshops = readJson('upcoming_workshops.json');
    workshops.unshift(newWorkshop);
    writeJson('upcoming_workshops.json', workshops);

    res.status(201).json({
      success: true,
      message: 'Workshop posted successfully!',
      workshop: newWorkshop
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to post workshop.' });
  }
});

app.delete('/api/workshops/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      try {
        await supabase.from('upcoming_workshops').delete().eq('id', id);
      } catch (e) {
        console.warn('[Supabase workshop delete exception]:', e.message);
      }
    }

    let workshops = readJson('upcoming_workshops.json');
    const beforeCount = workshops.length;
    workshops = workshops.filter(w => w.id !== id);
    if (workshops.length === beforeCount && !isSupabaseConfigured) {
      return res.status(404).json({ error: 'Workshop not found.' });
    }
    writeJson('upcoming_workshops.json', workshops);

    res.json({ success: true, message: 'Workshop removed.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workshop.' });
  }
});

// ==========================================
// 5. CANDIDATE WORKSHOP REGISTRATION
// ==========================================
app.post('/api/workshops/:id/register', async (req, res) => {
  try {
    const { id } = req.params;
    const { candidateName, candidateEmail, candidateInstitution, candidatePhone } = req.body;
    if (!candidateName || !candidateEmail) {
      return res.status(400).json({ error: 'Candidate name and email are required.' });
    }

    let workshop = null;

    if (isSupabaseConfigured) {
      const { data: wsData } = await supabase
        .from('upcoming_workshops')
        .select('*')
        .eq('id', id)
        .single();
      workshop = wsData;
    }

    if (!workshop) {
      const workshops = readJson('upcoming_workshops.json');
      workshop = workshops.find(w => w.id === id);
    }

    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found.' });
    }

    if (workshop.registered >= workshop.seats) {
      return res.status(400).json({ error: 'Sorry, this workshop is already at full capacity!' });
    }

    const cleanEmail = candidateEmail.trim().toLowerCase();

    // Check duplicate registration
    if (isSupabaseConfigured) {
      const { data: existingReg } = await supabase
        .from('registrations')
        .select('id')
        .eq('workshopId', id)
        .ilike('candidateEmail', cleanEmail)
        .single();

      if (existingReg) {
        return res.status(409).json({ error: 'You are already registered for this workshop!' });
      }
    }

    const registrations = readJson('registrations.json');
    const alreadyRegistered = registrations.some(
      r => r.workshopId === id && r.candidateEmail.toLowerCase() === cleanEmail
    );
    if (alreadyRegistered && !isSupabaseConfigured) {
      return res.status(409).json({ error: 'You are already registered for this workshop!' });
    }

    const newReg = {
      id: `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      workshopId: id,
      workshopTitle: workshop.title,
      workshopCategory: workshop.category,
      workshopDates: workshop.dates,
      workshopLocation: workshop.location,
      workshopMode: workshop.mode,
      candidateName: candidateName.trim(),
      candidateEmail: cleanEmail,
      candidateInstitution: candidateInstitution ? candidateInstitution.trim() : 'Not provided',
      candidatePhone: candidatePhone ? candidatePhone.trim() : 'Not provided',
      registeredAt: new Date().toISOString(),
      status: 'Confirmed'
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('registrations').insert([newReg]);
        await supabase
          .from('upcoming_workshops')
          .update({ registered: (workshop.registered || 0) + 1 })
          .eq('id', id);
      } catch (e) {
        console.warn('[Supabase registration exception]:', e.message);
      }
    }

    // Mirror to local store
    registrations.unshift(newReg);
    writeJson('registrations.json', registrations);

    const localWorkshops = readJson('upcoming_workshops.json');
    const localWs = localWorkshops.find(w => w.id === id);
    if (localWs) {
      localWs.registered = (localWs.registered || 0) + 1;
      writeJson('upcoming_workshops.json', localWorkshops);
    }

    res.status(201).json({
      success: true,
      message: `Registration confirmed for "${workshop.title}"!`,
      registration: newReg
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register for workshop.' });
  }
});

app.get('/api/candidates/:email/registrations', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .ilike('candidateEmail', email)
        .order('registeredAt', { ascending: false });

      if (!error && data) {
        return res.json({ success: true, count: data.length, registrations: data });
      }
    }

    const registrations = readJson('registrations.json');
    const userRegs = registrations.filter(r => r.candidateEmail === email);
    res.json({ success: true, count: userRegs.length, registrations: userRegs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get registrations.' });
  }
});

// ==========================================
// 6. COLLABORATION / CUSTOM WORKSHOP REQUESTS
// ==========================================
app.post('/api/collaboration-requests', async (req, res) => {
  try {
    const {
      requestedBy,
      email,
      phone,
      institution,
      preferredLocation,
      topic,
      targetAudience,
      estimatedStudents,
      preferredDates,
      specialRequirements
    } = req.body;

    if (!requestedBy || !email || !institution || !preferredLocation || !topic) {
      return res.status(400).json({
        error: 'Requester name, email, institution, location, and topic requirements are required.'
      });
    }

    const newRequest = {
      id: `REQ-${Date.now()}`,
      requestedBy: requestedBy.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      institution: institution.trim(),
      preferredLocation: preferredLocation.trim(),
      topic: topic.trim(),
      targetAudience: targetAudience ? targetAudience.trim() : 'Undergraduate & Graduate Engineers',
      estimatedStudents: parseInt(estimatedStudents, 10) || 100,
      preferredDates: preferredDates ? preferredDates.trim() : 'Flexible / TBD',
      specialRequirements: specialRequirements ? specialRequirements.trim() : '',
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('custom_requests').insert([newRequest]);
      } catch (e) {
        console.warn('[Supabase custom_requests insert exception]:', e.message);
      }
    }

    const requests = readJson('custom_requests.json');
    requests.unshift(newRequest);
    writeJson('custom_requests.json', requests);

    res.status(201).json({
      success: true,
      message: 'Collaboration request submitted successfully! IncuxAI Admin will review your location and requirements.',
      request: newRequest
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit collaboration request.' });
  }
});

app.get('/api/collaboration-requests', async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('custom_requests')
        .select('*')
        .order('submittedAt', { ascending: false });

      if (!error && data) {
        return res.json({ success: true, count: data.length, requests: data });
      }
    }

    const requests = readJson('custom_requests.json');
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load collaboration requests.' });
  }
});

app.post('/api/collaboration-requests/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    let requestItem = null;

    if (isSupabaseConfigured) {
      const { data } = await supabase
        .from('custom_requests')
        .select('*')
        .eq('id', id)
        .single();
      requestItem = data;
    }

    const requests = readJson('custom_requests.json');
    if (!requestItem) {
      requestItem = requests.find(r => r.id === id);
    }

    if (!requestItem) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    const approvedAt = new Date().toISOString();
    requestItem.status = 'Approved & Published';
    requestItem.approvedAt = approvedAt;

    const newWorkshop = {
      id: `WS-${Date.now()}`,
      title: `${requestItem.topic} @ ${requestItem.institution}`,
      category: requestItem.topic.includes('AI') ? 'Agentic & Generative AI' : 'Campus Immersion',
      dates: requestItem.preferredDates || 'Upcoming Cohort',
      location: requestItem.preferredLocation,
      seats: requestItem.estimatedStudents || 120,
      registered: 0,
      mode: 'Offline',
      speaker: 'IncuxAI Senior Practitioner Lead',
      description: requestItem.specialRequirements || `Specially architected for ${requestItem.targetAudience} at ${requestItem.institution}.`,
      status: 'Active',
      postedAt: new Date().toISOString(),
      convertedFromRequestId: requestItem.id
    };

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('custom_requests')
          .update({ status: 'Approved & Published', approvedAt })
          .eq('id', id);
        await supabase
          .from('upcoming_workshops')
          .insert([newWorkshop]);
      } catch (e) {
        console.warn('[Supabase approve request exception]:', e.message);
      }
    }

    writeJson('custom_requests.json', requests);

    const workshops = readJson('upcoming_workshops.json');
    workshops.unshift(newWorkshop);
    writeJson('upcoming_workshops.json', workshops);

    res.json({
      success: true,
      message: `Request approved! Workshop "${newWorkshop.title}" is now published and open for candidate registrations.`,
      workshop: newWorkshop,
      request: requestItem
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve request.' });
  }
});

app.get('/api/registrations', async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('registeredAt', { ascending: false });

      if (!error && data) {
        return res.json({ success: true, count: data.length, registrations: data });
      }
    }

    const registrations = readJson('registrations.json');
    res.json({ success: true, count: registrations.length, registrations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load registrations.' });
  }
});

// Start server if run directly (local / Render / Railway)
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`[IncuxAI Backend] Server listening at http://localhost:${PORT}`);
    console.log(`[IncuxAI Backend] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[IncuxAI Backend] Database status: ${isSupabaseConfigured ? 'Supabase (' + supabaseUrl + ')' : 'Local JSON Store'}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[IncuxAI Backend] Port ${PORT} is currently in use. Stop the existing process or set PORT in the environment.`);
    } else {
      console.error('[IncuxAI Backend] Server error:', err);
    }
  });
}

// Export for serverless environments (Vercel, AWS Lambda)
module.exports = app;
