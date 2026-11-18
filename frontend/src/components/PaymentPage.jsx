import React, { useEffect, useState } from 'react';
import { ArrowRight, AlertCircle, CheckCircle2, Loader2, MapPin, Calendar } from 'lucide-react';
import { initiatePayment, confirmPayment } from '../services/api';

const parseQuery = () => {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    workshopId: params.get('workshopId') || '',
    amount: parseInt(params.get('amount') || '0', 10),
    workshopTitle: params.get('workshopTitle') || 'Workshop',
    status: params.get('status') || '',
    token: params.get('token') || ''
  };
};

export default function PaymentPage() {
  const { workshopId, amount, workshopTitle, status: urlStatus, token: urlToken } = parseQuery();
  const [step, setStep] = useState('details');
  const [error, setError] = useState('');
  const [candidate, setCandidate] = useState({ name: '', email: '', phone: '', institution: '' });

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (urlToken) {
        setStep('confirming');
        try {
          await confirmPayment(urlToken);
          setStep('success');
        } catch (err) {
          setStep('failed');
          setError(err.message);
        }
        return;
      }

      if (urlStatus === 'cancelled' || urlStatus === 'failed') {
        setStep('failed');
        setError(urlStatus === 'cancelled' ? 'Payment was cancelled.' : 'Payment was not completed.');
        return;
      }

      setStep('details');
    };

    run();
    return () => { active = false; };
  }, [workshopId, amount, workshopTitle, urlToken, urlStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidate.name || !candidate.email) {
      setError('Name and email are required.');
      return;
    }
    if (!workshopId || !amount) {
      setError('Workshop or amount is missing.');
      return;
    }

    setStep('paying');
    try {
      const data = await initiatePayment(
        '',
        workshopId,
        amount,
        workshopTitle,
        candidate.name.trim(),
        candidate.email.trim(),
        candidate.phone.trim(),
        candidate.institution.trim()
      );
      window.location.assign(data.trustUrl);
    } catch (err) {
      setStep('failed');
      setError(err.message);
    }
  };

  if (step === 'details') {
    return (
      <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex flex-col">
        <div className="p-6 sm:p-8 border-b border-black/10 dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F5F5] dark:bg-[#0A0A0A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#FACC15]/15 dark:bg-[#FACC15]/10 text-neutral-900 dark:text-[#FACC15] border border-[#FACC15]/30 dark:border-[#FACC15]/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg sm:text-xl text-neutral-950 dark:text-[#F5F5F5]">
                Workshop Payment
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                {workshopTitle} • ₹{amount}
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.assign('/')}
            className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-[#1A1A1A] flex items-center justify-center text-amber-600 dark:text-[#FACC15] hover:bg-[#FACC15] hover:text-[#0A0A0A] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="w-5 h-5">✕</span>
          </button>
        </div>
        <div className="flex-1 p-4 sm:p-6">
          <div className="max-w-md w-full mx-auto">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-2xl">
              <h2 className="font-headline font-bold text-xl sm:text-2xl text-neutral-950 dark:text-[#F5F5F5] mb-6">
                Enter Your Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
                    required
                    placeholder="Full name"
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm font-mono text-neutral-900 dark:text-[#F5F5F5] focus:outline-none focus:border-[#FACC15]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={candidate.email}
                    onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}
                    required
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm font-mono text-neutral-900 dark:text-[#F5F5F5] focus:outline-none focus:border-[#FACC15]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={candidate.phone}
                    onChange={(e) => setCandidate({ ...candidate, phone: e.target.value })}
                    placeholder="+91 XXXXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm font-mono text-neutral-900 dark:text-[#F5F5F5] focus:outline-none focus:border-[#FACC15]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    College / Institution (Optional)
                  </label>
                  <input
                    type="text"
                    value={candidate.institution}
                    onChange={(e) => setCandidate({ ...candidate, institution: e.target.value })}
                    placeholder="College name"
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm font-mono text-neutral-900 dark:text-[#F5F5F5] focus:outline-none focus:border-[#FACC15]"
                  />
                </div>
                <div className="p-4 rounded-xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/5 dark:border-[#262626]">
                  <div className="flex items-start gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-neutral-400 block uppercase font-sans font-bold">Workshop</div>
                      <div className="font-bold text-neutral-900 dark:text-[#F5F5F5]">{workshopTitle}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#737373] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-neutral-400 block uppercase font-sans font-bold">Amount</div>
                      <div className="font-bold text-[#FACC15] dark:text-[#EAB308]">₹{amount}</div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-sm tracking-wider transition-colors cursor-pointer"
                >
                  Proceed to Secure Payment
                </button>
              </form>
              {error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-200 font-mono">
                  <AlertCircle className="w-4 h-4 mx-auto mb-2" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'paying') {
    return (
      <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center shadow-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600 dark:text-[#FACC15] mx-auto mb-4" />
            <h2 className="font-headline font-black text-xl text-neutral-950 dark:text-[#F5F5F5] mb-2">
              Redirecting to secure payment…
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              You will be sent to IncuXai Education Trust's payment platform to complete the payment of ₹{amount}.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'confirming') {
    return (
      <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center shadow-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600 dark:text-[#FACC15] mx-auto mb-4" />
            <h2 className="font-headline font-black text-xl text-neutral-950 dark:text-[#F5F5F5] mb-2">
              Verifying payment…
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Please wait while we confirm your payment with the trust platform.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'success') {
    return (
      <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center px-4 py-12">
        <div className="max-w-sm w-full">
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center mx-auto mb-8 border border-green-200 dark:border-green-900">
              <CheckCircle2 className="w-9 h-9 text-green-600 dark:text-[#4ADE80]" />
            </div>
            <h2 className="font-headline font-black text-2xl sm:text-3xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight mb-3">
              Payment Confirmed!
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed mb-8">
              Your workshop payment has been successfully confirmed and your seat is secured.
              You will receive a confirmation email shortly.
            </p>
            <button
              onClick={() => window.location.assign('/')}
              className="w-full py-4 sm:py-5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-black text-base sm:text-lg tracking-wider transition-colors cursor-pointer shadow-lg shadow-yellow-500/20"
            >
              Return to Homepage <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 inline ml-2" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-600 dark:text-[#F87171] mx-auto mb-8" />
          <h2 className="font-headline font-black text-2xl sm:text-3xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight mb-3">
            Payment Not Completed
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed mb-8">
            {error || 'Your payment was not completed. No amount was charged and your registration is still saved.'}
          </p>
          <button
            onClick={() => window.location.assign('/')}
            className="w-full py-4 sm:py-5 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-base sm:text-lg tracking-wider transition-colors cursor-pointer shadow-lg shadow-yellow-500/20"
          >
            Back to Homepage <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 inline ml-2" />
          </button>
        </div>
      </div>
    </main>
  );
}
