# Payment Configuration: incuxai.com + workshops.incuxai.com

Both sites initiate payments through the **same** IncuXai Education Trust platform,
but use **different app ids and different shared secrets**. The trust picks the
correct secret by the `app` query parameter in the checkout URL.

> These are shared HMAC secrets. Keep both repositories private and never put the
> values in frontend code or a public file. They must be byte-for-byte identical
> on the initiating site and in the trust database's `payment_apps` table.

---

## 1. Shared trust platform

| Item | Value |
| :--- | :--- |
| Base URL | `https://www.incuxaieducationtrust.org` |
| Checkout page | `https://www.incuxaieducationtrust.org/pay` |
| Redirect format | `/pay?token=<JWT>&app=<APP_ID>&redirect=<RETURN_URL>` |
| Create session | `POST https://www.incuxaieducationtrust.org/api/payments/session` |
| Verify payment | `POST https://www.incuxaieducationtrust.org/api/payments/verify` |
| Redeem success token | `POST https://www.incuxaieducationtrust.org/api/payments/confirm` |
| Health | `GET https://www.incuxaieducationtrust.org/api/health` |
| Token algorithm | JWT-like HMAC-SHA256 over `base64url(header).base64url(payload)` |
| Token lifetime | 30 minutes |
| Success token lifetime | 30 minutes |

After payment the browser is sent back to `redirect` with these appended:

| Outcome | Appended query |
| :--- | :--- |
| Success | `status=success&token=<SUCCESS_TOKEN>` |
| Cancelled | `status=cancelled` |
| Failed | `status=failed&error=<MESSAGE>` |

Separately, the trust server POSTs a signed `payment.captured` webhook to the
`callback_url` in the token payload. If the token has no `callback_url`, the trust
uses the app's default `callback_url` from `payment_apps`.

---

## 2. Site A: incuxai.com

| Item | Value |
| :--- | :--- |
| App ID | `incuxai` |
| Shared secret | `cqkA6o4OJuqVcWOdFYi2tIsvVwmc1a1Mh3qos8MkOdOfIiQJSif3M88Ogd_oozkm` |
| Default webhook (app record) | `https://incuxai.com/handlers/verify-iit-mnc-payment.php` |
| Token signer | `public_html/app/handlers/TrustPaymentToken.php` |
| Config constants | `public_html/config/database.php` (`TRUST_PAYMENT_SECRET`, `TRUST_PAYMENT_URL`) |

incuxai.com has several programs that share this one app id and secret. Each
signs its own token and each sets its own `callback_url` in the token payload;
the trust's browser `redirect` is the program success page.

| Program | Token `callback_url` (server webhook) | Browser return URL |
| :--- | :--- | :--- |
| IIT & MNC Workshop | empty, uses app default `https://incuxai.com/handlers/verify-iit-mnc-payment.php` | `https://incuxai.com/iit-mnc-payment-success.php?reg_id=<ID>` |
| IIT Workshop | `https://incuxai.com/handlers/verify-iit-workshop-payment.php` | `https://incuxai.com/iit-workshop-payment-success.php?reg_id=<ID>` |
| Gen AI Workshop | `https://incuxai.com/handlers/verify-gen-ai-workshop-payment.php` | `https://incuxai.com/gen-ai-workshop-payment-success.php?reg_id=<ID>` |

Each success page calls `POST /api/payments/confirm` on the trust with the returned
success token before marking its local database row paid.

---

## 3. Site B: workshops.incuxai.com

| Item | Value |
| :--- | :--- |
| App ID | `workshops` |
| Shared secret | `YJzdcqnlnQloysQ2jrmwk1TxzktTxTaqj-p6UiCUIulajN4gIx41H-Nj70yelXU6` |
| Webhook | `https://workshops.incuxai.com/api/payments/webhook` |
| Browser return (success) | `https://workshops.incuxai.com/payment/success` |
| Browser return (cancel) | `https://workshops.incuxai.com/payment/cancel` |
| Token signer | `backend/server.js` (`signTrustToken`) |
| Paid workshop | AI Workshop, Rs.6,000, id `WS-HYBRID-10D` |

Flow:

```
/payment details form
  -> POST /api/payments/initiate
  -> redirect https://www.incuxaieducationtrust.org/pay?token=...&app=workshops&redirect=https://workshops.incuxai.com/payment/success
  -> trust webhook POST /api/payments/webhook  (marks Railway DB paid)
  -> browser /payment/success?status=success&token=<SUCCESS_TOKEN>
  -> GET /api/payments/confirm?reference=<SUCCESS_TOKEN>  (idempotent re-check)
```

---

## 4. Railway variables

### Frontend service (workshops)

| Variable | Value |
| :--- | :--- |
| `API_PROXY_TARGET` | `http://backend.railway.internal:5000` |

### Backend service (workshops)

| Variable | Value |
| :--- | :--- |
| `DATABASE_URL` | Railway PostgreSQL connection string |
| `ADMIN_PASSCODE` | Admin console passphrase |
| `TRUST_PAYMENT_SECRET` | `YJzdcqnlnQloysQ2jrmwk1TxzktTxTaqj-p6UiCUIulajN4gIx41H-Nj70yelXU6` |
| `TRUST_PAYMENT_URL` | `https://www.incuxaieducationtrust.org` |
| `TRUST_PAYMENT_APP_ID` | `workshops` |
| `PAYMENT_RETURN_URL` | `https://workshops.incuxai.com/payment/success` |
| `PAYMENT_CANCEL_URL` | `https://workshops.incuxai.com/payment/cancel` |
| `PAYMENT_WEBHOOK_URL` | `https://workshops.incuxai.com/api/payments/webhook` |

### incuxai.com (hosting `.env.production`, not Railway)

| Variable | Value |
| :--- | :--- |
| `TRUST_PAYMENT_SECRET` | `cqkA6o4OJuqVcWOdFYi2tIsvVwmc1a1Mh3qos8MkOdOfIiQJSif3M88Ogd_oozkm` |
| `TRUST_PAYMENT_URL` | `https://www.incuxaieducationtrust.org` |

---

## 5. Trust database (`payment_apps`)

| app_id | name | secret_key | callback_url |
| :--- | :--- | :--- | :--- |
| `incuxai` | IncuXai.com | `cqkA6o4...` | `https://incuxai.com/handlers/verify-iit-mnc-payment.php` |
| `workshops` | IncuXai Workshops | `YJzdcq...` | `https://workshops.incuxai.com/api/payments/webhook` |

Manage with:

```bash
node server/cli/payment-apps.js list
node server/cli/payment-apps.js info workshops
node server/cli/payment-apps.js info incuxai
```

Full secrets are in sections 2 and 3. Do not rotate `incuxai`: that would break
all incuxai.com payment programs. Each app has its own secret, so payments from
the two sites are isolated and can be debugged independently.

---

## 6. Live verification performed

- Both app records present and active in the trust `payment_apps` table.
- `incuxai` secret matches the value in incuxai.com docs.
- `workshops` secret matches `backend/.env`.
- Backend-signed token verifies with the trust verifier using the `workshops` secret.
- Trust-signed webhook verifies with the backend verifier.
- `https://www.incuxaieducationtrust.org/pay?app=workshops` returns HTTP 200.
