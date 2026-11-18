import React, { useEffect, useState } from 'react';
import { ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { confirmPayment } from '../services/api';

export default function PaymentSuccess() {
  const [state, setState] = useState('verifying');
  const [error, setError] = useState('');
  const [details, setDetails] = useState(null);
  const [registrationId, setRegistrationId] = useState('');

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status') || '';
    const reference = params.get('token') || params.get('reference') || '';
    setRegistrationId(params.get('registration') || '');

    if (status === 'cancelled' || status === 'failed') {
      setState('failed');
      setError(
        status === 'cancelled'
          ? 'Payment was cancelled. No amount was charged.'
          : params.get('error') || 'Payment was not completed.'
      );
      return () => {
        active = false;
      };
    }

    // No reference means the trust platform sent only the status. The
    // server-to-server webhook records the payment, so show confirmation.
    if (!reference) {
      setState('success');
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        const result = await confirmPayment(reference);
        if (!active) return;
        setDetails(result);
        setState('success');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'We could not verify the payment.');
        setState('failed');
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (state === 'verifying') {
    return (
      <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center px-4 py-12">
        <div className="max-w-sm w-full text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600 dark:text-[#FACC15] mx-auto mb-5" />
          <h1 className="font-headline font-black text-xl text-neutral-950 dark:text-[#F5F5F5]">
            Verifying your payment
          </h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Confirming with the IncuXai Education Trust platform. Please wait.
          </p>
        </div>
      </main>
    );
  }

  if (state === 'failed') {
    return (
      <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center px-4 py-12">
        <div className="max-w-sm w-full">
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center shadow-2xl">
            <AlertCircle className="w-12 h-12 text-rose-600 dark:text-[#F87171] mx-auto mb-6" />
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight mb-3">
              Payment Not Confirmed
            </h1>
            <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8">
              {error}
            </p>
            <a
              href="/payment/cancel"
              className="block w-full py-4 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-sm tracking-wider transition-colors cursor-pointer"
            >
              View Payment Help <ArrowRight className="w-4 h-4 inline ml-2" />
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center mx-auto mb-8 border border-green-200 dark:border-green-900">
            <CheckCircle2 className="w-9 h-9 text-green-600 dark:text-[#4ADE80]" />
          </div>

          <h1 className="font-headline font-black text-2xl sm:text-3xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight mb-3">
            Payment Confirmed!
          </h1>
          <p className="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
            Your workshop payment has been recorded and your seat is secured.
            A confirmation email will follow shortly.
          </p>
          {details?.transaction_id && (
            <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-8 break-all">
              Reference: {details.transaction_id}
            </p>
          )}
          {!details?.transaction_id && <div className="mb-8" />}

          <button
            onClick={() =>
              window.location.assign(
                registrationId
                  ? `/gen-ai-workshop?registration=${encodeURIComponent(registrationId)}`
                  : '/'
              )
            }
            className="w-full py-4 sm:py-5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-black text-base sm:text-lg tracking-wider transition-colors cursor-pointer shadow-lg shadow-yellow-500/20"
          >
            {registrationId ? 'Back to Registration' : 'Return to Homepage'}{' '}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 inline ml-2" />
          </button>
        </div>
      </div>
    </main>
  );
}
