import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WorkshopCard from './WorkshopCard';
import TiltCard from './TiltCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function OurWork({ cards = [] }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Check scroll position for navigation buttons and progress bar
  const checkScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = (scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.max(15, progress)}%`;
      }
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => track.removeEventListener('scroll', checkScroll);
  }, [cards]);

  const scrollManual = (direction) => {
    if (!trackRef.current) return;
    const scrollAmount = 440;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Scroll-driven Photo Settling Animation: Split photos from Hero & Section 2 descend and settle into cards
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Cascade Docking: Cards fly down from top and snap into place as user scrolls down into Section 3
      gsap.fromTo(
        ".ourwork-settle-card",
        {
          y: -110,
          scale: 1.08,
          rotation: (i) => (i % 2 === 0 ? -3.5 : 3.5),
          opacity: 0.3
        },
        {
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            end: "top 38%",
            scrub: 1.2
          }
        }
      );

      // 2. Parallax Departure: As user scrolls further down past Section 3, cards gently yield downwards
      gsap.to(".ourwork-settle-card", {
        y: 40,
        stagger: 0.03,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "center 40%",
          end: "bottom top",
          scrub: 1.2
        }
      });
    }, section);

    return () => ctx.revert();
  }, [cards]);

  return (
    <section
      ref={sectionRef}
      id="our-work"
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-16 sm:py-24 overflow-hidden border-t border-black/10 dark:border-yellow-400/20 transition-colors duration-200"
      aria-label="Our Work Section"
    >
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#141414]/90 backdrop-blur-md border border-black/10 dark:border-yellow-400/30 text-xs font-mono text-[#0A0A0A] dark:text-[#FACC15] uppercase tracking-widest mb-4 font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
              <span>Section 03 // Workshop Formats</span>
            </div>
            <h2 className="font-headline font-black text-3xl sm:text-5xl md:text-6xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight leading-tight">
              Where Ideas Become <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAB308] via-[#FACC15] to-[#EAB308] dark:from-[#FACC15] dark:via-[#FEF08A] dark:to-[#FACC15]">
                Experience
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Navigation Scroll Buttons */}
            <button
              onClick={() => scrollManual('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="w-11 h-11 rounded-full bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] flex items-center justify-center text-[#0A0A0A] dark:text-[#FACC15] hover:bg-[#FACC15] hover:text-[#0A0A0A] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollManual('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="w-11 h-11 rounded-full bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] border border-[#0A0A0A] dark:border-[#FACC15] flex items-center justify-center text-[#FACC15] dark:text-[#0A0A0A] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="w-full h-1.5 bg-black/10 dark:bg-[#181818] rounded-full mt-6 overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#FACC15] transition-all duration-100 rounded-full"
            style={{ width: `${Math.max(15, scrollProgress)}%` }}
          />
        </div>
      </div>

      {/* Fluid Horizontal Scrolling Track */}
      <div className="w-full">
        <div
          ref={trackRef}
          className="flex gap-6 sm:gap-8 px-4 sm:px-6 lg:px-12 overflow-x-auto no-scrollbar scroll-smooth pb-8 cursor-grab active:cursor-grabbing snap-x snap-mandatory"
        >
          {cards.map((card) => (
            <div key={card.id} className="ourwork-settle-card shrink-0">
              <WorkshopCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
