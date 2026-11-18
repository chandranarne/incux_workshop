import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import {
  fetchUpcomingWorkshops,
  DEFAULT_UPCOMING_WORKSHOPS,
  createPaymentOrder,
  registerForWorkshop
} from '../services/api';
import genAiBannerImg from '../assets/generative_ai_workshop_banner.jpg';
import hybridBannerImg from '../assets/ai_workshop_10d_banner.jpg';

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

  const handleRegister = async (wsId) => {
    if (wsId === 'WS-HYBRID-10D' || wsId === 'WS-AI-10D') {
      if (onOpenAiWorkshopPage) {
        onOpenAiWorkshopPage();
        return;
      }
    }
    const ws = workshops.find(w => w.id === wsId) || DEFAULT_UPCOMING_WORKSHOPS.find(w => w.id === wsId);
    if (ws && (ws.isPaid || (ws.fee && ws.fee > 0))) {
      // Paid workshop: navigate to payment page with workshop details
      window.location.assign(
        `/payment?workshopId=${ws.id}&amount=${ws.fee}&workshopTitle=${encodeURIComponent(ws.title)}`
      );
      return;
    }
    if (onOpenPortal) {
      onOpenPortal('register', wsId);
    } else if (onOpenUpcomingPopup) {
      onOpenUpcomingPopup();
    }
  };

  const handleBannerClick = (ws, idx) => {
    if (idx === 0 && onOpenUpcomingPopup) {
      onOpenUpcomingPopup();
    } else if (ws.id === 'WS-HYBRID-10D' || ws.id === 'WS-AI-10D' || idx === 1) {
      if (onOpenAiWorkshopPage) {
        onOpenAiWorkshopPage();
      } else {
        handleRegister(ws.id);
      }
    } else {
      handleRegister(ws.id);
    }
  };

  return (
    <section
      id="upcoming-workshops"
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-10 sm:py-14 lg:py-20 border-t border-black/10 dark:border-yellow-400/20 overflow-hidden transition-colors duration-200"
      aria-label="Upcoming Workshops and Registrations"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
          <div className="max-w-3xl text-left">
            <h2 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight leading-tight">
              Upcoming Workshops &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] via-[#FACC15] to-[#EAB308] dark:from-[#FACC15] dark:via-[#FEF08A] dark:to-[#FACC15]">
                Open For Registration
              </span>
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#525252] dark:text-[#A3A3A3] font-normal leading-relaxed max-w-xl">
              Official workshop cohorts actively accepting candidate registrations for on-campus and hybrid immersion tracks.
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Grid of Upcoming Workshops */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {workshops.map((ws, idx) => {
            const isFirst = idx === 0;
            const bannerSrc = isFirst ? genAiBannerImg : hybridBannerImg;
            const isPaid = ws.isPaid || (ws.fee && ws.fee > 0);

            return (
              <div
                key={ws.id || idx}
                className="relative rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Banner Showcase — Unobstructed, Clean Poster Display */}
                <div
                  className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950 cursor-pointer group"
                  onClick={() => handleBannerClick(ws, idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View announcement for ${ws.title}`}
                >
                  <img
                    src={bannerSrc}
                    alt={ws.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Hover Prompt Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] z-10">
                    <span className="px-4 py-2 rounded-full bg-[#FACC15] text-[#0A0A0A] font-headline font-black text-xs sm:text-sm tracking-wider shadow-xl">
                      {isFirst ? 'Click To View Announcement Popup' : 'Click To View Full 10-Day Workshop Details'}
                    </span>
                  </div>
                  {/* Paid badge */}
                  {isPaid && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 rounded-full bg-[#FACC15] text-[#0A0A0A] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider shadow-lg">
                        ₹{ws.fee} • Paid Workshop
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Container */}
                <div className="p-5 sm:p-7 lg:p-8 flex-1 flex flex-col justify-between gap-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3 text-xs font-mono text-[#525252] dark:text-[#A3A3A3]">
                      <span className="px-3 py-1 rounded-full bg-[#F8F8F5] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FACC15] font-bold text-[10px] sm:text-xs border border-black/10 dark:border-[#262626]">
                        {ws.category}
                      </span>
                      <span className="text-xs text-[#EAB308] dark:text-[#FACC15] font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ws.dates}</span>
                      </span>
                    </div>

                    <h3 className="font-headline font-black text-2xl sm:text-3xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight leading-snug">
                      {ws.title}
                    </h3>

                    <p className="text-sm sm:text-base text-amber-700 dark:text-[#FACC15] font-semibold leading-relaxed">
                      {isFirst
                        ? 'Two-day hands-on workshop at IIT Campus.'
                        : '10-day combined virtual and offline intensive workshop.'}
                    </p>

                    {/* Logistics Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/5 dark:border-[#262626] font-mono text-xs">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0" />
                        <div>
                          <span className="text-[10px] text-neutral-400 block uppercase font-sans">DATES</span>
                          <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{ws.dates}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#737373] shrink-0" />
                        <div>
                          <span className="text-[10px] text-neutral-400 block uppercase font-sans">VENUE</span>
                          <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5] truncate max-w-[170px] block">
                            {ws.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Curriculum / Matter Description */}
                    <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] font-body leading-relaxed">
                      {ws.description}
                    </p>
                  </div>

                  {/* Action Button: Register or Pay */}
                  <div className="pt-4 border-t border-black/10 dark:border-[#262626]">
                    <button
                      onClick={() => handleRegister(ws.id)}
                      className="w-full py-3.5 sm:py-4 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-xs sm:text-sm tracking-wider shadow-lg shadow-black/10 dark:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>{isPaid ? `Pay ₹${ws.fee} & Register` : 'Register'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
