'use client';

import React from 'react';
import Link from 'next/link';
import { STARTER_TOOLS } from '@/config/tools';
import { ShieldCheck } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-50 dark:bg-[#0a0a0b] border-t border-neutral-200/80 dark:border-neutral-800 pt-12 pb-20 text-neutral-500 dark:text-neutral-400 text-sm">
      <div className="max-w-6xl mx-auto px-4">
        {/* Brand Banner */}
        <div className="mb-10 pb-8 border-b border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="group" aria-label="iLoveTools Homepage">
            <BrandLogo size="md" />
          </Link>
          <p className="text-xs text-neutral-500 max-w-md">
            The free, private, client-side online tools suite. All conversions and modifications process 100% locally on your device with zero server storage.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Converters */}
          <div>
            <h4 className="font-semibold text-xs sm:text-[13px] text-neutral-900 dark:text-neutral-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Converters
            </h4>
            <ul className="space-y-2 text-sm">
              {STARTER_TOOLS.filter((t) => t.category === 'convert').map((tool) => (
                <li key={tool.id}>
                  <Link href={`/${tool.slug}`} aria-label={tool.title} className="text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Compress & Crop */}
          <div>
            <h4 className="font-semibold text-xs sm:text-[13px] text-neutral-900 dark:text-neutral-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Compress & Crop
            </h4>
            <ul className="space-y-2 text-sm">
              {STARTER_TOOLS.filter((t) => t.category === 'compress' || t.category === 'edit').map((tool) => (
                <li key={tool.id}>
                  <Link href={`/${tool.slug}`} aria-label={tool.title} className="text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: PDF Utilities */}
          <div>
            <h4 className="font-semibold text-xs sm:text-[13px] text-neutral-900 dark:text-neutral-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              PDF Utilities
            </h4>
            <ul className="space-y-2 text-sm">
              {STARTER_TOOLS.filter((t) => t.category === 'pdf').map((tool) => (
                <li key={tool.id}>
                  <Link href={`/${tool.slug}`} aria-label={tool.title} className="text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Media & Utilities */}
          <div>
            <h4 className="font-semibold text-xs sm:text-[13px] text-neutral-900 dark:text-neutral-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Media & Utilities
            </h4>
            <ul className="space-y-2 mb-6 text-sm">
              {STARTER_TOOLS.filter((t) => t.category === 'media' || t.category === 'productivity').map((tool) => (
                <li key={tool.id}>
                  <Link href={`/${tool.slug}`} aria-label={tool.title} className="text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-semibold text-xs sm:text-[13px] text-neutral-900 dark:text-neutral-200 uppercase tracking-wider mb-1.5">
              Privacy Guarantee
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed mb-2.5">
              Zero server-side persistence. All conversions and modifications take place inside your browser engine.
            </p>
            <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 font-medium text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero file transmission</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© 2026 iLoveTools. All processing performed locally in your browser.</p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/privacy" aria-label="Privacy Policy" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" aria-label="Terms of Service" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="pt-4 text-[11px] text-neutral-400 dark:text-neutral-600 leading-relaxed text-center sm:text-left">
          <p>
            Disclaimer: Microsoft, Excel, Word, PowerPoint, Apple, and Adobe are trademarks of their respective owners. iLoveTools is an independent browser utility platform and is not sponsored by or affiliated with Microsoft, Adobe, Apple, or iLovePDF S.L. All file conversions are processed locally on your device.
          </p>
        </div>
      </div>
    </footer>
  );
}
