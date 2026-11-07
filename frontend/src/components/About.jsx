import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, Trophy, Code, Sparkles, Users, Award, Camera } from 'lucide-react';
import auditoriumImg from '../assets/auditorium_workshop.jpg';
import labImg from '../assets/hands_on_lab.jpg';
import mentorImg from '../assets/mentor_guidance.jpg';
import realCampusCohort from '../assets/real_campus_cohort.jpg';
import realHackathon2k26 from '../assets/real_hackathon_2k26.jpg';
import realStageCertifications from '../assets/real_stage_certifications.jpg';
import realStaircaseSprint from '../assets/real_staircase_sprint.jpg';
import campusHallImg from '../assets/campus_hall_card.jpg';
import WorkshopVideoPlayer from './WorkshopVideoPlayer';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('workshops'); // 'workshops' | 'hackathons' | 'guest-lectures'

  const eventPhotos = {
    workshops: [
      {
        id: 'w1',
        title: 'Production Systems & Code Labs',
        location: 'Advanced Compute & Systems Labs',
        date: 'Hands-on Bootcamp',
        image: labImg,
        badge: 'LIVE IDE SESSION'
      },
      {
        id: 'w2',
        title: 'Full-Stack Agentic AI Immersion',
        location: 'Engineering Campus Labs',
        date: '5-Day Intensive Cohort',
        image: realCampusCohort,
        badge: 'CAMPUS COHORT'
      },
      {
        id: 'w3',
        title: 'Real-Time Architecture & Mentorship',
        location: 'University Computer Center',
        date: 'Practitioner Guidance',
        image: mentorImg,
        badge: 'EXPERT REVIEW'
      }
    ],
    hackathons: [
      {
        id: 'h1',
        title: 'AI x Anantapur Police Hackathon 2k26',
        location: 'Anantapur Regional Hub',
        date: '48-Hour Competitive Sprint',
        image: realHackathon2k26,
        badge: 'ACTIVE BUILD SPRINT'
      },
      {
        id: 'h2',
        title: 'Developer Squad Problem Solving',
        location: 'Campus Technology Arena',
        date: 'Overnight Code Marathon',
        image: realStaircaseSprint,
        badge: 'RAPID PROTOTYPING'
      },
      {
        id: 'h3',
        title: 'Podium Awards & Incubation Grants',
        location: 'Main Auditorium Stage',
        date: 'Winning Prototype Demos',
        image: realStageCertifications,
        badge: 'HONORS & AWARDS'
      }
    ],
    'guest-lectures': [
      {
        id: 'g1',
        title: 'Executive Keynotes @ IIT Hyderabad',
        location: 'IIT Hyderabad Campus',
        date: 'Research & Enterprise Tech Talks',
        image: auditoriumImg,
        badge: 'PREMIER KEYNOTE'
      },
      {
        id: 'g2',
        title: 'Staff AI Leadership Masterclass',
        location: 'College Central Auditorium',
        date: 'Google & Walmart Mentors',
        image: mentorImg,
        badge: 'STAFF AI DIALOGUE'
      },
      {
        id: 'g3',
        title: '500+ Engineering Audience Keynote',
        location: 'Chalapathi Institute of Tech',
        date: 'Large-Scale Student Immersion',
        image: campusHallImg,
        badge: '500+ ATTENDEES'
      }
    ]
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Content reveal
      gsap.from(".about-content", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });

      // Video showcase arrival animation
      gsap.from(".about-video-wrapper", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-video-wrapper",
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-16 sm:py-24 border-t border-black/10 dark:border-[#262626] overflow-hidden transition-colors duration-200"
      aria-label="Bridging Education and Industry"
    >
      {/* Ambient Settled Background Photography (Continuous scroll depth) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Ambient Photo 1: Lab Sprints floating in top-left background */}
        <div className="about-ambient-photo-1 absolute -top-10 -left-16 w-80 h-64 rounded-3xl overflow-hidden opacity-10 dark:opacity-5 blur-[1px] rotate-[-8deg] border border-[#FACC15]/20">
          <img src={labImg} alt="" className="w-full h-full object-cover grayscale" />
        </div>

        {/* Ambient Photo 2: IIT Hyderabad Auditorium floating in bottom-right background */}
        <div className="about-ambient-photo-2 absolute -bottom-16 -right-20 w-96 h-72 rounded-3xl overflow-hidden opacity-10 dark:opacity-5 blur-[1px] rotate-[10deg] border border-[#FACC15]/20">
          <img src={auditoriumImg} alt="" className="w-full h-full object-cover grayscale" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Centered Editorial Mission (Docked card removed) */}
        <div className="about-content max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/15 dark:bg-[#FACC15]/10 border border-[#FACC15]/30 text-xs font-mono text-neutral-900 dark:text-[#FACC15] uppercase tracking-widest mb-4 font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
            <span>Academic &amp; Industry Initiative</span>
          </div>

          <h2 className="font-headline font-black text-3xl sm:text-5xl md:text-6xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight leading-tight">
            Bridging Education <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FACC15] to-amber-500 dark:from-[#FACC15] dark:via-white dark:to-[#FEF08A]">
              and Industry.
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed max-w-3xl mx-auto">
            Academic curriculums build essential theoretical foundations, but enterprise technology stacks evolve at lightning speed.
            IncuxAI bridges this divide through high-impact guest lectures by global engineering leaders, competitive hackathons,
            and intensive hands-on workshops that prepare students for real production engineering.
          </p>
        </div>

        {/* Featured Video Showcase: Placed directly below Bridging Education and Industry */}
        <div className="about-video-wrapper mb-12 sm:mb-16 max-w-5xl mx-auto">
          <WorkshopVideoPlayer />
        </div>

        {/* Interactive Event Showcase: 3 Icons (Workshops, Hackathons, Guest Lectures) */}
        <div className="about-event-selector">
          <div className="text-center mb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#EAB308] dark:text-[#FACC15] flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" />
              <span>EXPLORE EVENT PHOTO SHOWCASE</span>
            </span>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Select an event format below to view authentic photography from our campus and regional sessions.
            </p>
          </div>

          {/* 3 Interactive Category Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
            {/* 1. Workshops */}
            <button
              onClick={() => setActiveCategory('workshops')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center ${
                activeCategory === 'workshops'
                  ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] border-[#0A0A0A] dark:border-[#FACC15] shadow-xl scale-105'
                  : 'bg-white dark:bg-[#141414] text-neutral-800 dark:text-[#F5F5F5] border-black/10 dark:border-[#262626] hover:border-[#FACC15]'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                activeCategory === 'workshops'
                  ? 'bg-[#FACC15] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FACC15]'
                  : 'bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15]'
              }`}>
                <Code className="w-6 h-6" />
              </div>
              <div>
                <span className="font-headline font-bold text-base block">Workshops</span>
                <span className="text-[11px] font-mono opacity-80">Hands-on Labs &amp; Sprints</span>
              </div>
            </button>

            {/* 2. Hackathons */}
            <button
              onClick={() => setActiveCategory('hackathons')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center ${
                activeCategory === 'hackathons'
                  ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] border-[#0A0A0A] dark:border-[#FACC15] shadow-xl scale-105'
                  : 'bg-white dark:bg-[#141414] text-neutral-800 dark:text-[#FACC15] border-black/10 dark:border-[#262626] hover:border-[#FACC15]'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                activeCategory === 'hackathons'
                  ? 'bg-[#FACC15] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FACC15]'
                  : 'bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15]'
              }`}>
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="font-headline font-bold text-base block">Hackathons</span>
                <span className="text-[11px] font-mono opacity-80">Competitive Sprints</span>
              </div>
            </button>

            {/* 3. Guest Lectures */}
            <button
              onClick={() => setActiveCategory('guest-lectures')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2.5 text-center ${
                activeCategory === 'guest-lectures'
                  ? 'bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] border-[#0A0A0A] dark:border-[#FACC15] shadow-xl scale-105'
                  : 'bg-white dark:bg-[#141414] text-neutral-800 dark:text-[#F5F5F5] border-black/10 dark:border-[#262626] hover:border-[#FACC15]'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                activeCategory === 'guest-lectures'
                  ? 'bg-[#FACC15] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FACC15]'
                  : 'bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15]'
              }`}>
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <span className="font-headline font-bold text-base block">Guest Lectures</span>
                <span className="text-[11px] font-mono opacity-80">Executive Keynotes</span>
              </div>
            </button>
          </div>

          {/* Event Photo Showcase Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventPhotos[activeCategory].map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all duration-300 shadow-xl flex flex-col"
              >
                <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full bg-[#0A0A0A]/90 dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] border border-[#FACC15]/40 text-[10px] font-mono font-bold tracking-wider">
                      {photo.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-neutral-950 dark:text-[#F5F5F5] group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors">
                      {photo.title}
                    </h3>
                    <p className="mt-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                      {photo.location}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/10 dark:border-[#262626] flex items-center justify-between text-xs font-mono text-neutral-700 dark:text-neutral-300">
                    <span className="font-medium">{photo.date}</span>
                    <span className="text-[#EAB308] dark:text-[#FACC15] font-bold">Verified Event</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
