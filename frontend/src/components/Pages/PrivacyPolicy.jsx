import React from 'react';
import { FileText, Shield, Clock, Mail, MapPin, Phone } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <section
      id="privacy-policy"
      className="min-h-screen bg-[#FDFCFA] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200"
      aria-label="Privacy Policy"
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
              <FileText className="w-5 h-5 text-amber-600 dark:text-[#FACC15]" />
              <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#0A0A0A] dark:text-[#F5F5F5] tracking-tight">
                Privacy Policy
              </h1>
            </div>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-body leading-relaxed">
              Effective date: November 14, 2026. Last updated: November 14, 2026.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              1. Introduction
            </h2>
            <p>
              IncuxAI (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              2. Information We Collect
            </h2>
            <p>
              We collect information you provide directly, such as when you register for a workshop, submit an inquiry, or create an account. This may include your name, email address, phone number, institution, and other details you voluntarily provide.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              3. How We Use Your Information
            </h2>
            <p>
              We use your information to: process workshop registrations; respond to your inquiries; send updates about workshops and programs; and improve our services. We do not sell your personal data to third parties.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              4. Data Sharing & Disclosure
            </h2>
            <p>
              We may share your information with trusted service providers who assist in operating our platform, provided they agree to keep your data confidential. We do not share data with marketers or unrelated third parties.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              5. Data Security
            </h2>
            <p>
              We implement reasonable technical and organizational measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              6. Your Rights
            </h2>
            <p>
              You may request access to, correction of, or deletion of your personal data by contacting us. You may also opt out of marketing communications at any time.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              7. Cookies & Tracking
            </h2>
            <p>
              Our site may use cookies or similar technologies to improve functionality and analyze traffic. You can control cookie preferences through your browser settings.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 border-t border-black/10 dark:border-[#262626] font-body text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mt-8 sm:mt-10 mb-3">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised effective date.
            </p>
          </div>

          <div className="p-6 sm:p-8 border-t border-black/10 dark:border-[#262626] bg-[#F5F5F0] dark:bg-[#0F0F14]">
            <h2 className="font-headline font-bold text-lg sm:text-xl text-[#0A0A0A] dark:text-[#F5F5F5] mb-4">
              Contact Us
            </h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact us:
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
