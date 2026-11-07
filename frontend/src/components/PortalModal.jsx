import React, { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  User,
  Shield,
  Layers,
  Sparkles,
  Send,
  Trash2,
  CheckCheck,
  Clock,
  ArrowRight,
  BookmarkCheck,
  Building,
  AlertCircle
} from 'lucide-react';
import {
  fetchUpcomingWorkshops,
  postWorkshop,
  deleteWorkshop,
  registerForWorkshop,
  fetchCandidateRegistrations,
  fetchAllRegistrations
} from '../services/api';

export default function PortalModal({ isOpen, onClose, user, onLogout }) {
  if (!isOpen || !user) return null;

  const isAdmin = user.role === 'admin';

  // Navigation tab
  const [activeTab, setActiveTab] = useState(isAdmin ? 'post-workshop' : 'browse-workshops');

  // Datasets
  const [workshops, setWorkshops] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Post workshop form (Admin)
  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    category: 'Agentic AI',
    dates: '',
    location: '',
    seats: 120,
    mode: 'Offline',
    speaker: '',
    description: ''
  });

  // Load portal data
  const loadData = async () => {
    setLoading(true);
    try {
      const wsList = await fetchUpcomingWorkshops();
      setWorkshops(wsList);

      if (isAdmin) {
        const regs = await fetchAllRegistrations();
        setAllRegistrations(regs);
      } else {
        const myRegs = await fetchCandidateRegistrations(user.email);
        setMyRegistrations(myRegs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Flash message helper
  const notify = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage({ type: '', text: '' }), 4500);
  };

  // --- Candidate Action: Register for Workshop ---
  const handleRegister = async (workshopId) => {
    try {
      await registerForWorkshop(workshopId, {
        candidateName: user.name,
        candidateEmail: user.email,
        candidateInstitution: user.institution || 'Independent Candidate',
        candidatePhone: '7665061289'
      });
      notify('success', 'Successfully registered for workshop! View it in "My Enrolled Workshops".');
      loadData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  // --- Admin Action: Post New Workshop ---
  const handlePostWorkshop = async (e) => {
    e.preventDefault();
    try {
      await postWorkshop(newWorkshop);
      notify('success', `Workshop "${newWorkshop.title}" posted successfully! Candidates can now register.`);
      setNewWorkshop({
        title: '',
        category: 'Agentic AI',
        dates: '',
        location: '',
        seats: 120,
        mode: 'Offline',
        speaker: '',
        description: ''
      });
      loadData();
      setActiveTab('manage-workshops');
    } catch (err) {
      notify('error', err.message);
    }
  };

  // --- Admin Action: Delete Workshop ---
  const handleDeleteWorkshop = async (id) => {
    if (!window.confirm('Are you sure you want to remove this workshop?')) return;
    try {
      await deleteWorkshop(id);
      notify('success', 'Workshop removed.');
      loadData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen min-h-screen flex flex-col bg-[#FDFCFA] dark:bg-[#0A0A0A] text-neutral-950 dark:text-[#F5F5F5] animate-in fade-in duration-200 overflow-hidden">
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-black/10 dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F5F5] dark:bg-[#0A0A0A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#FACC15]/15 dark:bg-[#FACC15]/10 text-neutral-900 dark:text-[#FACC15] border border-[#FACC15]/30 dark:border-[#FACC15]/30">
              {isAdmin ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-neutral-950 dark:text-[#F5F5F5]">
                  {user.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FACC15]/15 dark:bg-[#FACC15]/10 text-neutral-900 dark:text-[#FACC15] border border-[#FACC15]/30 dark:border-[#FACC15]/30">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                {user.email} • {user.institution || 'IncuxAI Platform'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              Sign Out
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-[#1A1A1A] flex items-center justify-center text-amber-600 dark:text-[#FACC15] hover:bg-[#FACC15] hover:text-[#0A0A0A] transition-colors cursor-pointer"
              aria-label="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Flash Alert */}
        {actionMessage.text && (
          <div className={`p-3 px-6 text-xs font-mono flex items-center gap-2 border-b shrink-0 ${actionMessage.type === 'error' ? 'bg-rose-100 dark:bg-rose-950 border-rose-300 text-rose-800 dark:text-rose-200' : 'bg-[#FACC15]/15 dark:bg-[#1A1A1A] border-black/10 dark:border-[#262626] text-amber-600 dark:text-[#FACC15]'}`}>
            {actionMessage.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-[#FACC15]" />}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-black/10 dark:border-[#262626] bg-[#FDFCFA] dark:bg-[#0A0A0A] px-4 sm:px-6 shrink-0">
          {isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('post-workshop')}
                className={`py-3.5 px-4 text-xs font-mono font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'post-workshop' ? 'border-[#FACC15] dark:border-[#FACC15] text-amber-600 dark:text-[#FACC15] font-bold' : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-[#FACC15]'}`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Workshop</span>
              </button>
              <button
                onClick={() => setActiveTab('manage-workshops')}
                className={`py-3.5 px-4 text-xs font-mono font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'manage-workshops' ? 'border-[#FACC15] dark:border-[#FACC15] text-amber-600 dark:text-[#FACC15] font-bold' : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-[#FACC15]'}`}
              >
                <Layers className="w-4 h-4" />
                <span>Active Live Workshops ({workshops.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('all-registrations')}
                className={`py-3.5 px-4 text-xs font-mono font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'all-registrations' ? 'border-[#FACC15] dark:border-[#FACC15] text-amber-600 dark:text-[#FACC15] font-bold' : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-[#FACC15]'}`}
              >
                <Users className="w-4 h-4" />
                <span>Candidate Registrations ({allRegistrations.length})</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('browse-workshops')}
                className={`py-3.5 px-4 text-xs font-mono font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'browse-workshops' ? 'border-[#FACC15] dark:border-[#FACC15] text-amber-600 dark:text-[#FACC15] font-bold' : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-[#FACC15]'}`}
              >
                <Layers className="w-4 h-4" />
                <span>Available Workshops ({workshops.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('my-workshops')}
                className={`py-3.5 px-4 text-xs font-mono font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === 'my-workshops' ? 'border-[#FACC15] dark:border-[#FACC15] text-amber-600 dark:text-[#FACC15] font-bold' : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-[#FACC15]'}`}
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>My Enrolled Workshops ({myRegistrations.length})</span>
              </button>
            </>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#FDFCFA]/60 dark:bg-[#0A0A0A]/70">
          {/* ========================================================= */}
          {/* CANDIDATE VIEW: BROWSE & REGISTER FOR WORKSHOPS           */}
          {/* ========================================================= */}
          {!isAdmin && activeTab === 'browse-workshops' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-headline font-bold text-2xl text-neutral-950 dark:text-[#F5F5F5]">
                    Live Upcoming Workshops
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Posted by IncuxAI Admin. Select any workshop to register.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {workshops.map((ws) => {
                  const isRegistered = myRegistrations.some((r) => r.workshopId === ws.id);
                  const seatsLeft = Math.max(0, ws.seats - (ws.registered || 0));

                  return (
                    <div
                      key={ws.id}
                      className="p-6 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono mb-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FACC15]/15 dark:bg-[#FACC15]/10 text-neutral-900 dark:text-[#FACC15] border border-[#FACC15]/20 dark:border-[#FACC15]/20 font-bold">
                            {ws.category}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#1A1A1A] text-amber-600 dark:text-[#FACC15] text-[10px] font-semibold">
                            {ws.mode}
                          </span>
                        </div>

                        <h5 className="font-headline font-bold text-xl text-neutral-950 dark:text-[#F5F5F5] leading-snug">
                          {ws.title}
                        </h5>

                        <div className="my-4 space-y-2 text-xs font-mono text-neutral-600 dark:text-neutral-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-[#FACC15]" />
                            <span>{ws.dates}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#A5A79B]" />
                            <span>{ws.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-[#A5A79B]" />
                            <span>{ws.speaker}</span>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 font-body">
                          {ws.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-black/10 dark:border-[#262626] flex items-center justify-between">
                        <div className="text-xs font-mono">
                          <span className="text-neutral-400 dark:text-neutral-500 block text-[10px]">SEATS STATUS</span>
                          <span className="font-bold text-neutral-950 dark:text-[#F5F5F5]">
                            {seatsLeft} remaining / {ws.seats}
                          </span>
                        </div>

                        {isRegistered ? (
                          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FACC15]/15 dark:bg-[#FACC15]/10 text-neutral-900 dark:text-[#FACC15] border border-[#FACC15]/30 dark:border-[#FACC15]/30 text-xs font-mono font-bold">
                            <CheckCheck className="w-4 h-4" />
                            <span>Enrolled</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRegister(ws.id)}
                            disabled={seatsLeft === 0}
                            className="px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-bold font-headline font-bold text-xs uppercase tracking-wider shadow-md shadow-yellow-500/20 transition-all cursor-pointer disabled:opacity-40"
                          >
                            {seatsLeft === 0 ? 'Full' : 'Register Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* CANDIDATE VIEW: MY REGISTERED WORKSHOPS                   */}
          {/* ========================================================= */}
          {!isAdmin && activeTab === 'my-workshops' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-headline font-bold text-2xl text-neutral-950 dark:text-[#F5F5F5]">
                  My Enrolled Workshops
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Confirmed participation passes for your registered cohorts.
                </p>
              </div>

              {myRegistrations.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
                  <BookmarkCheck className="w-12 h-12 text-[#A5A79B] mx-auto mb-3" />
                  <h5 className="font-headline font-bold text-lg text-neutral-950 dark:text-[#F5F5F5]">
                    No Workshops Enrolled Yet
                  </h5>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                    Browse the available workshops catalog and click 'Register Now' to secure your seat.
                  </p>
                  <button
                    onClick={() => setActiveTab('browse-workshops')}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-bold font-bold text-xs font-headline uppercase shadow-md shadow-yellow-500/20 transition-all"
                  >
                    Browse Workshops
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-6 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono mb-2">
                          <span className="text-amber-600 dark:text-[#FACC15] font-bold">
                            PASS #{reg.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FACC15]/15 dark:bg-[#FACC15]/10 text-neutral-900 dark:text-[#FACC15] border border-[#FACC15]/30 dark:border-[#FACC15]/30 font-bold text-[10px]">
                            {reg.status}
                          </span>
                        </div>

                        <h5 className="font-headline font-bold text-xl text-neutral-950 dark:text-[#F5F5F5] leading-snug">
                          {reg.workshopTitle}
                        </h5>

                        <div className="my-4 space-y-1.5 text-xs font-mono text-neutral-600 dark:text-neutral-300">
                          <p>
                            <strong>Dates:</strong> {reg.workshopDates}
                          </p>
                          <p>
                            <strong>Location:</strong> {reg.workshopLocation}
                          </p>
                          <p>
                            <strong>Candidate:</strong> {reg.candidateName} ({reg.candidateInstitution})
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-black/10 dark:border-[#262626] text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                        Registered on: {new Date(reg.registeredAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}



          {/* ========================================================= */}
          {/* ADMIN VIEW: POST WORKSHOP                                 */}
          {/* ========================================================= */}
          {isAdmin && activeTab === 'post-workshop' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h4 className="font-headline font-bold text-2xl text-neutral-950 dark:text-[#F5F5F5]">
                  Post New Live Workshop
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Once published, this workshop will immediately appear in the candidate registration catalog.
                </p>
              </div>

              <form onSubmit={handlePostWorkshop} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] space-y-4 shadow-sm">
                <div>
                  <label className="block text-xs font-mono text-amber-600 dark:text-[#FACC15] mb-1 font-semibold">
                    Workshop Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newWorkshop.title}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, title: e.target.value })}
                    placeholder="e.g. Agentic AI & Autonomous Multi-Agent Workflows"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCFA] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-950 dark:text-[#F5F5F5] outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-amber-600 dark:text-[#FACC15] mb-1 font-semibold">
                      Category *
                    </label>
                    <select
                      value={newWorkshop.category}
                      onChange={(e) => setNewWorkshop({ ...newWorkshop, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCFA] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-950 dark:text-[#F5F5F5] outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15]"
                    >
                      <option value="Agentic AI">Agentic AI</option>
                      <option value="Generative AI">Generative AI</option>
                      <option value="Cloud & Cybersecurity">Cloud &amp; Cybersecurity</option>
                      <option value="Software Development">Software Development</option>
                      <option value="AI Bootcamps">AI Bootcamps</option>
                      <option value="Data & Analytics">Data &amp; Analytics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-amber-600 dark:text-[#FACC15] mb-1 font-semibold">
                      Delivery Mode
                    </label>
                    <select
                      value={newWorkshop.mode}
                      onChange={(e) => setNewWorkshop({ ...newWorkshop, mode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCFA] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-950 dark:text-[#F5F5F5] outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15]"
                    >
                      <option value="Offline">Offline (On-Campus)</option>
                      <option value="Online">Online (Interactive Remote)</option>
                      <option value="Hybrid">Hybrid Cohort</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-amber-600 dark:text-[#FACC15] mb-1 font-semibold">
                      Dates *
                    </label>
                    <input
                      type="text"
                      required
                      value={newWorkshop.dates}
                      onChange={(e) => setNewWorkshop({ ...newWorkshop, dates: e.target.value })}
                      placeholder="e.g. December 19–20, 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCFA] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-950 dark:text-[#F5F5F5] outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-amber-600 dark:text-[#FACC15] mb-1 font-semibold">
                      Location / Campus *
                    </label>
                    <input
                      type="text"
                      required
                      value={newWorkshop.location}
                      onChange={(e) => setNewWorkshop({ ...newWorkshop, location: e.target.value })}
                      placeholder="e.g. GRIET Campus, Hyderabad"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCFA] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-950 dark:text-[#F5F5F5] outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-amber-600 dark:text-[#FACC15] mb-1 font-semibold">
                      Max Seats Capacity
                    </label>
                    <input
                      type="number"
                      value={newWorkshop.seats}
                      onChange={(e) => setNewWorkshop({ ...newWorkshop, seats: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCFA] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-950 dark:text-[#F5F5F5] outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-amber-600 dark:text-[#FACC15] mb-1 font-semibold">
                      Lead Speaker / Mentor
                    </label>
                    <input
                      type="text"
                      value={newWorkshop.speaker}
                      onChange={(e) => setNewWorkshop({ ...newWorkshop, speaker: e.target.value })}
                      placeholder="e.g. Dilip Sir (Walmart Lead) or Anvesh G"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCFA] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-950 dark:text-[#F5F5F5] outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-amber-600 dark:text-[#FACC15] mb-1 font-semibold">
                    Description &amp; Syllabus Overview
                  </label>
                  <textarea
                    rows={3}
                    value={newWorkshop.description}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
                    placeholder="Hands-on coding, live lab repos, architecture overview..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFCFA] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-950 dark:text-[#F5F5F5] outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-bold font-headline font-bold text-sm uppercase tracking-wider shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Workshop Live</span>
                </button>
              </form>
            </div>
          )}



          {/* ========================================================= */}
          {/* ADMIN VIEW: MANAGE ACTIVE WORKSHOPS                       */}
          {/* ========================================================= */}
          {isAdmin && activeTab === 'manage-workshops' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-headline font-bold text-2xl text-neutral-950 dark:text-[#F5F5F5]">
                    Active Live Workshops
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Currently visible to candidates for online registration.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('post-workshop')}
                  className="px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-bold text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-yellow-500/20 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post Workshop</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workshops.map((ws) => (
                  <div
                    key={ws.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <span className="text-amber-600 dark:text-[#FACC15] font-bold">{ws.category}</span>
                        <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-[#1A1A1A] text-[10px] text-amber-600 dark:text-[#FACC15]">
                          {ws.mode}
                        </span>
                      </div>

                      <h5 className="font-headline font-bold text-xl text-neutral-950 dark:text-[#F5F5F5] leading-snug">
                        {ws.title}
                      </h5>

                      <div className="my-3 space-y-1 text-xs font-mono text-neutral-600 dark:text-neutral-300">
                        <p>
                          <strong>Dates:</strong> {ws.dates}
                        </p>
                        <p>
                          <strong>Location:</strong> {ws.location}
                        </p>
                        <p>
                          <strong>Registrations:</strong> {ws.registered || 0} / {ws.seats} candidates
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-black/10 dark:border-[#262626] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-amber-600 dark:text-[#FACC15] font-bold">
                        Status: Active Live
                      </span>
                      <button
                        onClick={() => handleDeleteWorkshop(ws.id)}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Remove workshop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ADMIN VIEW: ALL CANDIDATE REGISTRATIONS                   */}
          {/* ========================================================= */}
          {isAdmin && activeTab === 'all-registrations' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-headline font-bold text-2xl text-neutral-950 dark:text-[#F5F5F5]">
                  All Candidate Registrations ({allRegistrations.length})
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Comprehensive roster of students and candidates registered across workshops.
                </p>
              </div>

              {allRegistrations.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">No registrations recorded yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-[#262626] bg-white dark:bg-[#141414] shadow-sm">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#FDFCFA] dark:bg-[#0A0A0A] text-amber-600 dark:text-[#FACC15] border-b border-black/10 dark:border-[#262626]">
                      <tr>
                        <th className="p-3">Ref ID</th>
                        <th className="p-3">Candidate</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Institution</th>
                        <th className="p-3">Workshop</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 dark:divide-[#262626] text-neutral-950 dark:text-[#F5F5F5]">
                      {allRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-[#FDFCFA]/50 dark:hover:bg-[#0A0A0A]/60">
                          <td className="p-3 font-bold text-amber-600 dark:text-[#FACC15]">{reg.id}</td>
                          <td className="p-3 font-semibold text-neutral-950 dark:text-[#F5F5F5]">{reg.candidateName}</td>
                          <td className="p-3 text-neutral-500 dark:text-neutral-400">{reg.candidateEmail}</td>
                          <td className="p-3">{reg.candidateInstitution}</td>
                          <td className="p-3 font-medium">{reg.workshopTitle}</td>
                          <td className="p-3 text-neutral-500 dark:text-neutral-400">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
