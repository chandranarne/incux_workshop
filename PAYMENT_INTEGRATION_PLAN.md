# Payment Gateway Integration - Implementation Plan

## Overview
Integrate Razorpay payment gateway (via IncuXai Education Trust) for paid workshop registrations on workshops.incuxai.com. Students pay ₹6,000, are redirected to the trust platform for payment, and return to the website after success. Payment status is stored in Railway PostgreSQL and visible to admins.

## Prerequisites (from incuxai.com / incux_educational_trust)

| Item | Source | Where to get |
|------|--------|--------------|
| Razorpay Key ID | `incuxai.com` PHP files | `incuxai.com` website PHP source |
| Razorpay Key Secret | `incuxai.com` PHP files | `incuxai.com` website PHP source |
| Webhook Secret | `incux_educational_trust` folder | Trust platform dashboard |
| Return URLs | `incuxai.com` integration docs | Trust platform settings |

> **Action needed**: Share the `incux_educational_trust` folder contents and the PHP secret codes from `incuxai.com` so I can hardcode the correct keys. Until then, env vars are used as placeholders.

## Database Changes (Railway PostgreSQL via Prisma)

### New model: `Payment`
```prisma
model Payment {
  id               String   @id @map("id")
  registrationId   String   @map("registrationId")
  razorpayOrderId  String?  @map("razorpayOrderId")
  razorpayPaymentId String? @map("razorpayPaymentId")
  razorpaySignature String? @map("razorpaySignature")
  amount           Int      @map("amount")        // in paise (₹6000 = 600000)
  currency         String   @default("INR") @map("currency")
  status           String   @default("pending") @map("status") // pending, paid, failed, refunded
  gatewayResponse  Json?    @map("gatewayResponse")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  registration     Registration @relation(fields: [registrationId], references: [id])

  @@map("public.payments")
}
```

### Updated model: `UpcomingWorkshop`
Add `fee` and `isPaid` fields:
```prisma
model UpcomingWorkshop {
  ...
  fee              Int      @default(0) @map("fee")       // in rupees, 0 = free
  isPaid           Boolean  @default(false) @map("isPaid")
  ...
}
```

### Updated model: `Registration`
Add `paymentStatus` field:
```prisma
model Registration {
  ...
  paymentStatus    String   @default("pending") @map("paymentStatus") // pending, paid, failed
  ...
}
```

## Backend Changes (`backend/server.js`)

### New routes (all under `/api/payments`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/payments/create-order` | Public | Create Razorpay order for workshop registration |
| POST | `/api/payments/verify` | Public | Verify Razorpay payment signature |
| POST | `/api/payments/webhook` | Public (webhook secret) | Razorpay webhook for async payment status |
| GET | `/api/payments/status/:registrationId` | Public | Get payment status for a registration |
| GET | `/api/payments/all` | Admin token | List all payments (admin view) |

### Environment variables needed
```
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
RAZORPAY_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXX
PAYMENT_RETURN_URL=https://workshops.incuxai.com/payment/success
PAYMENT_CANCEL_URL=https://workshops.incuxai.com/payment/cancel
```

## Frontend Changes

### New component: `frontend/src/components/PaymentPage.jsx`
- Accepts `registrationId` and `amount` as props/query params
- Creates Razorpay order via `/api/payments/create-order`
- Opens Razorpay checkout (redirects to trust platform)
- Handles success callback → redirects to `/payment/success`
- Handles failure → redirects to `/payment/cancel`

### New page: `frontend/src/components/PaymentSuccess.jsx`
- Shows payment confirmation
- Displays registration details
- Link back to home

### New page: `frontend/src/components/PaymentCancel.jsx`
- Shows payment failed message
- Retry payment option

### Updated: `frontend/src/components/UpcomingWorkshopsSection.jsx`
- Show "Pay ₹6,000 & Register" button for paid workshops
- Show "Register Free" for free workshops
- Pass `fee` and `isPaid` from workshop data

### Updated: `frontend/src/components/PortalModal.jsx`
- Payment status shown in "My Enrolled Workshops"
- Link to payment page if payment pending

### New API service: `frontend/src/services/api.js`
```js
export const createPaymentOrder = async (registrationId, amount) => { ... }
export const verifyPayment = async (paymentData) => { ... }
export const fetchPaymentStatus = async (registrationId) => { ... }
```

### New route in `frontend/src/App.jsx`
- `/payment` → `PaymentPage`
- `/payment/success` → `PaymentSuccess`
- `/payment/cancel` → `PaymentCancel`

## Railway Database Authentication

The backend already connects to Railway PostgreSQL via `DATABASE_URL` in `prisma/schema.prisma`. No additional auth needed - Prisma uses the connection string directly.

### Admin payment dashboard
Add to AdminPage (PortalModal admin tabs):
- "Payments" tab showing all payments with status
- Filter by status (pending, paid, failed)
- Export option

## Redirect Flow

```
1. User clicks "Pay ₹6,000 & Register" on upcoming workshop
2. Frontend creates registration (pending) via /api/workshops/:id/register
3. Frontend calls /api/payments/create-order with registrationId
4. Backend creates Razorpay order, returns orderId
5. Frontend opens Razorpay checkout (redirects to trust platform)
6. User pays ₹6,000 on trust platform
7. Razorpay redirects to /payment/success with payment details
8. Frontend calls /api/payments/verify to confirm signature
9. Backend verifies signature, updates Payment + Registration status to "paid"
10. User sees confirmation page
```

## Files to Create/Modify

### Create
- `backend/prisma/migrations/xxxx_add_payment_model/` (migration)
- `frontend/src/components/PaymentPage.jsx`
- `frontend/src/components/PaymentSuccess.jsx`
- `frontend/src/components/PaymentCancel.jsx`

### Modify
- `backend/prisma/schema.prisma` — add Payment model, update Workshop & Registration
- `backend/server.js` — add payment routes
- `frontend/src/services/api.js` — add payment API functions
- `frontend/src/components/UpcomingWorkshopsSection.jsx` — paid workshop button
- `frontend/src/components/PortalModal.jsx` — payment status display
- `frontend/src/App.jsx` — payment routes
- `frontend/.env` — Razorpay keys (placeholder)
- `backend/.env` — Razorpay keys (placeholder)

## Testing Checklist
- [ ] Payment order creation returns valid Razorpay order ID
- [ ] Razorpay checkout opens with correct amount (₹6,000)
- [ ] Successful payment redirects back to /payment/success
- [ ] Payment status updates to "paid" in database
- [ ] Webhook updates status asynchronously
- [ ] Admin can view all payments in portal
- [ ] Failed payments show "failed" status
- [ ] Free workshops (₹0) skip payment flow
