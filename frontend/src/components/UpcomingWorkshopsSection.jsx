import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import {
  fetchUpcomingWorkshops,
  DEFAULT_UPCOMING_WORKSHOPS
} from '../services/api';

const formatFee = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function UpcomingWorkshopsSection({ onOpenAiWorkshopPage }) {
  const [workshops, setWorkshops] = useState(DEFAULT_UPCOMING_WORKSHOPS);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUpcomingWorkshops();
        setWorkshops(Array.isArray(data) && data.length > 0 ? data : DEFAULT_UPCOMING_WORKSHOPS);
      } catch (err) {
        setWorkshops(DEFAULT_UPCOMING_WORKSHOPS);
      }
    };
    load();
  }, []);

  return (
    <section
      id="upcoming-workshops"
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-10 sm:py-14 lg:py-16 border-t border-black/10 dark:border-yellow-400/20 overflow-hidden transition-colors duration-200"
      aria-label="Upcoming Workshops and Registrations"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight leading-tight">
            Upcoming Workshops
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] via-[#FACC15] to-[#EAB308] dark:from-[#FACC15] dark:via-[#FEF08A] dark:to-[#FACC15]">
              Open For Registration
            </span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#525252] dark:text-[#A3A3A3]">
            One upcoming cohort. Open its page for the full details and step-wise registration.
          </p>
        </div>

        <ul className="divide-y divide-black/10 dark:divide-[#262626] border-y border-black/10 dark:border-[#262626]">
          {workshops.map((workshop) => {
            const fee = Number(workshop.fee ?? workshop.price ?? 0);
            return (
              <li
                key={workshop.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 py-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-[#525252] dark:text-[#A3A3A3]">
                    <span className="font-bold text-[#0A0A0A] dark:text-[#FACC15]">{workshop.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {workshop.dates}
                    </span>
                    {fee > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FACC15] text-[#0A0A0A] font-bold">
                        {formatFee(fee)} workshop fee
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1.5 font-headline font-black text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
                    {workshop.title}
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{workshop.location} · {workshop.mode}</span>
                  </p>

                  <p className="mt-2 text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] max-w-2xl leading-relaxed">
                    {workshop.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={onOpenAiWorkshopPage}
                    className="text-sm font-bold text-[#525252] dark:text-[#A3A3A3] hover:text-amber-600 dark:hover:text-[#FACC15] transition-colors cursor-pointer"
                  >
                    Full details
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAiWorkshopPage}
                    className="px-5 py-3 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-xs sm:text-sm tracking-wider transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    Register for Workshop <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
