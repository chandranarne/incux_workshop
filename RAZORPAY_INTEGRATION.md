# Razorpay Integration Guide: workshops.incuxai.com

This is the complete reference for accepting payments on this platform. It explains
how Razorpay is actually reached, how to add a new paid form safely, and how to
verify the flow in production.

> Authoritative upstream guide: `D:\code\Incuxai_education_trust\docs\PAYMENT_GATEWAY_INTEGRATION.md`
> That document describes the trust platform itself. This document describes how
> this workshop platform uses it, with the exact values that are live today.

---

## Table of Contents

1. [Golden rules](#1-golden-rules)
2. [Architecture](#2-architecture)
3. [Credentials and app registration](#3-credentials-and-app-registration)
4. [Environment variables](#4-environment-variables)
5. [Token format and signing](#5-token-format-and-signing)
6. [The complete payment flow](#6-the-complete-payment-flow)
7. [Backend routes](#7-backend-routes)
8. [Frontend routes and components](#8-frontend-routes-and-components)
9. [Database: what is stored](#9-database-what-is-stored)
10. [Idempotency: webhook versus confirm](#10-idempotency-webhook-versus-confirm)
11. [Amount handling: current state and hardening](#11-amount-handling-current-state-and-hardening)
12. [Error handling](#12-error-handling)
13. [Security rules](#13-security-rules)
14. [Testing and verification](#14-testing-and-verification)
15. [Troubleshooting](#15-troubleshooting)
16. [Checklist: creating a new payment form](#16-checklist-creating-a-new-payment-form)
17. [Operations: Railway](#17-operations-railway)
18. [File map](#18-file-map)

---

## 1. Golden rules

Read these before writing any payment code.

1. Razorpay keys exist **only** on the trust platform. This repository never has
   `RAZORPAY_KEY_ID` or `RAZORPAY_KEY_SECRET` and must never add them.
2. Initiator sites never show a Razorpay card form. Users are redirected to the
   trust checkout at `https://www.incuxaieducationtrust.org/pay`.
3. The trust URL path is exactly `/pay`. Do not use
   `pay.incuxaieducationtrust.org` and do not use `/pay.html`. The `/pay` route
   serves the checkout page internally.
4. Each site has its own app id and its own shared secret. The `workshops` app is
   for this platform. The `incuxai` app is for incuxai.com and must not be reused
   or rotated here.
5. The shared secret is server-side only. It goes in backend environment
   variables, never in frontend code, config committed to git, or docs sent to
   clients.
6. Amounts in tokens are **paise**. ₹6,000 is `600000`.
7. Every payment needs a unique `transaction_id`.
8. Database updates must be idempotent. A reload, a replayed webhook, or a
   browser return after the webhook must never count a seat twice.
9. The webhook is the primary source of truth. The browser return is a secondary
   confirmation path.
10. No login is required to pay. Payment forms are public and work without an
    account.

---

## 2. Architecture

Three systems participate:

| System | Role | Stack |
| :--- | :--- | :--- |
| `workshops.incuxai.com` frontend | Workshop pages, personal-details form, return pages | Vite + React, served by `vite preview` |
| Workshops backend | Registration, token signing, webhook, confirmation, admin API | Express + Prisma + Railway PostgreSQL |
| `www.incuxaieducationtrust.org` | Central Razorpay checkout, signature verification, success token, webhook sender | Node.js + Express + Prisma |

Flow of control:

```
Browser                Workshops backend           Trust platform            Razorpay
   |                          |                          |                      |
   |-- fill details form ---->|                          |                      |
   |<-- trustUrl -------------|-- sign HMAC token        |                      |
   |-- redirect /pay?token -->|                          |                      |
   |                          |                          |-- verify token       |
   |                          |                          |-- create order ------>|
   |                          |                          |<-- order_id ----------|
   |-- Razorpay modal ------------------------------------------------------->|
   |<-- payment captured -----------------------------------------------------|
   |                          |                          |-- verify signature   |
   |                          |<-- webhook payment.captured (signed)          |
   |                          |-- mark DB paid (idempotent)                   |
   |<-- browser redirect status=success&token=<SUCCESS_TOKEN> ----------------|
   |-- /payment/success ------>|                          |                      |
   |                          |-- POST /api/payments/confirm ---------------->|
   |                          |<-- transaction details (single use) ----------|
   |                          |-- idempotent re-check                        |
```

The frontend never talks to the trust APIs directly. All trust calls go through
the backend. The frontend reaches the backend through the same-origin `/api`
proxy configured in `frontend/vite.config.js`, driven by `API_PROXY_TARGET`.

---

## 3. Credentials and app registration

### Registered apps on the trust platform

| App id | Name | Secret | Default webhook |
| :--- | :--- | :--- | :--- |
| `incuxai` | IncuXai.com | `cqkA6o4OJuqVcWOdFYi2tIsvVwmc1a1Mh3qos8MkOdOfIiQJSif3M88Ogd_oozkm` | `https://incuxai.com/handlers/verify-iit-mnc-payment.php` |
| `workshops` | IncuXai Workshops | `YJzdcqnlnQloysQ2jrmwk1TxzktTxTaqj-p6UiCUIulajN4gIx41H-Nj70yelXU6` | `https://workshops.incuxai.com/api/payments/webhook` |

Other apps on the same trust platform (`incuxacademy`, `nexusquest`) belong to
other projects. Never touch them.

**Do not rotate `incuxai`.** Multiple live incuxai.com programs depend on it.
The `workshops` secret is the one used by this repository.

### Adding a new app on the trust server

Run on the trust backend (path is `server/cli/payment-apps.js`, not `src/cli`):

```bash
node server/cli/payment-apps.js add <appId> "<appName>" \
  --secret <shared-secret> \
  --callback <webhook-url>
```

Example for this platform:

```bash
node server/cli/payment-apps.js add workshops "IncuXai Workshops" \
  --secret YJzdcqnlnQloysQ2jrmwk1TxzktTxTaqj-p6UiCUIulajN4gIx41H-Nj70yelXU6 \
  --callback https://workshops.incuxai.com/api/payments/webhook
```

Useful commands:

```bash
node server/cli/payment-apps.js list
node server/cli/payment-apps.js info workshops
node server/cli/payment-apps.js rotate-secret workshops
node server/cli/payment-apps.js deactivate workshops
```

Note: the trust guide mentions `--callback-url`; the actual CLI flag is
`--callback`. Use `--callback`.

The secret must be byte-for-byte identical on both sides. Watch for trailing
newlines or spaces. The signing code trims whitespace, but the stored value
should be exact.

---

## 4. Environment variables

### Backend (`workshop-backend` Railway service)

| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | Railway PostgreSQL connection string | Prisma datastore |
| `NODE_ENV` | `production` | Runtime mode |
| `PORT` | `5000` | Listen port |
| `TRUST_PAYMENT_SECRET` | `YJzdcqnlnQloysQ2jrmwk1TxzktTxTaqj-p6UiCUIulajN4gIx41H-Nj70yelXU6` | Signs outgoing tokens, verifies webhooks |
| `TRUST_PAYMENT_URL` | `https://www.incuxaieducationtrust.org` | Trust base URL |
| `TRUST_PAYMENT_APP_ID` | `workshops` | App id in the checkout URL |
| `PAYMENT_RETURN_URL` | `https://workshops.incuxai.com/payment/success` | Browser success return |
| `PAYMENT_CANCEL_URL` | `https://workshops.incuxai.com/payment/cancel` | Informational cancel page |
| `PAYMENT_WEBHOOK_URL` | `https://workshops.incuxai.com/api/payments/webhook` | `callback_url` in the token payload |
| `ADMIN_PASSCODE` | Set in Railway (admin console passphrase) | Protects `/api/payments/all` and admin routes |

### Frontend (`workshop-frontend` Railway service)

| Variable | Value | Purpose |
| :--- | :--- | :--- |
| `API_PROXY_TARGET` | `http://steadfast-beauty.railway.internal:5000` | Same-origin `/api` proxy to the backend |

The private hostname is `steadfast-beauty.railway.internal`. The old value
`backend.railway.internal` in earlier docs was wrong. If the proxy target is
missing, `/api` returns an explicit HTTP 503.

`VITE_API_BASE` is optional. It defaults to `/api`. Do not hardcode a backend
public URL there.

### Local development

Copy `backend/.env.example` to `backend/.env` and fill the same variables. The
local `.env` is gitignored. Local `DATABASE_URL` points at the Railway Postgres
proxy for development.

---

## 5. Token format and signing

The token is a JWT-like HMAC-SHA256 string with three base64url parts:

```
header.payload.signature
```

**Header:**

```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload used by this platform (`signTrustToken` in `backend/server.js`):**

```json
{
  "transaction_id": "WS-REG-1794990319437-1794990319453",
  "amount": 600000,
  "currency": "INR",
  "customer": {
    "name": "Candidate Name",
    "email": "candidate@example.com",
    "phone": "9876543210"
  },
  "metadata": {
    "registrationId": "REG-1794990319437",
    "workshopTitle": "Generative AI Workshop",
    "source": "workshops_incuxai_com"
  },
  "callback_url": "https://workshops.incuxai.com/api/payments/webhook"
}
```

**Signing (Node.js, exactly as implemented):**

```js
import crypto from 'crypto';

const secret = (TRUST_PAYMENT_SECRET || '').trim();
const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
const body   = Buffer.from(JSON.stringify(payload)).toString('base64url');
const sig    = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
const token  = `${header}.${body}.${sig}`;
```

The trust verifies this with the same algorithm using the secret stored for the
`app` in the URL. Verification is just as strict: split into three parts,
recompute HMAC over `header + "." + body`, compare, then parse the payload.

### Checkout URL

```
https://www.incuxaieducationtrust.org/pay?token=<JWT>&app=workshops&redirect=<RETURN_URL>
```

All three query values are URL-encoded. The parameter order is `token`, `app`,
then `redirect`. `redirect` is the browser return URL; `callback_url` inside the
token is the server webhook. They are different and both are required. For the
GenAI workshop the return URL also carries `registration=<REGISTRATION_ID>` so
the registration screen can show the confirmed status.

### Webhook signature

The trust signs webhooks with the same algorithm. The signed payload covers
exactly these fields:

```json
{
  "event": "payment.captured",
  "transaction_id": "...",
  "amount": 600000,
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_..."
}
```

`backend/server.js` recomputes this signature from the request body and rejects
with HTTP 401 if any field does not match.

---

## 6. The complete payment flow

The current paid workshop is the single Generative AI Workshop,
`WS-GENAI-IIT-HYD-NOV28`, on November 28-29, 2026 at IIT Hyderabad. Its entry
point is `/gen-ai-workshop`, reached from the "Register for Workshop" button on
the home page. Legacy `/ai-workshop` routes to the same page.

1. The user opens `/gen-ai-workshop`. An optional `?ref=CODE` in the URL applies
   an admin-created referral discount. There is no coupon input on the form.
2. Step 1 collects full name, gender, email, phone, department, year of study,
   college and college location. `POST /api/genai/registrations/step1` creates
   or resumes a `Registration` with `paymentStatus: pending` and `currentStep: 1`.
3. Step 2 shows what is included and calls
   `POST /api/genai/registrations/:id/step2` to advance to step 3.
4. Step 3 requires a hostel accommodation choice. Choosing "Yes" reveals the
   accommodation payment link and WhatsApp group and asks whether the
   accommodation payment was completed. The backend refuses step 3 with HTTP 400
   unless accommodation is paid, so the user cannot reach the workshop payment
   step otherwise. Choosing "No" has no extra gate.
5. Step 4 shows a trusted quote and the user clicks the payment button. The
   frontend calls `POST /api/genai/registrations/:id/payment` with no amount.
6. The backend recomputes the amount from `GENAI_BASE_PRICE` (₹6,000) minus the
   stored referral discount, then adds a 2% platform fee. With a ₹100 discount
   the total is ₹6,018, signed as `601800` paise. The browser never supplies the
   amount.
7. `createTrustPaymentSession` signs the token, stores a `Payment` with
   `status: pending` and the `transactionId`, `trustUrl` and `token` in
   `gatewayResponse`, and returns `trustUrl` with the registration id in the
   return URL.
8. The frontend redirects the browser with `window.location.assign(data.trustUrl)`.
9. The trust verifies the token against the `workshops` secret, creates a
   Razorpay order, and opens its checkout page at `/pay`.
10. The trust verifies the Razorpay signature, marks its order paid, and issues a
    single-use `success_token` that expires after 30 minutes.
11. The trust POSTs a signed `payment.captured` webhook to
    `/api/payments/webhook`. The backend verifies the signature and calls
    `markPaymentPaid`, which sets `payments.status = paid` and
    `registrations.paymentStatus = paid`, and increments
    `upcoming_workshops.registered` once.
12. The trust redirects the browser to
    `/payment/success?status=success&token=<SUCCESS_TOKEN>&registration=<ID>`.
13. `PaymentSuccess` calls `GET /api/payments/confirm?reference=<SUCCESS_TOKEN>`.
14. The backend POSTs `{ reference }` to trust `/api/payments/confirm`, receives
    the transaction details, and applies the same idempotent update.
15. The "Back to Registration" button returns to
    `/gen-ai-workshop?registration=<ID>` and shows the confirmed status. The
    admin can see the payment in the `/admin` Payments tab.

Cancelled and failed paths:

- Cancelled: trust redirects with `status=cancelled`; no amount charged; DB stays
  `pending`.
- Failed: trust redirects with `status=failed&error=<message>`; no amount charged;
  DB stays `pending`.
- The user can retry from step 4 with a fresh initiate call and a new
  transaction id.

Cancelled and failed paths:

- Cancelled: trust redirects with `status=cancelled`; no amount charged; DB stays
  `pending`.
- Failed: trust redirects with `status=failed&error=<message>`; no amount charged;
  DB stays `pending`.
- The user can retry with a fresh initiate call and a new transaction id.

---

## 7. Backend routes

All routes are defined in `backend/server.js`.

| Route | Method | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/genai/config` | GET | Public | Workshop id, dates, base price, fee percent, accommodation links, quote |
| `/api/genai/referrals/:code/validate` | GET | Public | Validate an admin-created code and return the discounted quote |
| `/api/genai/registrations/step1` | POST | Public | Create or resume a GenAI registration from the 8 required fields |
| `/api/genai/registrations/resume?email=` | GET | Public | Find a registration by email to resume |
| `/api/genai/registrations/:id` | GET | Public | Load a registration and its quote |
| `/api/genai/registrations/:id/step2` | POST | Public | Advance to step 3 |
| `/api/genai/registrations/:id/step3` | POST | Public | Save accommodation choice and terms; enforces the accommodation gate |
| `/api/genai/registrations/:id/payment` | POST | Public | Compute the trusted quote and return a signed checkout URL |
| `/api/referrals` | GET / POST / DELETE | Admin token | List, create and remove referral codes with their workshop and discount |
| `/api/payments/initiate` | POST | Public | Legacy entry point; amount comes from the request, unlike the GenAI route |
| `/api/payments/webhook` | POST | HMAC signature | Trust server-to-server `payment.captured` notification |
| `/api/payments/confirm` | GET | Public | Redeem `success_token` with trust and apply idempotent update |
| `/api/payments/status/:registrationId` | GET | Public | Latest payment for a registration |
| `/api/payments/all` | GET | Admin token | List all payments with registration data |

`POST /api/genai/registrations/:id/payment` takes no amount in its body. The
backend derives everything from the stored registration and configuration. Its
response includes `trustUrl`, `token`, `appId`, `registrationId`, `paymentId`,
`transactionId`, `amount` (paise), `currency` and the full `quote`.

Legacy `initiate` request body (kept for existing callers):

```json
{
  "registrationId": "optional existing id",
  "workshopId": "WS-GENAI-IIT-HYD-NOV28",
  "amount": 6000,
  "currency": "INR",
  "workshopTitle": "Generative AI Workshop",
  "payerName": "Candidate Name",
  "payerEmail": "candidate@example.com",
  "payerPhone": "9876543210",
  "candidateInstitution": "College Name"
}
```

`initiate` response includes `trustUrl`, `token`, `appId`, `registrationId`,
`paymentId`, `transactionId`, `amount` (paise), and `currency`.

`confirm` query: `?reference=<SUCCESS_TOKEN>`. It returns status `paid`, the
transaction id, Razorpay payment and order ids, amount, and currency. It also
reports `alreadyPaid: true` when the webhook had already applied the update.

`webhook` body includes `event`, `transaction_id`, `amount`,
`razorpay_order_id`, `razorpay_payment_id`, and `signature`. It returns
`{ received: true, updated: true }` on first application and
`{ received: true, updated: false }` on replay.

---

## 8. Frontend routes and components

Routing is handled in `frontend/src/App.jsx`.

| Route | Component | Purpose |
| :--- | :--- | :--- |
| `/gen-ai-workshop` | `GenAiWorkshopRegistration` | Four-step registration page, accommodation gate and trusted payment |
| `/ai-workshop` | `GenAiWorkshopRegistration` | Legacy alias for the same page |
| `/payment/success` | `PaymentSuccess` | Confirms success token, shows receipt, returns to the registration |
| `/payment/cancel` | `PaymentCancel` | Cancelled or failed payment help page with a return to registration |

`GenAiWorkshopRegistration` reads `?ref=CODE` and `?registration=ID` from the URL,
calls the `/api/genai/*` helpers from `frontend/src/services/api.js`, and
redirects to `data.trustUrl` from the payment route.

`PaymentSuccess` reads `status`, `token` (or `reference`) and `registration`,
calls `confirmPayment(reference)`, then offers "Back to Registration" which
returns to `/gen-ai-workshop?registration=<ID>`.

The "Register for Workshop" button in `UpcomingWorkshopsSection` and the "Full
details" link both open `/gen-ai-workshop`, not the guest or candidate portal.
The section is a text list, not cards. There is no auto-opening popup.

Service helpers in `frontend/src/services/api.js`:

- `fetchGenAiConfig()`, `validateGenAiReferral(code)`
- `submitGenAiStep1(details)`, `resumeGenAiRegistration(email)`,
  `fetchGenAiRegistration(id)`, `submitGenAiStep2(id)`, `submitGenAiStep3(id, details)`
- `initiateGenAiPayment(id)`
- `fetchReferralCodes()`, `createReferralCode(details)`, `deleteReferralCode(code)` (admin)
- `initiatePayment(...)` (legacy), `confirmPayment(reference)`,
  `fetchPaymentStatus(id)`, `fetchAllPayments()` (admin)

---

## 9. Database: what is stored

Prisma schema: `backend/prisma/schema.prisma`. Database: Railway PostgreSQL.

**`registrations`**

| Column | Notes |
| :--- | :--- |
| `id` | e.g. `REG-<timestamp>` |
| `workshopId`, `workshopTitle`, category, dates, location, mode | Workshop snapshot |
| `candidateName`, `candidateEmail`, `candidatePhone`, `candidateInstitution` | Payer details |
| `gender`, `department`, `yearOfStudy`, `college`, `collegeLocation` | GenAI step 1 fields |
| `registrationCode` | Unique reference such as `GAIC6K_20261118_AB12CD34` |
| `hostelAccommodation`, `accommodationPaid`, `termsAccepted` | Step 3 gate |
| `referralCode`, `discountAmount` | Admin referral code and the rupee discount applied |
| `currentStep` | `_1` to `_4`, used to resume the form |
| `ipAddress`, `userAgent` | Audit metadata |
| `registeredAt` | Timestamp |
| `status` | Default `Confirmed` |
| `paymentStatus` | `pending`, `paid`, `failed` |

**`payments`**

| Column | Notes |
| :--- | :--- |
| `id` | e.g. `PAY-<timestamp>` |
| `registrationId` | FK to `registrations.id` |
| `upcomingWorkshopId` | Nullable FK; only set when the workshop row exists |
| `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature` | Filled after confirmation |
| `amount` | Paise, e.g. `600000` |
| `currency` | `INR` |
| `status` | `pending`, `paid`, `failed`, `refunded` |
| `gatewayResponse` | JSON: `transactionId`, `trustUrl`, `token`, then `confirmedAt` and `confirmation` |
| `created_at`, `updated_at` | Timestamps |

**`upcoming_workshops`**

`fee` is in rupees, `isPaid` marks paid workshops, `registered` counts confirmed
seats. The only workshop is `WS-GENAI-IIT-HYD-NOV28`, fee ₹6,000, on
November 28-29, 2026 at IIT Hyderabad. All historical workshops and
registrations were removed when this workshop was installed.

**`referral_codes`**

| Column | Notes |
| :--- | :--- |
| `id` | Primary key |
| `code` | Unique, uppercased, 3 to 40 letters, numbers or hyphens |
| `label` | Optional admin note |
| `workshop_id` | Required workshop id (`id` in `upcoming_workshops`), chosen when the code is created |
| `discountAmount` | Rupee discount off the ₹6,000 base |
| `active` | Boolean, only active codes validate |
| `usageCount` | Incremented when a code is used in step 1 |
| `createdAt` | Timestamp |

Codes are created in the `/admin` Referral Codes tab. The admin must choose a
workshop before creating a code, and validation only accepts a code whose
`workshop_id` matches the workshop being registered for. A code made for
another workshop is ignored even if someone opens the link on this workshop.
Codes are shared through `/gen-ai-workshop?ref=CODE`. The platform fee is
recalculated after the discount, so a ₹100 discount with a 2% fee gives a ₹6,018
total.

**`markPaymentPaid` behavior**

1. Find payment by `gatewayResponse.transactionId`, else by `registrationId`.
2. If `payments.status === 'paid'`, return `alreadyPaid` and do nothing more.
3. Otherwise set `status = paid`, store Razorpay ids, append confirmation data to
   `gatewayResponse`.
4. Set `registrations.paymentStatus = paid`.
5. Increment `upcoming_workshops.registered` once.

---

## 10. Idempotency: webhook versus confirm

Both paths call the same `markPaymentPaid` function. The guard at step 2 above
is what makes duplicate calls safe.

- If the webhook arrives first, it marks the payment paid and increments the
  seat count. The later browser `confirm` sees `status === 'paid'` and returns
  `alreadyPaid: true` without incrementing again.
- If the browser `confirm` arrives first, it marks paid and increments. The
  webhook then becomes a no-op.
- A page reload reuses the same success token. The trust rejects the second
  `/confirm` call because the token is single-use. The backend surfaces that as
  an error, but the database is already paid, so no duplicate seat is counted.
  The success page still shows a successful state because the webhook recorded
  the payment.

Because of this, never remove the `status === 'paid'` guard or replace
`increment: 1` with a blind write.

---

## 11. Amount handling: current state and hardening

Current implementation:

- `POST /api/genai/registrations/:id/payment` accepts no amount from the browser.
- The backend reads `GENAI_BASE_PRICE` (₹6,000) and the registration's stored
  `discountAmount`, subtracts the discount and adds
  `GENAI_PLATFORM_FEE_PERCENT` (2%) on the discounted base.
- `calculateGenAiQuote` returns the base, discount, discounted base, platform
  fee, percent, total and currency. `createTrustPaymentSession` signs
  `total * 100` paise.
- The legacy `POST /api/payments/initiate` still accepts a rupee amount from the
  caller for backwards compatibility. New forms must not use it.

This follows the documented security rule: derive the amount server-side and
never accept a price from the browser. When adding a new paid form, follow the
same pattern, for example:

```js
const workshop = await prisma.upcomingWorkshop.findUnique({ where: { id: workshopId } });
if (!workshop?.isPaid) return res.status(400).json({ error: 'Workshop is not paid.' });
const amountInPaise = workshop.fee * 100; // fee is stored in rupees
```

The legacy `initiate` route is the only remaining caller-supplied-amount path.
Do not build a new form on it; use the trusted GenAI route as the model. Any
change to amount handling requires re-running the verification in section 14.

---

## 12. Error handling

| Symptom | Cause | Action |
| :--- | :--- | :--- |
| `Invalid or expired payment session` | Token signature mismatch or malformed | Check secret and URL encoding |
| `Unknown or deactivated payment application` | Wrong `app` id | Use `workshops` and confirm the trust app is active |
| `Amount must be at least ₹1.00` | Under 100 paise | Check amount conversion |
| `Payment service not configured` | Trust Razorpay keys missing | Trust admin must fix |
| `Transaction reference not found or already used` | Success token consumed or expired | Rely on webhook; do not double-submit |
| `Verification reference has expired` | Success token older than 30 minutes | Have user retry from the form |
| `Invalid webhook signature` | Secret mismatch or field mismatch | Compare all five signed fields |
| HTTP 503 on `/api` | Missing `API_PROXY_TARGET` | Set the Railway frontend variable |
| HTTP 401 on admin routes | Missing or wrong admin token | Use the `ADMIN_PASSCODE` login flow |

Frontend behavior:

- `paying` state: "Redirecting to secure payment" while initiating.
- `confirming` state: "Verifying payment" while redeeming the token.
- `failed` state: show the error and a way back; no amount charged.
- Never claim success unless the backend confirms paid or the webhook did.

---

## 13. Security rules

DO:

- Keep the shared secret in backend environment variables only.
- Use HTTPS everywhere.
- Validate email and required fields on client and server.
- Generate a unique `transaction_id` per attempt.
- Verify webhook signatures before touching the database.
- Use parameterized Prisma queries.
- Keep webhook and confirm updates idempotent.
- Keep admin routes behind `ADMIN_PASSCODE`.

DO NOT:

- Add Razorpay keys to this repository.
- Put the secret in frontend code or a public file.
- Trust an amount from the browser for a new form.
- Mark a payment paid without a verified webhook or a successful `/confirm`.
- Reuse the `incuxai` secret or app id for workshops.
- Rotate the `incuxai` secret.
- Use `pay.incuxaieducationtrust.org` or `/pay.html` as the checkout URL.
- Skip cancel and failed handling.

---

## 14. Testing and verification

### Local

1. Start backend with `npm run dev` and a valid `DATABASE_URL`.
2. Start frontend with `npm run dev`. The same-origin `/api` proxy handles calls.
3. Open `/gen-ai-workshop` and confirm the four-step form appears, not a guest
   or candidate portal.
4. Submit step 1 with test data, then advance through steps 2, 3 and 4.
5. With accommodation set to "Yes" and "No, not yet", confirm step 3 is blocked.
6. On step 4 confirm the trusted amount, then check the browser goes to the
   trust `/pay` page with `app=workshops` and `registration` in the return URL.
7. Clear any test registrations, payments and referral codes afterwards so the
   production table stays clean.

### Production checks already performed

- `GET https://workshops.incuxai.com/api/health` returns HTTP 200.
- `GET /api/workshops/upcoming` returns only `WS-GENAI-IIT-HYD-NOV28`.
- `GET /api/genai/config` returns `basePrice: 6000` and `platformFeePercent: 2`.
- Admin `/api/referrals` lists codes created in the `/admin` Referral Codes tab,
  each tagged with its `workshopId`.
- A step 3 request with `hostelAccommodation: 'Yes'` and unpaid accommodation
  returns HTTP 400.
- A trusted payment with a ₹100 discount signs `601800` paise, uses `/pay`,
  `app=workshops`, and carries `registration=<ID>` in the return URL.
- The generated token verifies against the trust's stored `workshops` secret.
- `https://www.incuxaieducationtrust.org/pay?app=workshops` returns HTTP 200.

### Reusable verification commands

Health, workshops, config and referral share links:

```powershell
Invoke-RestMethod https://workshops.incuxai.com/api/health
Invoke-RestMethod https://workshops.incuxai.com/api/workshops/upcoming
Invoke-RestMethod https://workshops.incuxai.com/api/genai/config
```

Trusted quote check with a discount, after creating a code in `/admin`:

```powershell
Invoke-RestMethod https://workshops.incuxai.com/api/genai/referrals/TESTREF100/validate
```

Webhook replay check (use a real captured transaction and a correctly signed
token). First call returns `updated: true` on a new payment; replay returns
`updated: false`.

Database check in Railway Postgres:

```sql
SELECT id, "registrationId", amount, status, "gatewayResponse"
FROM payments ORDER BY created_at DESC LIMIT 10;

SELECT id, "paymentStatus", "currentStep", "referralCode", "discountAmount"
FROM registrations WHERE "workshopId" = 'WS-GENAI-IIT-HYD-NOV28';

SELECT code, "discountAmount", "usageCount" FROM referral_codes;

SELECT id, dates, fee FROM upcoming_workshops;
```

---

## 15. Troubleshooting

| Problem | Likely cause | Fix |
| :--- | :--- | :--- |
| Backend crash loop | Start command running Prisma migrations | Keep `startCommand` as `npm start`; build phase runs `prisma generate` |
| `P3005 schema is not empty` | `migrate deploy` on existing DB | Do not run migrate at startup; see section 17 |
| 502 on `/api` | Backend unhealthy | Check `railway logs --service workshop-backend` |
| 503 on `/api` | Missing proxy target | Set `API_PROXY_TARGET` on frontend |
| Payment page never reaches checkout | Wrong trust URL | Must be `https://www.incuxaieducationtrust.org/pay` |
| Token rejected by trust | Secret mismatch, wrong app, or whitespace | Compare `TRUST_PAYMENT_SECRET` with trust DB |
| Payment paid but DB pending | Webhook not verified or unreachable | Check webhook URL and signature fields |
| Seat count doubled | Idempotency guard removed | Restore `status === 'paid'` early return |
| Admin Payments tab empty | Missing admin token or DB read error | Check `ADMIN_PASSCODE` and Prisma logs |

---

## 16. Checklist: creating a new payment form

Use this for every new paid form, program, or workshop. Do not skip items.

### A. Product and amount

- [ ] Define the product or workshop id and confirm it exists in
      `upcoming_workshops` (or add it) with `isPaid = true` and `fee` in rupees.
- [ ] Decide the price. For the GenAI Workshop it is ₹6,000 plus a 2% platform
      fee, less any admin referral discount applied to the base.
- [ ] Derive the amount server-side from the trusted product record. Do not
      accept the price from the browser for new forms.
- [ ] Convert correctly: `amountInPaise = totalRupees * 100`.
- [ ] Enforce a positive amount.

### B. User-facing form

- [ ] Route the entry button to a dedicated form page, not a guest or candidate
      portal. Current example: `/gen-ai-workshop`.
- [ ] Define the step layout and persist `currentStep` so a user can resume.
- [ ] Collect the required registration fields (for GenAI: full name, gender,
      email, phone, department, year of study, college and college location).
- [ ] Validate client-side: required fields, valid email, phone format if used.
- [ ] Validate server-side again: never rely only on browser validation.
- [ ] Normalize email with `trim().toLowerCase()` before storage and lookup.
- [ ] Show a clear quote including base, discount, platform fee and total.
- [ ] If a discount is supported, derive it from `?ref=CODE` validated against
      `referral_codes`. Do not show a coupon input on the form.
- [ ] If accommodation is involved, make the choice mandatory and gate progress
      on the separate payment being confirmed.
- [ ] Button text should say it goes to a secure payment.
- [ ] Do not render any card fields or Razorpay script on this site.
- [ ] Keep the page inside the viewport. No popups on load.
- [ ] No emojis, sparkles, or decorative dashes in UI copy.

### C. Registration and payment rows

- [ ] Create one `Registration` with `paymentStatus: 'pending'` before redirect.
- [ ] Reuse an existing registration for the same email and workshop instead of
      creating duplicates.
- [ ] Generate a unique `transaction_id`, for example
      `WS-<registrationId>-<timestamp>`.
- [ ] Create one `Payment` with `status: 'pending'` and `amount` in paise.
- [ ] Store `transactionId`, `trustUrl`, and `token` in `gatewayResponse`.
- [ ] Link `upcomingWorkshopId` only when the workshop row exists.

### D. Token and redirect

- [ ] Sign with the `workshops` secret, HMAC-SHA256, base64url, three parts.
- [ ] Payload includes `transaction_id`, `amount`, `currency`, `customer`,
      `metadata.registrationId`, and `callback_url`.
- [ ] `callback_url` is the webhook URL, not the browser return URL.
- [ ] Build the checkout URL in `token&app&redirect` order:
      `https://www.incuxaieducationtrust.org/pay?token=<JWT>&app=workshops&redirect=<RETURN_URL>`.
- [ ] URL-encode `token`, `app` and `redirect`.
- [ ] `redirect` is `PAYMENT_RETURN_URL` (`/payment/success`) plus any
      `registration=<ID>` context the return page needs.
- [ ] Confirm the app id is `workshops` in both the env and the URL.

### E. Return handling

- [ ] Success page handles `status=success` and redeems the `success_token`.
- [ ] Success page handles `status=cancelled` with a clear no-charge message.
- [ ] Success page handles `status=failed&error=...` and shows the error.
- [ ] Success page handles a bare `status` with no token by trusting the webhook.
- [ ] Provide `/payment/cancel` help page for cancelled or failed payments.
- [ ] Return the user to `/gen-ai-workshop?registration=<ID>` so the saved step
      and payment status are visible.
- [ ] Give the user a retry path that creates a new transaction id.

### F. Webhook and confirmation

- [ ] Register `PAYMENT_WEBHOOK_URL` on the trust app record.
- [ ] Verify the webhook signature over all five signed fields.
- [ ] Reject unknown events with `{ received: true, ignored: true }`.
- [ ] Reject invalid signatures with HTTP 401.
- [ ] Call `markPaymentPaid` from both webhook and confirm.
- [ ] Keep the `status === 'paid'` early return.
- [ ] Increment `registered` exactly once.
- [ ] Store Razorpay order and payment ids in the payment row.

### G. Admin and visibility

- [ ] Confirm `/api/payments/all` returns the new payment with registration data.
- [ ] Confirm the `/admin` Payments tab shows status `paid` after a test.
- [ ] Decide whether a confirmation email is needed and implement it after a
      successful paid state.
- [ ] Confirm the workshop's `registered` count updates once.

### H. Environment and deployment

- [ ] Backend has all payment variables from section 4 set in Railway.
- [ ] Frontend has `API_PROXY_TARGET` set to the backend private URL.
- [ ] No backend URL is hardcoded in frontend config.
- [ ] No custom server file added to `frontend`; deployment works from
      `package.json` alone.
- [ ] ES modules everywhere; no CommonJS `require` in app code.
- [ ] Build generates the Prisma client; start command is `npm start`.
- [ ] Redeploy and re-run the production checks in section 14.

### I. Documentation

- [ ] Add the new form, price, and route to this file.
- [ ] If a new trust app is created, add its id, secret location, and webhook to
      `PAYMENT_CONFIG.md` and the trust guide.
- [ ] Never paste a secret into a client-facing doc.

---

## 17. Operations: Railway

Project: `incuxai-workshop`, production environment.

- Backend service: `workshop-backend`, private host
  `steadfast-beauty.railway.internal`, port `5000`.
- Frontend service: `workshop-frontend`, public domain `workshops.incuxai.com`.
- Database: `Postgres`.

Useful CLI commands:

```bash
railway status
railway variables --service workshop-backend
railway variables --service workshop-frontend
railway logs --service workshop-backend
railway variable set KEY=value --service workshop-backend
railway variable set API_PROXY_TARGET=http://steadfast-beauty.railway.internal:5000 --service workshop-frontend
railway service restart workshop-backend
```

Backend start command:

```json
{
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health"
  }
}
```

The build phase runs `npx prisma generate` through `backend/nixpacks.toml`.
Do not re-add `prisma migrate deploy` or `prisma db push` to the start command.
The production database has schema drift from `schema.prisma`; those commands
fail with `P3005` or a drift SQL error and prevent the server from starting.
All required tables and columns already exist.

---

## 18. File map

| File | Role |
| :--- | :--- |
| `backend/server.js` | Payment routes, token signing and verification, `markPaymentPaid` |
| `backend/prisma/schema.prisma` | Payment, Registration, UpcomingWorkshop models |
| `backend/railway.json` | Start command and healthcheck |
| `backend/nixpacks.toml` | Build phase Prisma generation |
| `frontend/src/services/api.js` | GenAI step helpers, referral admin helpers, `initiatePayment`, `confirmPayment`, status helpers |
| `frontend/src/components/GenAiWorkshopRegistration.jsx` | Four-step registration, accommodation gate and trusted checkout |
| `frontend/src/components/UpcomingWorkshopsSection.jsx` | Single-workshop text list and registration CTA |
| `frontend/src/components/PortalModal.jsx` | Admin Payments, Referral Codes and Form Builder tabs |
| `frontend/src/components/WorkshopFormBuilder.jsx` | Five-step admin builder for new workshops |
| `frontend/src/components/DynamicWorkshopRegistration.jsx` | Public stepped form rendered from database config |
| `frontend/src/components/PaymentSuccess.jsx` | Browser return confirmation and back to registration |
| `frontend/src/components/PaymentCancel.jsx` | Cancelled or failed help page |
| `frontend/src/components/Navbar.jsx`, `MenuOverlay.jsx` | Admin console links for desktop and mobile |
| `frontend/src/App.jsx` | `/gen-ai-workshop`, `/ai-workshop` and payment route declarations |
| `frontend/vite.config.js` | Same-origin `/api` proxy |
| `PAYMENT_CONFIG.md` | Two-site app and secret reference |
| `PAYMENT_INTEGRATION_PLAN.md` | Implementation summary |
| `RAZORPAY_INTEGRATION.md` | This complete guide |
| Trust repo `docs/PAYMENT_GATEWAY_INTEGRATION.md` | Authoritative trust platform guide |
| Trust repo `server/modules/payments/routes.js` | Trust session, verify, confirm endpoints |
| Trust repo `server/modules/payments/store.js` | `notifyAppPaid` webhook sender |
| Trust repo `server/modules/payments/core/token.js` | Authoritative token algorithm |
| Trust repo `server/cli/payment-apps.js` | App registration CLI |

---

## 19. Config-driven workshop form endpoints

New workshops are stored as data and rendered at `/register/<slug>`. The Nov 28
to 29 GenAI flow is unchanged and continues to use its own routes.

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/forms` | Admin list of saved workshop forms |
| `POST` | `/api/forms` | Admin create from a stored JSON config |
| `GET` | `/api/forms/:id` | Admin load one form for editing |
| `PUT` | `/api/forms/:id` | Admin replace a form config |
| `DELETE` | `/api/forms/:id` | Admin remove a form config |
| `GET` | `/api/forms/by-slug/:slug` | Public load of a published form |
| `POST` | `/api/forms/:slug/steps` | Public save one stepped answer set |
| `GET` | `/api/forms/:slug/registrations/resume?email=` | Public resume by email |
| `GET` | `/api/forms/registrations/:id` | Public load a saved registration |
| `POST` | `/api/forms/registrations/:id/payment` | Admin-equivalent trusted checkout for a completed form |

Only payment components marked as charged online are totalled by the server.
The browser never sends an amount. A Payment step is required and must be the
last step. The payment step also requires the terms tick box to be accepted on
the server before a checkout session is created.

The interview skill, config reference and API helper live in
`.opencode/skills/workshop-intake/`.
