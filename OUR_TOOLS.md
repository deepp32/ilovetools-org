# Our Tools & Platforms Registry (iLoveTools)

> **Official Project Registry:** This file tracks every platform, cloud service, webmaster tool, directory, and technology library used in the **iLoveTools** project.
> **Maintenance Rule:** Whenever a new platform, tool, or marketing channel is added, update this file immediately.

---

## 1. Connected Platforms & External Services

| Platform / Service | Role & Function | Credentials / ID / URL | Current Status |
| :--- | :--- | :--- | :--- |
| **Vercel Anycast Edge** | Global Edge CDN hosting, static file distribution, automatic SSL certificate provisioning, and HTTP/3 caching. | Project ID: `prj_WKH75eHxahzhVWXWmfnzN6t6rQMT`<br/>Team: `team_nnsHTyWwpT3FCspSUo7ROpQw`<br/>URL: [ilovetools.org](https://www.ilovetools.org) | **Active & Live** (All 28 tools cached on Anycast Edge in < 90ms) |
| **Custom Domain & DNS** | Primary web domain and global Anycast DNS routing. | `https://www.ilovetools.org` | **Active & Verified** with TLS 1.3 HTTPS |
| **Google Analytics 4 (GA4)** | Live real-time traffic analytics, user engagement, pageviews, and geographic telemetry. | Measurement ID: `G-C56QDPLEKQ`<br/>Implemented in: `src/app/layout.tsx` | **Active & Collecting Data** (HTTP 204 verified hits) |
| **Microsoft Clarity** | Official Bing user behavior analytics, real-time heatmaps, and session recordings for Bing ranking telemetry. | Project ID: `ze16s3opjp`<br/>Implemented in: `src/app/layout.tsx` | **Active, Deployed & Connected to Bing** |
| **Google Search Console** | Google indexing management, sitemap crawler tracking, search query analytics, and SERP clicks. | Property: `https://www.ilovetools.org`<br/>Sitemap: `https://www.ilovetools.org/sitemap.xml` | **Verified & Indexed** (Appearing in Google search results) |
| **Google AdSense** | Website monetization and automated display advertising. | Publisher ID: `ca-pub-1992103509447219`<br/>Authorized Seller File: `public/ads.txt` | **In Review** (*"Getting ready"* status) |
| **Bing Webmaster Tools** | Search engine indexing & ranking (powers Bing, Yahoo, DuckDuckGo, Ecosia, and ChatGPT Search). | Property: `https://www.ilovetools.org`<br/>Sitemap: `https://www.ilovetools.org/sitemap.xml`<br/>Site Scan: 0 Errors, 0 Warnings<br/>URL Inspection: 0 Issues | **Active, Fully Verified & Connected to Clarity** |
| **IndexNow Protocol** | Real-time automated URL indexing push to search engines for instant crawl discovery. | Key: `166faff8ee731b75b930f94e743dbbe6`<br/>Pushed 31 URLs | **Active & Pushed** (HTTP 200/202 verified by Bing & IndexNow) |
| **Google Safe Browsing** | Telemetry and domain security validation. | Automated crawler monitoring | Accumulating clean traffic history |
| **Product Hunt** | Global product launch, maker community discovery, and high-authority backlink. | Launch Draft: `iLoveTools`<br/>Connected via Product Hunt MCP server (`https://mcp.producthunt.com/mcp`) | **Launch Scheduled / Ready** |
| **AlternativeTo.net** | Software comparison directory positioning iLoveTools as a free alternative to Smallpdf and iLovePDF. | Submitted on Nov 13, 2026 | **In Review Queue** (Normal queue · Waiting 2 days for editorial approval) |
| **Peerlist** | Professional tech network & Project Spotlight community. | [peerlist.io/projects](https://peerlist.io/projects) | **Active & Published** |

---

## 2. Complete Catalog of 30 Live Tools

All tools run 100% locally inside the user's browser memory (zero server file uploads, no file size limits, zero watermarks):

### A. PDF Utilities (14 Tools)
1. **[Image to PDF Converter](https://www.ilovetools.org/image-to-pdf)** (`/image-to-pdf`): Converts single or multiple JPG, PNG, and WebP images into clean A4 PDF documents.
2. **[Google Docs to PDF](https://www.ilovetools.org/google-docs-to-pdf)** (`/google-docs-to-pdf`): Instant link-to-PDF export from Google Docs, Sheets, and Slides with zero server uploads.
3. **[Add Page Numbers to PDF](https://www.ilovetools.org/add-page-numbers-to-pdf)** (`/add-page-numbers-to-pdf`): Stamps customizable sequential page numbers ("Page X of Y", "X of Y", "1 / Y", or clean digits) with 6 corner/center placements and cover page skipping.
4. **[PDF to Excel Converter](https://www.ilovetools.org/pdf-to-excel)** (`/pdf-to-excel`): Extracts tables, rows, and numeric spreadsheets into Microsoft Excel (`.xlsx`).
5. **[PDF to PowerPoint](https://www.ilovetools.org/pdf-to-powerpoint)** (`/pdf-to-powerpoint`): Converts PDF slides and documents into editable presentations (`.pptx`).
6. **[Merge PDF](https://www.ilovetools.org/merge-pdf)** (`/merge-pdf`): Combines multiple PDF files into a single unified document with custom sequencing.
7. **[Split PDF](https://www.ilovetools.org/split-pdf)** (`/split-pdf`): Extracts individual pages or custom page ranges into a separate PDF.
8. **[Compress PDF](https://www.ilovetools.org/compress-pdf)** (`/compress-pdf`): Optimizes PDF streams and strips XML metadata using zlib compression.
9. **[Rotate PDF](https://www.ilovetools.org/rotate-pdf)** (`/rotate-pdf`): Rotates PDF pages 90°, 180°, or 270° with live preview.
10. **[Watermark PDF](https://www.ilovetools.org/watermark-pdf)** (`/watermark-pdf`): Injects custom text stamps and copyright watermarks across all pages.
11. **[Word to PDF](https://www.ilovetools.org/word-to-pdf)** (`/word-to-pdf`): Converts Word documents (`.docx`, `.doc`) into universal PDF format.
12. **[Excel to PDF](https://www.ilovetools.org/excel-to-pdf)** (`/excel-to-pdf`): Formats Excel spreadsheets into printable PDF files.
13. **[PowerPoint to PDF](https://www.ilovetools.org/powerpoint-to-pdf)** (`/powerpoint-to-pdf`): Converts presentation decks into distributable PDF documents.
14. **[PDF to JPG](https://www.ilovetools.org/pdf-to-jpg)** (`/pdf-to-jpg`): Renders PDF pages into high-resolution JPG images.

### B. Media & Image Utilities (8 Tools)
15. **[Compress Image to 50KB](https://www.ilovetools.org/compress-image-to-50kb)** (`/compress-image-to-50kb`): High-intent targeted reducer guaranteeing image file sizes strictly under 50KB for job portals, exam forms, visa and passport applications.
16. **[Compress Image to 100KB](https://www.ilovetools.org/compress-image-to-100kb)** (`/compress-image-to-100kb`): Pre-calibrated reducer guaranteeing photo sizes strictly under 100KB for visa forms, passport renewals, and official uploads.
17. **[Resize Image](https://www.ilovetools.org/resize-image)** (`/resize-image`): Resizes photo dimensions by exact pixels (W × H) or percentage scale (25%, 50%, 75%, 200%) with proportional aspect ratio lock.
18. **[Photo Compressor](https://www.ilovetools.org/compress-image)** (`/compress-image`): Lossless and lossy image compression preserving original formats (JPG, PNG, WebP) with no file size limits.
19. **[Crop Photo](https://www.ilovetools.org/crop-photo)** (`/crop-photo`): Exact pixel-dimension cropper with aspect-ratio presets (16:9, 1:1, 4:3, 9:16).
20. **[PNG to JPG](https://www.ilovetools.org/png-to-jpg)** (`/png-to-jpg`): Fast format converter with automatic white-background alpha handling.
21. **[JPG to PNG](https://www.ilovetools.org/jpg-to-png)** (`/jpg-to-png`): Converts JPEG photos into lossless PNG format.
22. **[HEIC to JPG](https://www.ilovetools.org/heic-to-jpg)** (`/heic-to-jpg`): Converts Apple iPhone camera photos (`.heic`) into standard JPGs.

### C. Video & Audio Utilities (4 Tools)
21. **[Video Compressor](https://www.ilovetools.org/compress-video)** (`/compress-video`): Compresses MP4/WebM videos directly in-browser with zero upload queues.
22. **[Crop Video](https://www.ilovetools.org/crop-video)** (`/crop-video`): Precision pixel and aspect ratio cropping for video clips.
23. **[Mute Video](https://www.ilovetools.org/mute-video)** (`/mute-video`): Strips audio tracks from video files in seconds with zero re-encoding loss.
24. **[Video to MP3](https://www.ilovetools.org/video-to-mp3)** (`/video-to-mp3`): Extracts audio tracks into standalone MP3 audio files.

### D. Productivity Utilities (4 Tools)
25. **[QR Code Generator](https://www.ilovetools.org/qr-code-generator)** (`/qr-code-generator`): Instant high-resolution static QR codes for links, Wi-Fi, and text with zero expiration.
26. **[Password Generator](https://www.ilovetools.org/password-generator)** (`/password-generator`): High-entropy cryptographically secure password generator via browser `window.crypto`.
27. **[Word Counter](https://www.ilovetools.org/word-counter)** (`/word-counter`): Real-time analysis of words, characters, sentences, paragraphs, and reading time.
28. **[Case Converter](https://www.ilovetools.org/case-converter)** (`/case-converter`): Instant text transformations (UPPERCASE, lowercase, Title Case, camelCase, snake_case).

---

## 3. Technology Stack & Client-Side Libraries

| Library / Framework | Version | Purpose in Project |
| :--- | :--- | :--- |
| **Next.js (App Router)** | `16.4.5` | Static Site Generation (SSG), pre-rendering all 38 static pages with instant edge prefetching. |
| **React** | `19.3.0` | Declarative UI layer, real-time client state, and responsive view layouts. |
| **TypeScript** | `5.x` | Strict type safety across all file processors, configurations, and schemas. |
| **Tailwind CSS** | `4.x` | Design system styling, responsive mobile switcher (1, 2, 3 columns), and crimson brand accents. |
| **`pdf-lib`** | `1.17.1` | In-memory PDF merging, splitting, watermarking, rotating, page numbering, and image-to-PDF embedding. |
| **`pako`** | `2.x` | High-speed zlib/Flate compression and stream optimization for PDF compression. |
| **`qrcode`** | `1.5.4` | Pure client-side static QR matrix generation. |
| **`canvas-confetti`** | `1.9.4` | Physics particle confetti celebrating task completions. |
| **`lucide-react`** | `1.69.0` | Accessible SVG icon suite across all tool interfaces. |
| **HTML5 Canvas 2D** | Browser Native | High-performance hardware-accelerated image decoding, format translation, cropping, and dimension resizing. |
| **Web Crypto API** | Browser Native | Secure pseudorandom number generator (CSPRNG) for cryptographic passwords. |

---

## 4. Active Marketing & Growth Platforms

| Channel | Role & Opportunity | Status |
| :--- | :--- | :--- |
| **Product Hunt** | Global tech community launch and maker discussions | Launch Kit Ready (`LAUNCH_BLITZ_PLAYBOOK.md`) |
| **Peerlist** | Tech professional network and project spotlight | Live & published |
| **Chrome Web Store** | Browser extension distribution channel for direct desktop installs. | Package: `iLoveTools-extension-v1.0.0.zip` (Manifest V3) | **Built & Ready for Store Submission** (`CHROME_EXTENSION_GUIDE.md`) |
| **AlternativeTo.net** | Direct software comparison vs Smallpdf and iLovePDF | Submission kit ready (`LAUNCH_BLITZ_PLAYBOOK.md`) |
| **Hacker News (Show HN)** | Technical launch targeting developers & privacy advocates | Ready to post (`LAUNCH_BLITZ_PLAYBOOK.md`) |
| **Reddit Distribution** | Community launches on r/InternetIsBeautiful, r/SideProject, r/privacy | Ready to post (`LAUNCH_BLITZ_PLAYBOOK.md`) |

---

*Last Updated: 2026-11-14*
