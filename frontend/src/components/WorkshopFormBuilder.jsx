import React, { useEffect, useState } from 'react';
import {
  GripVertical,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  CreditCard,
  Building2,
  User,
  Save,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Link2
} from 'lucide-react';
import {
  fetchWorkshopForms,
  fetchWorkshopFormById,
  createWorkshopForm,
  updateWorkshopForm,
  deleteWorkshopForm
} from '../services/api';

const WIZARD_STEPS = [
  { key: 'basics', label: 'Workshop details' },
  { key: 'intake', label: 'Steps and fields' },
  { key: 'extras', label: 'Docs and stay' },
  { key: 'payment', label: 'Payment split' },
  { key: 'review', label: 'Review' }
];

const FIELD_PRESETS = [
  { label: 'Full name', key: 'full_name', type: 'text', required: true },
  { label: 'Email address', key: 'email', type: 'email', required: true },
  { label: 'Phone number', key: 'phone', type: 'phone', required: true },
  { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
  { label: 'Department', key: 'department', type: 'text', required: true },
  { label: 'Year of study', key: 'year_of_study', type: 'select', options: ['1', '2', '3', '4', 'Graduated'], required: true },
  { label: 'College', key: 'college', type: 'text', required: true },
  { label: 'College location', key: 'college_location', type: 'text', required: true }
];

const FIELD_TYPES = ['text', 'email', 'phone', 'number', 'date', 'textarea', 'select', 'checkbox'];

const emptyForm = () => ({
  title: '',
  slug: '',
  category: '',
  dates: '',
  location: '',
  mode: 'Offline',
  description: '',
  status: 'Draft',
  accommodationRequired: false,
  accommodationPaymentUrl: '',
  whatsappUrl: '',
  accommodationNote: '',
  steps: [
    {
      key: 'personal',
      title: 'Personal Information',
      description: 'Tell us who is attending.',
      kind: 'fields',
      fields: []
    }
  ],
  documents: [],
  components: [
    { label: 'Workshop fee', amount: 0, kind: 'base', chargeOnline: true, externalUrl: '' },
    { label: 'Platform fee', amount: 0, kind: 'platform_fee', chargeOnline: true, externalUrl: '' }
  ]
});

const toEditable = (form) => ({
  title: form.title || '',
  slug: form.slug || '',
  category: form.category || '',
  dates: form.dates || '',
  location: form.location || '',
  mode: form.mode || 'Offline',
  description: form.description || '',
  status: form.status || 'Draft',
  accommodationRequired: Boolean(form.accommodationRequired),
  accommodationPaymentUrl: form.accommodationPaymentUrl || '',
  whatsappUrl: form.whatsappUrl || '',
  accommodationNote: form.accommodationNote || '',
  steps: (form.steps || []).map((step) => ({
    key: step.key,
    title: step.title,
    description: step.description || '',
    kind: step.kind,
    fields: (step.fields || []).map((field) => ({
      key: field.key,
      label: field.label,
      type: field.type,
      placeholder: field.placeholder || '',
      helpText: field.helpText || '',
      required: Boolean(field.required),
      options: Array.isArray(field.options) ? field.options : [],
      orderIndex: field.orderIndex || 0
    }))
  })),
  documents: (form.documents || []).map((doc) => ({ title: doc.title, url: doc.url })),
  components: (form.components || []).map((component) => ({
    label: component.label,
    amount: component.amount,
    kind: component.kind,
    chargeOnline: Boolean(component.chargeOnline),
    externalUrl: component.externalUrl || ''
  }))
});

const reorder = (items, from, to) => {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

const inputClass =
  'w-full px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1A1A1A] border border-black/15 dark:border-[#333333] text-sm outline-none focus:border-[#FACC15]';
const labelClass =
  'block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5';

export default function WorkshopFormBuilder({ notify }) {
  const [wizardStep, setWizardStep] = useState(0);
  const [forms, setForms] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [draft, setDraft] = useState(emptyForm);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [dragStep, setDragStep] = useState(null);
  const [dragField, setDragField] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadForms = async () => {
    try {
      const list = await fetchWorkshopForms();
      setForms(list);
    } catch (err) {
      setError(err.message || 'Could not load saved workshop forms.');
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const chooseForm = async (id) => {
    setSelectedId(id);
    setError('');
    setSuccess('');
    if (!id) {
      setDraft(emptyForm());
      setActiveStepIndex(0);
      return;
    }
    try {
      const form = await fetchWorkshopFormById(id);
      setDraft(toEditable(form));
      setActiveStepIndex(0);
    } catch (err) {
      setError(err.message || 'Could not open that workshop form.');
    }
  };

  const set = (key, value) => setDraft((previous) => ({ ...previous, [key]: value }));

  const updateStep = (index, patch) =>
    setDraft((previous) => ({
      ...previous,
      steps: previous.steps.map((step, i) => (i === index ? { ...step, ...patch } : step))
    }));

  const addStep = (kind) => {
    const titles = {
      fields: 'Additional Information',
      documents: 'Workshop Documents',
      accommodation: 'Accommodation',
      payment: 'Payment'
    };
    setDraft((previous) => ({
      ...previous,
      steps: [
        ...previous.steps,
        {
          key: `step-${previous.steps.length + 1}`,
          title: titles[kind],
          description: '',
          kind,
          fields: []
        }
      ]
    }));
    setActiveStepIndex(draft.steps.length);
  };

  const addField = (preset) => {
    const step = draft.steps[activeStepIndex];
    if (!step || step.kind !== 'fields') return;
    const key = preset.key || `field_${Date.now().toString().slice(-6)}`;
    if (step.fields.some((field) => field.key === key)) {
      setError('That field key is already used in this step.');
      return;
    }
    updateStep(activeStepIndex, {
      fields: [
        ...step.fields,
        {
          key,
          label: preset.label || 'New field',
          type: preset.type || 'text',
          placeholder: '',
          helpText: '',
          required: Boolean(preset.required),
          options: preset.options || [],
          orderIndex: step.fields.length
        }
      ]
    });
    setError('');
  };

  const updateField = (stepIndex, fieldIndex, patch) => {
    const step = draft.steps[stepIndex];
    updateStep(stepIndex, {
      fields: step.fields.map((field, i) => (i === fieldIndex ? { ...field, ...patch } : field))
    });
  };

  const save = async (status) => {
    setBusy(true);
    setError('');
    setSuccess('');
    const payload = { ...draft, status };
    try {
      const result = selectedId
        ? await updateWorkshopForm(selectedId, payload)
        : await createWorkshopForm(payload);
      setSelectedId(result.form.id);
      setDraft(toEditable(result.form));
      setSuccess(`${result.form.title} saved as ${result.form.status}.`);
      notify?.('success', 'Workshop form saved.');
      await loadForms();
    } catch (err) {
      setError(err.message || 'Could not save the workshop form.');
      notify?.('error', 'Workshop form could not be saved.');
    } finally {
      setBusy(false);
    }
  };

  const removeForm = async () => {
    if (!selectedId || !window.confirm('Remove this workshop form? Registrations already made will stay in the database.')) return;
    setBusy(true);
    try {
      await deleteWorkshopForm(selectedId);
      notify?.('success', 'Workshop form removed.');
      await chooseForm('');
      await loadForms();
    } catch (err) {
      setError(err.message || 'Could not remove the workshop form.');
    } finally {
      setBusy(false);
    }
  };

  const onlineTotal = draft.components
    .filter((component) => component.chargeOnline)
    .reduce((sum, component) => sum + (Number(component.amount) || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h4 className="font-headline font-bold text-2xl text-neutral-950 dark:text-[#F5F5F5]">
          Workshop Form Builder
        </h4>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Build a new workshop in five steps. Reorder steps and fields by dragging them or using the arrows. Save a draft at any point, then publish when ready.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end p-5 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
        <div>
          <label className={labelClass}>Open a saved workshop</label>
          <select value={selectedId} onChange={(event) => chooseForm(event.target.value)} className={inputClass}>
            <option value="">New workshop</option>
            {forms.map((form) => (
              <option key={form.id} value={form.id}>
                {form.title} ({form.status})
              </option>
            ))}
          </select>
        </div>
        {selectedId && (
          <button
            type="button"
            onClick={removeForm}
            disabled={busy}
            className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-mono font-bold cursor-pointer"
          >
            Remove form
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {WIZARD_STEPS.map((item, index) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setWizardStep(index)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer border ${
              wizardStep === index
                ? 'bg-[#FACC15] border-[#FACC15] text-[#0A0A0A]'
                : 'border-black/15 dark:border-[#333333] text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {index + 1}. {item.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-sm text-rose-700 dark:text-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-sm text-emerald-700 dark:text-emerald-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> {success}
        </div>
      )}

      {wizardStep === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
          {[
            ['title', 'Workshop title'],
            ['slug', 'URL slug, for example genai-december'],
            ['category', 'Category'],
            ['dates', 'Dates'],
            ['location', 'Location'],
            ['mode', 'Mode']
          ].map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input value={draft[key]} onChange={(event) => set(key, event.target.value)} className={inputClass} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className={labelClass}>Description shown on the registration page</label>
            <textarea rows={4} value={draft.description} onChange={(event) => set('description', event.target.value)} className={inputClass} />
          </div>
        </div>
      )}

      {wizardStep === 1 && (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
            {[
              ['fields', 'Information fields', User],
              ['documents', 'Documents step', FileText],
              ['accommodation', 'Accommodation step', Building2],
              ['payment', 'Payment step', CreditCard]
            ].map(([kind, label, Icon]) => (
              <button
                key={kind}
                type="button"
                onClick={() => addStep(kind)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/15 dark:border-[#333333] text-xs font-mono font-bold cursor-pointer hover:border-[#FACC15]"
              >
                <Icon className="w-3.5 h-3.5" /> Add {label}
              </button>
            ))}
          </div>

          {draft.steps.map((step, stepIndex) => (
            <div
              key={`${step.key}-${stepIndex}`}
              draggable
              onDragStart={() => setDragStep(stepIndex)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragStep !== null) setDraft((previous) => ({ ...previous, steps: reorder(previous.steps, dragStep, stepIndex) }));
                setDragStep(null);
              }}
              className={`p-5 rounded-2xl bg-white dark:bg-[#141414] border ${
                activeStepIndex === stepIndex ? 'border-[#FACC15]' : 'border-black/10 dark:border-[#262626]'
              }`}
            >
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 mt-2 text-neutral-400 shrink-0 cursor-grab" />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Step title</label>
                    <input value={step.title} onChange={(event) => updateStep(stepIndex, { title: event.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Step key</label>
                    <input value={step.key} onChange={(event) => updateStep(stepIndex, { key: event.target.value })} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Step description</label>
                    <input value={step.description} onChange={(event) => updateStep(stepIndex, { description: event.target.value })} className={inputClass} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => setDraft((previous) => ({ ...previous, steps: reorder(previous.steps, stepIndex, stepIndex - 1) }))} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" title="Move up">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => setDraft((previous) => ({ ...previous, steps: reorder(previous.steps, stepIndex, stepIndex + 1) }))} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" title="Move down">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => setDraft((previous) => ({ ...previous, steps: previous.steps.filter((_, i) => i !== stepIndex) }))} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer" title="Remove step">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStepIndex(stepIndex)}
                className="mt-4 text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-[#FACC15] cursor-pointer"
              >
                {activeStepIndex === stepIndex ? 'Editing fields below' : 'Edit fields'}
              </button>

              {activeStepIndex === stepIndex && step.kind === 'fields' && (
                <div className="mt-4 space-y-4 border-t border-black/10 dark:border-[#262626] pt-4">
                  <div className="flex flex-wrap gap-2">
                    {FIELD_PRESETS.map((preset) => (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => addField(preset)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-[#1A1A1A] text-[11px] font-mono font-bold cursor-pointer hover:bg-[#FACC15]/20"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => addField({ label: 'New field', type: 'text' })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/15 dark:border-[#333333] text-[11px] font-mono font-bold cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Custom field
                    </button>
                  </div>

                  {step.fields.map((field, fieldIndex) => (
                    <div
                      key={`${field.key}-${fieldIndex}`}
                      draggable
                      onDragStart={() => setDragField(fieldIndex)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (dragField !== null) {
                          updateStep(stepIndex, { fields: reorder(step.fields, dragField, fieldIndex) });
                        }
                        setDragField(null);
                      }}
                      className="p-4 rounded-xl bg-neutral-50 dark:bg-[#1A1A1A] border border-black/10 dark:border-[#333333]"
                    >
                      <div className="flex items-start gap-3">
                        <GripVertical className="w-4 h-4 mt-2 text-neutral-400 shrink-0 cursor-grab" />
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_1fr_140px] gap-3">
                          <div>
                            <label className={labelClass}>Label</label>
                            <input value={field.label} onChange={(event) => updateField(stepIndex, fieldIndex, { label: event.target.value })} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Field key</label>
                            <input value={field.key} onChange={(event) => updateField(stepIndex, fieldIndex, { key: event.target.value })} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>Input type</label>
                            <select value={field.type} onChange={(event) => updateField(stepIndex, fieldIndex, { type: event.target.value })} className={inputClass}>
                              {FIELD_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className={labelClass}>Placeholder</label>
                            <input value={field.placeholder} onChange={(event) => updateField(stepIndex, fieldIndex, { placeholder: event.target.value })} className={inputClass} />
                          </div>
                          <div className="sm:col-span-3">
                            <label className={labelClass}>Help text</label>
                            <input value={field.helpText} onChange={(event) => updateField(stepIndex, fieldIndex, { helpText: event.target.value })} className={inputClass} />
                          </div>
                          {field.type === 'select' && (
                            <div className="sm:col-span-3">
                              <label className={labelClass}>Options, one per line</label>
                              <textarea
                                rows={3}
                                value={(field.options || []).join('\n')}
                                onChange={(event) => updateField(stepIndex, fieldIndex, { options: event.target.value.split('\n').map((option) => option.trim()).filter(Boolean) })}
                                className={inputClass}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <button type="button" onClick={() => updateField(stepIndex, fieldIndex, { required: !field.required })} className={`p-1.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer ${field.required ? 'text-amber-600 dark:text-[#FACC15]' : ''}`} title="Toggle required">
                            {field.required ? 'REQ' : 'OPT'}
                          </button>
                          <button type="button" onClick={() => updateStep(stepIndex, { fields: reorder(step.fields, fieldIndex, fieldIndex - 1) })} className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer" title="Move up">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => updateStep(stepIndex, { fields: reorder(step.fields, fieldIndex, fieldIndex + 1) })} className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer" title="Move down">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => updateStep(stepIndex, { fields: step.fields.filter((_, i) => i !== fieldIndex) })} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer" title="Remove field">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {wizardStep === 2 && (
        <div className="space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
            <h5 className="font-headline font-bold text-lg">Workshop documents</h5>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Add any brochure, syllabus or form links to share with attendees. A Documents step is added separately in step 2.
            </p>
            <div className="mt-4 space-y-3">
              {draft.documents.map((doc, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-3 items-end">
                  <div>
                    <label className={labelClass}>Document title</label>
                    <input value={doc.title} onChange={(event) => set('documents', draft.documents.map((item, i) => i === index ? { ...item, title: event.target.value } : item))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Link</label>
                    <input value={doc.url} onChange={(event) => set('documents', draft.documents.map((item, i) => i === index ? { ...item, url: event.target.value } : item))} className={inputClass} placeholder="https://" />
                  </div>
                  <button type="button" onClick={() => set('documents', draft.documents.filter((_, i) => i !== index))} className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer" title="Remove document">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set('documents', [...draft.documents, { title: '', url: '' }])}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/15 dark:border-[#333333] text-xs font-mono font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add document link
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={draft.accommodationRequired} onChange={(event) => set('accommodationRequired', event.target.checked)} className="w-4 h-4 accent-[#FACC15]" />
              <span className="text-sm font-semibold">Accommodation needs confirmation before workshop payment</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Accommodation payment link</label>
                <input value={draft.accommodationPaymentUrl} onChange={(event) => set('accommodationPaymentUrl', event.target.value)} className={inputClass} placeholder="https://" />
              </div>
              <div>
                <label className={labelClass}>WhatsApp group link</label>
                <input value={draft.whatsappUrl} onChange={(event) => set('whatsappUrl', event.target.value)} className={inputClass} placeholder="https://" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Accommodation note shown to attendees</label>
              <textarea rows={3} value={draft.accommodationNote} onChange={(event) => set('accommodationNote', event.target.value)} className={inputClass} />
            </div>
          </div>
        </div>
      )}

      {wizardStep === 3 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h5 className="font-headline font-bold text-lg">Payment split</h5>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Add fee components. Only components marked charged online are added to the secure checkout total. Others can carry a separate payment link.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Payable online</p>
              <p className="font-headline font-black text-2xl text-amber-600 dark:text-[#FACC15]">₹{onlineTotal.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {draft.components.map((component, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px_auto_auto] gap-3 items-end p-4 rounded-xl bg-neutral-50 dark:bg-[#1A1A1A]">
                <div>
                  <label className={labelClass}>Label</label>
                  <input value={component.label} onChange={(event) => set('components', draft.components.map((item, i) => i === index ? { ...item, label: event.target.value } : item))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Amount, rupees</label>
                  <input type="number" min="0" value={component.amount} onChange={(event) => set('components', draft.components.map((item, i) => i === index ? { ...item, amount: Number(event.target.value) } : item))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Kind</label>
                  <select value={component.kind} onChange={(event) => set('components', draft.components.map((item, i) => i === index ? { ...item, kind: event.target.value } : item))} className={inputClass}>
                    {['base', 'platform_fee', 'accommodation', 'other'].map((kind) => <option key={kind} value={kind}>{kind}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-[11px] font-mono cursor-pointer pb-2.5">
                  <input type="checkbox" checked={component.chargeOnline} onChange={(event) => set('components', draft.components.map((item, i) => i === index ? { ...item, chargeOnline: event.target.checked } : item))} className="w-4 h-4 accent-[#FACC15]" />
                  Online
                </label>
                <button type="button" onClick={() => set('components', draft.components.filter((_, i) => i !== index))} className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer" title="Remove component">
                  <Trash2 className="w-4 h-4" />
                </button>
                {!component.chargeOnline && (
                  <div className="sm:col-span-5">
                    <label className={labelClass}>Separate payment link</label>
                    <input value={component.externalUrl} onChange={(event) => set('components', draft.components.map((item, i) => i === index ? { ...item, externalUrl: event.target.value } : item))} className={inputClass} placeholder="https://" />
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => set('components', [...draft.components, { label: '', amount: 0, kind: 'other', chargeOnline: true, externalUrl: '' }])}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/15 dark:border-[#333333] text-xs font-mono font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add fee component
            </button>
          </div>
        </div>
      )}

      {wizardStep === 4 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] space-y-4">
          <h5 className="font-headline font-bold text-lg">Review and publish</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <p><span className="text-neutral-500">Title:</span> {draft.title || 'Not set'}</p>
            <p><span className="text-neutral-500">Slug:</span> {draft.slug || 'Not set'}</p>
            <p><span className="text-neutral-500">Dates:</span> {draft.dates || 'Not set'}</p>
            <p><span className="text-neutral-500">Location:</span> {draft.location || 'Not set'}</p>
            <p><span className="text-neutral-500">Steps:</span> {draft.steps.length}</p>
            <p><span className="text-neutral-500">Fields:</span> {draft.steps.reduce((sum, step) => sum + step.fields.length, 0)}</p>
            <p><span className="text-neutral-500">Documents:</span> {draft.documents.length}</p>
            <p><span className="text-neutral-500">Payable online:</span> ₹{onlineTotal.toLocaleString('en-IN')}</p>
          </div>
          {draft.slug && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-neutral-50 dark:bg-[#1A1A1A] text-sm font-mono break-all">
              <Link2 className="w-4 h-4 shrink-0 text-amber-600 dark:text-[#FACC15]" />
              {typeof window !== 'undefined' ? `${window.location.origin}/register/${draft.slug}` : `/register/${draft.slug}`}
            </div>
          )}
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Publishing puts this form on the public URL above. Drafts stay private to the admin console.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 sticky bottom-0 py-4 bg-[#FDFCFA] dark:bg-[#0A0A0A] border-t border-black/10 dark:border-[#262626]">
        <button
          type="button"
          onClick={() => setWizardStep((index) => Math.max(0, index - 1))}
          disabled={wizardStep === 0}
          className="px-5 py-2.5 rounded-xl border border-black/15 dark:border-[#333333] text-xs font-mono font-bold cursor-pointer disabled:opacity-40"
        >
          Previous
        </button>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => save('Draft')}
            disabled={busy}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-black/15 dark:border-[#333333] text-xs font-mono font-bold cursor-pointer disabled:opacity-40"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save draft
          </button>
          {wizardStep < WIZARD_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setWizardStep((index) => Math.min(WIZARD_STEPS.length - 1, index + 1))}
              className="px-5 py-2.5 rounded-xl bg-[#FACC15] text-[#0A0A0A] text-xs font-mono font-bold cursor-pointer"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => save('Published')}
              disabled={busy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] text-xs font-mono font-bold cursor-pointer disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" /> Publish form
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
