import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Home, ArrowRight, Video, FileText, Image as ImageIcon } from 'lucide-react';

export default function NotFound() {
  const featuredTools = [
    {
      title: 'Video Compressor',
      desc: 'Compress MP4, WebM, and MOV videos locally with zero uploads.',
      slug: 'compress-video',
      icon: Video,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    },
    {
      title: 'Merge PDF',
      desc: 'Combine multiple PDF documents into one unified file instantly.',
      slug: 'merge-pdf',
      icon: FileText,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    },
    {
      title: 'Image to PDF',
      desc: 'Convert JPG, PNG, and WebP images to professional PDF documents.',
      slug: 'image-to-pdf',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Compress Image',
      desc: 'Reduce image file size by up to 80% without visible quality loss.',
      slug: 'compress-image',
      icon: ImageIcon,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 max-w-3xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <span>Error 404</span>
          <span>•</span>
          <span>Tool Not Found</span>
        </div>

        {/* Semantic H1 for SEO compliance */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mb-4">
          Page or Tool Not Found
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mb-8 leading-relaxed">
          The requested page or tool URL does not exist or may have been retired. 
          All our official web converters run 100% private in your browser with zero server uploads.
        </p>

        {/* Return Home CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Browse All 28+ Free Tools</span>
          </Link>
        </div>

        {/* Popular Tools Fallback Grid */}
        <div className="w-full text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4 text-center">
            Or try one of our popular free utilities:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredTools.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.slug}
                  href={`/${t.slug}`}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all group"
                >
                  <div className={`p-2.5 rounded-lg border shrink-0 ${t.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {t.title}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
