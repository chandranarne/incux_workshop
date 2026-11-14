import React, { useEffect, useState } from 'react';
import { Shield, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import PortalModal from './PortalModal';
import {
  loginAdmin,
  setAdminToken,
  clearAdminToken,
  verifyAdminSession
} from '../services/api';

export default function AdminPage() {
  const [state, setState] = useState('checking');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const valid = await verifyAdminSession();
      if (active) setState(valid ? 'open' : 'locked');
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const session = await loginAdmin(passcode);
      setAdminToken(session.token);
      setPasscode('');
      setState('open');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const goHome = () => {
    window.location.assign('/');
  };

  const signOut = () => {
    clearAdminToken();
    setPasscode('');
    setError('');
    setState('locked');
  };

  if (state === 'open') {
    return <PortalModal isOpen onClose={goHome} isAdmin onLogout={signOut} />;
  }

  return (
    <main className="min-h-screen w-full bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-[#FACC15] transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to site
        </a>

        <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-[#262626] shadow-2xl">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#FACC15]/15 dark:bg-[#FACC15]/10 text-amber-600 dark:text-[#FACC15] border border-[#FACC15]/30 mb-5">
            <Shield className="w-6 h-6" />
          </div>

          <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight">
            Admin Console
          </h1>
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 font-body leading-relaxed">
            Enter the admin passphrase to post workshops, manage cohorts, and review
            candidate registrations.
          </p>

          {state === 'checking' ? (
            <div className="mt-6 flex items-center gap-2 text-sm font-mono text-neutral-500 dark:text-neutral-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking session
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <label className="block">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Passphrase
                </span>
                <input
                  type="password"
                  value={passcode}
                  onChange={(event) => setPasscode(event.target.value)}
                  required
                  autoFocus
                  autoComplete="current-password"
                  placeholder="Admin passphrase"
                  className="mt-1.5 w-full px-4 py-3 rounded-xl bg-[#F8F8F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm font-mono text-neutral-900 dark:text-[#F5F5F5] focus:outline-none focus:border-[#FACC15]"
                />
              </label>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-200 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={busy || !passcode.trim()}
                className="w-full py-3.5 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] dark:bg-[#FACC15] dark:hover:bg-[#EAB308] text-[#FACC15] dark:text-[#0A0A0A] font-headline font-black text-xs uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {busy ? 'Verifying' : 'Unlock admin console'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
          Sessions expire after 8 hours. All actions are written to the backend.
        </p>
      </div>
    </main>
  );
}
