import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — User Agreement & Rules',
  description: 'Review the official Terms of Service, usage agreements, liability disclaimers, and policies governing the use of iLoveTools in-browser utilities.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium mb-4">
            <FileCheck className="w-3.5 h-3.5" />
            <span>User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-3">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Last Updated: November 2026 • Please read carefully before using our tools
          </p>
        </div>

        <div className="space-y-8 text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              2. Permitted Use & Lawful Conduct
            </h2>
            <p>
              Our web utilities are provided free of charge for personal, academic, and commercial document and media editing, compression, and conversion. You agree to use the service only for lawful purposes:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>You may not use our tools to process copyrighted material without proper authorization or ownership rights.</li>
              <li>You may not use automated bots or scrapers to perform denial-of-service attacks or degrade site infrastructure.</li>
              <li>You retain 100% full ownership and intellectual property rights over all files you process using our in-browser utilities.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              3. Disclaimer of Warranties (&quot;As-Is&quot; Software)
            </h2>
            <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm leading-relaxed">
              <strong>IMPORTANT LEGAL DISCLAIMER:</strong> All services and software tools are provided strictly on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis without warranties of any kind, either express or implied, including but not limited to fitness for a particular purpose, non-infringement, or error-free operation. Users are solely responsible for maintaining backup copies of their original documents, videos, and images prior to processing.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              4. Limitation of Liability
            </h2>
            <p>
              Under no circumstances shall the operators, authors, or hosting providers of this website be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use our tools, including but not limited to loss of data, corrupted documents, or business interruptions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              5. Trademark & Intellectual Property Disclaimers
            </h2>
            <p>
              All product names, logos, brands, trademarks, and registered trademarks mentioned on this website belong to their respective owners:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li><strong>Microsoft, Word, Excel, and PowerPoint</strong> are registered trademarks of Microsoft Corporation.</li>
              <li><strong>Adobe, Acrobat, and PDF</strong> are registered trademarks of Adobe Inc.</li>
              <li><strong>Apple, iPhone, and HEIC</strong> are trademarks of Apple Inc.</li>
              <li><strong>iLoveTools</strong> is an independent web utility platform and is not sponsored, endorsed by, or affiliated with Microsoft, Adobe, Apple, Google, or iLovePDF S.L.</li>
            </ul>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              References to third-party file formats, software titles, and trademarks are used strictly for <em>nominative identification purposes</em> to describe file conversion compatibility and interoperability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              6. Modifications to Terms
            </h2>
            <p>
              We reserve the right to modify or replace these Terms of Service at any time. Changes will be posted to this page with an updated effective date. Continued use of our utilities after any such changes constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              7. Contact Information
            </h2>
            <p>
              For legal inquiries, copyright notices, or questions concerning these Terms of Service, please contact:
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
