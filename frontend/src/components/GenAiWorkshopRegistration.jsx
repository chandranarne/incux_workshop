import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Building2,
  Users,
  Globe2,
  Lightbulb,
  GraduationCap,
  Check,
  ExternalLink,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Link2
} from 'lucide-react';
import {
  fetchGenAiConfig,
  validateGenAiReferral,
  submitGenAiStep1,
  resumeGenAiRegistration,
  fetchGenAiRegistration,
  submitGenAiStep2,
  submitGenAiStep3,
  initiateGenAiPayment,
  fetchPaymentStatus
} from '../services/api';

const EMPTY_DETAILS = {
  fullName: '',
  gender: '',
  email: '',
  phone: '',
  department: '',
  yearOfStudy: '',
  college: '',
  collegeLocation: ''
};

const STEP_LABELS = ['Your Details', "What's Included", 'Accommodation', 'Payment'];

const formatMoney = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white dark:bg-[#141414] border border-black/15 dark:border-[#333333] text-sm text-[#0A0A0A] dark:text-[#F5F5F5] outline-none focus:border-[#EAB308] dark:focus:border-[#FACC15] transition-colors';
const labelClass =
  'block text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5';

export default function GenAiWorkshopRegistration({ onBackHome }) {
  const [config, setConfig] = useState(null);
  const [referralCodeFromUrl, setReferralCodeFromUrl] = useState('');
  const [referral, setReferral] = useState(null);
  const [referralWarning, setReferralWarning] = useState('');

  const [step, setStep] = useState(1);
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [registration, setRegistration] = useState(null);
  const [accommodationChoice, setAccommodationChoice] = useState('');
  const [accommodationPaid, setAccommodationPaid] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('unknown');

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeEmail, setResumeEmail] = useState('');

  const applyRegistration = (reg, status) => {
    if (!reg) return;
    setRegistration(reg);
    setDetails({
      fullName: reg.fullName || '',
      gender: reg.gender || '',
      email: reg.email || '',
      phone: reg.phone || '',
      department: reg.department || '',
      yearOfStudy: reg.yearOfStudy || '',
      college: reg.college || '',
      collegeLocation: reg.collegeLocation || ''
    });
    setStep(Math.min(Math.max(Number(reg.currentStep) || 2, 1), 4));
    setAccommodationChoice(reg.hostelAccommodation || '');
    setAccommodationPaid(
      reg.hostelAccommodation === 'Yes' ? (reg.accommodationPaid ? 'Yes' : 'No') : ''
    );
    setTermsAccepted(Boolean(reg.termsAccepted));
    if (status) setPaymentStatus(status.status || 'unknown');
  };

  useEffect(() => {
    let active = true;
    const initialise = async () => {
      setLoading(true);
      const params = new URLSearchParams(window.location.search);
      const refCode = String(params.get('ref') || '').trim().toUpperCase();
      const registrationId = String(params.get('registration') || '').trim();

      try {
        const cfg = await fetchGenAiConfig();
        if (!active) return;
        setConfig(cfg);

        if (refCode) {
          setReferralCodeFromUrl(refCode);
          try {
            const result = await validateGenAiReferral(refCode);
            if (active) setReferral(result.referral);
          } catch (err) {
            if (active) {
              setReferralWarning('The referral link was not recognised, so no discount was applied.');
            }
          }
        }

        if (registrationId) {
          try {
            const reg = await fetchGenAiRegistration(registrationId);
            const status = await fetchPaymentStatus(registrationId);
            if (active) applyRegistration(reg, status);
          } catch (err) {
            if (active) setError('We could not find that registration. You can start a new one below.');
          }
        }
      } catch (err) {
        if (active) setError('The workshop details could not be loaded. Please refresh and try again.');
      } finally {
        if (active) setLoading(false);
      }
    };
    initialise();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (step === 4 && registration?.id) {
      fetchPaymentStatus(registration.id)
        .then((status) => {
          if (active) setPaymentStatus(status.status || 'unknown');
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [step, registration?.id]);

  const quote = useMemo(() => {
    const base = Number(config?.basePrice || 6000);
    const discount = registration
      ? Number(registration.discountAmount || 0)
      : Number(referral?.discountAmount || 0);
    const percent = Number(config?.platformFeePercent ?? 2);
    const discountedBase = Math.max(0, base - discount);
    const platformFee = Math.round((discountedBase * percent) / 100);
    return {
      base,
      discount,
      discountedBase,
      platformFee,
      percent,
      total: discountedBase + platformFee
    };
  }, [config, referral, registration]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setDetails((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: '' }));
    if (error) setError('');
  };

  const validateStep1 = () => {
    const errors = {};
    if (details.fullName.trim().length < 2) errors.fullName = 'Enter your full name.';
    if (!['Male', 'Female', 'Other'].includes(details.gender)) errors.gender = 'Select your gender.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) errors.email = 'Enter a valid email address.';
    const rawPhone = details.phone.replace(/[\s+-]/g, '').slice(-10);
    if (!/^[0-9]{10}$/.test(rawPhone)) errors.phone = 'Enter a valid 10-digit mobile number.';
    if (!details.department.trim()) errors.department = 'Enter your department.';
    if (!['1', '2', '3', '4', 'Graduated'].includes(details.yearOfStudy)) {
      errors.yearOfStudy = 'Select your year of study.';
    }
    if (!details.college.trim()) errors.college = 'Enter your college name.';
    if (!details.collegeLocation.trim()) errors.collegeLocation = 'Enter your college location.';
    return errors;
  };

  const handleStep1 = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const errors = validateStep1();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please check the highlighted fields and try again.');
      return;
    }
    setFieldErrors({});

    setBusy(true);
    try {
      const cleanPhone = details.phone.replace(/[\s+-]/g, '').slice(-10);
      const result = await submitGenAiStep1({
        ...details,
        phone: cleanPhone,
        referralCode: referralCodeFromUrl
      });
      applyRegistration(result.registration);
      setStep(2);
      if (result.referralWarning) setReferralWarning(result.referralWarning);
      if (result.resume) setNotice('We found an existing registration and resumed it for you.');
      window.history.replaceState(
        {},
        '',
        `/gen-ai-workshop?registration=${encodeURIComponent(result.registration.id)}`
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Could not save your details.');
    } finally {
      setBusy(false);
    }
  };

  const handleResume = async (event) => {
    event.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resumeEmail.trim())) {
      setError('Enter the email address used when you started the registration.');
      return;
    }

    setBusy(true);
    try {
      const reg = await resumeGenAiRegistration(resumeEmail.trim());
      if (!reg) {
        setError('No registration was found for that email address.');
        return;
      }
      const status = await fetchPaymentStatus(reg.id);
      applyRegistration(reg, status);
      setResumeOpen(false);
      setNotice('Your registration has been restored.');
      window.history.replaceState(
        {},
        '',
        `/gen-ai-workshop?registration=${encodeURIComponent(reg.id)}`
      );
    } catch (err) {
      setError(err.message || 'Could not resume the registration.');
    } finally {
      setBusy(false);
    }
  };

  const handleStep2 = async () => {
    setError('');
    if (!registration?.id) {
      setError('Your registration could not be found. Please start again.');
      return;
    }
    setBusy(true);
    try {
      const result = await submitGenAiStep2(registration.id);
      setRegistration(result.registration);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Could not save your progress.');
    } finally {
      setBusy(false);
    }
  };

  const handleStep3 = async () => {
    setError('');
    setFieldErrors({});
    if (!accommodationChoice) {
      setError('Select whether you need hostel accommodation to continue.');
      setFieldErrors({ accommodation: 'Please choose an accommodation option.' });
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the event information to continue. Please check the confirmation box below.');
      setFieldErrors({ terms: 'Please check this box to confirm and continue.' });
      return;
    }
    if (accommodationChoice === 'Yes' && accommodationPaid !== 'Yes') {
      setError('Accommodation payment must be completed before you can continue to the workshop payment.');
      return;
    }
    if (!registration?.id) {
      setError('Your registration could not be found. Please start again.');
      return;
    }

    setBusy(true);
    try {
      const result = await submitGenAiStep3(registration.id, {
        hostelAccommodation: accommodationChoice,
        accommodationPaid: accommodationChoice === 'Yes',
        termsAccepted: true
      });
      setRegistration(result.registration);
      setStep(4);
    } catch (err) {
      setError(err.message || 'Could not save accommodation details.');
    } finally {
      setBusy(false);
    }
  };

  const handlePayment = async () => {
    setError('');
    if (!registration?.id) {
      setError('Your registration could not be found. Please start again.');
      return;
    }
    setBusy(true);
    try {
      const result = await initiateGenAiPayment(registration.id);
      window.location.assign(result.trustUrl);
    } catch (err) {
      setError(err.message || 'Could not start the secure checkout.');
      setBusy(false);
    }
  };

  const includedItems = [
    '2-day campus immersion, Generative AI Workshop, Nov 28-29',
    'Hands-on creative activities with industry and IIT Hyderabad mentors',
    'AI tools, real-world demos and track discovery',
    'Team formation, mini-project plan and prototype guidance',
    'Guided mini-project development and feedback',
    'Presentation and pitch practice',
    'Certificate of completion and workshop materials'
  ];

  const highlights = [
    {
      icon: Users,
      title: 'Beginner friendly',
      text: 'Built for first-year students. No prior AI or coding experience is needed.'
    },
    {
      icon: Globe2,
      title: 'Six AI tracks',
      text: 'Generative AI and prompt engineering, machine learning and data, AI apps and automation, computer vision, AI and robotics, and AI for social impact.'
    },
    {
      icon: Lightbulb,
      title: 'Build and present',
      text: 'Take away a prototype, demo or documented concept, plus a clearer view of AI careers and portfolios.'
    },
    {
      icon: GraduationCap,
      title: 'Career pathways',
      text: 'Explore, learn, build, show and grow with practical portfolio basics.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] transition-colors duration-200">
      <div className="sticky top-0 z-40 border-b border-black/10 dark:border-[#262626] bg-[#FDFCFA]/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackHome || (() => window.location.assign('/'))}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-neutral-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-[#FACC15] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FACC15]/15 text-neutral-900 dark:text-[#FACC15] text-xs font-mono font-bold border border-[#FACC15]/30">
            <Calendar className="w-3.5 h-3.5" />
            Nov 28-29, 2026
          </span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-[#FACC15]">
            <span>Campus Immersion</span>
            <span className="text-neutral-400 dark:text-neutral-600">/</span>
            <span>IIT Hyderabad</span>
            <span className="text-neutral-400 dark:text-neutral-600">/</span>
            <span>Elan & nVision</span>
          </div>
          <h1 className="mt-3 font-headline font-black text-3xl sm:text-5xl tracking-tight">
            Generative AI Workshop
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            A beginner-friendly journey for first-year students. Learn, explore, build and present
            at a two-day offline campus immersion organised by Elan & nVision.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-neutral-600 dark:text-neutral-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-[#FACC15]" />
              November 28-29, 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-[#FACC15]" />
              IIT Hyderabad
            </span>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center justify-center gap-3 text-sm font-mono text-neutral-500 dark:text-neutral-400">
            <Loader2 className="w-5 h-5 animate-spin text-amber-600 dark:text-[#FACC15]" />
            Loading registration details
          </div>
        ) : (
          <>
            {referral && (
              <div className="mt-8 flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    Referral applied: {referral.code}, {formatMoney(referral.discountAmount)} off
                  </p>
                  {referral.label && <p className="mt-0.5 text-xs opacity-80">{referral.label}</p>}
                </div>
              </div>
            )}
            {referralWarning && (
              <div className="mt-8 flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{referralWarning}</p>
              </div>
            )}
            {notice && (
              <div className="mt-8 flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{notice}</p>
              </div>
            )}
            {error && (
              <div className="mt-8 flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between gap-2" aria-label="Registration progress">
              {STEP_LABELS.map((label, index) => {
                const number = index + 1;
                const active = step === number;
                const complete = step > number;
                return (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center gap-1.5 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                          active || complete
                            ? 'bg-[#FACC15] text-[#0A0A0A] border-[#FACC15]'
                            : 'bg-white dark:bg-[#141414] text-neutral-500 dark:text-neutral-400 border-black/15 dark:border-[#333333]'
                        }`}
                      >
                        {complete ? <Check className="w-4 h-4" /> : number}
                      </div>
                      <span
                        className={`hidden sm:block text-[10px] font-mono font-bold uppercase tracking-wider text-center truncate w-full ${
                          active ? 'text-amber-600 dark:text-[#FACC15]' : 'text-neutral-500 dark:text-neutral-500'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {index < STEP_LABELS.length - 1 && (
                      <div
                        className={`h-px flex-[0.6] mb-5 ${
                          step > number ? 'bg-[#FACC15]' : 'bg-black/10 dark:bg-[#333333]'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="mt-8 p-5 sm:p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-sm">
              {/* STEP 1 */}
              {step === 1 && (
                <form onSubmit={handleStep1} noValidate>
                  <h2 className="font-headline font-black text-xl sm:text-2xl">Your Details</h2>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                    These details are used for your workshop registration and confirmation.
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className={labelClass} htmlFor="fullName">Full Name *</label>
                      <input
                        id="fullName"
                        name="fullName"
                        className={`${inputClass} ${fieldErrors.fullName ? '!border-rose-500 !focus:border-rose-500' : ''}`}
                        value={details.fullName}
                        onChange={updateField}
                        placeholder="Enter your full name"
                        maxLength={150}
                        autoComplete="name"
                      />
                      {fieldErrors.fullName && (
                        <p className="mt-1 text-xs text-rose-500 font-mono">{fieldErrors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="gender">Gender *</label>
                      <select
                        id="gender"
                        name="gender"
                        className={`${inputClass} ${fieldErrors.gender ? '!border-rose-500 !focus:border-rose-500' : ''}`}
                        value={details.gender}
                        onChange={updateField}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other / Prefer not to say</option>
                      </select>
                      {fieldErrors.gender && (
                        <p className="mt-1 text-xs text-rose-500 font-mono">{fieldErrors.gender}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="email">Email *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className={`${inputClass} ${fieldErrors.email ? '!border-rose-500 !focus:border-rose-500' : ''}`}
                        value={details.email}
                        onChange={updateField}
                        placeholder="you@example.com"
                        maxLength={150}
                        autoComplete="email"
                      />
                      {fieldErrors.email && (
                        <p className="mt-1 text-xs text-rose-500 font-mono">{fieldErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="phone">Phone Number *</label>
                      <div className="flex">
                        <span
                          className={`inline-flex items-center px-3 rounded-l-xl bg-neutral-100 dark:bg-[#1F1F1F] border border-r-0 ${
                            fieldErrors.phone
                              ? '!border-rose-500 text-rose-500'
                              : 'border-black/15 dark:border-[#333333] text-neutral-600 dark:text-neutral-300'
                          } text-sm font-mono`}
                        >
                          +91
                        </span>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          className={`${inputClass} rounded-l-none ${
                            fieldErrors.phone ? '!border-rose-500 !focus:border-rose-500' : ''
                          }`}
                          value={details.phone}
                          onChange={updateField}
                          placeholder="10-digit number"
                          maxLength={10}
                          autoComplete="tel"
                        />
                      </div>
                      {fieldErrors.phone && (
                        <p className="mt-1 text-xs text-rose-500 font-mono">{fieldErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="department">Department *</label>
                      <input
                        id="department"
                        name="department"
                        className={`${inputClass} ${fieldErrors.department ? '!border-rose-500 !focus:border-rose-500' : ''}`}
                        value={details.department}
                        onChange={updateField}
                        placeholder="CSE, ECE, Mechanical"
                        maxLength={150}
                      />
                      {fieldErrors.department && (
                        <p className="mt-1 text-xs text-rose-500 font-mono">{fieldErrors.department}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="yearOfStudy">Year of Study *</label>
                      <select
                        id="yearOfStudy"
                        name="yearOfStudy"
                        className={`${inputClass} ${fieldErrors.yearOfStudy ? '!border-rose-500 !focus:border-rose-500' : ''}`}
                        value={details.yearOfStudy}
                        onChange={updateField}
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="Graduated">Graduated</option>
                      </select>
                      {fieldErrors.yearOfStudy && (
                        <p className="mt-1 text-xs text-rose-500 font-mono">{fieldErrors.yearOfStudy}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="college">College Name *</label>
                      <input
                        id="college"
                        name="college"
                        className={`${inputClass} ${fieldErrors.college ? '!border-rose-500 !focus:border-rose-500' : ''}`}
                        value={details.college}
                        onChange={updateField}
                        placeholder="Your college or institution"
                        maxLength={255}
                      />
                      {fieldErrors.college && (
                        <p className="mt-1 text-xs text-rose-500 font-mono">{fieldErrors.college}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="collegeLocation">College Location *</label>
                      <input
                        id="collegeLocation"
                        name="collegeLocation"
                        className={`${inputClass} ${fieldErrors.collegeLocation ? '!border-rose-500 !focus:border-rose-500' : ''}`}
                        value={details.collegeLocation}
                        onChange={updateField}
                        placeholder="City, State"
                        maxLength={255}
                      />
                      {fieldErrors.collegeLocation && (
                        <p className="mt-1 text-xs text-rose-500 font-mono">{fieldErrors.collegeLocation}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setResumeOpen((open) => !open)}
                      className="text-xs font-mono font-bold text-amber-700 dark:text-[#FACC15] hover:underline cursor-pointer"
                    >
                      Already started? Resume with your email
                    </button>
                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-sm tracking-wide cursor-pointer disabled:opacity-60"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Save & Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {resumeOpen && (
                    <div className="mt-5 p-4 rounded-2xl bg-neutral-50 dark:bg-[#1A1A1A] border border-black/10 dark:border-[#262626] flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={resumeEmail}
                        onChange={(event) => setResumeEmail(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') handleResume(event);
                        }}
                        placeholder="Enter your registered email"
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={handleResume}
                        disabled={busy}
                        className="px-5 py-3 rounded-xl bg-neutral-900 dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] font-mono font-bold text-xs cursor-pointer disabled:opacity-60"
                      >
                        Resume
                      </button>
                    </div>
                  )}
                </form>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <h2 className="font-headline font-black text-xl sm:text-2xl">What's Included</h2>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                    Everything in the workshop fee, plus the optional accommodation step that follows.
                  </p>

                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {includedItems.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-[#1A1A1A] border border-black/10 dark:border-[#262626] text-sm">
                        <Check className="w-4 h-4 text-amber-600 dark:text-[#FACC15] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 p-5 rounded-2xl border border-black/10 dark:border-[#262626] bg-neutral-50 dark:bg-[#1A1A1A]">
                    <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-[#FACC15]">
                      Quick highlights
                    </h3>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {highlights.map((item) => (
                        <div key={item.title} className="flex items-start gap-3">
                          <item.icon className="w-5 h-5 text-amber-600 dark:text-[#FACC15] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold">{item.title}</p>
                            <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                      {[
                        ['3 days', 'Pre-workshops, online'],
                        ['2 days', 'Campus immersion, IIT Hyderabad'],
                        ['4 days', 'Post-workshops, online'],
                        ['1 day', 'Hackathon, online']
                      ].map(([count, label]) => (
                        <div key={count} className="p-3 rounded-xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
                          <p className="text-sm font-bold text-amber-600 dark:text-[#FACC15]">{count}</p>
                          <p className="mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-sm text-amber-900 dark:text-amber-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>
                      This is a two-day offline event at IIT Hyderabad on November 28-29, 2026.
                      Accommodation is handled separately in the next step and is not part of this workshop payment.
                    </p>
                  </div>

                  <div className="mt-7 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-black/15 dark:border-[#333333] text-sm font-mono font-bold cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleStep2}
                      disabled={busy}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-sm tracking-wide cursor-pointer disabled:opacity-60"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Save & Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div>
                  <h2 className="font-headline font-black text-xl sm:text-2xl">Accommodation & Terms</h2>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                    Choose one option. You cannot reach the workshop payment step without this selection.
                  </p>

                  <div className="mt-6">
                    <p className={labelClass}>Do you need hostel accommodation? *</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['Yes', 'No'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setAccommodationChoice(option);
                            if (option === 'No') setAccommodationPaid('');
                          }}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-colors ${
                            accommodationChoice === option
                              ? 'border-[#FACC15] bg-[#FACC15]/10 text-[#0A0A0A] dark:text-[#F5F5F5]'
                              : 'border-black/15 dark:border-[#333333] bg-white dark:bg-[#141414] hover:border-[#FACC15]/60'
                          }`}
                        >
                          <span className="block text-sm font-headline font-black">{option}</span>
                          <span className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400">
                            {option === 'Yes' ? 'I need a hostel stay for the event' : 'I will make my own arrangements'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {accommodationChoice === 'Yes' && (
                    <div className="mt-6 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-700 dark:text-[#FACC15] shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-900 dark:text-amber-200">
                          <p className="font-bold">Accommodation payment is separate from the workshop fee.</p>
                          <p className="mt-1 leading-relaxed">
                            This payment is for accommodation only and is paid directly to Elan & nVision,
                            the body organising the event at IIT Hyderabad. The workshop payment comes next.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={config?.accommodationPaymentUrl || 'https://pages.razorpay.com/pl_TsSavHEBuYVOq4/view'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-mono font-bold text-xs cursor-pointer"
                        >
                          Pay accommodation fee to Elan & nVision <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={config?.accommodationWhatsAppUrl || 'https://chat.whatsapp.com/LLw0x8t4OEqGkXPDBGtDdh?s=sh&p=a&iam=2'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#141414] border border-black/15 dark:border-[#333333] font-mono font-bold text-xs cursor-pointer hover:border-[#FACC15]"
                        >
                          Join the accommodation WhatsApp group <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div>
                        <p className={labelClass}>Have you completed the accommodation payment? *</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {['Yes', 'No'].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setAccommodationPaid(option)}
                              className={`p-3 rounded-xl border text-sm font-mono font-bold cursor-pointer transition-colors ${
                                accommodationPaid === option
                                  ? option === 'Yes'
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                                    : 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300'
                                  : 'border-black/15 dark:border-[#333333] bg-white dark:bg-[#141414]'
                              }`}
                            >
                              {option === 'Yes' ? 'Yes, I have paid' : 'No, not yet'}
                            </button>
                          ))}
                        </div>
                        {accommodationPaid === 'No' && (
                          <p className="mt-3 flex items-start gap-2 text-xs font-mono text-rose-700 dark:text-rose-300">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            You cannot proceed until the accommodation payment is complete. Come back after paying.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {accommodationChoice === 'No' && (
                    <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-[#1A1A1A] border border-black/10 dark:border-[#262626] text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <p>
                        No accommodation link or payment confirmation is needed. You can continue to the workshop payment.
                      </p>
                    </div>
                  )}

                  <div
                    className={`mt-6 p-5 rounded-2xl border transition-colors ${
                      fieldErrors.terms
                        ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 ring-1 ring-rose-500'
                        : 'border-black/10 dark:border-[#262626] bg-neutral-50 dark:bg-[#1A1A1A]'
                    }`}
                  >
                    <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-[#FACC15]">
                      Terms & Conditions
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      This is a two-day Generative AI Workshop on November 28-29, 2026 at IIT Hyderabad,
                      organised by Elan & nVision. Accommodation is optional and handled separately.
                    </p>
                    <label className="mt-4 flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(event) => {
                          setTermsAccepted(event.target.checked);
                          if (event.target.checked) {
                            setFieldErrors((prev) => ({ ...prev, terms: '' }));
                            setError('');
                          }
                        }}
                        className="mt-0.5 w-4 h-4 accent-[#FACC15]"
                      />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        I confirm that I have read and accepted the event information and terms. *
                      </span>
                    </label>
                    {fieldErrors.terms && (
                      <p className="mt-2.5 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {fieldErrors.terms}
                      </p>
                    )}
                  </div>

                  <div className="mt-7 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-black/15 dark:border-[#333333] text-sm font-mono font-bold cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleStep3}
                      disabled={busy || (accommodationChoice === 'Yes' && accommodationPaid !== 'Yes')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-sm tracking-wide cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Save & Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div>
                  <h2 className="font-headline font-black text-xl sm:text-2xl">Workshop Payment</h2>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                    Review the amount below. This payment is for the workshop only and is handled by IncuXai Education Trust.
                  </p>

                  {registration?.registrationCode && (
                    <p className="mt-4 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                      Registration reference: <span className="font-bold text-amber-600 dark:text-[#FACC15]">{registration.registrationCode}</span>
                    </p>
                  )}

                  <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-[#1A1A1A] border border-black/10 dark:border-[#262626]">
                    <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-[#FACC15]">
                      Order Summary
                    </h3>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-neutral-600 dark:text-neutral-400">Workshop fee, two-day campus immersion</span>
                        <span className="font-mono font-bold">{formatMoney(quote.base)}</span>
                      </div>
                      {quote.discount > 0 && (
                        <div className="flex items-center justify-between gap-4 text-emerald-700 dark:text-emerald-400">
                          <span>Referral discount ({registration?.referralCode || referral?.code})</span>
                          <span className="font-mono font-bold">- {formatMoney(quote.discount)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-neutral-600 dark:text-neutral-400">Platform fee ({quote.percent}%)</span>
                        <span className="font-mono font-bold">{formatMoney(quote.platformFee)}</span>
                      </div>
                      <div className="pt-3 border-t border-black/10 dark:border-[#333333] flex items-center justify-between gap-4">
                        <span className="font-headline font-black">Total Payable</span>
                        <span className="font-headline font-black text-xl text-amber-600 dark:text-[#FACC15]">{formatMoney(quote.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-sm text-amber-900 dark:text-amber-200">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>
                      Accommodation is not included in this amount.
                      {accommodationChoice === 'Yes'
                        ? ' You have confirmed that the accommodation payment was made to Elan & nVision.'
                        : ' You chose to arrange your own accommodation.'}
                    </p>
                  </div>

                  {paymentStatus === 'paid' ? (
                    <div className="mt-6 flex items-start gap-3 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-6 h-6 shrink-0" />
                      <div>
                        <p className="font-headline font-black">Workshop payment confirmed</p>
                        <p className="mt-1 text-sm">Your payment is recorded in the workshops database and your seat is secured.</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePayment}
                      disabled={busy}
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-sm sm:text-base tracking-wide cursor-pointer disabled:opacity-60"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                      Pay {formatMoney(quote.total)} Securely
                    </button>
                  )}

                  <p className="mt-3 text-center text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Secure checkout powered by Razorpay via IncuXai Education Trust
                  </p>

                  {registration?.referralCode && quote.discount > 0 && (
                    <div className="mt-6 p-4 rounded-2xl border border-black/10 dark:border-[#262626] bg-white dark:bg-[#141414]">
                      <p className="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-[#FACC15]">
                        <Link2 className="w-4 h-4" /> Shareable referral link
                      </p>
                      <p className="mt-2 text-xs font-mono break-all text-neutral-600 dark:text-neutral-400">
                        {typeof window !== 'undefined' ? `${window.location.origin}/gen-ai-workshop?ref=${registration.referralCode}` : ''}
                      </p>
                    </div>
                  )}

                  <div className="mt-7 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-black/15 dark:border-[#333333] text-sm font-mono font-bold cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="mt-6 text-center text-[11px] font-mono text-neutral-500 dark:text-neutral-500 flex items-center justify-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Organised by Elan & nVision at IIT Hyderabad with IncuXAI
            </p>
          </>
        )}
      </main>
    </div>
  );
}
