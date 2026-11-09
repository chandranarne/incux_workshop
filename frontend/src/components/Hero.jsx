import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownRight, ChevronDown, ChevronLeft, ChevronRight, Eye, Grid, Sparkles, MapPin, Users } from 'lucide-react';
import { siteConfig } from '../data/config';
import realCampusCohort from '../assets/real_campus_cohort.jpg';
import realHandsOnLab from '../assets/real_hands_on_lab.jpg';
import realHackathon2k26 from '../assets/real_hackathon_2k26.jpg';
import realStageCertifications from '../assets/real_stage_certifications.jpg';
import realStaircaseSprint from '../assets/real_staircase_sprint.jpg';
import guestLectureSpeakerImg from '../assets/guest_lecture_speaker.jpg';
import aiPresentationSpeakerImg from '../assets/ai_presentation_speaker.jpg';
import campusOutdoorCohortImg from '../assets/campus_outdoor_cohort.jpg';
import staircaseCohortImg from '../assets/staircase_group_cohort.jpg';
import staircaseWideImg from '../assets/staircase_group_wide.jpg';

// Watermark photos array for ambient background streams
const watermarkPhotos = [
  guestLectureSpeakerImg,
  campusOutdoorCohortImg,
  aiPresentationSpeakerImg,
  staircaseCohortImg,
  staircaseWideImg,
  realCampusCohort,
  realHandsOnLab,
  realHackathon2k26,
  realStageCertifications,
  realStaircaseSprint
];

// Real authentic workshop photographs provided by the user with asymmetric editorial layout parameters
const workshopGallery = [
  {
    id: 1,
    image: aiPresentationSpeakerImg,
    category: "GENERATIVE AI",
    tag: "CAMPUS MASTERCLASS",
    number: "01",
    title: "Generative AI & Career Opportunities",
    location: "Hindu College of Engineering & Tech, Guntur",
    highlight: "150 Engineers • Tech Mahindra Speaker",
    desktopClass: "w-[88%] sm:w-[82%] max-w-[460px] h-[300px] self-start lg:ml-[5%] xl:ml-[8%]"
  },
  {
    id: 2,
    image: guestLectureSpeakerImg,
    category: "CORE ENGINEERING",
    tag: "LIVE CLASSROOM SESSION",
    number: "02",
    title: "Java Programming Fundamentals",
    location: "Hindu College of Engineering & Tech, Guntur",
    highlight: "65 Students • Backend Developer Lead",
    desktopClass: "w-[88%] sm:w-[82%] max-w-[460px] h-[300px] self-end lg:mr-[4%] xl:mr-[8%]"
  },
  {
    id: 3,
    image: campusOutdoorCohortImg,
    category: "CAMPUS FOOTPRINT",
    tag: "COLLEGIATE COHORT",
    number: "03",
    title: "NLP & Enterprise Systems Cohort",
    location: "Campus Technical Auditoriums",
    highlight: "Deloitte & TCS Industry Mentors",
    desktopClass: "w-[88%] sm:w-[82%] max-w-[460px] h-[310px] self-start lg:ml-[10%] xl:ml-[14%]"
  },
  {
    id: 4,
    image: staircaseCohortImg,
    category: "LEADERSHIP & HONORS",
    tag: "MASTERCLASS SPRINT",
    number: "04",
    title: "Soft Skills & Personality Development",
    location: "Hindu College, Guntur",
    highlight: "300+ Students • TCS Delivery Manager",
    desktopClass: "w-[88%] sm:w-[82%] max-w-[460px] h-[300px] self-end lg:mr-[6%] xl:mr-[10%]"
  },
  {
    id: 5,
    image: realHandsOnLab,
    category: "100% PRACTICAL LABS",
    tag: "PRODUCTION LABS",
    number: "05",
    title: "Hands-On Systems & Code Labs",
    location: "Advanced Compute & Systems Labs",
    highlight: "Live IDE Debugging",
    desktopClass: "w-[88%] sm:w-[82%] max-w-[460px] h-[300px] self-center"
  },
  {
    id: 6,
    image: realHackathon2k26,
    category: "COMPETITIVE SPRINT",
    tag: "AI HACKATHON 2K26",
    number: "06",
    title: "AI x Regional Hackathon Sprints",
    location: "Regional Technical Hubs",
    highlight: "Real-World AI Solutions",
    desktopClass: "w-[88%] sm:w-[82%] max-w-[460px] h-[310px] self-start"
  }
];

export default function Hero() {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

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

  return (
    <section
      id="hero"
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] transition-colors duration-200 overflow-hidden"
      aria-label="Hero Section"
    >
      {/* ========================================================================= */}
      {/* AMBIENT WATERMARK BACKGROUND PHOTO STREAMS                                 */}
      {/* Up-to-Down (Vertical) & Left-to-Right, Right-to-Left (Horizontal)          */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Vignettes for Flawless Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFCFA]/95 via-[#FDFCFA]/80 to-[#FDFCFA]/95 dark:from-[#0A0A0A]/95 dark:via-[#0A0A0A]/85 dark:to-[#0A0A0A]/95 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCFA] via-transparent to-[#FDFCFA] dark:from-[#0A0A0A] dark:via-transparent dark:to-[#0A0A0A] z-10 pointer-events-none" />

        {/* 1. VERTICAL WATERMARK STREAM: Up to Down (Left Column) */}
        <div className="absolute -top-36 left-2 sm:left-8 w-44 sm:w-60 opacity-[0.14] dark:opacity-[0.10] filter grayscale contrast-125 z-0">
          <div className="animate-watermark-down flex flex-col gap-5">
            {watermarkPhotos.concat(watermarkPhotos).map((img, idx) => (
              <div key={`vm-l-${idx}`} className="w-full h-32 sm:h-44 rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 shadow-sm bg-neutral-900 shrink-0">
                <img src={img} alt="Campus Workshop Watermark" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 2. VERTICAL WATERMARK STREAM: Up to Down (Right Column) */}
        <div className="absolute -top-24 right-2 sm:right-12 w-48 sm:w-64 opacity-[0.13] dark:opacity-[0.09] filter grayscale contrast-125 z-0 hidden md:block">
          <div className="animate-watermark-down flex flex-col gap-5" style={{ animationDelay: '-12s', animationDuration: '40s' }}>
            {watermarkPhotos.slice().reverse().concat(watermarkPhotos).map((img, idx) => (
              <div key={`vm-r-${idx}`} className="w-full h-36 sm:h-48 rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 shadow-sm bg-neutral-900 shrink-0">
                <img src={img} alt="Campus Workshop Watermark" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. HORIZONTAL WATERMARK STREAM: Left to Right (Upper Tier) */}
        <div className="absolute top-[12%] inset-x-0 h-28 sm:h-36 opacity-[0.12] dark:opacity-[0.08] filter grayscale contrast-125 z-0 overflow-hidden">
          <div className="animate-watermark-ltr flex gap-5 w-max">
            {watermarkPhotos.concat(watermarkPhotos).map((img, idx) => (
              <div key={`hm-ltr-${idx}`} className="w-48 sm:w-64 h-28 sm:h-36 rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 shadow-sm bg-neutral-900 shrink-0">
                <img src={img} alt="Campus Workshop Watermark" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 4. HORIZONTAL WATERMARK STREAM: Right to Left (Lower Tier) */}
        <div className="absolute bottom-[10%] inset-x-0 h-28 sm:h-36 opacity-[0.12] dark:opacity-[0.08] filter grayscale contrast-125 z-0 overflow-hidden">
          <div className="animate-watermark-rtl flex gap-5 w-max">
            {watermarkPhotos.slice().reverse().concat(watermarkPhotos).map((img, idx) => (
              <div key={`hm-rtl-${idx}`} className="w-48 sm:w-64 h-28 sm:h-36 rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 shadow-sm bg-neutral-900 shrink-0">
                <img src={img} alt="Campus Workshop Watermark" className="w-full h-full object-cover" />
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

      {/* 
        Nedbase-Style 2-Column Split Layout:
        - Left Section (Desktop: 43% width, 100vh height, position: sticky, top: 0)
        - Right Section (Desktop: 57% width, vertically scrolling workshop photographs)
      */}
      <div className="relative z-10 max-w-[1600px] mx-auto flex flex-col md:flex-row items-start">
        
        {/* ========================================================================= */}
        {/* LEFT SECTION: Stationary Sticky Hero Content (43% on LG, 40% on Tablet)  */}
        {/* ========================================================================= */}
        <div className="w-full md:w-[40%] lg:w-[43%] md:sticky md:top-0 md:h-screen flex flex-col justify-center px-6 sm:px-10 lg:px-[6%] xl:px-[8%] py-12 lg:py-16 z-20 shrink-0">
          
          {/* Main Heading: 38px–52px Desktop */}
          <h1 className="font-headline font-black text-3xl sm:text-4xl lg:text-[40px] xl:text-[48px] tracking-tight text-[#0A0A0A] dark:text-[#F5F5F5] leading-[1.08]">
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
              className="block text-[#0A0A0A] dark:text-[#F5F5F5]"
            >
              that turn knowledge
            </motion.span>
            <motion.span
              custom={2}
              initial="hidden"
              animate="visible"
              variants={lineVariants}
              className="block font-light italic font-serif text-[#0A0A0A]/90 dark:text-[#F5F5F5]"
            >
              into{' '}
              <span className="not-italic font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] via-[#FACC15] to-[#EAB308] dark:from-[#FACC15] dark:via-[#FEF08A] dark:to-[#FACC15]">
                real-world skills.
              </span>
            </motion.span>
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mt-4 text-[15px] lg:text-[16px] text-[#404040] dark:text-[#D4D4D4] font-normal leading-relaxed max-w-md"
          >
            IncuxAI bridges academic foundations and enterprise engineering demands through intensive,
            practitioner-led workshops at colleges, universities, and technical research institutions.
          </motion.p>

          {/* High Impact Yellow & Black CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            className="mt-6 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={scrollToWork}
              className="group px-6 py-3 rounded-full bg-[#0A0A0A] hover:bg-[#1F1F1F] text-[#FACC15] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] dark:text-[#0A0A0A] font-headline font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-black/20 dark:shadow-yellow-500/25 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3 cursor-pointer"
            >
              <span>Explore Our Work</span>
              <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            </button>
          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT SECTION: Workshop Photo Gallery                                    */}
        {/* ========================================================================= */}
        <div className="w-full md:w-[60%] lg:w-[57%] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 md:pt-16 pb-12 flex flex-col justify-center z-10">
          {/* Featured Reel Card */}
          <div className="relative rounded-3xl overflow-hidden border border-black/15 dark:border-[#262626] bg-neutral-950 shadow-2xl p-2 sm:p-3">
            <div className="relative h-[300px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden bg-neutral-900 group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activePhotoIdx}
                  src={workshopGallery[activePhotoIdx].image}
                  alt={workshopGallery[activePhotoIdx].title}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
              
              {/* Overlay details */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="px-2.5 py-1 rounded-full bg-[#FACC15] text-[#0A0A0A] text-[10px] font-mono font-bold uppercase tracking-wider inline-block mb-1.5 shadow-sm">
                    {workshopGallery[activePhotoIdx].tag}
                  </span>
                  <h3 className="font-headline font-bold text-base sm:text-lg text-white truncate">
                    {workshopGallery[activePhotoIdx].title}
                  </h3>
                  <p className="text-xs font-mono text-white/75 truncate flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
                    <span>{workshopGallery[activePhotoIdx].location} • {workshopGallery[activePhotoIdx].highlight}</span>
                  </p>
                </div>
                
                {/* Prev / Next buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setActivePhotoIdx((prev) => (prev === 0 ? workshopGallery.length - 1 : prev - 1))}
                    aria-label="Previous workshop photo"
                    className="w-9 h-9 rounded-full bg-black/60 hover:bg-[#FACC15] hover:text-[#0A0A0A] border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActivePhotoIdx((prev) => (prev === workshopGallery.length - 1 ? 0 : prev + 1))}
                    aria-label="Next workshop photo"
                    className="w-9 h-9 rounded-full bg-black/60 hover:bg-[#FACC15] hover:text-[#0A0A0A] border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnails row */}
            <div className="mt-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
              {workshopGallery.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIdx === idx
                      ? 'border-[#FACC15] scale-105 shadow-md shadow-yellow-500/20'
                      : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/40'
                  }`}
                >
                  <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticker / Highlights Marquee */}
      <div className="relative z-10 w-full border-t border-black/10 dark:border-yellow-400/20 py-4 bg-white/75 dark:bg-[#0A0A0A]/75 backdrop-blur-md">
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
