import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { fetchUpcomingWorkshops } from '../services/api';
import genAiBannerImg from '../assets/generative_ai_workshop_banner.jpg';

const initialWorkshop = {
  id: "WS-GENAI-IIT",
  title: "Generative AI Workshop",
  category: "Generative AI",
  dates: "November 20-21, 2026",
  duration: "2-Day Hands-on Workshop",
  location: "IIT Campus",
  seats: 120,
  registered: 42,
  mode: "Offline IIT Campus",
  speaker: "IncuxAI Senior AI Architects & Google/IIT Research Scholars",
  description: "Two-day hands-on workshop at IIT Campus. Deep-dive into LLM fine-tuning, prompt engineering pipelines, autonomous agent architectures, retrieval-augmented generation (RAG), and enterprise deployment sandboxes.",
  status: "Active",
  isPrimary: true
};

export default function UpcomingWorkshopsSection({ onOpenPortal, onOpenUpcomingPopup }) {
  const [workshop, setWorkshop] = useState(initialWorkshop);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUpcomingWorkshops();
        if (data && data.length > 0) {
          const genAiWs = data.find(w => w.id === 'WS-GENAI-IIT' || w.title?.toLowerCase().includes('generative ai')) || data[0];
          setWorkshop({
            ...genAiWs,
            mode: 'Offline IIT Campus',
            location: 'IIT Campus'
          });
        } else {
          setWorkshop(initialWorkshop);
        }
      } catch (err) {
        setWorkshop(initialWorkshop);
      }
    };
    load();
  }, []);

  const ws = workshop;
  const seatsLeft = Math.max(0, ws.seats - (ws.registered || 0));
  const percentFilled = Math.min(100, Math.round(((ws.registered || 0) / ws.seats) * 100));

  const handleAction = () => {
    onOpenUpcomingPopup();
  };

  return (
    <section
      id="upcoming-workshops"
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-10 sm:py-14 lg:py-20 border-t border-black/10 dark:border-yellow-400/20 overflow-hidden transition-colors duration-200"
      aria-label="Upcoming Workshops and Registrations"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
          <div className="max-w-3xl text-center sm:text-left">
            <h2 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight leading-tight">
              Upcoming Workshop &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] via-[#FACC15] to-[#EAB308] dark:from-[#FACC15] dark:via-[#FEF08A] dark:to-[#FACC15]">
                Open For Registration
              </span>
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#525252] dark:text-[#A3A3A3] font-normal leading-relaxed max-w-xl mx-auto sm:mx-0">
              Official workshop cohort actively accepting candidate registrations.
            </p>
          </div>
        </div>

        {/* Simple Workshop Listing - fits tidily in the section view on all screens */}
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          <div className="relative w-full rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] overflow-hidden shadow-sm">
            {/* Visual banner */}
            <div className="relative aspect-[2/1] sm:aspect-[16/9] md:aspect-[3/2] overflow-hidden bg-neutral-950 cursor-pointer group" onClick={handleAction}>
              <img
                src={genAiBannerImg}
                alt={ws.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] z-10">
                <span className="px-4 py-2 rounded-full bg-[#FACC15] text-[#0A0A0A] font-headline font-black text-xs sm:text-sm tracking-wider shadow-xl">
                  Click To View Announcement Popup
                </span>
              </div>
              {/* Badges on the banner */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#FACC15] text-[#0A0A0A] text-[10px] sm:text-[11px] font-mono font-bold tracking-wider shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
                  UPCOMING COHORT
                </span>
                <span className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/80 backdrop-blur-md text-[#FACC15] text-[10px] sm:text-[11px] font-mono font-bold border border-[#FACC15]/40 shadow-lg">
                  {ws.mode}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <span className="text-[10px] sm:text-xs uppercase font-mono tracking-wider px-3 sm:px-4 py-1 sm:py-1.5 rounded-md bg-black/75 backdrop-blur-sm border border-white/15 text-[#FACC15] font-bold block text-center sm:text-left">
                  2-DAY IMMERSIVE LAB @ {ws.location}
                </span>
              </div>
            </div>

            {/* Details pane - fits in section width on laptops */}
            <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-mono text-[#525252] dark:text-[#A3A3A3]">
                <span className="px-3 py-1 rounded-full bg-[#F8F8F5] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FACC15] font-bold text-[10px] sm:text-xs border border-black/10 dark:border-[#262626]">
                  {ws.category}
                </span>
                <span className="text-xs sm:text-sm text-[#EAB308] dark:text-[#FACC15] font-semibold">
                  Offline IIT Campus
                </span>
              </div>

              <h3 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight leading-snug">
                {ws.title}
              </h3>

              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#525252] dark:text-[#A3A3A3] font-medium leading-relaxed">
                Two-day hands-on workshop at IIT Campus.
              </p>

              <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm font-mono text-[#525252] dark:text-[#A3A3A3] p-4 sm:p-5 rounded-2xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/5 dark:border-[#262626]">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#EAB308] dark:text-[#FACC15] flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-sans">DATES</span>
                    <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{ws.dates}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#737373] flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-sans">VENUE</span>
                    <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{ws.location}</span>
                  </div>
                </div>
              </div>

              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] font-body line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {ws.description}
              </p>

              {/* Capacity bar */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-black/10 dark:border-[#262626]">
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono mb-1.5">
                  <span className="text-[#525252] dark:text-[#A3A3A3] font-bold">SEATS STATUS</span>
                  <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                    {seatsLeft} / {ws.seats} seats remaining
                  </span>
                </div>
                <div className="w-full h-2 sm:h-2.5 bg-black/10 dark:bg-[#0A0A0A] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#FACC15] rounded-full transition-all duration-500"
                    style={{ width: `${percentFilled}%` }}
                  />
                </div>
              </div>

              <button
                onClick={handleAction}
                className="w-full sm:w-auto py-3.5 sm:py-4 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-xs sm:text-sm tracking-wider shadow-lg shadow-black/10 dark:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Register for Cohort</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
