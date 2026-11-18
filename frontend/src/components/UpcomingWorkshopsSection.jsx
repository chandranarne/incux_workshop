import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import {
  fetchUpcomingWorkshops,
  DEFAULT_UPCOMING_WORKSHOPS
} from '../services/api';

const getFee = (ws) => {
  const value = ws?.fee ?? ws?.price ?? 0;
  return Number(value) > 0 ? Number(value) : 0;
};

export default function UpcomingWorkshopsSection({ onOpenPortal, onOpenUpcomingPopup, onOpenAiWorkshopPage }) {
  const [workshops, setWorkshops] = useState(DEFAULT_UPCOMING_WORKSHOPS);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUpcomingWorkshops();
        if (data && data.length > 0) {
          setWorkshops(data);
        } else {
          setWorkshops(DEFAULT_UPCOMING_WORKSHOPS);
        }
      } catch (err) {
        setWorkshops(DEFAULT_UPCOMING_WORKSHOPS);
      }
    };
    load();
  }, []);

  const handleDetails = (ws, idx) => {
    if (idx === 0 && onOpenUpcomingPopup) {
      onOpenUpcomingPopup();
    } else if (onOpenAiWorkshopPage) {
      onOpenAiWorkshopPage();
    } else if (onOpenPortal) {
      onOpenPortal('register', ws.id);
    }
  };

  const handleAction = (ws) => {
    const fee = getFee(ws);
    if (ws.isPaid || fee > 0) {
      window.location.assign(
        `/payment?workshopId=${encodeURIComponent(ws.id)}&amount=${fee}&workshopTitle=${encodeURIComponent(ws.title)}`
      );
      return;
    }
    if (onOpenPortal) {
      onOpenPortal('register', ws.id);
    } else if (onOpenUpcomingPopup) {
      onOpenUpcomingPopup();
    }
  };

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
            Choose a cohort below. Open its page for the full syllabus, schedule and registration details.
          </p>
        </div>

        <ul className="divide-y divide-black/10 dark:divide-[#262626] border-y border-black/10 dark:border-[#262626]">
          {workshops.map((ws, idx) => {
            const fee = getFee(ws);
            const isPaid = ws.isPaid || fee > 0;

            return (
              <li
                key={ws.id || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 sm:py-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-[#525252] dark:text-[#A3A3A3]">
                    <span className="font-bold text-[#0A0A0A] dark:text-[#FACC15]">{ws.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {ws.dates}
                    </span>
                    {isPaid && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FACC15] text-[#0A0A0A] font-bold">
                        ₹{fee} fee
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1.5 font-headline font-black text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
                    {ws.title}
                  </h3>

                  <p className="mt-1 text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{ws.location} · {ws.mode}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDetails(ws, idx)}
                    className="text-sm font-bold text-[#525252] dark:text-[#A3A3A3] hover:text-amber-600 dark:hover:text-[#FACC15] transition-colors cursor-pointer"
                  >
                    Full details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(ws)}
                    className="px-5 py-3 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-xs sm:text-sm tracking-wider transition-colors cursor-pointer"
                  >
                    {isPaid ? `Pay ₹${fee}` : 'Register'}
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
