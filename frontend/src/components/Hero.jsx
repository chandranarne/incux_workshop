import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ChevronDown } from 'lucide-react';
import { siteConfig } from '../data/config';
import realCampusCohort from '../assets/real_campus_cohort.jpg';
import realHandsOnLab from '../assets/real_hands_on_lab.jpg';
import realHackathon2k26 from '../assets/real_hackathon_2k26.jpg';
import realStageCertifications from '../assets/real_stage_certifications.jpg';
import realStaircaseSprint from '../assets/real_staircase_sprint.jpg';

// Real authentic workshop photographs provided by the user with asymmetric editorial layout parameters
const workshopGallery = [
  {
    id: 1,
    image: realCampusCohort,
    category: "PREMIER CAMPUS",
    tag: "CAMPUS IMMERSION",
    number: "01",
    title: "Collegiate Engineering Immersion",
    location: "Telangana & Andhra Pradesh Campuses",
    highlight: "3,075+ Engineers Mentored",
    // Desktop layout: ~80% width, max 460px, 300px height (aspect ratio ~1.53:1), slight left offset
    desktopClass: "w-[88%] sm:w-[82%] max-w-[460px] h-[300px] self-start lg:ml-[5%] xl:ml-[8%]"
  },
  {
    id: 2,
    image: realHandsOnLab,
    category: "100% PRACTICAL LABS",
    tag: "PRODUCTION LABS",
    number: "02",
    title: "Hands-On Systems & Code Labs",
    location: "Advanced Compute & Systems Labs",
    highlight: "Live IDE Debugging",
    // Desktop layout: ~80% width, max 460px, 300px height, offset to the right
    desktopClass: "w-[88%] sm:w-[82%] max-w-[460px] h-[300px] self-end lg:mr-[4%] xl:mr-[8%]"
  },
  {
    id: 3,
    image: realHackathon2k26,
    category: "COMPETITIVE SPRINT",
    tag: "AI HACKATHON 2K26",
    number: "03",
    title: "AI x Anantapur Police Hackathon",
    location: "Anantapur & Regional Technical Hubs",
    highlight: "Real-World AI Solutions",
    // Desktop layout: ~80% width, max 460px, 310px height, shifted slightly left-center
    desktopClass: "w-[88%] sm:w-[82%] max-w-[460px] h-[310px] self-start lg:ml-[10%] xl:ml-[14%]"
  },
  {
    id: 4,
    image: realStageCertifications,
    category: "PEDIGREE & HONORS",
    tag: "MASTERCLASS SPRINT",
    number: "04",
    title: "Auditorium Masterclass & Honors",
    location: "Campus Technical Auditoriums",
    highlight: "Executive Mentorship",
    // Desktop layout: ~80% width, max 460px, 300px height, shifted to the right
    desktopClass: "w-[88%] sm:w-[82%] max-w-[460px] h-[300px] self-end lg:mr-[6%] xl:mr-[10%]"
  },
  {
    id: 5,
    image: realStaircaseSprint,
    category: "COLLEGIATE FOOTPRINT",
    tag: "ENGINEERING SQUAD",
    number: "05",
    title: "University Practitioner Bootcamps",
    location: "University Engineering Campuses",
    highlight: "Multi-Day Bootcamps",
    // Desktop layout: centered anchor
    desktopClass: "w-[88%] sm:w-[82%] max-w-[460px] h-[300px] self-center"
  }
];

export default function Hero() {
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
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] transition-colors duration-200"
      aria-label="Hero Section"
    >
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

            <div className="flex items-center gap-2.5 text-xs font-mono text-[#0A0A0A]/80 dark:text-[#FACC15]/90 pl-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active 2026 Cohorts</span>
            </div>
          </motion.div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT SECTION: Vertically Scrolling Workshop Gallery (57% on LG, 60% Tab) */}
        {/* ========================================================================= */}
        <div className="w-full md:w-[60%] lg:w-[57%] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 md:pt-24 lg:pt-28 pb-16 lg:pb-24 flex flex-col gap-6 lg:gap-8 z-10">
          
          {workshopGallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0.92, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-2xl overflow-hidden shadow-2xl border border-black/15 dark:border-[#262626] bg-neutral-950 group ${
                item.desktopClass
              } max-md:w-full max-md:h-[250px] max-md:max-w-none max-md:self-center`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover filter saturate-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                loading={index < 2 ? "eager" : "lazy"}
              />
            </motion.div>
          ))}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* Prominent Upcoming Workshops Scrolling Marquee (Transitions into Section 2) */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full pt-4 sm:pt-6 pb-6 sm:pb-8 border-t border-black/10 dark:border-yellow-400/20 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-2 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FACC15] shadow-xs shrink-0" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0A] dark:text-[#FACC15]">
              Upcoming Workshops // Open For Registration
            </span>
          </div>
        </div>

        {/* Horizontal Track Layered Over Oversized Watermark */}
        <div className="relative w-full overflow-hidden py-2 sm:py-3 select-none flex items-center justify-center">
          {/* Oversized "WORKSHOPS" Background Watermark Layer */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <div
              className="text-center font-headline font-black uppercase text-[15vw] sm:text-[13vw] md:text-[11vw] leading-none tracking-tighter text-black/[0.04] dark:text-yellow-400/[0.05] whitespace-nowrap block w-full drop-shadow-sm select-none"
              aria-hidden="true"
            >
              {siteConfig.brand.heroOversized}
            </div>
          </div>

          {/* Clean Horizontal Space for the Right-to-Left Scrolling Track */}
          <div className="relative z-10 w-full py-1 bg-gradient-to-r from-[#FDFCFA]/80 via-transparent to-[#FDFCFA]/80 dark:from-[#0A0A0A]/80 dark:via-transparent dark:to-[#0A0A0A]/80 backdrop-blur-[2px]">
            <div className="animate-marquee-infinite py-1 gap-4 sm:gap-6 flex items-center">
              {[
                "Enterprise Generative AI & LLMOps Pipeline",
                "Autonomous AI Agents & LangGraph Deep Dive",
                "Defensive Cloud Security & Zero-Trust Engineering",
                "5-Day Full-Stack AI System Bootcamp",
                "Enterprise Agentic AI & Autonomous Workflows",
                "High-Scale Microservices & Distributed Systems",
                "Applied Deep Learning & SLM Fine-Tuning"
              ].concat([
                "Enterprise Generative AI & LLMOps Pipeline",
                "Autonomous AI Agents & LangGraph Deep Dive",
                "Defensive Cloud Security & Zero-Trust Engineering",
                "5-Day Full-Stack AI System Bootcamp",
                "Enterprise Agentic AI & Autonomous Workflows",
                "High-Scale Microservices & Distributed Systems",
                "Applied Deep Learning & SLM Fine-Tuning"
              ]).map((workshopName, idx) => (
                <button
                  key={`${workshopName}-${idx}`}
                  onClick={() => {
                    document.querySelector('#upcoming-workshops')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="shrink-0 group inline-flex items-center gap-2.5 sm:gap-3.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white/95 dark:bg-[#141414]/95 backdrop-blur-md border border-black/15 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] hover:shadow-glow-yellow hover:-translate-y-0.5 transition-all duration-300 shadow-md cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FACC15] shrink-0 shadow-sm" />
                  <span className="font-headline font-bold text-xs sm:text-sm md:text-base text-[#0A0A0A] dark:text-[#F5F5F5] group-hover:text-[#EAB308] dark:group-hover:text-[#FACC15] transition-colors tracking-tight whitespace-nowrap">
                    {workshopName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
