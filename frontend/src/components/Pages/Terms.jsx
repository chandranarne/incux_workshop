import React from 'react';
import { Shield, FileText, Clock, Mail, MapPin, Phone } from 'lucide-react';

export default function Terms() {
  return (
    <section
      id="terms-of-use"
      className="min-h-screen bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200"
      aria-label="Terms of Use"
    >
      <div className="max-w-3xl mx-auto">
        {/* Back to Home */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('navigate-home'))}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-amber-600 dark:text-[#FACC15] hover:text-[#0A0A0A] dark:hover:text-[#0A0A0A] mb-8 sm:mb-12 transition-colors cursor-pointer"
          aria-label="Back to homepage"
        >
          <span>Back to Home</span>
        </button>

        <div className="rounded-3xl bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-[#262626] shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-black/10 dark:border-[#262626] bg-[#F5F5F0] dark:bg-[#0F0F14]">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-amber-600 dark:text-[#FACC15]" />
              <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
                Terms of Use
              </h1>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-body leading-relaxed">
              Effective date: November 14, 2026. Last updated: November 14, 2026.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the IncuxAI website and workshop platform (the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Use. If you do not agree, you may not use the Service.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              2. Eligibility
            </h2>
            <p>
              You must be at least 13 years of age to use the Service. By registering for workshops or submitting inquiries, you represent that you meet this age requirement and have the authority to enter into these terms.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              3. Workshop Registration & Participation
            </h2>
            <p>
              Workshop seats are limited and allocated on a first-come, first-served basis. Registration does not guarantee admission until payment (if applicable) is confirmed. IncuxAI reserves the right to cancel, reschedule, or modify any workshop at its discretion.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              4. User Conduct
            </h2>
            <p>
              You agree not to misuse the Service, including but not limited to: submitting false information, attempting unauthorized access, or interfering with the operation of the platform.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              5. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the property of IncuxAI or its licensors and is protected by copyright and trademark laws.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              6. Limitation of Liability
            </h2>
            <p>
              IncuxAI and its affiliates are not liable for any indirect, incidental, or consequential damages arising out of your use of or inability to use the Service.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              7. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of India, without regard to conflict of law principles.
            </p>
          </div>

          <div className="p-6 sm:p-8 border-t border-black/10 dark:border-[#262626] bg-[#F5F5F0] dark:bg-[#0F0F14]">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mb-4">
              Contact Us
            </h2>
            <p className="mb-4">
              If you have questions about these Terms of Use, please contact us:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm font-mono">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-amber-600 dark:text-[#FACC15] shrink-0" />
                <span>
                  info@incuxai.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-amber-600 dark:text-[#FACC15] shrink-0" />
                <span>
                  +91 7665061289
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-amber-600 dark:text-[#FACC15] shrink-0" />
                <span>
                  Guntur, Andhra Pradesh, India
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
