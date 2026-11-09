import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import genAiBannerImg from '../assets/generative_ai_workshop_banner.jpg';

export default function UpcomingWorkshopPopup({ onOpenRegistration, onExploreWorkshops }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    try {
      const dismissed = sessionStorage.getItem('incuxai_upcoming_popup_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1800);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      const timer = setTimeout(() => setIsOpen(true), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('incuxai_upcoming_popup_dismissed', 'true');
    } catch (e) {}
  };

  const handleCTAClick = () => {
    handleClose();
    if (onOpenRegistration) {
      onOpenRegistration('register');
    } else {
      document.querySelector('#upcoming-workshops')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl sm:max-w-2xl bg-[#0E0E10] text-[#F5F5F5] border border-[#FACC15]/30 rounded-3xl overflow-hidden shadow-2xl shadow-yellow-500/10 z-10 my-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close Announcement"
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white hover:text-[#FACC15] flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Graphic Header */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950">
              <img
                src={genAiBannerImg}
                alt="Generative AI Workshop at IIT Campus"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-transparent to-black/30 pointer-events-none" />

              {/* Floating Top Tag */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FACC15] text-[#0A0A0A] text-[10px] sm:text-xs font-mono font-bold tracking-wider shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 fill-[#0A0A0A]" />
                  UPCOMING WORKSHOP // OPEN FOR REGISTRATION
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 pt-2 flex flex-col gap-4 sm:gap-5">
              {/* Event Title and Subtitle */}
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#FACC15] font-semibold mb-1">
                  <span>IIT HYDERABAD &amp; PREMIER RESEARCH PARTNERS</span>
                  <span>•</span>
                  <span>OFFLINE CAMPUS IMMERSION</span>
                </div>
                <h3 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-[#F5F5F5] tracking-tight leading-tight">
                  Generative AI Workshop
                </h3>
                <p className="mt-1 text-sm sm:text-base text-neutral-300 font-medium">
                  Two-day hands-on workshop at IIT Campus.
                </p>
              </div>

              {/* Key Logistics Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 py-1 font-mono text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-[#FACC15]/15 border border-[#FACC15]/30 flex items-center justify-center text-[#FACC15] shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">DATES</span>
                    <span className="font-bold text-[#F5F5F5]">November 20–21, 2026 (2 Days)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-xl bg-[#FACC15]/15 border border-[#FACC15]/30 flex items-center justify-center text-[#FACC15] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase">VENUE</span>
                    <span className="font-bold text-[#F5F5F5]">IIT Campus</span>
                  </div>
                </div>
              </div>

              {/* Curriculum Bullet Points */}
              <div className="rounded-2xl bg-black/40 border border-white/10 p-3.5 sm:p-4 text-xs font-mono text-neutral-300 space-y-2">
                <div className="flex items-start gap-2">
                  <Cpu className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
                  <span>Hands-on Fine-Tuning &amp; Enterprise RAG pipelines with live GPU compute.</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
                  <span>Interactive mentoring with senior researchers and Google/Tech alumni.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                {/* User Requested CTA Button */}
                <button
                  type="button"
                  onClick={handleCTAClick}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-black text-sm sm:text-base tracking-wide uppercase flex items-center justify-center gap-2.5 shadow-xl shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Your Next Big Thing Starts Here.</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs transition-colors cursor-pointer"
                >
                  Explore Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
