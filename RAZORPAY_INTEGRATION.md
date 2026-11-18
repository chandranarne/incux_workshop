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
    "workshopTitle": "AI Workshop",
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
https://www.incuxaieducationtrust.org/pay?token=<JWT>&redirect=<RETURN_URL>&app=workshops
```

All three query values are URL-encoded. `redirect` is the browser return URL;
`callback_url` inside the token is the server webhook. They are different and
both are required.

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

1. User opens `/payment?workshopId=WS-HYBRID-10D&amount=6000&workshopTitle=AI%20Workshop`
   from the workshop detail page.
2. `PaymentPage` shows a personal-details form: full name and email required,
   phone and institution optional.
3. On submit, the frontend calls `POST /api/payments/initiate` with workshop id,
   amount in rupees, title, and payer fields.
4. The backend multiplies rupees by 100 to get paise, creates or reuses a
   `Registration` with `paymentStatus: pending`, and creates a `Payment` with
   `status: pending`. The `gatewayResponse` JSON stores `transactionId`,
   `trustUrl`, and the signed `token`.
5. The backend signs the token and returns `trustUrl` plus ids to the frontend.
6. The frontend redirects the browser with `window.location.assign(data.trustUrl)`.
7. The trust verifies the token against the `workshops` secret, creates a
   Razorpay order, and opens its checkout page.
8. The user pays ₹6,000 in the Razorpay modal.
9. The trust verifies the Razorpay signature, marks its order paid, and issues a
   single-use `success_token` that expires after 30 minutes.
10. The trust POSTs a signed `payment.captured` webhook to
    `/api/payments/webhook`. The backend verifies the signature and calls
    `markPaymentPaid`, which sets `payments.status = paid`,
    `registrations.paymentStatus = paid`, and increments
    `upcoming_workshops.registered` once.
11. The trust redirects the browser to
    `/payment/success?status=success&token=<SUCCESS_TOKEN>`.
12. `PaymentSuccess` calls `GET /api/payments/confirm?reference=<SUCCESS_TOKEN>`.
13. The backend POSTs `{ reference }` to trust `/api/payments/confirm`, receives
    the transaction details, and applies the same idempotent update.
14. The user sees the confirmation screen. The admin can see the payment in the
    `/admin` Payments tab.

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
| `/api/payments/initiate` | POST | Public | Create pending registration and payment, sign token, return `trustUrl` |
| `/api/payments/webhook` | POST | HMAC signature | Trust server-to-server `payment.captured` notification |
| `/api/payments/confirm` | GET | Public | Redeem `success_token` with trust and apply idempotent update |
| `/api/payments/status/:registrationId` | GET | Public | Latest payment for a registration |
| `/api/payments/all` | GET | Admin token | List all payments with registration data |

`initiate` request body:

```json
{
  "registrationId": "optional existing id",
  "workshopId": "WS-HYBRID-10D",
  "amount": 6000,
  "currency": "INR",
  "workshopTitle": "AI Workshop",
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
| `/payment` | `PaymentPage` | Personal-details form, initiate call, redirect to trust, handles direct return tokens |
| `/payment/success` | `PaymentSuccess` | Confirms success token, shows receipt, handles cancelled and failed |
| `/payment/cancel` | `PaymentCancel` | Cancelled or failed payment help page |

`PaymentPage` reads `workshopId`, `amount`, and `workshopTitle` from the query
string. It calls `initiatePayment(...)` from `frontend/src/services/api.js`, then
redirects to `data.trustUrl`.

`PaymentSuccess` reads `status` and `token` (or `reference`) and calls
`confirmPayment(reference)`.

The paid workshop entry point is `AiWorkshopDetail.jsx`, whose register buttons
navigate to `/payment` with the ₹6,000 parameters. It must not open a
candidate or guest portal.

Service helpers in `frontend/src/services/api.js`:

- `initiatePayment(registrationId, workshopId, amount, workshopTitle, payerName, payerEmail, payerPhone, candidateInstitution)`
- `confirmPayment(reference)`
- `fetchPaymentStatus(registrationId)`
- `fetchAllPayments()` with admin headers

---

## 9. Database: what is stored

Prisma schema: `backend/prisma/schema.prisma`. Database: Railway PostgreSQL.

**`registrations`**

| Column | Notes |
| :--- | :--- |
| `id` | e.g. `REG-<timestamp>` |
| `workshopId`, `workshopTitle`, category, dates, location, mode | Workshop snapshot |
| `candidateName`, `candidateEmail`, `candidatePhone`, `candidateInstitution` | Payer details |
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
seats. The ₹6,000 workshop is `WS-HYBRID-10D`.

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

- `AiWorkshopDetail.jsx` passes `amount=6000` in the URL.
- `PaymentPage.jsx` parses it and sends it to `/api/payments/initiate`.
- The backend does `Math.round(amount * 100)` and signs that value.

This works, but it trusts a client-supplied amount. The documented security rule
is to derive the amount server-side. When adding a new paid form, follow the
hardened pattern:

```js
// Preferred: look up the trusted price by workshopId and ignore client amount.
const workshop = await prisma.upcomingWorkshop.findUnique({ where: { id: workshopId } });
if (!workshop?.isPaid) return res.status(400).json({ error: 'Workshop is not paid.' });
const amountInPaise = workshop.fee * 100; // fee is stored in rupees
```

For the existing ₹6,000 flow, a safe future change is to compute `amountInPaise`
from `upcoming_workshops.fee` using `workshopId`, and only use the request amount
as a fallback for legacy frontend-only workshops. Do not make this change
without re-running the verification checklist in section 14.

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
2. Start frontend with `npm run dev` and `VITE_API_BASE=http://localhost:5000/api`.
3. Open the paid workshop detail page and click Register.
4. Confirm the personal-details form appears, not a guest portal.
5. Submit with test data and confirm the browser goes to the trust `/pay` page.
6. Use a small test amount if available, otherwise use the production checks below.

### Production checks already performed

- `GET https://workshops.incuxai.com/api/health` returns HTTP 200.
- `POST /api/payments/initiate` returns HTTP 200 with `appId: workshops`,
  `amount: 600000`, and a URL beginning
  `https://www.incuxaieducationtrust.org/pay?`.
- The generated token verifies against the trust's stored `workshops` secret.
- `https://www.incuxaieducationtrust.org/pay?app=workshops` returns HTTP 200.

### Reusable verification commands

Health:

```powershell
Invoke-RestMethod https://workshops.incuxai.com/api/health
```

Initiate:

```powershell
$body = @{
  workshopId='WS-HYBRID-10D'; amount=6000; currency='INR';
  workshopTitle='AI Workshop'; payerName='Test User';
  payerEmail='test@example.com'; payerPhone='9999999999'
} | ConvertTo-Json
Invoke-RestMethod -Method Post `
  -Uri https://workshops.incuxai.com/api/payments/initiate `
  -Body $body -ContentType 'application/json'
```

Webhook replay check (use a real captured transaction and a correctly signed
token). First call returns `updated: true` on a new payment; replay returns
`updated: false`.

Database check in Railway Postgres:

```sql
SELECT id, "registrationId", amount, status, "gatewayResponse"
FROM payments ORDER BY created_at DESC LIMIT 10;

SELECT id, "paymentStatus" FROM registrations
WHERE "workshopId" = 'WS-HYBRID-10D';
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
- [ ] Decide the price. For the existing AI Workshop it is ₹6,000.
- [ ] Derive the amount server-side from the trusted product record. Do not
      accept the price from the browser for new forms.
- [ ] Convert correctly: `amountInPaise = feeInRupees * 100`.
- [ ] Enforce a minimum of 100 paise.

### B. User-facing form

- [ ] Route the entry button to a dedicated form page, not a guest or candidate
      portal. Existing example: `/payment?workshopId=...&amount=...&workshopTitle=...`.
- [ ] Collect, at minimum: full name and email address.
- [ ] Collect optional but recommended: phone and institution.
- [ ] Validate client-side: required fields, valid email, phone format if used.
- [ ] Validate server-side again: never rely only on browser validation.
- [ ] Normalize email with `trim().toLowerCase()` before storage and lookup.
- [ ] Show the amount clearly on the form.
- [ ] Button text should say it goes to a secure payment, for example
      "Proceed to Secure Payment".
- [ ] Do not render any card fields or Razorpay script on this site.
- [ ] Keep the popup/page inside the viewport. No popups on load.
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
- [ ] Build the checkout URL:
      `https://www.incuxaieducationtrust.org/pay?token=<JWT>&redirect=<RETURN_URL>&app=workshops`.
- [ ] URL-encode `token` and `redirect`.
- [ ] `redirect` is `PAYMENT_RETURN_URL` (`/payment/success`).
- [ ] Confirm the app id is `workshops` in both the env and the URL.

### E. Return handling

- [ ] Success page handles `status=success` and redeems the `success_token`.
- [ ] Success page handles `status=cancelled` with a clear no-charge message.
- [ ] Success page handles `status=failed&error=...` and shows the error.
- [ ] Success page handles a bare `status` with no token by trusting the webhook.
- [ ] Provide `/payment/cancel` help page for cancelled or failed payments.
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
| `frontend/src/services/api.js` | `initiatePayment`, `confirmPayment`, status helpers |
| `frontend/src/components/PaymentPage.jsx` | Personal-details form and redirect |
| `frontend/src/components/PaymentSuccess.jsx` | Browser return confirmation |
| `frontend/src/components/PaymentCancel.jsx` | Cancelled or failed help page |
| `frontend/src/components/Pages/AiWorkshopDetail.jsx` | ₹6,000 entry point |
| `frontend/src/App.jsx` | Payment route declarations |
| `frontend/vite.config.js` | Same-origin `/api` proxy |
| `PAYMENT_CONFIG.md` | Two-site app and secret reference |
| `PAYMENT_INTEGRATION_PLAN.md` | Implementation summary |
| `RAZORPAY_INTEGRATION.md` | This complete guide |
| Trust repo `docs/PAYMENT_GATEWAY_INTEGRATION.md` | Authoritative trust platform guide |
| Trust repo `server/modules/payments/routes.js` | Trust session, verify, confirm endpoints |
| Trust repo `server/modules/payments/store.js` | `notifyAppPaid` webhook sender |
| Trust repo `server/modules/payments/core/token.js` | Authoritative token algorithm |
| Trust repo `server/cli/payment-apps.js` | App registration CLI |
