# Payment Gateway Integration — Implementation Summary

## Architecture

**Two services, separate deployments:**

| Service | Role | Technology |
|---------|------|------------|
| `workshops.incuxai.com` (frontend + backend) | Workshop listings, registration, payment initiation/confirmation | Vite + Express + Prisma + Railway PostgreSQL |
| `pay.incuxaieducationtrust.org` (trust platform) | Razorpay checkout, payment verification, webhook | Node.js + Express + Prisma + Railway PostgreSQL |

## Payment Flow

```
1. User clicks "Pay ₹6,000 & Register" on workshops.incuxai.com
2. Frontend → POST /api/payments/initiate (backend)
3. Backend creates Registration (pending) + Payment (pending), signs HMAC-SHA256 token
4. Backend returns trust platform URL
5. Frontend redirects user to trust platform pay.html?token=XXX
6. Trust platform creates Razorpay order, user pays ₹6,000
7. Trust platform verifies Razorpay signature, issues success_token
8. Trust platform redirects back to workshops.incuxai.com/payment/success?status=success&token=XXX
9. Frontend → GET /api/payments/confirm?reference=XXX (backend)
10. Backend verifies with trust platform /api/payments/confirm
11. Backend updates Payment + Registration to "paid" in Railway PostgreSQL
12. User sees confirmation page
```

## Backend Routes (`backend/server.js`)

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/payments/initiate` | POST | Public | Sign token, create Registration + Payment, return trust URL |
| `/api/payments/confirm` | GET | Public | Verify success_token with trust platform, update DB to paid |
| `/api/payments/status/:id` | GET | Public | Check payment status for a registration |
| `/api/payments/all` | GET | Admin token | List all payments (admin dashboard) |

## Database Models (Prisma, Railway PostgreSQL)

- **Payment**: id, registrationId, razorpayOrderId, razorpayPaymentId, razorpaySignature, amount (paise), currency, status, gatewayResponse, timestamps
- **UpcomingWorkshop**: added `fee` (₹, default 0), `isPaid` (boolean)
- **Registration**: added `paymentStatus` (pending/paid/failed)

## Environment Variables

### Backend (Railway Variables)
```
TRUST_PAYMENT_SECRET=<secret from trust platform payment-apps.js>
TRUST_PAYMENT_URL=https://pay.incuxaieducationtrust.org
TRUST_PAYMENT_APP_ID=incuxai
PAYMENT_RETURN_URL=https://workshops.incuxai.com/payment/success
PAYMENT_CANCEL_URL=https://workshops.incuxai.com/payment/cancel
DATABASE_URL=<Railway PostgreSQL connection string>
```

### Frontend (.env, gitignored)
```
VITE_API_BASE=/api
VITE_TRUST_PAYMENT_URL=https://pay.incuxaieducationtrust.org
```

## Setup Steps (Required Before Deploy Works)

### 1. Register workshops app on trust platform
Run on the `Incuxai_education_trust` backend:
```bash
node src/cli/payment-apps.js add incuxai "IncuXai.com" --callback https://workshops.incuxai.com/api/payments/webhook
```
Save the `Secret Key` output — it won't be shown again.

### 2. Set Railway Variables
On the **workshops.incuxai.com backend** service in Railway:
- `TRUST_PAYMENT_SECRET` = the secret key from step 1
- `TRUST_PAYMENT_URL` = `https://pay.incuxaieducationtrust.org`
- `TRUST_PAYMENT_APP_ID` = `incuxai`
- `ADMIN_PASSCODE` = your admin passcode (for /admin console)

### 3. Run Prisma Migrate
On the backend service, run:
```
npx prisma migrate deploy
```
This creates the `payments` table and adds `fee`/`isPaid`/`paymentStatus` columns.

## Frontend Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/payment` | `PaymentPage` | Candidate details form → redirect to trust platform |
| `/payment/success` | `PaymentSuccess` | Payment confirmation page |
| `/payment/cancel` | `PaymentCancel` | Payment cancelled/failed page |

## Token Signing (HMAC-SHA256 JWT-like)

The backend signs tokens using the same algorithm as `incuxai.com`'s `TrustPaymentToken.php`:

```
header = base64url({"alg":"HS256","typ":"JWT"})
body   = base64url({transaction_id, amount, currency, customer, metadata, callback_url})
sig    = HMAC-SHA256(secret, header + "." + body)
token  = header + "." + body + "." + sig
```

The trust platform verifies this token at `/api/payments/session` before creating the Razorpay order.

## Files Changed

- `backend/server.js` — payment routes (initiate, confirm, status, all)
- `backend/prisma/schema.prisma` — Payment model, fee/isPaid/paymentStatus fields
- `frontend/src/components/PaymentPage.jsx` — details form, trust redirect, confirm
- `frontend/src/components/PaymentSuccess.jsx` — success page
- `frontend/src/components/PaymentCancel.jsx` — cancel/failed page
- `frontend/src/components/UpcomingWorkshopsSection.jsx` — Pay button for paid workshops
- `frontend/src/services/api.js` — initiatePayment, confirmPayment, fetchPaymentStatus, fetchAllPayments
- `frontend/index.html` — no longer needs Razorpay script (trust platform handles it)
- `PAYMENT_INTEGRATION_PLAN.md` — this document