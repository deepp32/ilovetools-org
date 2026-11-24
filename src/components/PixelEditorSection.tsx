'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Crop, Ratio, Maximize2, Move, Play, Pause } from 'lucide-react';
import { CropArea } from '@/utils/mediaProcessor';

interface PixelEditorProps {
  initialWidth?: number;
  initialHeight?: number;
  isVideo?: boolean;
  onDimensionsChange: (width: number, height: number, cropArea?: CropArea) => void;
  previewUrl?: string | null;
}

const PRESETS = [
  { label: 'Free Size Crop', width: 0, height: 0, ratio: 0, isFree: true, desc: 'Custom Unlocked Crop' },
  { label: '1:1 Square', width: 1080, height: 1080, ratio: 1 / 1, isFree: false, desc: 'Instagram / Avatar' },
  { label: '9:16 Vertical', width: 1080, height: 1920, ratio: 9 / 16, isFree: false, desc: 'TikTok / Reels / Shorts' },
  { label: '16:9 Wide', width: 1920, height: 1080, ratio: 16 / 9, isFree: false, desc: 'YouTube / Monitor' },
  { label: '4:5 Portrait', width: 1080, height: 1350, ratio: 4 / 5, isFree: false, desc: 'Instagram Feed' },
];

export default function PixelEditorSection({
  initialWidth = 1200,
  initialHeight = 800,
  isVideo = false,
  onDimensionsChange,
  previewUrl,
}: PixelEditorProps) {
  const [naturalWidth, setNaturalWidth] = useState<number>(initialWidth);
  const [naturalHeight, setNaturalHeight] = useState<number>(initialHeight);

  const [width, setWidth] = useState<number>(initialWidth);
  const [height, setHeight] = useState<number>(initialHeight);
  const [lockRatio, setLockRatio] = useState<boolean>(false); // Start free
  const [aspectRatio, setAspectRatio] = useState<number>(initialWidth / initialHeight);
  const [activePreset, setActivePreset] = useState<string>('Free Size Crop');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Interactive crop coordinates relative to media (percentage: 0 to 100)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 5,
    y: 5,
    w: 90,
    h: 90,
  });

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const mediaWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isDraggingRef = useRef<boolean>(false);
  const dragHandleRef = useRef<string | null>(null);
  const dragStartPos = useRef<{ mouseX: number; mouseY: number; box: typeof cropBox }>({
    mouseX: 0,
    mouseY: 0,
    box: { x: 5, y: 5, w: 90, h: 90 },
  });

  const onDimensionsChangeRef = useRef(onDimensionsChange);
  useEffect(() => {
    onDimensionsChangeRef.current = onDimensionsChange;
  }, [onDimensionsChange]);

  // Read natural image or video resolution on upload
  useEffect(() => {
    if (!previewUrl) return;

    if (isVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const realW = video.videoWidth || 1920;
        const realH = video.videoHeight || 1080;
        setNaturalWidth(realW);
        setNaturalHeight(realH);
        setWidth(realW);
        setHeight(realH);
        setAspectRatio(realW / realH);
        setCropBox({ x: 5, y: 5, w: 90, h: 90 });

        const pixelCrop: CropArea = {
          x: Math.round(realW * 0.05),
          y: Math.round(realH * 0.05),
          width: Math.round(realW * 0.9),
          height: Math.round(realH * 0.9),
        };
        onDimensionsChangeRef.current(realW, realH, pixelCrop);
      };
      video.src = previewUrl;
      return;
    }

    const img = new Image();
    img.onload = () => {
      const realW = img.naturalWidth || 1200;
      const realH = img.naturalHeight || 800;
      setNaturalWidth(realW);
      setNaturalHeight(realH);
      setWidth(realW);
      setHeight(realH);
      setAspectRatio(realW / realH);
      setCropBox({ x: 5, y: 5, w: 90, h: 90 });

      const pixelCrop: CropArea = {
        x: Math.round(realW * 0.05),
        y: Math.round(realH * 0.05),
        width: Math.round(realW * 0.9),
        height: Math.round(realH * 0.9),
      };
      onDimensionsChangeRef.current(realW, realH, pixelCrop);
    };
    img.src = previewUrl;
  }, [previewUrl, isVideo]);

  const notifyChange = (newW: number, newH: number, currentBox = cropBox) => {
    const pixelCrop: CropArea = {
      x: Math.round((naturalWidth * currentBox.x) / 100),
      y: Math.round((naturalHeight * currentBox.y) / 100),
      width: Math.round((naturalWidth * currentBox.w) / 100),
      height: Math.round((naturalHeight * currentBox.h) / 100),
    };
    onDimensionsChangeRef.current(newW, newH, pixelCrop);
  };

  const handleWidthChange = (val: number) => {
    const newWidth = Math.max(10, val || 0);
    let newHeight = height;
    if (lockRatio && aspectRatio > 0) {
      newHeight = Math.round(newWidth / aspectRatio);
    }
    setWidth(newWidth);
    setHeight(newHeight);
    notifyChange(newWidth, newHeight);
  };

  const handleHeightChange = (val: number) => {
    const newHeight = Math.max(10, val || 0);
    let newWidth = width;
    if (lockRatio && aspectRatio > 0) {
      newWidth = Math.round(newHeight * aspectRatio);
    }
    setWidth(newWidth);
    setHeight(newHeight);
    notifyChange(newWidth, newHeight);
  };

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setActivePreset(preset.label);

    if (preset.isFree) {
      // Free size crop: unlock aspect ratio
      setLockRatio(false);
      setCropBox({ x: 5, y: 5, w: 90, h: 90 });
      setWidth(naturalWidth);
      setHeight(naturalHeight);
      notifyChange(naturalWidth, naturalHeight, { x: 5, y: 5, w: 90, h: 90 });
      return;
    }

    setLockRatio(true);
    setAspectRatio(preset.ratio);
    setWidth(preset.width);
    setHeight(preset.height);

    // Adjust crop box on canvas to match the selected ratio
    let boxW = 80;
    let boxH = 80;
    if (preset.ratio >= 1) {
      boxW = 80;
      boxH = Math.min(80, Math.round(80 / preset.ratio));
    } else {
      boxH = 80;
      boxW = Math.min(80, Math.round(80 * preset.ratio));
    }
    const newBox = {
      x: Math.round((100 - boxW) / 2),
      y: Math.round((100 - boxH) / 2),
      w: boxW,
      h: boxH,
    };
    setCropBox(newBox);
    notifyChange(preset.width, preset.height, newBox);
  };

  const toggleVideoPlay = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Interactive mouse/touch dragging on lines, corners, and pan box
  const startDrag = (handle: string, clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    dragHandleRef.current = handle;
    dragStartPos.current = {
      mouseX: clientX,
      mouseY: clientY,
      box: { ...cropBox },
    };

    const handlePointerMove = (moveX: number, moveY: number) => {
      if (!isDraggingRef.current) return;

      const activeContainer = mediaWrapperRef.current || previewContainerRef.current;
      if (!activeContainer) return;

      const rect = activeContainer.getBoundingClientRect();
      const deltaXPercent = ((moveX - dragStartPos.current.mouseX) / (rect.width || 1)) * 100;
      const deltaYPercent = ((moveY - dragStartPos.current.mouseY) / (rect.height || 1)) * 100;

      const start = dragStartPos.current.box;
      const handleType = dragHandleRef.current;

      let nextX = start.x;
      let nextY = start.y;
      let nextW = start.w;
      let nextH = start.h;

      if (handleType === 'move') {
        // Pan the whole crop box
        nextX = Math.max(0, Math.min(100 - start.w, start.x + deltaXPercent));
        nextY = Math.max(0, Math.min(100 - start.h, start.y + deltaYPercent));
      } else if (handleType === 'n') {
        // Adjust Top Line
        const maxDeltaY = start.h - 5;
        const clampedDeltaY = Math.min(maxDeltaY, Math.max(-start.y, deltaYPercent));
        nextY = start.y + clampedDeltaY;
        nextH = start.h - clampedDeltaY;
      } else if (handleType === 's') {
        // Adjust Bottom Line
        nextH = Math.max(5, Math.min(100 - start.y, start.h + deltaYPercent));
      } else if (handleType === 'w') {
        // Adjust Left Line
        const maxDeltaX = start.w - 5;
        const clampedDeltaX = Math.min(maxDeltaX, Math.max(-start.x, deltaXPercent));
        nextX = start.x + clampedDeltaX;
        nextW = start.w - clampedDeltaX;
      } else if (handleType === 'e') {
        // Adjust Right Line
        nextW = Math.max(5, Math.min(100 - start.x, start.w + deltaXPercent));
      } else if (handleType === 'nw') {
        // Top-left corner
        const maxDeltaX = start.w - 5;
        const maxDeltaY = start.h - 5;
        const clampedDeltaX = Math.min(maxDeltaX, Math.max(-start.x, deltaXPercent));
        const clampedDeltaY = Math.min(maxDeltaY, Math.max(-start.y, deltaYPercent));
        nextX = start.x + clampedDeltaX;
        nextY = start.y + clampedDeltaY;
        nextW = start.w - clampedDeltaX;
        nextH = start.h - clampedDeltaY;
      } else if (handleType === 'ne') {
        // Top-right corner
        const maxDeltaY = start.h - 5;
        const clampedDeltaY = Math.min(maxDeltaY, Math.max(-start.y, deltaYPercent));
        nextY = start.y + clampedDeltaY;
        nextH = start.h - clampedDeltaY;
        nextW = Math.max(5, Math.min(100 - start.x, start.w + deltaXPercent));
      } else if (handleType === 'sw') {
        // Bottom-left corner
        const maxDeltaX = start.w - 5;
        const clampedDeltaX = Math.min(maxDeltaX, Math.max(-start.x, deltaXPercent));
        nextX = start.x + clampedDeltaX;
        nextW = start.w - clampedDeltaX;
        nextH = Math.max(5, Math.min(100 - start.y, start.h + deltaYPercent));
      } else if (handleType === 'se') {
        // Bottom-right corner
        nextW = Math.max(5, Math.min(100 - start.x, start.w + deltaXPercent));
        nextH = Math.max(5, Math.min(100 - start.y, start.h + deltaYPercent));
      }

      // If aspect ratio is locked and not in Free Crop mode
      if (lockRatio && aspectRatio > 0) {
        if (handleType === 'e' || handleType === 'w') {
          nextH = Math.min(100 - nextY, nextW / aspectRatio);
        } else if (handleType === 'n' || handleType === 's') {
          nextW = Math.min(100 - nextX, nextH * aspectRatio);
        }
      }

      const updatedBox = {
        x: Math.max(0, Math.min(95, Math.round(nextX))),
        y: Math.max(0, Math.min(95, Math.round(nextY))),
        w: Math.max(5, Math.min(100 - nextX, Math.round(nextW))),
        h: Math.max(5, Math.min(100 - nextY, Math.round(nextH))),
      };

      setCropBox(updatedBox);

      // In Free Size mode, compute target pixels from the dragged crop box
      if (!lockRatio) {
        const computedW = Math.round((naturalWidth * updatedBox.w) / 100);
        const computedH = Math.round((naturalHeight * updatedBox.h) / 100);
        setWidth(computedW);
        setHeight(computedH);
        notifyChange(computedW, computedH, updatedBox);
      } else {
        notifyChange(width, height, updatedBox);
      }
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      handlePointerMove(moveEvent.clientX, moveEvent.clientY);
    };

    const onTouchMove = (touchEvent: TouchEvent) => {
      if (touchEvent.touches.length > 0) {
        handlePointerMove(touchEvent.touches[0].clientX, touchEvent.touches[0].clientY);
      }
    };

    const onEnd = () => {
      isDraggingRef.current = false;
      dragHandleRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  };

  const handleMouseDown = (handle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startDrag(handle, e.clientX, e.clientY);
  };

  const handleTouchStart = (handle: string, e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      e.stopPropagation();
      startDrag(handle, e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 my-6 text-left">
      {/* Title & Ratio Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
            <Crop className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Crop & Pixel Dimensions Studio
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500">
              {isVideo ? 'Re-frame video clip:' : 'Re-frame image:'} In <strong>Free Size Crop</strong>, drag boundary lines or corners freely.
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label={lockRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
          aria-pressed={lockRatio}
          onClick={() => {
            setLockRatio(!lockRatio);
            if (!lockRatio && height > 0) {
              setAspectRatio(width / height);
            }
          }}
          className={`flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
            lockRatio
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          }`}
        >
          {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          {lockRatio ? 'Ratio Locked' : 'Freeform Ratio'}
        </button>
      </div>

      {/* Preset & Free Size Buttons */}
      <div className="mb-6">
        <span className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2.5 flex items-center gap-1.5">
          <Ratio className="w-3.5 h-3.5 text-neutral-400" />
          Choose Crop Mode:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {PRESETS.map((preset) => {
            const isSelected = activePreset === preset.label;
            return (
              <button
                key={preset.label}
                type="button"
                aria-label={`Select crop mode: ${preset.label}`}
                aria-pressed={isSelected}
                onClick={() => applyPreset(preset)}
                className={`p-2.5 sm:p-3 rounded-xl text-left border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                }`}
              >
                <div className="text-xs sm:text-sm font-semibold flex items-center justify-between">
                  <span>{preset.label}</span>
                  {preset.isFree && <Maximize2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white dark:text-neutral-900' : 'text-neutral-500'}`} />}
                </div>
                <div className="text-xs opacity-75 mt-0.5">
                  {preset.isFree ? 'Drag any line freely' : `${preset.width} × ${preset.height} px`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Width and Height Manual Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="crop-width-input" className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Target Output Width (pixels)
          </label>
          <div className="relative">
            <input
              id="crop-width-input"
              type="number"
              aria-label="Target Output Width in pixels"
              min="10"
              max="7680"
              value={width || ''}
              onChange={(e) => handleWidthChange(parseInt(e.target.value, 10))}
              className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono text-sm sm:text-base focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
              px
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="crop-height-input" className="block text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
            Target Output Height (pixels)
          </label>
          <div className="relative">
            <input
              id="crop-height-input"
              type="number"
              aria-label="Target Output Height in pixels"
              min="10"
              max="4320"
              value={height || ''}
              onChange={(e) => handleHeightChange(parseInt(e.target.value, 10))}
              className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono text-sm sm:text-base focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition-colors"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
              px
            </span>
          </div>
        </div>
      </div>

      {/* CINEMA-SIZE PREVIEW SCREEN (Expanded Interactive Studio for Video & Photo) */}
      {previewUrl && (
        <div className="mt-6 pt-6 border-t border-neutral-200/80 dark:border-neutral-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Crop className="w-3.5 h-3.5 text-neutral-500" />
              Interactive Crop Studio — Drag lines or corners to re-frame:
            </span>
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
              <span>Source: {naturalWidth} × {naturalHeight} px</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Target: {width} × {height} px
              </span>
            </div>
          </div>

          {/* Big Studio Container */}
          <div
            ref={previewContainerRef}
            className="relative w-full min-h-[460px] md:min-h-[560px] max-h-[720px] bg-neutral-950 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-neutral-800 shadow-sm select-none"
          >
            {/* Media Wrapper with exact dimensions */}
            <div
              ref={mediaWrapperRef}
              className="relative inline-flex items-center justify-center max-h-[520px] max-w-full rounded-lg"
            >
              {isVideo ? (
                <video
                  ref={videoRef}
                  src={previewUrl}
                  loop
                  playsInline
                  muted
                  className="max-h-[520px] max-w-full rounded-lg block object-contain pointer-events-none select-none"
                  onLoadedMetadata={(e) => {
                    const v = e.currentTarget;
                    if (v.videoWidth && v.videoHeight) {
                      setNaturalWidth(v.videoWidth);
                      setNaturalHeight(v.videoHeight);
                      if (activePreset === 'Free Size Crop') {
                        setWidth(v.videoWidth);
                        setHeight(v.videoHeight);
                      }
                    }
                  }}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewUrl}
                  alt="Original Preview"
                  className="max-h-[520px] max-w-full rounded-lg block object-contain pointer-events-none select-none"
                />
              )}

              {/* Interactive Drag & Resize Crop Overlay */}
              <div
                style={{
                  left: `${cropBox.x}%`,
                  top: `${cropBox.y}%`,
                  width: `${cropBox.w}%`,
                  height: `${cropBox.h}%`,
                }}
                className="absolute border-2 border-white bg-white/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] ring-1 ring-black/40 cursor-move group select-none"
                onMouseDown={(e) => handleMouseDown('move', e)}
                onTouchStart={(e) => handleTouchStart('move', e)}
              >
                {/* Rule of Thirds Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  <div className="border-r border-b border-white/25" />
                  <div className="border-r border-b border-white/25" />
                  <div className="border-b border-white/25" />
                  <div className="border-r border-b border-white/25" />
                  <div className="border-r border-b border-white/25" />
                  <div className="border-b border-white/25" />
                  <div className="border-r border-b border-white/25" />
                  <div className="border-r border-b border-white/25" />
                  <div />
                </div>

                {/* Floating Real-Time Pixel Dimension Tag */}
                <div className="absolute top-2 left-2 pointer-events-none bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/20">
                  {Math.round((naturalWidth * cropBox.w) / 100)} × {Math.round((naturalHeight * cropBox.h) / 100)} px
                </div>

                {/* Center Pan Indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                    <Move className="w-3 h-3" />
                    Drag to Pan
                  </div>
                </div>

                {/* Boundary Lines (Top, Bottom, Left, Right) */}

                {/* 1. TOP LINE ADJUSTER */}
                <div
                  onMouseDown={(e) => handleMouseDown('n', e)}
                  onTouchStart={(e) => handleTouchStart('n', e)}
                  className="absolute -top-3 left-0 right-0 h-6 cursor-ns-resize z-20 flex items-center justify-center group/topline"
                  title="Drag to adjust top line"
                >
                  <div className="w-12 h-1 rounded-full bg-white border border-neutral-700 shadow-sm transition group-hover/topline:scale-110" />
                </div>

                {/* 2. BOTTOM LINE ADJUSTER */}
                <div
                  onMouseDown={(e) => handleMouseDown('s', e)}
                  onTouchStart={(e) => handleTouchStart('s', e)}
                  className="absolute -bottom-3 left-0 right-0 h-6 cursor-ns-resize z-20 flex items-center justify-center group/bottomline"
                  title="Drag to adjust bottom line"
                >
                  <div className="w-12 h-1 rounded-full bg-white border border-neutral-700 shadow-sm transition group-hover/bottomline:scale-110" />
                </div>

                {/* 3. LEFT LINE ADJUSTER */}
                <div
                  onMouseDown={(e) => handleMouseDown('w', e)}
                  onTouchStart={(e) => handleTouchStart('w', e)}
                  className="absolute top-0 bottom-0 -left-3 w-6 cursor-ew-resize z-20 flex items-center justify-center group/leftline"
                  title="Drag to adjust left line"
                >
                  <div className="h-12 w-1 rounded-full bg-white border border-neutral-700 shadow-sm transition group-hover/leftline:scale-110" />
                </div>

                {/* 4. RIGHT LINE ADJUSTER */}
                <div
                  onMouseDown={(e) => handleMouseDown('e', e)}
                  onTouchStart={(e) => handleTouchStart('e', e)}
                  className="absolute top-0 bottom-0 -right-3 w-6 cursor-ew-resize z-20 flex items-center justify-center group/rightline"
                  title="Drag to adjust right line"
                >
                  <div className="h-12 w-1 rounded-full bg-white border border-neutral-700 shadow-sm transition group-hover/rightline:scale-110" />
                </div>

                {/* 4 Corner Resize Handles */}
                <div
                  onMouseDown={(e) => handleMouseDown('nw', e)}
                  onTouchStart={(e) => handleTouchStart('nw', e)}
                  className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-neutral-900 rounded-full cursor-nwse-resize shadow-md hover:scale-110 transition z-30"
                  title="Drag top-left corner"
                />

                <div
                  onMouseDown={(e) => handleMouseDown('ne', e)}
                  onTouchStart={(e) => handleTouchStart('ne', e)}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-neutral-900 rounded-full cursor-nesw-resize shadow-md hover:scale-110 transition z-30"
                  title="Drag top-right corner"
                />

                <div
                  onMouseDown={(e) => handleMouseDown('sw', e)}
                  onTouchStart={(e) => handleTouchStart('sw', e)}
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-neutral-900 rounded-full cursor-nesw-resize shadow-md hover:scale-110 transition z-30"
                  title="Drag bottom-left corner"
                />

                <div
                  onMouseDown={(e) => handleMouseDown('se', e)}
                  onTouchStart={(e) => handleTouchStart('se', e)}
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-neutral-900 rounded-full cursor-nwse-resize shadow-md hover:scale-110 transition z-30"
                  title="Drag bottom-right corner"
                />
              </div>
            </div>

            {/* Corner Badge */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg font-mono border border-white/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>
                {activePreset} • {width} × {height} px
              </span>
            </div>

            {/* Video Player Controls (Play / Pause toggle button) */}
            {isVideo && (
              <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs shadow-sm">
                <button
                  type="button"
                  onClick={toggleVideoPlay}
                  aria-label={isPlaying ? 'Pause video preview' : 'Play video preview'}
                  className="flex items-center gap-1.5 font-semibold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause Video' : 'Play Video'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
