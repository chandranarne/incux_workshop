import React, { useState } from 'react';
import { X, User, Lock, Mail, Building, ArrowRight, AlertCircle } from 'lucide-react';
import { loginUser, registerCandidate } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#FDFCFA] dark:bg-[#141414] backdrop-blur-xl border border-black/10 dark:border-[#262626] shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100 dark:bg-[#0A0A0A] flex items-center justify-center text-neutral-600 dark:text-[#FACC15] hover:bg-[#FACC15] hover:text-[#0A0A0A] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h3 className="font-headline font-bold text-2xl text-neutral-950 dark:text-[#F5F5F5]">
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
        <form onSubmit={handleSubmit} className="space-y-3.5">
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
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#F5F5F5] focus:border-[#FACC15] dark:focus:border-[#FACC15] outline-none"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
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
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#F5F5F5] focus:border-[#FACC15] dark:focus:border-[#FACC15] outline-none"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
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
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#F5F5F5] focus:border-[#FACC15] dark:focus:border-[#FACC15] outline-none"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-xs font-mono text-neutral-700 dark:text-neutral-300 mb-1">
                College / Institution Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="Enter your college or university"
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#F5F5F5] focus:border-[#FACC15] dark:focus:border-[#FACC15] outline-none"
                />
                <Building className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#0A0A0A] font-headline font-black text-sm uppercase tracking-wider shadow-lg shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-5 pt-4 border-t border-black/10 dark:border-[#262626] text-center text-xs font-mono">
          {isRegistering ? (
            <p className="text-neutral-600 dark:text-neutral-400">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError('');
                }}
                className="text-amber-600 dark:text-[#FACC15] font-bold underline ml-1 hover:opacity-80 cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setError('');
                }}
                className="text-amber-600 dark:text-[#FACC15] font-bold underline ml-1 hover:opacity-80 cursor-pointer"
              >
                Create free account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
