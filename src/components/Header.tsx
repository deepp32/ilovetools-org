'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '@/config/tools';
import BrandLogo from './BrandLogo';

interface HeaderProps {
  activeCategory?: string;
  onSelectCategory?: (id: string) => void;
}

export default function Header({ activeCategory = 'all', onSelectCategory }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleCategoryClick = (categoryId: string) => {
    if (pathname === '/') {
      // On homepage: select category and smoothly scroll down to the tools section
      if (onSelectCategory) {
        onSelectCategory(categoryId);
      }
      setTimeout(() => {
        const el = document.getElementById('tools-catalog');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      // From any tool page: navigate to homepage with category parameter and jump to tools section
      router.push(`/?category=${categoryId}#tools-catalog`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo with Signature Red Heart */}
        <Link
          href="/"
          className="shrink-0 group flex items-center transition-opacity hover:opacity-95"
          aria-label="iLoveTools Homepage"
        >
          <BrandLogo size="md" />
        </Link>

        {/* Categories Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Tool Categories">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                aria-label={`View ${cat.label}`}
                aria-pressed={isActive}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-semibold border border-rose-200/70 dark:border-rose-900/50 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Security / Privacy Trust Indicator */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[13px] font-medium text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Client-Side Only
          </span>
        </div>
      </div>

      {/* Mobile Category Scrollbar */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/60 scrollbar-none" aria-label="Mobile Tool Categories">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              aria-label={`View ${cat.label}`}
              aria-pressed={isActive}
              className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white font-semibold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
