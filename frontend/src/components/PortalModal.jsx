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
  Send,
  Trash2,
  CheckCheck,
  Clock,
  ArrowRight,
  BookmarkCheck,
  Building,
  AlertCircle,
  LogOut,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Download,
  Settings,
  CreditCard,
  Check,
  Search,
  Copy,
  CheckCircle
} from 'lucide-react';
import {
  fetchUpcomingWorkshops,
  postWorkshop,
  deleteWorkshop,
  registerForWorkshop,
  fetchAllRegistrations,
  fetchCandidateRegistrations,
  fetchGoogleSheetsConfig,
  saveGoogleSheetsConfig,
  syncAllToGoogleSheets,
  updateRegistrationPayment
} from '../services/api';

const downloadCsv = (data, filename) => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(field => {
        const val = row[field] === null || row[field] === undefined ? '' : String(row[field]);
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];
  const blob = new Blob(["\uFEFF" + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const CANDIDATE_KEY = 'incuxai_candidate_profile';
const ADMIN_PROFILE = {
  name: 'IncuxAI Admin',
  role: 'Administrator',
  email: 'admin@incuxai.com',
  institution: 'IncuxAI HQ, Guntur'
};
const EMPTY_CANDIDATE = { name: '', email: '', institution: '' };

const readCandidateProfile = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CANDIDATE_KEY) || 'null');
    if (stored && typeof stored === 'object') {
      return { ...EMPTY_CANDIDATE, ...stored };
    }
  } catch {
    // Ignore malformed storage.
  }
  return EMPTY_CANDIDATE;
};

export default function PortalModal({ isOpen, onClose, isAdmin = false, onLogout, initialWorkshopId = null }) {
  const [candidate, setCandidate] = useState(readCandidateProfile);

  const user = isAdmin
    ? ADMIN_PROFILE
    : {
        name: candidate.name || 'Guest Candidate',
        role: 'Candidate',
        email: candidate.email || 'Not provided',
        institution: candidate.institution || 'Independent Candidate'
      };

  // Navigation tab
  const [activeTab, setActiveTab] = useState('browse-workshops');

  // Datasets
  const [workshops, setWorkshops] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Google Sheets & Payments Admin state
  const [sheetsConfig, setSheetsConfig] = useState({ webhookUrl: '', sheetUrl: '', lastSyncedAt: null });
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [sheetsModalOpen, setSheetsModalOpen] = useState(false);
  const [webhookInput, setWebhookInput] = useState('');
  const [sheetUrlInput, setSheetUrlInput] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [regFilter, setRegFilter] = useState('all'); // 'all' | 'paid' | 'pending'
  const [regSearch, setRegSearch] = useState('');
  const [updatingPaymentId, setUpdatingPaymentId] = useState('');

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

  // Candidate details captured inline on first registration (no login)
  const [detailsFor, setDetailsFor] = useState('');
  useEffect(() => {
    if (isOpen && initialWorkshopId) {
      setDetailsFor(initialWorkshopId);
      setActiveTab('browse-workshops');
    }
  }, [isOpen, initialWorkshopId]);
  const [details, setDetails] = useState(EMPTY_CANDIDATE);

  // Load portal data
  const loadData = async () => {
    setLoading(true);
    try {
      const wsList = await fetchUpcomingWorkshops();
      setWorkshops(wsList);

      if (isAdmin) {
        const [regs, sheets] = await Promise.all([
          fetchAllRegistrations(),
          fetchGoogleSheetsConfig()
        ]);
        setAllRegistrations(regs);
        setMyRegistrations(regs);
        if (sheets) {
          setSheetsConfig(sheets);
          setWebhookInput(sheets.webhookUrl || '');
          setSheetUrlInput(sheets.sheetUrl || '');
        }
      } else if (candidate.email) {
        const regs = await fetchCandidateRegistrations(candidate.email);
        setMyRegistrations(regs);
        setAllRegistrations([]);
      } else {
        setMyRegistrations([]);
        setAllRegistrations([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab('browse-workshops');
      loadData();
    }
  }, [isOpen, isAdmin, candidate.email]);

  if (!isOpen) return null;

  // Flash message helper
  const notify = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage({ type: '', text: '' }), 4500);
  };

  // --- Candidate Action: Register for Workshop ---
  const submitRegistration = async (workshopId, person) => {
    try {
      await registerForWorkshop(workshopId, {
        candidateName: person.name.trim(),
        candidateEmail: person.email.trim(),
        candidateInstitution: person.institution?.trim() || 'Independent Candidate',
        candidatePhone: person.phone?.trim() || 'Not provided'
      });
      try {
        localStorage.setItem(CANDIDATE_KEY, JSON.stringify(person));
      } catch {
        // Storage is optional; the in-memory profile still works.
      }
      setCandidate(person);
      setDetailsFor('');
      notify('success', 'Registration confirmed. It now appears under "My Enrolled Workshops".');
      loadData();
    } catch (err) {
      notify('error', err.message);
    }
  };

  const handleRegister = (workshopId) => {
    if (!candidate.name || !candidate.email) {
      setDetails(candidate);
      setDetailsFor(workshopId);
      return;
    }
    submitRegistration(workshopId, candidate);
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!details.name.trim() || !details.email.trim()) {
      notify('error', 'Name and email are required to register.');
      return;
    }
    submitRegistration(detailsFor, details);
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

  // --- Google Sheets Live Sync Handlers ---
  const handleSyncSheets = async () => {
    if (!sheetsConfig.webhookUrl) {
      setSheetsModalOpen(true);
      return;
    }
    setSyncingSheets(true);
    try {
      const res = await syncAllToGoogleSheets();
      notify('success', `Live sync complete! ${res.syncedCount?.registrations || 0} candidates and ${res.syncedCount?.payments || 0} payments pushed to Google Sheets.`);
      const updatedConfig = await fetchGoogleSheetsConfig();
      setSheetsConfig(updatedConfig);
    } catch (err) {
      notify('error', `Sync failed: ${err.message}`);
    } finally {
      setSyncingSheets(false);
    }
  };

  const handleSaveSheetsConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await saveGoogleSheetsConfig({
        webhookUrl: webhookInput.trim(),
        sheetUrl: sheetUrlInput.trim()
      });
      setSheetsConfig(res.config);
      setSheetsModalOpen(false);
      notify('success', 'Google Sheets settings saved! You can now click "Sync to Google Sheet".');
    } catch (err) {
      notify('error', err.message || 'Failed to save settings');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleTogglePayment = async (reg) => {
    const nextStatus = reg.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
    setUpdatingPaymentId(reg.id);
    try {
      await updateRegistrationPayment(reg.id, {
        paymentStatus: nextStatus,
        amount: reg.amount || 6000,
        paymentMethod: nextStatus === 'Paid' ? 'UPI / Admin Verified' : 'Pending',
        transactionId: nextStatus === 'Paid' ? `TXN-${Date.now()}` : 'PENDING'
      });
      notify('success', `Payment marked as ${nextStatus} for ${reg.candidateName}.`);
      loadData();
    } catch (err) {
      notify('error', err.message);
    } finally {
      setUpdatingPaymentId('');
    }
  };

  const exportRegistrationsCsv = () => {
    if (!allRegistrations.length) {
      notify('error', 'No candidate registrations to export.');
      return;
    }
    const data = allRegistrations.map(r => ({
      'Registration ID': r.id,
      'Timestamp': new Date(r.registeredAt).toLocaleString('en-IN'),
      'Candidate Name': r.candidateName,
      'Candidate Email': r.candidateEmail,
      'Phone': r.candidatePhone || 'Not provided',
      'Institution': r.candidateInstitution || 'Not provided',
      'Workshop Title': r.workshopTitle,
      'Category': r.workshopCategory || '',
      'Dates': r.workshopDates || '',
      'Location': r.workshopLocation || '',
      'Mode': r.workshopMode || '',
      'Status': r.status || 'Confirmed',
      'Payment Status': r.paymentStatus || (r.amount ? 'Paid' : 'Free'),
      'Amount (INR)': r.amount || 0
    }));
    downloadCsv(data, `IncuxAI_Candidate_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    notify('success', 'Candidate registrations Excel/CSV sheet downloaded!');
  };

  const exportPaymentsCsv = () => {
    const paidList = allRegistrations.filter(r => r.paymentStatus === 'Paid' || (r.amount && r.amount > 0));
    if (!paidList.length) {
      notify('error', 'No payment records to export.');
      return;
    }
    const data = paidList.map(r => ({
      'Payment Ref ID': `PAY-${r.id}`,
      'Timestamp': new Date(r.registeredAt).toLocaleString('en-IN'),
      'Candidate Name': r.candidateName,
      'Candidate Email': r.candidateEmail,
      'Phone': r.candidatePhone || 'Not provided',
      'Institution': r.candidateInstitution || 'Not provided',
      'Workshop Title': r.workshopTitle,
      'Amount Paid (INR)': r.amount || 6000,
      'Payment Status': r.paymentStatus || 'Completed',
      'Payment Method': r.paymentMethod || 'UPI / Online',
      'Transaction ID': r.transactionId || 'Confirmed'
    }));
    downloadCsv(data, `IncuxAI_Payments_Completed_${new Date().toISOString().slice(0, 10)}.csv`);
    notify('success', 'Payments completed Excel/CSV sheet downloaded!');
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
            {isAdmin && onLogout && (
              <button
                onClick={onLogout}
                className="h-10 px-3 rounded-xl bg-neutral-100 dark:bg-[#1A1A1A] flex items-center gap-2 text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Sign out of admin"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            )}
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

              {/* Upcoming workshops available for candidate registration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl">
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

                        {detailsFor === ws.id && (
                          <form
                            onSubmit={handleDetailsSubmit}
                            className="mt-4 p-4 rounded-2xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] space-y-2.5"
                          >
                            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-bold">
                              Details for this registration
                            </p>
                            <input
                              type="text"
                              required
                              value={details.name}
                              onChange={(e) => setDetails({ ...details, name: e.target.value })}
                              placeholder="Full name"
                              aria-label="Full name"
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#F5F5F5] focus:outline-none focus:border-[#FACC15]"
                            />
                            <input
                              type="email"
                              required
                              value={details.email}
                              onChange={(e) => setDetails({ ...details, email: e.target.value })}
                              placeholder="Email address"
                              aria-label="Email address"
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#F5F5F5] focus:outline-none focus:border-[#FACC15]"
                            />
                            <input
                              type="text"
                              value={details.institution}
                              onChange={(e) => setDetails({ ...details, institution: e.target.value })}
                              placeholder="College or institution (optional)"
                              aria-label="College or institution"
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#F5F5F5] focus:outline-none focus:border-[#FACC15]"
                            />
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="submit"
                                className="px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] text-xs font-headline font-black uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Confirm registration
                              </button>
                              <button
                                type="button"
                                onClick={() => setDetailsFor('')}
                                className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-[#1A1A1A] text-xs font-mono font-bold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </div>

                      <div className="pt-4 border-t border-black/10 dark:border-[#262626] flex items-center justify-end">

                        {isRegistered ? (
                          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FACC15]/15 dark:bg-[#FACC15]/10 text-neutral-900 dark:text-[#FACC15] border border-[#FACC15]/30 dark:border-[#FACC15]/30 text-xs font-mono font-bold">
                            <CheckCheck className="w-4 h-4" />
                            <span>Enrolled</span>
                          </div>
                        ) : detailsFor === ws.id ? null : (
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
                      placeholder="e.g. December 19-20, 2026"
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
                      placeholder="e.g. Hindu College of Engineering, Guntur"
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
          {/* ADMIN VIEW: ALL CANDIDATE REGISTRATIONS & PAYMENTS        */}
          {/* ========================================================= */}
          {isAdmin && activeTab === 'all-registrations' && (
            <div className="space-y-6">
              {/* Header with Title and Action Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h4 className="font-headline font-bold text-2xl text-neutral-950 dark:text-[#F5F5F5] flex items-center gap-2.5">
                    <span>Candidate Registrations &amp; Payments</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FACC15]/20 text-neutral-900 dark:text-[#FACC15] border border-[#FACC15]/30">
                      {allRegistrations.length} Total
                    </span>
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Live candidate roster synced with Google Sheets and downloadable for cohort records.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Google Sheets Sync Button */}
                  <button
                    onClick={handleSyncSheets}
                    disabled={syncingSheets}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    title="Push all database records to Google Sheet"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingSheets ? 'animate-spin' : ''}`} />
                    <span>{syncingSheets ? 'Syncing...' : 'Sync to Google Sheet'}</span>
                  </button>

                  {/* Open Live Google Sheet */}
                  {sheetsConfig.sheetUrl && (
                    <a
                      href={sheetsConfig.sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-[#1E293B] dark:hover:bg-[#334155] text-neutral-800 dark:text-emerald-400 font-mono font-bold text-xs flex items-center gap-1.5 border border-black/10 dark:border-emerald-500/30 transition-all"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Open Google Sheet</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}

                  {/* Google Sheets Config / Settings */}
                  <button
                    onClick={() => {
                      setWebhookInput(sheetsConfig.webhookUrl || '');
                      setSheetUrlInput(sheetsConfig.sheetUrl || '');
                      setSheetsModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-[#1A1A1A] dark:hover:bg-[#262626] text-neutral-700 dark:text-neutral-300 border border-black/10 dark:border-[#262626] transition-all cursor-pointer"
                    title="Configure Google Sheets Webhook"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Download Registrations Excel */}
                  <button
                    onClick={exportRegistrationsCsv}
                    className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-[#141414] dark:hover:bg-[#1F1F1F] text-neutral-900 dark:text-neutral-200 font-mono font-bold text-xs flex items-center gap-1.5 border border-black/10 dark:border-[#333] transition-all cursor-pointer"
                    title="Download Candidate Registrations Excel/CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-500" />
                    <span>Excel: Registrations</span>
                  </button>

                  {/* Download Payments Excel */}
                  <button
                    onClick={exportPaymentsCsv}
                    className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-[#141414] dark:hover:bg-[#1F1F1F] text-neutral-900 dark:text-neutral-200 font-mono font-bold text-xs flex items-center gap-1.5 border border-black/10 dark:border-[#333] transition-all cursor-pointer"
                    title="Download Completed Payments Excel/CSV"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Excel: Payments</span>
                  </button>
                </div>
              </div>

              {/* Google Sheets Live Status Banner */}
              <div className="p-3.5 px-4 rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${sheetsConfig.webhookUrl ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-[#F5F5F5]">
                      {sheetsConfig.webhookUrl ? 'Google Sheets Live Sync Connected' : 'Google Sheets Sync Not Configured'}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400 ml-2 text-[11px]">
                      {sheetsConfig.lastSyncedAt
                        ? `(Last synced: ${new Date(sheetsConfig.lastSyncedAt).toLocaleString('en-IN')})`
                        : sheetsConfig.webhookUrl
                        ? '(Ready to sync — click "Sync to Google Sheet")'
                        : '(Click Settings to connect your Google Sheet in 1 minute)'}
                    </span>
                  </div>
                </div>

                {!sheetsConfig.webhookUrl && (
                  <button
                    onClick={() => setSheetsModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#FACC15] text-[#0A0A0A] font-bold text-[11px] uppercase tracking-wider hover:bg-[#EAB308] cursor-pointer"
                  >
                    Setup Google Sheet
                  </button>
                )}
              </div>

              {/* Filters & Search Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setRegFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      regFilter === 'all'
                        ? 'bg-[#0A0A0A] text-[#FACC15] dark:bg-[#FACC15] dark:text-[#0A0A0A]'
                        : 'bg-neutral-100 dark:bg-[#141414] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    All Candidates ({allRegistrations.length})
                  </button>
                  <button
                    onClick={() => setRegFilter('paid')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      regFilter === 'paid'
                        ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black'
                        : 'bg-neutral-100 dark:bg-[#141414] text-neutral-600 dark:text-neutral-400 hover:text-emerald-600'
                    }`}
                  >
                    Payment Completed ({allRegistrations.filter(r => r.paymentStatus === 'Paid' || (r.amount && r.amount > 0)).length})
                  </button>
                  <button
                    onClick={() => setRegFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      regFilter === 'pending'
                        ? 'bg-amber-600 text-white dark:bg-amber-400 dark:text-black'
                        : 'bg-neutral-100 dark:bg-[#141414] text-neutral-600 dark:text-neutral-400 hover:text-amber-500'
                    }`}
                  >
                    Payment Pending ({allRegistrations.filter(r => r.paymentStatus === 'Pending').length})
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    placeholder="Search candidate, college, workshop..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] text-xs font-mono text-neutral-900 dark:text-neutral-200 outline-none focus:border-[#FACC15]"
                  />
                </div>
              </div>

              {/* Registrations & Payments Table */}
              {(() => {
                const filtered = allRegistrations.filter((reg) => {
                  if (regFilter === 'paid' && reg.paymentStatus !== 'Paid' && !(reg.amount && reg.amount > 0)) {
                    return false;
                  }
                  if (regFilter === 'pending' && reg.paymentStatus !== 'Pending') {
                    return false;
                  }
                  if (regSearch.trim()) {
                    const q = regSearch.toLowerCase();
                    const matchName = (reg.candidateName || '').toLowerCase().includes(q);
                    const matchEmail = (reg.candidateEmail || '').toLowerCase().includes(q);
                    const matchInst = (reg.candidateInstitution || '').toLowerCase().includes(q);
                    const matchWs = (reg.workshopTitle || '').toLowerCase().includes(q);
                    const matchPhone = (reg.candidatePhone || '').toLowerCase().includes(q);
                    if (!matchName && !matchEmail && !matchInst && !matchWs && !matchPhone) return false;
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626]">
                      <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400">
                        No registrations match the selected filter.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-[#262626] bg-white dark:bg-[#141414] shadow-sm">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-[#FDFCFA] dark:bg-[#0A0A0A] text-amber-600 dark:text-[#FACC15] border-b border-black/10 dark:border-[#262626]">
                        <tr>
                          <th className="p-3">Ref ID</th>
                          <th className="p-3">Candidate</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Institution</th>
                          <th className="p-3">Workshop</th>
                          <th className="p-3">Fee (₹)</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Date</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/10 dark:divide-[#262626] text-neutral-950 dark:text-[#F5F5F5]">
                        {filtered.map((reg) => {
                          const isPaid = reg.paymentStatus === 'Paid' || (reg.amount && reg.amount > 0 && reg.paymentStatus !== 'Pending');
                          const isPending = reg.paymentStatus === 'Pending';

                          return (
                            <tr key={reg.id} className="hover:bg-[#FDFCFA]/50 dark:hover:bg-[#0A0A0A]/60">
                              <td className="p-3 font-bold text-amber-600 dark:text-[#FACC15] whitespace-nowrap">
                                {reg.id}
                              </td>
                              <td className="p-3 font-semibold text-neutral-950 dark:text-[#F5F5F5] whitespace-nowrap">
                                {reg.candidateName}
                              </td>
                              <td className="p-3 text-neutral-500 dark:text-neutral-400">
                                <div>{reg.candidateEmail}</div>
                                {reg.candidatePhone && reg.candidatePhone !== 'Not provided' && (
                                  <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                                    {reg.candidatePhone}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-neutral-600 dark:text-neutral-300">{reg.candidateInstitution}</td>
                              <td className="p-3 font-medium max-w-xs truncate" title={reg.workshopTitle}>
                                {reg.workshopTitle}
                              </td>
                              <td className="p-3 font-bold text-neutral-900 dark:text-neutral-200 whitespace-nowrap">
                                {reg.amount ? `₹${Number(reg.amount).toLocaleString('en-IN')}` : 'Free'}
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                    isPaid
                                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                      : isPending
                                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                      : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20'
                                  }`}
                                >
                                  {isPaid ? 'Paid' : isPending ? 'Pending' : 'Free / Confirmed'}
                                </span>
                              </td>
                              <td className="p-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                                {new Date(reg.registeredAt).toLocaleDateString()}
                              </td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <button
                                  onClick={() => handleTogglePayment(reg)}
                                  disabled={updatingPaymentId === reg.id}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                    isPaid
                                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:text-amber-300'
                                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300'
                                  }`}
                                  title="Toggle between Paid and Pending"
                                >
                                  {updatingPaymentId === reg.id
                                    ? 'Updating...'
                                    : isPaid
                                    ? 'Set Pending'
                                    : 'Mark as Paid'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* Google Sheets Configuration Modal */}
              {sheetsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
                  <div className="w-full max-w-xl p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-2xl space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-[#262626]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-headline font-bold text-lg text-neutral-900 dark:text-neutral-100">
                            Connect Google Sheets Live Sync
                          </h3>
                          <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                            Real-time automatic sync for Candidate Registrations &amp; Payments.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSheetsModalOpen(false)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quick 3-step Instructions */}
                    <div className="p-4 rounded-2xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/5 dark:border-[#222] text-xs font-mono space-y-2 text-neutral-700 dark:text-neutral-300">
                      <div className="font-bold text-amber-600 dark:text-[#FACC15] uppercase tracking-wider text-[10px]">
                        Quick 1-Minute Setup Guide:
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                        <li>
                          Open{' '}
                          <a
                            href="https://sheets.new"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-amber-600 dark:text-[#FACC15] font-bold"
                          >
                            sheets.new
                          </a>{' '}
                          in a new tab to create a new Google Sheet.
                        </li>
                        <li>
                          In top menu, click <strong>Extensions &gt; Apps Script</strong>.
                        </li>
                        <li>
                          Replace the code with{' '}
                          <span className="font-bold text-neutral-900 dark:text-white">
                            scripts/google-apps-script.js
                          </span>{' '}
                          from this project.
                        </li>
                        <li>
                          Click <strong>Deploy &gt; New deployment</strong> &gt; Select <strong>Web app</strong> &gt; set Who has access to <strong>Anyone</strong>.
                        </li>
                        <li>
                          Copy the generated <strong>Web app URL</strong> (ends in <code>/exec</code>) and paste it below!
                        </li>
                      </ol>
                    </div>

                    <form onSubmit={handleSaveSheetsConfig} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          Google Apps Script Web App URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={webhookInput}
                          onChange={(e) => setWebhookInput(e.target.value)}
                          placeholder="https://script.google.com/macros/s/.../exec"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-xs font-mono text-neutral-900 dark:text-neutral-100 outline-none focus:border-[#FACC15]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                          Google Sheet Link (Optional — for 1-click opening)
                        </label>
                        <input
                          type="url"
                          value={sheetUrlInput}
                          onChange={(e) => setSheetUrlInput(e.target.value)}
                          placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-xs font-mono text-neutral-900 dark:text-neutral-100 outline-none focus:border-[#FACC15]"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setSheetsModalOpen(false)}
                          className="px-4 py-2.5 rounded-xl text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingConfig || !webhookInput.trim()}
                          className="px-5 py-2.5 rounded-xl bg-[#0A0A0A] dark:bg-[#FACC15] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                          {savingConfig ? 'Saving & Testing...' : 'Save & Test Connection'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
