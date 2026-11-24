
const TOOLS = [
  {
    "id": "image-to-pdf",
    "slug": "image-to-pdf",
    "title": "Image to PDF Converter",
    "desc": "Convert single or multiple JPG and PNG photos into a clean, printable PDF document.",
    "category": "pdf"
  },
  {
    "id": "pdf-to-excel",
    "slug": "pdf-to-excel",
    "title": "PDF to Excel Converter",
    "desc": "Extract tables and spreadsheet data into editable Microsoft Excel (.xlsx) workbooks.",
    "category": "convert"
  },
  {
    "id": "pdf-to-powerpoint",
    "slug": "pdf-to-powerpoint",
    "title": "PDF to PowerPoint Converter",
    "desc": "Convert PDF presentation slide decks into fully editable PowerPoint (.pptx) slides.",
    "category": "convert"
  },
  {
    "id": "pdf-to-word",
    "slug": "pdf-to-word",
    "title": "PDF to Word Converter",
    "desc": "Turn PDF documents into editable Word (.docx) files with paragraphs and fonts preserved.",
    "category": "convert"
  },
  {
    "id": "png-to-jpg",
    "slug": "png-to-jpg",
    "title": "PNG to JPG Converter",
    "desc": "Convert PNG images to standard high-compatibility JPG format with clean white background.",
    "category": "convert"
  },
  {
    "id": "jpg-to-png",
    "slug": "jpg-to-png",
    "title": "JPG to PNG Converter",
    "desc": "Convert JPG photos to lossless PNG format to prevent compression artifacts.",
    "category": "convert"
  },
  {
    "id": "compress-image",
    "slug": "compress-image",
    "title": "Image Compressor",
    "desc": "Shrink JPG, PNG, and WebP images by up to 85% while preserving visual clarity.",
    "category": "compress"
  },
  {
    "id": "compress-image-to-50kb",
    "slug": "compress-image-to-50kb",
    "title": "Compress Image to 50KB",
    "desc": "Shrink photos to strictly under 50KB for job portals, passports, and visa applications.",
    "category": "compress"
  },
  {
    "id": "compress-image-to-100kb",
    "slug": "compress-image-to-100kb",
    "title": "Compress Image to 100KB",
    "desc": "Shrink photos to strictly under 100KB for visa portals, passports, and online applications.",
    "category": "compress"
  },
  {
    "id": "crop-photo",
    "slug": "crop-photo",
    "title": "Photo Crop & Pixel Resizer",
    "desc": "Crop, frame, and resize photos to exact pixel dimensions or standard social aspect ratios.",
    "category": "edit"
  },
  {
    "id": "compress-video",
    "slug": "compress-video",
    "title": "Video Compressor",
    "desc": "Reduce MP4 and WebM video file size for Discord, email, and social sharing without watermarks.",
    "category": "compress"
  },
  {
    "id": "heic-to-jpg",
    "slug": "heic-to-jpg",
    "title": "HEIC to JPG Converter",
    "desc": "Convert Apple iPhone HEIC and HEIF photos to universally compatible JPG format.",
    "category": "convert"
  },
  {
    "id": "word-to-pdf",
    "slug": "word-to-pdf",
    "title": "Word to PDF Converter",
    "desc": "Convert Microsoft Word (.docx, .doc) documents into clean, printable PDF documents.",
    "category": "pdf"
  },
  {
    "id": "video-to-mp3",
    "slug": "video-to-mp3",
    "title": "Video to MP3 Converter",
    "desc": "Extract high-quality MP3 audio tracks from MP4, WebM, and MOV video recordings.",
    "category": "media"
  },
  {
    "id": "compress-pdf",
    "slug": "compress-pdf",
    "title": "PDF Compressor",
    "desc": "Reduce large PDF document sizes for faster email delivery and upload portals.",
    "category": "compress"
  },
  {
    "id": "crop-video",
    "slug": "crop-video",
    "title": "Video Crop & Pixel Resizer",
    "desc": "Crop, reposition, and resize videos to exact aspect ratios for YouTube, Reels, and TikTok.",
    "category": "edit"
  },
  {
    "id": "merge-pdf",
    "slug": "merge-pdf",
    "title": "Merge PDF",
    "desc": "Combine multiple PDF documents, receipts, and scans into one unified document.",
    "category": "pdf"
  },
  {
    "id": "split-pdf",
    "slug": "split-pdf",
    "title": "Split PDF",
    "desc": "Extract specific pages or page ranges from large multi-page PDF documents.",
    "category": "pdf"
  },
  {
    "id": "rotate-pdf",
    "slug": "rotate-pdf",
    "title": "Rotate PDF",
    "desc": "Permanently rotate upside down or sideways PDF pages by 90°, 180°, or 270°.",
    "category": "pdf"
  },
  {
    "id": "pdf-to-jpg",
    "slug": "pdf-to-jpg",
    "title": "PDF to JPG Converter",
    "desc": "Convert PDF pages into high-resolution JPG photos for presentations and sharing.",
    "category": "convert"
  },
  {
    "id": "video-to-gif",
    "slug": "video-to-gif",
    "title": "Video to GIF Converter",
    "desc": "Turn short video clips into animated, looping GIFs for memes, Slack, and presentations.",
    "category": "media"
  },
  {
    "id": "mute-video",
    "slug": "mute-video",
    "title": "Remove Audio",
    "desc": "Mute and remove unwanted audio tracks, background noise, or speech from video files.",
    "category": "media"
  },
  {
    "id": "watermark-pdf",
    "slug": "watermark-pdf",
    "title": "Watermark PDF",
    "desc": "Add customizable confidentiality stamps, copyright text, or draft watermarks to PDF pages.",
    "category": "pdf"
  },
  {
    "id": "qr-code-generator",
    "slug": "qr-code-generator",
    "title": "Link to QR Code Generator",
    "desc": "Generate clean, high-resolution QR codes for websites, restaurant menus, and Wi-Fi networks.",
    "category": "productivity"
  },
  {
    "id": "password-generator",
    "slug": "password-generator",
    "title": "Password Generator",
    "desc": "Generate cryptographically strong, random passwords to protect online accounts.",
    "category": "productivity"
  },
  {
    "id": "word-counter",
    "slug": "word-counter",
    "title": "Word & Character Counter",
    "desc": "Count words, characters, sentences, and estimated reading time in real time.",
    "category": "productivity"
  },
  {
    "id": "case-converter",
    "slug": "case-converter",
    "title": "Case Converter",
    "desc": "Convert text between UPPERCASE, lowercase, Title Case, Sentence case, and camelCase.",
    "category": "productivity"
  },
  {
    "id": "google-docs-to-pdf",
    "slug": "google-docs-to-pdf",
    "title": "Google Docs to PDF Converter",
    "desc": "Paste any Google Docs link to instantly download a clean, formatted PDF document.",
    "category": "pdf"
  },
  {
    "id": "resize-image",
    "slug": "resize-image",
    "title": "Resize Image",
    "desc": "Resize photo dimensions by pixels (width/height) or percentage with aspect ratio lock.",
    "category": "edit"
  },
  {
    "id": "add-page-numbers-to-pdf",
    "slug": "add-page-numbers-to-pdf",
    "title": "Add Page Numbers to PDF",
    "desc": "Stamp customizable page numbers on every page of your PDF with zero server upload.",
    "category": "pdf"
  }
];

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
    card.innerHTML = `
      <div class="tool-info">
        <span class="tool-title">${t.title}</span>
        <span class="tool-desc">${t.desc}</span>
      </div>
      <svg class="tool-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;
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
