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
    <div className="fixed bottom-6 right-6 z-40 font-body select-none">
      {/* Expanded Popover */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-88 rounded-3xl bg-[#FDFCFA] dark:bg-[#141414] backdrop-blur-xl border border-black/10 dark:border-[#262626] shadow-2xl p-5 animate-in fade-in slide-in-from-bottom-5 duration-200">
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
          <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
            Looking to register for upcoming cohorts or get in touch with IncuxAI?
          </p>

          {/* Direct Actions */}
          <div className="mt-4 space-y-2">
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
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={scrollToContact}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#0A0A0A] hover:bg-neutral-50 dark:hover:bg-[#1A1A1A] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-900 dark:text-[#F5F5F5] group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors">
                    Direct Contact &amp; Inquiries
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                    Reach Out Directly
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Quick Contacts Footer */}
          <div className="mt-4 pt-3 border-t border-black/10 dark:border-[#262626] flex items-center justify-between text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
            <a
              href="mailto:info@incuxai.com"
              className="flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-[#FACC15] transition-colors"
            >
              <Mail className="w-3 h-3" />
              <span>info@incuxai.com</span>
            </a>
            <a
              href="https://wa.me/917665061289"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-[#FACC15] transition-colors font-semibold"
            >
              <Phone className="w-3 h-3" />
              <span>+91 7665061289</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-bold text-xs uppercase tracking-wider shadow-2xl shadow-yellow-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-[#FACC15]/40"
        aria-label="Toggle quick connect widget"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15] dark:bg-[#0A0A0A]"></span>
        <span>{isOpen ? 'Close' : 'Connect with Us'}</span>
        <MessageSquare className="w-4 h-4 ml-0.5 transition-transform group-hover:rotate-12" />
      </button>
    </div>
  );
}
