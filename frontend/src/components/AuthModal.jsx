import React, { useState } from 'react';
import { X, User, Lock, Mail, Building, ArrowRight, AlertCircle, Phone } from 'lucide-react';
import { loginUser, registerCandidate } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'register' }) {
  const [isRegistering, setIsRegistering] = useState(initialMode !== 'login');

  React.useEffect(() => {
    if (isOpen) {
      setIsRegistering(initialMode !== 'login');
      setError('');
    }
  }, [isOpen, initialMode]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: '',
    phone: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        const res = await registerCandidate(formData);
        onAuthSuccess(res.user);
        onClose();
      } else {
        const res = await loginUser({ email: formData.email, password: formData.password });
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-5 sm:p-8 rounded-3xl bg-[#FDFCFA] dark:bg-[#141414] backdrop-blur-xl border border-black/10 dark:border-[#262626] shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 dark:bg-[#0A0A0A] flex items-center justify-center text-neutral-600 dark:text-[#FACC15] hover:bg-[#FACC15] hover:text-[#0A0A0A] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 sm:mb-6 pr-6">
          <h3 className="font-headline font-bold text-xl sm:text-2xl text-neutral-950 dark:text-[#F5F5F5]">
            {isRegistering ? 'Create Account' : 'Sign In'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isRegistering
              ? 'Register to access workshops, hackathons, and certifications.'
              : 'Enter your email and password to access your platform dashboard.'}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
          {isRegistering && (
            <div>
              <label className="block text-xs font-mono text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 rounded-xl border border-black/10 dark:border-[#262626] bg-white dark:bg-[#0A0A0A] text-neutral-900 dark:text-[#F5F5F5] text-xs sm:text-sm focus:outline-none focus:border-[#FACC15] transition-colors"
                />
                <User className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-neutral-700 dark:text-neutral-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=""
                className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 rounded-xl border border-black/10 dark:border-[#262626] bg-white dark:bg-[#0A0A0A] text-neutral-900 dark:text-[#F5F5F5] text-xs sm:text-sm focus:outline-none focus:border-[#FACC15] transition-colors"
              />
              <Mail className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-700 dark:text-neutral-300 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder=""
                className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 rounded-xl border border-black/10 dark:border-[#262626] bg-white dark:bg-[#0A0A0A] text-neutral-900 dark:text-[#F5F5F5] text-xs sm:text-sm focus:outline-none focus:border-[#FACC15] transition-colors"
              />
              <Lock className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-mono text-neutral-700 dark:text-neutral-300 mb-1">
                  Institution / Organization
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 rounded-xl border border-black/10 dark:border-[#262626] bg-white dark:bg-[#0A0A0A] text-neutral-900 dark:text-[#F5F5F5] text-xs sm:text-sm focus:outline-none focus:border-[#FACC15] transition-colors"
                  />
                  <Building className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-700 dark:text-neutral-300 mb-1">
                  Contact Mobile (WhatsApp)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 rounded-xl border border-black/10 dark:border-[#262626] bg-white dark:bg-[#0A0A0A] text-neutral-900 dark:text-[#F5F5F5] text-xs sm:text-sm focus:outline-none focus:border-[#FACC15] transition-colors"
                  />
                  <Phone className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : isRegistering ? 'Create Account' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-5 text-center text-xs text-neutral-500 dark:text-neutral-400">
          {isRegistering ? (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError('');
                }}
                className="text-amber-600 dark:text-[#FACC15] font-semibold hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setError('');
                }}
                className="text-amber-600 dark:text-[#FACC15] font-semibold hover:underline cursor-pointer"
              >
                Register as candidate
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
