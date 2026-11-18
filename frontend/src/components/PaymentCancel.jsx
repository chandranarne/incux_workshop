import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function PaymentCancel() {
  return (
    <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-600 dark:text-[#F87171] mx-auto mb-8" />

          <h1 className="font-headline font-black text-2xl sm:text-3xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight mb-3">
            Payment Not Completed
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed mb-8">
            Your payment was not completed. No amount was charged and your registration is still saved.
            You can retry the payment below.
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
