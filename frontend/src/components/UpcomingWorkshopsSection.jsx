import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, ShieldCheck, Sparkles, Clock, Users } from 'lucide-react';
import { fetchUpcomingWorkshops, DEFAULT_UPCOMING_WORKSHOPS } from '../services/api';
import genAiBannerImg from '../assets/generative_ai_workshop_banner.jpg';
import hybridBannerImg from '../assets/auditorium_coding_lab.jpg';

export default function UpcomingWorkshopsSection({ onOpenPortal, onOpenUpcomingPopup }) {
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

  const handleRegister = (wsId) => {
    if (onOpenPortal) {
      onOpenPortal('register', wsId);
    } else if (onOpenUpcomingPopup) {
      onOpenUpcomingPopup();
    }
  };

  const handleBannerClick = (ws, idx) => {
    if (idx === 0 && onOpenUpcomingPopup) {
      onOpenUpcomingPopup();
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

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FACC15]/20 border border-[#FACC15]/40 text-[#0A0A0A] dark:text-[#FACC15] text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-[#EAB308] dark:bg-[#FACC15] animate-ping" />
              {workshops.length} COHORTS OPEN
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Grid of Upcoming Workshops */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {workshops.map((ws, idx) => {
            const isFirst = idx === 0;
            const bannerSrc = isFirst ? genAiBannerImg : hybridBannerImg;
            const seatsLeft = Math.max(0, ws.seats - (ws.registered || 0));
            const percentFilled = Math.min(100, Math.round(((ws.registered || 0) / ws.seats) * 100));

            return (
              <div
                key={ws.id || idx}
                className="relative rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Banner Showcase */}
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30 pointer-events-none" />

                  {/* Hover Prompt Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] z-10">
                    <span className="px-4 py-2 rounded-full bg-[#FACC15] text-[#0A0A0A] font-headline font-black text-xs sm:text-sm tracking-wider shadow-xl">
                      {isFirst ? 'Click To View Announcement Popup' : 'Click To Register Online'}
                    </span>
                  </div>

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex flex-col gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#FACC15] text-[#0A0A0A] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
                      UPCOMING COHORT
                    </span>
                    <span className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/80 backdrop-blur-md text-[#FACC15] text-[10px] sm:text-[11px] font-mono font-bold border border-[#FACC15]/40 shadow-lg">
                      {ws.mode || (isFirst ? 'Offline IIT Campus' : 'Combined Virtual & Offline')}
                    </span>
                  </div>

                  {/* Top Right Duration Pill */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-[#0A0A0A]/95 text-[#0A0A0A] dark:text-[#FACC15] font-mono text-[10px] sm:text-[11px] font-bold border border-black/10 dark:border-yellow-400/30 shadow-md">
                      {ws.duration || (isFirst ? '2 Days' : '10 Days')}
                    </span>
                  </div>

                  {/* Bottom Strip on Banner */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-20">
                    <span className="text-[10px] sm:text-xs uppercase font-mono tracking-wider px-3 sm:px-4 py-1 sm:py-1.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/15 text-[#FACC15] font-bold block text-center sm:text-left truncate">
                      {isFirst
                        ? `2-DAY IMMERSIVE LAB @ ${ws.location || 'IIT Campus'}`
                        : '10-DAY COMBINED VIRTUAL + OFFLINE WORKSHOP'}
                    </span>
                  </div>
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
                        <span>{ws.duration}</span>
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

                  {/* Capacity Bar & Action Button */}
                  <div className="pt-4 border-t border-black/10 dark:border-[#262626] flex flex-col gap-4">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <span className="text-[#525252] dark:text-[#A3A3A3] font-bold flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#FACC15]" />
                          <span>SEATS STATUS</span>
                        </span>
                        <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                          {seatsLeft} / {ws.seats} seats remaining
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/10 dark:bg-[#0A0A0A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#FACC15] rounded-full transition-all duration-500"
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleRegister(ws.id)}
                      className="w-full py-3.5 sm:py-4 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-xs sm:text-sm tracking-wider shadow-lg shadow-black/10 dark:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Register for Cohort</span>
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
