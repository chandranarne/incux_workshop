import React from 'react';
import { Star, Quote, CheckCircle2, Sparkles, Award, MapPin } from 'lucide-react';
import { studentReviews } from '../data/reviews';

function ReviewCard({ review }) {
  return (
    <div className="shrink-0 w-[360px] sm:w-[420px] p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141414] backdrop-blur-xl border border-black/10 dark:border-[#262626] hover:border-[#FACC15] dark:hover:border-[#FACC15] shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      {/* Card Header: Avatar, Name, College, Session Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0A0A0A] via-[#1A1A1A] to-[#FACC15] flex items-center justify-center font-headline font-bold text-[#FACC15] text-sm shadow-sm shrink-0">
              {review.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-headline font-bold text-base text-neutral-950 dark:text-[#F5F5F5] leading-tight">
                  {review.name}
                </h4>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 dark:text-[#FACC15] shrink-0" />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono leading-tight mt-0.5">
                {review.branch}
              </p>
              <p className="text-[11px] text-amber-600 dark:text-[#FACC15] font-mono font-medium leading-tight">
                {review.college}
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-[#0A0A0A] text-neutral-400 group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors shrink-0 border border-black/10 dark:border-[#262626]">
            <Quote className="w-4 h-4" />
          </div>
        </div>

        {/* Rating and Workshop Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 pt-2 border-t border-black/10 dark:border-[#262626]">
          <div className="flex items-center gap-1">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#FACC15] text-[#EAB308]" />
            ))}
            <span className="text-xs font-mono font-bold text-neutral-900 dark:text-[#F5F5F5] ml-1">
              5.0
            </span>
          </div>

          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FACC15]/15 dark:bg-[#FACC15]/10 border border-[#FACC15]/30 text-neutral-900 dark:text-[#FACC15] font-semibold tracking-wider uppercase">
            {review.tag}
          </span>
        </div>

        {/* Headline Quote */}
        <h5 className="font-headline font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 leading-snug mb-2 group-hover:text-amber-600 dark:group-hover:text-[#FACC15] transition-colors">
          "{review.headline}"
        </h5>

        {/* Detailed Review Text */}
        <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed">
          {review.review}
        </p>
      </div>

      {/* Card Footer: Attended Workshop & Date */}
      <div className="mt-4 pt-3 border-t border-black/10 dark:border-[#262626] flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
        <span className="truncate max-w-[240px]">
          Attended: <strong className="text-neutral-900 dark:text-[#FACC15] font-semibold">{review.workshop}</strong>
        </span>
        <span className="shrink-0">{review.date}</span>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const rowOne = studentReviews.slice(0, 4);
  const rowTwo = studentReviews.slice(4, 8);

  return (
    <section
      id="reviews"
      className="relative w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] py-16 sm:py-24 border-t border-black/10 dark:border-[#262626] overflow-hidden transition-colors duration-200"
      aria-label="Student Reviews and Campus Outcomes"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15]/15 dark:bg-[#FACC15]/10 backdrop-blur-md border border-[#FACC15]/30 text-xs font-mono text-neutral-900 dark:text-[#FACC15] uppercase tracking-widest mb-4 font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Student Campus Experiences</span>
            </div>
            <h2 className="font-headline font-black text-3xl sm:text-5xl md:text-6xl text-neutral-950 dark:text-[#F5F5F5] tracking-tight leading-tight">
              What Engineers <br className="hidden sm:inline" />
              Are Saying.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed">
              Real testimonials from student developers, researchers, and campus leads who experienced our hands-on engineering immersions.
            </p>
          </div>

          {/* Quick Metrics Badge Banner */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-sm flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FACC15] text-[#EAB308]" />
                ))}
              </div>
              <span className="font-bold text-neutral-900 dark:text-[#F5F5F5]">4.96 / 5.0</span>
              <span className="text-neutral-500 dark:text-neutral-400">Average Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Single Line Scrolling Reviews Marquee Stream */}
      <div className="select-none">
        <div className="relative w-full overflow-hidden mask-gradient-x py-2">
          <div className="animate-marquee-infinite flex gap-6 px-4">
            {studentReviews.concat(studentReviews).map((review, idx) => (
              <ReviewCard key={`review-${review.id}-${idx}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
