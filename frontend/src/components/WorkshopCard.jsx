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
        className="group relative flex flex-col justify-between w-[285px] xs:w-[320px] sm:w-[380px] lg:w-[420px] flex-shrink-0 h-[480px] sm:h-[520px] rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all duration-500 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10"
      >
        {/* Top Photographic Showcase */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-neutral-900 shrink-0">
          <img
            src={bgImage}
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Top Overlaid Metadata Badges */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-white">
            <span className="font-headline font-bold text-xs sm:text-sm tracking-wider px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#FACC15]">
              {card.number || '01'}
            </span>
            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/95 dark:bg-[#0A0A0A]/95 text-[#0A0A0A] dark:text-[#FACC15] border border-black/15 dark:border-yellow-400/30 font-mono text-[10px] sm:text-[11px] font-bold shadow-sm">
              {card.category}
            </span>
          </div>

          {/* Location Chip on Image Bottom */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-3 sm:left-4 flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-white/90">
            <MapPin className="w-3.5 h-3.5 text-[#FACC15] shrink-0" />
            <span className="font-medium drop-shadow-sm truncate max-w-[200px]">{card.location}</span>
          </div>
        </div>

        {/* Card Body: Editorial Title, Description, Format Specs */}
        <div className="p-4 sm:p-7 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#0A0A0A] dark:text-[#F5F5F5] group-hover:text-[#EAB308] dark:group-hover:text-[#FACC15] transition-colors leading-snug line-clamp-2">
              {card.title}
            </h3>

            <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-[#525252] dark:text-[#A3A3A3] font-normal leading-relaxed line-clamp-2">
              {card.description}
            </p>
          </div>

          {/* Format Specs Box */}
          <div className="my-2 sm:my-3 p-2.5 sm:p-3 rounded-2xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-xs font-mono">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1">
              <span className="text-[#0A0A0A]/70 dark:text-[#FACC15]/80 uppercase tracking-wider font-bold">
                FORMAT SPECS
              </span>
              <span className="text-[#0A0A0A] dark:text-[#FACC15] font-bold bg-[#FACC15]/20 dark:bg-[#1A1A1A] px-2 sm:px-2.5 py-0.5 rounded-full border border-[#FACC15]/30">
                {card.highlight}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 text-[10px] sm:text-[11px] text-[#525252] dark:text-[#A3A3A3] border-t border-black/10 dark:border-[#262626]">
              <span className="flex items-center gap-1.5 font-bold truncate">
                <BookmarkCheck className="w-3.5 h-3.5 text-[#EAB308] dark:text-[#FACC15] shrink-0" />
                <span className="truncate">{card.tag}</span>
              </span>
              <span className="font-bold text-[9px] sm:text-[10px] text-[#0A0A0A]/60 dark:text-[#FACC15]/70 shrink-0">[HANDS-ON]</span>
            </div>
          </div>

          {/* Card Footer: Agency Series & Magnetic Arrow */}
          <div className="pt-2 sm:pt-3 border-t border-black/10 dark:border-[#262626] flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-mono text-[#525252] dark:text-[#A3A3A3] font-medium">
              IncuxAI Workshop Series
            </span>
            <a
              href="#contact"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/15 dark:border-[#262626] group-hover:bg-[#FACC15] group-hover:text-[#0A0A0A] group-hover:border-[#FACC15] text-[#0A0A0A] dark:text-[#FACC15] flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110 shrink-0"
              aria-label={`Inquire about ${card.title}`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
