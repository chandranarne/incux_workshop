import fs from 'node:fs/promises';

const [file, mode, updateId] = process.argv.slice(2);
const apiBase = (process.env.WORKSHOP_API_BASE || '').replace(/\/+$/, '');
const passcode = process.env.ADMIN_PASSCODE || '';

if (!file || !apiBase || !passcode) {
  console.error(
    'Usage: WORKSHOP_API_BASE=https://<backend>/api ADMIN_PASSCODE=<passcode> node create-workshop-form.mjs <config.json> [--update <form-id>]'
  );
  process.exit(1);
}

const payload = JSON.parse(await fs.readFile(file, 'utf8'));

const call = async (path, options = {}) => {
  const response = await fetch(`${apiBase}${path}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.errors?.join('; ') || `HTTP ${response.status}`);
  }
  return data;
};

try {
  const session = await call('/admin/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode })
  });
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.token}`
  };

  const result = mode === '--update'
    ? await call(`/forms/${encodeURIComponent(updateId)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      })
    : await call('/forms', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

  console.log(JSON.stringify({
    id: result.form.id,
    slug: result.form.slug,
    title: result.form.title,
    status: result.form.status,
    steps: result.form.steps.map((step) => step.key),
    onlineTotal: result.form.quote.total,
    registerUrl: `/register/${result.form.slug}`
  }, null, 2));
} catch (error) {
  console.error(`Could not save the workshop form: ${error.message}`);
  process.exit(1);
}
