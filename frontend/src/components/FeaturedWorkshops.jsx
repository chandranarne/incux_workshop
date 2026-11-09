import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { featuredWorkshops } from '../data/workshops';
import {
  Calendar,
  Users,
  User,
  MapPin,
  Sparkles,
  RotateCw,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';
import auditoriumImg from '../assets/auditorium_workshop.jpg';
import labImg from '../assets/hands_on_lab.jpg';
import mentorImg from '../assets/mentor_guidance.jpg';
import campusHallImg from '../assets/campus_hall_card.jpg';

gsap.registerPlugin(ScrollTrigger);

const cardPhotos = [campusHallImg, auditoriumImg, mentorImg, labImg, auditoriumImg];

function TurningWorkshopCard({ item, index }) {
  const [isTurned, setIsTurned] = useState(false);
  const cardBg = item.image || cardPhotos[index % cardPhotos.length];

  return (
    <div
      onMouseEnter={() => setIsTurned(true)}
      onMouseLeave={() => setIsTurned(false)}
      onClick={() => setIsTurned(!isTurned)}
      className="featured-card [perspective:1400px] h-[500px] w-full select-none cursor-pointer"
    >
      {/* 3D Rotating Inner Card Body */}
      <div
        style={{
          transform: isTurned ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.75s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
        className="relative w-full h-full rounded-3xl"
      >
        {/* ================= FRONT FACE ================= */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className={`absolute inset-0 rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#141414] border transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden ${
            isTurned
              ? 'border-[#FACC15] dark:border-[#FACC15] shadow-2xl shadow-yellow-500/10'
              : 'border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15]'
          }`}
        >
          {/* Authentic Workshop Photo Watermark */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-25">
            <img
              src={cardBg}
              alt={item.title}
              className="w-full h-full object-cover filter saturate-120"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-transparent dark:from-[#141414] dark:via-[#141414]/85 dark:to-transparent" />
          </div>

          {/* Oversized Ghost Watermark Number */}
          <div className="absolute top-2 right-4 text-6xl sm:text-7xl font-headline font-black text-black/[0.04] dark:text-[#FACC15]/[0.06] select-none pointer-events-none">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Top Meta */}
          <div className="relative z-10">
            <div className="flex items-center justify-between text-xs font-mono mb-3 text-neutral-600 dark:text-neutral-300">
              <span className="px-3 py-1 rounded-full bg-[#FACC15]/15 dark:bg-[#FACC15]/10 text-neutral-900 dark:text-[#FACC15] border border-[#FACC15]/30 font-bold">
                {item.badge}
              </span>
              <span className="text-neutral-900 dark:text-[#FACC15] font-bold font-mono">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <h3 className="font-headline font-black text-xl sm:text-2xl text-neutral-950 dark:text-[#F5F5F5] leading-tight line-clamp-2">
              {item.title}
            </h3>

            {item.association && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-neutral-50/90 dark:bg-[#0A0A0A]/90 border border-black/10 dark:border-[#262626] text-[11px] font-mono text-neutral-800 dark:text-neutral-200">
                <span className="text-amber-600 dark:text-[#FACC15] font-bold mr-1">Track:</span>
                {item.association}
              </div>
            )}
          </div>

          {/* Technical Facts Box */}
          <div className="relative z-10 my-2 space-y-2 py-2.5 border-y border-black/10 dark:border-[#262626] text-xs font-mono">
            <div className="flex items-start gap-2 text-neutral-800 dark:text-neutral-200">
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-[#FACC15] shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[9px] font-bold uppercase tracking-wider">
                  DATES / TIMELINE
                </span>
                <span className="font-bold text-neutral-950 dark:text-[#F5F5F5]">{item.dates}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-neutral-800 dark:text-neutral-200">
              <Users className="w-3.5 h-3.5 text-amber-600 dark:text-[#FACC15] shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[9px] font-bold uppercase tracking-wider">
                  ATTENDANCE & COHORT
                </span>
                <span className="font-bold text-neutral-950 dark:text-[#FACC15]">{item.participants} Students</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-neutral-800 dark:text-neutral-200">
              <User className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[9px] font-bold uppercase tracking-wider">
                  SPEAKER / PRACTITIONER
                </span>
                <span className="font-bold text-neutral-950 dark:text-[#F5F5F5] line-clamp-2 text-[11px]">
                  {item.speaker}
                </span>
              </div>
            </div>
          </div>

          {/* Card Location Meta & Flip Prompt */}
          <div className="relative z-10 flex items-center justify-between text-xs font-mono pt-1 text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 font-semibold truncate max-w-[210px] text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-[#FACC15] shrink-0" />
              <span className="truncate">{item.location}</span>
            </span>
            <span className="text-[10px] text-amber-600 dark:text-[#FACC15] font-bold flex items-center gap-1 group-hover:underline">
              <RotateCw className="w-3 h-3" />
              <span>Details</span>
            </span>
          </div>
        </div>

        {/* ================= BACK FACE (REVEALED WHEN TURNED) ================= */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
          className="absolute inset-0 rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#1A1A1A] via-[#111111] to-[#0A0A0A] text-[#F5F5F5] border border-[#FACC15]/40 shadow-2xl flex flex-col justify-between overflow-hidden"
        >
          {/* Back Face Header */}
          <div className="relative z-10">
            <div className="flex items-center justify-between pb-3 border-b border-[#FACC15]/20 text-xs font-mono">
              <span className="text-[#FACC15] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#FACC15]" />
                Syllabus Verification
              </span>
              <span className="bg-[#FACC15]/20 text-[#FACC15] px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-[#FACC15]/40">
                AUDITED OUTCOME
              </span>
            </div>

            <h4 className="font-headline font-black text-lg sm:text-xl text-[#F5F5F5] mt-3 leading-tight line-clamp-2">
              {item.title}
            </h4>
            <p className="text-[11px] font-mono text-[#FACC15] mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{item.location}</span>
            </p>
          </div>

          {/* Practitioner Syllabus Takeaways */}
          <div className="relative z-10 my-auto py-2 space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#FACC15] font-bold">
              Cohort Engineering Deliverables:
            </div>
            <ul className="space-y-2 text-xs font-body text-neutral-200">
              {(item.deliverables || [
                "Hands-on industrial architecture teardown & sandbox environments",
                "Direct practitioner mentoring led by enterprise leads",
                "Enduring code repositories and project capstone reviews"
              ]).map((deliv, dIdx) => (
                <li key={dIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15] shrink-0 mt-0.5" />
                  <span className="leading-snug text-[11px] sm:text-xs text-neutral-300">{deliv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Back Face Action */}
          <div className="relative z-10 pt-3 border-t border-[#FACC15]/20 flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400">
              Speaker: <strong className="text-white">{item.speaker.split('—')[0]}</strong>
            </span>
            <a
              href="#contact"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-mono text-xs font-bold shadow-md shadow-yellow-500/20 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Inquire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedWorkshops({ workshops = featuredWorkshops }) {
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".featured-card",
        { opacity: 0.3, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            once: true
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [workshops, activeCategory]);

  const categories = [
    { label: 'All Sessions', count: workshops.length },
    { label: 'Guest Lectures', count: workshops.filter(w => w.category === 'Guest Lectures' || w.badge?.includes('Guest')).length },
    { label: 'University Workshops', count: workshops.filter(w => w.category !== 'Guest Lectures' && !w.badge?.includes('Guest')).length }
  ];

  const filteredWorkshops = activeCategory === 'All Sessions'
    ? workshops
    : activeCategory === 'Guest Lectures'
    ? workshops.filter(w => w.category === 'Guest Lectures' || w.badge?.includes('Guest'))
    : workshops.filter(w => w.category !== 'Guest Lectures' && !w.badge?.includes('Guest'));

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-16 sm:py-24 border-t border-black/10 dark:border-[#262626] overflow-hidden transition-colors duration-200"
      aria-label="Featured Workshops and Guest Lectures"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/15 dark:bg-[#FACC15]/10 border border-[#FACC15]/30 text-xs font-mono text-neutral-900 dark:text-[#FACC15] uppercase tracking-widest mb-4 font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15]" />
              <span>Campus Immersions &amp; Industry Lectures</span>
            </div>
            <h2 className="font-headline font-black text-3xl sm:text-5xl md:text-6xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight leading-tight">
              Workshops That <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FACC15] to-amber-500 dark:from-[#FACC15] dark:via-white dark:to-[#FEF08A]">
                Make an Impact
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
              Specialized engineering workshops and industry guest lectures delivered at premier colleges,
              featuring enterprise leadership, high participation, and hands-on production takeaways.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {categories.map((cat) => {
              const isActive = (activeCategory === 'All' && cat.label === 'All Sessions') || activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                    isActive
                      ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] border border-[#0A0A0A] dark:border-[#FACC15] scale-105'
                      : 'bg-white dark:bg-[#141414] text-neutral-700 dark:text-neutral-300 border border-black/10 dark:border-[#262626] hover:border-[#FACC15]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-[#FACC15] text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#FACC15]'
                      : 'bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workshops & Guest Lectures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredWorkshops.map((item, idx) => (
            <TurningWorkshopCard
              key={item.id}
              item={item}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
