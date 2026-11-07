import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Sparkles, User, Shield } from 'lucide-react';
import { siteConfig } from '../data/config';

export default function MenuOverlay({ isOpen, onClose, onOpenAuth, onOpenPortal, currentUser }) {
  const closeBtnRef = useRef(null);

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
          className="fixed inset-0 z-50 bg-[#FDFCFA]/98 dark:bg-[#0A0A0A]/98 backdrop-blur-3xl flex flex-col justify-between p-6 sm:p-12 md:p-16 overflow-y-auto"
        >
          {/* Ambient background glow */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FACC15]/10 dark:bg-[#FACC15]/20 blur-[140px] pointer-events-none rounded-full" />

          {/* Top Header inside overlay */}
          <div className="relative z-10 flex items-center justify-between border-b border-black/10 dark:border-yellow-400/20 pb-6">
            <a
              href="#hero"
              onClick={() => handleLinkClick('#hero')}
              className="font-headline font-bold text-2xl tracking-tighter text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center gap-2"
            >
              {siteConfig.brand.wordmark}
            </a>

            <div className="flex items-center gap-4">
              <motion.button
                ref={closeBtnRef}
                onClick={onClose}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close menu"
                className="w-12 h-12 rounded-full bg-black/5 dark:bg-[#141414] border border-black/10 dark:border-yellow-400/30 text-[#0A0A0A] dark:text-[#FACC15] hover:bg-[#FACC15] hover:text-[#0A0A0A] transition-colors duration-200 flex items-center justify-center cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Center Nav Links - Staggered Motion */}
          <nav className="relative z-10 my-auto py-8">
            <motion.ul
              variants={navListVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 sm:space-y-5"
            >
              {siteConfig.navigation.map((item, idx) => (
                <motion.li key={item.label} variants={navItemVariants} className="overflow-hidden">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.href);
                    }}
                    className="group flex items-center justify-between py-1.5 text-4xl sm:text-6xl md:text-7xl font-headline font-bold text-[#0A0A0A] dark:text-[#F5F5F5] hover:text-[#EAB308] dark:hover:text-[#FACC15] transition-all tracking-tight"
                  >
                    <span className="flex items-center gap-4 sm:gap-6">
                      <span className="text-xs sm:text-sm font-mono text-[#EAB308] dark:text-[#FACC15] font-bold">
                        0{idx + 1}
                      </span>
                      <span className="group-hover:translate-x-3 transition-transform duration-200">
                        {item.label}
                      </span>
                    </span>
                    <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200 text-[#EAB308] dark:text-[#FACC15]" />
                  </a>
                </motion.li>
              ))}

              {/* Portal Action Inside Menu */}
              <motion.li variants={navItemVariants} className="pt-6 border-t border-black/10 dark:border-yellow-400/20">
                {currentUser ? (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPortal();
                    }}
                    className="w-full text-left py-2 text-2xl sm:text-3xl font-headline font-bold text-[#0A0A0A] dark:text-[#FACC15] flex items-center justify-between cursor-pointer"
                  >
                    <span>Open {currentUser.role === 'admin' ? 'Admin Hub' : 'Candidate Portal'}</span>
                    <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-[#FACC15]/15 border border-[#FACC15]/40 text-[#0A0A0A] dark:text-[#FACC15] font-bold">
                      Active Session
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-4 py-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuth('candidate');
                      }}
                      className="px-6 py-3.5 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-bold text-sm uppercase tracking-wider shadow-lg shadow-yellow-500/25 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Candidate Login / Register</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuth('admin');
                      }}
                      className="px-5 py-3.5 rounded-full bg-black/5 dark:bg-[#141414] border border-black/15 dark:border-yellow-400/30 text-[#0A0A0A] dark:text-[#FACC15] hover:border-[#FACC15] text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 transition-all"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15]" />
                      <span>Admin Login</span>
                    </button>
                  </div>
                )}
              </motion.li>
            </motion.ul>
          </nav>

          {/* Bottom Footer inside overlay */}
          <div className="relative z-10 pt-6 border-t border-black/10 dark:border-yellow-400/20 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            <div>
              <span className="text-black/60 dark:text-yellow-400/70 block mb-1 font-bold text-[11px] tracking-wider uppercase">
                DIRECT INQUIRY &amp; MOBILE
              </span>
              <p className="text-[#0A0A0A] dark:text-[#F5F5F5] text-sm font-semibold">
                info@incuxai.com • +91 7665061289
              </p>
            </div>
            <div className="flex items-center justify-start md:justify-end gap-2 text-[#EAB308] dark:text-[#FACC15]">
              <Sparkles className="w-4 h-4 text-[#FACC15]" />
              <span className="text-[#0A0A0A] dark:text-[#F5F5F5] font-medium text-sm">
                IncuxAI Workshop Initiative 2026
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
