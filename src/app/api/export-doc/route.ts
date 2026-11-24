import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_TYPES = new Set(['document', 'spreadsheets', 'presentation']);
const ALLOWED_FORMATS = new Set(['pdf', 'docx', 'txt', 'xlsx', 'pptx']);
const ID_PATTERN = /^[a-zA-Z0-9_-]{10,128}$/;
const GID_PATTERN = /^\d+$/;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawType = searchParams.get('type') || 'document';
  const rawId = searchParams.get('id');
  const rawGid = searchParams.get('gid');
  const rawFormat = searchParams.get('format') || 'pdf';

  // 1. Strict Input Validation (OWASP Defensive Boundary)
  if (!rawId || !ID_PATTERN.test(rawId)) {
    return NextResponse.json(
      { error: 'Invalid or missing document ID format.' },
      { status: 400 }
    );
  }

  const type = rawType.toLowerCase();
  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json(
      { error: 'Unsupported Google document type.' },
      { status: 400 }
    );
  }

  const format = rawFormat.toLowerCase();
  if (!ALLOWED_FORMATS.has(format)) {
    return NextResponse.json(
      { error: 'Unsupported export format.' },
      { status: 400 }
    );
  }

  const gid = rawGid && GID_PATTERN.test(rawGid) ? rawGid : null;

  // 2. Build Safe Destination URL
  let exportUrl = `https://docs.google.com/${encodeURIComponent(type)}/d/${encodeURIComponent(rawId)}/export?format=${encodeURIComponent(format)}`;
  if (type === 'spreadsheets') {
    exportUrl = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(rawId)}/export?format=${encodeURIComponent(format)}&size=a4&portrait=true&fitw=true&gridlines=true`;
    if (gid) exportUrl += `&gid=${encodeURIComponent(gid)}`;
  }

  // Double-check host to eliminate SSRF
  const parsedTarget = new URL(exportUrl);
  if (parsedTarget.hostname !== 'docs.google.com' || parsedTarget.protocol !== 'https:') {
    return NextResponse.json({ error: 'Untrusted export destination' }, { status: 400 });
  }

  try {
    const googleRes = await fetch(exportUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!googleRes.ok) {
      if (googleRes.status === 404) {
        return NextResponse.json(
          { error: 'Document not found or link is broken.' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'This document is private. Please set sharing in Google Docs to "Anyone with the link can view".' },
        { status: 403 }
      );
    }

    const contentType = googleRes.headers.get('content-type') || '';
    if (contentType.includes('text/html') && format === 'pdf') {
      return NextResponse.json(
        { error: 'This document is private or requires sign-in. Please ensure General access is set to "Anyone with the link can view".' },
        { status: 403 }
      );
    }

    // Protect serverless memory: Enforce max 35MB size limit
    const contentLength = googleRes.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 35 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Document exceeds maximum supported size for direct conversion (35MB).' },
        { status: 413 }
      );
    }

    const arrayBuffer = await googleRes.arrayBuffer();
    const extension = format === 'docx' ? 'docx' : format === 'txt' ? 'txt' : format === 'xlsx' ? 'xlsx' : format === 'pptx' ? 'pptx' : 'pdf';
    const mimeType =
      format === 'docx'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : format === 'txt'
        ? 'text/plain; charset=utf-8'
        : format === 'xlsx'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : format === 'pptx'
        ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        : 'application/pdf';

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="google_${type}_export.${extension}"`,
        'Cache-Control': 'public, max-age=60',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: unknown) {
    console.error('Document export error:', err);
    return NextResponse.json(
      { error: 'Failed to convert document. Please ensure the link is public and accessible.' },
      { status: 500 }
    );
  }
}
