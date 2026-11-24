'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import { STARTER_TOOLS, CATEGORIES } from '@/config/tools';
import {
  Sheet,
  Presentation,
  FileText,
  Minimize2,
  Image as ImageIcon,
  Video,
  Crop,
  Scissors,
  Layers,
  FileImage,
  RotateCw,
  Film,
  VolumeX,
  Stamp,
  QrCode,
  Key,
  AlignLeft,
  Type,
  ArrowRight,
  Search,
  Shield,
  Zap,
  Globe,
  Grid2X2,
  Grid3X3,
  List,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Sheet,
  Presentation,
  FileText,
  Minimize2,
  Image: ImageIcon,
  Video,
  Crop,
  Scissors,
  Layers,
  FileImage,
  RotateCw,
  Film,
  VolumeX,
  Stamp,
  QrCode,
  Key,
  AlignLeft,
  Type,
};

function SearchParamsWatcher({ onSelect }: { onSelect: (cat: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      onSelect(cat);
      setTimeout(() => {
        const el = document.getElementById('tools-catalog');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [searchParams, onSelect]);
  return null;
}

function HomeContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileColumns, setMobileColumns] = useState<2 | 3 | 1>(2);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('omnitools_mobile_cols');
      if (saved === '1' || saved === '2' || saved === '3') {
        setMobileColumns(parseInt(saved) as 2 | 3 | 1);
      }
    } catch {
      // ignore localStorage error
    }
  }, []);

  const handleSetMobileCols = (cols: 2 | 3 | 1) => {
    setMobileColumns(cols);
    try {
      localStorage.setItem('omnitools_mobile_cols', cols.toString());
    } catch {
      // ignore
    }
  };

  const scrollToTools = (catId?: string) => {
    if (catId) setSelectedCategory(catId);
    setTimeout(() => {
      const el = document.getElementById('tools-catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // All Tools Filtered
  const filteredTools = STARTER_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderMobileLayoutSwitcher = () => (
    <div className="flex items-center justify-between sm:hidden mb-4 px-1">
      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
        Layout
      </span>
      <div className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60">
        <button
          type="button"
          onClick={() => handleSetMobileCols(2)}
          aria-label="2 Columns Layout"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
            mobileColumns === 2
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Grid2X2 className="w-3.5 h-3.5" />
          <span>2 Cols</span>
        </button>
        <button
          type="button"
          onClick={() => handleSetMobileCols(3)}
          aria-label="3 Columns Layout"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
            mobileColumns === 3
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span>3 Cols</span>
        </button>
        <button
          type="button"
          onClick={() => handleSetMobileCols(1)}
          aria-label="1 Column Layout"
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
            mobileColumns === 1
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>1 Col</span>
        </button>
      </div>
    </div>
  );

  const gridClass =
    mobileColumns === 3
      ? 'grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6'
      : mobileColumns === 2
      ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-[#0a0a0b] text-neutral-900 dark:text-neutral-100 font-sans">
      <Suspense fallback={null}>
        <SearchParamsWatcher onSelect={setSelectedCategory} />
      </Suspense>
      <Header activeCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* Top Banner Ad */}
      <AdBanner placement="top-leaderboard" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-14">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-[15px] font-medium bg-rose-50/90 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60 mb-6 shadow-xs max-w-full">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span className="sm:hidden">Zero server uploads <span className="text-rose-300 dark:text-rose-800 mx-1">•</span> 100% private</span>
            <span className="hidden sm:inline">Zero server uploads <span className="text-rose-300 dark:text-rose-800 mx-1.5">•</span> 100% free private browser utilities</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 max-w-2xl mx-auto mb-3 leading-tight">
            Online File Converters & Media Utilities
          </h1>

          {/* Small signature red line */}
          <div className="w-12 h-1 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full mx-auto mb-5" />

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed mb-8">
            Fast document conversions, media compression, and precision pixel cropping. All computation executes locally inside your browser.
          </p>

          {/* Quick Search Bar */}
          <div className="relative max-w-lg mx-auto mb-4">
            <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              aria-label="Search all online tools"
              placeholder="Search tools (e.g. PDF, Excel, Crop, Video, Password)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm sm:text-base placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-xs"
            />
          </div>

          {/* Quick Popular Tools Access (SEO Internal Linking & Direct Fast Navigation) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-medium text-neutral-400 dark:text-neutral-500 mr-0.5">Popular:</span>
            <Link
              href="/compress-image"
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 transition-colors shadow-2xs font-medium"
            >
              Compress Image
            </Link>
            <Link
              href="/merge-pdf"
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 transition-colors shadow-2xs font-medium"
            >
              Merge PDF
            </Link>
            <Link
              href="/pdf-to-excel"
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 transition-colors shadow-2xs font-medium"
            >
              PDF to Excel
            </Link>
            <Link
              href="/password-generator"
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 transition-colors shadow-2xs font-medium"
            >
              Password Generator
            </Link>
            <Link
              href="/compress-video"
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 transition-colors shadow-2xs font-medium"
            >
              Compress Video
            </Link>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-label={`Filter tools by ${cat.label}`}
                  aria-pressed={isActive}
                  className={`h-9 sm:h-10 px-3.5 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 text-white dark:bg-rose-600 dark:text-white font-semibold shadow-xs hover:bg-rose-700'
                      : 'bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* COMPLETE TOOLS CATALOG (TARGET OF HEADER CLICKS) */}
        {/* ========================================================= */}
        <section id="tools-catalog" className="pt-6 scroll-mt-24">
          {/* Mobile Layout Switcher */}
          {renderMobileLayoutSwitcher()}

          {/* All Tools Grid */}
          <div className={`${gridClass} mb-16`}>
            {filteredTools.map((tool) => {
              const IconComponent = ICON_MAP[tool.icon] || FileText;
              return (
                <Link
                  key={tool.id}
                  href={`/${tool.slug}`}
                  className={`group rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-rose-200 dark:hover:border-rose-900/60 hover:shadow-xs transition-all flex flex-col justify-between ${
                    mobileColumns === 3
                      ? 'p-3'
                      : 'p-4 sm:p-5'
                  }`}
                >
                  <div>
                    <div className={`mb-3 ${mobileColumns === 3 ? 'flex justify-center sm:justify-start' : ''}`}>
                      <div className={`rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100/80 dark:border-rose-900/40 flex items-center justify-center transition-all group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 dark:group-hover:bg-rose-600 dark:group-hover:text-white ${
                        mobileColumns === 3
                          ? 'w-8 h-8 sm:w-10 sm:h-10'
                          : 'w-10 h-10 sm:w-11 sm:h-11'
                      }`}>
                        <IconComponent className={mobileColumns === 3 ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-5 h-5'} />
                      </div>
                    </div>

                    <h3 className={`font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors tracking-tight ${
                      mobileColumns === 3
                        ? 'text-xs sm:text-base text-center sm:text-left line-clamp-2 leading-tight'
                        : 'text-base sm:text-lg line-clamp-1 sm:line-clamp-none mb-1 leading-snug'
                    }`}>
                      {tool.title}
                    </h3>
                    <p className={`text-neutral-500 dark:text-neutral-400 leading-relaxed ${
                      mobileColumns === 3
                        ? 'hidden sm:block text-xs line-clamp-2'
                        : 'text-xs sm:text-sm line-clamp-2'
                    }`}>
                      {tool.shortDesc}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center justify-between text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 pt-3 border-t border-neutral-100 dark:border-neutral-800 mt-4 transition-colors">
                    <span>Open tool</span>
                    <ArrowRight className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-12 border-t border-neutral-200/80 dark:border-neutral-800">
          <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-left">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-3">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 mb-1">
              Client-Side Privacy First
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Media compression, conversion, and editing run entirely in your local browser sandbox. Files never leave your device.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-left">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 mb-1">
              Zero Accounts or Setup
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              No sign-in walls, subscriptions, or waitlists. Drop your file and get immediate, friction-free results.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-left">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-3">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 mb-1">
              Cross-Platform & Offline
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Engineered with modern WebAssembly and HTML5 APIs for consistent performance on mobile, tablet, and desktop.
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <AdBanner placement="sticky-footer" />
    </div>
  );
}

export default function HomePage() {
  return <HomeContent />;
}
