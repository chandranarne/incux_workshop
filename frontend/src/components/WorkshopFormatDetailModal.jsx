import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  BookOpen,
  Award,
  Calendar,
  Building,
  GraduationCap
} from 'lucide-react';
import { workshopFormatDetails } from '../data/workshopFormatDetails';

export default function WorkshopFormatDetailModal({ formatId, isOpen, onClose, onRegister, onRequestCollege }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Reset photo index when format changes
  useEffect(() => {
    setSelectedPhotoIndex(0);
  }, [formatId]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !formatId) return null;

  const detail = workshopFormatDetails[formatId] || workshopFormatDetails['iit-workshops'];
  const gallery = detail.gallery || [{ image: detail.heroImage, caption: detail.title }];
  const currentPhoto = gallery[selectedPhotoIndex] || gallery[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          aria-hidden="true"
        />

        {/* Rectangular Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#FDFCFA] dark:bg-[#0E0E10] text-[#0A0A0A] dark:text-[#F5F5F5] border border-black/15 dark:border-[#FACC15]/30 rounded-3xl overflow-hidden shadow-2xl shadow-yellow-500/10 z-10 my-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar Header */}
          <div className="p-4 sm:p-6 border-b border-black/10 dark:border-[#262626] flex items-center justify-between shrink-0 bg-white/80 dark:bg-[#141414]/90 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#FACC15] text-[#0A0A0A] font-headline font-black text-sm flex items-center justify-center shadow-xs">
                {detail.number}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-[#EAB308] dark:text-[#FACC15] uppercase tracking-wider">
                    {detail.category}
                  </span>
                  <span className="text-black/30 dark:text-white/30 text-xs">•</span>
                  <span className="text-[10px] sm:text-xs font-mono text-[#525252] dark:text-[#A3A3A3] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#EAB308] dark:text-[#FACC15]" />
                    <span className="truncate max-w-[200px] sm:max-w-none">{detail.location}</span>
                  </span>
                </div>
                <h3 className="font-headline font-black text-xl sm:text-2xl text-[#0A0A0A] dark:text-[#F5F5F5] leading-tight">
                  {detail.title}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close details"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#0A0A0A] dark:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 no-scrollbar">
            {/* Visual Photo Showcase with Interactive Thumbnails */}
            <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-black/10 dark:border-[#262626]">
              {/* Main Photo Preview */}
              <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-black">
                <img
                  src={currentPhoto.image}
                  alt={currentPhoto.caption || detail.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-3 left-3 right-3 text-white text-xs sm:text-sm font-mono flex items-center justify-between">
                  <span className="bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 truncate max-w-[85%] font-medium">
                    📸 {currentPhoto.caption}
                  </span>
                  <span className="text-[11px] font-bold text-[#FACC15]">
                    {selectedPhotoIndex + 1} / {gallery.length}
                  </span>
                </div>
              </div>

              {/* Thumbnails Row */}
              {gallery.length > 1 && (
                <div className="p-2 sm:p-3 bg-[#111113] border-t border-white/10 flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
                  {gallery.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative w-20 sm:w-24 h-14 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        selectedPhotoIndex === idx
                          ? 'border-[#FACC15] scale-102 shadow-md'
                          : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                      }`}
                    >
                      <img src={item.image} alt={item.caption} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Section 1: Overview */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F8F8F5] dark:bg-[#141416] border border-black/10 dark:border-[#262626]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#EAB308] dark:text-[#FACC15] uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                <span>Format Overview // What Is This Workshop?</span>
              </div>
              <p className="text-sm sm:text-base text-[#262626] dark:text-[#D4D4D4] leading-relaxed font-body">
                {detail.overview}
              </p>
            </div>

            {/* Section 2: How It Will Help You (Collegiate & Career Transformation) */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#EAB308] dark:text-[#FACC15] uppercase tracking-wider mb-3">
                <Award className="w-4 h-4" />
                <span>How This Workshop Will Help You</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {detail.howItHelps.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#141416] border border-black/10 dark:border-[#262626] flex flex-col justify-between"
                  >
                    <div>
                      <span className="w-6 h-6 rounded-full bg-[#FACC15]/20 text-[#0A0A0A] dark:text-[#FACC15] font-mono font-bold text-xs flex items-center justify-center mb-3">
                        {idx + 1}
                      </span>
                      <h4 className="font-headline font-bold text-base text-[#0A0A0A] dark:text-[#F5F5F5] mb-2 leading-snug">
                        {point.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] font-body leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: What Things You Can Learn (Curriculum & Technical Stack) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F8F8F5] dark:bg-[#141416] border border-black/10 dark:border-[#262626]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#EAB308] dark:text-[#FACC15] uppercase tracking-wider mb-3">
                <GraduationCap className="w-4 h-4" />
                <span>What Things You Can Learn // Core Curriculum</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs sm:text-sm">
                {detail.whatYouLearn.map((topic, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span className="text-[#262626] dark:text-[#D4D4D4] leading-relaxed">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: How Networking Works & Student Guidance */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#FACC15]/10 via-[#F8F8F5] to-white dark:from-[#FACC15]/5 dark:via-[#141416] dark:to-[#0A0A0A] border border-[#FACC15]/30">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#EAB308] dark:text-[#FACC15] uppercase tracking-wider mb-2">
                <Users className="w-4 h-4" />
                <span>How Networking &amp; Mentorship Guidance Works</span>
              </div>
              <h4 className="font-headline font-bold text-lg text-[#0A0A0A] dark:text-[#F5F5F5] mb-3">
                {detail.networking.headline}
              </h4>
              <div className="space-y-2.5 font-mono text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3]">
                {detail.networking.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Target Audience */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#141416] border border-black/10 dark:border-[#262626] text-xs font-mono">
              <Building className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0" />
              <div>
                <span className="font-bold text-[#0A0A0A] dark:text-[#FACC15] block uppercase text-[10px]">
                  ELIGIBILITY &amp; TARGET AUDIENCE
                </span>
                <span className="text-[#525252] dark:text-[#A3A3A3]">{detail.targetAudience}</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="p-4 sm:p-6 border-t border-black/10 dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/90 dark:bg-[#141414]/90 backdrop-blur-md shrink-0">
            <span className="text-xs font-mono text-[#525252] dark:text-[#A3A3A3] text-center sm:text-left">
              Official IncuxAI Academic &amp; Collegiate Training Series
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onRegister) onRegister();
                }}
                className="flex-1 sm:flex-none py-3 px-5 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 cursor-pointer active:scale-95 transition-all"
              >
                <span>Register for Workshop</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onRequestCollege) onRequestCollege();
                }}
                className="flex-1 sm:flex-none py-3 px-5 rounded-2xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-[#0A0A0A] dark:text-white font-headline font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                Inquire for Campus
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
