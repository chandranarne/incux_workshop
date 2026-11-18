# Workshop form config

The helper script and `POST /api/forms` accept this JSON shape. Step keys and
slugs are lowercased and converted to hyphens when saved. Field keys keep
underscores so preset names such as `full_name`, `year_of_study` and
`college_location` stay intact.

```json
{
  "title": "Generative AI for Educators",
  "slug": "genai-educators",
  "category": "Generative AI",
  "dates": "December 12-13, 2026",
  "location": "Guntur",
  "mode": "Offline",
  "description": "A hands-on workshop for teaching teams.",
  "status": "Published",
  "accommodationRequired": true,
  "accommodationPaymentUrl": "https://pages.razorpay.com/example",
  "whatsappUrl": "https://chat.whatsapp.com/example",
  "accommodationNote": "Accommodation is paid separately and is not the workshop fee.",
  "steps": [
    {
      "key": "personal",
      "title": "Personal Information",
      "description": "Tell us who is attending.",
      "kind": "fields",
      "fields": [
        { "key": "full_name", "label": "Full name", "type": "text", "required": true },
        { "key": "email", "label": "Email address", "type": "email", "required": true },
        { "key": "gender", "label": "Gender", "type": "select", "options": ["Male", "Female", "Other"], "required": true }
      ]
    },
    {
      "key": "documents",
      "title": "Workshop Documents",
      "description": "Read these before you attend.",
      "kind": "documents",
      "fields": []
    },
    {
      "key": "accommodation",
      "title": "Accommodation",
      "description": "Tell us about your stay.",
      "kind": "accommodation",
      "fields": []
    },
    {
      "key": "payment",
      "title": "Workshop Payment",
      "description": "Review the fee breakdown and pay.",
      "kind": "payment",
      "fields": []
    }
  ],
  "documents": [
    { "title": "Workshop brochure", "url": "https://example.com/brochure.pdf" }
  ],
  "components": [
    { "label": "Workshop fee", "amount": 6000, "kind": "base", "chargeOnline": true, "externalUrl": "" },
    { "label": "Platform fee", "amount": 120, "kind": "platform_fee", "chargeOnline": true, "externalUrl": "" }
  ]
}
```

## Field types

`text`, `email`, `phone`, `number`, `date`, `textarea`, `select`, `checkbox`.
A `select` field needs a non-empty `options` array. A `checkbox` is required
only when it must be ticked.

## Step kinds

- `fields`: renders the configured fields and validates required ones.
- `documents`: renders the links from `documents`.
- `accommodation`: renders the payment link, WhatsApp link, note, the Yes or No
  question, and the payment confirmation tick box.
- `payment`: renders the component breakdown, terms tick box and checkout
  button.

At least one step is required. Step keys must be unique. Field keys must be
unique across the whole form because all answers are stored in one intake
object.

## Payment rules

- `amount` is a whole number of rupees.
- Only components with `chargeOnline: true` are added to the secure checkout.
- A component with `chargeOnline: false` should carry an `externalUrl`.
- The server recalculates the total from stored components. Never accept an
  amount from the browser.

## Reserved intake keys

The accommodation step writes `__accommodationChoice` and
`__accommodationPaid`. The payment step writes `__termsAccepted`. Do not use
these as field keys.

## Useful field presets

`full_name`, `email`, `phone`, `gender`, `department`, `year_of_study`,
`college`, `college_location`. These are available as one-click presets in the
admin Form Builder and can be copied into this JSON.
