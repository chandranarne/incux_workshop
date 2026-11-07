import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TiltCard from './TiltCard';
import { Mic, Trophy, Code, Sparkles, Users, Award } from 'lucide-react';
import auditoriumImg from '../assets/auditorium_workshop.jpg';
import labImg from '../assets/hands_on_lab.jpg';
import mentorImg from '../assets/mentor_guidance.jpg';
import WorkshopVideoPlayer from './WorkshopVideoPlayer';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Content reveal
      gsap.from(".about-content", {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });

      // Docking arrival animation for Mentor Photo card coming from Hero
      gsap.fromTo(".about-docked-photo-card",
        {
          y: -90,
          scale: 1.08,
          rotation: 3,
          opacity: 0.35
        },
        {
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about-docked-photo-card",
            start: "top 95%",
            end: "top 50%",
            scrub: 1.2
          }
        }
      );

      // Ambient background settled photos parallax drift
      gsap.to(".about-ambient-photo-1", {
        y: 130,
        rotation: -14,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });

      gsap.to(".about-ambient-photo-2", {
        y: -130,
        rotation: 14,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
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

      gsap.from(".about-pillar-card", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
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
        {/* Section Header: 2-Column Editorial Synergy Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-14 sm:mb-20">
          
          {/* Left Column: Typography & Initiative Mission */}
          <div className="about-content lg:col-span-6 xl:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/15 dark:bg-[#FACC15]/10 border border-[#FACC15]/30 text-xs font-mono text-neutral-900 dark:text-[#FACC15] uppercase tracking-widest mb-4 font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
              <span>Academic &amp; Industry Initiative</span>
            </div>

            <h2 className="font-headline font-black text-3xl sm:text-5xl md:text-6xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight leading-tight">
              Bridging Education <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FACC15] to-amber-500 dark:from-[#FACC15] dark:via-white dark:to-[#FEF08A]">
                and Industry.
              </span>
            </h2>

            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed max-w-xl">
              Academic curriculums build essential theoretical foundations, but enterprise technology stacks evolve at lightning speed.
              IncuxAI bridges this divide through high-impact guest lectures by global engineering leaders, competitive hackathons,
              and intensive hands-on workshops that prepare students for real production engineering.
            </p>
          </div>

          {/* Right Column: Editorial Visual Showcase with Real Workshop Photography & Architecture Matrix */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="about-docked-photo-card rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-2xl relative overflow-hidden group">
              
              {/* Photo Showcase: Mentor Whiteboard Architecture Session */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-black/10 dark:border-[#262626] mb-5">
                <img
                  src={mentorImg}
                  alt="IncuxAI Mentor Technical Review"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FACC15] text-[#0A0A0A] text-[10px] font-mono font-bold tracking-wider shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
                    PHOTO DOCKED // LIVE IMMERSION
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#FACC15] block font-bold">
                      SYNAPSE BRIDGE MATRIX
                    </span>
                    <span className="font-headline font-bold text-sm text-white">
                      Real-Time Code Execution
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#FACC15]">
                    100% PRODUCTION READY
                  </span>
                </div>
              </div>

              {/* Visual Bridge Comparison Box */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Campus Foundations */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626]">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 block font-bold uppercase">
                    Campus Foundations
                  </span>
                  <span className="font-headline font-bold text-xs text-neutral-900 dark:text-[#F5F5F5] block mt-0.5">
                    Theory &amp; Syllabus
                  </span>
                  <div className="mt-2 space-y-1 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                    <div>• Algorithm Design</div>
                    <div>• Relational DBs</div>
                  </div>
                </div>

                {/* Enterprise Production */}
                <div className="p-3.5 rounded-2xl bg-[#0A0A0A] dark:bg-[#1C1C1C] text-[#F5F5F5] border border-[#FACC15]/40 shadow-sm">
                  <span className="text-[10px] font-mono text-[#FACC15] block font-bold uppercase">
                    Enterprise Production
                  </span>
                  <span className="font-headline font-bold text-xs text-white block mt-0.5">
                    Agentic AI &amp; LLMOps
                  </span>
                  <div className="mt-2 space-y-1 text-[11px] font-mono text-neutral-300">
                    <div>• LangGraph Multi-Agents</div>
                    <div>• Real-world Production</div>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-neutral-700 dark:text-neutral-300">
                <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626]">
                  <span className="text-[10px] opacity-70 block font-bold">MENTORS</span>
                  <span className="font-bold text-neutral-900 dark:text-[#F5F5F5] truncate block">Google &amp; Walmart Leads</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626]">
                  <span className="text-[10px] opacity-70 block font-bold">FORMAT</span>
                  <span className="font-bold text-neutral-900 dark:text-[#F5F5F5] truncate block">Hackathons &amp; Labs</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Featured Video Showcase: Placed directly below Bridging Education and Industry */}
        <div className="about-video-wrapper mb-14 sm:mb-20">
          <WorkshopVideoPlayer />
        </div>

        {/* 3 Core Highlight Cards: Guest Lectures, Hackathons, Technical Workshops */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Distinguished Guest Lectures */}
          <TiltCard maxTilt={5} scale={1.02}>
            <div className="about-pillar-card h-full p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-xl hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15] border border-[#FACC15]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mic className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-neutral-100 dark:bg-[#0A0A0A] text-neutral-800 dark:text-[#FACC15] font-bold border border-black/10 dark:border-[#262626] uppercase tracking-wider">
                    Executive Keynotes
                  </span>
                </div>

                <h3 className="font-headline font-bold text-2xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors">
                  Distinguished Guest Lectures
                </h3>

                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-body">
                  High-profile keynote sessions and interactive tech talks delivered by Staff AI Researchers, Engineering Directors, and Startup Founders from top technology institutions.
                </p>

                <div className="mt-5 space-y-2 border-t border-black/10 dark:border-[#262626] pt-4 text-xs font-mono text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                    <span>Real-world system design &amp; scale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                    <span>Direct Q&amp;A with engineering leadership</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                    <span>Emerging AI frontiers &amp; industry trends</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/10 dark:border-[#262626] flex items-center justify-between text-xs font-mono text-neutral-800 dark:text-[#FACC15] font-bold">
                <span>Practitioner Dialogue</span>
                <Users className="w-4 h-4 opacity-70" />
              </div>
            </div>
          </TiltCard>

          {/* Card 2: Hackathons & Sprints */}
          <TiltCard maxTilt={5} scale={1.02}>
            <div className="about-pillar-card h-full p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-xl hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15] border border-[#FACC15]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-neutral-100 dark:bg-[#0A0A0A] text-neutral-800 dark:text-[#FACC15] font-bold border border-black/10 dark:border-[#262626] uppercase tracking-wider">
                    Build Challenges
                  </span>
                </div>

                <h3 className="font-headline font-bold text-2xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors">
                  Hackathons &amp; Sprints
                </h3>

                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-body">
                  High-energy 24-hour and 48-hour competitive engineering hackathons where student developer squads tackle real corporate challenge statements with live code commits.
                </p>

                <div className="mt-5 space-y-2 border-t border-black/10 dark:border-[#262626] pt-4 text-xs font-mono text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                    <span>Real-time mentor debugging &amp; code reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                    <span>Cash awards &amp; incubation grants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                    <span>Direct recruitment &amp; internship pipelines</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/10 dark:border-[#262626] flex items-center justify-between text-xs font-mono text-neutral-800 dark:text-[#FACC15] font-bold">
                <span>Competitive Coding</span>
                <Award className="w-4 h-4 opacity-70" />
              </div>
            </div>
          </TiltCard>

          {/* Card 3: Technical Workshops */}
          <TiltCard maxTilt={5} scale={1.02}>
            <div className="about-pillar-card h-full p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-xl hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FACC15]/15 text-amber-600 dark:text-[#FACC15] border border-[#FACC15]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Code className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-neutral-100 dark:bg-[#0A0A0A] text-neutral-800 dark:text-[#FACC15] font-bold border border-black/10 dark:border-[#262626] uppercase tracking-wider">
                    Practical Immersions
                  </span>
                </div>

                <h3 className="font-headline font-bold text-2xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors">
                  Technical Workshops
                </h3>

                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-body">
                  Deep offline and online multi-day workshops focusing on Agentic AI, Autonomous Workflows, LLMOps, Cloud Security, and Distributed Systems with hands-on lab deployments.
                </p>

                <div className="mt-5 space-y-2 border-t border-black/10 dark:border-[#262626] pt-4 text-xs font-mono text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                    <span>Zero slide decks — live IDE code execution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                    <span>Curriculum aligned with industry demand</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
                    <span>Skill credentialing &amp; GitHub repos</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/10 dark:border-[#262626] flex items-center justify-between text-xs font-mono text-neutral-800 dark:text-[#FACC15] font-bold">
                <span>Production Learning</span>
                <Sparkles className="w-4 h-4 opacity-70" />
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
