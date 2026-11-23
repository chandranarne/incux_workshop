---
name: Workshop Intake
description: Interview a non-technical organiser about a new workshop and turn the answers into a published, stepped registration form in the incux_workshop app
---

# Workshop Intake

Use this skill when someone describes a new workshop, asks for a registration
form, or asks to add a workshop with custom intake fields, documents,
accommodation details or a payment split. The output is a data-driven form in
Railway PostgreSQL and a public URL of the shape `/register/<slug>`.

The existing Generative AI workshop at `/gen-ai-workshop` is a separate,
verified flow. Do not edit or migrate it as part of this skill.

## Workflow

1. Explain the process in plain language. Say that you will ask a series of
   questions and then build the form. Do not mention code or database tables to
   the organiser.
2. Ask the questions below in small groups. Wait for the answers. Ask follow-up
   questions until every required answer is concrete. Never guess a date, a
   link, an amount, a policy or a field, and never leave a placeholder in the
   final form.
3. Convert the answers into the JSON shape in `references/config-schema.md`.
4. Validate the JSON before sending it. Check that step keys and field keys are
   unique, every field has a label and key, select fields have options,
   document links start with `http://` or `https://`, payment amounts are whole
   numbers of rupees, and the online total is the sum of online components.
5. Show the organiser a short plain-language summary of the form (steps, field
   names, documents, accommodation rule, amount to pay) and get confirmation.
6. Save the JSON to a temporary file outside the repository. Run the helper:

   ```sh
   WORKSHOP_API_BASE=https://<backend>/api ADMIN_PASSCODE=<passcode> \
     node .opencode/skills/workshop-intake/scripts/create-workshop-form.mjs <file.json>
   ```

   To edit an existing form, append `--update <form-id>`. Values come from the
   environment only. Never hardcode a backend URL or a passcode in a file.
7. Verify the result. Fetch `GET /api/forms/by-slug/<slug>`, then open
   `/register/<slug>` in the browser and walk every step. Confirm that no popup
   opens by itself, no console error appears, there is no horizontal overflow
   at 800px, and no sparkle, emoji, em dash or en dash appears in the UI.
8. If you used a test registration during verification, delete it from
   PostgreSQL afterwards. Report the published link and the form id to the
   organiser.

## Interview questions

### Basics
- What is the exact workshop title?
- What dates should appear, exactly as you want visitors to read them?
- Where is it held, and is it online, offline or hybrid?
- What short category label should appear above the title?
- What should the short description say to someone deciding whether to attend?
- What URL slug do you want, for example `genai-december`?

### Intake steps and fields
- What steps should a participant see, in order? Suggest a default of Personal
  Information, workshop details, documents, accommodation and payment if they
  are unsure.
- For each step, what exact information do you need from the participant?
- For each piece of information, ask: what is the field label, what kind of
  answer is it (short text, paragraph, email, phone, number, date, choice list,
  or tick box), is it mandatory, and what help text should appear under it?
- For choice lists, what are the exact options?
- Which single email field should be used to let someone resume a saved form?

### Documents
- Which workshop documents should be shared? Ask for the exact title and the
  exact `https://` link for each one.

### Accommodation
- Do you need to know whether attendees want accommodation?
- Is accommodation paid separately before the workshop payment can continue?
- What is the exact accommodation payment link?
- What is the exact WhatsApp group link?
- What note should explain that this is an accommodation only payment and who
  receives it?

### Payment split
- What is the workshop fee in rupees?
- Is there a platform fee? If so, how much?
- Which components are paid in the secure checkout, and which are paid through
  a separate link?
- What should each component be called on the payment summary?

### Publishing
- Should the form be published now, or saved as a draft for review first?

## Rules

- A code is never needed from the organiser. All answers come from the
  interview.
- Keep the public workflow open. Do not add accounts or a login screen.
- The browser never sets an amount. All amounts are stored in the form config
  and totalled by the server before a checkout session is created.
- Payment goes through the existing trust platform callback and return pages.
  Do not add Razorpay keys to this repository.
- Use `₹` for money in the UI. Do not use emojis, sparkles, em dashes or en
  dashes anywhere in generated copy.
- Choose one visual language: the app uses a light and dark palette with yellow
  accents. Reuse the existing components and Tailwind classes rather than
  adding a new design system.
- After changing any source file, run `node --check backend/server.js` and
  `npx vite build` in the frontend directory before reporting completion.
