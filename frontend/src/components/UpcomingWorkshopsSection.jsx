import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { fetchUpcomingWorkshops } from '../services/api';
import auditoriumImg from '../assets/auditorium_workshop.jpg';
import labImg from '../assets/hands_on_lab.jpg';
import mentorImg from '../assets/mentor_guidance.jpg';
import campusHallImg from '../assets/campus_hall_card.jpg';

const categoryImages = {
  default: auditoriumImg,
  "Agentic AI": labImg,
  "Generative AI": auditoriumImg,
  "Cloud Security": mentorImg,
  "Full Stack": campusHallImg
};

export default function UpcomingWorkshopsSection({ onOpenPortal, onOpenAuth, currentUser }) {
  const [workshops, setWorkshops] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const scrollContainerRef = React.useRef(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchUpcomingWorkshops();
      setWorkshops(data);
    };
    load();
  }, []);

  const handleAction = (ws) => {
    if (!currentUser) {
      onOpenAuth('candidate');
    } else {
      onOpenPortal();
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const categories = ['All', 'Agentic AI', 'Generative AI', 'Cloud Security', 'Full Stack'];

  const filteredWorkshops = activeCategory === 'All'
    ? workshops
    : workshops.filter(ws => ws.category?.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]));

  const displayList = filteredWorkshops.length > 0 ? filteredWorkshops : workshops;

  return (
    <section
      id="upcoming-workshops"
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-16 sm:py-24 border-t border-black/10 dark:border-yellow-400/20 overflow-hidden transition-colors duration-200"
      aria-label="Upcoming Workshops and Registrations"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#141414]/90 backdrop-blur-md border border-black/10 dark:border-yellow-400/30 text-xs font-mono text-[#0A0A0A] dark:text-[#FACC15] uppercase tracking-widest mb-4 font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15]" />
              <span>Upcoming Workshops // Open For Registration</span>
            </div>
            <h2 className="font-headline font-black text-3xl sm:text-5xl md:text-6xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight leading-tight">
              Upcoming Workshops &amp; <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] via-[#FACC15] to-[#EAB308] dark:from-[#FACC15] dark:via-[#FEF08A] dark:to-[#FACC15]">
                Open For Registration
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#525252] dark:text-[#A3A3A3] font-normal leading-relaxed max-w-xl">
              Workshop cohorts actively accepting candidate registrations.
            </p>
          </div>

          {/* Scroll Navigation Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll workshops left"
              className="w-11 h-11 rounded-full bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] flex items-center justify-center text-[#0A0A0A] dark:text-[#FACC15] hover:bg-[#FACC15] hover:text-[#0A0A0A] transition-all shadow-md cursor-pointer active:scale-95"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll workshops right"
              className="w-11 h-11 rounded-full bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] border border-[#0A0A0A] dark:border-[#FACC15] flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-4 mb-8 sm:mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-headline font-bold text-xs uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A] shadow-md shadow-black/20 dark:shadow-yellow-500/20'
                    : 'bg-white dark:bg-[#141414] text-[#0A0A0A] dark:text-[#F5F5F5] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Live Workshop Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-6 pt-2 snap-x snap-mandatory"
        >
          {displayList.map((ws, idx) => {
            const seatsLeft = Math.max(0, ws.seats - (ws.registered || 0));
            const percentFilled = Math.min(100, Math.round(((ws.registered || 0) / ws.seats) * 100));
            const thumbnail = categoryImages[ws.category] || categoryImages.default;

            return (
              <div
                key={ws.id || idx}
                className="w-[300px] sm:w-[340px] lg:w-[360px] shrink-0 snap-start group rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Visual Header */}
                <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={thumbnail}
                    alt={ws.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-600 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Status Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    {seatsLeft > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FACC15] text-[#0A0A0A] text-[10px] font-mono font-bold tracking-wider shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />
                        UPCOMING
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-600 text-white text-[10px] font-mono font-bold tracking-wider shadow-sm">
                        FULL
                      </span>
                    )}
                  </div>

                  {/* Mode Pill */}
                  <div className="absolute top-3.5 right-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-medium border border-white/20">
                      {ws.mode || 'In-Person Lab'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2 text-[#525252] dark:text-[#A3A3A3]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F8F8F5] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FACC15] font-bold text-[11px] border border-black/10 dark:border-[#262626]">
                        {ws.category}
                      </span>
                      <span className="text-[11px] font-mono text-[#525252] dark:text-[#A3A3A3]">
                        {ws.mode}
                      </span>
                    </div>

                    <h3 className="font-headline font-bold text-xl text-[#0A0A0A] dark:text-[#F5F5F5] group-hover:text-[#EAB308] dark:group-hover:text-[#FACC15] transition-colors leading-snug line-clamp-2">
                      {ws.title}
                    </h3>

                    <div className="my-3.5 space-y-1.5 text-xs font-mono text-[#525252] dark:text-[#A3A3A3]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15] flex-shrink-0" />
                        <span>{ws.dates}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#737373] flex-shrink-0" />
                        <span className="truncate">{ws.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#525252] dark:text-[#A3A3A3] font-body line-clamp-2 leading-relaxed">
                      {ws.description}
                    </p>
                  </div>

                  {/* Capacity Bar & Quick Enroll Button */}
                  <div className="mt-5 pt-4 border-t border-black/10 dark:border-[#262626]">
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className="text-[#525252] dark:text-[#A3A3A3] font-bold">SEATS STATUS</span>
                        <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                          {seatsLeft} / {ws.seats} left
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/10 dark:bg-[#0A0A0A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#FACC15] rounded-full transition-all duration-500"
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleAction(ws)}
                      className="w-full py-3 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-bold text-xs uppercase tracking-wider shadow-md shadow-black/10 dark:shadow-yellow-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <span>Enroll in Cohort</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
