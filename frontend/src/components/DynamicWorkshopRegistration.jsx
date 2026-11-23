import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Building2,
  ExternalLink,
  FileText,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import {
  fetchPublishedWorkshopForm,
  submitFormStep,
  resumeFormRegistration,
  fetchFormRegistration,
  initiateFormPayment,
  fetchPaymentStatus
} from '../services/api';

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white dark:bg-[#141414] border border-black/15 dark:border-[#333333] text-sm text-[#0A0A0A] dark:text-[#F5F5F5] outline-none focus:border-[#EAB308] dark:focus:border-[#FACC15] transition-colors';
const labelClass =
  'block text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5';

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

function FieldInput({ field, value, onChange, error }) {
  const common = {
    id: `field-${field.key}`,
    value: value === undefined || value === null ? '' : value,
    onChange: (event) => onChange(field.key, event.target.value),
    className: inputClass
  };

  let control;
  if (field.type === 'textarea') {
    control = <textarea {...common} rows={4} placeholder={field.placeholder} />;
  } else if (field.type === 'select') {
    const options = Array.isArray(field.options) ? field.options : [];
    control = (
      <select {...common}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  } else if (field.type === 'checkbox') {
    control = (
      <label className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#141414] border border-black/15 dark:border-[#333333] cursor-pointer">
        <input
          id={`field-${field.key}`}
          type="checkbox"
          checked={value === true}
          onChange={(event) => onChange(field.key, event.target.checked)}
          className="mt-0.5 w-4 h-4 accent-[#FACC15]"
        />
        <span className="text-sm text-neutral-700 dark:text-neutral-300">{field.label}</span>
      </label>
    );
  } else {
    control = (
      <input
        {...common}
        type={field.type === 'phone' ? 'tel' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
        placeholder={field.placeholder}
      />
    );
  }

  return (
    <div>
      {field.type !== 'checkbox' && (
        <label htmlFor={`field-${field.key}`} className={labelClass}>
          {field.label}
          {field.required ? ' *' : ''}
        </label>
      )}
      {control}
      {field.helpText && (
        <p className="mt-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">{field.helpText}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}

export default function DynamicWorkshopRegistration({ slug, onBackHome }) {
  const [form, setForm] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState({});
  const [registration, setRegistration] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('unknown');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeEmail, setResumeEmail] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const loaded = await fetchPublishedWorkshopForm(slug);
        if (!active) return;
        setForm(loaded);

        const params = new URLSearchParams(window.location.search);
        const registrationId = String(params.get('registration') || '').trim();
        if (registrationId) {
          const result = await fetchFormRegistration(registrationId);
          if (!active) return;
          if (result.registration && result.form?.id === loaded.id) {
            setRegistration(result.registration);
            setValues(result.registration.intakeData || {});
            setStepIndex(
              Math.min(Math.max(Number(result.registration.currentStep) - 1, 0), loaded.steps.length - 1)
            );
            try {
              const status = await fetchPaymentStatus(registrationId);
              if (active && status) setPaymentStatus(status.status || 'unknown');
            } catch {
              // Status polling is best effort.
            }
          }
        }
      } catch (err) {
        if (active) setError(err.message || 'This workshop form could not be loaded.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const steps = form?.steps || [];
  const step = steps[stepIndex];
  const setValue = (key, value) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: '' }));
  };

  const handleResume = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const found = await resumeFormRegistration(slug, resumeEmail);
      if (!found) {
        setError('No registration was found for that email address.');
        return;
      }
      setRegistration(found);
      setValues(found.intakeData || {});
      setStepIndex(Math.min(Math.max(Number(found.currentStep) - 1, 0), steps.length - 1));
      setResumeOpen(false);
      setNotice('Your saved progress has been restored.');
    } catch (err) {
      setError(err.message || 'Could not resume your registration.');
    } finally {
      setBusy(false);
    }
  };

  const handleNext = async () => {
    if (!step) return;
    setBusy(true);
    setError('');
    setErrors({});
    try {
      const result = await submitFormStep(slug, {
        registrationId: registration?.id || undefined,
        stepKey: step.key,
        values
      });
      setRegistration(result.registration);
      if (result.nextStepKey) {
        const nextIndex = steps.findIndex((item) => item.key === result.nextStepKey);
        if (nextIndex >= 0) setStepIndex(nextIndex);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.message?.includes('highlighted') && err.errors) {
        setErrors(err.errors);
      }
      setError(err.message || 'Could not save this step.');
    } finally {
      setBusy(false);
    }
  };

  const handlePayment = async () => {
    if (!registration) {
      setError('Save your details before starting payment.');
      return;
    }
    setBusy(true);
    setError('');
    setErrors({});
    try {
      const confirmed = await submitFormStep(slug, {
        registrationId: registration.id,
        stepKey: step.key,
        values: { ...values, __termsAccepted: true }
      });
      const result = await initiateFormPayment(confirmed.registration.id);
      window.location.assign(result.trustUrl);
    } catch (err) {
      setError(err.message || 'Could not start the secure checkout.');
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FDFCFA] dark:bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600 dark:text-[#FACC15]" />
      </main>
    );
  }

  if (error && !form) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5]">
        <div className="max-w-md p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
          <h1 className="font-headline font-black text-xl mb-2">Workshop unavailable</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{error}</p>
          <button onClick={onBackHome} className="mt-6 text-sm font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-[#FACC15] cursor-pointer">
            Back to site
          </button>
        </div>
      </main>
    );
  }

  const quote = form?.quote || { lines: [], total: 0, currency: 'INR' };

  return (
    <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <button
          onClick={onBackHome}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-[#FACC15] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to site
        </button>

        <header className="mt-6 pb-7 border-b border-black/10 dark:border-[#262626]">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-[#FACC15]">
            {form?.category || 'Workshop'} registration
          </p>
          <h1 className="mt-2 font-headline font-black text-3xl sm:text-4xl tracking-tight">
            {form?.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
            {form?.dates && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {form.dates}
              </span>
            )}
            {form?.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {form.location}
              </span>
            )}
            {form?.mode && (
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> {form.mode}
              </span>
            )}
          </div>
          {form?.description && (
            <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {form.description}
            </p>
          )}
        </header>

        <div className="mt-7 flex items-center justify-between gap-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Step {Math.min(stepIndex + 1, steps.length)} of {steps.length}
          </p>
          {!registration && (
            <button
              type="button"
              onClick={() => setResumeOpen((open) => !open)}
              className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-[#FACC15] cursor-pointer"
            >
              Resume with email
            </button>
          )}
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-black/10 dark:bg-[#262626] overflow-hidden">
          <div
            className="h-full bg-[#FACC15] transition-all duration-300"
            style={{ width: `${steps.length ? ((stepIndex + 1) / steps.length) * 100 : 0}%` }}
          />
        </div>

        {resumeOpen && !registration && (
          <form onSubmit={handleResume} className="mt-5 p-5 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
            <label className={labelClass} htmlFor="resume-email">
              Email used at registration
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="resume-email"
                type="email"
                required
                value={resumeEmail}
                onChange={(event) => setResumeEmail(event.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
              <button
                type="submit"
                disabled={busy}
                className="px-5 py-3 rounded-xl bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] font-mono font-bold text-xs cursor-pointer disabled:opacity-40"
              >
                {busy ? 'Checking' : 'Resume'}
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="mt-5 flex items-start gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-sm text-rose-700 dark:text-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
          </div>
        )}
        {notice && (
          <div className="mt-5 flex items-start gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-sm text-emerald-700 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {notice}
          </div>
        )}

        {step && (
          <section className="mt-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-xl">
            <h2 className="font-headline font-black text-xl sm:text-2xl">{step.title}</h2>
            {step.description && (
              <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{step.description}</p>
            )}

            {step.kind === 'fields' && (
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {step.fields.map((field) => (
                  <div key={field.id} className={field.type === 'textarea' || field.type === 'checkbox' ? 'sm:col-span-2' : ''}>
                    <FieldInput
                      field={field}
                      value={values[field.key]}
                      onChange={setValue}
                      error={errors[field.key]}
                    />
                  </div>
                ))}
              </div>
            )}

            {step.kind === 'documents' && (
              <div className="mt-7 space-y-3">
                {(form.documents || []).length === 0 && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">No documents have been shared for this workshop.</p>
                )}
                {form.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 p-4 rounded-xl border border-black/10 dark:border-[#333333] hover:border-[#FACC15] transition-colors"
                  >
                    <span className="flex items-center gap-2.5 text-sm font-semibold">
                      <FileText className="w-4 h-4 text-amber-600 dark:text-[#FACC15]" /> {doc.title}
                    </span>
                    <ExternalLink className="w-4 h-4 text-neutral-400" />
                  </a>
                ))}
              </div>
            )}

            {step.kind === 'accommodation' && (
              <div className="mt-7 space-y-5">
                {form.accommodationRequired && (
                  <>
                    {form.accommodationPaymentUrl && (
                      <a
                        href={form.accommodationPaymentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-4 p-4 rounded-xl border border-black/10 dark:border-[#333333] hover:border-[#FACC15] transition-colors text-sm font-semibold"
                      >
                        <span className="flex items-center gap-2.5">
                          <CreditCard className="w-4 h-4 text-amber-600 dark:text-[#FACC15]" /> Pay for accommodation
                        </span>
                        <ExternalLink className="w-4 h-4 text-neutral-400" />
                      </a>
                    )}
                    {form.whatsappUrl && (
                      <a
                        href={form.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-4 p-4 rounded-xl border border-black/10 dark:border-[#333333] hover:border-[#FACC15] transition-colors text-sm font-semibold"
                      >
                        <span className="flex items-center gap-2.5">
                          <ExternalLink className="w-4 h-4 text-amber-600 dark:text-[#FACC15]" /> Join the accommodation WhatsApp group
                        </span>
                        <ExternalLink className="w-4 h-4 text-neutral-400" />
                      </a>
                    )}
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {form.accommodationNote ||
                        'This is the accommodation fee only. It is paid separately and is not part of the workshop fee charged on the next step.'}
                    </p>
                  </>
                )}

                <div>
                  <p className={labelClass}>Do you need accommodation? *</p>
                  <div className="flex flex-wrap gap-3">
                    {['Yes', 'No'].map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => setValue('__accommodationChoice', choice)}
                        className={`px-5 py-2.5 rounded-xl border text-sm font-mono font-bold cursor-pointer ${
                          values.__accommodationChoice === choice
                            ? 'border-[#FACC15] bg-[#FACC15]/15 text-amber-700 dark:text-[#FACC15]'
                            : 'border-black/15 dark:border-[#333333] text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                  {errors.__accommodationChoice && (
                    <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">{errors.__accommodationChoice}</p>
                  )}
                </div>

                {values.__accommodationChoice === 'Yes' && (
                  <label className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-[#1A1A1A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={values.__accommodationPaid === true}
                      onChange={(event) => setValue('__accommodationPaid', event.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#FACC15]"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      I have completed the accommodation payment.
                    </span>
                  </label>
                )}
                {errors.__accommodationPaid && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">{errors.__accommodationPaid}</p>
                )}
              </div>
            )}

            {step.kind === 'payment' && (
              <div className="mt-7 space-y-5">
                <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-[#262626]">
                  <table className="w-full text-left text-sm font-mono">
                    <thead className="bg-[#FDFCFA] dark:bg-[#0A0A0A] text-amber-600 dark:text-[#FACC15]">
                      <tr>
                        <th className="p-3">Fee component</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 dark:divide-[#262626]">
                      {quote.lines.map((line) => (
                        <tr key={line.id}>
                          <td className="p-3">
                            {line.label}
                            {!line.chargeOnline && line.externalUrl && (
                              <a href={line.externalUrl} target="_blank" rel="noreferrer" className="ml-2 text-amber-600 dark:text-[#FACC15] inline-flex items-center gap-1">
                                Pay separately <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </td>
                          <td className="p-3 text-right">{money(line.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#FDFCFA] dark:bg-[#0A0A0A] font-bold">
                      <tr>
                        <td className="p-3">Amount payable now</td>
                        <td className="p-3 text-right">{money(quote.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {paymentStatus === 'paid' && (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-sm text-emerald-700 dark:text-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> Payment confirmed. Your seat is secured.
                  </div>
                )}

                <label className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-[#1A1A1A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.__termsAccepted === true}
                    onChange={(event) => setValue('__termsAccepted', event.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#FACC15]"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    I have read the workshop details and agree to the Terms and Privacy Policy.
                  </span>
                </label>
                {errors.__termsAccepted && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">{errors.__termsAccepted}</p>
                )}

                {registration?.registrationCode && (
                  <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    Registration code: {registration.registrationCode}
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
                disabled={stepIndex === 0 || busy}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-black/15 dark:border-[#333333] text-sm font-mono font-bold cursor-pointer disabled:opacity-40"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {step.kind === 'payment' ? (
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={busy || paymentStatus === 'paid' || values.__termsAccepted !== true}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-black text-xs uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  Pay {money(quote.total)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-black text-xs uppercase tracking-wider cursor-pointer disabled:opacity-40"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {stepIndex === steps.length - 1 ? 'Finish' : 'Continue'} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
