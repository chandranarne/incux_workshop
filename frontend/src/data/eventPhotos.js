// Structured Event Photography Data for IncuxAI Platform
// Categorized by Workshops, Hackathons, and Guest Lectures

// --- Guest Lectures Photography ---
import gl01 from '../assets/events/guest_lectures/guest_lecture_01.jpg';
import gl02 from '../assets/events/guest_lectures/guest_lecture_02.jpg';
import gl03 from '../assets/events/guest_lectures/guest_lecture_03.jpg';
import gl05 from '../assets/events/guest_lectures/guest_lecture_05.jpg';
import gl07 from '../assets/events/guest_lectures/guest_lecture_07.jpg';
import gl08 from '../assets/events/guest_lectures/guest_lecture_08.jpg';

// --- Hackathons Photography ---
import h01 from '../assets/events/hackathons/hackathon_01.jpg';
import h02 from '../assets/events/hackathons/hackathon_02.jpg';
import h04 from '../assets/events/hackathons/hackathon_04.jpg';
import h05 from '../assets/events/hackathons/hackathon_05.jpg';
import h06 from '../assets/events/hackathons/hackathon_06.jpg';

// --- Workshops Photography ---
import w03 from '../assets/events/workshops/workshop_03.jpg';
import w04 from '../assets/events/workshops/workshop_04.jpg';
import w06 from '../assets/events/workshops/workshop_06.jpg';
import w08 from '../assets/events/workshops/workshop_08.jpg';
import w09 from '../assets/events/workshops/workshop_09.jpg';
import w10 from '../assets/events/workshops/workshop_10.jpg';
import w12 from '../assets/events/workshops/workshop_12.jpg';
import w13 from '../assets/events/workshops/workshop_13.jpg';
import w14 from '../assets/events/workshops/workshop_14.jpg';

// --- User Anantapur Police Hackathon Photography (in Hackathons tab only) ---
import policeHackathonBannerImg from '../assets/police_hackathon_banner.jpg';
import communityHallCohortImg from '../assets/community_hall_cohort.jpg';
import auditoriumCodingLabImg from '../assets/auditorium_coding_lab.jpg';
import policeTeamLaptopDemoImg from '../assets/police_team_laptop_demo.jpg';

export const eventPhotos = {
  workshops: [
    { id: 'w-03', image: w03, title: 'Generative AI & Agentic Workflow Design', location: 'University Compute Arena', badge: 'GENAI SPRINT', date: 'Live Project Sandbox' },
    { id: 'w-04', image: w04, title: 'Industrial Backend Systems & API Scaling', location: 'Engineering Block Lab', badge: 'SYSTEMS LAB', date: 'Practitioner Guidance' },
    { id: 'w-06', image: w06, title: 'Full-Stack Agentic AI Immersion Cohort', location: 'Advanced Computer Center', badge: 'CAMPUS COHORT', date: 'Practical Sprint' },
    { id: 'w-08', image: w08, title: 'Machine Learning Pipelines in Production', location: 'Department Lab 02', badge: 'ML PIPELINES', date: 'Industrial Practice' },
    { id: 'w-09', image: w09, title: 'Student Team Collaborative Sprint', location: 'Software Engineering Lab', badge: 'COLLABORATIVE', date: 'Group Sprint' },
    { id: 'w-10', image: w10, title: 'Python & Data Structures Mastery', location: 'University Lab Complex', badge: 'FOUNDATIONS', date: 'Core Curriculum' },
    { id: 'w-12', image: w12, title: 'Cloud Infrastructure & Deployment Hands-On', location: 'Cloud Compute Suite', badge: 'DEVOPS LAB', date: 'Live Deployment' },
    { id: 'w-13', image: w13, title: 'Enterprise Architecture & Clean Code Lab', location: 'Systems Architecture Suite', badge: 'ARCHITECTURE', date: 'Code Quality Sprint' },
    { id: 'w-14', image: w14, title: 'Database Optimization & SQL Mastery', location: 'Campus Data Lab', badge: 'DATA SYSTEMS', date: 'Query Performance' }
  ],
  hackathons: [
    { id: 'h-01', image: h01, title: 'AI x Regional Hackathon 2k26 Launch', location: 'Regional Technology Arena', badge: 'OPENING SPRINT', date: '48-Hour Sprint' },
    { id: 'h-02', image: h02, title: 'Squad Ideation & Rapid AI Prototyping', location: 'Innovation Arena Block', badge: 'IDEATION LAB', date: 'Overnight Build' },
    // 3rd Picture: User's Police Hackathon Flagship Banner
    { id: 'h-police-banner', image: policeHackathonBannerImg, title: 'AI x Anantapur Police Hackathon 2K26', location: 'DPO Office Anantapur & RTIH', badge: 'FLAGSHIP STAGE', date: '28 March Flagship Launch' },
    { id: 'h-04', image: h04, title: 'Mentorship Rounds & Technical Evaluation', location: 'Central Stage Arena', badge: 'MENTOR REVIEW', date: 'System Architecture' },
    { id: 'h-05', image: h05, title: 'Active Coding Sprint & Algorithm Tuning', location: 'Regional Tech Center', badge: 'ACTIVE SPRINT', date: 'Continuous Coding' },
    { id: 'h-06', image: h06, title: 'Live Jury Demonstrations & Product Pitches', location: 'Auditorium Stage', badge: 'JURY EVALUATION', date: 'Prototype Demos' },
    // Last Three Pictures: User's 3 Campus Immersion & Police Demo Photos
    { id: 'h-community-hall', image: communityHallCohortImg, title: 'Campus Community Hall Engineering Cohort', location: 'Collegiate Community Hall', badge: 'CAMPUS COHORT', date: 'Student & Faculty Assembly' },
    { id: 'h-auditorium-lab', image: auditoriumCodingLabImg, title: 'Auditorium Concurrent Coding Laboratory', location: 'University High-Capacity Lab Arena', badge: 'CONCURRENT SPRINT', date: 'Live Coding Immersion' },
    { id: 'h-police-demo', image: policeTeamLaptopDemoImg, title: 'Police Officers & Student Squad Technical Demo', location: 'Command Review Center', badge: 'JURY DEMO', date: 'Architecture Presentation' }
  ],
  'guest-lectures': [
    { id: 'gl-01', image: gl01, title: 'Demystifying Generative AI & Career Opportunities', location: 'Hindu Engineering & Technology College, Guntur', badge: 'TECH MAHINDRA', date: 'July 25th • 150 Students' },
    { id: 'gl-02', image: gl02, title: 'Java Programming Fundamentals & OOP Systems', location: 'Hindu Engineering & Technology College, Guntur', badge: 'BACKEND DEV LEAD', date: 'August 1st • 65 Students' },
    { id: 'gl-03', image: gl03, title: 'Natural Language Processing & Industry NLP Pipelines', location: 'Hindu Engineering & Technology College, Guntur', badge: 'DELOITTE USI', date: '7 Aug 2026 • 75 Students' },
    { id: 'gl-05', image: gl05, title: 'Live Audience Q&A on Career Pathways in AI', location: 'Campus Main Auditorium', badge: 'KEYNOTE Q&A', date: 'Executive Keynote' },
    { id: 'gl-07', image: gl07, title: 'Leadership & Industry Best Practices Session', location: 'Executive Seminar Hall', badge: 'EXECUTIVE TALK', date: 'Leadership Series' },
    { id: 'gl-08', image: gl08, title: 'Student Engagement & Enterprise Mindset', location: 'Hindu College Hall', badge: 'CAMPUS ADDRESS', date: 'Student Interaction' },
  ]
};

// Flattened list of all authentic event photos
export const allEventPhotos = [
  ...eventPhotos['guest-lectures'].map(p => p.image),
  ...eventPhotos.workshops.map(p => p.image),
  ...eventPhotos.hackathons.map(p => p.image)
];

// Lightweight hero thumbnails for decorative streams
export const heroPhotos = allEventPhotos;
