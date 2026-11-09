// Comprehensive Details & Authentic Photography for Workshop Formats
// Displayed in the "Where Ideas Become Experience" Detail Popup Modal

import auditoriumImg from '../assets/auditorium_workshop.jpg';
import labImg from '../assets/hands_on_lab.jpg';
import mentorImg from '../assets/mentor_guidance.jpg';
import campusHallImg from '../assets/campus_hall_card.jpg';
import realHackathonImg from '../assets/real_hackathon_2k26.jpg';
import guestLectureSpeakerImg from '../assets/guest_lecture_speaker.jpg';
import aiPresentationSpeakerImg from '../assets/ai_presentation_speaker.jpg';
import staircaseCohortImg from '../assets/staircase_group_cohort.jpg';
import campusOutdoorCohortImg from '../assets/campus_outdoor_cohort.jpg';

// Event photography imports
import w03 from '../assets/events/workshops/workshop_03.jpg';
import w04 from '../assets/events/workshops/workshop_04.jpg';
import w06 from '../assets/events/workshops/workshop_06.jpg';
import w08 from '../assets/events/workshops/workshop_08.jpg';
import w09 from '../assets/events/workshops/workshop_09.jpg';
import w10 from '../assets/events/workshops/workshop_10.jpg';
import w12 from '../assets/events/workshops/workshop_12.jpg';
import w13 from '../assets/events/workshops/workshop_13.jpg';
import w14 from '../assets/events/workshops/workshop_14.jpg';
import w16 from '../assets/events/workshops/workshop_16.jpg';
import w18 from '../assets/events/workshops/workshop_18.jpg';

import h01 from '../assets/events/hackathons/hackathon_01.jpg';
import h03 from '../assets/events/hackathons/hackathon_03.jpg';
import h06 from '../assets/events/hackathons/hackathon_06.jpg';
import h09 from '../assets/events/hackathons/hackathon_09.jpg';

import gl01 from '../assets/events/guest_lectures/guest_lecture_01.jpg';
import gl02 from '../assets/events/guest_lectures/guest_lecture_02.jpg';
import gl03 from '../assets/events/guest_lectures/guest_lecture_03.jpg';
import gl05 from '../assets/events/guest_lectures/guest_lecture_05.jpg';

export const workshopFormatDetails = {
  'iit-workshops': {
    id: 'iit-workshops',
    number: '01',
    title: 'Workshops @ IIT',
    subtitle: 'Elite Immersive Research & Applied AI Masterclasses at Premier IIT Campuses',
    category: 'Premier Academic Track',
    location: 'IIT Hyderabad & Premier Research Institutions',
    badge: 'Tier-1 Research Campus Immersion',
    heroImage: auditoriumImg,
    gallery: [
      { image: auditoriumImg, caption: 'Auditorium Session at IIT Hyderabad with 200+ attendees' },
      { image: w03, caption: 'Generative AI & Agentic Workflow Design Lab' },
      { image: w06, caption: 'Full-Stack Agentic AI Immersion Cohort' },
      { image: staircaseCohortImg, caption: 'Grand Cohort Commemoration at IIT Research Block' }
    ],
    overview: 'Workshops @ IIT are premier technical deep-dives conducted directly inside the world-class laboratories and auditoriums of Indian Institutes of Technology. Developed in coordination with IIT research scholars and seasoned industry architects, these cohorts bridge the gap between abstract academic math and real-world industrial software execution.',
    howItHelps: [
      {
        title: 'Tier-1 Academic Exposure',
        description: 'Students experience the authentic research culture, high-performance computing clusters, and rigorous problem-solving standards of an IIT campus firsthand.'
      },
      {
        title: 'Demystifying Cutting-Edge Frontier Tech',
        description: 'Go beyond textbook coding. Learn how production AI models, autonomous multi-agent systems, and distributed GPU pipelines are designed and scaled.'
      },
      {
        title: 'Portfolio & Profile Transformation',
        description: 'Every participant leaves with a tangible, verified GitHub project and prestigious credentials that stand out prominently on resumes and LinkedIn.'
      }
    ],
    whatYouLearn: [
      'Multi-modal LLM fine-tuning, tokenization strategies, and prompt engineering pipelines',
      'Autonomous agent loops, tool-calling protocols (LangGraph, AutoGen), and state persistence',
      'Dense vector embeddings, retrieval-augmented generation (RAG), and vector databases',
      'Scalable cloud model serving, quantization, and edge deployment architectures'
    ],
    networking: {
      headline: 'Direct Mentorship with IIT Researchers & Tech Leaders',
      points: [
        'Engage 1-on-1 with IIT faculty, PhD scholars, and Google/Industry senior leads during dedicated Q&A hours.',
        'Gain insider roadmaps for higher education (MS, PhD), research publication guidance, and Tier-1 engineering careers.',
        'Form lifelong peer networks with the sharpest collegiate coders from across India.'
      ]
    },
    targetAudience: 'B.Tech / M.Tech students in CSE, IT, AI/ML, Data Science, ECE, and developers aiming for elite technical roles.'
  },

  'online-workshops': {
    id: 'online-workshops',
    number: '02',
    title: 'Online Workshops',
    subtitle: 'Interactive Pan-India Remote Cohorts with Real-Time Cloud Sandboxes',
    category: 'Digital Learning Track',
    location: 'Online (Interactive Live Streamed Sandboxes)',
    badge: 'Pan-India Remote Access',
    heroImage: w12,
    gallery: [
      { image: w12, caption: 'Cloud Infrastructure & Live Deployment Hands-on Sandbox' },
      { image: w04, caption: 'Industrial Backend Systems & Scalable API Code Lab' },
      { image: w10, caption: 'Python & Advanced Data Structures Live Coding' },
      { image: w14, caption: 'Database Optimization & Distributed SQL Masterclass' }
    ],
    overview: 'Online Workshops provide barrier-free, high-octane engineering deep dives accessible from anywhere in India. Rather than passive video lectures, our online cohorts feature synchronized browser cloud IDEs, instant live code audits, and interactive mentor checkpoints.',
    howItHelps: [
      {
        title: 'Zero Geographical Barriers',
        description: 'Students from any tier-2 or tier-3 college can access the exact same elite engineering curriculum and industry mentors as top metropolitan colleges.'
      },
      {
        title: 'Live Interactive Debugging',
        description: 'Stuck on a bug? Instructors and teaching assistants hop into your cloud terminal live to review code, diagnose stack traces, and teach clean debugging.'
      },
      {
        title: 'Flexible, High-Retention Learning',
        description: 'Combines real-time sprints with recorded walkthroughs, code templates, and lifetime access to sandbox repositories.'
      }
    ],
    whatYouLearn: [
      'Full-stack AI architecture: building responsive frontends connected to asynchronous AI workers',
      'High-performance backend API design with Node.js, Express, FastAPI, and Docker',
      'Real-time streaming responses, WebSockets, and event-driven architectures',
      'Version control mastery: Git branch hygiene, CI/CD pipelines, and GitHub Actions'
    ],
    networking: {
      headline: 'Vibrant Pan-India Developer Community & Async Mentorship',
      points: [
        'Join exclusive IncuxAI Discord & Slack developer circles with 3,000+ verified engineering peers.',
        'Direct access to remote software leads from high-growth startups and tech enterprises.',
        'Collaborative pair-programming rooms and hackathon team-matching channels.'
      ]
    },
    targetAudience: 'Any student or self-taught developer looking for top-tier hands-on engineering training without travel logistics.'
  },

  'offline-colleges': {
    id: 'offline-colleges',
    number: '03',
    title: 'Offline Workshops @ Colleges',
    subtitle: 'High-Energy On-Ground Immersions in Your Collegiate Auditoriums & Computer Labs',
    category: 'Campus Experiences Track',
    location: 'Collegiate Campuses Across Andhra Pradesh, Telangana & Pan-India',
    badge: '500+ Auditorium & Lab Capacity',
    heroImage: campusHallImg,
    gallery: [
      { image: campusHallImg, caption: 'Collegiate Auditorium Session with 500+ Students' },
      { image: w08, caption: 'Department Computer Lab Hands-On ML Pipelines' },
      { image: w09, caption: 'Student Team Collaborative Sprints & Peer Code Audits' },
      { image: w18, caption: 'Workshop Graduation & Authorized Certificate Distribution' }
    ],
    overview: 'We bring industry directly into your college campus. IncuxAI transforms college auditoriums and computer labs into high-energy developer hubs where hundreds of students code simultaneously, interact with dynamic visual slides, and solve real engineering challenges.',
    howItHelps: [
      {
        title: 'Breaks Academic Complacency',
        description: 'Shifts student mindset from rote exam memorization to true product-building and problem-solving.'
      },
      {
        title: 'Whole-Department Uplift',
        description: 'Entire student cohorts level up simultaneously, elevating the college placement record and campus technical culture.'
      },
      {
        title: 'Zero Student Travel Required',
        description: 'Complete hands-on experience delivered right in your campus computer labs with zero logistical friction.'
      }
    ],
    whatYouLearn: [
      'Modern Python & Data Structures with direct application to automated systems',
      'Database design, indexing, and high-concurrency SQL queries for enterprise workloads',
      'Practical software engineering: modular code, refactoring patterns, and unit tests',
      'Building and deploying real capstone web applications from scratch'
    ],
    networking: {
      headline: 'Campus Peer Squads & On-Ground Mentor Availability',
      points: [
        'Mentors walk around the laboratory aisles providing real-time 1-on-1 guidance and encouragement.',
        'Learn how to form effective collegiate developer clubs and competitive coding squads.',
        'College placement preparation: mock technical interview questions and resume restructuring.'
      ]
    },
    targetAudience: 'Entire college batches (2nd, 3rd, and 4th-year engineering students) and academic departments seeking placement transformation.'
  },

  'guest-lectures': {
    id: 'guest-lectures',
    number: '04',
    title: 'Guest Lectures with Company Experts',
    subtitle: 'Direct Insights, Architectures & Career Guidance from Enterprise Practitioners',
    category: 'Industry Connect Track',
    location: 'Executive Keynotes & Interactive Q&A Sessions',
    badge: 'Tech Mahindra • Deloitte • TCS • Walmart • Google',
    heroImage: guestLectureSpeakerImg,
    gallery: [
      { image: guestLectureSpeakerImg, caption: 'Mr. Pardha Saradhi Annam (Backend Developer) conducting Java Systems Deep-Dive' },
      { image: aiPresentationSpeakerImg, caption: 'Ms. Sreekaree Jonnalagadda (Tech Mahindra) on Demystifying GenAI & Careers' },
      { image: gl03, caption: 'Mr. Rakeshkumar Pudi (Deloitte USI) on NLP & Enterprise Analytics' },
      { image: gl05, caption: 'Interactive Live Q&A with 300+ Students in Main Auditorium' }
    ],
    overview: 'Guest Lectures bring senior software engineers, delivery managers, cybersecurity architects, and data analysts from Fortune 500 technology powerhouses straight to students. Speakers share real architectural case studies, corporate expectations, and unvarnished career realities.',
    howItHelps: [
      {
        title: 'Understand What Companies Actually Hire For',
        description: 'Students learn exactly what tech leads evaluate in technical interviews, and why 90% of traditional resumes get screened out.'
      },
      {
        title: 'Real Enterprise Case Studies',
        description: 'Hear how companies handle millions of requests per second, survive zero-day cyber threats, and deploy massive LLMs.'
      },
      {
        title: 'Confidence & Soft-Skills Transformation',
        description: 'Master professional communication, corporate demeanor, and how to articulate technical decisions clearly to leadership.'
      }
    ],
    whatYouLearn: [
      'Enterprise LLM pipelines and Generative AI career roadmaps (Tech Mahindra session)',
      'Clean backend architecture, OOP fundamentals, and microservices in production (Java session)',
      'Enterprise NLP, vector search, and data analytics consulting practices (Deloitte USI session)',
      'Cybersecurity defenses, containment, and zero-trust cloud architectures (Walmart session)'
    ],
    networking: {
      headline: 'Direct Dialogue with Corporate Hiring & Delivery Managers',
      points: [
        'Interactive open-floor Q&A sessions: ask speakers about salary benchmarks, off-campus hiring, and industry trends.',
        'Connect directly on LinkedIn with established industry leaders who can provide guidance and mentorship.',
        'Guidance on cracking technical rounds, system design questions, and behavioral interview hurdles.'
      ]
    },
    targetAudience: 'Engineering students in pre-final and final years preparing for campus placements and technical interviews.'
  },

  'ai-bootcamps': {
    id: 'ai-bootcamps',
    number: '05',
    title: 'AI Bootcamps in Your College',
    subtitle: '5-Day Continuous Engineering Sprints Taking Students to Autonomous AI Mastery',
    category: 'Intensive Immersion Track',
    location: 'College Advanced Computing Laboratories',
    badge: '5-Day Hands-on Intensive Bootcamp',
    heroImage: labImg,
    gallery: [
      { image: labImg, caption: 'Continuous Coding & Code Inspection in Campus Lab' },
      { image: w16, caption: 'Applied Machine Learning Engineering Sprints' },
      { image: w13, caption: 'Enterprise Architecture & Clean Code Refactoring' },
      { image: campusOutdoorCohortImg, caption: 'Graduating Cohort Celebration & Faculty Interaction' }
    ],
    overview: 'Our 5-Day AI Bootcamps are rigorous, sprint-based immersion programs conducted in college computer laboratories. Led by a team of multiple industry practitioners, students build production-ready projects from scratch over 30+ hours of continuous hands-on coding.',
    howItHelps: [
      {
        title: 'Zero to Hero AI Fluency',
        description: 'Takes students from basic Python knowledge to building and deploying complex neural network and LLM applications.'
      },
      {
        title: '4:1 Mentorship Ratio in Lab',
        description: 'With four or more active mentors walking the floor, no student is left behind or stuck on a syntax error.'
      },
      {
        title: 'Complete Capstone Project',
        description: 'Students finish with a live, hosted web application to showcase on their portfolios and during placement interviews.'
      }
    ],
    whatYouLearn: [
      'Day 1: Modern Python paradigms, vectorized computing with NumPy, and clean code hygiene',
      'Day 2: Machine Learning pipelines, model training, evaluation metrics, and dataset curation',
      'Day 3: Deep Learning fundamentals, neural architectures, and transformer attention mechanisms',
      'Day 4: Generative AI, prompt engineering, agent loops, and API orchestration',
      'Day 5: Containerization, cloud deployment, capstone presentations, and jury certification'
    ],
    networking: {
      headline: 'Multi-Mentor Collaboration & Startup Connection',
      points: [
        'Close daily pairing with 4 veteran tech trainers across frontend, backend, ML, and cloud infrastructure.',
        'Top performers receive direct referrals to partner startup networks and hiring pools.',
        'Comprehensive code reviews and feedback sessions on each student squad’s repository.'
      ]
    },
    targetAudience: 'Motivated students wanting a transformative sprint to become production-ready AI software engineers.'
  },

  'hackathons': {
    id: 'hackathons',
    number: '06',
    title: 'AI Hackathons & Sprints',
    subtitle: 'Competitive 24-48 Hour Build Sprints Tackling Real Corporate Challenge Statements',
    category: 'Build Challenges Track',
    location: 'Regional Campuses, Innovation Centers & Tech Hubs',
    badge: '24-48 Hr Competitive Sprints',
    heroImage: realHackathonImg,
    gallery: [
      { image: realHackathonImg, caption: 'AI x Regional Hackathon 2k26 Launch Stage' },
      { image: h01, caption: 'Opening Sprint Briefing with 450+ Hackers' },
      { image: h03, caption: 'Squad Ideation & Rapid Solution Architecture in War Room' },
      { image: h06, caption: 'Live Jury Pitches & Technical Demonstrations' },
      { image: h09, caption: 'Podium Honors & Cash Prize Felicitation Ceremony' }
    ],
    overview: 'AI Hackathons & Sprints are high-octane engineering competitions where student squads work around the clock to architect, code, and deploy functional prototypes addressing real-world problem statements under live jury evaluation.',
    howItHelps: [
      {
        title: 'Accelerated Team Problem Solving',
        description: 'Learn the real art of shipping working software under tight deadlines, managing team conflicts, and prioritizing MVP features.'
      },
      {
        title: 'Pitching & Public Speaking Under Pressure',
        description: 'Engineers learn to sell their ideas, present technical architecture succinctly, and defend choices before experienced judges.'
      },
      {
        title: 'Cash Prizes, Awards & Prestige',
        description: 'Win attractive cash prize pools, trophies, and formal commendation letters from industry sponsors.'
      }
    ],
    whatYouLearn: [
      'Rapid API prototyping and integrating frontier AI model APIs within hours',
      'Team Git collaboration: resolving merge conflicts, branch workflows, and PR reviews',
      'Building responsive, polished user interfaces that impress judges within 2 minutes',
      'Crafting compelling 3-minute technical pitch decks and live demo scripts'
    ],
    networking: {
      headline: 'Judges, Angel Scouts & Corporate Talent Acquisition',
      points: [
        'Pitch directly in front of CTOs, corporate engineering leads, and technology venture scouts.',
        'High-performing squads frequently receive direct internship offers and fast-tracked interview calls.',
        'Build connections with fellow top-tier hackathon winners across multiple regional colleges.'
      ]
    },
    targetAudience: 'Student builders, competitive programmers, UI/UX designers, and problem solvers ready to build under real deadlines.'
  }
};
