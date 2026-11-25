'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload,
  FileCheck,
  Download,
  RotateCcw,
  RotateCw,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Trash2,
  Lock,
  Unlock,
  Hash,
  ChevronDown,
  ChevronUp,
  File as FileIcon,
  Sliders,
  TrendingDown,
  Link as LinkIcon,
  QrCode as QrCodeIcon,
  Plus,
  ArrowUp,
  ArrowDown,
  Layers,
  Files,
  Stamp,
  Key,
  RefreshCw,
  Copy,
  Check,
  Percent,
  VolumeX,
  ClipboardCheck,
  ClipboardPaste,
  Type,
  FileText,
  ExternalLink,
  AlertCircle,
  X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { createValidPdfDocument } from '@/utils/pdfGenerator';
import { ToolConfig, STARTER_TOOLS } from '@/config/tools';
import AdBanner from './AdBanner';

const PixelEditorSection = dynamic(() => import('./PixelEditorSection'), {
  ssr: false,
});

const triggerConfetti = async (opts?: any) => {
  try {
    const mod = (await import('canvas-confetti')).default;
    mod(opts);
  } catch {
    // ignore
  }
};
import {
  compressImageClient,
  compressImageToTargetSizeClient,
  compressPdfClient,
  cropAndResizeImageClient,
  cropVideoClient,
  compressVideoClient,
  convertImageFormatClient,
  extractAudioClient,
  mergePdfClient,
  imagesToPdfClient,
  splitPdfClient,
  rotatePdfClient,
  watermarkPdfClient,
  muteVideoClient,
  getPdfPageCount,
  formatBytes,
  ProcessResult,
  CropArea,
  resizeImageClient,
  addPageNumbersToPdfClient,
  PageNumberOptions,
  VideoProgressInfo,
} from '@/utils/mediaProcessor';
import {
  pdfToExcelClient,
  pdfToJpgClient,
  heicToJpgClient,
  pdfToWordClient,
  wordToPdfClient,
  videoToGifClient,
  pdfToPptClient,
  resizePdfToA4Client,
  pdfToZipClient,
} from '@/utils/documentConverters';

interface ToolWorkspaceProps {
  tool: ToolConfig;
  relatedTools?: ToolConfig[];
}

export default function ToolWorkspace({ tool, relatedTools: propRelatedTools }: ToolWorkspaceProps) {
  const relatedTools = (propRelatedTools && propRelatedTools.length > 0)
    ? propRelatedTools
    : (tool.relatedToolSlugs || [])
        .map((slug) => STARTER_TOOLS.find((t) => t.slug === slug || t.id === slug))
        .filter((t): t is ToolConfig => Boolean(t));
  const isMultiFile = tool.id === 'merge-pdf' || tool.id === 'image-to-pdf';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Quality settings for image compressor
  const [compressionQuality, setCompressionQuality] = useState<number>(0.7);

  // Pixel dimensions & crop area for crop tools
  const [pixelDimensions, setPixelDimensions] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 800,
  });
  const [cropArea, setCropArea] = useState<CropArea | undefined>(undefined);

  // Real processed result
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDimensionsChange = useCallback((w: number, h: number, area?: CropArea) => {
    setPixelDimensions({ width: w, height: h });
    if (area) {
      setCropArea(area);
    }
  }, []);

  // Split PDF State
  const [pdfPageCount, setPdfPageCount] = useState<number>(1);
  const [selectedPages, setSelectedPages] = useState<number[]>([1]);
  const [rangeFrom, setRangeFrom] = useState<number>(1);
  const [rangeTo, setRangeTo] = useState<number>(1);

  // Automatically read total pages when PDF is uploaded for Split, Rotate, Watermark, or Numbering
  useEffect(() => {
    if (
      (tool.id !== 'split-pdf' && tool.id !== 'rotate-pdf' && tool.id !== 'watermark-pdf' && tool.id !== 'add-page-numbers-to-pdf') ||
      !selectedFile
    )
      return;

    getPdfPageCount(selectedFile).then((count) => {
      setPdfPageCount(count);
      setRangeFrom(1);
      setRangeTo(Math.min(count, 2));
      const initial: number[] = [];
      for (let i = 1; i <= Math.min(count, 2); i++) initial.push(i);
      setSelectedPages(initial);
    });
  }, [tool.id, selectedFile]);

  // Rotate PDF State
  const [rotationAngle, setRotationAngle] = useState<number>(90);

  // Watermark PDF State
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.3);
  const [watermarkColor, setWatermarkColor] = useState<'red' | 'gray' | 'blue'>('red');
  const [watermarkAngle, setWatermarkAngle] = useState<45 | 0>(45);

  // Image Resizer State
  const [resizeWidth, setResizeWidth] = useState<number>(1200);
  const [resizeHeight, setResizeHeight] = useState<number>(800);
  const [resizeOriginalWidth, setResizeOriginalWidth] = useState<number>(1200);
  const [resizeOriginalHeight, setResizeOriginalHeight] = useState<number>(800);
  const [resizeLockAspect, setResizeLockAspect] = useState<boolean>(true);
  const [resizeUnit, setResizeUnit] = useState<'px' | 'percent'>('px');
  const [resizeFormat, setResizeFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  // Add Page Numbers to PDF State
  const [pageNumberPosition, setPageNumberPosition] = useState<PageNumberOptions['position']>('bottom-right');
  const [pageNumberFormat, setPageNumberFormat] = useState<PageNumberOptions['format']>('page_x_of_y');
  const [pageNumberStartFrom, setPageNumberStartFrom] = useState<number>(1);
  const [pageNumberSkipFirst, setPageNumberSkipFirst] = useState<boolean>(false);
  const [pageNumberFontSize, setPageNumberFontSize] = useState<number>(10);

  // Video Compressor State
  const [videoCompressPercent, setVideoCompressPercent] = useState<20 | 30 | 50>(30);
  const [videoProgressInfo, setVideoProgressInfo] = useState<VideoProgressInfo | null>(null);

  // Password Generator State
  const [passwordLength, setPasswordLength] = useState<number>(16);
  const [passUpper, setPassUpper] = useState<boolean>(true);
  const [passLower, setPassLower] = useState<boolean>(true);
  const [passNumbers, setPassNumbers] = useState<boolean>(true);
  const [passSymbols, setPassSymbols] = useState<boolean>(true);
  const [passExcludeAmbiguous, setPassExcludeAmbiguous] = useState<boolean>(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [copiedPassword, setCopiedPassword] = useState<boolean>(false);

  const generatePassword = useCallback(() => {
    let chars = '';
    if (passUpper)
      chars += passExcludeAmbiguous
        ? 'ABCDEFGHJKLMNPQRSTUVWXYZ'
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (passLower)
      chars += passExcludeAmbiguous
        ? 'abcdefghijkmnopqrstuvwxyz'
        : 'abcdefghijklmnopqrstuvwxyz';
    if (passNumbers)
      chars += passExcludeAmbiguous ? '23456789' : '0123456789';
    if (passSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let result = '';
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint32Array(passwordLength);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < passwordLength; i++) {
        result += chars[array[i] % chars.length];
      }
    } else {
      for (let i = 0; i < passwordLength; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    setGeneratedPassword(result);
  }, [
    passwordLength,
    passUpper,
    passLower,
    passNumbers,
    passSymbols,
    passExcludeAmbiguous,
  ]);

  useEffect(() => {
    if (tool.id === 'password-generator') {
      generatePassword();
    }
  }, [tool.id, generatePassword]);

  const handleCopyPassword = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setCopiedPassword(true);
    try {
      triggerConfetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const handleDownloadPassword = () => {
    if (!generatedPassword) return;
    const content = `OmniTools Generated Password\nCreated: ${new Date().toLocaleString()}\nLength: ${passwordLength} characters\n\nPassword:\n${generatedPassword}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `secure_password_${passwordLength}chars.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Case Converter State
  const [caseText, setCaseText] = useState<string>(
    'The quick brown fox jumps over the lazy dog. Type or paste your own text here to convert into any case style!'
  );
  const [copiedCaseText, setCopiedCaseText] = useState<boolean>(false);
  const [activeCase, setActiveCase] = useState<string>('');

  const applyCaseConversion = (mode: string) => {
    setActiveCase(mode);
    if (!caseText) return;

    if (mode === 'upper') {
      setCaseText((prev) => prev.toUpperCase());
    } else if (mode === 'lower') {
      setCaseText((prev) => prev.toLowerCase());
    } else if (mode === 'title') {
      setCaseText((prev) => prev.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()));
    } else if (mode === 'sentence') {
      setCaseText((prev) =>
        prev.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
      );
    } else if (mode === 'camel') {
      const words = caseText.match(/[A-Za-z0-9]+/g) || [];
      if (words.length > 0) {
        const firstWord = words[0] ?? '';
        const camel =
          firstWord.toLowerCase() +
          words
            .slice(1)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join('');
        setCaseText(camel);
      }
    } else if (mode === 'pascal') {
      const words = caseText.match(/[A-Za-z0-9]+/g) || [];
      const pascal = words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
      setCaseText(pascal);
    } else if (mode === 'snake') {
      const words = caseText.match(/[A-Za-z0-9]+/g) || [];
      setCaseText(words.map((w) => w.toLowerCase()).join('_'));
    } else if (mode === 'kebab') {
      const words = caseText.match(/[A-Za-z0-9]+/g) || [];
      setCaseText(words.map((w) => w.toLowerCase()).join('-'));
    } else if (mode === 'inverse') {
      setCaseText((prev) =>
        prev
          .split('')
          .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
          .join('')
      );
    }
  };

  const handleCopyCaseText = () => {
    if (!caseText) return;
    navigator.clipboard.writeText(caseText);
    setCopiedCaseText(true);
    try {
      triggerConfetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    setTimeout(() => setCopiedCaseText(false), 2000);
  };

  const handleDownloadCaseText = () => {
    if (!caseText) return;
    const blob = new Blob([caseText], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `converted_text_${activeCase || 'cased'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePasteCaseText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setCaseText(text);
    } catch {
      // ignore
    }
  };

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages((prev) => {
      if (prev.includes(pageNum)) {
        return prev.filter((p) => p !== pageNum);
      } else {
        return [...prev, pageNum].sort((a, b) => a - b);
      }
    });
  };

  const applyRangeSelection = (from: number, to: number) => {
    const validFrom = Math.max(1, Math.min(pdfPageCount, from));
    const validTo = Math.max(validFrom, Math.min(pdfPageCount, to));
    setRangeFrom(validFrom);
    setRangeTo(validTo);
    const range: number[] = [];
    for (let i = validFrom; i <= validTo; i++) {
      range.push(i);
    }
    setSelectedPages(range);
  };

  const selectOddPages = () => {
    const pages: number[] = [];
    for (let i = 1; i <= pdfPageCount; i += 2) pages.push(i);
    setSelectedPages(pages);
  };

  const selectEvenPages = () => {
    const pages: number[] = [];
    for (let i = 2; i <= pdfPageCount; i += 2) pages.push(i);
    setSelectedPages(pages);
  };

  const selectAllPages = () => {
    const pages: number[] = [];
    for (let i = 1; i <= pdfPageCount; i++) pages.push(i);
    setSelectedPages(pages);
  };

  // Link QR Generator State
  const [qrLink, setQrLink] = useState<string>('');
  const [qrResolution, setQrResolution] = useState<number>(600);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (tool.id !== 'qr-code-generator' || !qrCanvasRef.current) return;
    import('qrcode')
      .then(({ default: QRCode }) => {
        if (!qrCanvasRef.current) return;
        QRCode.toCanvas(qrCanvasRef.current, qrLink.trim() || 'https://www.ilovetools.org', {
          width: 260,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        });
      })
      .catch((e) => {
        console.error('QR render error:', e);
      });
  }, [tool.id, qrLink]);

  const handleDownloadQr = async () => {
    const { default: QRCode } = await import('qrcode');
    const tempCanvas = document.createElement('canvas');
    QRCode.toCanvas(
      tempCanvas,
      qrLink.trim() || 'https://www.ilovetools.org',
      {
        width: qrResolution,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err) => {
        if (!err) {
          const a = document.createElement('a');
          a.href = tempCanvas.toDataURL('image/png');
          a.download = `qrcode_${qrResolution}px.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          try {
            triggerConfetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
        }
      }
    );
  };

  // Google Docs to PDF State & Handlers
  const [googleDocLink, setGoogleDocLink] = useState<string>('');
  const [googleDocFormat, setGoogleDocFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const [googleDocError, setGoogleDocError] = useState<string | null>(null);
  const [isDownloadingGoogleDoc, setIsDownloadingGoogleDoc] = useState<boolean>(false);

  const extractGoogleDocInfo = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return null;

    // Check for specific sheet tab gid (e.g. #gid=0 or ?gid=123)
    const gidMatch = trimmed.match(/[#?&]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : null;

    const docMatch = trimmed.match(/\/document(?:\/u\/\d+)?\/d\/([a-zA-Z0-9_-]+)/);
    if (docMatch) {
      return { type: 'document', id: docMatch[1], label: 'Google Document', gid };
    }

    const sheetMatch = trimmed.match(/\/spreadsheets(?:\/u\/\d+)?\/d\/([a-zA-Z0-9_-]+)/);
    if (sheetMatch) {
      return { type: 'spreadsheets', id: sheetMatch[1], label: 'Google Spreadsheet', gid };
    }

    const presMatch = trimmed.match(/\/presentation(?:\/u\/\d+)?\/d\/([a-zA-Z0-9_-]+)/);
    if (presMatch) {
      return { type: 'presentation', id: presMatch[1], label: 'Google Presentation', gid };
    }

    return null;
  };

  const handleDownloadGoogleDoc = async (formatOverride?: 'pdf' | 'docx' | 'txt') => {
    const targetFormat = formatOverride || googleDocFormat;
    const docInfo = extractGoogleDocInfo(googleDocLink);
    if (!docInfo) {
      setGoogleDocError('Please enter a valid Google Docs sharing link (e.g. docs.google.com/document/d/.../edit)');
      return;
    }

    setGoogleDocError(null);
    setIsDownloadingGoogleDoc(true);

    try {
      // 1. Direct file download through our export API
      const apiEndpoint = `/api/export-doc?type=${docInfo.type}&id=${docInfo.id}${docInfo.gid ? `&gid=${docInfo.gid}` : ''}&format=${targetFormat}`;
      const res = await fetch(apiEndpoint);

      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `google_${docInfo.type}_export.${targetFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

        try {
          triggerConfetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
        setIsDownloadingGoogleDoc(false);
        return;
      }

      // If server returned a friendly error (e.g. private document)
      const errorData = await res.json().catch(() => ({}));
      if (errorData.error) {
        setGoogleDocError(errorData.error);
        setIsDownloadingGoogleDoc(false);
        return;
      }
    } catch {
      // If network fails, proceed to fallback
    }

    // 2. Direct fallback trigger
    let fallbackExportUrl = `https://docs.google.com/${docInfo.type}/d/${docInfo.id}/export?format=${targetFormat}`;
    if (docInfo.type === 'spreadsheets' && targetFormat === 'pdf') {
      fallbackExportUrl = `https://docs.google.com/spreadsheets/d/${docInfo.id}/export?format=pdf&size=a4&portrait=true&fitw=true&gridlines=true${docInfo.gid ? `&gid=${docInfo.gid}` : ''}`;
    }

    const a = document.createElement('a');
    a.href = fallbackExportUrl;
    a.download = `google_${docInfo.type}_export.${targetFormat}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setIsDownloadingGoogleDoc(false);
  };

  const autoMuteVideo = async (videoFile: File) => {
    setStatus('processing');
    setProgress(20);
    setErrorMessage(null);

    try {
      const result = await muteVideoClient(videoFile, (pct) => {
        setProgress(Math.max(20, pct));
      });
      setProcessResult(result);
      setProgress(100);
      setStatus('completed');
      try {
        triggerConfetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      console.error('Mute video error:', err);
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to mute video. Please try a different clip.'
      );
    }
  };

  const handleFileChange = (file: File) => {
    // Revoke previous URLs before creating fresh ones
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = null;
    }

    setSelectedFile(file);
    setSelectedFiles([file]);
    setProcessResult(null);
    setErrorMessage(null);
    setVideoProgressInfo(null);

    // Create object URL for preview
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    if (tool.id === 'mute-video') {
      autoMuteVideo(file);
    } else {
      setStatus('idle');
      setProgress(0);
    }

    if (tool.id === 'resize-image' && file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        setResizeOriginalWidth(img.width);
        setResizeOriginalHeight(img.height);
        setResizeWidth(img.width);
        setResizeHeight(img.height);
      };
      img.src = URL.createObjectURL(file);
    }

    if (tool.id === 'add-page-numbers-to-pdf') {
      getPdfPageCount(file).then((count) => {
        setPdfPageCount(count);
      });
    }
  };

  const addFiles = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    const valid = newFiles; // No artificial file size limits: 100% in-browser processing

    if (isMultiFile) {
      setSelectedFiles((prev) => {
        const combined = [...prev, ...valid];
        setSelectedFile(combined[0]);
        return combined;
      });
      setStatus('idle');
      setProgress(0);
      setProcessResult(null);
      setErrorMessage(null);
    } else {
      handleFileChange(valid[0]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0) {
        setSelectedFile(next[0]);
      } else {
        setSelectedFile(null);
      }
      return next;
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSelectedFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    setSelectedFiles((prev) => {
      if (index >= prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const previewUrlRef = useRef<string | null>(null);
  const downloadUrlRef = useRef<string | null>(null);

  useEffect(() => {
    previewUrlRef.current = previewUrl;
  }, [previewUrl]);

  useEffect(() => {
    downloadUrlRef.current = processResult?.downloadUrl || null;
  }, [processResult]);

  // Clean up object URLs ONLY on component unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      if (downloadUrlRef.current) {
        URL.revokeObjectURL(downloadUrlRef.current);
      }
    };
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (isMultiFile) {
          addFiles(Array.from(e.dataTransfer.files));
        } else {
          handleFileChange(e.dataTransfer.files[0]);
        }
      }
    },
    [isMultiFile]
  );

  const handleAction = async () => {
    const activeFile = selectedFile || (selectedFiles.length > 0 ? selectedFiles[0] : null);
    if (!activeFile && selectedFiles.length === 0) return;

    setStatus('processing');
    setProgress(tool.id === 'compress-video' ? 2 : 20);
    setErrorMessage(null);

    try {
      if (tool.id === 'merge-pdf') {
        if (selectedFiles.length < 2) {
          setStatus('error');
          setErrorMessage('Please select at least 2 PDF files to merge together.');
          return;
        }
        setProgress(25);
        const result = await mergePdfClient(selectedFiles, (pct) => {
          setProgress(Math.max(25, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'image-to-pdf') {
        const filesToProcess = selectedFiles.length > 0 ? selectedFiles : (activeFile ? [activeFile] : []);
        if (filesToProcess.length === 0) {
          setStatus('error');
          setErrorMessage('Please select at least 1 image to convert to PDF.');
          return;
        }
        setProgress(25);
        const result = await imagesToPdfClient(filesToProcess, (pct) => {
          setProgress(Math.max(25, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (!activeFile) {
        setStatus('error');
        setErrorMessage('Please select a file to process.');
        return;
      } else if (tool.id === 'split-pdf') {
        if (selectedPages.length === 0) {
          setStatus('error');
          setErrorMessage('Please select at least 1 page to extract.');
          return;
        }
        setProgress(30);
        const indices = selectedPages.map((p) => p - 1);
        const result = await splitPdfClient(activeFile, indices, (pct) => {
          setProgress(Math.max(30, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'compress-image') {
        setProgress(50);
        const result = await compressImageClient(activeFile, compressionQuality);
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'compress-image-to-50kb') {
        setProgress(35);
        const result = await compressImageToTargetSizeClient(activeFile, 50 * 1024, (pct) => {
          setProgress(Math.max(35, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'compress-image-to-100kb') {
        setProgress(35);
        const result = await compressImageToTargetSizeClient(activeFile, 100 * 1024, (pct) => {
          setProgress(Math.max(35, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'compress-pdf') {
        setProgress(45);
        const result = await compressPdfClient(activeFile, compressionQuality);
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'crop-photo') {
        setProgress(50);
        const result = await cropAndResizeImageClient(
          activeFile,
          pixelDimensions.width,
          pixelDimensions.height,
          cropArea,
          'image/png'
        );
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'png-to-jpg') {
        setProgress(50);
        const result = await convertImageFormatClient(activeFile, 'image/jpeg');
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'jpg-to-png') {
        setProgress(50);
        const result = await convertImageFormatClient(activeFile, 'image/png');
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'video-to-mp3') {
        setProgress(50);
        const result = await extractAudioClient(activeFile);
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'compress-video') {
        setProgress(2);
        setVideoProgressInfo({ percent: 2, stage: 'Initializing hardware encoder...' });
        const result = await compressVideoClient(
          activeFile,
          {
            percent: videoCompressPercent,
          },
          (pct, info) => {
            setProgress(pct);
            if (info) {
              setVideoProgressInfo(info);
            }
          }
        );
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'crop-video') {
        setProgress(25);
        const result = await cropVideoClient(
          activeFile,
          pixelDimensions.width,
          pixelDimensions.height,
          cropArea,
          (pct) => {
            setProgress(Math.max(25, pct));
          }
        );
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'rotate-pdf') {
        setProgress(30);
        const result = await rotatePdfClient(activeFile, rotationAngle, (pct) => {
          setProgress(Math.max(30, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'watermark-pdf') {
        setProgress(30);
        const result = await watermarkPdfClient(
          activeFile,
          watermarkText || 'CONFIDENTIAL',
          {
            opacity: watermarkOpacity,
            color: watermarkColor,
            angle: watermarkAngle,
          },
          (pct) => {
            setProgress(Math.max(30, pct));
          }
        );
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'mute-video') {
        setProgress(30);
        const result = await muteVideoClient(activeFile, (pct) => {
          setProgress(Math.max(30, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'resize-image') {
        setProgress(30);
        const result = await resizeImageClient(
          activeFile,
          resizeWidth,
          resizeHeight,
          resizeFormat,
          0.92,
          (pct) => setProgress(Math.max(30, pct))
        );
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'add-page-numbers-to-pdf') {
        setProgress(25);
        const result = await addPageNumbersToPdfClient(
          activeFile,
          {
            position: pageNumberPosition,
            format: pageNumberFormat,
            startFrom: pageNumberStartFrom,
            skipFirstPage: pageNumberSkipFirst,
            fontSize: pageNumberFontSize,
          },
          (pct) => setProgress(Math.max(25, pct))
        );
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'pdf-to-excel') {
        setProgress(20);
        const result = await pdfToExcelClient(activeFile, (pct) => {
          setProgress(Math.max(20, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'pdf-to-jpg') {
        setProgress(20);
        const result = await pdfToJpgClient(activeFile, (pct) => {
          setProgress(Math.max(20, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'heic-to-jpg') {
        setProgress(20);
        const result = await heicToJpgClient(activeFile, (pct) => {
          setProgress(Math.max(20, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'pdf-to-word') {
        setProgress(20);
        const result = await pdfToWordClient(activeFile, (pct) => {
          setProgress(Math.max(20, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'word-to-pdf') {
        setProgress(20);
        const result = await wordToPdfClient(activeFile, (pct) => {
          setProgress(Math.max(20, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'video-to-gif') {
        setProgress(20);
        const result = await videoToGifClient(activeFile, (pct) => {
          setProgress(Math.max(20, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'pdf-to-powerpoint') {
        setProgress(20);
        const result = await pdfToPptClient(activeFile, (pct) => {
          setProgress(Math.max(20, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'resize-pdf-to-a4') {
        setProgress(20);
        const result = await resizePdfToA4Client(activeFile, (pct) => {
          setProgress(Math.max(20, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else if (tool.id === 'pdf-to-zip') {
        setProgress(20);
        const result = await pdfToZipClient(activeFile, (pct) => {
          setProgress(Math.max(20, pct));
        });
        setProcessResult(result);
        setProgress(100);
      } else {
        // For other documents (PDF to Excel/PPT/Word, Word to PDF, Merge, etc.)
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return 90;
            }
            return prev + 25;
          });
        }, 180);

        setTimeout(async () => {
          clearInterval(interval);
          let targetBlob: Blob;

          if (tool.id === 'word-to-pdf') {
            targetBlob = await createValidPdfDocument(
              activeFile.name,
              'Converted to universal PDF format',
              activeFile
            );
          } else {
            targetBlob = new Blob([activeFile], { type: 'application/octet-stream' });
          }

          setProcessResult({
            blob: targetBlob,
            downloadUrl: URL.createObjectURL(targetBlob),
            originalSize: activeFile.size,
            compressedSize: targetBlob.size,
            reductionPercent: Math.max(
              0,
              Math.round(((activeFile.size - targetBlob.size) / activeFile.size) * 100)
            ),
            outputExtension: tool.outputExtension,
          });
          setProgress(100);
          setStatus('completed');
          try {
            triggerConfetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
        }, 700);
        return;
      }

      setStatus('completed');
      try {
        triggerConfetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      console.error('Processing error:', err);
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Processing failed. Please try a different file.'
      );
    }
  };

  const handleReset = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = null;
    }
    setSelectedFile(null);
    setSelectedFiles([]);
    setPreviewUrl(null);
    setProcessResult(null);
    setStatus('idle');
    setProgress(0);
    setErrorMessage(null);
    setVideoProgressInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (!processResult) return;
    let baseName = 'processed_file';
    if (tool.id === 'split-pdf' && selectedFile) {
      const orig =
        selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'document';
      const pagesLabel =
        selectedPages.length === 1
          ? `page_${selectedPages[0]}`
          : `pages_${selectedPages.join('_')}`;
      baseName = `${orig}_split_${pagesLabel}`;
    } else if (tool.id === 'rotate-pdf' && selectedFile) {
      const orig =
        selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'document';
      baseName = `${orig}_rotated_${rotationAngle}deg`;
    } else if (tool.id === 'watermark-pdf' && selectedFile) {
      const orig =
        selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'document';
      baseName = `${orig}_watermarked`;
    } else if (tool.id === 'resize-image' && selectedFile) {
      const orig =
        selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'image';
      baseName = `${orig}_resized_${resizeWidth}x${resizeHeight}`;
    } else if (tool.id === 'add-page-numbers-to-pdf' && selectedFile) {
      const orig =
        selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'document';
      baseName = `${orig}_numbered`;
    } else if (tool.id === 'mute-video' && selectedFile) {
      const orig =
        selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'video';
      baseName = `${orig}_no_audio`;
    } else if (tool.id === 'compress-video' && selectedFile) {
      const orig =
        selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'video';
      baseName = `${orig}_compressed`;
    } else if (tool.id === 'merge-pdf' && selectedFiles.length > 0) {
      const first = selectedFiles[0].name;
      baseName = (first.substring(0, first.lastIndexOf('.')) || 'documents') + '_merged';
    } else if (selectedFile) {
      baseName =
        selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'processed_file';
    }

    // Strict priority: Converters and PDF tools always download their target tool.outputExtension
    const ext =
      tool.id === 'resize-image'
        ? (resizeFormat === 'image/jpeg' ? 'jpg' : resizeFormat === 'image/png' ? 'png' : 'webp')
        : tool.category === 'convert' || tool.category === 'pdf'
        ? tool.outputExtension
        : (processResult.outputExtension || tool.outputExtension);

    const finalName = `${baseName}.${ext}`;

    const element = document.createElement('a');
    element.href = processResult.downloadUrl;
    element.download = finalName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      {/* Top Non-Intrusive Leaderboard Ad */}
      <AdBanner placement="top-leaderboard" />

      {/* Main Hero & Tool Area */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex justify-center items-start gap-8">
        {/* Left Desktop Sidebar Ad */}
        <AdBanner placement="sidebar-left" />

        {/* Center Main Tool Workspace */}
        <div className="w-full max-w-3xl flex-1 flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight mb-2">
              {tool.title}
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto leading-relaxed">
              {tool.shortDesc}
            </p>
          </div>

          {/* Dedicated Google Docs to PDF Converter OR Link QR Code Generator OR Standard File Upload Section */}
          {tool.id === 'google-docs-to-pdf' ? (
            <div className="w-full rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Convert Google Doc to PDF via Link
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
                Paste any shared Google Docs, Sheets, or Slides URL to instantly export it as a clean PDF without opening heavy editors.
              </p>

              {/* URL Input Box */}
              <div className="w-full max-w-xl relative mb-3">
                <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="google-doc-link-input"
                  type="url"
                  aria-label="Google Docs, Sheets, or Slides link"
                  value={googleDocLink}
                  onChange={(e) => {
                    setGoogleDocLink(e.target.value);
                    if (googleDocError) setGoogleDocError(null);
                  }}
                  placeholder="https://docs.google.com/document/d/.../edit"
                  className={`w-full h-11 pl-10 pr-24 rounded-xl border bg-neutral-50 dark:bg-neutral-950 text-sm font-medium focus:outline-none transition-colors ${
                    googleDocError
                      ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                      : 'border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-neutral-100'
                  }`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {googleDocLink ? (
                    <button
                      type="button"
                      aria-label="Clear Google Doc link"
                      onClick={() => {
                        setGoogleDocLink('');
                        setGoogleDocError(null);
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                      title="Clear"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    aria-label="Paste Google Doc link from clipboard"
                    onClick={async () => {
                      try {
                        const clipText = await navigator.clipboard.readText();
                        if (clipText) {
                          setGoogleDocLink(clipText);
                          setGoogleDocError(null);
                        }
                      } catch {
                        // ignore clipboard read permission error
                      }
                    }}
                    className="px-2 py-1 rounded-md text-xs font-medium bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                    title="Paste from clipboard"
                  >
                    Paste
                  </button>
                </div>
              </div>

              {/* Error Warning */}
              {googleDocError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-500 mb-3 text-left">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{googleDocError}</span>
                </div>
              )}

              {/* Quick sample link */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
                <span className="text-xs text-neutral-400">Try a sample doc:</span>
                <button
                  type="button"
                  onClick={() => {
                    setGoogleDocLink('https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit');
                    setGoogleDocError(null);
                  }}
                  aria-label="Try with sample Google Doc link"
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  Sample Google Doc (Public)
                </button>
              </div>

              {/* Detected Document Banner */}
              {(() => {
                const docInfo = extractGoogleDocInfo(googleDocLink);
                if (!docInfo) return null;
                return (
                  <div className="w-full max-w-xl mb-6 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                          {docInfo.label} Detected
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-white dark:bg-neutral-900 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 shrink-0">
                      Ready to Export
                    </span>
                  </div>
                );
              })()}

              {/* Export Format Selector */}
              <div className="w-full max-w-xl mb-6 text-left">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-2">
                  Select Export Format:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pdf', label: 'PDF Document (.pdf)', desc: 'Print & Share Ready' },
                    { id: 'docx', label: 'Word Document (.docx)', desc: 'Editable in Word' },
                    { id: 'txt', label: 'Plain Text (.txt)', desc: 'Raw Text Only' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setGoogleDocFormat(fmt.id as 'pdf' | 'docx' | 'txt')}
                      aria-label={`Export as ${fmt.label}`}
                      aria-pressed={googleDocFormat === fmt.id}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        googleDocFormat === fmt.id
                          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{fmt.label}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          googleDocFormat === fmt.id
                            ? 'text-neutral-300 dark:text-neutral-600'
                            : 'text-neutral-400'
                        }`}
                      >
                        {fmt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Big Action Download Button */}
              <button
                type="button"
                onClick={() => handleDownloadGoogleDoc()}
                disabled={!extractGoogleDocInfo(googleDocLink) || isDownloadingGoogleDoc}
                aria-label={`Download converted ${googleDocFormat.toUpperCase()} file`}
                className={`w-full max-w-xl h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                  extractGoogleDocInfo(googleDocLink) && !isDownloadingGoogleDoc
                    ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer hover:shadow-rose-500/20 hover:shadow-lg'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                }`}
              >
                {isDownloadingGoogleDoc ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Converting &amp; Downloading {googleDocFormat.toUpperCase()}...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download {googleDocFormat.toUpperCase()} Document
                  </>
                )}
              </button>

              {/* Helpful Sharing Advice Callout */}
              <div className="w-full max-w-xl mt-6 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/60 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>How to export any Google Doc:</span>
                </div>
                <ol className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>In Google Docs, click the blue <strong className="text-neutral-700 dark:text-neutral-300">Share</strong> button in the top right.</li>
                  <li>Under <em>General access</em>, set to <strong className="text-neutral-700 dark:text-neutral-300">"Anyone with the link"</strong>.</li>
                  <li>Click <strong className="text-neutral-700 dark:text-neutral-300">Copy link</strong>, paste it above, and download your clean PDF!</li>
                </ol>
              </div>
            </div>
          ) : tool.id === 'qr-code-generator' ? (
            <div className="w-full rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-4">
                <QrCodeIcon className="w-6 h-6" />
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Enter Your Website Link or URL
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
                Paste any link below to generate a high-resolution, permanent scannable QR code.
              </p>

              {/* URL Input */}
              <div className="w-full max-w-xl relative mb-4">
                <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="qr-link-input"
                  type="text"
                  aria-label="URL or text for QR code"
                  value={qrLink}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setQrLink(e.target.value)}
                  placeholder="Paste your link or type text here..."
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-sm font-medium focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 transition-colors shadow-2xs"
                />
                {qrLink && (
                  <button
                    type="button"
                    onClick={() => setQrLink('')}
                    aria-label="Clear link"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick test links */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
                <span className="text-xs text-neutral-400">Quick suggestions:</span>
                {[
                  'https://google.com',
                  'https://instagram.com/yourhandle',
                  'https://linkedin.com/in/yourprofile',
                ].map((testUrl) => (
                  <button
                    key={testUrl}
                    type="button"
                    aria-label={`Use preset URL ${testUrl}`}
                    onClick={() => setQrLink(testUrl)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    {testUrl.replace('https://', '')}
                  </button>
                ))}
              </div>

              {/* Resolution Options */}
              <div className="w-full max-w-md mb-6">
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 block mb-2">
                  Export Resolution (PNG):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '300px', val: 300, desc: 'Web / Chat' },
                    { label: '600px', val: 600, desc: 'Recommended' },
                    { label: '1200px', val: 1200, desc: 'Print / Flyer' },
                  ].map((res) => (
                    <button
                      key={res.val}
                      type="button"
                      aria-label={`Set resolution to ${res.label} (${res.desc})`}
                      aria-pressed={qrResolution === res.val}
                      onClick={() => setQrResolution(res.val)}
                      className={`py-2 px-2 rounded-xl text-center border text-xs transition-colors cursor-pointer ${
                        qrResolution === res.val
                          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 font-semibold'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      <div>{res.label}</div>
                      <div className="text-[10px] opacity-75 font-normal">{res.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Rendered QR Code Preview */}
              <div className="p-4 bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 mb-6 flex flex-col items-center">
                <canvas ref={qrCanvasRef} className="rounded-xl" />
                <span className="text-[11px] font-mono text-neutral-400 mt-2 truncate max-w-xs">
                  {qrLink.trim() || 'https://www.ilovetools.org'}
                </span>
              </div>

              {/* Big Action Download Button */}
              <button
                type="button"
                onClick={handleDownloadQr}
                aria-label="Download QR Code PNG"
                className="h-11 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download QR Code (PNG)
              </button>
            </div>
          ) : tool.id === 'password-generator' ? (
            <div className="w-full rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-4">
                <Key className="w-6 h-6" />
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Generate Strong &amp; Secure Passwords
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
                Cryptographically generated in your browser with high entropy. Zero server storage.
              </p>

              {/* Password Display Box */}
              <div className="w-full max-w-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
                <span className="font-mono text-base md:text-xl font-bold text-neutral-900 dark:text-white tracking-wider break-all text-left select-all">
                  {generatedPassword || 'Generating...'}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={generatePassword}
                    title="Regenerate new password"
                    aria-label="Regenerate new password"
                    className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    title="Copy to clipboard"
                    aria-label="Copy password to clipboard"
                    className="h-8 px-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedPassword ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Password Strength Meter */}
              {(() => {
                let pool = 0;
                if (passUpper) pool += 26;
                if (passLower) pool += 26;
                if (passNumbers) pool += 10;
                if (passSymbols) pool += 30;
                const entropy = Math.round(passwordLength * Math.log2(Math.max(2, pool)));
                let strengthLabel = 'Weak';
                let strengthColor = 'bg-red-500';
                let strengthPercent = 25;
                if (entropy >= 85) {
                  strengthLabel = 'Cryptographically Unbreakable';
                  strengthColor = 'bg-neutral-900 dark:bg-white';
                  strengthPercent = 100;
                } else if (entropy >= 60) {
                  strengthLabel = 'Very Strong';
                  strengthColor = 'bg-emerald-500';
                  strengthPercent = 75;
                } else if (entropy >= 45) {
                  strengthLabel = 'Moderate';
                  strengthColor = 'bg-amber-500';
                  strengthPercent = 50;
                }
                return (
                  <div className="w-full max-w-xl mb-6 text-left">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-neutral-500 font-medium">Security Strength:</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {strengthLabel} ({entropy} bits entropy)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthColor} rounded-full transition-all duration-300`}
                        style={{ width: `${strengthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Length Slider Controls */}
              <div className="w-full max-w-xl bg-neutral-50 dark:bg-neutral-900 p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6 text-left">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="password-length-slider" className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                    Password Length
                  </label>
                  <span className="px-2.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-mono font-medium text-xs">
                    {passwordLength} characters
                  </span>
                </div>
                <input
                  id="password-length-slider"
                  type="range"
                  min={8}
                  max={64}
                  value={passwordLength}
                  aria-label="Password length slider"
                  aria-valuemin={8}
                  aria-valuemax={64}
                  aria-valuenow={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                  className="w-full accent-neutral-900 dark:accent-white cursor-pointer mb-3"
                />
                <div className="flex flex-wrap gap-1.5">
                  {[12, 16, 20, 24, 32].map((len) => (
                    <button
                      key={len}
                      type="button"
                      aria-label={`Set length to ${len} characters`}
                      aria-pressed={passwordLength === len}
                      onClick={() => setPasswordLength(len)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                        passwordLength === len
                          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      {len} chars {len === 16 ? '(Optimal)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Character Rules Toggles */}
              <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 text-left">
                {[
                  { label: 'Uppercase (A-Z)', val: passUpper, set: setPassUpper },
                  { label: 'Lowercase (a-z)', val: passLower, set: setPassLower },
                  { label: 'Numbers (0-9)', val: passNumbers, set: setPassNumbers },
                  { label: 'Symbols (!@#$)', val: passSymbols, set: setPassSymbols },
                  { label: 'No Ambiguous', val: passExcludeAmbiguous, set: setPassExcludeAmbiguous },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Toggle ${item.label}`}
                    aria-pressed={item.val}
                    onClick={() => item.set(!item.val)}
                    className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      item.val
                        ? 'border-neutral-900 bg-neutral-100/60 dark:border-white dark:bg-neutral-800 text-neutral-900 dark:text-white'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                        item.val ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-white dark:border-white dark:text-neutral-900' : 'border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      {item.val && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  aria-label="Copy password to clipboard"
                  className="h-11 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Password
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPassword}
                  aria-label="Download password as text file"
                  className="h-11 px-5 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 border border-neutral-200 dark:border-neutral-700"
                >
                  <Download className="w-4 h-4" />
                  Download .txt File
                </button>
              </div>
            </div>
          ) : tool.id === 'case-converter' ? (
            <div className="w-full rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-4">
                <Type className="w-6 h-6" />
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Convert Text Case Instantly
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
                Paste or type any content below and click a case style to transform your text instantly.
              </p>

              {/* Text Area Card with Toolbar */}
              <div className="w-full max-w-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-4 text-left">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                    Text Input Studio
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePasteCaseText}
                      aria-label="Paste text from clipboard"
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      Paste
                    </button>
                    <button
                      type="button"
                      onClick={() => setCaseText('')}
                      aria-label="Clear text input"
                      className="px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <textarea
                  id="case-converter-input"
                  aria-label="Text content for case conversion"
                  rows={8}
                  value={caseText}
                  onChange={(e) => setCaseText(e.target.value)}
                  placeholder="Paste or type text here..."
                  className="w-full bg-transparent border-0 resize-y focus:outline-none text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 font-medium leading-relaxed"
                />

                {/* Real-Time Live Statistics Strip */}
                <div className="pt-2 mt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500 font-mono">
                  <span>
                    Words: <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">{caseText.trim() ? caseText.trim().split(/\s+/).length : 0}</strong>
                  </span>
                  <span>
                    Characters: <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">{caseText.length}</strong>
                  </span>
                  <span>
                    No Spaces: <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">{caseText.replace(/\s+/g, '').length}</strong>
                  </span>
                  <span>
                    Sentences: <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">{caseText.trim() ? (caseText.match(/[.!?]+(?:\s|$)/g) || []).length || 1 : 0}</strong>
                  </span>
                  <span>
                    Lines: <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">{caseText ? caseText.split(/\r\n|\r|\n/).length : 0}</strong>
                  </span>
                </div>
              </div>

              {/* Case Conversion Preset Buttons Grid */}
              <div className="w-full max-w-2xl mb-6">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-2 text-left">
                  Target Casing Style:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'upper', label: 'UPPERCASE', example: 'ALL CAPITAL LETTERS' },
                    { id: 'lower', label: 'lowercase', example: 'all small letters' },
                    { id: 'title', label: 'Title Case', example: 'Capitalize Each Word' },
                    { id: 'sentence', label: 'Sentence case', example: 'First letter capitalized' },
                    { id: 'camel', label: 'camelCase', example: 'firstWordLowerThenCaps' },
                    { id: 'pascal', label: 'PascalCase', example: 'AllWordsCapitalized' },
                    { id: 'snake', label: 'snake_case', example: 'words_separated_underscores' },
                    { id: 'kebab', label: 'kebab-case', example: 'words-separated-hyphens' },
                    { id: 'inverse', label: 'InVeRsE cAsE', example: 'tOGGLE eACH lETTER' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      aria-label={`Convert text to ${btn.label}`}
                      aria-pressed={activeCase === btn.id}
                      onClick={() => applyCaseConversion(btn.id)}
                      className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        activeCase === btn.id
                          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 font-medium'
                          : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-semibold text-xs">{btn.label}</div>
                      <div className="text-[10px] opacity-75 truncate">{btn.example}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyCaseText}
                  aria-label="Copy converted text to clipboard"
                  className="h-11 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-medium text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  {copiedCaseText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedCaseText ? 'Copied to Clipboard' : 'Copy Converted Text'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCaseText}
                  aria-label="Download converted text as file"
                  className="h-11 px-5 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 border border-neutral-200 dark:border-neutral-700"
                >
                  <Download className="w-4 h-4" />
                  Download .txt File
                </button>
              </div>
            </div>
          ) : (
            /* Upload / Dropzone Section */
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`w-full rounded-2xl border-2 border-dashed p-8 md:p-12 flex flex-col items-center justify-center text-center transition-colors relative overflow-hidden ${
                isDragging
                  ? 'border-rose-500 bg-rose-50/40 dark:border-rose-500 dark:bg-rose-950/20'
                  : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/90 hover:border-rose-300 dark:hover:border-rose-900/50'
              }`}
            >
            <input
              ref={fileInputRef}
              id="file-upload-input"
              type="file"
              multiple={isMultiFile}
              accept={tool.acceptedFileTypes}
              aria-label={`Upload file for ${tool.title}`}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  addFiles(Array.from(e.target.files));
                  e.target.value = '';
                }
              }}
              className="hidden"
            />

            {(isMultiFile ? selectedFiles.length === 0 : !selectedFile) ? (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-4">
                  <Upload className="w-7 h-7" />
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
                  {tool.id === 'image-to-pdf'
                    ? 'Drop your images here'
                    : tool.id === 'merge-pdf'
                    ? 'Drop your PDF files here'
                    : 'Drop your file here'}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                  {tool.id === 'image-to-pdf'
                    ? 'Select single or multiple JPG, PNG, or WebP photos to convert into a clean PDF document'
                    : tool.id === 'merge-pdf'
                    ? 'Select single or multiple PDF documents to merge into a single file'
                    : `Supports ${tool.acceptedFileTypes.toUpperCase().replace(/\./g, ' ')} • No file size limit (100% private)`}
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={
                    tool.id === 'image-to-pdf'
                      ? 'Select Images (JPG, PNG, WebP) from device'
                      : tool.id === 'merge-pdf'
                      ? 'Select Multiple PDF Files from device'
                      : `Select ${tool.title} file from device`
                  }
                  className="h-12 px-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                >
                  <FileIcon className="w-4 h-4" />
                  {tool.id === 'image-to-pdf'
                    ? 'Select Images (JPG, PNG, WebP)'
                    : tool.id === 'merge-pdf'
                    ? 'Select Multiple PDF Files'
                    : 'Select File'}
                </button>
                <span className="text-xs sm:text-sm text-neutral-400 mt-3">
                  or click to browse from your device
                </span>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                {isMultiFile ? (
                  /* Multi-PDF / Multi-Image File Queue Manager */
                  <div className="w-full max-w-xl bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 mb-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                            {selectedFiles.length} {tool.id === 'merge-pdf' ? 'PDF Documents' : tool.id === 'image-to-pdf' ? 'Images' : 'Files'} Selected
                          </h3>
                          <p className="text-[11px] text-neutral-500">
                            Total: {formatBytes(selectedFiles.reduce((acc, f) => acc + f.size, 0))} • Arrange sequence below
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          aria-label="Add more files to queue"
                          className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add More
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          aria-label="Clear all files from queue"
                          className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-700 dark:text-neutral-300 hover:text-red-600 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* File List */}
                    <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={`${file.name}-${idx}`}
                          className="flex items-center justify-between gap-3 p-2.5 sm:p-3 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[11px] font-semibold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <div className="text-left min-w-0">
                              <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white truncate">
                                {file.name}
                              </p>
                              <p className="text-[10px] text-neutral-400">
                                {formatBytes(file.size)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveUp(idx)}
                              title="Move up in sequence"
                              aria-label={`Move ${file.name} up in sequence`}
                              className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === selectedFiles.length - 1}
                              onClick={() => handleMoveDown(idx)}
                              title="Move down in sequence"
                              aria-label={`Move ${file.name} down in sequence`}
                              className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              title="Remove file"
                              aria-label={`Remove ${file.name} from queue`}
                              className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {tool.id === 'merge-pdf' && selectedFiles.length === 1 && (
                      <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-300 text-left">
                        <strong>1 PDF in queue:</strong> Click <strong>Add More</strong> or drop another PDF to merge 2 or more files into one unified document.
                      </div>
                    )}
                  </div>
                ) : (
                  /* Single File Selected Badge */
                  <div className="flex items-center gap-3 p-3.5 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full mb-4">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {selectedFile?.name}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {selectedFile && formatBytes(selectedFile.size)} • Ready to process
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleReset}
                      title="Remove file"
                      aria-label="Remove uploaded file and reset tool"
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 50KB Guarantee Badge */}
                {tool.id === 'compress-image-to-50kb' && status === 'idle' && (
                  <div className="w-full max-w-md bg-emerald-50/80 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 mb-4 text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                        Target Ceiling: Strictly ≤ 50 KB
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
                      Our multi-pass in-browser engine automatically calculates the exact quality and dimensions to guarantee your photo passes strict recruitment, visa, and passport portal limits.
                    </p>
                  </div>
                )}

                {/* 100KB Guarantee Badge */}
                {tool.id === 'compress-image-to-100kb' && status === 'idle' && (
                  <div className="w-full max-w-md bg-sky-50/80 dark:bg-sky-950/40 p-4 rounded-xl border border-sky-200 dark:border-sky-800/80 mb-4 text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span className="text-xs font-semibold text-sky-900 dark:text-sky-200">
                        Target Ceiling: Strictly ≤ 100 KB
                      </span>
                    </div>
                    <p className="text-[11px] text-sky-700 dark:text-sky-300 leading-relaxed">
                      Our multi-pass in-browser engine automatically optimizes image quality and dimensions to ensure your file strictly satisfies official portals requiring files under 100KB.
                    </p>
                  </div>
                )}

                {/* Compression Level Selector for Image and PDF Compressor */}
                {(tool.id === 'compress-image' || tool.id === 'compress-pdf') && status === 'idle' && (
                  <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-4 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5" />
                        Compression Quality:
                      </span>
                      <span className="text-xs font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                        {Math.round(compressionQuality * 100)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Max (60%)', q: 0.6, desc: 'Smallest file' },
                        { label: 'Optimal (75%)', q: 0.75, desc: 'Recommended' },
                        { label: 'Light (85%)', q: 0.85, desc: 'Best clarity' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          aria-label={`Select ${preset.label} compression`}
                          aria-pressed={compressionQuality === preset.q}
                          onClick={() => setCompressionQuality(preset.q)}
                          className={`py-2 px-2 rounded-xl text-center border text-xs transition-colors cursor-pointer ${
                            compressionQuality === preset.q
                              ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 font-semibold'
                              : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          <div>{preset.label}</div>
                          <div className="text-[10px] opacity-75 font-normal">{preset.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Compression Percentage Selector */}
                {tool.id === 'compress-video' && status === 'idle' && (
                  <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900/90 p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 mb-4 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5 text-rose-500" />
                        Select Compression Level:
                      </span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Choose percentage
                      </span>
                    </div>

                    {/* The 3 Buttons: 20%, 30%, 50% */}
                    <div className="grid grid-cols-3 gap-2.5 relative">
                      {[
                        { pct: 20 as const, label: '20%', sub: 'Light' },
                        { pct: 30 as const, label: '30%', sub: 'Balanced' },
                        { pct: 50 as const, label: '50%', sub: 'Maximum' },
                      ].map((item) => {
                        const isSelected = videoCompressPercent === item.pct;
                        return (
                          <button
                            key={item.pct}
                            type="button"
                            onClick={() => setVideoCompressPercent(item.pct)}
                            aria-label={`Select ${item.label} video compression`}
                            aria-pressed={isSelected}
                            className={`relative py-3 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                              isSelected
                                ? 'border-rose-600 bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20 scale-[1.02]'
                                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-medium'
                            }`}
                          >
                            <span className="text-lg font-bold tracking-tight">{item.label}</span>
                            <span
                              className={`text-[10px] font-medium mt-0.5 px-1.5 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-rose-700 text-rose-100'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                              }`}
                            >
                              {item.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Popup Under the Button */}
                    {selectedFile && (
                      <div className="mt-3 p-3.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-sm relative animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Caret arrow pointing to active button */}
                        <div
                          className={`absolute -top-1.5 w-3 h-3 bg-white dark:bg-neutral-950 border-t border-l border-neutral-200 dark:border-neutral-800 rotate-45 -translate-x-1/2 transition-all duration-300 ease-out ${
                            videoCompressPercent === 20
                              ? 'left-[16.66%]'
                              : videoCompressPercent === 30
                              ? 'left-[50%]'
                              : 'left-[83.33%]'
                          }`}
                        />

                        <div className="flex items-center justify-between gap-3 px-1 py-0.5">
                          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            Expected Size After Compression
                          </div>
                          <div className="text-sm sm:text-base font-bold font-mono tracking-tight tabular-nums text-neutral-900 dark:text-white">
                            ~{formatBytes(Math.round(selectedFile.size * (1 - videoCompressPercent / 100)))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Visual Page Selection Studio for Split PDF */}
                {tool.id === 'split-pdf' && selectedFile && status === 'idle' && (
                  <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900 p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-4 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <Files className="w-4 h-4" />
                        Page Selection Studio
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                        {pdfPageCount} {pdfPageCount === 1 ? 'Page' : 'Pages'} Total
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                      Choose which pages to extract into your new PDF document. Click individual page tiles or use quick presets below.
                    </p>

                    {/* Quick Preset Buttons */}
                    <div className="grid grid-cols-4 gap-1.5 mb-3">
                      <button
                        type="button"
                        onClick={selectAllPages}
                        aria-label="Select all PDF pages"
                        className="py-1.5 px-2 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-900 dark:hover:border-white transition-colors cursor-pointer text-center"
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={selectOddPages}
                        aria-label="Select odd PDF pages"
                        className="py-1.5 px-2 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-900 dark:hover:border-white transition-colors cursor-pointer text-center"
                      >
                        Odd Pages
                      </button>
                      <button
                        type="button"
                        onClick={selectEvenPages}
                        aria-label="Select even PDF pages"
                        className="py-1.5 px-2 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-900 dark:hover:border-white transition-colors cursor-pointer text-center"
                      >
                        Even Pages
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPages([])}
                        aria-label="Clear all page selections"
                        className="py-1.5 px-2 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-red-400 hover:text-red-600 transition-colors cursor-pointer text-center"
                      >
                        Clear
                      </button>
                    </div>

                    {/* Range Inputs */}
                    <div className="flex items-center gap-2 mb-3 bg-white dark:bg-neutral-950 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
                      <span className="text-neutral-500 font-medium shrink-0">Extract Range:</span>
                      <label htmlFor="split-range-from" className="text-neutral-400 cursor-pointer">From</label>
                      <input
                        id="split-range-from"
                        type="number"
                        min={1}
                        max={pdfPageCount}
                        value={rangeFrom}
                        aria-label="Start page for range extraction"
                        onChange={(e) => setRangeFrom(Math.max(1, Math.min(pdfPageCount, parseInt(e.target.value) || 1)))}
                        className="w-14 px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-center text-xs font-semibold bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      />
                      <label htmlFor="split-range-to" className="text-neutral-400 cursor-pointer">To</label>
                      <input
                        id="split-range-to"
                        type="number"
                        min={1}
                        max={pdfPageCount}
                        value={rangeTo}
                        aria-label="End page for range extraction"
                        onChange={(e) => setRangeTo(Math.max(1, Math.min(pdfPageCount, parseInt(e.target.value) || 1)))}
                        className="w-14 px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-center text-xs font-semibold bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => applyRangeSelection(rangeFrom, rangeTo)}
                        aria-label="Apply page range selection"
                        className="ml-auto px-3 py-1 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium text-xs transition-colors cursor-pointer shrink-0"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Interactive Page Tiles Grid */}
                    <div className="max-h-48 overflow-y-auto pr-1">
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {Array.from({ length: pdfPageCount }, (_, i) => i + 1).map((num) => {
                          const isSelected = selectedPages.includes(num);
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => togglePageSelection(num)}
                              aria-label={`Toggle page ${num}`}
                              aria-pressed={isSelected}
                              className={`py-2 px-1 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-xs'
                                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                              }`}
                            >
                              <FileIcon className={`w-4 h-4 ${isSelected ? 'text-white dark:text-neutral-900' : 'text-neutral-400'}`} />
                              <span>P. {num}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Current Selection Summary */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                      <span className="text-neutral-500">
                        Selected: <strong className="text-neutral-900 dark:text-neutral-100">{selectedPages.length}</strong> of {pdfPageCount} pages
                      </span>
                      {selectedPages.length === 0 ? (
                        <span className="text-red-500 font-medium">Please select at least 1 page</span>
                      ) : (
                        <span className="text-neutral-400 truncate max-w-[160px] text-right">
                          Pages: {selectedPages.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Visual Rotate PDF Studio */}
                {tool.id === 'rotate-pdf' && selectedFile && status === 'idle' && (
                  <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900 p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-4 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <RotateCw className="w-4 h-4" />
                        PDF Rotation Direction
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                        {pdfPageCount} {pdfPageCount === 1 ? 'Page' : 'Pages'} in Document
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                      Choose which direction to permanently rotate all pages in this PDF.
                    </p>

                    {/* Rotation Direction Tiles */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { label: '90° Clockwise', angle: 90, desc: 'Turn Right' },
                        { label: '180° Flip', angle: 180, desc: 'Upside Down' },
                        { label: '270° Counter-CW', angle: 270, desc: 'Turn Left' },
                      ].map((item) => (
                        <button
                          key={item.angle}
                          type="button"
                          aria-label={`Rotate PDF ${item.label}`}
                          aria-pressed={rotationAngle === item.angle}
                          onClick={() => setRotationAngle(item.angle)}
                          className={`p-3 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                            rotationAngle === item.angle
                              ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 font-semibold'
                              : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                          }`}
                        >
                          <RotateCw
                            className={`w-5 h-5 transition-transform duration-300 ${rotationAngle === item.angle ? 'text-white dark:text-neutral-900' : 'text-neutral-600 dark:text-neutral-400'}`}
                            style={{ transform: `rotate(${item.angle}deg)` }}
                          />
                          <div className="text-xs">{item.label}</div>
                          <div className="text-[10px] opacity-75">{item.desc}</div>
                        </button>
                      ))}
                    </div>

                    {/* Live Document Preview Card */}
                    <div className="p-4 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center gap-4">
                      <div
                        className="relative w-16 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 flex items-center justify-center transition-transform duration-500"
                        style={{ transform: `rotate(${rotationAngle}deg)` }}
                      >
                        <FileText className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
                        <span className="absolute bottom-1 right-1 text-[9px] font-bold text-neutral-400">PDF</span>
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-300">
                        <div className="font-semibold text-neutral-900 dark:text-white">Active Rotation: {rotationAngle}°</div>
                        <div className="text-neutral-500 text-[11px]">All {pdfPageCount} pages will be rotated permanently into this orientation.</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual Watermark PDF Studio */}
                {tool.id === 'watermark-pdf' && selectedFile && status === 'idle' && (
                  <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900 p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-4 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <Stamp className="w-4 h-4" />
                        Watermark Settings Studio
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                        {pdfPageCount} {pdfPageCount === 1 ? 'Page' : 'Pages'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                      Type custom watermark text or pick a stamp preset to embed across all document pages.
                    </p>

                    {/* Custom Text Input */}
                    <div className="mb-3">
                      <label htmlFor="watermark-text-input" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1 cursor-pointer">
                        Watermark Stamp Text:
                      </label>
                      <input
                        id="watermark-text-input"
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="e.g. CONFIDENTIAL, DRAFT, COMPANY NAME..."
                        aria-label="Watermark text stamp"
                        className="w-full h-10 px-3.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs sm:text-sm font-semibold tracking-wide uppercase focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
                      />
                    </div>

                    {/* Quick Preset Text Buttons */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {['CONFIDENTIAL', 'DO NOT COPY', 'DRAFT', 'SAMPLE', 'ORIGINAL'].map((txt) => (
                        <button
                          key={txt}
                          type="button"
                          aria-label={`Use preset watermark stamp ${txt}`}
                          onClick={() => setWatermarkText(txt)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                            watermarkText === txt
                              ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                              : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400'
                          }`}
                        >
                          {txt}
                        </button>
                      ))}
                    </div>

                    {/* Options Row: Color, Angle, Opacity */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Stamp Color */}
                      <div>
                        <span className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                          Stamp Color:
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { id: 'red', label: 'Red' },
                            { id: 'gray', label: 'Gray' },
                            { id: 'blue', label: 'Blue' },
                          ].map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              aria-label={`Watermark stamp color ${c.label}`}
                              aria-pressed={watermarkColor === c.id}
                              onClick={() => setWatermarkColor(c.id as 'red' | 'gray' | 'blue')}
                              className={`py-1.5 text-center text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                                watermarkColor === c.id
                                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Stamp Angle */}
                      <div>
                        <span className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                          Stamp Orientation:
                        </span>
                        <div className="grid grid-cols-2 gap-1">
                          {[
                            { id: 45, label: 'Diagonal' },
                            { id: 0, label: 'Horizontal' },
                          ].map((a) => (
                            <button
                              key={a.id}
                              type="button"
                              aria-label={`Watermark stamp orientation ${a.label}`}
                              aria-pressed={watermarkAngle === a.id}
                              onClick={() => setWatermarkAngle(a.id as 45 | 0)}
                              className={`py-1.5 text-center text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                                watermarkAngle === a.id
                                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                                  : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              {a.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Preview Box */}
                    <div className="relative h-20 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden">
                      <div
                        className={`font-black text-xl tracking-widest select-none pointer-events-none transition-all ${
                          watermarkColor === 'red'
                            ? 'text-red-500'
                            : watermarkColor === 'gray'
                            ? 'text-neutral-500'
                            : 'text-blue-500'
                        }`}
                        style={{
                          opacity: watermarkOpacity,
                          transform: `rotate(${watermarkAngle === 45 ? '-25deg' : '0deg'})`,
                        }}
                      >
                        {watermarkText || 'WATERMARK'}
                      </div>
                      <span className="absolute bottom-1 right-2 text-[10px] text-neutral-400">Preview</span>
                    </div>
                  </div>
                )}

                {/* Interactive Image Resizer Studio */}
                {tool.id === 'resize-image' && selectedFile && status === 'idle' && (
                  <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900 p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-4 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <Sliders className="w-4 h-4" />
                        Resize Settings Studio
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                        Original: {resizeOriginalWidth} × {resizeOriginalHeight} px
                      </span>
                    </div>

                    {/* Mode Selector: By Pixels vs By Percentage */}
                    <div className="grid grid-cols-2 gap-2 mb-4 bg-neutral-200/60 dark:bg-neutral-800/60 p-1 rounded-lg">
                      <button
                        type="button"
                        aria-label="Resize image by exact pixels"
                        aria-pressed={resizeUnit === 'px'}
                        onClick={() => setResizeUnit('px')}
                        className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                          resizeUnit === 'px'
                            ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        By Pixels (px)
                      </button>
                      <button
                        type="button"
                        aria-label="Resize image by percentage scale"
                        aria-pressed={resizeUnit === 'percent'}
                        onClick={() => setResizeUnit('percent')}
                        className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                          resizeUnit === 'percent'
                            ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        By Percentage (%)
                      </button>
                    </div>

                    {/* Pixels Controls */}
                    {resizeUnit === 'px' ? (
                      <div className="space-y-3 mb-4">
                        <div className="grid grid-cols-2 gap-3 items-center">
                          <div>
                            <label htmlFor="resize-width-input" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1 cursor-pointer">
                              Width (px)
                            </label>
                            <input
                              id="resize-width-input"
                              type="number"
                              min={1}
                              max={10000}
                              value={resizeWidth}
                              aria-label="Target image width in pixels"
                              onChange={(e) => {
                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                setResizeWidth(val);
                                if (resizeLockAspect && resizeOriginalWidth > 0) {
                                  const ratio = resizeOriginalHeight / resizeOriginalWidth;
                                  setResizeHeight(Math.max(1, Math.round(val * ratio)));
                                }
                              }}
                              className="w-full h-10 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
                            />
                          </div>
                          <div>
                            <label htmlFor="resize-height-input" className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1 cursor-pointer">
                              Height (px)
                            </label>
                            <input
                              id="resize-height-input"
                              type="number"
                              min={1}
                              max={10000}
                              value={resizeHeight}
                              aria-label="Target image height in pixels"
                              onChange={(e) => {
                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                setResizeHeight(val);
                                if (resizeLockAspect && resizeOriginalWidth > 0) {
                                  const ratio = resizeOriginalWidth / resizeOriginalHeight;
                                  setResizeWidth(Math.max(1, Math.round(val * ratio)));
                                }
                              }}
                              className="w-full h-10 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
                            />
                          </div>
                        </div>

                        {/* Lock Aspect Ratio Toggle */}
                        <button
                          type="button"
                          onClick={() => setResizeLockAspect(!resizeLockAspect)}
                          aria-label={resizeLockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                          aria-pressed={resizeLockAspect}
                          className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            resizeLockAspect
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                          }`}
                        >
                          {resizeLockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          <span>{resizeLockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}</span>
                        </button>
                      </div>
                    ) : (
                      /* Percentage Presets */
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Scale Image By:
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {[25, 50, 75, 150, 200].map((pct) => {
                            const isMatch =
                              resizeWidth === Math.round((resizeOriginalWidth * pct) / 100) &&
                              resizeHeight === Math.round((resizeOriginalHeight * pct) / 100);
                            return (
                              <button
                                key={pct}
                                type="button"
                                aria-label={`Scale image to ${pct} percent`}
                                aria-pressed={isMatch}
                                onClick={() => {
                                  setResizeWidth(Math.max(1, Math.round((resizeOriginalWidth * pct) / 100)));
                                  setResizeHeight(Math.max(1, Math.round((resizeOriginalHeight * pct) / 100)));
                                }}
                                className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                                  isMatch
                                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                                }`}
                              >
                                {pct}%
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Output Format Selection */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Target Image Format:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'image/jpeg', label: 'JPG' },
                          { id: 'image/png', label: 'PNG' },
                          { id: 'image/webp', label: 'WebP' },
                        ].map((fmt) => (
                          <button
                            key={fmt.id}
                            type="button"
                            aria-label={`Export as ${fmt.label}`}
                            aria-pressed={resizeFormat === fmt.id}
                            onClick={() => setResizeFormat(fmt.id as any)}
                            className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                              resizeFormat === fmt.id
                                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {fmt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target Dimensions Summary */}
                    <div className="text-center py-2 px-3 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300">
                      Target Dimensions: <strong className="text-neutral-900 dark:text-white font-bold">{resizeWidth} × {resizeHeight} px</strong>
                    </div>
                  </div>
                )}

                {/* Interactive PDF Page Numbering Studio */}
                {tool.id === 'add-page-numbers-to-pdf' && selectedFile && status === 'idle' && (
                  <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900 p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-4 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <Hash className="w-4 h-4" />
                        Page Numbering Settings
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                        {pdfPageCount} {pdfPageCount === 1 ? 'Page' : 'Pages'}
                      </span>
                    </div>

                    {/* Position Selector (6-Position Grid) */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Stamp Position:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'top-left', label: 'Top Left' },
                          { id: 'top-center', label: 'Top Center' },
                          { id: 'top-right', label: 'Top Right' },
                          { id: 'bottom-left', label: 'Bottom Left' },
                          { id: 'bottom-center', label: 'Bottom Center' },
                          { id: 'bottom-right', label: 'Bottom Right' },
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            type="button"
                            aria-label={`Place page number at ${pos.label}`}
                            aria-pressed={pageNumberPosition === pos.id}
                            onClick={() => setPageNumberPosition(pos.id as any)}
                            className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer text-center ${
                              pageNumberPosition === pos.id
                                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Numbering Format Selector */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Numbering Format:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'page_x_of_y', label: `Page 1 of ${pdfPageCount}` },
                          { id: 'x_of_y', label: `1 of ${pdfPageCount}` },
                          { id: 'x_slash_y', label: `1 / ${pdfPageCount}` },
                          { id: 'number_only', label: '1 (Digit only)' },
                        ].map((fmt) => (
                          <button
                            key={fmt.id}
                            type="button"
                            aria-label={`Format ${fmt.label}`}
                            aria-pressed={pageNumberFormat === fmt.id}
                            onClick={() => setPageNumberFormat(fmt.id as any)}
                            className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer text-left truncate ${
                              pageNumberFormat === fmt.id
                                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {fmt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Options: Skip First Page + Font Size */}
                    <div className="grid grid-cols-2 gap-3 mb-4 items-center">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Font Size:
                        </label>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { id: 9, label: 'Small' },
                            { id: 11, label: 'Medium' },
                            { id: 14, label: 'Large' },
                          ].map((sz) => (
                            <button
                              key={sz.id}
                              type="button"
                              aria-label={`Font size ${sz.label}`}
                              aria-pressed={pageNumberFontSize === sz.id}
                              onClick={() => setPageNumberFontSize(sz.id)}
                              className={`py-1.5 text-center text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                                pageNumberFontSize === sz.id
                                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                                  : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                              }`}
                            >
                              {sz.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            id="page-number-skip-cover"
                            type="checkbox"
                            checked={pageNumberSkipFirst}
                            aria-label="Do not number first page (cover page)"
                            onChange={(e) => setPageNumberSkipFirst(e.target.checked)}
                            className="w-4 h-4 rounded border-neutral-300 text-rose-600 focus:ring-rose-500"
                          />
                          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            Skip cover / 1st page
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Live Preview Sample */}
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
                      <span>Sample on Page 1:</span>
                      <span className="font-mono font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-950 px-2.5 py-1 rounded border border-neutral-200 dark:border-neutral-700">
                        {pageNumberSkipFirst
                          ? '(No number on cover)'
                          : pageNumberFormat === 'page_x_of_y'
                          ? `Page 1 of ${pdfPageCount}`
                          : pageNumberFormat === 'x_of_y'
                          ? `1 of ${pdfPageCount}`
                          : pageNumberFormat === 'x_slash_y'
                          ? `1 / ${pdfPageCount}`
                          : '1'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Interactive Crop & Pixel Section */}
                {tool.hasPixelEditor && (
                  <PixelEditorSection
                    isVideo={tool.isVideo}
                    previewUrl={previewUrl}
                    onDimensionsChange={handleDimensionsChange}
                  />
                )}

                {/* Processing Progress Bar */}
                {status === 'processing' && (
                  <div className="w-full max-w-md my-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        {tool.id === 'compress-video' && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                        )}
                        {tool.id === 'mute-video'
                          ? 'Muting video & generating silent clip...'
                          : tool.id === 'compress-video'
                          ? videoProgressInfo?.stage || `Compressing video (-${videoCompressPercent}% target)...`
                          : 'Processing in browser...'}
                      </span>
                      <span className="font-mono font-bold text-neutral-900 dark:text-white">{progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-150 ease-out relative overflow-hidden ${
                          tool.id === 'compress-video' ? 'bg-rose-500' : 'bg-neutral-900 dark:bg-white'
                        }`}
                        style={{ width: `${Math.max(2, progress)}%` }}
                      />
                    </div>

                    {/* Real-time Video Transcode Timer & ETA Info */}
                    {tool.id === 'compress-video' && videoProgressInfo && (
                      <div className="flex justify-between items-center text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 font-mono">
                        <span>
                          {videoProgressInfo.duration && videoProgressInfo.duration > 0
                            ? `Transcoding: ${Math.floor((videoProgressInfo.currentTime || 0) / 60)}:${String(
                                Math.floor((videoProgressInfo.currentTime || 0) % 60)
                              ).padStart(2, '0')} / ${Math.floor(videoProgressInfo.duration / 60)}:${String(
                                Math.floor(videoProgressInfo.duration % 60)
                              ).padStart(2, '0')}`
                            : 'Preparing hardware frames...'}
                        </span>
                        <span className="tabular-nums">
                          {videoProgressInfo.remainingSeconds !== undefined && videoProgressInfo.remainingSeconds > 0
                            ? `~${videoProgressInfo.remainingSeconds}s remaining`
                            : progress >= 95
                            ? 'Packaging final MP4...'
                            : 'In-browser GPU encode'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Error Banner */}
                {status === 'error' && (
                  <div className="w-full max-w-md p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 my-4 text-center">
                    {errorMessage}
                  </div>
                )}

                {/* Success Card with Real Before & After Metrics */}
                {status === 'completed' && processResult && (
                  <div className="w-full max-w-md p-5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col items-center text-center my-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      File Ready
                    </h3>

                    {/* Real File Compression Statistics */}
                    {tool.category === 'compress' ? (
                      <div className="w-full my-3">
                        <div className="w-full p-3 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-around text-xs">
                          <div>
                            <span className="text-neutral-400 block text-[11px]">Original</span>
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                              {formatBytes(processResult.originalSize)}
                            </span>
                          </div>
                          <div className="text-emerald-600 font-bold flex items-center gap-1">
                            <TrendingDown className="w-4 h-4" />
                            -{processResult.reductionPercent}%
                          </div>
                          <div>
                            <span className="text-neutral-400 block text-[11px]">Compressed</span>
                            <span className="font-semibold text-neutral-900 dark:text-white">
                              {formatBytes(processResult.compressedSize)}
                            </span>
                          </div>
                        </div>
                        {tool.isVideo && processResult.downloadUrl && (
                          <div className="w-full mt-3 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black aspect-video flex items-center justify-center">
                            <video
                              key={processResult.downloadUrl}
                              src={processResult.downloadUrl}
                              controls
                              playsInline
                              preload="auto"
                              className="w-full h-full object-contain"
                            >
                              <source
                                src={processResult.downloadUrl}
                                type={selectedFile?.type || 'video/mp4'}
                              />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                      </div>
                    ) : tool.id === 'split-pdf' ? (
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 my-2">
                        Extracted {selectedPages.length} {selectedPages.length === 1 ? 'page' : 'pages'} into a new document ({formatBytes(processResult.compressedSize)})
                      </p>
                    ) : tool.id === 'rotate-pdf' ? (
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 my-2">
                        Permanently rotated all {pdfPageCount} {pdfPageCount === 1 ? 'page' : 'pages'} by {rotationAngle}° ({formatBytes(processResult.compressedSize)})
                      </p>
                    ) : tool.id === 'watermark-pdf' ? (
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 my-2">
                        Stamped &ldquo;{watermarkText || 'CONFIDENTIAL'}&rdquo; watermark across all {pdfPageCount} {pdfPageCount === 1 ? 'page' : 'pages'} ({formatBytes(processResult.compressedSize)})
                      </p>
                    ) : tool.id === 'resize-image' ? (
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 my-2">
                        Resized from {resizeOriginalWidth}×{resizeOriginalHeight}px to {resizeWidth}×{resizeHeight}px ({formatBytes(processResult.compressedSize)})
                      </p>
                    ) : tool.id === 'add-page-numbers-to-pdf' ? (
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 my-2">
                        Numbered {pdfPageCount} pages ({pageNumberSkipFirst ? 'cover page skipped' : 'all pages numbered'}) ({formatBytes(processResult.compressedSize)})
                      </p>
                    ) : tool.id === 'mute-video' ? (
                      <div className="w-full my-3">
                        <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          Audio stripped completely • 100% silent video ready ({formatBytes(processResult.compressedSize)})
                        </p>
                        <div className="w-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black aspect-video flex items-center justify-center">
                          <video
                            src={processResult.downloadUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ) : tool.hasPixelEditor ? (
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 my-2">
                        Resized to exact {pixelDimensions.width} × {pixelDimensions.height} px
                      </p>
                    ) : (
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 my-2">
                        Converted into .{(tool.category === 'convert' || tool.category === 'pdf' ? tool.outputExtension : (processResult.outputExtension || tool.outputExtension)).toLowerCase()} ({formatBytes(processResult.compressedSize)})
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleDownload}
                      aria-label={`Download processed ${tool.title} file`}
                      className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Download className="w-4 h-4" />
                      Download {tool.id === 'merge-pdf' ? 'Merged PDF' : tool.id === 'split-pdf' ? 'Extracted PDF' : tool.id === 'rotate-pdf' ? 'Rotated PDF' : tool.id === 'watermark-pdf' ? 'Watermarked PDF' : tool.id === 'resize-image' ? 'Resized Image' : tool.id === 'add-page-numbers-to-pdf' ? 'Numbered PDF' : tool.id === 'mute-video' ? 'Video (No Audio)' : `${(tool.category === 'convert' || tool.category === 'pdf' ? tool.outputExtension : (processResult.outputExtension || tool.outputExtension)).toUpperCase()} File`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

          {/* Action Button */}
          {((isMultiFile && selectedFiles.length > 0) || selectedFile) &&
            status !== 'completed' &&
            tool.id !== 'mute-video' && (
            <div className="w-full flex justify-center mt-6">
              <button
                type="button"
                onClick={handleAction}
                aria-label={`Execute ${tool.title}`}
                disabled={
                  status === 'processing' ||
                  (tool.id === 'merge-pdf' && selectedFiles.length < 2) ||
                  (tool.id === 'split-pdf' && selectedPages.length === 0)
                }
                className="w-full max-w-md h-12 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-semibold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
              >
                {status === 'processing' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {tool.id === 'merge-pdf'
                      ? selectedFiles.length >= 2
                        ? `Merge ${selectedFiles.length} PDFs into One`
                        : 'Select 2+ PDFs to Merge'
                      : tool.id === 'split-pdf'
                      ? selectedPages.length > 0
                        ? `Split & Extract ${selectedPages.length} ${selectedPages.length === 1 ? 'Page' : 'Pages'}`
                        : 'Select at least 1 Page to Split'
                      : tool.id === 'rotate-pdf'
                      ? `Rotate ${pdfPageCount} ${pdfPageCount === 1 ? 'Page' : 'Pages'} by ${rotationAngle}°`
                      : tool.id === 'watermark-pdf'
                      ? `Add Watermark to ${pdfPageCount} ${pdfPageCount === 1 ? 'Page' : 'Pages'}`
                      : tool.id === 'resize-image'
                      ? `Resize Image to ${resizeWidth} × ${resizeHeight} px`
                      : tool.id === 'add-page-numbers-to-pdf'
                      ? `Add Page Numbers to ${pdfPageCount} ${pdfPageCount === 1 ? 'Page' : 'Pages'}`
                      : tool.id === 'mute-video'
                      ? 'Mute Video & Remove Audio'
                      : isMultiFile && selectedFiles.length > 1
                      ? `Convert ${selectedFiles.length} Photos to PDF`
                      : tool.id === 'compress-video'
                      ? `Compress Video (-${videoCompressPercent}%)`
                      : tool.actionButtonText}
                  </>
                )}
              </button>
            </div>
          )}

          {status === 'completed' && (
            <button
              type="button"
              onClick={handleReset}
              aria-label="Process another file and reset tool"
              className="mt-4 flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Process another file
            </button>
          )}

          {/* Privacy & Trust Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              Client-Side Processing
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Zero Server Storage
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              No Registration Required
            </span>
          </div>

          {/* In-Content Clean Ad Banner */}
          <AdBanner placement="in-content" />

          {/* SEO SECTION: How It Works */}
          <div className="w-full mt-10 pt-10 border-t border-neutral-200/80 dark:border-neutral-800 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6 text-center">
              How to Use {tool.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {tool.steps.map((step, idx) => (
                <div
                  key={step.title}
                  className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800"
                >
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold flex items-center justify-center text-xs mb-3">
                    {idx + 1}
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white text-base mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SEO SECTION: FAQs */}
          <div className="w-full mt-10 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2.5">
              {tool.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className="border border-neutral-200/80 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      aria-label={faq.question}
                      aria-expanded={isOpen}
                      className="w-full p-4 text-left font-medium text-sm sm:text-base text-neutral-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SEO SECTION: Editorial & Privacy Architecture */}
          {tool.editorial && (
            <div className="w-full mt-10 pt-10 border-t border-neutral-200/80 dark:border-neutral-800 text-left">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
                {tool.editorial.heading}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8">
                {tool.editorial.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tool.editorial.features.map((feat) => (
                  <div
                    key={feat.title}
                    className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <h3 className="font-semibold text-neutral-900 dark:text-white text-base">
                        {feat.title}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed pl-6">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO SECTION: Related Tools Matrix (Internal Linking) */}
          {relatedTools && relatedTools.length > 0 && (
            <div className="w-full mt-10 pt-10 border-t border-neutral-200/80 dark:border-neutral-800 text-left">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                  Related Tools & Converters
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Explore complementary 100% private in-browser tools to boost your workflow.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTools.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/${rel.slug}`}
                    prefetch={true}
                    aria-label={`Open ${rel.title} tool`}
                    className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-rose-200 dark:hover:border-rose-900/60 hover:shadow-2xs transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-900/40">
                          {rel.category}
                        </span>
                        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors flex items-center gap-0.5">
                          Open →
                        </span>
                      </div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white text-base group-hover:underline">
                        {rel.title}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {rel.shortDesc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Desktop Sidebar Ad */}
        <AdBanner placement="sidebar-right" />
      </div>

      {/* Sticky Bottom Footer Banner */}
      <AdBanner placement="sticky-footer" />
    </div>
  );
}
