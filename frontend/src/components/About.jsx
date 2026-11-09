import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, Trophy, Code, Camera, ChevronLeft, ChevronRight, X, Maximize2, MapPin, Calendar, Sparkles } from 'lucide-react';
import auditoriumImg from '../assets/auditorium_workshop.jpg';
import labImg from '../assets/hands_on_lab.jpg';
import WorkshopVideoPlayer from './WorkshopVideoPlayer';
import { eventPhotos } from '../data/eventPhotos';

gsap.registerPlugin(ScrollTrigger);

export default function About({ onOpenRegistration }) {
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('workshops'); // 'workshops' | 'hackathons' | 'guest-lectures'
  const [lightboxIndex, setLightboxIndex] = useState(null); // null or number
  const touchStartXRef = useRef(null);

  const currentPhotos = eventPhotos[activeCategory] || [];

  // Lightbox navigation
  const openLightbox = (index) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % currentPhotos.length);
  }, [currentPhotos.length]);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + currentPhotos.length) % currentPhotos.length);
  }, [currentPhotos.length]);

  // Touch swipe support for Lightbox on mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (deltaX > 45) {
      showPrev();
    } else if (deltaX < -45) {
      showNext();
    }
    touchStartXRef.current = null;
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, showNext, showPrev]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Content reveal
      gsap.from(".about-content", {
        y: 25,
        opacity: 0,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true
        }
      });

      // Video showcase arrival animation
      gsap.from(".about-video-wrapper", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-video-wrapper",
          start: "top 80%",
          once: true
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-12 sm:py-24 border-t border-black/10 dark:border-[#262626] overflow-hidden transition-colors duration-200"
      aria-label="Bridging Education and Industry"
    >
      {/* Ambient Settled Background Photography */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="about-ambient-photo-1 absolute -top-10 -left-16 w-80 h-64 rounded-3xl overflow-hidden opacity-10 dark:opacity-5 blur-[1px] rotate-[-8deg] border border-[#FACC15]/20">
          <img src={labImg} alt="" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="about-ambient-photo-2 absolute -bottom-16 -right-20 w-96 h-72 rounded-3xl overflow-hidden opacity-10 dark:opacity-5 blur-[1px] rotate-[10deg] border border-[#FACC15]/20">
          <img src={auditoriumImg} alt="" className="w-full h-full object-cover grayscale" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header: Centered Editorial Mission */}
        <div className="about-content max-w-4xl mx-auto text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FACC15]/15 dark:bg-[#FACC15]/10 border border-[#FACC15]/30 text-[11px] sm:text-xs font-mono text-neutral-900 dark:text-[#FACC15] uppercase tracking-widest mb-3.5 sm:mb-4 font-bold shadow-xs">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#FACC15]" />
            <span>Academic &amp; Industry Initiative</span>
          </div>

          <h2 className="font-headline font-black text-2xl sm:text-5xl md:text-6xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight leading-tight">
            Bridging Education <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FACC15] to-amber-500 dark:from-[#FACC15] dark:via-white dark:to-[#FEF08A]">
              and Industry.
            </span>
          </h2>

          <p className="mt-3.5 sm:mt-5 text-sm sm:text-lg text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed max-w-3xl mx-auto px-2">
            Academic curriculums build essential theoretical foundations, but enterprise technology stacks evolve at lightning speed.
            IncuxAI bridges this divide through high-impact guest lectures by global engineering leaders, competitive hackathons,
            and intensive hands-on workshops that prepare students for real production engineering.
          </p>
        </div>

        {/* Featured Video Showcase */}
        <div className="about-video-wrapper mb-12 sm:mb-20 max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-[#262626]">
          <WorkshopVideoPlayer onOpenRegistration={onOpenRegistration} />
        </div>

        {/* ========================================================================= */}
        {/* EXPLORE EVENT PHOTO SHOWCASE                                              */}
        {/* ========================================================================= */}
        <div className="about-event-selector">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#EAB308] dark:text-[#FACC15] flex items-center justify-center gap-1.5 sm:gap-2">
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>EXPLORE EVENT PHOTO SHOWCASE</span>
            </span>
            <h3 className="font-headline font-black text-xl sm:text-3xl text-neutral-950 dark:text-white mt-1.5 sm:mt-2">
              Real Moments from Our Campus Programs
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl mx-auto px-2">
              Select an event format below to view verified photography from our live university bootcamps, 48-hour hackathons, and corporate guest lectures.
            </p>
          </div>

          {/* 3 Interactive Category Buttons: Side-by-side on all screens */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-3xl mx-auto mb-8 sm:mb-10">
            {/* 1. Workshops */}
            <button
              onClick={() => setActiveCategory('workshops')}
              className={`p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center relative ${
                activeCategory === 'workshops'
                  ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] border-[#0A0A0A] dark:border-[#FACC15] shadow-lg scale-102 sm:scale-105'
                  : 'bg-white dark:bg-[#141414] text-neutral-800 dark:text-[#F5F5F5] border-black/10 dark:border-[#262626] hover:border-[#FACC15]'
              }`}
            >
              <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors ${
                activeCategory === 'workshops'
                  ? 'bg-[#FACC15] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FACC15]'
                  : 'bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15]'
              }`}>
                <Code className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="font-headline font-bold text-xs sm:text-base block truncate">Workshops</span>
                <span className="text-[9px] sm:text-[11px] font-mono opacity-80 hidden sm:block">Hands-on Labs</span>
                <span className={`inline-block mt-0.5 sm:mt-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider ${
                  activeCategory === 'workshops'
                    ? 'bg-[#FACC15] text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#FACC15]'
                    : 'bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300'
                }`}>
                  {eventPhotos.workshops.length} Photos
                </span>
              </div>
            </button>

            {/* 2. Hackathons */}
            <button
              onClick={() => setActiveCategory('hackathons')}
              className={`p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center relative ${
                activeCategory === 'hackathons'
                  ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] border-[#0A0A0A] dark:border-[#FACC15] shadow-lg scale-102 sm:scale-105'
                  : 'bg-white dark:bg-[#141414] text-neutral-800 dark:text-[#F5F5F5] border-black/10 dark:border-[#262626] hover:border-[#FACC15]'
              }`}
            >
              <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors ${
                activeCategory === 'hackathons'
                  ? 'bg-[#FACC15] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FACC15]'
                  : 'bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15]'
              }`}>
                <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="font-headline font-bold text-xs sm:text-base block truncate">Hackathons</span>
                <span className="text-[9px] sm:text-[11px] font-mono opacity-80 hidden sm:block">Build Sprints</span>
                <span className={`inline-block mt-0.5 sm:mt-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider ${
                  activeCategory === 'hackathons'
                    ? 'bg-[#FACC15] text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#FACC15]'
                    : 'bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300'
                }`}>
                  {eventPhotos.hackathons.length} Photos
                </span>
              </div>
            </button>

            {/* 3. Guest Lectures */}
            <button
              onClick={() => setActiveCategory('guest-lectures')}
              className={`p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center relative ${
                activeCategory === 'guest-lectures'
                  ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] border-[#0A0A0A] dark:border-[#FACC15] shadow-lg scale-102 sm:scale-105'
                  : 'bg-white dark:bg-[#141414] text-neutral-800 dark:text-[#F5F5F5] border-black/10 dark:border-[#262626] hover:border-[#FACC15]'
              }`}
            >
              <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors ${
                activeCategory === 'guest-lectures'
                  ? 'bg-[#FACC15] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FACC15]'
                  : 'bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15]'
              }`}>
                <Mic className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="font-headline font-bold text-xs sm:text-base block truncate">Lectures</span>
                <span className="text-[9px] sm:text-[11px] font-mono opacity-80 hidden sm:block">Keynotes</span>
                <span className={`inline-block mt-0.5 sm:mt-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider ${
                  activeCategory === 'guest-lectures'
                    ? 'bg-[#FACC15] text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#FACC15]'
                    : 'bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300'
                }`}>
                  {eventPhotos['guest-lectures'].length} Photos
                </span>
              </div>
            </button>
          </div>

          {/* Event Photo Showcase Gallery Grid: 2-column mobile, 3-column desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {currentPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all duration-300 shadow-md hover:shadow-2xl flex flex-col cursor-pointer transform hover:-translate-y-1"
              >
                {/* Photo container */}
                <div className="relative h-40 sm:h-64 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5">
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#0A0A0A]/90 dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] border border-[#FACC15]/40 text-[9px] sm:text-[10px] font-mono font-bold tracking-wider shadow-sm truncate max-w-[130px] inline-block">
                      {photo.badge}
                    </span>
                  </div>

                  {/* Expand button visual cue */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-xs text-white opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center border border-white/20">
                    <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FACC15]" />
                  </div>

                  {/* Photo number counter */}
                  <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-[10px] sm:text-[11px] font-mono text-white/70 bg-black/50 px-1.5 py-0.5 rounded-md">
                    {index + 1}/{currentPhotos.length}
                  </div>
                </div>

                {/* Content details */}
                <div className="p-3 sm:p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-headline font-bold text-xs sm:text-base text-neutral-950 dark:text-[#F5F5F5] group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors line-clamp-2 leading-snug">
                      {photo.title}
                    </h4>
                    <p className="mt-1 text-[10px] sm:text-xs font-mono text-neutral-600 dark:text-neutral-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#FACC15] shrink-0" />
                      <span className="truncate">{photo.location}</span>
                    </p>
                  </div>
                  <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-black/10 dark:border-[#262626] flex items-center justify-between text-[10px] sm:text-xs font-mono text-neutral-700 dark:text-neutral-300">
                    <span className="font-medium text-neutral-500 dark:text-neutral-400 truncate max-w-[90px] sm:max-w-none">
                      {photo.date}
                    </span>
                    <span className="text-[#EAB308] dark:text-[#FACC15] font-bold text-[10px] sm:text-[11px] shrink-0">View</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN LIGHTBOX MODAL WITH TOUCH SWIPE & KEYBOARD SUPPORT            */}
      {/* ========================================================================= */}
      {lightboxIndex !== null && currentPhotos[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-fade-in"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between z-10 py-1 sm:py-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#FACC15] text-[#0A0A0A] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider">
                {currentPhotos[lightboxIndex].badge}
              </span>
              <span className="text-white/70 text-xs font-mono">
                {lightboxIndex + 1} of {currentPhotos.length}
              </span>
            </div>

            <button
              onClick={closeLightbox}
              aria-label="Close Lightbox"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-[#FACC15] hover:text-[#0A0A0A] text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image Container with Navigation Arrows */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-2" onClick={(e) => e.stopPropagation()}>
            {/* Prev button */}
            <button
              onClick={showPrev}
              aria-label="Previous Photo"
              className="absolute left-1 sm:left-4 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/75 hover:bg-[#FACC15] hover:text-[#0A0A0A] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Displayed Image */}
            <div className="max-h-[68vh] sm:max-h-[75vh] max-w-full flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl border border-white/10">
              <img
                src={currentPhotos[lightboxIndex].image}
                alt={currentPhotos[lightboxIndex].title}
                className="max-h-[68vh] sm:max-h-[75vh] w-auto max-w-full object-contain select-none"
              />
            </div>

            {/* Next button */}
            <button
              onClick={showNext}
              aria-label="Next Photo"
              className="absolute right-1 sm:right-4 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/75 hover:bg-[#FACC15] hover:text-[#0A0A0A] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Footer Caption */}
          <div className="w-full max-w-3xl text-center py-1 sm:py-2 z-10 px-2" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-headline font-bold text-sm sm:text-xl text-white truncate sm:text-clip">
              {currentPhotos[lightboxIndex].title}
            </h3>
            <p className="text-[11px] sm:text-sm font-mono text-[#FACC15] mt-0.5 sm:mt-1 flex items-center justify-center gap-1.5 sm:gap-2 truncate">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{currentPhotos[lightboxIndex].location}</span>
              <span>•</span>
              <span className="shrink-0">{currentPhotos[lightboxIndex].date}</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
