// Structured Event Photography Data for IncuxAI Platform
// Categorized by Workshops, Hackathons, and Guest Lectures

// --- Guest Lectures Photography ---
import gl01 from '../assets/events/guest_lectures/guest_lecture_01.jpg';
import gl02 from '../assets/events/guest_lectures/guest_lecture_02.jpg';
import gl03 from '../assets/events/guest_lectures/guest_lecture_03.jpg';
import gl05 from '../assets/events/guest_lectures/guest_lecture_05.jpg';
import gl07 from '../assets/events/guest_lectures/guest_lecture_07.jpg';
import gl08 from '../assets/events/guest_lectures/guest_lecture_08.jpg';
import gl09 from '../assets/events/guest_lectures/guest_lecture_09.jpg';
import gl10 from '../assets/events/guest_lectures/guest_lecture_10.jpg';

// --- Hackathons Photography (11 Photos) ---
import h01 from '../assets/events/hackathons/hackathon_01.jpg';
import h02 from '../assets/events/hackathons/hackathon_02.jpg';
import h03 from '../assets/events/hackathons/hackathon_03.jpg';
import h04 from '../assets/events/hackathons/hackathon_04.jpg';
import h05 from '../assets/events/hackathons/hackathon_05.jpg';
import h06 from '../assets/events/hackathons/hackathon_06.jpg';
import h07 from '../assets/events/hackathons/hackathon_07.jpg';
import h08 from '../assets/events/hackathons/hackathon_08.jpg';
import h09 from '../assets/events/hackathons/hackathon_09.jpg';
import h10 from '../assets/events/hackathons/hackathon_10.jpg';
import h11 from '../assets/events/hackathons/hackathon_11.jpg';

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
import w16 from '../assets/events/workshops/workshop_16.jpg';
import w18 from '../assets/events/workshops/workshop_18.jpg';

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
    { id: 'w-14', image: w14, title: 'Database Optimization & SQL Mastery', location: 'Campus Data Lab', badge: 'DATA SYSTEMS', date: 'Query Performance' },
    { id: 'w-16', image: w16, title: 'Applied Machine Learning Engineering', location: 'AI Research Center', badge: 'APPLIED AI', date: 'Industrial ML' },
    { id: 'w-18', image: w18, title: 'Workshop Graduation & Certification Session', location: 'Auditorium Lab Complex', badge: 'CERTIFIED', date: 'Certificate Ceremony' }
  ],
  hackathons: [
    { id: 'h-01', image: h01, title: 'AI x Regional Hackathon 2k26 Launch', location: 'Regional Technology Arena', badge: 'OPENING SPRINT', date: '48-Hour Sprint' },
    { id: 'h-02', image: h02, title: 'Squad Ideation & Rapid AI Prototyping', location: 'Innovation Arena Block', badge: 'IDEATION LAB', date: 'Overnight Build' },
    { id: 'h-03', image: h03, title: 'Developer Sprint & Solution Architecture', location: 'Hackathon War Room', badge: 'RAPID PROTOTYPING', date: 'Live Code Sandbox' },
    { id: 'h-04', image: h04, title: 'Mentorship Rounds & Technical Evaluation', location: 'Central Stage Arena', badge: 'MENTOR REVIEW', date: 'System Architecture' },
    { id: 'h-05', image: h05, title: 'Active Coding Sprint & Algorithm Tuning', location: 'Regional Tech Center', badge: 'ACTIVE SPRINT', date: 'Continuous Coding' },
    { id: 'h-06', image: h06, title: 'Live Jury Demonstrations & Product Pitches', location: 'Auditorium Stage', badge: 'JURY EVALUATION', date: 'Prototype Demos' },
    { id: 'h-07', image: h07, title: 'Final Prototype Testing & System Validation', location: 'Testing Lab Arena', badge: 'VALIDATION', date: 'Jury Scrutiny' },
    { id: 'h-08', image: h08, title: 'Team Collaboration & Innovation Showcase', location: 'Hackathon Arena Floor', badge: 'COLLABORATION', date: 'Team Sprint' },
    { id: 'h-09', image: h09, title: 'Podium Honors & Cash Prize Felicitation', location: 'Grand Stage', badge: 'HONORS & AWARDS', date: 'Award Ceremony' },
    { id: 'h-10', image: h10, title: 'Cohort Celebration & Winning Teams', location: 'Open Campus Arena', badge: 'WINNERS COHORT', date: 'Felicitation' },
    { id: 'h-11', image: h11, title: 'Grand Hackathon Finale & Group Commemoration', location: 'University Grounds', badge: 'GRAND FINALE', date: 'All-Cohort Photo' }
  ],
  'guest-lectures': [
    { id: 'gl-01', image: gl01, title: 'Demystifying Generative AI & Career Opportunities', location: 'Hindu Engineering & Technology College, Guntur', badge: 'TECH MAHINDRA', date: 'July 25th • 150 Students' },
    { id: 'gl-02', image: gl02, title: 'Java Programming Fundamentals & OOP Systems', location: 'Hindu Engineering & Technology College, Guntur', badge: 'BACKEND DEV LEAD', date: 'August 1st • 65 Students' },
    { id: 'gl-03', image: gl03, title: 'Natural Language Processing & Industry NLP Pipelines', location: 'Hindu Engineering & Technology College, Guntur', badge: 'DELOITTE USI', date: '7 Aug 2026 • 75 Students' },
    { id: 'gl-05', image: gl05, title: 'Live Audience Q&A on Career Pathways in AI', location: 'Campus Main Auditorium', badge: 'KEYNOTE Q&A', date: 'Executive Keynote' },
    { id: 'gl-07', image: gl07, title: 'Leadership & Industry Best Practices Session', location: 'Executive Seminar Hall', badge: 'EXECUTIVE TALK', date: 'Leadership Series' },
    { id: 'gl-08', image: gl08, title: 'Student Engagement & Enterprise Mindset', location: 'Hindu College Hall', badge: 'CAMPUS ADDRESS', date: 'Student Interaction' },
    { id: 'gl-09', image: gl09, title: 'Technical Roadmap & Cloud System Architectures', location: 'Conference Center', badge: 'TECH ROADMAP', date: 'Special Keynote' },
    { id: 'gl-10', image: gl10, title: 'Industry Panel & College Academic Leadership', location: 'University Stage', badge: 'LEADERSHIP PANEL', date: 'Dignitary Address' }
  ]
};

// Flattened list of all authentic event photos for Hero background streams
export const allEventPhotos = [
  ...eventPhotos['guest-lectures'].map(p => p.image),
  ...eventPhotos.workshops.map(p => p.image),
  ...eventPhotos.hackathons.map(p => p.image)
];
