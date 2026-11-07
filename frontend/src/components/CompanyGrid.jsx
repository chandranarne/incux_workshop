import React from 'react';
import { Sparkles } from 'lucide-react';
import { companiesData } from '../data/companies';

const premierCompanies = [
  "Walmart",
  "Microsoft",
  "Google",
  "PayPal",
  "PwC",
  "EY",
  "Genpact",
  "TCS",
  "Deloitte",
  "Cognizant",
  "Wipro",
  "Infosys",
  "Capgemini",
  "Tech Mahindra",
  "Optum",
  "Dell",
  "Intel",
  "Amazon",
  "Oracle",
  "Cisco",
  "IBM",
  "Accenture",
  "Salesforce",
  "Adobe"
];

export default function CompanyGrid({ data = companiesData }) {
  const { headline, disclaimer } = data;

  return (
    <section
      id="industry"
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-16 md:py-24 border-t border-black/10 dark:border-yellow-400/20 overflow-hidden transition-colors duration-200"
      aria-label="Industry Connections"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#141414]/90 border border-black/10 dark:border-yellow-400/30 text-xs font-mono text-[#0A0A0A] dark:text-[#FACC15] uppercase tracking-widest mb-4 font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15]" />
            <span>Our Leading Collaborations</span>
          </div>

          <h2 className="font-headline font-black text-3xl sm:text-5xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight leading-tight">
            {headline}
          </h2>

          <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-normal">
            Direct learning and mentorship from senior practitioners working at leading enterprise software and AI organizations.
          </p>
        </div>

        {/* LIGHTISH YELLOW RECTANGULAR BOX: High Contrast with UI/UX */}
        <div className="relative rounded-3xl p-6 sm:p-10 md:p-12 bg-[#FEF9C3] dark:bg-[#FEF08A] text-[#0A0A0A] border-2 border-amber-300 dark:border-amber-400 shadow-2xl overflow-hidden group">
          {/* Subtle decorative background watermarks */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-300/40 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-yellow-400/30 blur-3xl pointer-events-none" />

          {/* Box Header Banner */}
          <div className="relative z-10 pb-6 mb-8 border-b border-amber-300/80">
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-900 font-extrabold block mb-1">
              GLOBAL PRACTITIONER FOOTPRINT
            </span>
            <h3 className="font-headline font-black text-2xl sm:text-3xl text-[#0A0A0A] tracking-tight">
              Our Leading Collaborations & Mentors
            </h3>
          </div>

          {/* Clean Rectangular Pills Grid of Companies */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {premierCompanies.map((name) => (
              <div
                key={name}
                className="group/chip bg-white/90 hover:bg-white text-[#0A0A0A] border border-amber-300/80 hover:border-amber-500 rounded-2xl px-4 py-3 sm:py-4 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center text-center cursor-default"
              >
                <span className="font-headline font-bold text-sm sm:text-base tracking-tight text-[#0A0A0A] group-hover/chip:text-amber-800 transition-colors">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
