import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MenuOverlay from './components/MenuOverlay';
import IntroAnimation from './components/IntroAnimation';
import Hero from './components/Hero';
import OurWork from './components/OurWork';
import UpcomingWorkshopsSection from './components/UpcomingWorkshopsSection';
import CompanyGrid from './components/CompanyGrid';
import ImpactStats from './components/ImpactStats';
import FeaturedWorkshops from './components/FeaturedWorkshops';
import FaqSection from './components/FaqSection';
import About from './components/About';
import ReviewsSection from './components/ReviewsSection';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';
import FloatingConnectWidget from './components/FloatingConnectWidget';
import CustomCursor from './components/CustomCursor';
import PortalModal from './components/PortalModal';
import UpcomingWorkshopPopup from './components/UpcomingWorkshopPopup';
import Terms from './components/Pages/Terms';
import PrivacyPolicy from './components/Pages/PrivacyPolicy';
import AdminPage from './components/AdminPage';

import { workshopCards, featuredWorkshops } from './data/workshops';
import { companiesData } from './data/companies';
import { impactStatsData } from './data/statistics';
import { fetchWorkshops, fetchCompanies, fetchStats } from './services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isUpcomingPopupOpen, setIsUpcomingPopupOpen] = useState(false);
  const [portalInitialWorkshop, setPortalInitialWorkshop] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Whenever intro finishes or layout settles, recalculate scroll triggers
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);
    return () => clearTimeout(timer);
  }, [introFinished]);

  // App data state (defaults to local data, updates from backend if available)
  const [cards, setCards] = useState(workshopCards);
  const [featured, setFeatured] = useState(featuredWorkshops);
  const [companies, setCompanies] = useState(companiesData);
  const [stats, setStats] = useState(impactStatsData);

  useEffect(() => {
    // Fetch dynamic data from Express backend API
    const loadBackendData = async () => {
      try {
        const workshopsRes = await fetchWorkshops();
        if (workshopsRes?.cards) setCards(workshopsRes.cards);
        if (workshopsRes?.featured) setFeatured(workshopsRes.featured);

        const compRes = await fetchCompanies();
        if (compRes) setCompanies(compRes);

        const statsRes = await fetchStats();
        if (statsRes) setStats(statsRes);
      } catch (err) {
        console.log('[IncuxAI] Operating with local static datasets.');
      }
    };

    loadBackendData();
  }, []);

  // Handle page navigation from Terms/Privacy pages
  useEffect(() => {
    const handleNavigateHome = () => navigateHome();
    window.addEventListener('navigate-home', handleNavigateHome);
    return () => window.removeEventListener('navigate-home', handleNavigateHome);
  }, []);

  const navigateToTerms = () => {
    setCurrentPage('terms');
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPrivacy = () => {
    setCurrentPage('privacy');
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPortal = (defaultTab = 'register', preselectedWsId = null) => {
    if (preselectedWsId) {
      setPortalInitialWorkshop(preselectedWsId);
    }
    setIsPortalOpen(true);
    setIsMenuOpen(false);
  };

  // The admin console is a real path, not a modal state. Vite serves
  // index.html for /admin, and the passphrase is verified by the backend.
  if (/^\/admin\/?$/i.test(window.location.pathname)) {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] selection:bg-[#FACC15] selection:text-[#0A0A0A] transition-colors duration-200">
      {/* Animated Yellow Ball Cursor Follower at Cursor Tip */}
      <CustomCursor />

      {/* 1. Intro Animation (Plays once per page load, character/word reveal, 2-3s) */}
      {!introFinished && (
        <IntroAnimation onComplete={() => setIntroFinished(true)} />
      )}

      {/* Full-screen Overlay Menu */}
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenPortal={openPortal}
      />

      {/* Global Sticky Navbar */}
      <Navbar
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* Interactive Candidate & Admin Management Portal (access without login) */}
      <PortalModal
        isOpen={isPortalOpen}
        onClose={() => {
          setIsPortalOpen(false);
          setPortalInitialWorkshop(null);
        }}
        initialWorkshopId={portalInitialWorkshop}
      />

      {/* Real Upcoming Workshop Announcement Popup Modal */}
      <UpcomingWorkshopPopup
        isOpen={isUpcomingPopupOpen}
        onClose={() => setIsUpcomingPopupOpen(false)}
      />

      {/* Page Content: Main Landing or Legal Pages */}
      {currentPage === 'terms' ? (
        <Terms />
      ) : currentPage === 'privacy' ? (
        <PrivacyPolicy />
      ) : (
        <>
          {/* Main Content: 11 Sections in Exact Fixed Order + Live Registration Portal */}
          <main>
            {/* Section 2: Hero */}
            <Hero />

            {/* Section: Bridging Education & Industry (Directly below landing page) */}
            <About />

            {/* Section 3: Our Work ("Where Ideas Become Experience" with fluid horizontal scrolling) */}
            <OurWork cards={cards} />

            {/* Live Workshop Registration & Location Request Portal Section */}
            <UpcomingWorkshopsSection
              onOpenPortal={openPortal}
              onOpenUpcomingPopup={() => setIsUpcomingPopupOpen(true)}
            />

            {/* Section 4: Industry Connections (8 typographic wordmarks + official logos) */}
            <CompanyGrid data={companies} />

            {/* Section 5: Our Impact (Contrasting background, count-up) */}
            <ImpactStats data={stats} />

            {/* Featured Workshops */}
            <FeaturedWorkshops workshops={featured} />

            {/* Creative Scrolling Student Reviews Section (Placed ABOVE FAQs as requested) */}
            <ReviewsSection />

            {/* Frequently Asked Questions */}
            <FaqSection />

            {/* Contact Us & Institutional Collaboration Section */}
            <ContactCTA />
          </main>
        </>
      )}

      {/* Section 11: Footer (With giant subtle incuxai watermark) */}
      <Footer
        onNavigateToTerms={navigateToTerms}
        onNavigateToPrivacy={navigateToPrivacy}
      />

      {/* Floating Interactive Connect Widget */}
      <FloatingConnectWidget />
    </div>
  );
}
