import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — In-Browser Data Privacy',
  description: 'Learn how our 100% in-browser tools protect your confidential documents, videos, and images with zero server uploads or tracking.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Architecture-Level Privacy Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Last Updated: November 2026 • Effective Immediately
          </p>
        </div>

        {/* Core Guarantee Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 mb-10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1.5">
                The 100% Client-Side Privacy Standard
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Unlike cloud conversion platforms that require you to upload confidential tax filings, medical records, invoices, or private photos to remote servers, our platform executes 100% of its file processing locally inside your web browser. 
                <strong> Your files never leave your device, are never transmitted over the internet, and are never saved to our servers.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              1. Information We Do Not Collect
            </h3>
            <p>
              By virtue of our technical architecture, we have designed our platform to minimize data collection entirely:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li><strong>No File Uploads:</strong> PDF documents, video recordings, audio tracks, spreadsheets, and photos processed through our tools remain strictly in your device&apos;s volatile RAM.</li>
              <li><strong>No User Account or Registration Data:</strong> We do not ask for names, passwords, physical addresses, or telephone numbers to use our tools.</li>
              <li><strong>No Document Content Logging:</strong> We do not inspect, index, analyze, or train machine learning models on any user file contents.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              2. Cookies & Local Storage
            </h3>
            <p>
              We use minimal local browser storage (<code className="text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">localStorage</code>) exclusively for saving non-personal user interface preferences, such as:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>Dark mode / light mode theme preferences.</li>
              <li>Preferred tool catalog display view (1-column, 2-column, or 3-column layout on mobile/desktop).</li>
            </ul>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              These preferences exist solely inside your local web browser and are never transmitted to external analytics servers.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              3. Third-Party Advertising & Analytics Disclosures (Google AdSense)
            </h3>
            <p>
              To maintain our tools as 100% free and accessible without subscription paywalls, we display advertisements provided by third-party advertising partners, including Google AdSense.
            </p>
            <p>
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-white underline hover:opacity-80"
              >
                AboutAds.info
              </a>{' '}
              or adjusting Google Ad Settings at{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-white underline hover:opacity-80"
              >
                adssettings.google.com
              </a>.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              4. GDPR & CCPA Compliance
            </h3>
            <p>
              Under the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), users have rights regarding personal data access and deletion.
            </p>
            <p>
              Because our website architecture operates entirely on <strong>Data Minimization by Design</strong>, we do not store, process, or sell any personal data or documents. As a result, requests to delete or export processed documents are moot, as your documents exist only on your local machine and cease to exist in browser memory once your tab is closed.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              5. Contact Us
            </h3>
            <p>
              If you have any questions regarding this Privacy Policy or our client-side security architecture, please contact our administrative team at:
            </p>
            <p className="font-semibold text-neutral-900 dark:text-white">
              Email: contact.ilovetools@gmail.com
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
