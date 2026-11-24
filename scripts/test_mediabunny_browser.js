const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Test if mediabunny can bundle and run in browser
  await page.goto('https://omnitools-web-deep-ec48.vercel.app/compress-video', { waitUntil: 'domcontentloaded' });

  console.log('Testing browser capabilities for mediabunny...');
  const caps = await page.evaluate(async () => {
    return {
      hasVideoDecoder: typeof VideoDecoder !== 'undefined',
      hasVideoEncoder: typeof VideoEncoder !== 'undefined',
      userAgent: navigator.userAgent
    };
  });
  console.log('Capabilities in Playwright Chromium:', caps);

  await browser.close();
})();
