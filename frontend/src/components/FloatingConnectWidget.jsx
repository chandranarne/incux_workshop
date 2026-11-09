import React, { useState } from 'react';
import { MessageSquare, X, Mail, Phone, Calendar, ArrowRight, Sparkles, Send } from 'lucide-react';

export default function FloatingConnectWidget({ onOpenAuth, onOpenPortal, currentUser }) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToContact = () => {
    setIsOpen(false);
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToUpcoming = () => {
    setIsOpen(false);
    document.querySelector('#upcoming-workshops')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 font-body select-none">
      {/* Expanded Popover */}
      {isOpen && (
        <div className="mb-3 sm:mb-4 w-[calc(100vw-32px)] sm:w-88 max-w-sm rounded-3xl bg-[#FDFCFA] dark:bg-[#141414] backdrop-blur-xl border border-black/10 dark:border-[#262626] shadow-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-[#262626]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15]"></span>
              <span className="font-headline font-bold text-sm text-neutral-950 dark:text-[#F5F5F5]">
                Connect with IncuxAI
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-[#FACC15] hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] transition-colors"
              aria-label="Close widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Body */}
          <p className="mt-2.5 sm:mt-3 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
            Looking to register for upcoming cohorts or get in touch with IncuxAI?
          </p>

          {/* Direct Actions */}
          <div className="mt-3.5 space-y-2">
            <button
              onClick={scrollToUpcoming}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#0A0A0A] hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15] flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-900 dark:text-[#F5F5F5] group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors">
                    Browse Upcoming Cohorts
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                    Candidate Live Enrollment
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors" />
            </button>

            <button
              onClick={scrollToContact}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#0A0A0A] hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15] flex items-center justify-center">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-900 dark:text-[#F5F5F5] group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors">
                    Host a Workshop
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                    University &amp; College Inquiries
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors" />
            </button>
          </div>

          {/* Quick Contact info */}
          <div className="mt-3.5 pt-3 border-t border-black/10 dark:border-[#262626] flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-[#FACC15]" />
              <span>+91 7665061289</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-[#FACC15]" />
              <span>info@incuxai.com</span>
            </span>
          </div>
        </div>
      )}

      {/* Floating Toggle Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-[#FACC15]/30 group"
        aria-label="Toggle contact help menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0A0A0A] animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
}
