import React from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import TiltCard from './TiltCard';
import { workshopFormatDetails } from '../data/workshopFormatDetails';
import auditoriumImg from '../assets/auditorium_workshop.jpg';

export default function WorkshopCard({ card, onSelect }) {
  // Take authentic workshop photograph directly from the inside of each format's internal gallery
  const formatDetail = workshopFormatDetails[card.id];
  const bgImage = formatDetail?.gallery?.[0]?.image || formatDetail?.heroImage || card.image || auditoriumImg;

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onSelect) {
      onSelect(card);
    }
  };

  return (
    <TiltCard maxTilt={5} scale={1.02} glare={false}>
      <div
        onClick={handleClick}
        className="group relative flex flex-col justify-between w-[285px] xs:w-[320px] sm:w-[380px] lg:w-[420px] flex-shrink-0 h-[480px] sm:h-[520px] rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] transition-all duration-500 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10 cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
          }
        }}
        aria-label={`View detailed format specs and information for ${card.title}`}
      >
        {/* Top Photographic Showcase */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-neutral-900 shrink-0">
          <img
            src={bgImage}
            alt={card.title}
            loading="lazy"
            decoding="async"
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

          {/* Hover Prompt */}
          <div className="absolute bottom-2.5 sm:bottom-3 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-2.5 py-1 rounded-full bg-[#FACC15] text-[#0A0A0A] font-mono text-[10px] font-bold tracking-wider shadow-md">
              CLICK TO EXPAND
            </span>
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

          {/* Bottom Card Footer with Arrow CTA */}
          <div className="pt-4 sm:pt-5 border-t border-black/10 dark:border-[#262626] flex items-center justify-end">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/5 dark:bg-white/5 group-hover:bg-[#FACC15] flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4 text-[#0A0A0A] dark:text-[#F5F5F5] group-hover:text-[#0A0A0A] transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
