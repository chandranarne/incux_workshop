import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../data/config';
import {
  Search,
  PenTool,
  Radio,
  Rocket,
  RotateCw,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const stepIcons = [Search, PenTool, Radio, Rocket];

export default function HowWeWork() {
  const { subtitle, steps } = siteConfig.howWeWork;
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isAutoTurning, setIsAutoTurning] = useState(false);
  const sectionRef = useRef(null);

  const totalSteps = steps.length;

  const nextStep = () => {
    setActiveStepIdx((prev) => (prev + 1) % totalSteps);
  };

  const prevStep = () => {
    setActiveStepIdx((prev) => (prev - 1 + totalSteps) % totalSteps);
  };

  // Auto-rotate the cards step by step for every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIdx((prev) => (prev + 1) % totalSteps);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSteps]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute 3D circular positions for the 4 steps
  // Radius for circular orbit
  const radius = 280;

  return (
    <section
      id="how-we-work"
      ref={sectionRef}
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-16 sm:py-24 border-t border-black/10 dark:border-[#262626] overflow-hidden transition-colors duration-200 select-none"
      aria-label="How We Work"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/15 dark:bg-[#FACC15]/10 border border-[#FACC15]/30 text-xs font-mono text-neutral-900 dark:text-[#FACC15] uppercase tracking-widest mb-4 font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
              <span>Section 08 // Operational Delivery</span>
            </div>
            <h2 className="font-headline font-black text-3xl sm:text-5xl md:text-6xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight leading-tight">
              From Collaboration to <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FACC15] to-amber-500 dark:from-[#FACC15] dark:via-white dark:to-[#FEF08A]">
                Practical Learning
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Step Selector Dial Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-sm">
            {steps.map((step, idx) => (
              <button
                key={`tab-${step.step}`}
                onClick={() => setActiveStepIdx(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeStepIdx === idx
                    ? 'bg-[#FACC15] text-[#0A0A0A] font-black shadow-md shadow-yellow-500/20 scale-105'
                    : 'text-neutral-700 dark:text-[#F5F5F5] hover:text-[#FACC15] dark:hover:text-[#FACC15] hover:bg-neutral-100 dark:hover:bg-[#1A1A1A]'
                }`}
              >
                {step.step} {step.tag.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 3D CIRCULAR CAROUSEL REVOLVING STAGE */}
        <div className="relative w-full max-w-5xl mx-auto min-h-[540px] flex flex-col items-center justify-center [perspective:1800px] my-6">
          
          {/* Circular Orbit Ring in the center */}
          <div className="absolute w-[440px] sm:w-[560px] h-[440px] sm:h-[560px] rounded-full border border-[#FACC15]/20 pointer-events-none flex items-center justify-center">
            {/* Center hub */}
            <div className="w-20 h-20 rounded-full bg-[#FACC15]/5 border border-[#FACC15]/30 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#FACC15] shadow-sm" />
            </div>
            
            {/* 4 Orbital Node Markers on the Circle */}
            {[0, 1, 2, 3].map((nodeIdx) => {
              const nodeAngle = nodeIdx * 90;
              const rad = (nodeAngle * Math.PI) / 180;
              const nx = Math.cos(rad) * 220;
              const ny = Math.sin(rad) * 220;
              const isCurrent = nodeIdx === activeStepIdx;
              return (
                <div
                  key={`node-${nodeIdx}`}
                  style={{ transform: `translate(${nx}px, ${ny}px)` }}
                  className={`absolute w-4 h-4 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#FACC15] border-white dark:border-[#0A0A0A] scale-150 shadow-md shadow-yellow-500/30'
                      : 'bg-neutral-300 dark:bg-neutral-700 border-white dark:border-[#0A0A0A]'
                  }`}
                />
              );
            })}
          </div>

          {/* Cards turning in a circular way */}
          <div className="relative w-full max-w-4xl h-[420px] flex items-center justify-center">
            {steps.map((step, idx) => {
              const Icon = stepIcons[idx] || Rocket;
              // Circular offset angle relative to active step
              const stepOffset = (idx - activeStepIdx + totalSteps) % totalSteps;
              
              // Map circular stepOffset (0 = center front, 1 = right, 2 = back, 3 = left)
              let xPos = 0;
              let zPos = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 10;
              let rotateY = 0;

              if (stepOffset === 0) {
                // Front active step
                xPos = 0;
                zPos = 120;
                scale = 1.05;
                opacity = 1;
                zIndex = 30;
                rotateY = 0;
              } else if (stepOffset === 1) {
                // Right step in the circular orbit
                xPos = 260;
                zPos = -40;
                scale = 0.82;
                opacity = 0.55;
                zIndex = 20;
                rotateY = -28;
              } else if (stepOffset === 2) {
                // Back step opposite
                xPos = 0;
                zPos = -160;
                scale = 0.65;
                opacity = 0.25;
                zIndex = 10;
                rotateY = 0;
              } else if (stepOffset === 3) {
                // Left step in the circular orbit
                xPos = -260;
                zPos = -40;
                scale = 0.82;
                opacity = 0.55;
                zIndex = 20;
                rotateY = 28;
              }

              const isCurrent = stepOffset === 0;

              return (
                <motion.div
                  key={step.step}
                  animate={{
                    x: xPos,
                    z: zPos,
                    scale: scale,
                    opacity: opacity,
                    rotateY: rotateY
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [0.25, 1, 0.5, 1]
                  }}
                  style={{
                    position: 'absolute',
                    zIndex: zIndex,
                    transformStyle: 'preserve-3d'
                  }}
                  onClick={() => setActiveStepIdx(idx)}
                  className="w-[320px] sm:w-[380px] md:w-[420px] cursor-pointer"
                >
                  <div
                    className={`process-step-card flex flex-col justify-between p-8 rounded-3xl bg-white dark:bg-[#141414] border transition-all duration-300 shadow-2xl relative overflow-hidden min-h-[360px] ${
                      isCurrent
                        ? 'border-[#FACC15] ring-4 ring-[#FACC15]/20 shadow-xl shadow-yellow-500/10'
                        : 'border-black/10 dark:border-[#262626] hover:border-[#FACC15]'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15]/5 rounded-full blur-xl pointer-events-none" />

                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between text-xs font-mono mb-5">
                        <span
                          className={`font-bold text-3xl font-headline transition-colors ${
                            isCurrent
                              ? 'text-amber-600 dark:text-[#FACC15] font-black'
                              : 'text-neutral-400 dark:text-neutral-500'
                          }`}
                        >
                          {step.step}
                        </span>
                        <div
                          className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-[#FACC15]/15 border-[#FACC15]/40 text-[#FACC15] scale-110 shadow-sm'
                              : 'bg-neutral-100 dark:bg-[#0A0A0A] border-black/10 dark:border-[#262626] text-neutral-800 dark:text-neutral-200'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>

                      <span className="text-xs font-mono text-neutral-900 dark:text-[#FACC15] uppercase tracking-widest block mb-2 font-bold bg-[#FACC15]/15 dark:bg-[#FACC15]/10 px-2.5 py-1 rounded-md border border-[#FACC15]/30 w-fit">
                        {step.tag}
                      </span>

                      <h3 className="font-headline font-extrabold text-2xl sm:text-3xl text-neutral-950 dark:text-[#F5F5F5] mt-3">
                        {step.title}
                      </h3>

                      <p className="mt-3.5 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-body font-medium">
                        {step.detail}
                      </p>
                    </div>

                    <div
                      className={`relative z-10 pt-5 mt-6 border-t flex items-center justify-between text-xs font-mono font-bold transition-colors ${
                        isCurrent
                          ? 'border-black/10 dark:border-[#262626] text-neutral-900 dark:text-[#FACC15]'
                          : 'border-black/10 dark:border-[#262626] text-neutral-500'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#FACC15]" />}
                        <span>Step {step.step} of 04</span>
                      </span>
                      {isCurrent ? (
                        <span className="text-[11px] font-mono text-amber-600 dark:text-[#FACC15] uppercase tracking-wider">
                          Active Phase ●
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400 font-mono">Stage 0{step.step}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
