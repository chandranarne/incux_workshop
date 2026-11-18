# Payment Gateway Integration - Implementation Summary

> For the complete integration guide, new form checklist, and troubleshooting,
> see `RAZORPAY_INTEGRATION.md` in this repository.

## Architecture

Two services, separate Railway deployments:

| Service | Role | Technology |
|---------|------|------------|
| `workshops.incuxai.com` frontend | Workshop listings, payment form, return pages | Vite + React, served by `vite preview` |
| Workshops backend | Registration, trust token signing, confirmation, webhook, admin API | Express + Prisma + Railway PostgreSQL |
| `www.incuxaieducationtrust.org` | Trust checkout at `/pay`, verification, success token and webhook | Node.js + Express + Prisma |

The frontend talks to the backend through the same-origin `/api` proxy configured in
`frontend/vite.config.js`. No backend URL is hardcoded in the frontend.

## Payment Flow

```
1. User opens /payment from the Upcoming Workshops section (Rs.6,000 workshop).
2. User enters name, email, phone and institution.
3. Frontend POST /api/payments/initiate with workshopId, amount (rupees), payer fields.
4. Backend creates Registration (pending) + Payment (pending, amount in paise),
   signs an HMAC-SHA256 token, and returns the trust platform URL.
5. Frontend redirects to `https://www.incuxaieducationtrust.org/pay?token=<token>&redirect=<PAYMENT_RETURN_URL>&app=workshops`.
6. Trust creates the Razorpay order and the user pays Rs.6,000.
7. Trust verifies the Razorpay signature, issues a success_token, and:
   a. POSTs a signed webhook to /api/payments/webhook, and
   b. redirects the browser to /payment/success?status=success&token=<success_token>.
8. Backend webhook verifies the HMAC signature and marks Payment + Registration paid.
9. PaymentSuccess calls GET /api/payments/confirm?reference=<success_token>.
10. Backend redeems the success_token with trust /api/payments/confirm and applies
    the same idempotent update. A reload or replay never double-counts a seat.
```

Payment status is stored in Railway PostgreSQL in `payments.status`,
`registrations.paymentStatus`, and `payments.gatewayResponse`, and is visible in
the admin console under the Payments tab.

## Backend Routes (`backend/server.js`)

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/payments/initiate` | POST | Public | Create registration and payment, sign trust token, return trust URL |
| `/api/payments/webhook` | POST | HMAC signature | Server-to-server `payment.captured` notification from trust |
| `/api/payments/confirm` | GET | Public | Redeem `success_token` with trust and mark DB paid |
| `/api/payments/status/:registrationId` | GET | Public | Check the latest payment for a registration |
| `/api/payments/all` | GET | Admin token | List all payments for the admin console |

## Database (Prisma, Railway PostgreSQL)

- `Payment`: id, registrationId, upcomingWorkshopId, razorpayOrderId, razorpayPaymentId,
  razorpaySignature, amount (paise), currency, status, gatewayResponse, timestamps
- `UpcomingWorkshop`: `fee` (rupees) and `isPaid`
- `Registration`: `paymentStatus` (`pending`, `paid`, `failed`)

The tables are created with schema-qualified names (`public.*`) matching the
`@@map` values in `schema.prisma`. The production database already contains the
required tables and columns, and has drifted from the current schema file, so
neither `migrate deploy` nor `db push` is run at startup. See
`RAZORPAY_INTEGRATION.md` section 17 for the Railway configuration.

## Environment Variables

### Backend (Railway Variables)

```
DATABASE_URL=<Railway PostgreSQL connection string>
TRUST_PAYMENT_SECRET=<same secret registered for the workshops app on the trust platform>
TRUST_PAYMENT_URL=https://www.incuxaieducationtrust.org
TRUST_PAYMENT_APP_ID=workshops
PAYMENT_RETURN_URL=https://workshops.incuxai.com/payment/success
PAYMENT_WEBHOOK_URL=https://workshops.incuxai.com/api/payments/webhook
ADMIN_PASSCODE=<admin console passphrase>
```

`PAYMENT_CANCEL_URL` is optional and informational. The trust platform appends
`status=cancelled` or `status=failed` to `PAYMENT_RETURN_URL`, which the success and
cancel pages handle.

### Frontend (Railway Variables)

```
API_PROXY_TARGET=http://steadfast-beauty.railway.internal:5000
```

Use the private Railway URL for the backend so `/api` traffic stays off the public
edge. Without it the frontend answers `/api` with an explicit `503`.

## Setup Steps

### 1. Register the workshops app on the trust platform

On the `Incuxai_education_trust` backend (the CLI path is `server/cli`):

```bash
node server/cli/payment-apps.js add workshops "IncuXai Workshops" \
  --secret YJzdcqnlnQloysQ2jrmwk1TxzktTxTaqj-p6UiCUIulajN4gIx41H-Nj70yelXU6 \
  --callback https://workshops.incuxai.com/api/payments/webhook
```

The secret is the value of `TRUST_PAYMENT_SECRET` on the workshops backend. It is
set in Railway and is not stored in the repository. Do not rotate or reuse the
`incuxai` app, which serves live incuxai.com payments.

### 2. Set Railway variables

Set the backend and frontend variables listed above. The Prisma client is
generated during the build phase (`backend/nixpacks.toml`), and
`backend/railway.json` starts the server with `npm start` only. Do not add
`prisma migrate deploy` or `prisma db push` to the start command: the production
database already has all required tables, and those commands fail on the existing
schema and prevent the server from starting.

### 3. Verify

- `GET /api/health` reports PostgreSQL (Railway via Prisma).
- `POST /api/payments/initiate` returns `trustUrl`, `registrationId` and `transactionId`.
- A signed `payment.captured` webhook returns `{"received":true,"updated":true}` once,
  then `updated:false` on replay, and the payment status becomes `paid`.
- `/admin` shows the payment with status `paid`.

## Token Signing

Header, payload and signature are base64url encoded and joined with dots:

```
header = base64url({"alg":"HS256","typ":"JWT"})
body   = base64url({transaction_id, amount, currency, customer, metadata, callback_url})
sig    = HMAC-SHA256(TRUST_PAYMENT_SECRET, header + "." + body)
token  = header + "." + body + "." + sig
```

The same algorithm verifies webhook signatures issued by the trust platform.

## Frontend Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/payment` | `PaymentPage` | Details form, redirect to trust, handles direct return tokens |
| `/payment/success` | `PaymentSuccess` | Confirms the token and shows the receipt, handles cancelled/failed status |
| `/payment/cancel` | `PaymentCancel` | Cancelled or failed payment help page |

## Files Changed

- `backend/server.js`: initiate, webhook, confirm, status and admin payment routes
- `backend/prisma/schema.prisma`: Payment model, fee/isPaid/paymentStatus, registrationId index
- `backend/prisma/migrations/20260101000000_init/migration.sql`: schema-qualified tables
- `frontend/src/services/api.js`: initiatePayment signature, confirmed paid default workshop
- `frontend/src/components/PaymentPage.jsx`: calls initiatePayment with all payer fields
- `frontend/src/components/PaymentSuccess.jsx`: verifies success token on return
- `frontend/src/components/UpcomingWorkshopsSection.jsx`: compact list, no cards
- `frontend/src/components/Pages/AiWorkshopDetail.jsx`: plain hyphens, no sparkle icon
- `frontend/index.html`: removed unused Razorpay checkout script
- `PAYMENT_INTEGRATION_PLAN.md`: this document
- `README.md`: deployment and environment reference
