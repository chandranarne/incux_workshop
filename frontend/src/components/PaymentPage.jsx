import React, { useEffect, useState } from 'react';
import { ArrowRight, AlertCircle, CheckCircle2, Loader2, MapPin, Calendar, User } from 'lucide-react';
import {
  createPaymentOrder,
  verifyPayment,
  fetchPaymentStatus,
  registerForWorkshop
} from '../services/api';

const parseQuery = () => {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    registrationId: params.get('registrationId') || '',
    amount: parseInt(params.get('amount') || '0', 10),
    workshopTitle: params.get('workshopTitle') || 'Workshop',
    workshopId: params.get('workshopId') || ''
  };
};

export default function PaymentPage() {
  const { registrationId: urlRegId, amount, workshopTitle, workshopId } = parseQuery();
  const [step, setStep] = useState('creating'); // creating | details | paying | success | failed
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [candidate, setCandidate] = useState({ name: '', email: '', institution: '', phone: '' });

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        // If no registration ID in URL, we need to create one first
        if (!urlRegId) {
          setStep('details');
          return;
        }
        const order = await createPaymentOrder(urlRegId, amount);
        setOrderId(order.orderId);
        setPaymentId(order.paymentId);
        setStep('paying');
      } catch (err) {
        setStep('failed');
        setError(err.message);
      }
    };
    init();
    return () => { active = false; };
  }, [urlRegId, amount]);

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    if (!candidate.name || !candidate.email) {
      setError('Name and email are required.');
      return;
    }
    if (!workshopId) {
      setError('Workshop ID is missing.');
      return;
    }
    try {
      setStep('creating');
      const reg = await registerForWorkshop(workshopId, {
        candidateName: candidate.name.trim(),
        candidateEmail: candidate.email.trim(),
        candidateInstitution: candidate.institution?.trim() || 'Independent Candidate',
        candidatePhone: candidate.phone?.trim() || 'Not provided'
      });
      const regId = reg.registration?.id || reg.id;
      const order = await createPaymentOrder(regId, amount);
      setOrderId(order.orderId);
      setPaymentId(order.paymentId);
      setStep('paying');
    } catch (err) {
      setStep('failed');
      setError(err.message);
    }
  };

  const openRazorpayCheckout = () => {
    const options = {
      key: import.meta.env?.VITE_RAZORPAY_KEY_ID || '',
      amount: amount * 100,
      currency: 'INR',
      name: 'IncuxAI Education Trust',
      description: `Workshop Fee: ${workshopTitle}`,
      order_id: orderId,
      handler: async (response) => {
        try {
          const verified = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            registrationId: urlRegId || orderId
          });
          setStep('success');
        } catch (err) {
          setStep('failed');
          setError(err.message);
        }
      },
      prefill: {
        name: candidate.name,
        email: candidate.email,
        contact: candidate.phone
      },
      theme: { color: '#FACC15' },
      modal: {
        ondismiss: () => {
          setStep('failed');
          setError('Payment was cancelled.');
        }
      }
    };

    // @ts-ignore - Razorpay loaded via script tag in index.html
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const checkStatus = async () => {
    const id = urlRegId || orderId;
    if (!id) return;
    const payment = await fetchPaymentStatus(id);
    if (payment.status === 'paid') {
      setStep('success');
    } else if (payment.status === 'failed') {
      setStep('failed');
      setError('Payment failed or was not completed.');
    }
  };

  // Header
  const header = (
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
  );

  if (step === 'creating') {
    return (
      <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex flex-col">
        {header}
        <div className="flex-1 p-4 sm:p-6 flex items-center justify-center">
          <div className="max-w-sm w-full">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center shadow-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600 dark:text-[#FACC15] mx-auto mb-4" />
              <h2 className="font-headline font-black text-xl text-neutral-950 dark:text-[#F5F5F5]">Creating payment session...</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Please wait while we prepare your payment.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'details') {
    return (
      <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex flex-col">
        {header}
        <div className="flex-1 p-4 sm:p-6">
          <div className="max-w-md w-full mx-auto">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-2xl">
              <h2 className="font-headline font-black text-xl sm:text-2xl text-neutral-950 dark:text-[#F5F5F5] mb-6">
                Enter Your Details
              </h2>
              <form onSubmit={handleCandidateSubmit} className="space-y-4">
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
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono leading-relaxed">
                  You will be redirected to IncuXai Education Trust's secure payment platform to complete the payment of ₹{amount}.
                </p>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-sm tracking-wider transition-colors cursor-pointer"
                >
                  Continue to Payment
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
      <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex flex-col">
        {header}
        <div className="flex-1 p-4 sm:p-6 flex items-center justify-center">
          <div className="max-w-sm w-full">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center mx-auto mb-6 border border-amber-200 dark:border-amber-900">
                <span className="text-amber-600 dark:text-[#FACC15] font-headline font-black text-xl">₹</span>
              </div>
              <h2 className="font-headline font-black text-xl text-neutral-950 dark:text-[#F5F5F5] mb-2">
                Pay ₹{amount}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
                Secure payment powered by Razorpay via IncuXai Education Trust
              </p>

              <button
                onClick={openRazorpayCheckout}
                disabled={!orderId}
                className="w-full py-4 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-sm tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {orderId ? 'Proceed to Payment' : 'Preparing...'}
              </button>

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

  if (step === 'success') {
    return (
      <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex flex-col">
        {header}
        <div className="flex-1 p-4 sm:p-6 flex items-center justify-center">
          <div className="max-w-sm w-full">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center mx-auto mb-8 border border-green-200 dark:border-green-900">
                <CheckCircle2 className="w-9 h-9 text-green-600 dark:text-[#4ADE80]" />
              </div>
              <h2 className="font-headline font-black text-xl sm:text-2xl text-neutral-950 dark:text-[#F5F5F5] mb-3">
                Payment Confirmed!
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
                Your seat for {workshopTitle} is secured. You will receive a confirmation email shortly.
              </p>
              <button
                onClick={() => window.location.assign('/')}
                className="w-full py-4 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-black text-sm tracking-wider transition-colors cursor-pointer shadow-lg shadow-yellow-500/20"
              >
                Return to Homepage <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // failed
  return (
    <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex flex-col">
      {header}
      <div className="flex-1 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-sm w-full">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center shadow-2xl">
            <AlertCircle className="w-8 h-8 text-rose-600 dark:text-[#F87171] mx-auto mb-4" />
            <h2 className="font-headline font-black text-xl text-neutral-950 dark:text-[#F5F5F5] mb-2">
              Payment Failed
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              {error || 'Your payment could not be completed. Please try again.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-sm tracking-wider transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
