import React from 'react';
import { MapPin, ArrowUpRight, BookmarkCheck } from 'lucide-react';
import TiltCard from './TiltCard';
import auditoriumImg from '../assets/auditorium_workshop.jpg';
import labImg from '../assets/hands_on_lab.jpg';
import mentorImg from '../assets/mentor_guidance.jpg';
import campusHallImg from '../assets/campus_hall_card.jpg';
import realHackathonImg from '../assets/real_hackathon_2k26.jpg';

export default function WorkshopCard({ card }) {
  // Associate authentic workshop photographs with each format
  const getCardImage = (id) => {
    switch (id) {
      case 'iit-workshops':
        return auditoriumImg;
      case 'offline-colleges':
        return campusHallImg;
      case 'hackathons':
        return realHackathonImg;
      case 'ai-bootcamps':
        return labImg;
      case 'guest-lectures':
        return mentorImg;
      case 'online-workshops':
        return labImg;
      default:
        return auditoriumImg;
    }
  };

  const bgImage = getCardImage(card.id);

  return (
    <TiltCard maxTilt={5} scale={1.02} glare={false}>
      <div
        className="group relative flex flex-col justify-between w-[320px] sm:w-[380px] lg:w-[420px] flex-shrink-0 h-[520px] rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all duration-500 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10"
      >
        {/* Top Photographic Showcase: 4:3 Aspect with Subtle Zoom */}
        <div className="relative h-52 w-full overflow-hidden bg-neutral-900 shrink-0">
          <img
            src={bgImage}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Top Overlaid Metadata Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
            <span className="font-headline font-bold text-sm tracking-wider px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#FACC15]">
              {card.number || '01'}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-[#0A0A0A]/95 text-[#0A0A0A] dark:text-[#FACC15] border border-black/15 dark:border-yellow-400/30 font-mono text-[11px] font-bold shadow-sm">
              {card.category}
            </span>
          </div>

          {/* Location Chip on Image Bottom */}
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs font-mono text-white/90">
            <MapPin className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
            <span className="font-medium drop-shadow-sm">{card.location}</span>
          </div>
        </div>

        {/* Card Body: Editorial Title, Description, Format Specs */}
        <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-headline font-bold text-2xl text-[#0A0A0A] dark:text-[#F5F5F5] group-hover:text-[#EAB308] dark:group-hover:text-[#FACC15] transition-colors leading-snug line-clamp-2">
              {card.title}
            </h3>

            <p className="mt-2.5 text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] font-normal leading-relaxed line-clamp-2">
              {card.description}
            </p>
          </div>

          {/* Format Specs Box */}
          <div className="my-3 p-3 rounded-2xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-xs font-mono">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-[#0A0A0A]/70 dark:text-[#FACC15]/80 uppercase tracking-wider font-bold">
                FORMAT SPECS
              </span>
              <span className="text-[#0A0A0A] dark:text-[#FACC15] font-bold bg-[#FACC15]/20 dark:bg-[#1A1A1A] px-2.5 py-0.5 rounded-full border border-[#FACC15]/30">
                {card.highlight}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-[#525252] dark:text-[#A3A3A3] border-t border-black/10 dark:border-[#262626]">
              <span className="flex items-center gap-1.5 font-bold">
                <BookmarkCheck className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15]" />
                {card.tag}
              </span>
              <span className="font-bold text-[10px] text-[#0A0A0A]/60 dark:text-[#FACC15]/70">[HANDS-ON FORMAT]</span>
            </div>
          </div>

          {/* Card Footer: Agency Series & Magnetic Arrow */}
          <div className="pt-3 border-t border-black/10 dark:border-[#262626] flex items-center justify-between">
            <span className="text-xs font-mono text-[#525252] dark:text-[#A3A3A3] font-medium">
              IncuxAI Workshop Series
            </span>
            <a
              href="#contact"
              className="w-10 h-10 rounded-full bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/15 dark:border-[#262626] group-hover:bg-[#FACC15] group-hover:text-[#0A0A0A] group-hover:border-[#FACC15] text-[#0A0A0A] dark:text-[#FACC15] flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110"
              aria-label={`Inquire about ${card.title}`}
            >
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
