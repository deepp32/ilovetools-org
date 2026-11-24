import { NextResponse, type NextRequest } from 'next/server';

// Known malicious user-agent patterns (scanners, exploit toolkits)
const BLOCKED_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'masscan',
  'nmap',
  'zgrab',
  'censys',
  'shodan',
  'acunetix',
  'dirbuster',
  'havij',
  'wpscan',
  'gobuster',
  'netsparker',
];

// Common vulnerability probe patterns targeted by botnets against web servers
const BLOCKED_PATH_PATTERNS = [
  /\.php($|\?|\/)/i,
  /\.env($|\.|\?)/i,
  /\/\.git/i,
  /\/\.svn/i,
  /\/\.aws/i,
  /\/wp-(admin|login|content|includes|json)/i,
  /\/xmlrpc/i,
  /\/phpmyadmin/i,
  /\/pma/i,
  /\/adminer/i,
  /\/cgi-bin/i,
  /\/actuator/i,
  /\/solr/i,
  /\/(etc\/passwd|win\.ini)/i,
  /\.bak($|\?)/i,
  /\.sql($|\?)/i,
  /\.config($|\?)/i,
  /\.ds_store/i,
];

// Dangerous query string fragments (SQL injection, path traversal, script injection)
const SUSPICIOUS_QUERY_PATTERNS = [
  /(\bunion\s+select\b|\bselect\s+.*\s+from\b)/i,
  /(<script|\balert\(|javascript:)/i,
  /(\.\.\/|\.\.\\)/,
  /(eval\(|base64_decode\()/i,
];

export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const userAgent = (req.headers.get('user-agent') || '').toLowerCase();

  // 1. Block Malicious Scanner User-Agents
  for (const bot of BLOCKED_USER_AGENTS) {
    if (userAgent.includes(bot)) {
      return new NextResponse('Access Denied: Automated vulnerability probe detected.', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  // 2. Block Exploitative & Bot Probe Paths
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse('Access Denied: Probing non-existent server infrastructure.', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }
  }

  // 3. Block Suspicious Query String Injection Attempts
  if (search) {
    let decodedSearch = search;
    try {
      decodedSearch = decodeURIComponent(search);
    } catch {
      return new NextResponse('Access Denied: Malformed encoding detected.', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    for (const pattern of SUSPICIOUS_QUERY_PATTERNS) {
      if (pattern.test(search) || pattern.test(decodedSearch)) {
        return new NextResponse('Access Denied: Suspicious input pattern detected.', {
          status: 400,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    }
  }

  // 4. Rate-Limit / Abuse Defense for API Endpoints
  if (pathname.startsWith('/api/')) {
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 10 * 1024 * 1024) {
      return new NextResponse('Payload Too Large', { status: 413 });
    }
  }

  // 5. Proceed with Strong Security Headers attached to Response
  const res = NextResponse.next();

  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-DNS-Prefetch-Control', 'on');

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icons, and static assets
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
