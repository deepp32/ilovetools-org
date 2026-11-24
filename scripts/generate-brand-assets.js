const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// 1. Scalable SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none">
  <defs>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF385C" />
      <stop offset="50%" stop-color="#E11D48" />
      <stop offset="100%" stop-color="#BE123C" />
    </linearGradient>
    <filter id="iconShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#881337" flood-opacity="0.25" />
    </filter>
  </defs>
  <rect width="48" height="48" rx="12" fill="url(#brandGrad)" />
  <path d="M24 37C23.2 37 11 27.5 11 18.2C11 13.8 14.6 10.2 19 10.2C21.6 10.2 23 11.4 24 13C25 11.4 26.4 10.2 29 10.2C33.4 10.2 37 13.8 37 18.2C37 27.5 24.8 37 24 37Z" fill="white" filter="url(#iconShadow)" />
</svg>`;

// Write SVGs
const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'src', 'app');

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgContent);
console.log('SVG icons written successfully.');

// 2. Pure Node.js PNG Generator
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
    const typeBuf = Buffer.from(type);
    const crcBuf = Buffer.alloc(4);
    
    const crcTable = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      crcTable[n] = c;
    }
    let crc = 0xffffffff;
    for (let i = 0; i < typeBuf.length; i++) {
      crc = crcTable[(crc ^ typeBuf[i]) & 0xff] ^ (crc >>> 8);
    }
    for (let i = 0; i < data.length; i++) {
      crc = crcTable[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Supersampled mathematical rendering of the iLoveTools emblem
function renderIconPixel(px, py, width, height) {
  let insideCardCount = 0;
  let insideHeartCount = 0;
  const samples = 4; // 4x4 supersampling = 16 samples per pixel for perfect anti-aliasing

  const radius = width * 0.25; // squircle corner radius
  const minX = 0, minY = 0, maxX = width, maxY = height;

  for (let sy = 0; sy < samples; sy++) {
    for (let sx = 0; sx < samples; sx++) {
      const subX = px + (sx + 0.5) / samples;
      const subY = py + (sy + 0.5) / samples;

      // Squircle test
      let inCard = false;
      const dx = Math.max(0, Math.max(radius - subX, subX - (width - radius)));
      const dy = Math.max(0, Math.max(radius - subY, subY - (height - radius)));
      if (dx * dx + dy * dy <= radius * radius) {
        inCard = true;
      }
      if (inCard) insideCardCount++;

      // Heart test: normalize to [-1.5, 1.5]
      const nx = ((subX / width) - 0.5) * 2.8;
      const ny = -(((subY / height) - 0.52) * 2.8) + 0.2; // oriented up, centered
      const a = nx * nx + ny * ny - 1;
      if (inCard && (a * a * a - nx * nx * ny * ny * ny) <= 0) {
        insideHeartCount++;
      }
    }
  }

  const total = samples * samples;
  const cardAlpha = insideCardCount / total;
  const heartAlpha = insideHeartCount / total;

  if (cardAlpha === 0) {
    return [0, 0, 0, 0]; // Transparent
  }

  // Red gradient calculation
  const t = (px + py) / (width + height);
  const rRed = Math.round(255 * (1 - t) + 190 * t);
  const gRed = Math.round(56 * (1 - t) + 18 * t);
  const bRed = Math.round(92 * (1 - t) + 60 * t);

  // Blend white heart over red background
  if (heartAlpha > 0) {
    const finalR = Math.round(rRed * (1 - heartAlpha) + 255 * heartAlpha);
    const finalG = Math.round(gRed * (1 - heartAlpha) + 255 * heartAlpha);
    const finalB = Math.round(bRed * (1 - heartAlpha) + 255 * heartAlpha);
    return [finalR, finalG, finalB, Math.round(cardAlpha * 255)];
  }

  return [rRed, gRed, bRed, Math.round(cardAlpha * 255)];
}

console.log('Rendering PNG icons (48x48, 180x180, 192x192, 512x512)...');

const png48 = createPng(48, 48, renderIconPixel);
const png180 = createPng(180, 180, renderIconPixel);
const png192 = createPng(192, 192, renderIconPixel);
const png512 = createPng(512, 512, renderIconPixel);

fs.writeFileSync(path.join(publicDir, 'icon-48.png'), png48);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), png192);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
fs.writeFileSync(path.join(publicDir, 'logo.png'), png512);

// Create favicon.ico containing 48x48 PNG (standard modern ICO format supported by all browsers)
function createIco(pngBuffer, width, height) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(1, 4); // 1 image

  const dirEntry = Buffer.alloc(16);
  dirEntry[0] = width >= 256 ? 0 : width;
  dirEntry[1] = height >= 256 ? 0 : height;
  dirEntry[2] = 0; // Color count
  dirEntry[3] = 0; // Reserved
  dirEntry.writeUInt16LE(1, 4); // Color planes
  dirEntry.writeUInt16LE(32, 6); // Bits per pixel
  dirEntry.writeUInt32LE(pngBuffer.length, 8); // Size of image data
  dirEntry.writeUInt32LE(22, 12); // Offset to image data (6 + 16 = 22)

  return Buffer.concat([header, dirEntry, pngBuffer]);
}

const ico = createIco(png48, 48, 48);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
fs.writeFileSync(path.join(appDir, 'favicon.ico'), ico);

console.log('All brand assets successfully generated!');
