import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Sparkles, Code, Users, Award, BookOpen, Compass } from 'lucide-react';
import { siteConfig } from '../data/config';
import { eventPhotos, allEventPhotos } from '../data/eventPhotos';

export default function Hero({ onOpenRegistration }) {
  useEffect(() => {
    try {
      localStorage.setItem('incuxai_hero_viewed', 'true');
    } catch (e) {}
  }, []);

  const scrollToWork = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  // Divide photos into distinct sets for unique scrolling streams
  const stream1 = allEventPhotos.slice(0, 10);
  const stream2 = allEventPhotos.slice(10, 20);
  const stream3 = allEventPhotos.slice(20, 30);
  const stream4 = allEventPhotos.slice(30, 40);
  const streamHorizontal1 = allEventPhotos.slice(0, 15);
  const streamHorizontal2 = allEventPhotos.slice(15, 30);

  return (
    <section
      id="hero"
      className="relative w-full min-h-[92vh] lg:min-h-screen bg-[#FDFCFA] dark:bg-[#0A0A0A] transition-colors duration-200 overflow-hidden flex flex-col justify-between"
      aria-label="Hero Section"
    >
      {/* ========================================================================= */}
      {/* AMBIENT WATERMARK BACKGROUND PHOTO STREAMS (Full Hero Background Animation)*/}
      {/* Up-to-Down, Down-to-Up (Vertical) & Left-to-Right, Right-to-Left (Horizontal)*/}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Radial Vignettes for 100% Foreground Text Readability */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#FDFCFA]/75 to-[#FDFCFA] dark:via-[#0A0A0A]/80 dark:to-[#0A0A0A] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCFA]/90 via-transparent to-[#FDFCFA] dark:from-[#0A0A0A]/90 dark:via-transparent dark:to-[#0A0A0A] z-10 pointer-events-none" />

        {/* 1. VERTICAL STREAM 1 (Far Left): Scrolling Up to Down */}
        <div className="absolute -top-32 left-1 sm:left-6 w-36 sm:w-52 opacity-[0.20] dark:opacity-[0.14] filter grayscale contrast-125 z-0">
          <div className="animate-watermark-down flex flex-col gap-5">
            {stream1.concat(stream1).map((img, idx) => (
              <div key={`stream1-${idx}`} className="w-full h-28 sm:h-40 rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 shadow-sm bg-neutral-900 shrink-0">
                <img src={img} alt="Campus Event Photo" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 2. VERTICAL STREAM 2 (Mid-Left): Scrolling Down to Up */}
        <div className="absolute -top-24 left-[24%] sm:left-[26%] w-36 sm:w-52 opacity-[0.16] dark:opacity-[0.11] filter grayscale contrast-125 z-0 hidden md:block">
          <div className="animate-watermark-up flex flex-col gap-5">
            {stream2.concat(stream2).map((img, idx) => (
              <div key={`stream2-${idx}`} className="w-full h-28 sm:h-40 rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 shadow-sm bg-neutral-900 shrink-0">
                <img src={img} alt="Campus Event Photo" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. VERTICAL STREAM 3 (Mid-Right): Scrolling Up to Down */}
        <div className="absolute -top-36 right-[24%] sm:right-[26%] w-36 sm:w-52 opacity-[0.16] dark:opacity-[0.11] filter grayscale contrast-125 z-0 hidden lg:block">
          <div className="animate-watermark-down flex flex-col gap-5" style={{ animationDuration: '40s' }}>
            {stream3.concat(stream3).map((img, idx) => (
              <div key={`stream3-${idx}`} className="w-full h-28 sm:h-40 rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 shadow-sm bg-neutral-900 shrink-0">
                <img src={img} alt="Campus Event Photo" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 4. VERTICAL STREAM 4 (Far Right): Scrolling Down to Up */}
        <div className="absolute -top-24 right-1 sm:right-6 w-36 sm:w-52 opacity-[0.20] dark:opacity-[0.14] filter grayscale contrast-125 z-0 hidden sm:block">
          <div className="animate-watermark-up flex flex-col gap-5" style={{ animationDuration: '42s' }}>
            {stream4.concat(stream4).map((img, idx) => (
              <div key={`stream4-${idx}`} className="w-full h-28 sm:h-40 rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 shadow-sm bg-neutral-900 shrink-0">
                <img src={img} alt="Campus Event Photo" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 5. HORIZONTAL STREAM 1 (Upper Tier): Left to Right */}
        <div className="absolute top-[8%] inset-x-0 h-24 sm:h-32 opacity-[0.15] dark:opacity-[0.10] filter grayscale contrast-125 z-0 overflow-hidden">
          <div className="animate-watermark-ltr flex gap-5 w-max">
            {streamHorizontal1.concat(streamHorizontal1).map((img, idx) => (
              <div key={`h-ltr-${idx}`} className="w-44 sm:w-60 h-24 sm:h-32 rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 shadow-sm bg-neutral-900 shrink-0">
                <img src={img} alt="Campus Event Photo" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 6. HORIZONTAL STREAM 2 (Lower Tier): Right to Left */}
        <div className="absolute bottom-[14%] inset-x-0 h-24 sm:h-32 opacity-[0.15] dark:opacity-[0.10] filter grayscale contrast-125 z-0 overflow-hidden">
          <div className="animate-watermark-rtl flex gap-5 w-max">
            {streamHorizontal2.concat(streamHorizontal2).map((img, idx) => (
              <div key={`h-rtl-${idx}`} className="w-44 sm:w-60 h-24 sm:h-32 rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 shadow-sm bg-neutral-900 shrink-0">
                <img src={img} alt="Campus Event Photo" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editorial Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-6 lg:px-8 border-x border-black/10 dark:border-yellow-400/15 flex justify-between">
          <div className="w-[1px] h-full bg-black/5 dark:bg-yellow-400/10 hidden md:block" />
          <div className="w-[1px] h-full bg-black/5 dark:bg-yellow-400/10 hidden lg:block" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HERO FOREGROUND CONTENT (Centered & Editorial Framing with Impact Grid)   */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 sm:pt-24 lg:pt-28 pb-12 flex flex-col items-center text-center my-auto">
        
        {/* Subtle Pre-header Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0A0A0A]/5 dark:bg-[#FACC15]/10 border border-black/10 dark:border-[#FACC15]/30 backdrop-blur-md mb-6 shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-[#EAB308] dark:bg-[#FACC15] animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 dark:text-[#FACC15]">
            Enterprise-Grade Campus Workshops &amp; Hackathons
          </span>
        </motion.div>

        {/* Main Heading */}
        <h1 className="font-headline font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#0A0A0A] dark:text-[#F5F5F5] leading-[1.06] max-w-4xl">
          <motion.span
            custom={0}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            className="block uppercase tracking-tight text-[#0A0A0A] dark:text-[#FACC15]"
          >
            Workshops
          </motion.span>
          <motion.span
            custom={1}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            className="block text-[#0A0A0A] dark:text-[#F5F5F5] mt-1"
          >
            that turn knowledge
          </motion.span>
          <motion.span
            custom={2}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
            className="block font-light italic font-serif text-[#0A0A0A]/90 dark:text-[#F5F5F5] mt-1"
          >
            into{' '}
            <span className="not-italic font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FACC15] to-[#EAB308] dark:from-[#FACC15] dark:via-[#FEF08A] dark:to-[#FACC15]">
              real-world skills.
            </span>
          </motion.span>
        </h1>

        {/* Subtitle / Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-[#374151] dark:text-[#D4D4D4] font-normal leading-relaxed max-w-2xl"
        >
          IncuxAI bridges academic foundations and enterprise engineering demands through intensive,
          practitioner-led workshops, competitive hackathons, and global keynote lectures at universities across India.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Primary CTA: Let's Start with a Hello! -> Opens Registration */}
          <button
            onClick={() => onOpenRegistration ? onOpenRegistration('register') : scrollToWork()}
            className="group px-7 py-3.5 rounded-full bg-[#0A0A0A] hover:bg-[#1F1F1F] text-[#FACC15] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] dark:text-[#0A0A0A] font-headline font-bold text-sm uppercase tracking-wider shadow-xl shadow-black/20 dark:shadow-yellow-500/25 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#FACC15] dark:text-[#0A0A0A]" />
            <span>Let's Start with a Hello!</span>
          </button>

          {/* Secondary CTA: Explore Our Work */}
          <button
            onClick={scrollToWork}
            className="group px-7 py-3.5 rounded-full bg-white/80 dark:bg-white/10 hover:bg-black/5 dark:hover:bg-white/15 text-neutral-900 dark:text-white border border-black/15 dark:border-white/20 font-headline font-bold text-sm uppercase tracking-wider backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Explore Our Work</span>
            <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
          </button>
        </motion.div>

        {/* Live Impact Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-3xl"
        >
          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#141414]/85 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-sm">
            <span className="block font-headline font-black text-2xl sm:text-3xl text-neutral-950 dark:text-[#FACC15]">3,075+</span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mt-1 block">Verified Students</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#141414]/85 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-sm">
            <span className="block font-headline font-black text-2xl sm:text-3xl text-neutral-950 dark:text-[#FACC15]">21+</span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mt-1 block">Intensive Sessions</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#141414]/85 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-sm">
            <span className="block font-headline font-black text-2xl sm:text-3xl text-neutral-950 dark:text-[#FACC15]">10+</span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mt-1 block">Colleges &amp; Tech Hubs</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/85 dark:bg-[#141414]/85 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-sm">
            <span className="block font-headline font-black text-2xl sm:text-3xl text-neutral-950 dark:text-[#FACC15]">100%</span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mt-1 block">Industrial Sandboxes</span>
          </div>
        </motion.div>

      </div>

      {/* Ticker / Highlights Marquee at Hero Bottom */}
      <div className="relative z-20 w-full border-t border-black/10 dark:border-yellow-400/20 py-3.5 bg-white/85 dark:bg-[#0A0A0A]/85 backdrop-blur-md mt-auto">
        <div className="select-none overflow-hidden mask-gradient-x">
          <div className="flex w-max animate-marquee gap-8 sm:gap-12 px-4 text-xs font-mono font-bold tracking-wider uppercase text-[#0A0A0A]/80 dark:text-[#F5F5F5]/80">
            {[
              "3,075+ Verified Student Participants",
              "21 Specialised Technical Sessions",
              "Frontier GenAI & Agentic Architectures",
              "IIT Hyderabad Campus Cohorts",
              "Hindu College Guntur Guest Lectures",
              "Hands-on Industrial Code Sandboxes",
              "Enterprise Mentorship: Google • Walmart • Tech Mahindra • Deloitte • TCS"
            ].concat([
              "3,075+ Verified Student Participants",
              "21 Specialised Technical Sessions",
              "Frontier GenAI & Agentic Architectures",
              "IIT Hyderabad Campus Cohorts",
              "Hindu College Guntur Guest Lectures",
              "Hands-on Industrial Code Sandboxes",
              "Enterprise Mentorship: Google • Walmart • Tech Mahindra • Deloitte • TCS"
            ]).map((text, idx) => (
              <span key={idx} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                <span>{text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
