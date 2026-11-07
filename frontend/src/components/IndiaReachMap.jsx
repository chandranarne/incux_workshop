import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Building, CheckCircle2, Navigation, ChevronLeft, ChevronRight, School, ArrowRight } from 'lucide-react';
import indiaMapPaths from '../data/indiaMapPaths.json';

// Import all 10 cropped college logo images
import gprecLogo from '../assets/colleges/gprec.png';
import cbitLogo from '../assets/colleges/cbit.png';
import srecLogo from '../assets/colleges/srec.png';
import ksrmLogo from '../assets/colleges/ksrm.png';
import rcewLogo from '../assets/colleges/rcew.png';
import rayalaseemaLogo from '../assets/colleges/rayalaseema.png';
import altsLogo from '../assets/colleges/alts.png';
import pvkkLogo from '../assets/colleges/pvkk.png';
import sanskrithiLogo from '../assets/colleges/sanskrithi.png';
import rgmLogo from '../assets/colleges/rgm.png';

const partnerColleges = [
  {
    id: 'gprec',
    name: 'G Pulla Reddy Engineering College',
    code: 'GPREC',
    location: 'Kurnool',
    logo: gprecLogo,
    type: 'Autonomous Engineering College',
    tag: 'CAMPUS PARTNER'
  },
  {
    id: 'cbit',
    name: 'Chaitanya Bharathi Institute of Technology',
    code: 'CBIT',
    location: 'Kadapa',
    logo: cbitLogo,
    type: 'Engineering & Technology Institute',
    tag: 'CAMPUS PARTNER'
  },
  {
    id: 'srec',
    name: 'Santhiram Engineering College (SREC)',
    code: 'SREC',
    location: 'Nandyal',
    logo: srecLogo,
    type: 'Institute of Technology',
    tag: 'CAMPUS PARTNER'
  },
  {
    id: 'ksrm',
    name: 'Kandula Srinivasa Reddy Memorial College of Eng.',
    code: 'KSRM CE',
    location: 'Kadapa',
    logo: ksrmLogo,
    type: 'Autonomous Engineering College',
    tag: 'CAMPUS PARTNER'
  },
  {
    id: 'rcew',
    name: 'Ravindra College of Engineering for Women',
    code: 'RCEW',
    location: 'Kurnool',
    logo: rcewLogo,
    type: "Women's Engineering College",
    tag: 'CAMPUS PARTNER'
  },
  {
    id: 'rayalaseema',
    name: 'Rayalaseema University',
    code: 'RU',
    location: 'Kurnool',
    logo: rayalaseemaLogo,
    type: 'State University Campus',
    tag: 'UNIVERSITY PARTNER'
  },
  {
    id: 'alts',
    name: 'Sri Lakshmi Institute of Technology & Sciences (ALTS)',
    code: 'ALTS',
    location: 'Kadapa',
    logo: altsLogo,
    type: 'Autonomous Institute',
    tag: 'CAMPUS PARTNER'
  },
  {
    id: 'pvkk',
    name: 'PVKK Institute of Technology',
    code: 'PVKK IT',
    location: 'Anantapuramu',
    logo: pvkkLogo,
    type: 'Institute of Technology',
    tag: 'CAMPUS PARTNER'
  },
  {
    id: 'sanskrithi',
    name: 'Sanskrithi Group of Institutions',
    code: 'SANSKRITHI',
    location: 'Puttaparthi',
    logo: sanskrithiLogo,
    type: 'Group of Institutions',
    tag: 'CAMPUS PARTNER'
  },
  {
    id: 'rgm',
    name: 'Rajeev Gandhi Memorial College of Eng. & Tech.',
    code: 'RGMCET',
    location: 'Nandyal',
    logo: rgmLogo,
    type: 'Autonomous Engineering College',
    tag: 'CAMPUS PARTNER'
  }
];

export default function IndiaReachMap() {
  const [activeCollegeIdx, setActiveCollegeIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef(null);

  // Auto-cycle the spotlight card one by one every 3.2 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveCollegeIdx((prev) => (prev + 1) % partnerColleges.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeCollege = partnerColleges[activeCollegeIdx];

  const handleNext = () => {
    setActiveCollegeIdx((prev) => (prev + 1) % partnerColleges.length);
  };

  const handlePrev = () => {
    setActiveCollegeIdx((prev) => (prev - 1 + partnerColleges.length) % partnerColleges.length);
  };

  return (
    <div className="w-full mt-10 rounded-3xl bg-white/95 dark:bg-[#141414]/95 backdrop-blur-2xl border border-black/10 dark:border-yellow-400/30 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 dark:bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#EAB308]/10 dark:bg-[#FACC15]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Map Header */}
      <div className="pb-6 border-b border-black/10 dark:border-[#262626]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 dark:bg-sky-950/40 border border-sky-400/30 text-xs font-mono text-sky-700 dark:text-sky-300 font-bold uppercase tracking-wider mb-2">
          <Navigation className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
          <span>National Footprint</span>
        </div>
        <h3 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
          INCUXAI FOOTPRINT ACROSS INDIA
        </h3>
      </div>

      {/* Interactive Map Visual + Colleges Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
        
        {/* Left Side: 4K Vector SVG India Map (Dark Blue Base + Light Blue AP & Telangana) */}
        <div className="lg:col-span-6 flex items-center justify-center p-4 sm:p-6 rounded-2xl bg-[#090d16] border border-black/10 dark:border-[#262626] relative overflow-hidden shadow-inner">
          
          {/* Subtle Grid / Technical Background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Exact Aspect Vector Map Container */}
          <div className="relative w-full max-w-[420px] aspect-[850/964] flex items-center justify-center select-none">
            
            {/* SVG Vector Map of India */}
            <svg
              viewBox="55.07 -2 849.87 964"
              className="w-full h-full filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Glow Filter for Active States */}
                <filter id="glowLightBlue" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="activeLightBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="synapseBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Render all states */}
              <g id="india-states-layer">
                {indiaMapPaths.map((state) => {
                  const isTelangana = state.id === 'IN-TG';
                  const isAndhra = state.id === 'IN-AP';
                  const isHighlight = isTelangana || isAndhra;

                  let fill = '#0a192f'; // Dark blue base map
                  let stroke = '#1e3a8a'; // Medium dark blue borders
                  let strokeWidth = '0.7';

                  if (isHighlight) {
                    fill = '#38bdf8'; // Light blue inside
                    stroke = '#bae6fd'; // Bright light blue border
                    strokeWidth = '1.6';
                  }

                  return (
                    <path
                      key={state.id}
                      id={state.id}
                      data-name={state.name}
                      d={state.d}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      className={isHighlight ? 'transition-all duration-300 hover:brightness-125' : 'transition-colors duration-200'}
                      filter={isHighlight ? 'url(#glowLightBlue)' : undefined}
                    >
                      <title>{state.name}</title>
                    </path>
                  );
                })}
              </g>

              {/* Dynamic Connecting Synapse Beam between Telangana (372, 638) and Andhra Pradesh (435, 692) */}
              <path
                d="M 372 638 Q 400 660 435 692"
                fill="none"
                stroke="url(#synapseBeamGrad)"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                className="animate-pulse"
              />

              {/* Subtle Regional Radial Nodes */}
              <circle cx="372" cy="638" r="6" fill="#38bdf8" fillOpacity="0.5" className="animate-ping" />
              <circle cx="372" cy="638" r="3" fill="#ffffff" />
              
              <circle cx="435" cy="692" r="6" fill="#38bdf8" fillOpacity="0.5" className="animate-ping" />
              <circle cx="435" cy="692" r="3" fill="#ffffff" />
            </svg>

            {/* PIN 1: INCUXAI LOGO PIN FOR TELANGANA STATE (Hyderabad / IIT Hyd) */}
            <div
              style={{ left: '37.3%', top: '66.4%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <div className="relative flex flex-col items-center">
                {/* Radar ripple rings */}
                <span className="absolute w-12 h-12 rounded-full bg-sky-400/40 animate-ping pointer-events-none" />
                <span className="absolute w-16 h-16 rounded-full border border-sky-400/50 animate-pulse pointer-events-none" />

                {/* IncuxAI Logo Emblem */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl p-[1.5px] shadow-2xl bg-gradient-to-tr from-sky-400 via-sky-200 to-white shadow-[0_0_20px_rgba(56,189,248,0.9)] scale-105">
                  <div className="w-full h-full rounded-[9px] bg-[#0A0A0A] flex items-center justify-center">
                    <span className="font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-100 text-xs leading-none">
                      I
                    </span>
                  </div>
                </div>

                {/* Location Badge */}
                <div className="mt-1 px-2 py-0.5 rounded-full backdrop-blur-md border text-[9px] sm:text-[10px] font-mono font-bold tracking-tight whitespace-nowrap shadow-lg flex items-center gap-1 bg-sky-500 text-white border-sky-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>INCUXAI • TELANGANA</span>
                </div>
              </div>
            </div>

            {/* PIN 2: INCUXAI LOGO PIN FOR ANDHRA PRADESH STATE (Vijayawada / Guntur / Anantapur) */}
            <div
              style={{ left: '44.7%', top: '72.0%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <div className="relative flex flex-col items-center">
                {/* Radar ripple rings */}
                <span className="absolute w-12 h-12 rounded-full bg-sky-400/40 animate-ping pointer-events-none" />
                <span className="absolute w-16 h-16 rounded-full border border-sky-400/50 animate-pulse pointer-events-none" />

                {/* IncuxAI Logo Emblem */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl p-[1.5px] shadow-2xl bg-gradient-to-tr from-sky-400 via-sky-200 to-white shadow-[0_0_20px_rgba(56,189,248,0.9)] scale-105">
                  <div className="w-full h-full rounded-[9px] bg-[#0A0A0A] flex items-center justify-center">
                    <span className="font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-100 text-xs leading-none">
                      I
                    </span>
                  </div>
                </div>

                {/* Location Badge */}
                <div className="mt-1 px-2 py-0.5 rounded-full backdrop-blur-md border text-[9px] sm:text-[10px] font-mono font-bold tracking-tight whitespace-nowrap shadow-lg flex items-center gap-1 bg-sky-500 text-white border-sky-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>INCUXAI • ANDHRA PRADESH</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 10 Participating Colleges One-by-One Scrolling Showcase */}
        <div 
          className="lg:col-span-6 flex flex-col justify-between space-y-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Header Line Requested by User Above the College Showcase */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF9C3] dark:bg-yellow-950/40 border border-yellow-400/40 text-xs font-mono font-bold text-neutral-900 dark:text-[#FACC15] uppercase tracking-wider mb-2.5">
              <School className="w-3.5 h-3.5 text-amber-600 dark:text-[#FACC15]" />
              <span>Collegiate Network</span>
            </div>
            
            <h4 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight leading-snug">
              Students attended across every corner from India
            </h4>
            <p className="text-xs sm:text-sm font-mono text-neutral-600 dark:text-neutral-400 mt-1.5 leading-relaxed">
              Engineering students, researchers, and campus cohorts from top institutions who participated across IncuxAI workshops and hackathons.
            </p>
          </div>

          {/* Interactive One-by-One Spotlight Card */}
          <div className="relative rounded-3xl p-5 sm:p-6 bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] shadow-xl overflow-hidden">
            {/* Top Indicator & Nav Controls */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/10 dark:border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-[#0A0A0A] dark:text-[#FACC15]">
                  COLLEGE {String(activeCollegeIdx + 1).padStart(2, '0')} OF {String(partnerColleges.length).padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous college"
                  className="w-8 h-8 rounded-full bg-white dark:bg-[#1E1E1E] hover:bg-[#FACC15] hover:text-[#0A0A0A] text-neutral-700 dark:text-neutral-300 border border-black/10 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next college"
                  className="w-8 h-8 rounded-full bg-white dark:bg-[#1E1E1E] hover:bg-[#FACC15] hover:text-[#0A0A0A] text-neutral-700 dark:text-neutral-300 border border-black/10 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active College Card with Smooth Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCollege.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-5"
              >
                {/* Authentic College Logo Image Container */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl bg-white p-2.5 flex items-center justify-center border-2 border-black/10 shadow-md overflow-hidden">
                  <img
                    src={activeCollege.logo}
                    alt={activeCollege.name}
                    className="w-full h-full object-contain filter contrast-105"
                  />
                </div>

                {/* College Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold mb-2">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{activeCollege.tag}</span>
                  </div>
                  
                  <h5 className="font-headline font-black text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] leading-snug">
                    {activeCollege.name}
                  </h5>

                  <div className="mt-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 space-y-1">
                    <p><span className="text-neutral-400">Campus Hub:</span> <strong className="text-neutral-800 dark:text-neutral-200">{activeCollege.location}</strong></p>
                    <p><span className="text-neutral-400">Category:</span> {activeCollege.type}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress / Step Indicators for all 10 colleges */}
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-5 pt-4 border-t border-black/10 dark:border-white/10 flex-wrap">
              {partnerColleges.map((col, idx) => (
                <button
                  key={col.id}
                  onClick={() => setActiveCollegeIdx(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeCollegeIdx === idx
                      ? 'w-6 bg-sky-500 dark:bg-sky-400'
                      : 'w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400'
                  }`}
                  title={col.name}
                />
              ))}
            </div>
          </div>

          {/* Continuous Smooth Horizontal Marquee of All 10 Colleges */}
          <div className="relative rounded-2xl bg-neutral-100/80 dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] p-3 overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2 px-1">
              <span className="flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3 text-[#EAB308] dark:text-[#FACC15]" />
                <span>Some of the Participating Colleges</span>
              </span>
              <span className="text-[10px] text-neutral-400">Click logo to view</span>
            </div>

            {/* Scrolling Track */}
            <div className="relative overflow-hidden w-full">
              <div className="flex gap-3 animate-marquee hover:[animation-play-state:paused] w-max py-1">
                {[...partnerColleges, ...partnerColleges].map((col, i) => (
                  <button
                    key={`${col.id}-${i}`}
                    type="button"
                    onClick={() => setActiveCollegeIdx(i % partnerColleges.length)}
                    className={`px-3 py-2 rounded-xl flex items-center gap-2.5 bg-white dark:bg-[#141414] border transition-all cursor-pointer shrink-0 shadow-xs hover:scale-105 ${
                      activeCollegeIdx === (i % partnerColleges.length)
                        ? 'border-sky-400 ring-2 ring-sky-400/30'
                        : 'border-black/10 dark:border-[#262626] hover:border-black/30'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 border border-black/5">
                      <img src={col.logo} alt={col.code} className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left font-mono text-xs">
                      <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5] block leading-tight">{col.code}</span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block leading-tight">{col.location}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
