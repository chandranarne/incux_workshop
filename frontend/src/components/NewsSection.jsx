import React from 'react';
import { siteConfig } from '../data/config';
import { Newspaper, ShieldCheck } from 'lucide-react';

export default function NewsSection() {
  const { newsPlaceholder } = siteConfig;

  return (
    <section
      id="news"
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-20 border-t border-black/10 dark:border-[#262626] overflow-hidden transition-colors duration-200"
      aria-label="News and Announcements"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FACC15]/15 dark:bg-[#FACC15]/10 border border-[#FACC15]/30 text-xs font-mono text-neutral-900 dark:text-[#FACC15] uppercase tracking-widest mb-4 font-semibold shadow-sm">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Honest Placeholder // Transparency Charter</span>
          </div>

          <h2 className="font-headline font-bold text-3xl sm:text-4xl md:text-5xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight">
            {newsPlaceholder.title}
          </h2>

          <div className="mt-8 p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#141414] border border-dashed border-black/15 dark:border-[#262626] text-left relative overflow-hidden shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#FACC15]/15 border border-[#FACC15]/30 text-neutral-900 dark:text-[#FACC15] text-xs font-mono font-semibold">
                {newsPlaceholder.badge}
              </span>
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                {newsPlaceholder.statusMessage}
              </span>
            </div>

            <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-body">
              {newsPlaceholder.clarification}
            </p>

            <div className="mt-6 pt-4 border-t border-black/10 dark:border-[#262626] flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-[#FACC15]" />
              <span>Strict compliance: Zero fabricated announcements or synthetic press clips.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
