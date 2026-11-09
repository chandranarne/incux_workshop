import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon, User, Shield, LogIn, Sparkles } from 'lucide-react';
import { siteConfig } from '../data/config';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onOpenMenu, currentUser, onOpenAuth, onOpenPortal }) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Edge Real-Time Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none transition-all duration-75"
        style={{
          background: 'linear-gradient(90deg, #FACC15 0%, #EAB308 50%, #FBBF24 100%)',
          width: `${scrollProgress}%`,
          boxShadow: '0 0 12px rgba(250, 204, 21, 0.7)'
        }}
        aria-hidden="true"
      />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FDFCFA]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-black/10 dark:border-yellow-400/20 py-3.5 shadow-lg dark:shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Wordmark with AI Pulsing Emblem */}
          <a
            href="#hero"
            className="group flex items-center gap-3 focus-visible:outline-[#FACC15]"
            aria-label="IncuxAI Home"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FACC15] via-[#EAB308] to-[#0A0A0A] p-[1px] shadow-sm group-hover:shadow-glow-yellow transition-all">
              <div className="w-full h-full rounded-[11px] bg-[#FDFCFA] dark:bg-[#0A0A0A] flex items-center justify-center">
                <span className="font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0A0A0A] to-[#333333] dark:from-[#FACC15] dark:to-[#FEF08A] text-lg leading-none">
                  I
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-headline font-bold text-xl tracking-tighter text-[#0A0A0A] dark:text-[#F5F5F5] group-hover:text-[#EAB308] dark:group-hover:text-[#FACC15] transition-colors">
                {siteConfig.brand.wordmark}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#0A0A0A]/70 dark:text-[#FACC15]/80 uppercase -mt-1 hidden sm:block">
                Workshop Initiative
              </span>
            </div>
          </a>

          {/* Actions: Greeting Action / User Portal & Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Let's Start with a Hello! (opens Registration) or Active User Portal Button */}
            {currentUser ? (
              <button
                onClick={onOpenPortal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-mono font-bold transition-all shadow-sm cursor-pointer bg-[#FACC15]/10 hover:bg-[#FACC15]/20 dark:bg-[#FACC15]/15 dark:hover:bg-[#FACC15]/25 border-[#FACC15]/40 text-[#0A0A0A] dark:text-[#FACC15] hover:border-[#FACC15] hover:shadow-md active:scale-95"
              >
                {currentUser.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15]" />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15]" />
                )}
                <span className="max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-[#0A0A0A] text-[#0A0A0A]" />
                <span>Let's Start with a Hello!</span>
              </button>
            )}

            {/* Menu button themed in Yellow and Black */}
            <button
              onClick={onOpenMenu}
              aria-label="Open full-screen navigation menu"
              className="group flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] border border-[#0A0A0A] dark:border-[#FACC15] font-headline font-bold text-xs uppercase tracking-wider shadow-lg shadow-black/20 dark:shadow-yellow-500/20 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>Menu</span>
              <Menu className="w-4 h-4 stroke-[2.5] text-[#FACC15] dark:text-[#0A0A0A] group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
