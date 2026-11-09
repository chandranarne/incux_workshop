import auditoriumImg from '../assets/auditorium_workshop.jpg';
import labImg from '../assets/hands_on_lab.jpg';
import mentorImg from '../assets/mentor_guidance.jpg';
import campusHallImg from '../assets/campus_hall_card.jpg';
import guestLectureSpeakerImg from '../assets/guest_lecture_speaker.jpg';
import aiPresentationSpeakerImg from '../assets/ai_presentation_speaker.jpg';
import campusOutdoorCohortImg from '../assets/campus_outdoor_cohort.jpg';
import staircaseCohortImg from '../assets/staircase_group_cohort.jpg';

export const workshopCards = [
  {
    id: "iit-workshops",
    number: "01",
    title: "Workshops @ IIT",
    category: "University Workshops",
    location: "IIT Hyderabad",
    description: "High-impact technical deep-dives delivered in premier research institutions, engaging students in frontier technologies.",
    tag: "Premier Academic",
    highlight: "2 Completed Editions",
    gradient: "from-blue-600/20 via-transparent to-transparent"
  },
  {
    id: "online-workshops",
    number: "02",
    title: "Online Workshops",
    category: "Digital Learning",
    location: "Online",
    description: "Interactive remote cohorts with real-time code environments, expert Q&A, and project feedback across India.",
    tag: "Pan-India Access",
    highlight: "Live Coding & Labs",
    gradient: "from-emerald-600/20 via-transparent to-transparent"
  },
  {
    id: "offline-colleges",
    number: "03",
    title: "Offline Workshops @ Colleges",
    category: "Campus Experiences",
    location: "Andhra Pradesh & Telangana",
    description: "On-ground multi-day intensive classroom experiences fostering peer collaboration and direct mentor guidance.",
    tag: "On-Campus Immersive",
    highlight: "500+ Hall Capacity",
    gradient: "from-amber-600/20 via-transparent to-transparent"
  },
  {
    id: "guest-lectures",
    number: "04",
    title: "Guest Lectures with Company Experts",
    category: "Industry Connect",
    location: "Industry-led sessions",
    description: "Practicing architects, research scholars, and enterprise leads sharing engineering realities and domain challenges.",
    tag: "Practitioner Led",
    highlight: "Real-world Architecture",
    gradient: "from-purple-600/20 via-transparent to-transparent"
  },
  {
    id: "ai-bootcamps",
    number: "05",
    title: "AI Bootcamps",
    category: "Intensive Learning",
    location: "University campuses",
    description: "Multi-day immersion programs taking engineering students from foundational models to autonomous agent deployment.",
    tag: "5-Day Deep Dive",
    highlight: "Capstone Projects",
    gradient: "from-rose-600/20 via-transparent to-transparent"
  },
  {
    id: "hackathons",
    number: "06",
    title: "AI Hackathons & Sprints",
    category: "Build Challenges",
    location: "Regional Campuses & Tech Hubs",
    description: "High-energy 24-hour and 48-hour competitive engineering hackathons where student developer squads tackle real corporate challenge statements with live code commits.",
    tag: "24-48 Hr Sprints",
    highlight: "2 Editions • 450+ Hackers",
    gradient: "from-yellow-600/20 via-transparent to-transparent"
  }
];

export const featuredWorkshops = [
  {
    id: "genai-career-hindu",
    title: "Demystifying Generative AI & Career Opportunities",
    category: "Guest Lectures",
    dates: "July 25th",
    participants: "150",
    speaker: "Ms. Sreekaree Jonnalagadda — Software Engineer, Tech Mahindra",
    location: "Hindu Engineering and Technology College, Guntur",
    prominent: true,
    association: "Corporate Tech Immersion Series",
    badge: "Guest Lecture",
    image: aiPresentationSpeakerImg,
    deliverables: [
      "Enterprise GenAI architecture teardown & industry LLM workflows",
      "Interactive career roadmap from foundation models to production",
      "Live engineering insights from Tech Mahindra software lead"
    ]
  },
  {
    id: "java-fundamentals-hindu",
    title: "Java Programming Fundamentals",
    category: "Guest Lectures",
    dates: "August 1st",
    participants: "65",
    speaker: "Mr. Pardha Saradhi Annam — Backend Developer (2+ years' industry experience)",
    location: "Hindu Engineering and Technology College, Guntur",
    prominent: true,
    association: "Core Systems & Backend Track",
    badge: "Guest Lecture",
    image: guestLectureSpeakerImg,
    deliverables: [
      "OOP paradigms, JVM memory lifecycle & multithreaded handlers",
      "Production-grade clean architecture & backend microservice patterns",
      "Live refactoring walkthroughs with 2+ yr enterprise practitioner"
    ]
  },
  {
    id: "nlp-deloitte-hindu",
    title: "Natural Language Processing (NLP)",
    category: "Guest Lectures",
    dates: "August 7, 2026",
    participants: "75",
    speaker: "Mr. Rakeshkumar Pudi — Analyst at Deloitte USI",
    location: "Hindu Engineering and Technology College, Guntur",
    prominent: true,
    association: "Applied AI & Industry Analytics",
    badge: "Guest Lecture",
    image: campusOutdoorCohortImg,
    deliverables: [
      "Modern NLP pipelines: tokenization, dense embeddings & transformers",
      "Enterprise text analytics & vector search architectures",
      "Industry consulting case study & analytics frameworks at Deloitte USI"
    ]
  },
  {
    id: "soft-skills-tcs-hindu",
    title: "Soft Skills & Personality Development",
    category: "Guest Lectures",
    dates: "Executive Masterclass",
    participants: "300",
    speaker: "Mr. Ambujakshan Nair — Delivery Manager, TCS BFSI",
    location: "Hindu College, Guntur",
    prominent: true,
    association: "Executive Leadership & Career Excellence",
    badge: "Executive Masterclass",
    image: staircaseCohortImg,
    deliverables: [
      "Executive corporate communication & technical interview mastery",
      "Delivery management principles from TCS BFSI enterprise operations",
      "Professional behavioral agility & leadership scaling for engineers"
    ]
  },
  {
    id: "genai-iit-hyd",
    title: "Generative AI, IIT Hyderabad",
    category: "University Workshops",
    dates: "January 3–4",
    participants: "200",
    speaker: "Mohan Sir, Senior Lead at Google, Hyderabad (automotive technology domain)",
    location: "IIT Hyderabad",
    prominent: true,
    association: null,
    badge: "IIT Hyderabad Edition",
    image: auditoriumImg,
    deliverables: [
      "Frontier generative models and enterprise automotive AI",
      "Direct technical deep-dive led by Senior Lead at Google",
      "Real-world architecture teardown and capstone demonstrations"
    ]
  },
  {
    id: "agentic-iit-hyd",
    title: "Agentic AI, IIT Hyderabad",
    category: "University Workshops",
    dates: "January 31 – February 1",
    participants: "150",
    speaker: "Anvesh G, PhD scholar at IIT Hyderabad",
    location: "IIT Hyderabad",
    prominent: false,
    association: null,
    badge: "IIT Hyderabad Edition",
    image: labImg,
    deliverables: [
      "Autonomous agent loops, tool-use protocols and state persistence",
      "Multi-agent task decomposition and memory schemas",
      "Hands-on execution in high-compute sandbox environments"
    ]
  },
  {
    id: "genai-chalapathi",
    title: "Generative AI, Chalapathi College",
    category: "University Workshops",
    dates: "March 1",
    participants: "500+",
    speaker: "Dilip Sir, Cybersecurity Lead at Walmart",
    location: "Chalapathi College",
    prominent: false,
    association: "Organised in association with JVV and Chalapathi College",
    badge: "500+ Auditorium Event",
    image: campusHallImg,
    deliverables: [
      "Large-scale auditorium technical immersion for 500+ attendees",
      "Enterprise cybersecurity and LLM defense mechanisms",
      "Comprehensive certification and industry pedigree recognition"
    ]
  },
  {
    id: "agentic-vja",
    title: "Agentic AI, Vijayawada",
    category: "University Workshops",
    dates: "Date to be confirmed",
    participants: "100+",
    speaker: "Dilip Sir, Cybersecurity Lead at Walmart",
    location: "Vijayawada",
    prominent: false,
    association: null,
    badge: "Campus Workshop",
    image: mentorImg,
    deliverables: [
      "Production agent design patterns and enterprise telemetry",
      "Zero-trust engineering principles in AI deployments",
      "Interactive code audits and live security assertions"
    ]
  },
  {
    id: "ai-bootcamp-college",
    title: "Five-day AI Bootcamp, Geethanjali College",
    category: "University Workshops",
    dates: "Completed Edition",
    participants: "300+",
    speaker: "Rakesh Sir, Rohith Sir, Saibaba Sir, Yaswanth Sir",
    location: "Geethanjali College Campus, Hyderabad",
    prominent: false,
    association: null,
    badge: "5-Day Intensive Bootcamp",
    image: auditoriumImg,
    deliverables: [
      "5-day comprehensive end-to-end AI engineering sprint",
      "Multi-mentor guided laboratory sessions with 4 enterprise leads",
      "Capstone projects and production-ready code repositories"
    ]
  }
];
