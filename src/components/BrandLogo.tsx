'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export default function BrandLogo({
  size = 'md',
  showWordmark = true,
  className = '',
}: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-[8px]',
    md: 'w-8 h-8 sm:w-9 sm:h-9 rounded-[10px]',
    lg: 'w-11 h-11 sm:w-12 sm:h-12 rounded-[14px]',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Signature Red Heart Mark */}
      <div
        className={`${iconSizes[size]} bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 shadow-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
        style={{
          boxShadow: '0 2px 8px -2px rgba(225, 29, 72, 0.4)',
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-xs"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Wordmark with signature "Love" in rose/red */}
      {showWordmark && (
        <span
          className={`font-bold tracking-tight text-neutral-900 dark:text-white ${textSizes[size]} flex items-center`}
        >
          <span>i</span>
          <span className="text-rose-600 dark:text-rose-500 transition-colors">Love</span>
          <span>Tools</span>
        </span>
      )}
    </div>
  );
}
