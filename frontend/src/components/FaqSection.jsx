import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

const faqItems = [
  {
    id: 'mentors',
    question: 'Who mentors and leads the IncuxAI sessions?',
    answer:
      'All IncuxAI sessions are led directly by enterprise tech leads and practitioners from premier global engineering firms including Google, Walmart, PayPal, and PwC, along with PhD scholars and researchers from institutions like IIT Hyderabad. Students learn real-world architecture patterns, LLMOps, and agentic workflows directly from engineers who build them in production.'
  },
  {
    id: 'formats',
    question: 'What types of programs and cohorts does IncuxAI deliver?',
    answer:
      'We deliver three signature program tracks: 1) Hands-on Multi-Day Technical Workshops (Full-Stack AI, Multi-Agent Systems, LangGraph), 2) 24-48h Build Sprints and Collegiate Hackathons (such as the AI x Anantapur Police Hackathon), and 3) Executive Tech Leadership Keynotes & Guest Lectures.'
  },
  {
    id: 'certificates',
    question: 'Are verified certificates issued upon completion?',
    answer:
      'Yes. Every verified participant receives an official IncuxAI Digital Certificate of Completion embedded with unique credential validation telemetry. These certificates verify hands-on project submissions and are recognized for student portfolios and professional profiles.'
  },
  {
    id: 'campuses',
    question: 'How can our college or university collaborate with IncuxAI?',
    answer:
      'Colleges and academic departments can initiate collaboration through our online partner request form. Our academic coordination team will align on custom curriculum tracks, lab infrastructure requirements, and dates to deliver in-person auditorium keynotes and lab bootcamps tailored to your curriculum schedule.'
  },
  {
    id: 'format-mode',
    question: 'Are sessions conducted offline on campus or online?',
    answer:
      'Both! We conduct immersive in-person workshops across collegiate campus auditoriums and computer labs across India (with major hubs in Telangana and Andhra Pradesh), as well as intensive live virtual cohorts with real-time mentor code reviews for remote participants.'
  },
  {
    id: 'prerequisites',
    question: 'What prerequisites are required to participate?',
    answer:
      'Our programs cater to undergraduate and postgraduate students from foundational to advanced levels. Having a basic understanding of Python, JavaScript, or fundamentals of software engineering is helpful. Every workshop includes starter repository templates, cloud sandbox environments, and step-by-step guidance.'
  }
];

export default function FaqSection() {
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Side-Heading and Badge (No Section Number) */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF9C3] dark:bg-yellow-950/40 border border-yellow-400/40 text-xs font-mono font-bold text-neutral-900 dark:text-[#FACC15] uppercase tracking-wider mb-4 shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-[#FACC15]" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="font-headline font-black text-3xl sm:text-4xl lg:text-5xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
          Got Questions? We Have Answers.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
          Everything you need to know about IncuxAI immersive workshops, collegiate hackathons, verified credentials, and institutional partnerships.
        </p>
      </div>

      {/* Accordion Container */}
      <div className="max-w-4xl mx-auto space-y-4">
        {faqItems.map((item, index) => {
          const isOpen = openId === item.id;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-white dark:bg-[#141414] border-yellow-400/60 shadow-lg shadow-yellow-500/5'
                  : 'bg-white/80 dark:bg-[#141414]/70 border-black/10 dark:border-[#262626] hover:border-black/20 dark:hover:border-neutral-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 sm:py-6 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                    isOpen
                      ? 'bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A]'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    0{index + 1}
                  </span>
                  <span className="font-headline font-bold text-base sm:text-lg text-[#0A0A0A] dark:text-[#F5F5F5]">
                    {item.question}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                  isOpen
                    ? 'rotate-180 bg-[#FEF9C3] dark:bg-yellow-950/60 border-yellow-400 text-neutral-900 dark:text-[#FACC15]'
                    : 'bg-neutral-50 dark:bg-neutral-900 border-black/10 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-black/5 dark:border-white/5 font-normal pl-[52px]">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Still Have Questions CTA Banner */}
      <div className="max-w-4xl mx-auto mt-12 p-6 sm:p-8 rounded-3xl bg-[#FEF9C3] dark:bg-[#1A1A1A] border border-yellow-400/50 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] dark:bg-[#FACC15] flex items-center justify-center shrink-0 text-[#FACC15] dark:text-[#0A0A0A] shadow-md">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-headline font-extrabold text-lg text-neutral-900 dark:text-neutral-100">
              Have a specific question about an upcoming cohort?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-400 font-mono mt-0.5">
              Connect directly with our academic team for personalized assistance.
            </p>
          </div>
        </div>

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A] font-mono text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <span>Ask Our Team</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}
