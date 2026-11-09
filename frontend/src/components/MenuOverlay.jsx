import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Sparkles, User, Shield, Sun, Moon, LogIn } from 'lucide-react';
import { siteConfig } from '../data/config';
import { useTheme } from '../context/ThemeContext';
import incuxaiLogo from '../assets/incuxai_official_logo.jpg';

export default function MenuOverlay({ isOpen, onClose, onOpenAuth, onOpenPortal, currentUser }) {
  const closeBtnRef = useRef(null);
  const { isDark, toggleTheme } = useTheme();

  // Lock background scroll when open & handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeBtnRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLinkClick = (href) => {
    onClose();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.15
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 bg-[#FDFCFA]/98 dark:bg-[#0A0A0A]/98 backdrop-blur-3xl flex flex-col justify-between p-5 sm:p-10 md:p-16 overflow-y-auto"
        >
          {/* Ambient background glow */}
          <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#FACC15]/10 dark:bg-[#FACC15]/20 blur-[140px] pointer-events-none rounded-full" />

          {/* Top Header inside overlay: Clean & Spaced for Mobile */}
          <div className="relative z-10 flex items-center justify-between border-b border-black/10 dark:border-yellow-400/20 pb-4 sm:pb-6">
            <a
              href="#hero"
              onClick={() => handleLinkClick('#hero')}
              className="font-headline font-bold text-xl sm:text-2xl tracking-tighter text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-black/10 dark:border-white/15 bg-white shrink-0 shadow-xs">
                <img src={incuxaiLogo} alt="IncuxAI Logo" className="w-full h-full object-cover" />
              </div>
              <span>{siteConfig.brand.wordmark}</span>
            </a>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Mode Toggle */}
              <button
                onClick={toggleTheme}
                type="button"
                aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-full border text-xs font-mono font-bold transition-all bg-black/5 dark:bg-[#141414] border-black/15 dark:border-yellow-400/30 text-[#0A0A0A] dark:text-[#FACC15] hover:border-[#FACC15] cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#FACC15]" />
                    <span className="hidden xs:inline">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#0A0A0A]" />
                    <span className="hidden xs:inline">Dark Mode</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <motion.button
                ref={closeBtnRef}
                onClick={onClose}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close menu"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/5 dark:bg-[#141414] border border-black/10 dark:border-yellow-400/30 text-[#0A0A0A] dark:text-[#FACC15] hover:bg-[#FACC15] hover:text-[#0A0A0A] transition-colors duration-200 flex items-center justify-center cursor-pointer shadow-sm shrink-0"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Center Nav Links - Staggered Motion */}
          <nav className="relative z-10 my-auto py-6 sm:py-8">
            <motion.ul
              variants={navListVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2.5 sm:space-y-4"
            >
              {siteConfig.navigation.map((item, idx) => (
                <motion.li key={item.label} variants={navItemVariants} className="overflow-hidden">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.href);
                    }}
                    className="group flex items-center justify-between py-1 text-3xl sm:text-5xl md:text-6xl font-headline font-bold text-[#0A0A0A] dark:text-[#F5F5F5] hover:text-[#EAB308] dark:hover:text-[#FACC15] transition-all tracking-tight"
                  >
                    <span className="flex items-center gap-3 sm:gap-6">
                      <span className="text-xs sm:text-sm font-mono text-[#EAB308] dark:text-[#FACC15] font-bold">
                        0{idx + 1}
                      </span>
                      <span className="group-hover:translate-x-2 sm:group-hover:translate-x-3 transition-transform duration-200">
                        {item.label}
                      </span>
                    </span>
                    <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200 text-[#EAB308] dark:text-[#FACC15]" />
                  </a>
                </motion.li>
              ))}

              {/* Portal / Registration Action Inside Menu */}
              <motion.li variants={navItemVariants} className="pt-4 sm:pt-6 border-t border-black/10 dark:border-yellow-400/20">
                {currentUser ? (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPortal();
                    }}
                    className="w-full text-left py-2 text-xl sm:text-2xl font-headline font-bold text-[#0A0A0A] dark:text-[#FACC15] flex items-center justify-between cursor-pointer"
                  >
                    <span>Open {currentUser.role === 'admin' ? 'Admin Hub' : 'Candidate Portal'}</span>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#FACC15]/15 border border-[#FACC15]/40 text-[#0A0A0A] dark:text-[#FACC15] font-bold">
                      Active
                    </span>
                  </button>
                ) : (
                  <div className="py-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuth('register');
                      }}
                      className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-bold text-sm uppercase tracking-wider shadow-lg shadow-yellow-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 fill-[#0A0A0A]" />
                      <span>Let's Start with a Hello!</span>
                    </button>
                  </div>
                )}
              </motion.li>
            </motion.ul>
          </nav>

          {/* Bottom Footer inside overlay */}
          <div className="relative z-10 pt-4 sm:pt-6 border-t border-black/10 dark:border-yellow-400/20 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 text-xs font-mono">
            <div>
              <span className="text-black/60 dark:text-yellow-400/70 block mb-0.5 font-bold text-[10px] sm:text-[11px] tracking-wider uppercase">
                DIRECT INQUIRY &amp; MOBILE
              </span>
              <p className="text-[#0A0A0A] dark:text-[#F5F5F5] text-xs sm:text-sm font-semibold">
                info@incuxai.com • +91 7665061289
              </p>
            </div>
            <div className="flex items-center justify-start md:justify-end gap-2 text-[#EAB308] dark:text-[#FACC15]">
              <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
              <span className="text-[#0A0A0A] dark:text-[#F5F5F5] font-medium text-xs sm:text-sm">
                IncuxAI Workshop Initiative 2026
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
