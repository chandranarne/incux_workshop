import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function PaymentSuccess() {
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
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed mb-8">
            Your workshop payment has been successfully confirmed and your seat is secured.
            You will receive a confirmation email shortly with all the details.
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
