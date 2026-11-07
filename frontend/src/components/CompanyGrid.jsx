import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  BookOpen,
  Sparkles,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { companiesData } from '../data/companies';
import {
  GoogleLogo,
  MicrosoftLogo,
  WalmartLogo,
  DeloitteLogo,
  TCSLogo,
  GenpactLogo,
  JohnsonAndJohnsonLogo,
  TechMahindraLogo
} from './CompanyLogos';

const logoMap = {
  Google: GoogleLogo,
  Walmart: WalmartLogo,
  Microsoft: MicrosoftLogo,
  Deloitte: DeloitteLogo,
  TCS: TCSLogo,
  Genpact: GenpactLogo,
  "Johnson & Johnson": JohnsonAndJohnsonLogo,
  "Tech Mahindra": TechMahindraLogo
};

export default function CompanyGrid({ data = companiesData }) {
  const { headline, disclaimer, companies } = data;
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const bookRef = useRef(null);
  const lastTurnTimeRef = useRef(0);

  const totalPages = companies.length;
  const currentCompany = companies[currentPage] || companies[0];
  const LogoComponent = logoMap[currentCompany.name];

  const goToPage = (pageIndex) => {
    if (pageIndex === currentPage) return;
    setDirection(pageIndex > currentPage ? 1 : -1);
    setCurrentPage(pageIndex);
  };

  const nextPage = () => {
    const now = Date.now();
    if (now - lastTurnTimeRef.current < 450) return; // Prevent over-rapid firing
    lastTurnTimeRef.current = now;
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    const now = Date.now();
    if (now - lastTurnTimeRef.current < 450) return;
    lastTurnTimeRef.current = now;
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Keyboard navigation for page turning
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  // Auto-rotate the book pages every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 3000);
    return () => clearInterval(timer);
  }, [totalPages]);

  return (
    <section
      id="industry"
      ref={bookRef}
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-16 md:py-24 border-t border-black/10 dark:border-yellow-400/20 overflow-hidden transition-colors duration-200"
      aria-label="Industry Connections"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#141414]/90 border border-black/10 dark:border-yellow-400/30 text-xs font-mono text-[#0A0A0A] dark:text-[#FACC15] uppercase tracking-widest mb-4 font-bold shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15]" />
            <span>Section 04 // Practitioner Pedigree</span>
          </div>

          <h2 className="font-headline font-black text-3xl sm:text-5xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight leading-tight">
            {headline}
          </h2>

          <p className="mt-4 text-2xl sm:text-3xl font-headline font-bold text-[#EAB308] dark:text-[#FACC15]">
            Our Collaborations
          </p>
        </div>

        {/* 3D BOOK SHOWCASE CONTAINER */}
        <div className="relative mx-auto max-w-5xl [perspective:1800px]">
          {/* Main Book Shell */}
          <div className="relative rounded-3xl bg-[#F8F8F5] dark:bg-[#0D0D0D] p-2 sm:p-4 border border-black/10 dark:border-[#262626] shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px] rounded-2xl overflow-hidden bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-xl">
              
              {/* LEFT PAGE: Folio Index (Auto-rotates every 3 seconds) */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/10 dark:border-[#262626] bg-[#F8F8F5] dark:bg-[#111111] relative">
                {/* Book Gutter Shadow on the right edge */}
                <div className="hidden lg:block absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/15 to-transparent pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-[#262626]">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0A0A0A] dark:text-[#FACC15] flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 fill-current text-[#EAB308] dark:text-[#FACC15]" />
                      Index
                    </span>
                    <span className="text-xs font-mono font-bold text-[#0A0A0A] dark:text-[#FACC15] bg-[#FACC15]/20 dark:bg-[#1A1A1A] px-2.5 py-1 rounded-full border border-[#FACC15]/30">
                      PAGE 0{currentPage + 1} // 0{totalPages}
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-4 tracking-tight">
                    Industry Records
                  </h3>
                  <p className="text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                    Corporate practitioner backgrounds.
                  </p>

                  {/* Bookmark Navigation Links (8 Companies) */}
                  <div className="mt-5 space-y-1.5">
                    {companies.map((c, idx) => {
                      const isActive = idx === currentPage;
                      return (
                        <button
                          key={c.name}
                          onClick={() => goToPage(idx)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left font-mono text-xs transition-all duration-300 cursor-pointer ${
                            isActive
                              ? 'bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A] font-bold border border-[#0A0A0A] dark:border-[#FACC15] shadow-sm translate-x-1.5'
                              : 'text-[#0A0A0A] dark:text-[#D4D4D4] hover:bg-black/5 dark:hover:bg-[#1C1C1C] hover:translate-x-1 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 text-[11px] opacity-70">0{idx + 1}</span>
                            <span className="font-headline font-semibold text-sm">
                              {c.name}
                            </span>
                          </div>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] text-[#FACC15] dark:text-[#0A0A0A] font-bold">
                              ACTIVE
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-black/10 dark:border-[#262626] text-xs font-mono text-[#525252] dark:text-[#A3A3A3] flex items-center justify-between">
                  <span className="font-semibold">Featured Industry Partners</span>
                  <span className="font-bold text-[#0A0A0A] dark:text-[#FACC15]">0{currentPage + 1} / 0{totalPages}</span>
                </div>
              </div>

              {/* RIGHT PAGE: ONLY Company Name & Logo */}
              <div 
                className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-between bg-white dark:bg-[#141414] relative overflow-hidden [perspective:1200px]"
              >
                {/* Book Gutter Shadow on the left edge */}
                <div className="hidden lg:block absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-black/15 to-transparent pointer-events-none z-20" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{
                      rotateY: direction > 0 ? 70 : -70,
                      opacity: 0,
                      transformOrigin: direction > 0 ? 'left center' : 'right center'
                    }}
                    animate={{
                      rotateY: 0,
                      opacity: 1,
                      transformOrigin: 'center center'
                    }}
                    exit={{
                      rotateY: direction > 0 ? -70 : 70,
                      opacity: 0,
                      transformOrigin: direction > 0 ? 'right center' : 'left center'
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col justify-between h-full relative z-10 my-auto"
                  >
                    {/* Page Top Minimal Meta */}
                    <div className="flex items-center justify-between pb-6 border-b border-black/10 dark:border-[#262626]">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FACC15]/20 dark:bg-[#1A1A1A] border border-[#FACC15]/40 text-[#0A0A0A] dark:text-[#FACC15] font-mono text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15]" />
                        <span>RECORD 0{currentPage + 1} OF 0{totalPages}</span>
                      </div>
                      <span className="font-mono text-xs text-[#525252] dark:text-[#A3A3A3] font-semibold">
                        INCUXAI INDUSTRY PEDIGREE
                      </span>
                    </div>

                    {/* ONLY COMPANY LOGO & NAME */}
                    <div className="my-auto py-12 flex flex-col items-center justify-center text-center">
                      {/* Prominent, Centered Official Logo */}
                      <div className="p-8 sm:p-10 rounded-3xl bg-[#F8F8F5] dark:bg-[#1A1A1A] border border-black/10 dark:border-[#262626] inline-flex items-center justify-center shadow-lg mb-8 hover:scale-105 transition-transform duration-300">
                        {LogoComponent && (
                          <div className="scale-125 sm:scale-150 transform">
                            <LogoComponent />
                          </div>
                        )}
                      </div>

                      {/* Prominent Company Name */}
                      <h3 className="font-headline font-black text-4xl sm:text-5xl md:text-6xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight leading-tight">
                        {currentCompany.name}
                      </h3>
                    </div>

                    {/* Page Footer Navigation Cue */}
                    <div className="pt-6 border-t border-black/10 dark:border-[#262626] flex items-center justify-between text-xs font-mono text-[#525252] dark:text-[#A3A3A3]">
                      <span>PAGE {currentPage + 1} OF {totalPages}</span>
                      <span className="text-[#0A0A0A] dark:text-[#FACC15] font-bold font-mono">
                        INCUXAI PARTNER NETWORK
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
