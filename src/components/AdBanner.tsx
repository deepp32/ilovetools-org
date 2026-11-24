'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface AdBannerProps {
  placement: 'top-leaderboard' | 'sidebar-left' | 'sidebar-right' | 'in-content' | 'sticky-footer';
  className?: string;
  slotId?: string;
}

export default function AdBanner({ placement, className = '', slotId }: AdBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef<boolean>(false);

  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1992103509447219';
  const showPlaceholders =
    process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === 'true' ||
    process.env.NODE_ENV === 'development';

  // Strict check: An AdSense slot ID must be a non-empty numeric string
  const isValidSlot = Boolean(
    slotId &&
    typeof slotId === 'string' &&
    slotId.trim() !== '' &&
    slotId !== 'auto' &&
    /^\d+$/.test(slotId.trim())
  );

  useEffect(() => {
    // Only attempt to push if we have a valid client, valid slot, and haven't pushed yet
    if (!adsenseClientId || !isValidSlot || isDismissed || pushedRef.current) {
      return;
    }

    const tryPush = () => {
      const el = insRef.current;
      if (!el) return false;

      // Guard 1: Never push if AdSense has already processed this slot
      if (el.getAttribute('data-adsbygoogle-status')) {
        pushedRef.current = true;
        return true;
      }

      // Guard 2: Never push if element has 0 width (e.g. hidden on mobile / desktop breakpoints)
      // This prevents "No slot size for availableWidth=0"
      const width = el.offsetWidth || el.clientWidth || el.parentElement?.offsetWidth || 0;
      if (width <= 0) {
        return false;
      }

      try {
        // @ts-expect-error window.adsbygoogle
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
        return true;
      } catch (err) {
        console.warn('AdSense push notice:', err);
        return false;
      }
    };

    // Attempt immediate push if already visible with layout width
    if (tryPush()) {
      return;
    }

    // If currently hidden (e.g. sidebar responsive breakpoint or pending layout), observe until visible
    if (typeof ResizeObserver !== 'undefined' && insRef.current) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && !pushedRef.current) {
            if (tryPush()) {
              ro.disconnect();
            }
          }
        }
      });
      ro.observe(insRef.current);
      return () => ro.disconnect();
    }
  }, [adsenseClientId, isValidSlot, isDismissed]);

  if (isDismissed) return null;

  // Real Manual AdSense Units: ONLY rendered when a valid numeric ad slot ID is provided
  if (adsenseClientId && isValidSlot) {
    if (placement === 'top-leaderboard') {
      return (
        <aside
          aria-label="Advertisement"
          className={`w-full max-w-5xl mx-auto my-3 px-4 flex flex-col items-center ${className}`}
        >
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
            Advertisement
          </span>
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adsenseClientId}
            data-ad-slot={slotId}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        </aside>
      );
    }

    if (placement === 'sidebar-left' || placement === 'sidebar-right') {
      return (
        <aside
          aria-label="Advertisement"
          className={`hidden xl:flex flex-col items-center w-[160px] shrink-0 sticky top-24 self-start my-6 ${className}`}
        >
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
            Advertisement
          </span>
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '160px', height: '600px' }}
            data-ad-client={adsenseClientId}
            data-ad-slot={slotId}
          />
        </aside>
      );
    }

    if (placement === 'in-content') {
      return (
        <aside
          aria-label="Advertisement"
          className={`w-full max-w-3xl mx-auto my-8 px-4 flex flex-col items-center ${className}`}
        >
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
            Sponsored
          </span>
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adsenseClientId}
            data-ad-slot={slotId}
            data-ad-format="rectangle,horizontal"
            data-full-width-responsive="true"
          />
        </aside>
      );
    }

    if (placement === 'sticky-footer') {
      return (
        <aside
          aria-label="Advertisement"
          className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 py-2 px-4 shadow-lg flex items-center justify-center ${className}`}
        >
          <div className="max-w-4xl w-full flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center justify-center">
              <ins
                ref={insRef}
                className="adsbygoogle"
                style={{ display: 'inline-block', width: '728px', height: '50px' }}
                data-ad-client={adsenseClientId}
                data-ad-slot={slotId}
              />
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Close Advertisement"
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      );
    }

    return null;
  }

  // If in production and no ad slot configured, collapse cleanly to ensure 100% polished launch with zero console errors
  if (!showPlaceholders) {
    return null;
  }

  // Development preview placeholders (active only when NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === 'true' or in development)
  if (placement === 'top-leaderboard') {
    return (
      <aside
        aria-label="Advertisement"
        className={`w-full max-w-5xl mx-auto my-3 px-4 flex flex-col items-center ${className}`}
      >
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
          Advertisement Space
        </span>
        <div className="w-full h-16 md:h-[70px] rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 flex items-center justify-center text-xs text-neutral-400 overflow-hidden">
          <div className="text-center px-4">
            <span className="font-medium text-neutral-500 dark:text-neutral-400 block text-xs">
              Optimized Banner Slot (728x90)
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
              Auto-activates when Google AdSense Slot ID is configured
            </span>
          </div>
        </div>
      </aside>
    );
  }

  if (placement === 'sidebar-left' || placement === 'sidebar-right') {
    return (
      <aside
        aria-label="Advertisement"
        className={`hidden xl:flex flex-col items-center w-[160px] shrink-0 sticky top-24 self-start my-6 ${className}`}
      >
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
          Ad Slot
        </span>
        <div className="w-[160px] h-[500px] rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-col items-center justify-center p-3 text-center text-xs text-neutral-400">
          <span className="font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            Sidebar (160x600)
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
            Non-intrusive gutter ad space
          </span>
        </div>
      </aside>
    );
  }

  if (placement === 'in-content') {
    return (
      <aside
        aria-label="Advertisement"
        className={`w-full max-w-3xl mx-auto my-8 px-4 flex flex-col items-center ${className}`}
      >
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
          Sponsored Link
        </span>
        <div className="w-full h-20 sm:h-24 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 flex items-center justify-center text-xs text-neutral-400">
          <div className="text-center px-4">
            <span className="font-medium text-neutral-600 dark:text-neutral-300 block text-xs mb-0.5">
              In-Content Native Placement
            </span>
            <span className="text-[11px] text-neutral-400">
              Clean banner shown below tool workspace
            </span>
          </div>
        </div>
      </aside>
    );
  }

  if (placement === 'sticky-footer') {
    return (
      <aside
        aria-label="Advertisement"
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 py-2 px-4 shadow-lg flex items-center justify-center ${className}`}
      >
        <div className="max-w-4xl w-full flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center justify-center">
            <div className="h-10 w-full max-w-xl rounded-md border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-xs text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/50">
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px] font-medium">
                Footer Banner (728x50 / 320x50)
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Close Advertisement"
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  return null;
}
