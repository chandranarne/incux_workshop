import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Prisma client initialization (Railway PostgreSQL)
let prisma = null;
let isDatabaseConfigured = false;
try {
  if (process.env.DATABASE_URL) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
    });
    isDatabaseConfigured = true;
    console.log('[IncuxAI Prisma] Initialized PostgreSQL client (Railway)');
  } else {
    console.log('[IncuxAI Prisma] DATABASE_URL not set (falling back to local JSON store).');
  }
} catch (err) {
  console.warn('[IncuxAI Prisma] Failed to initialize Prisma client:', err.message);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ==========================================
// ADMIN SESSION (passphrase, no user accounts)
// ==========================================
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || '';
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || ADMIN_PASSCODE || 'incuxai-local-admin-secret';
const ADMIN_SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours
const ADMIN_MAX_ATTEMPTS = 8;
const ADMIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const adminAttempts = new Map();

const signAdminToken = (expiresAt) => {
  const payload = String(expiresAt);
  const signature = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(payload).digest('base64url');
  return `${Buffer.from(payload).toString('base64url')}.${signature}`;
};

const verifyAdminToken = (token) => {
  if (typeof token !== 'string' || !token.includes('.')) return false;
  const [encoded, signature] = token.split('.');
  let expiresAt;
  try {
    expiresAt = Number(Buffer.from(encoded, 'base64url').toString('utf8'));
  } catch {
    return false;
  }
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const expected = crypto.createHmac('sha256', ADMIN_TOKEN_SECRET).update(String(expiresAt)).digest('base64url');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
};

const readAdminToken = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
};

const requireAdmin = (req, res, next) => {
  if (!ADMIN_PASSCODE) {
    return res.status(503).json({
      error: 'Admin access is not configured. Set ADMIN_PASSCODE in the backend environment.'
    });
  }
  if (!verifyAdminToken(readAdminToken(req))) {
    return res.status(401).json({ error: 'Admin session missing or expired. Sign in again.' });
  }
  next();
};

app.post('/api/admin/session', (req, res) => {
  if (!ADMIN_PASSCODE) {
    return res.status(503).json({
      error: 'Admin access is not configured. Set ADMIN_PASSCODE in the backend environment.'
    });
  }

  const ip = req.ip || 'unknown';
  const now = Date.now();
  const attempts = adminAttempts.get(ip) || { count: 0, first: now };
  if (now - attempts.first > ADMIN_ATTEMPT_WINDOW_MS) {
    attempts.count = 0;
    attempts.first = now;
  }
  if (attempts.count >= ADMIN_MAX_ATTEMPTS) {
    return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });
  }

  const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
  if (!passcode || passcode !== ADMIN_PASSCODE) {
    attempts.count += 1;
    adminAttempts.set(ip, attempts);
    return res.status(401).json({ error: 'Incorrect passphrase.' });
  }

  adminAttempts.delete(ip);
  const expiresAt = Date.now() + ADMIN_SESSION_MS;
  res.json({
    success: true,
    token: signAdminToken(expiresAt),
    expiresAt: new Date(expiresAt).toISOString()
  });
});

app.get('/api/admin/session', requireAdmin, (req, res) => {
  res.json({ success: true });
});

// ==========================================
// PAYMENT GATEWAY (IncuXai Education Trust)
// Redirects to trust platform for Razorpay checkout.
// Token signing is HMAC-SHA256 JWT-like, same algorithm as
// incuxai.com's TrustPaymentToken.php.
// ==========================================
const TRUST_PAYMENT_SECRET = process.env.TRUST_PAYMENT_SECRET || '';
const TRUST_PAYMENT_URL = process.env.TRUST_PAYMENT_URL || 'https://www.incuxaieducationtrust.org';
const TRUST_PAYMENT_APP_ID = process.env.TRUST_PAYMENT_APP_ID || 'workshops';
const PAYMENT_RETURN_URL = process.env.PAYMENT_RETURN_URL || 'https://workshops.incuxai.com/payment/success';
const PAYMENT_CANCEL_URL = process.env.PAYMENT_CANCEL_URL || 'https://workshops.incuxai.com/payment/cancel';
const PAYMENT_WEBHOOK_URL = process.env.PAYMENT_WEBHOOK_URL || 'https://workshops.incuxai.com/api/payments/webhook';

// ==========================================
// GEN AI WORKSHOP, NOVEMBER 28-29
// Single source of truth for the step-wise registration flow.
// ==========================================
const GENAI_WORKSHOP_ID = process.env.GENAI_WORKSHOP_ID || 'WS-GENAI-IIT-HYD-NOV28';
const GENAI_WORKSHOP_TITLE = 'Generative AI Workshop';
const GENAI_BASE_PRICE = Number(process.env.GENAI_BASE_PRICE || 6000);
const GENAI_PLATFORM_FEE_PERCENT = Number(process.env.GENAI_PLATFORM_FEE_PERCENT || 2);
const ACCOMMODATION_PAYMENT_URL =
  process.env.ACCOMMODATION_PAYMENT_URL || 'https://pages.razorpay.com/pl_TsSavHEBuYVOq4/view';
const ACCOMMODATION_WHATSAPP_URL =
  process.env.ACCOMMODATION_WHATSAPP_URL ||
  'https://chat.whatsapp.com/LLw0x8t4OEqGkXPDBGtDdh?s=sh&p=a&iam=2';

const GENAI_GENDERS = ['Male', 'Female', 'Other'];
const GENAI_YEARS = ['1', '2', '3', '4', 'Graduated'];

const normalizeReferralCode = (value) =>
  String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '');

const calculateGenAiQuote = (discountAmount = 0) => {
  const base = Math.max(0, Math.round(GENAI_BASE_PRICE || 0));
  const discount = Math.min(base, Math.max(0, Math.round(Number(discountAmount) || 0)));
  const discountedBase = base - discount;
  const platformFee = Math.round((discountedBase * GENAI_PLATFORM_FEE_PERCENT) / 100);
  return {
    base,
    discount,
    discountedBase,
    platformFee,
    platformFeePercent: GENAI_PLATFORM_FEE_PERCENT,
    total: discountedBase + platformFee,
    currency: 'INR'
  };
};

const findActiveReferral = async (code) => {
  const normalized = normalizeReferralCode(code);
  if (!normalized || !isDatabaseConfigured) return null;
  try {
    return await prisma.referralCode.findFirst({
      where: { code: normalized, active: true }
    });
  } catch (err) {
    console.warn('[Referral lookup error]:', err.message);
    return null;
  }
};

const genAiRegistrationView = (registration) => {
  if (!registration) return null;
  return {
    id: registration.id,
    registrationCode: registration.registrationCode,
    fullName: registration.candidateName,
    gender: registration.gender,
    email: registration.candidateEmail,
    phone: registration.candidatePhone,
    department: registration.department,
    yearOfStudy: registration.yearOfStudy,
    college: registration.college,
    collegeLocation: registration.collegeLocation,
    hostelAccommodation: registration.hostelAccommodation,
    accommodationPaid: registration.accommodationPaid,
    termsAccepted: registration.termsAccepted,
    referralCode: registration.referralCode,
    discountAmount: registration.discountAmount,
    paymentStatus: registration.paymentStatus,
    currentStep: registration.currentStep
  };
};

/**
 * Sign a JWT-like HMAC-SHA256 token, compatible with the trust platform's
 * verifyToken() and incuxai.com's TrustPaymentToken::sign().
 */
const signTrustToken = (payload) => {
  const secret = (TRUST_PAYMENT_SECRET || '').trim();
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
};

/** Verify a JWT-like HMAC-SHA256 token issued by the trust platform. */
const verifyTrustToken = (token) => {
  try {
    if (!token) return null;
    const parts = String(token).split('.');
    if (parts.length !== 3) return null;
    const [headerB64, bodyB64, signature] = parts;
    const expected = crypto
      .createHmac('sha256', (TRUST_PAYMENT_SECRET || '').trim())
      .update(`${headerB64}.${bodyB64}`)
      .digest('base64url');
    if (signature !== expected) return null;
    return JSON.parse(Buffer.from(bodyB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
};

/**
 * Apply a captured payment to Railway PostgreSQL.
 * Idempotent: a second call (redirect confirm after webhook, or a page reload)
 * never double-increments the workshop registration count.
 */
const markPaymentPaid = async ({ transactionId, registrationId, details }) => {
  if (!isDatabaseConfigured) return { updated: false, reason: 'database unavailable' };

  let payment = null;
  if (transactionId) {
    payment = await prisma.payment.findFirst({
      where: { gatewayResponse: { path: ['transactionId'], equals: transactionId } },
      include: { registration: true }
    });
  }
  if (!payment && registrationId) {
    payment = await prisma.payment.findFirst({
      where: { registrationId },
      orderBy: { createdAt: 'desc' },
      include: { registration: true }
    });
  }
  if (!payment) return { updated: false, reason: 'payment record not found' };
  if (payment.status === 'paid') return { updated: false, alreadyPaid: true, payment };

  const previous =
    payment.gatewayResponse && typeof payment.gatewayResponse === 'object'
      ? payment.gatewayResponse
      : {};

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'paid',
      razorpayOrderId: details?.razorpay_order_id || payment.razorpayOrderId,
      razorpayPaymentId: details?.razorpay_payment_id || payment.razorpayPaymentId,
      gatewayResponse: {
        ...previous,
        confirmedAt: new Date().toISOString(),
        confirmation: details || {}
      }
    }
  });

  const regId = payment.registrationId || details?.metadata?.registrationId || registrationId;
  if (regId) {
    await prisma.registration.updateMany({
      where: { id: regId },
      data: { paymentStatus: 'paid' }
    });

    const reg = await prisma.registration.findUnique({ where: { id: regId } }).catch(() => null);
    if (reg?.workshopId) {
      // updateMany is a no-op when the workshop row is absent, so a payment for
      // a default/frontend-only workshop never throws here.
      await prisma.upcomingWorkshop.updateMany({
        where: { id: reg.workshopId },
        data: { registered: { increment: 1 } }
      });
    }
  }

  return { updated: true, payment };
};

/**
 * Call the trust platform's /api/payments/confirm to redeem a success_token.
 */
const trustConfirm = async (reference) => {
  const res = await fetch(`${TRUST_PAYMENT_URL}/api/payments/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference })
  });
  if (!res.ok) throw new Error(`Trust confirm failed: HTTP ${res.status}`);
  return res.json();
};

/**
 * Create a signed trust checkout session and store the pending payment.
 * All callers pass a trusted amount, so the browser can never set the price.
 */
const createTrustPaymentSession = async ({
  registrationId,
  workshopId,
  amountInPaise,
  currency = 'INR',
  workshopTitle,
  payerName,
  payerEmail,
  payerPhone,
  candidateInstitution,
  returnUrl = PAYMENT_RETURN_URL,
  metadata = {}
}) => {
  if (!registrationId) throw new Error('registrationId is required.');
  if (!amountInPaise || amountInPaise <= 0) throw new Error('A positive amount is required.');

  const transactionId = `WS-${registrationId}-${Date.now()}`;
  const token = signTrustToken({
    transaction_id: transactionId,
    amount: amountInPaise,
    currency,
    customer: { name: payerName || '', email: payerEmail || '', phone: payerPhone || '' },
    metadata: {
      registrationId,
      workshopId: workshopId || '',
      workshopTitle: workshopTitle || '',
      source: 'workshops_incuxai_com',
      ...metadata
    },
    callback_url: PAYMENT_WEBHOOK_URL
  });

  const trustUrl = `${TRUST_PAYMENT_URL}/pay?token=${encodeURIComponent(token)}&app=${encodeURIComponent(TRUST_PAYMENT_APP_ID)}&redirect=${encodeURIComponent(returnUrl)}`;

  let payment = null;
  if (isDatabaseConfigured) {
    try {
      let workshopLink = null;
      if (workshopId) {
        try {
          const ws = await prisma.upcomingWorkshop.findUnique({ where: { id: workshopId } });
          if (ws) workshopLink = workshopId;
        } catch {
          // Workshop not found. The payment still records the workshop id in metadata.
        }
      }

      payment = await prisma.payment.create({
        data: {
          id: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          registrationId,
          upcomingWorkshopId: workshopLink,
          razorpayOrderId: null,
          amount: amountInPaise,
          currency,
          status: 'pending',
          gatewayResponse: { transactionId, trustUrl, token }
        }
      });
    } catch (e) {
      console.warn('[Prisma payment create error]:', e.message);
    }
  }

  return {
    success: true,
    trustUrl,
    token,
    appId: TRUST_PAYMENT_APP_ID,
    registrationId,
    paymentId: payment?.id,
    transactionId,
    amount: amountInPaise,
    currency
  };
};

// POST /api/payments/initiate - Legacy payment entry point.
// The GenAI registration flow uses the trusted route below instead.
app.post('/api/payments/initiate', async (req, res) => {
  try {
    const {
      registrationId,
      workshopId,
      amount,
      currency = 'INR',
      workshopTitle,
      payerName,
      payerEmail,
      payerPhone,
      candidateInstitution
    } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'amount is required.' });
    }

    let regId = registrationId;
    if (!regId && workshopId && payerEmail) {
      if (isDatabaseConfigured) {
        try {
          const existingReg = await prisma.registration.findFirst({
            where: { candidateEmail: payerEmail.trim().toLowerCase(), workshopId }
          });
          if (existingReg) {
            regId = existingReg.id;
          } else {
            const newReg = await prisma.registration.create({
              data: {
                id: `REG-${Date.now()}`,
                workshopId,
                workshopTitle: workshopTitle || 'Workshop',
                candidateName: payerName || 'Candidate',
                candidateEmail: payerEmail.trim().toLowerCase(),
                candidatePhone: payerPhone || 'Not provided',
                candidateInstitution: candidateInstitution || 'Independent Candidate',
                paymentStatus: 'pending'
              }
            });
            regId = newReg.id;
          }
        } catch (e) {
          console.warn('[Prisma registration create error]:', e.message);
        }
      }
    }

    if (!regId) {
      return res.status(400).json({ error: 'Unable to create registration. Provide registrationId or workshopId + payerEmail.' });
    }

    const result = await createTrustPaymentSession({
      registrationId: regId,
      workshopId,
      amountInPaise: Math.round(Number(amount) * 100),
      currency,
      workshopTitle,
      payerName,
      payerEmail,
      payerPhone,
      candidateInstitution
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to initiate payment.' });
  }
});

// GET /api/payments/confirm - Verify with trust platform after redirect back
app.get('/api/payments/confirm', async (req, res) => {
  try {
    const { reference, status } = req.query;
    if (!reference) {
      return res.status(400).json({ error: 'reference (success_token) is required.' });
    }
    if (status === 'cancelled' || status === 'failed') {
      return res.json({ success: false, status: 'cancelled', message: 'Payment was not completed.' });
    }

    let confirmData = null;
    try {
      confirmData = await trustConfirm(reference);
    } catch (err) {
      return res.status(502).json({ error: err.message || 'Trust platform confirmation failed.' });
    }

    if (confirmData.status !== 'success') {
      return res.status(400).json({ error: 'Payment not confirmed by trust platform.', detail: confirmData });
    }

    // Update local database. The success_token returned by the trust platform
    // is NOT the original signed token, so match on the transaction id that was
    // stored when the payment was initiated (or on the registration id carried
    // in the confirmed metadata).
    let applied = { updated: false };
    if (isDatabaseConfigured) {
      try {
        applied = await markPaymentPaid({
          transactionId: confirmData.transaction_id,
          registrationId: confirmData.metadata?.registrationId,
          details: confirmData
        });
      } catch (e) {
        console.warn('[Prisma payment confirm error]:', e.message);
      }
    }

    res.json({
      success: true,
      status: 'paid',
      alreadyPaid: Boolean(applied.alreadyPaid),
      transaction_id: confirmData.transaction_id,
      payment_id: confirmData.razorpay_payment_id,
      order_id: confirmData.razorpay_order_id,
      amount: confirmData.amount,
      currency: confirmData.currency
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Payment confirmation failed.' });
  }
});

// POST /api/payments/webhook - Server-to-server notification from the trust
// platform. Updates Railway PostgreSQL even if the payer never returns to the
// browser. Signature is a JWT-like HMAC-SHA256 token signed with the shared app
// secret, matching the trust platform's notifyAppPaid() payload.
app.post('/api/payments/webhook', async (req, res) => {
  try {
    const body = req.body || {};
    if (body.event !== 'payment.captured') {
      return res.json({ received: true, ignored: true });
    }

    const signedPayload = {
      event: body.event,
      transaction_id: body.transaction_id,
      amount: body.amount,
      razorpay_order_id: body.razorpay_order_id,
      razorpay_payment_id: body.razorpay_payment_id
    };
    const verified = verifyTrustToken(body.signature);
    const isValid =
      verified &&
      verified.event === signedPayload.event &&
      verified.transaction_id === signedPayload.transaction_id &&
      verified.amount === signedPayload.amount &&
      verified.razorpay_order_id === signedPayload.razorpay_order_id &&
      verified.razorpay_payment_id === signedPayload.razorpay_payment_id;

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid webhook signature.' });
    }

    let applied = { updated: false };
    if (isDatabaseConfigured) {
      applied = await markPaymentPaid({
        transactionId: body.transaction_id,
        details: {
          transaction_id: body.transaction_id,
          razorpay_order_id: body.razorpay_order_id,
          razorpay_payment_id: body.razorpay_payment_id,
          amount: body.amount,
          currency: body.currency,
          source: 'trust_webhook'
        }
      });
    }

    console.log(
      `[Payment Webhook] ${body.transaction_id} status=${
        applied.alreadyPaid ? 'already-paid' : applied.updated ? 'paid' : 'unmatched'
      }`
    );
    res.json({ received: true, updated: Boolean(applied.updated) });
  } catch (err) {
    console.warn('[Payment Webhook] Error:', err.message);
    res.status(500).json({ error: 'Webhook processing failed.' });
  }
});

// GET /api/payments/status/:registrationId - Get payment status
app.get('/api/payments/status/:registrationId', async (req, res) => {
  try {
    const { registrationId } = req.params;
    let payment = null;
    if (isDatabaseConfigured) {
      try {
        payment = await prisma.payment.findFirst({
          where: { registrationId },
          orderBy: { createdAt: 'desc' }
        });
      } catch (e) {
        console.warn('[Prisma payment read error]:', e.message);
      }
    }
    res.json({ success: true, payment: payment || { status: 'unknown' } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read payment status.' });
  }
});

// GET /api/payments/all - List all payments (admin)
app.get('/api/payments/all', requireAdmin, async (req, res) => {
  try {
    let payments = [];
    if (isDatabaseConfigured) {
      try {
        payments = await prisma.payment.findMany({
          include: { registration: true },
          orderBy: { createdAt: 'desc' }
        });
      } catch (e) {
        console.warn('[Prisma payments read error]:', e.message);
      }
    }
    res.json({ success: true, count: payments.length, payments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read payments.' });
  }
});

// ==========================================
// GEN AI WORKSHOP, NOVEMBER 28-29 (STEP-WISE FLOW)
// ==========================================
app.get('/api/genai/config', (req, res) => {
  res.json({
    success: true,
    workshopId: GENAI_WORKSHOP_ID,
    title: GENAI_WORKSHOP_TITLE,
    dates: 'November 28-29, 2026',
    location: 'IIT Hyderabad',
    organiser: 'Elan & nVision',
    basePrice: GENAI_BASE_PRICE,
    platformFeePercent: GENAI_PLATFORM_FEE_PERCENT,
    accommodationPaymentUrl: ACCOMMODATION_PAYMENT_URL,
    accommodationWhatsAppUrl: ACCOMMODATION_WHATSAPP_URL,
    quote: calculateGenAiQuote(0)
  });
});

app.get('/api/genai/referrals/:code/validate', async (req, res) => {
  try {
    const code = normalizeReferralCode(req.params.code);
    if (!code) return res.status(400).json({ error: 'Referral code is required.' });

    const referral = await findActiveReferral(code);
    if (!referral) {
      return res.status(404).json({
        success: false,
        valid: false,
        error: 'This referral code was not found or is no longer active.'
      });
    }

    res.json({
      success: true,
      valid: true,
      referral: {
        code: referral.code,
        label: referral.label,
        discountAmount: referral.discountAmount
      },
      quote: calculateGenAiQuote(referral.discountAmount)
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not validate the referral code.' });
  }
});

app.post('/api/genai/registrations/step1', async (req, res) => {
  try {
    if (!isDatabaseConfigured) {
      return res.status(503).json({ error: 'Registration is not available right now.' });
    }

    const body = req.body || {};
    const clean = {
      fullName: String(body.fullName || '').trim(),
      gender: String(body.gender || '').trim(),
      email: String(body.email || '').trim().toLowerCase(),
      phone: String(body.phone || '').trim(),
      department: String(body.department || '').trim(),
      yearOfStudy: String(body.yearOfStudy || '').trim(),
      college: String(body.college || '').trim(),
      collegeLocation: String(body.collegeLocation || '').trim()
    };

    const errors = {};
    if (clean.fullName.length < 2) errors.fullName = 'Enter your full name.';
    if (!GENAI_GENDERS.includes(clean.gender)) errors.gender = 'Select your gender.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) errors.email = 'Enter a valid email address.';
    if (!/^[6-9][0-9]{9}$/.test(clean.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!clean.department) errors.department = 'Enter your department.';
    if (!GENAI_YEARS.includes(clean.yearOfStudy)) errors.yearOfStudy = 'Select your year of study.';
    if (!clean.college) errors.college = 'Enter your college name.';
    if (!clean.collegeLocation) errors.collegeLocation = 'Enter your college location.';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, error: 'Please check the highlighted fields.', errors });
    }

    let referral = null;
    let referralWarning = '';
    const submittedReferral = normalizeReferralCode(body.referralCode);
    if (submittedReferral) {
      referral = await findActiveReferral(submittedReferral);
      if (referral) {
        await prisma.referralCode.update({
          where: { id: referral.id },
          data: { usageCount: { increment: 1 } }
        }).catch(() => {});
      } else {
        referralWarning = 'The referral code was not recognised, so no discount was applied.';
      }
    }

    const workshop = await prisma.upcomingWorkshop.findUnique({
      where: { id: GENAI_WORKSHOP_ID }
    }).catch(() => null);

    const commonData = {
      workshopId: GENAI_WORKSHOP_ID,
      workshopTitle: workshop?.title || GENAI_WORKSHOP_TITLE,
      workshopCategory: workshop?.category || 'Generative AI',
      workshopDates: workshop?.dates || 'November 28-29, 2026',
      workshopLocation: workshop?.location || 'IIT Hyderabad',
      workshopMode: workshop?.mode || 'Offline Campus Immersion',
      candidateName: clean.fullName,
      candidateEmail: clean.email,
      candidateInstitution: clean.college,
      candidatePhone: clean.phone,
      gender: clean.gender,
      department: clean.department,
      yearOfStudy: clean.yearOfStudy,
      college: clean.college,
      collegeLocation: clean.collegeLocation,
      referralCode: referral?.code || submittedReferral || null,
      discountAmount: referral ? Math.min(GENAI_BASE_PRICE, referral.discountAmount) : 0,
      ipAddress: req.ip || null,
      userAgent: req.headers['user-agent'] || null
    };

    const existing = await prisma.registration.findFirst({
      where: { workshopId: GENAI_WORKSHOP_ID, candidateEmail: clean.email }
    });

    if (existing) {
      if (existing.paymentStatus === 'paid') {
        return res.status(409).json({
          success: false,
          error: 'This email already has a confirmed payment for the workshop.'
        });
      }
      const updated = await prisma.registration.update({
        where: { id: existing.id },
        data: {
          ...commonData,
          currentStep: Math.max(existing.currentStep || 1, 1)
        }
      });
      return res.json({
        success: true,
        resume: true,
        registration: genAiRegistrationView(updated),
        referralWarning,
        quote: calculateGenAiQuote(updated.discountAmount)
      });
    }

    const registrationCode = `GAIC6K_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${crypto
      .randomBytes(4)
      .toString('hex')
      .toUpperCase()}`;

    const registration = await prisma.registration.create({
      data: {
        ...commonData,
        id: `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        registrationCode,
        status: 'Confirmed',
        paymentStatus: 'pending',
        currentStep: 1
      }
    });

    res.status(201).json({
      success: true,
      resume: false,
      registration: genAiRegistrationView(registration),
      referralWarning,
      quote: calculateGenAiQuote(registration.discountAmount)
    });
  } catch (err) {
    console.warn('[GenAI step1 error]:', err.message);
    res.status(500).json({ error: 'Could not save your details. Please try again.' });
  }
});

app.get('/api/genai/registrations/resume', async (req, res) => {
  try {
    if (!isDatabaseConfigured) return res.json({ success: true, registration: null });
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const registration = await prisma.registration.findFirst({
      where: { workshopId: GENAI_WORKSHOP_ID, candidateEmail: email }
    });
    res.json({
      success: true,
      registration: registration ? genAiRegistrationView(registration) : null,
      quote: registration ? calculateGenAiQuote(registration.discountAmount) : calculateGenAiQuote(0)
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not resume the registration.' });
  }
});

app.get('/api/genai/registrations/:id', async (req, res) => {
  try {
    if (!isDatabaseConfigured) return res.json({ success: true, registration: null });
    const registration = await prisma.registration.findUnique({
      where: { id: req.params.id }
    });
    if (!registration || registration.workshopId !== GENAI_WORKSHOP_ID) {
      return res.status(404).json({ error: 'Registration not found.' });
    }
    res.json({
      success: true,
      registration: genAiRegistrationView(registration),
      quote: calculateGenAiQuote(registration.discountAmount)
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not load the registration.' });
  }
});

app.post('/api/genai/registrations/:id/step2', async (req, res) => {
  try {
    if (!isDatabaseConfigured) return res.status(503).json({ error: 'Registration is not available right now.' });
    const registration = await prisma.registration.findUnique({ where: { id: req.params.id } });
    if (!registration || registration.workshopId !== GENAI_WORKSHOP_ID) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: { currentStep: Math.max(registration.currentStep || 1, 2) }
    });
    res.json({ success: true, registration: genAiRegistrationView(updated) });
  } catch (err) {
    res.status(500).json({ error: 'Could not save your progress.' });
  }
});

app.post('/api/genai/registrations/:id/step3', async (req, res) => {
  try {
    if (!isDatabaseConfigured) return res.status(503).json({ error: 'Registration is not available right now.' });

    const choice = String(req.body?.hostelAccommodation || '').trim();
    const termsAccepted = Boolean(req.body?.termsAccepted);
    const accommodationPaid = Boolean(req.body?.accommodationPaid);

    if (!['Yes', 'No'].includes(choice)) {
      return res.status(400).json({ error: 'Select whether you need hostel accommodation.' });
    }
    if (!termsAccepted) {
      return res.status(400).json({ error: 'You must accept the event information to continue.' });
    }
    if (choice === 'Yes' && !accommodationPaid) {
      return res.status(400).json({
        error: 'Accommodation payment must be completed before you can continue to the workshop payment.'
      });
    }

    const registration = await prisma.registration.findUnique({ where: { id: req.params.id } });
    if (!registration || registration.workshopId !== GENAI_WORKSHOP_ID) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: {
        hostelAccommodation: choice,
        accommodationPaid: choice === 'Yes',
        termsAccepted: true,
        currentStep: Math.max(registration.currentStep || 1, 4)
      }
    });
    res.json({ success: true, registration: genAiRegistrationView(updated) });
  } catch (err) {
    res.status(500).json({ error: 'Could not save accommodation details.' });
  }
});

app.post('/api/genai/registrations/:id/payment', async (req, res) => {
  try {
    if (!isDatabaseConfigured) return res.status(503).json({ error: 'Payment is not available right now.' });

    const registration = await prisma.registration.findUnique({ where: { id: req.params.id } });
    if (!registration || registration.workshopId !== GENAI_WORKSHOP_ID) {
      return res.status(404).json({ error: 'Registration not found.' });
    }
    if ((registration.currentStep || 1) < 4) {
      return res.status(400).json({ error: 'Complete all registration steps before paying.' });
    }
    if (registration.hostelAccommodation === 'Yes' && !registration.accommodationPaid) {
      return res.status(400).json({ error: 'Complete the accommodation payment before paying for the workshop.' });
    }

    const quote = calculateGenAiQuote(registration.discountAmount);
    const returnUrl = new URL(PAYMENT_RETURN_URL);
    returnUrl.searchParams.set('registration', registration.id);

    const result = await createTrustPaymentSession({
      registrationId: registration.id,
      workshopId: GENAI_WORKSHOP_ID,
      amountInPaise: quote.total * 100,
      currency: quote.currency,
      workshopTitle: registration.workshopTitle || GENAI_WORKSHOP_TITLE,
      payerName: registration.candidateName,
      payerEmail: registration.candidateEmail,
      payerPhone: registration.candidatePhone,
      candidateInstitution: registration.college,
      returnUrl: returnUrl.toString(),
      metadata: {
        registrationCode: registration.registrationCode || '',
        referralCode: registration.referralCode || '',
        discount: quote.discount,
        platformFee: quote.platformFee
      }
    });

    res.json({ ...result, quote });
  } catch (err) {
    console.warn('[GenAI payment error]:', err.message);
    res.status(500).json({ error: err.message || 'Could not start the secure checkout.' });
  }
});

// Admin referral codes. Codes are created here and shared through the URL,
// never typed into the public registration form.
app.get('/api/referrals', requireAdmin, async (req, res) => {
  try {
    if (!isDatabaseConfigured) return res.json({ success: true, referrals: [] });
    const referrals = await prisma.referralCode.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, count: referrals.length, referrals });
  } catch (err) {
    res.status(500).json({ error: 'Could not load referral codes.' });
  }
});

app.post('/api/referrals', requireAdmin, async (req, res) => {
  try {
    if (!isDatabaseConfigured) return res.status(503).json({ error: 'Referral storage is not available.' });

    const code = normalizeReferralCode(req.body?.code);
    const label = String(req.body?.label || '').trim();
    const discountAmount = Number(req.body?.discountAmount);
    const active = req.body?.active !== false;

    if (!/^[A-Z0-9][A-Z0-9-]{2,39}$/.test(code)) {
      return res.status(400).json({ error: 'Use 3 to 40 letters, numbers or hyphens for the code.' });
    }
    if (!Number.isInteger(discountAmount) || discountAmount < 0 || discountAmount > GENAI_BASE_PRICE) {
      return res.status(400).json({ error: `Discount must be a whole number between 0 and ${GENAI_BASE_PRICE}.` });
    }

    const existing = await prisma.referralCode.findUnique({ where: { code } });
    if (existing) return res.status(409).json({ error: 'That referral code already exists.' });

    const referral = await prisma.referralCode.create({
      data: { code, label, discountAmount, active }
    });
    res.status(201).json({ success: true, referral });
  } catch (err) {
    res.status(500).json({ error: 'Could not create the referral code.' });
  }
});

app.delete('/api/referrals/:code', requireAdmin, async (req, res) => {
  try {
    if (!isDatabaseConfigured) return res.status(503).json({ error: 'Referral storage is not available.' });
    const code = normalizeReferralCode(req.params.code);
    await prisma.referralCode.deleteMany({ where: { code } });
    res.json({ success: true, message: 'Referral code removed.' });
  } catch (err) {
    res.status(500).json({ error: 'Could not remove the referral code.' });
  }
});

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
    database: isDatabaseConfigured ? 'PostgreSQL (Railway via Prisma)' : 'Local JSON Store (fallback)',
    databaseUrl: process.env.DATABASE_URL ? 'configured' : null,
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

    if (isDatabaseConfigured) {
      try {
        await prisma.inquiry.create({
          data: {
            id: newInquiry.id,
            createdAt: new Date(newInquiry.createdAt),
            name: newInquiry.name,
            institution: newInquiry.institution,
            role: newInquiry.role,
            email: newInquiry.email,
            phone: newInquiry.phone,
            workshopInterest: newInquiry.workshopInterest,
            estimatedStudents: newInquiry.estimatedStudents,
            mode: newInquiry.mode,
            message: newInquiry.message,
            status: newInquiry.status
          }
        });
      } catch (e) {
        console.warn('[Prisma inquiries error, falling back to JSON]:', e.message);
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

app.get('/api/inquiries', requireAdmin, async (req, res) => {
  try {
    if (isDatabaseConfigured) {
      try {
        const data = await prisma.inquiry.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return res.json({ count: data.length, inquiries: data });
      } catch (e) {
        console.warn('[Prisma inquiries read error]:', e.message);
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

    if (isDatabaseConfigured) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: cleanEmail }
        });

        if (user && user.password === cleanPassword) {
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

    if (isDatabaseConfigured) {
      try {
        // Check if user already exists in Database
        const existingUser = await prisma.user.findUnique({
          where: { email: cleanEmail }
        });

        if (existingUser) {
          return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
        }

        await prisma.user.create({
          data: {
            id: newUser.id,
            role: newUser.role,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            institution: newUser.institution,
            phone: newUser.phone
          }
        });
      } catch (e) {
        // Fallback continues
      }
    }

    const users = readJson('users.json');
    const exists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists && !isDatabaseConfigured) {
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
    if (isDatabaseConfigured) {
      try {
        const data = await prisma.upcomingWorkshop.findMany({
          orderBy: { postedAt: 'desc' }
        });
        if (data && data.length > 0) {
          return res.json({ success: true, count: data.length, workshops: data });
        }
      } catch (e) {
        console.warn('[Prisma upcoming workshops read error]:', e.message);
      }
    }

    const workshops = readJson('upcoming_workshops.json');
    res.json({ success: true, count: workshops.length, workshops });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read upcoming workshops.' });
  }
});

app.post('/api/workshops', requireAdmin, async (req, res) => {
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

    if (isDatabaseConfigured) {
      try {
        await prisma.upcomingWorkshop.create({
          data: {
            id: newWorkshop.id,
            title: newWorkshop.title,
            category: newWorkshop.category,
            dates: newWorkshop.dates,
            location: newWorkshop.location,
            seats: newWorkshop.seats,
            registered: newWorkshop.registered,
            mode: newWorkshop.mode,
            speaker: newWorkshop.speaker,
            description: newWorkshop.description,
            status: newWorkshop.status,
            postedAt: new Date(newWorkshop.postedAt)
          }
        });
      } catch (e) {
        console.warn('[Prisma workshop insert error]:', e.message);
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

app.delete('/api/workshops/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (isDatabaseConfigured) {
      try {
        await prisma.upcomingWorkshop.delete({
          where: { id }
        });
      } catch (e) {
        console.warn('[Prisma workshop delete exception]:', e.message);
      }
    }

    let workshops = readJson('upcoming_workshops.json');
    const beforeCount = workshops.length;
    workshops = workshops.filter(w => w.id !== id);
    if (workshops.length === beforeCount && !isDatabaseConfigured) {
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

    if (isDatabaseConfigured) {
      try {
        const wsData = await prisma.upcomingWorkshop.findUnique({
          where: { id }
        });
        workshop = wsData;
      } catch (e) {
        console.warn('[Prisma workshop fetch exception]:', e.message);
      }
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
    if (isDatabaseConfigured) {
      try {
        const existingReg = await prisma.registration.findFirst({
          where: {
            workshopId: id,
            candidateEmail: cleanEmail
          }
        });

        if (existingReg) {
          return res.status(409).json({ error: 'You are already registered for this workshop!' });
        }
      } catch (e) {
        console.warn('[Prisma duplicate registration check exception]:', e.message);
      }
    }

    const registrations = readJson('registrations.json');
    const alreadyRegistered = registrations.some(
      r => r.workshopId === id && r.candidateEmail.toLowerCase() === cleanEmail
    );
    if (alreadyRegistered && !isDatabaseConfigured) {
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

    if (isDatabaseConfigured) {
      try {
        await prisma.registration.create({
          data: {
            id: newReg.id,
            workshopId: newReg.workshopId,
            workshopTitle: newReg.workshopTitle,
            workshopCategory: newReg.workshopCategory,
            workshopDates: newReg.workshopDates,
            workshopLocation: newReg.workshopLocation,
            workshopMode: newReg.workshopMode,
            candidateName: newReg.candidateName,
            candidateEmail: newReg.candidateEmail,
            candidateInstitution: newReg.candidateInstitution,
            candidatePhone: newReg.candidatePhone,
            registeredAt: new Date(newReg.registeredAt),
            status: newReg.status
          }
        });
        await prisma.upcomingWorkshop.update({
          where: { id },
          data: { registered: (workshop.registered || 0) + 1 }
        });
      } catch (e) {
        console.warn('[Prisma registration exception]:', e.message);
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

    if (isDatabaseConfigured) {
      try {
        const data = await prisma.registration.findMany({
          where: { candidateEmail: email },
          orderBy: { registeredAt: 'desc' }
        });
        return res.json({ success: true, count: data.length, registrations: data });
      } catch (e) {
        console.warn('[Prisma candidate registrations error]:', e.message);
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

    if (isDatabaseConfigured) {
      try {
        await prisma.customRequest.create({
          data: {
            id: newRequest.id,
            requestedBy: newRequest.requestedBy,
            email: newRequest.email,
            phone: newRequest.phone,
            institution: newRequest.institution,
            preferredLocation: newRequest.preferredLocation,
            topic: newRequest.topic,
            targetAudience: newRequest.targetAudience,
            estimatedStudents: newRequest.estimatedStudents,
            preferredDates: newRequest.preferredDates,
            specialRequirements: newRequest.specialRequirements,
            status: newRequest.status,
            submittedAt: new Date(newRequest.submittedAt)
          }
        });
      } catch (e) {
        console.warn('[Prisma custom_requests insert exception]:', e.message);
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

app.get('/api/collaboration-requests', requireAdmin, async (req, res) => {
  try {
    if (isDatabaseConfigured) {
      try {
        const data = await prisma.customRequest.findMany({
          orderBy: { submittedAt: 'desc' }
        });
        return res.json({ success: true, count: data.length, requests: data });
      } catch (e) {
        console.warn('[Prisma custom_requests read error]:', e.message);
      }
    }

    const requests = readJson('custom_requests.json');
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load collaboration requests.' });
  }
});

app.post('/api/collaboration-requests/:id/approve', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let requestItem = null;

    if (isDatabaseConfigured) {
      try {
        const data = await prisma.customRequest.findUnique({
          where: { id }
        });
        requestItem = data;
      } catch (e) {
        console.warn('[Prisma custom_request fetch exception]:', e.message);
      }
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

    if (isDatabaseConfigured) {
      try {
        await prisma.customRequest.update({
          where: { id },
          data: { status: 'Approved & Published', approvedAt: new Date(approvedAt) }
        });
        await prisma.upcomingWorkshop.create({
          data: {
            id: newWorkshop.id,
            title: newWorkshop.title,
            category: newWorkshop.category,
            dates: newWorkshop.dates,
            location: newWorkshop.location,
            seats: newWorkshop.seats,
            registered: newWorkshop.registered,
            mode: newWorkshop.mode,
            speaker: newWorkshop.speaker,
            description: newWorkshop.description,
            status: newWorkshop.status,
            postedAt: new Date(newWorkshop.postedAt),
            convertedFromRequestId: newWorkshop.convertedFromRequestId
          }
        });
      } catch (e) {
        console.warn('[Prisma approve request exception]:', e.message);
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

app.get('/api/registrations', requireAdmin, async (req, res) => {
  try {
    if (isDatabaseConfigured) {
      try {
        const data = await prisma.registration.findMany({
          orderBy: { registeredAt: 'desc' }
        });
        return res.json({ success: true, count: data.length, registrations: data });
      } catch (e) {
        console.warn('[Prisma registrations read error]:', e.message);
      }
    }

    const registrations = readJson('registrations.json');
    res.json({ success: true, count: registrations.length, registrations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load registrations.' });
  }
});

// Start server if run directly (local / Render / Railway)
// Also exported for serverless environments
const server = app.listen(PORT, () => {
  console.log(`[IncuxAI Backend] Server listening at http://localhost:${PORT}`);
  console.log(`[IncuxAI Backend] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[IncuxAI Backend] Database status: ${isDatabaseConfigured ? 'PostgreSQL (Railway via Prisma)' : 'Local JSON Store'}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[IncuxAI Backend] Port ${PORT} is currently in use. Stop the existing process or set PORT in the environment.`);
  } else {
    console.error('[IncuxAI Backend] Server error:', err);
  }
});

// Export for serverless environments (Railway, AWS Lambda)
export default app;
