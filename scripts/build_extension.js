const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT_DIR = path.join(__dirname, '..');
const EXT_DIR = path.join(ROOT_DIR, 'extension');
const ICONS_DIR = path.join(EXT_DIR, 'icons');

if (!fs.existsSync(EXT_DIR)) fs.mkdirSync(EXT_DIR, { recursive: true });
if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR, { recursive: true });

// 1. Pure Node.js PNG Generator (from generate-brand-assets.js)
function createPng(width, height, getPixel) {
  const rowStride = width * 4 + 1;
  const raw = Buffer.alloc(height * rowStride);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    raw[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  const idatData = zlib.deflateSync(raw);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crc = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  function crc32(buf) {
    let table = crc32.table;
    if (!table) {
      table = crc32.table = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) {
          c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
        }
        table[i] = c;
      }
    }
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // ColorType: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Draw crisp Crimson Heart Brand Icon
function getIconPixel(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;
  const rad = 0.22;
  const dCorner = Math.max(
    Math.max(rad - nx, 0, nx - (1 - rad)),
    Math.max(rad - ny, 0, ny - (1 - rad))
  );

  let alpha = 1;
  if (dCorner > 0) {
    const dist = Math.hypot(
      Math.max(rad - nx, 0, nx - (1 - rad)),
      Math.max(rad - ny, 0, ny - (1 - rad))
    );
    if (dist > rad) alpha = 0;
    else alpha = Math.min(1, (rad - dist) * w * 1.5);
  }
  if (alpha <= 0) return [0, 0, 0, 0];

  const t = (nx + ny) / 2;
  const rBg = Math.round(255 - t * 65);
  const gBg = Math.round(56 - t * 37);
  const bBg = Math.round(92 - t * 32);

  // Heart formula
  const hx = (nx - 0.5) * 2.2;
  const hy = -(ny - 0.52) * 2.2;
  const hDist = Math.pow(hx * hx + hy * hy - 0.7, 3) - hx * hx * Math.pow(hy, 3);

  if (hDist < 0.05) {
    const heartAlpha = Math.min(1, Math.max(0, -hDist * 18));
    const r = Math.round(255 * heartAlpha + rBg * (1 - heartAlpha));
    const g = Math.round(255 * heartAlpha + gBg * (1 - heartAlpha));
    const b = Math.round(255 * heartAlpha + bBg * (1 - heartAlpha));
    return [r, g, b, Math.round(alpha * 255)];
  }

  return [rBg, gBg, bBg, Math.round(alpha * 255)];
}

// Generate icons
const sizes = [16, 32, 48, 128];
for (const sz of sizes) {
  const png = createPng(sz, sz, getIconPixel);
  fs.writeFileSync(path.join(ICONS_DIR, `icon-${sz}.png`), png);
  console.log(`Generated icon-${sz}.png`);
}

// 2. Extract tools from tools.ts
const toolsFile = path.join(ROOT_DIR, 'src/config/tools.ts');
const toolsContent = fs.readFileSync(toolsFile, 'utf8');
const toolList = [];

const starterToolsText = toolsContent.slice(toolsContent.indexOf('export const STARTER_TOOLS'));
const blocks = starterToolsText.split(/\n\s*\{\s*\n\s*id:\s*'/).slice(1);

for (const block of blocks) {
  const idMatch = block.match(/^([^']+)'/);
  const slugMatch = block.match(/slug:\s*'([^']+)'/);
  const titleMatch = block.match(/title:\s*'([^']+)'/);
  const descMatch = block.match(/(?:shortDesc|description):\s*'([^']+)'/);
  const catMatch = block.match(/category:\s*'([^']+)'/);

  if (idMatch && titleMatch) {
    toolList.push({
      id: idMatch[1],
      slug: slugMatch ? slugMatch[1] : idMatch[1],
      title: titleMatch[1],
      desc: descMatch ? descMatch[1] : 'Fast, 100% private in-browser utility.',
      category: catMatch ? catMatch[1] : 'utility'
    });
  }
}

console.log(`Extracted ${toolList.length} tools for Chrome extension.`);

// 3. Manifest V3
const manifest = {
  manifest_version: 3,
  name: "iLoveTools — 100% Private In-Browser File Utilities",
  short_name: "iLoveTools",
  version: "1.0.0",
  description: "28+ free in-browser file utilities: Merge & compress PDFs, convert images (JPG, PNG, WebP, HEIC), resize photos, and more with zero server uploads.",
  icons: {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  action: {
    default_popup: "popup.html",
    default_title: "iLoveTools — Free Private Utilities",
    default_icon: {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },
  background: {
    service_worker: "background.js"
  },
  permissions: [
    "contextMenus"
  ],
  homepage_url: "https://www.ilovetools.org"
};
fs.writeFileSync(path.join(EXT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

// 4. Background Service Worker (Context Menus)
const backgroundJs = `
chrome.runtime.onInstalled.addListener(() => {
  // Context menu for images
  chrome.contextMenus.create({
    id: 'ilovetools-compress-image',
    title: 'Compress image with iLoveTools',
    contexts: ['image']
  });

  chrome.contextMenus.create({
    id: 'ilovetools-resize-image',
    title: 'Resize image pixels with iLoveTools',
    contexts: ['image']
  });

  // Context menu for links (PDFs)
  chrome.contextMenus.create({
    id: 'ilovetools-pdf-tools',
    title: 'Open with iLoveTools PDF Utilities',
    contexts: ['link']
  });

  // General selection
  chrome.contextMenus.create({
    id: 'ilovetools-word-counter',
    title: 'Count words with iLoveTools',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  let url = 'https://www.ilovetools.org';
  if (info.menuItemId === 'ilovetools-compress-image') {
    url = 'https://www.ilovetools.org/compress-image';
  } else if (info.menuItemId === 'ilovetools-resize-image') {
    url = 'https://www.ilovetools.org/resize-image';
  } else if (info.menuItemId === 'ilovetools-pdf-tools') {
    url = 'https://www.ilovetools.org/merge-pdf';
  } else if (info.menuItemId === 'ilovetools-word-counter') {
    url = 'https://www.ilovetools.org/word-counter';
  }
  chrome.tabs.create({ url });
});
`;
fs.writeFileSync(path.join(EXT_DIR, 'background.js'), backgroundJs.trim());

// 5. Popup HTML
const popupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iLoveTools</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <header class="app-header">
    <div class="brand">
      <img src="icons/icon-32.png" alt="iLoveTools Logo" class="brand-logo">
      <div class="brand-text">
        <span class="brand-title">iLoveTools</span>
        <span class="badge">100% Private</span>
      </div>
    </div>
    <a href="https://www.ilovetools.org" target="_blank" class="web-link" title="Open full website">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>
  </header>

  <div class="search-box">
    <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input type="text" id="searchInput" placeholder="Search 28+ in-browser tools..." autocomplete="off">
  </div>

  <div class="category-tabs" id="categoryTabs">
    <button class="tab active" data-cat="all">All (28)</button>
    <button class="tab" data-cat="pdf">PDF</button>
    <button class="tab" data-cat="image">Image</button>
    <button class="tab" data-cat="video">Video</button>
    <button class="tab" data-cat="productivity">Utility</button>
  </div>

  <div class="quick-widget" id="quickWidget">
    <div class="widget-header">
      <span>⚡ Quick Generator</span>
      <button id="genPassBtn" class="widget-btn">Generate Password</button>
    </div>
    <div class="widget-result" id="passResult" style="display:none;">
      <code id="passText"></code>
      <button id="copyPassBtn" class="copy-btn">Copy</button>
    </div>
  </div>

  <main class="tools-grid" id="toolsGrid">
    <!-- Populated by popup.js -->
  </main>

  <footer class="app-footer">
    <span>🔒 Files never leave your device memory</span>
  </footer>

  <script src="popup.js"></script>
</body>
</html>`;
fs.writeFileSync(path.join(EXT_DIR, 'popup.html'), popupHtml);

// 6. Popup CSS
const popupCss = `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

body {
  width: 380px;
  max-height: 570px;
  background-color: #0d0e12;
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #13151b;
  border-bottom: 1px solid #1f232e;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo {
  width: 24px;
  height: 24px;
  border-radius: 6px;
}

.brand-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.brand-title {
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.3px;
  color: #ffffff;
}

.badge {
  background: rgba(225, 29, 72, 0.15);
  color: #fb7185;
  border: 1px solid rgba(225, 29, 72, 0.3);
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 9999px;
}

.web-link {
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.web-link:hover {
  color: #ffffff;
  background: #1f232e;
}

.search-box {
  position: relative;
  padding: 10px 14px 6px;
}

.search-icon {
  position: absolute;
  left: 24px;
  top: 19px;
  color: #64748b;
}

#searchInput {
  width: 100%;
  padding: 8px 12px 8px 32px;
  background-color: #171922;
  border: 1px solid #272c3b;
  border-radius: 8px;
  color: #f8fafc;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s ease;
}

#searchInput:focus {
  border-color: #e11d48;
}

#searchInput::placeholder {
  color: #64748b;
}

.category-tabs {
  display: flex;
  gap: 5px;
  padding: 6px 14px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  background: none;
  border: 1px solid transparent;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.tab:hover {
  color: #f1f5f9;
  background-color: #1b1e28;
}

.tab.active {
  background-color: #e11d48;
  color: #ffffff;
}

.quick-widget {
  margin: 4px 14px 6px;
  background: #151821;
  border: 1px dashed #282f42;
  border-radius: 8px;
  padding: 8px 10px;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #cbd5e1;
  font-weight: 600;
}

.widget-btn {
  background: #232838;
  color: #fb7185;
  border: 1px solid #374151;
  border-radius: 5px;
  font-size: 11px;
  padding: 3px 8px;
  cursor: pointer;
  font-weight: 600;
}

.widget-btn:hover {
  background: #e11d48;
  color: #fff;
}

.widget-result {
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0f1117;
  padding: 4px 8px;
  border-radius: 6px;
}

.widget-result code {
  font-family: monospace;
  font-size: 12px;
  color: #4ade80;
  word-break: break-all;
}

.copy-btn {
  background: #27272a;
  color: #fff;
  border: none;
  padding: 2px 7px;
  font-size: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.tools-grid {
  flex: 1;
  overflow-y: auto;
  padding: 6px 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 340px;
}

.tools-grid::-webkit-scrollbar {
  width: 5px;
}

.tools-grid::-webkit-scrollbar-track {
  background: transparent;
}

.tools-grid::-webkit-scrollbar-thumb {
  background: #272c3b;
  border-radius: 4px;
}

.tool-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #141720;
  border: 1px solid #1f2432;
  border-radius: 8px;
  padding: 9px 12px;
  text-decoration: none;
  transition: all 0.15s ease;
  cursor: pointer;
}

.tool-card:hover {
  background: #1b1f2b;
  border-color: #e11d48;
  transform: translateY(-1px);
}

.tool-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tool-title {
  font-size: 13px;
  font-weight: 600;
  color: #f8fafc;
}

.tool-desc {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tool-arrow {
  color: #64748b;
  margin-left: 8px;
  transition: color 0.15s ease;
}

.tool-card:hover .tool-arrow {
  color: #fb7185;
}

.no-results {
  text-align: center;
  padding: 30px 10px;
  color: #64748b;
  font-size: 12px;
}

.app-footer {
  padding: 8px 14px;
  background-color: #0e1015;
  border-top: 1px solid #1a1e28;
  text-align: center;
  font-size: 10.5px;
  color: #64748b;
}
`;
fs.writeFileSync(path.join(EXT_DIR, 'popup.css'), popupCss);

// 7. Popup JS
const popupJs = `
const TOOLS = ${JSON.stringify(toolList, null, 2)};

const toolsGrid = document.getElementById('toolsGrid');
const searchInput = document.getElementById('searchInput');
const tabs = document.querySelectorAll('.tab');
let activeCategory = 'all';

function renderTools(filterText = '', category = 'all') {
  toolsGrid.innerHTML = '';
  const search = filterText.toLowerCase().trim();

  const filtered = TOOLS.filter(t => {
    const matchesCat = (category === 'all' || t.category.toLowerCase().includes(category));
    const matchesSearch = t.title.toLowerCase().includes(search) || t.desc.toLowerCase().includes(search) || t.slug.toLowerCase().includes(search);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    toolsGrid.innerHTML = '<div class="no-results">No matching tools found. Try another search.</div>';
    return;
  }

  filtered.forEach(t => {
    const card = document.createElement('a');
    card.className = 'tool-card';
    card.href = 'https://www.ilovetools.org/' + t.slug;
    card.target = '_blank';
    card.innerHTML = \`
      <div class="tool-info">
        <span class="tool-title">\${t.title}</span>
        <span class="tool-desc">\${t.desc}</span>
      </div>
      <svg class="tool-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    \`;
    card.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: card.href });
    });
    toolsGrid.appendChild(card);
  });
}

// Search filtering
searchInput.addEventListener('input', (e) => {
  renderTools(e.target.value, activeCategory);
});

// Category filtering
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCategory = tab.dataset.cat;
    renderTools(searchInput.value, activeCategory);
  });
});

// Quick password generator
const genBtn = document.getElementById('genPassBtn');
const passResult = document.getElementById('passResult');
const passText = document.getElementById('passText');
const copyBtn = document.getElementById('copyPassBtn');

genBtn.addEventListener('click', () => {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%&*+?';
  let pass = '';
  const array = new Uint8Array(18);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < 18; i++) {
    pass += chars[array[i] % chars.length];
  }
  passText.textContent = pass;
  passResult.style.display = 'flex';
  copyBtn.textContent = 'Copy';
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(passText.textContent).then(() => {
    copyBtn.textContent = 'Copied!';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
  });
});

// Initial render
renderTools();
`;
fs.writeFileSync(path.join(EXT_DIR, 'popup.js'), popupJs);

console.log('✅ Chrome extension successfully built in ./extension');

