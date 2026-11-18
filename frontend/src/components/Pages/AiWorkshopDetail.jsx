import React from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Laptop,
  Building2,
  Users,
  Terminal,
  Trophy,
  Check,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import bannerImg from '../../assets/ai_workshop_10d_banner.jpg';

export default function AiWorkshopDetail({ onBackHome }) {
  const handleRegisterClick = () => {
    window.location.assign(
      `/payment?workshopId=WS-HYBRID-10D&amount=6000&workshopTitle=${encodeURIComponent('AI Workshop')}`
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] transition-colors duration-200">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-black/10 dark:border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-neutral-600 dark:text-neutral-300 hover:text-[#EAB308] dark:hover:text-[#FACC15] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#FACC15]/15 text-neutral-900 dark:text-[#FACC15] text-xs font-mono font-bold border border-[#FACC15]/30">
            10 Days • Nov 24 - Dec 3, 2026
          </span>
        </div>
      </div>

      {/* Hero Showcase Section */}
      <div className="relative overflow-hidden bg-neutral-950 text-white border-b border-black/10 dark:border-[#262626]">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={bannerImg}
            alt="AI Workshop Banner"
            className="w-full h-full object-cover filter blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
          <div className="max-w-4xl">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15] text-[#0A0A0A] text-xs font-mono font-black tracking-wider uppercase mb-5 shadow-lg">
              <span>10-Day Combined Virtual &amp; Offline Workshop</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-headline font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-tight">
              AI Workshop
            </h1>

            <p className="mt-4 sm:mt-6 text-lg sm:text-2xl text-neutral-300 font-body font-light leading-relaxed">
              Comprehensive 10-day hands-on immersion starting with Generative AI foundations and LinkedIn branding,
              featuring <strong className="text-[#FACC15] font-semibold">2 days of offline campus labs &amp; networking at IIT Campus</strong>,
              a 4-day autonomous AI Bot build sprint, and culminating in a 24-hour competitive AI Hackathon.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <span className="text-[10px] sm:text-xs text-neutral-400 block uppercase">DATES</span>
                <span className="text-sm sm:text-base font-bold text-white block mt-0.5">Nov 24 - Dec 3</span>
                <span className="text-[11px] text-[#FACC15] block mt-0.5">10 Full Days</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <span className="text-[10px] sm:text-xs text-neutral-400 block uppercase">DELIVERY MODE</span>
                <span className="text-sm sm:text-base font-bold text-white block mt-0.5">Combined Hybrid</span>
                <span className="text-[11px] text-[#FACC15] block mt-0.5">Virtual + Offline IIT</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <span className="text-[10px] sm:text-xs text-neutral-400 block uppercase">OFFLINE VENUE</span>
                <span className="text-sm sm:text-base font-bold text-white block mt-0.5">IIT Campus</span>
                <span className="text-[11px] text-[#FACC15] block mt-0.5">Nov 27 - 28 Only</span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <span className="text-[10px] sm:text-xs text-neutral-400 block uppercase">COURSE FEE</span>
                <span className="text-sm sm:text-base font-bold text-[#FACC15] block mt-0.5">₹6,000 INR</span>
                <span className="text-[11px] text-neutral-400 block mt-0.5">All-Inclusive</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={handleRegisterClick}
                className="px-6 py-3.5 sm:py-4 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-black text-sm tracking-wider shadow-xl shadow-yellow-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Register for Workshop</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#curriculum-breakdown"
                className="px-6 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs sm:text-sm font-bold border border-white/20 transition-all flex items-center gap-2"
              >
                <span>Explore Day-by-Day Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Crucial Delivery Mode Distinction Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 dark:from-yellow-400/5 dark:via-amber-400/10 dark:to-yellow-400/5 border border-yellow-500/30 dark:border-yellow-400/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-700 dark:text-[#FACC15] uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Format Architecture: Two Offline Days &amp; Eight Virtual Days</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-headline font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                Only 2 Days are Offline at IIT Campus - All Other Days are Virtual Cloud Labs
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 font-body leading-relaxed max-w-3xl">
                To maximize accessibility for students across India, only <strong>November 27 and 28</strong> require in-person attendance at the IIT Campus for deep hardware lab work and <strong>active networking with peers, mentors, and industry professionals</strong>. The remaining 8 days are conducted online via live interactive video, Discord study lounges, and cloud GPUs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center">
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">OFFLINE AT IIT</span>
                <span className="text-sm font-bold text-amber-600 dark:text-[#FACC15] block mt-0.5">Nov 27 &amp; 28 (2 Days)</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">In-Person Labs &amp; Networking</span>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-center">
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">VIRTUAL SESSIONS</span>
                <span className="text-sm font-bold text-[#0A0A0A] dark:text-[#F5F5F5] block mt-0.5">Nov 24-26 &amp; Nov 29-Dec 3</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">Interactive Online Cloud Labs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed 10-Day Step-by-Step Schedule & Matter */}
      <section id="curriculum-breakdown" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-10 sm:mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#EAB308] dark:text-[#FACC15]">
            Curriculum &amp; Daily Roadmap
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-headline font-black text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
            Detailed 10-Day Step-by-Step Schedule
          </h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-body max-w-3xl">
            Every day is structured with purpose - blending high-bandwidth lectures, live terminal coding, peer networking, asynchronous build sprints, and competitive problem-solving.
          </p>
        </div>

        <div className="space-y-6">
          {/* STEP 1: Day 1 (Nov 24) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-sm hover:border-[#FACC15] transition-all">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A] text-xs font-mono font-black tracking-wider">
                    DAY 01 • NOVEMBER 24, 2026
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5" />
                    VIRTUAL LIVE SESSION
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-headline font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                  Introduction to the Workshop &amp; AI Engineering Foundations
                </h3>

                <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-body leading-relaxed">
                  The cohort kicks off with an immersive orientation designed to set the pace for the entire 10-day program. You will be introduced to the lead architects, mentors, and industry faculty who will guide your transformation from academic basics to industry-grade AI engineering.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Environment Setup:</strong> Python 3.11+, PyTorch, Hugging Face tokens, and cloud JupyterLab sandboxes.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Core AI Landscape:</strong> Deep dive into Transformer self-attention, encoder-decoder models, and modern tokenizers.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Cohort Onboarding:</strong> Access to private Discord study lounges, code repositories, and peer squads.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Live Q&amp;A:</strong> Direct interactive session clarifying cohort milestones, project criteria, and hackathon rules.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: Day 2 (Nov 25) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-sm hover:border-[#FACC15] transition-all">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A] text-xs font-mono font-black tracking-wider">
                    DAY 02 • NOVEMBER 25, 2026
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5" />
                    VIRTUAL LIVE SESSION
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-headline font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                  Generative AI Masterclass: LLMs, Prompt Engineering &amp; RAG
                </h3>

                <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-body leading-relaxed">
                  An intensive deep-dive into cutting-edge Generative AI technologies. Move beyond basic chatbots and learn how production LLMs actually think, parse contexts, and interface with external information systems.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>LLM Architectures:</strong> OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, and open-weight Llama 3 models.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Prompt Engineering:</strong> Chain-of-Thought (CoT), ReAct pattern, system personas, and strict JSON output schemas.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Retrieval-Augmented Generation (RAG):</strong> Vector embeddings, cosine similarity, ChromaDB, and document chunking.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Hands-on Coding Lab:</strong> Build an interactive enterprise document QA assistant over customized PDF files.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: Day 3 (Nov 26) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-sm hover:border-[#FACC15] transition-all">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A] text-xs font-mono font-black tracking-wider">
                    DAY 03 • NOVEMBER 26, 2026
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5" />
                    VIRTUAL LIVE SESSION
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-headline font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                  LinkedIn Workshop: Personal Branding &amp; Engineering Career Acceleration
                </h3>

                <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-body leading-relaxed">
                  Technical talent without professional visibility goes unnoticed. In this high-impact career masterclass, senior tech influencers and recruiting leaders teach you how to turn your technical skills into an irresistible public portfolio.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>LinkedIn Optimization:</strong> Headline crafting, rich media showcase, and keyword indexing for AI recruiters.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Proof of Work:</strong> How to document technical breakthroughs, publish architecture teardowns, and share code publicly.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Outreach Strategy:</strong> Cold messaging frameworks that actually work when contacting engineering leads and hiring managers.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Live Audit:</strong> 1-on-1 profile teardowns and templates for publishing case studies about the upcoming IIT workshops.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: Days 4 & 5 (Nov 27 - 28) - OFFLINE AT IIT */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent dark:from-yellow-400/10 dark:via-[#141414] dark:to-[#141414] border-2 border-[#EAB308] dark:border-[#FACC15] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#EAB308] dark:bg-[#FACC15] text-[#0A0A0A] font-mono text-[11px] font-black tracking-wider uppercase rounded-bl-2xl">
              EXCLUSIVE OFFLINE IMMERSION
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A] text-xs font-mono font-black tracking-wider">
                  DAYS 04 &amp; 05 • NOVEMBER 27 - 28, 2026
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  PHYSICAL IN-PERSON AT IIT CAMPUS
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-headline font-black text-[#0A0A0A] dark:text-[#F5F5F5]">
                2-Day Intensive Physical Lab &amp; Building Networking With People
              </h3>

              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-body leading-relaxed">
                Step into the prestigious academic auditoriums and compute laboratories of the <strong>IIT Campus</strong> for two unforgettable days. This is the only physical segment of the 10-day workshop, specifically crafted for high-bandwidth engineering immersion and rich human connection.
              </p>

              {/* Offline Sub-Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626]">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-[#FACC15] mb-2 uppercase">
                    <Terminal className="w-4 h-4" />
                    <span>DAY 04 (NOV 27): HIGH-PERFORMANCE LAB &amp; MULTI-AGENTS</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <li>• Physical reporting at IIT Campus Computing Arena.</li>
                    <li>• Deploying multi-agent frameworks: LangGraph, CrewAI, AutoGen.</li>
                    <li>• Real-time mentor code audits &amp; debugging on dedicated GPU rigs.</li>
                    <li>• Keynote address by visiting IIT research fellows &amp; industry architects.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626]">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-[#FACC15] mb-2 uppercase">
                    <Users className="w-4 h-4" />
                    <span>DAY 05 (NOV 28): BUILDING NETWORKING WITH PEOPLE</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <li>• <strong>Active Peer &amp; Mentor Networking:</strong> Dedicated mixers to interact with fellow student coders, research scholars, and founders.</li>
                    <li>• <strong>Team Formation:</strong> Match up with peers to form powerhouse squads for the upcoming 4-day AI Bot project &amp; hackathon.</li>
                    <li>• Roundtables on venture creation, campus placements &amp; tech trends.</li>
                    <li>• Campus tech tour, group photo sessions, and celebratory cohort lunch.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 5: Days 6 to 9 (Nov 29 - Dec 2) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-sm hover:border-[#FACC15] transition-all">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A] text-xs font-mono font-black tracking-wider">
                    DAYS 06 TO 09 • NOVEMBER 29 - DECEMBER 2, 2026
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5" />
                    VIRTUAL MINI PROJECT SPRINT
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-headline font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                  Mini Project Sprint: Building Autonomous AI Bots
                </h3>

                <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-body leading-relaxed">
                  Theory becomes reality over four concentrated days of asynchronous building and live mentor checkpoints. Using the squads formed during the IIT campus immersion, teams engineer and deploy autonomous AI bots with real-world utility.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Project Archetypes:</strong> Build Autonomous Customer Support Bots, Code Auditor Agents, or Multi-modal Research Bots.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Tool Calling &amp; API Integration:</strong> Connecting bots to web search, SQL databases, email triggers, and external APIs.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Daily Standups &amp; PR Reviews:</strong> Receive continuous pull-request feedback and architecture critiques from IncuxAI staff.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Cloud Deployment:</strong> Package your AI bot into Docker containers and deploy it live with FastAPI and interactive UI dashboards.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 6: Day 10 (Dec 3) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-sm hover:border-[#FACC15] transition-all">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A] text-xs font-mono font-black tracking-wider">
                    DAY 10 • DECEMBER 3, 2026
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    VIRTUAL GRAND FINALE
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-headline font-bold text-[#0A0A0A] dark:text-[#F5F5F5]">
                  Grand AI Hackathon (24-Hour Competitive Sprint &amp; Live Pitch)
                </h3>

                <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-body leading-relaxed">
                  The crowning event of the 10-day journey. Put everything you have learned into practice during an electrifying 24-hour virtual competitive hackathon. Teams solve challenging enterprise problem statements and present live to an esteemed jury.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Problem Statements:</strong> Real challenges in autonomous tooling, public sector AI safety, and automated workflows.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Jury Evaluation:</strong> Live 3-minute pitch &amp; demo before senior engineers from top tech companies and IIT faculty.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Cash Prizes &amp; Awards:</strong> Cash rewards for winner squads, best architectural design, and best presentation.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body">
                    <CheckCircle2 className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0 mt-0.5" />
                    <span><strong>Dual Certification:</strong> Verified completion credential with unique credential ID and instructor signatures.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Fee Section (₹6,000 INR) */}
      <section className="bg-neutral-100 dark:bg-[#111111] border-y border-black/10 dark:border-[#262626] py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#EAB308] dark:text-[#FACC15]">
              TRANSPARENT TUITION
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-headline font-black text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
              Course Fee: ₹6,000 All-Inclusive
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-body">
              One simple, flat fee covering all 10 days of training, cloud GPU access, IIT campus facilities, physical networking dinners, and hackathon participation.
            </p>
          </div>

          <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-black/10 dark:border-[#262626]">
              <div>
                <span className="text-xs font-mono font-bold text-neutral-500 uppercase block">ALL-INCLUSIVE ADMISSION</span>
                <h3 className="text-2xl sm:text-3xl font-headline font-bold text-[#0A0A0A] dark:text-[#F5F5F5] mt-1">
                  10-Day AI Workshop Pass
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-body mt-1">
                  November 24 to December 3, 2026 • 8 Virtual Days + 2 Offline Days at IIT Campus
                </p>
              </div>

              <div className="text-left md:text-right">
                <span className="text-xs font-mono text-neutral-400 block">TOTAL INVESTMENT</span>
                <div className="text-4xl sm:text-5xl font-headline font-black text-[#0A0A0A] dark:text-[#FACC15]">
                  ₹6,000
                </div>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  ✓ Taxes &amp; Compute Credits Included
                </span>
              </div>
            </div>

            {/* Inclusions Grid */}
            <div className="pt-8">
              <h4 className="text-xs font-mono font-bold text-neutral-500 uppercase mb-4 tracking-wider">
                WHAT YOUR ₹6,000 REGISTRATION INCLUDES:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm font-body">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0" />
                  <span><strong>10 Full Days:</strong> Comprehensive curriculum led by Senior AI Architects.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0" />
                  <span><strong>2 Days Offline at IIT:</strong> Physical lab entry, auditoriums &amp; hardware compute.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0" />
                  <span><strong>People Networking:</strong> Structured mixers with peers, founders &amp; tech mentors.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0" />
                  <span><strong>GenAI Masterclass:</strong> Foundation models, prompt engineering &amp; RAG architectures.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0" />
                  <span><strong>LinkedIn Branding:</strong> Complete portfolio engineering &amp; career growth tactics.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0" />
                  <span><strong>AI Bot Mini Project:</strong> 4-day guided hands-on autonomous bot development.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0" />
                  <span><strong>24h AI Hackathon:</strong> Competitive sprint, jury review, awards &amp; cash prizes.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#EAB308] dark:text-[#FACC15] shrink-0" />
                  <span><strong>Official Credential:</strong> Verified Dual Certificate of Achievement &amp; Completion.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/10 dark:border-[#262626] flex items-center justify-end">

              <button
                onClick={handleRegisterClick}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-xs sm:text-sm tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                Register for Workshop
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
