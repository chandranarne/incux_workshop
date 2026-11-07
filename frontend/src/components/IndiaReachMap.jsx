import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Building, CheckCircle2, Navigation } from 'lucide-react';
import indiaExactMap from '../assets/india_exact_map_transparent.png';

export default function IndiaReachMap() {
  const [activePin, setActivePin] = useState('telangana'); // 'telangana', 'andhra', or 'both'

  const reachLocations = [
    {
      id: 'telangana',
      state: 'Telangana',
      city: 'Hyderabad & Sangareddy Hubs',
      badge: 'STATE EMBLEM // ACTIVE HUB',
      sessions: '12 Sessions Conducted',
      participants: '1,600+ Students Reached',
      institutions: [
        'IIT Hyderabad (2 Premier Campus Editions)',
        'Geethanjali College of Eng. & Tech. (5-Day Bootcamp)',
        'Hyderabad Regional Tech Leadership Sessions'
      ],
      focus: 'Agentic AI Systems, Multi-Agent LangGraph Workflows, Production LLMOps, Full-Stack AI',
      mentors: 'Mohan Sir (Senior Lead at Google, Hyderabad), Anvesh G (IIT Hyd PhD Scholar), Rakesh Sir, Rohith Sir, Saibaba Sir, Yaswanth Sir'
    },
    {
      id: 'andhra',
      state: 'Andhra Pradesh',
      city: 'Vijayawada, Guntur & Anantapur',
      badge: 'STATE EMBLEM // ACTIVE HUB',
      sessions: '9 Sessions Conducted',
      participants: '1,475+ Students Reached',
      institutions: [
        'Chalapathi Institute of Technology (JVV 500+ Auditorium Event)',
        'AI x Anantapur Police Hackathon 2k26 (Build Challenge)',
        'Vijayawada Regional Technology Hub (Practitioner Immersions)'
      ],
      focus: 'Enterprise Generative AI, Cloud Infrastructure, Real-World AI Hackathons, Enterprise Cybersecurity',
      mentors: 'Dilip Sir (Cybersecurity Lead at Walmart), Enterprise Practitioners & Hackathon Mentors'
    }
  ];

  const activeData = reachLocations.find((loc) => loc.id === activePin) || reachLocations[0];

  return (
    <div className="w-full mt-10 rounded-3xl bg-white/95 dark:bg-[#141414]/95 backdrop-blur-2xl border border-black/10 dark:border-yellow-400/30 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#FACC15]/10 dark:bg-[#FACC15]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#EAB308]/10 dark:bg-[#FACC15]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-[#262626]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FACC15]/20 dark:bg-[#1A1A1A] border border-[#FACC15]/30 text-xs font-mono text-[#0A0A0A] dark:text-[#FACC15] font-bold uppercase tracking-wider mb-2">
            <Navigation className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15]" />
            <span>Collegiate Footprint // Exact Regional Reach</span>
          </div>
          <h3 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
            IncuxAI Footprint Across Telangana &amp; Andhra Pradesh
          </h3>
          <p className="text-xs sm:text-sm font-mono text-neutral-600 dark:text-neutral-400 mt-1">
            Spread across Andhra Pradesh &amp; Telangana • 21 Total Sessions • 3,075 Students Reached
          </p>
        </div>

        {/* State Toggle Pills */}
        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
          {reachLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setActivePin(loc.id)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                activePin === loc.id
                  ? 'bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A] shadow-md shadow-black/15 dark:shadow-yellow-500/20 border border-[#0A0A0A] dark:border-[#FACC15]'
                  : 'bg-[#F8F8F5] dark:bg-[#1A1A1A] text-[#0A0A0A] dark:text-[#D4D4D4] border border-black/10 dark:border-[#262626] hover:border-[#FACC15]'
              }`}
            >
              {loc.state}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Visual + Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
        {/* Left Side: Exact India Map with IncuxAI Logos on Telangana and Andhra Pradesh */}
        <div className="lg:col-span-6 flex items-center justify-center p-4 sm:p-6 rounded-2xl bg-[#F8F8F5]/80 dark:bg-[#0A0A0A]/80 border border-black/10 dark:border-[#262626] relative overflow-hidden">
          
          {/* Exact India Map Container (1:1 Aspect) */}
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center select-none">
            
            {/* The exact India Map Image provided by the user with official state borders */}
            <img
              src={indiaExactMap}
              alt="Official Exact Map of India"
              className="w-full h-full object-contain filter drop-shadow-xl dark:brightness-110 dark:contrast-115"
            />

            {/* SVG Network Rays Layer: Showing how IncuxAI spreads out across AP & Telangana */}
            <svg
              viewBox="0 0 192 192"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <defs>
                <linearGradient id="bridgeBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FACC15" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#EAB308" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Inter-State Synapse Beam connecting Telangana and Andhra Pradesh */}
              <path
                d="M 83 115 Q 89 122 93 128"
                fill="none"
                stroke="url(#bridgeBeam)"
                strokeWidth="1.8"
                strokeDasharray="3 2"
                className="animate-pulse"
              />

              {/* Spread-out branches in Telangana: Hyderabad -> IIT Hyd & Geethanjali */}
              <line x1="83" y1="115" x2="79" y2="109" stroke="#FACC15" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.8" />
              <circle cx="79" cy="109" r="1.5" fill="#FACC15" />
              <line x1="83" y1="115" x2="88" y2="111" stroke="#FACC15" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.8" />
              <circle cx="88" cy="111" r="1.5" fill="#FACC15" />

              {/* Spread-out branches in Andhra Pradesh: Vijayawada / Guntur -> Chalapathi & Anantapur */}
              <line x1="93" y1="128" x2="100" y2="124" stroke="#FACC15" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.8" />
              <circle cx="100" cy="124" r="1.5" fill="#FACC15" />
              <line x1="93" y1="128" x2="84" y2="135" stroke="#FACC15" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.8" />
              <circle cx="84" cy="135" r="1.5" fill="#FACC15" />
              <line x1="93" y1="128" x2="98" y2="137" stroke="#FACC15" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.8" />
              <circle cx="98" cy="137" r="1.5" fill="#FACC15" />
            </svg>

            {/* PIN 1: INCUXAI LOGO PIN FOR TELANGANA STATE (Hyderabad / IIT Hyd) */}
            <div
              onClick={() => setActivePin('telangana')}
              style={{ left: '43.2%', top: '59.8%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              title="Click to view Telangana State Immersion Records"
            >
              <div className="relative flex flex-col items-center">
                {/* Radar ripple rings */}
                <span className="absolute w-12 h-12 rounded-full bg-[#FACC15]/30 animate-ping pointer-events-none" />
                <span className="absolute w-16 h-16 rounded-full border border-[#FACC15]/40 animate-pulse pointer-events-none" />

                {/* IncuxAI Logo Emblem */}
                <div className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl p-[1.5px] transition-all duration-300 group-hover:scale-125 shadow-2xl ${
                  activePin === 'telangana'
                    ? 'bg-gradient-to-tr from-[#FACC15] via-amber-300 to-white shadow-[0_0_20px_rgba(250,204,21,0.85)] scale-110'
                    : 'bg-gradient-to-tr from-[#FACC15] via-[#EAB308] to-[#0A0A0A] border border-[#FACC15]/50'
                }`}>
                  <div className="w-full h-full rounded-[9px] bg-[#0A0A0A] flex items-center justify-center">
                    <span className="font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#FEF08A] text-xs leading-none">
                      I
                    </span>
                  </div>
                </div>

                {/* Location Badge */}
                <div className={`mt-1 px-2 py-0.5 rounded-full backdrop-blur-md border text-[9px] sm:text-[10px] font-mono font-bold tracking-tight whitespace-nowrap shadow-lg flex items-center gap-1 transition-all ${
                  activePin === 'telangana'
                    ? 'bg-[#FACC15] text-[#0A0A0A] border-[#FACC15]'
                    : 'bg-[#0A0A0A]/90 text-[#FACC15] border-[#FACC15]/50 group-hover:bg-[#FACC15] group-hover:text-[#0A0A0A]'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>INCUXAI • TELANGANA</span>
                </div>
              </div>
            </div>

            {/* PIN 2: INCUXAI LOGO PIN FOR ANDHRA PRADESH STATE (Vijayawada / Guntur / Anantapur) */}
            <div
              onClick={() => setActivePin('andhra')}
              style={{ left: '48.5%', top: '67.0%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              title="Click to view Andhra Pradesh State Immersion Records"
            >
              <div className="relative flex flex-col items-center">
                {/* Radar ripple rings */}
                <span className="absolute w-12 h-12 rounded-full bg-[#FACC15]/30 animate-ping pointer-events-none" />
                <span className="absolute w-16 h-16 rounded-full border border-[#FACC15]/40 animate-pulse pointer-events-none" />

                {/* IncuxAI Logo Emblem */}
                <div className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl p-[1.5px] transition-all duration-300 group-hover:scale-125 shadow-2xl ${
                  activePin === 'andhra'
                    ? 'bg-gradient-to-tr from-[#FACC15] via-amber-300 to-white shadow-[0_0_20px_rgba(250,204,21,0.85)] scale-110'
                    : 'bg-gradient-to-tr from-[#FACC15] via-[#EAB308] to-[#0A0A0A] border border-[#FACC15]/50'
                }`}>
                  <div className="w-full h-full rounded-[9px] bg-[#0A0A0A] flex items-center justify-center">
                    <span className="font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#FEF08A] text-xs leading-none">
                      I
                    </span>
                  </div>
                </div>

                {/* Location Badge */}
                <div className={`mt-1 px-2 py-0.5 rounded-full backdrop-blur-md border text-[9px] sm:text-[10px] font-mono font-bold tracking-tight whitespace-nowrap shadow-lg flex items-center gap-1 transition-all ${
                  activePin === 'andhra'
                    ? 'bg-[#FACC15] text-[#0A0A0A] border-[#FACC15]'
                    : 'bg-[#0A0A0A]/90 text-[#FACC15] border-[#FACC15]/50 group-hover:bg-[#FACC15] group-hover:text-[#0A0A0A]'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>INCUXAI • ANDHRA PRADESH</span>
                </div>
              </div>
            </div>

            {/* Bottom Overlay Legend */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono px-2.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-white/80 pointer-events-none">
              <span className="flex items-center gap-1 text-[#FACC15] font-bold">
                <Sparkles className="w-3 h-3" />
                Spread: AP &amp; Telangana
              </span>
              <span className="text-white/60">Official State Map</span>
            </div>
          </div>
        </div>

        {/* Right Side: State Immersions Telemetry & Records Card */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeData.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              {/* State Header Card */}
              <div className="p-5 rounded-2xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-[#0A0A0A] dark:text-[#FACC15] uppercase">
                      {activeData.badge}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A] font-mono text-xs font-bold">
                    {activeData.participants}
                  </span>
                </div>

                <h4 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#0A0A0A] dark:text-[#F5F5F5]">
                  {activeData.state}
                </h4>
                <div className="flex items-center gap-3 mt-1.5 text-xs font-mono">
                  <span className="text-[#0A0A0A] dark:text-[#FACC15] font-bold">
                    {activeData.sessions}
                  </span>
                  <span className="text-neutral-400">•</span>
                  <span className="text-[#525252] dark:text-[#A3A3A3]">
                    Hubs: {activeData.city}
                  </span>
                </div>
              </div>

              {/* Campuses & Immersions Conducted */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#0A0A0A] dark:text-[#FACC15] font-bold">
                  <Building className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15]" />
                  <span>CAMPUS EDITIONS &amp; BUILD SPRINT HUBS</span>
                </div>

                <div className="space-y-2">
                  {activeData.institutions.map((inst) => (
                    <div
                      key={inst}
                      className="p-3 rounded-xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] flex items-center justify-between text-xs font-mono"
                    >
                      <span className="font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">{inst}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-black/10 dark:border-[#262626] text-xs font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-bold mb-0.5">
                    CURRICULUM &amp; SPECIALIZATIONS DELIVERED
                  </span>
                  <span className="font-semibold text-[#0A0A0A] dark:text-[#FAF6F0]">
                    {activeData.focus}
                  </span>
                </div>

                <div className="pt-2 border-t border-black/10 dark:border-[#262626] text-xs font-mono">
                  <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-bold mb-0.5">
                    ENTERPRISE TRAINERS &amp; LEADS
                  </span>
                  <span className="text-xs text-[#0A0A0A] dark:text-[#FACC15] font-semibold">
                    {activeData.mentors}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
